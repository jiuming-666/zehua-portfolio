"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

/**
 * 串口调试助手。
 * 只用浏览器 Web Serial API，在本机完成选口、开关和收发。
 * 数据不经过服务器。
 */

type Parity = "none" | "even" | "odd";
type DataBits = 7 | 8;
type StopBits = 1 | 2;
type ViewMode = "ascii" | "hex";
type LineEnding = "none" | "cr" | "lf" | "crlf";
type Direction = "rx" | "tx";

type SerialPortInfo = {
  usbVendorId?: number;
  usbProductId?: number;
};

type SerialOptions = {
  baudRate: number;
  dataBits: DataBits;
  stopBits: StopBits;
  parity: Parity;
  bufferSize: number;
  flowControl: "none";
};

type SerialPort = {
  open: (options: SerialOptions) => Promise<void>;
  close: () => Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
  getInfo: () => SerialPortInfo;
};

type Serial = {
  getPorts: () => Promise<SerialPort[]>;
  requestPort: () => Promise<SerialPort>;
  addEventListener: (type: "connect" | "disconnect", listener: () => void) => void;
  removeEventListener: (type: "connect" | "disconnect", listener: () => void) => void;
};

type LogEntry = {
  id: number;
  dir: Direction;
  time: string;
  bytes: Uint8Array;
};

type SendRow = {
  id: number;
  text: string;
  /** 这条发出之后、下一条发出之前的等待 */
  gap: number;
};

type Session = {
  port: SerialPort;
  reader: ReadableStreamDefaultReader<Uint8Array> | null;
  keepReading: boolean;
  stopping: boolean;
  closed: Promise<void>;
  stopDone: Promise<void>;
};

const BAUD_RATES = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600];
/**
 * 最小 10ms：浏览器定时器大约 4ms 才稳，再短停止和接收刷新会挤在一起。
 * 默认 50ms：短指令在 115200 下传完大约几毫秒，50ms 够模块处理完再发下一条。
 */
const MIN_ROW_GAP_MS = 10;
const DEFAULT_ROW_GAP_MS = 50;
const MAX_LOG_ENTRIES = 500;
const MAX_LOG_BYTES = 200_000;
const RX_FLUSH_MS = 50;

const VENDORS: Record<number, string> = {
  0x1a86: "沁恒 CH34x",
  0x10c4: "CP210x",
  0x0403: "FTDI",
  0x067b: "Prolific",
  0x2341: "Arduino",
  0x0483: "STM32",
  0x303a: "Espressif",
  0x2e8a: "树莓派",
};

const ENDING_BYTES: Record<LineEnding, number[]> = {
  none: [],
  cr: [0x0d],
  lf: [0x0a],
  crlf: [0x0d, 0x0a],
};

function getSerial(): Serial | null {
  if (typeof navigator === "undefined" || !("serial" in navigator)) return null;
  return (navigator as Navigator & { serial: Serial }).serial;
}

function explain(error: unknown): string {
  const name = error instanceof DOMException ? error.name : error instanceof Error ? error.name : "";
  if (name === "NotFoundError") return "没有选中端口";
  if (name === "NetworkError") return "端口打不开：可能被其他程序占用，或设备已经断开";
  if (name === "InvalidStateError") return "端口状态异常，请关闭后重新打开";
  if (name === "SecurityError") return "浏览器没有允许访问串口";
  return "串口操作失败";
}

function formatTime(date: Date): string {
  const pad = (value: number, width = 2) => value.toString().padStart(width, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
}

function hexOf(bytes: Uint8Array): string {
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    parts.push(bytes[i].toString(16).padStart(2, "0").toUpperCase());
  }
  return parts.join(" ");
}

function asciiOf(bytes: Uint8Array): string {
  return new TextDecoder("utf-8", { fatal: false })
    .decode(bytes)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
}

/** 容忍空格、逗号和 0x 前缀。非法字符或奇数个半字节返回 null。 */
function parseHex(input: string): Uint8Array | null {
  const withoutPrefix = input.replace(/0x/gi, "");
  if (/[^0-9a-fA-F\s,]/.test(withoutPrefix)) return null;
  const clean = withoutPrefix.replace(/[\s,]/g, "");
  if (clean.length % 2 !== 0) return null;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function encodePayload(text: string, mode: ViewMode, lineEnding: LineEnding): Uint8Array | null {
  const body = mode === "hex" ? parseHex(text) : new TextEncoder().encode(text);
  if (!body) return null;
  return withEnding(body, lineEnding);
}

function withEnding(body: Uint8Array, ending: LineEnding): Uint8Array {
  const extra = ENDING_BYTES[ending];
  if (!extra.length) return body;
  const out = new Uint8Array(body.length + extra.length);
  out.set(body);
  extra.forEach((byte, index) => {
    out[body.length + index] = byte;
  });
  return out;
}

function mergeBytes(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    merged.set(part, offset);
    offset += part.length;
  }
  return merged;
}

function trimLog(entries: LogEntry[]): LogEntry[] {
  let bytes = 0;
  let start = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    const count = entries.length - i;
    if (i < entries.length - 1 && (count > MAX_LOG_ENTRIES || bytes >= MAX_LOG_BYTES)) {
      start = i + 1;
      break;
    }
    bytes += entries[i].bytes.length;
  }
  return start === 0 ? entries : entries.slice(start);
}

function portInfo(port: SerialPort): SerialPortInfo {
  try {
    return port.getInfo();
  } catch {
    return {};
  }
}

function sameDevice(a: SerialPort, b: SerialPort): boolean {
  const left = portInfo(a);
  const right = portInfo(b);
  return left.usbVendorId === right.usbVendorId && left.usbProductId === right.usbProductId;
}

function portLabel(port: SerialPort, index: number, all: SerialPort[]): string {
  const info = portInfo(port);
  let base = `串口 ${index + 1}`;
  if (info.usbVendorId != null) {
    const vid = info.usbVendorId.toString(16).padStart(4, "0").toUpperCase();
    const pid = (info.usbProductId ?? 0).toString(16).padStart(4, "0").toUpperCase();
    const name = VENDORS[info.usbVendorId];
    base = name ? `${name} ${vid}:${pid}` : `USB ${vid}:${pid}`;
  }
  const twins = all.filter((item) => sameDevice(item, port));
  if (twins.length < 2) return base;
  const nth = all.slice(0, index + 1).filter((item) => sameDevice(item, port)).length;
  return `${base} #${nth}`;
}

function frameText(baudRate: number, dataBits: DataBits, parity: Parity, stopBits: StopBits): string {
  const mark = parity === "even" ? "E" : parity === "odd" ? "O" : "N";
  return `${baudRate} ${dataBits}${mark}${stopBits}`;
}

const fieldClass =
  "rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-1.5 text-sm text-zinc-100 outline-none focus:border-accent/50 disabled:cursor-not-allowed disabled:opacity-40";

const quietButtonClass =
  "rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-40";

/** 串口调试助手：选口、帧格式、ASCII/HEX 收发 */
export default function SerialAssistant() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [ports, setPorts] = useState<SerialPort[]>([]);
  const [selected, setSelected] = useState(-1);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [baudRate, setBaudRate] = useState(115200);
  const [dataBits, setDataBits] = useState<DataBits>(8);
  const [stopBits, setStopBits] = useState<StopBits>(1);
  const [parity, setParity] = useState<Parity>("none");
  const [view, setView] = useState<ViewMode>("ascii");
  const [showTime, setShowTime] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [rxBytes, setRxBytes] = useState(0);
  const [txBytes, setTxBytes] = useState(0);
  const [draft, setDraft] = useState("");
  const [ending, setEnding] = useState<LineEnding>("none");
  const [sendMode, setSendMode] = useState<ViewMode>("ascii");
  const [expanded, setExpanded] = useState(false);
  const [rows, setRows] = useState<SendRow[]>([
    { id: 1, text: "", gap: DEFAULT_ROW_GAP_MS },
    { id: 2, text: "", gap: DEFAULT_ROW_GAP_MS },
  ]);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [sequenceRunning, setSequenceRunning] = useState(false);
  const [loopRound, setLoopRound] = useState(0);
  const [error, setError] = useState("");
  const [sendError, setSendError] = useState("");

  const alive = useRef(true);
  const sessionRef = useRef<Session | null>(null);
  const portsRef = useRef<SerialPort[]>([]);
  const selectedRef = useRef(-1);
  const idRef = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  const rxPending = useRef<Uint8Array[]>([]);
  const rxTimer = useRef<number | null>(null);
  const sendQueue = useRef<Promise<void>>(Promise.resolve());
  const rowSeed = useRef(2);
  const loopStopRef = useRef(false);
  const runningRef = useRef(false);
  const expandedRef = useRef(false);
  const rowsRef = useRef(rows);
  const loopEnabledRef = useRef(false);
  const loopCountRef = useRef(0);
  const sendModeRef = useRef<ViewMode>("ascii");
  const endingRef = useRef<LineEnding>("none");
  const draftRef = useRef("");

  expandedRef.current = expanded;
  rowsRef.current = rows;
  loopEnabledRef.current = loopEnabled;
  loopCountRef.current = loopCount;
  sendModeRef.current = sendMode;
  endingRef.current = ending;
  draftRef.current = draft;

  function applyPorts(list: SerialPort[], prefer?: SerialPort) {
    const openPort = sessionRef.current?.port;
    const merged = openPort && !list.includes(openPort) ? [openPort, ...list] : list;
    const previous = selectedRef.current >= 0 ? portsRef.current[selectedRef.current] : undefined;
    const target = prefer ?? openPort ?? previous;
    let index = target ? merged.indexOf(target) : -1;
    if (index < 0) index = merged.length ? 0 : -1;
    portsRef.current = merged;
    selectedRef.current = index;
    setPorts(merged);
    setSelected(index);
  }

  function pushLog(dir: Direction, bytes: Uint8Array) {
    if (!bytes.length || !alive.current) return;
    const entry: LogEntry = {
      id: ++idRef.current,
      dir,
      time: formatTime(new Date()),
      bytes,
    };
    setLogs((prev) => trimLog([...prev, entry]));
    if (dir === "rx") setRxBytes((count) => count + bytes.length);
    else setTxBytes((count) => count + bytes.length);
  }

  function flushRx() {
    if (rxTimer.current != null) {
      window.clearTimeout(rxTimer.current);
      rxTimer.current = null;
    }
    const parts = rxPending.current;
    rxPending.current = [];
    if (parts.length) pushLog("rx", mergeBytes(parts));
  }

  function enqueueRx(chunk: Uint8Array) {
    rxPending.current.push(chunk);
    if (rxTimer.current == null) {
      rxTimer.current = window.setTimeout(flushRx, RX_FLUSH_MS);
    }
  }

  async function refreshPorts() {
    const serial = getSerial();
    if (!serial) return;
    setRefreshing(true);
    try {
      applyPorts(await serial.getPorts());
    } catch (err) {
      if (alive.current) setError(explain(err));
    } finally {
      if (alive.current) setRefreshing(false);
    }
  }

  async function readUntilClosed(session: Session) {
    const { port } = session;
    try {
      while (port.readable && session.keepReading) {
        let reader: ReadableStreamDefaultReader<Uint8Array>;
        try {
          reader = port.readable.getReader();
        } catch {
          break;
        }
        session.reader = reader;
        if (!session.keepReading) {
          reader.releaseLock();
          session.reader = null;
          break;
        }
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value?.byteLength) enqueueRx(new Uint8Array(value));
          }
        } catch (err) {
          if (session.keepReading && !port.readable && alive.current) {
            setError(explain(err));
          }
        } finally {
          reader.releaseLock();
          if (session.reader === reader) session.reader = null;
        }
      }
    } finally {
      flushRx();
    }
  }

  /** 先等发送结束，再停读，最后关端口，避免读写锁互相卡住。 */
  function shutdown(session: Session) {
    loopStopRef.current = true;
    if (session.stopping) return session.stopDone;
    session.stopping = true;
    session.keepReading = false;
    session.stopDone = (async () => {
      await sendQueue.current.catch(() => undefined);
      try {
        await session.reader?.cancel();
      } catch {
        // 读取循环会在取消后自行释放锁
      }
      try {
        await session.closed;
      } catch {
        // 读取循环失败时仍然继续关端口
      }
      try {
        await session.port.close();
      } catch {
        // 设备已经拔掉时，端口会自己失效
      }
      if (sessionRef.current === session) sessionRef.current = null;
      if (alive.current) setOpen(false);
    })();
    return session.stopDone;
  }

  async function closePort() {
    const session = sessionRef.current;
    if (!session) return;
    setBusy(true);
    try {
      await shutdown(session);
    } finally {
      if (alive.current) setBusy(false);
    }
  }

  async function openPort() {
    const serial = getSerial();
    if (!serial) {
      setSupported(false);
      return;
    }
    const port = portsRef.current[selectedRef.current];
    if (!port) {
      setError("请先选择端口");
      return;
    }
    if (sessionRef.current) return;
    setError("");
    setBusy(true);
    try {
      await port.open({
        baudRate,
        dataBits,
        stopBits,
        parity,
        bufferSize: 8192,
        flowControl: "none",
      });
      if (!alive.current) {
        await port.close().catch(() => undefined);
        return;
      }
      const session: Session = {
        port,
        reader: null,
        keepReading: true,
        stopping: false,
        closed: Promise.resolve(),
        stopDone: Promise.resolve(),
      };
      sessionRef.current = session;
      session.closed = readUntilClosed(session);
      void session.closed.finally(() => {
        if (!session.stopping) void shutdown(session);
      });
      setOpen(true);
    } catch (err) {
      if (alive.current) setError(explain(err));
    } finally {
      if (alive.current) setBusy(false);
    }
  }

  async function choosePort() {
    const serial = getSerial();
    if (!serial) {
      setSupported(false);
      return;
    }
    setError("");
    try {
      const port = await serial.requestPort();
      const list = await serial.getPorts();
      applyPorts(list.includes(port) ? list : [port, ...list], port);
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotFoundError") return;
      if (alive.current) setError(explain(err));
    }
  }

  function clearView() {
    if (rxTimer.current != null) {
      window.clearTimeout(rxTimer.current);
      rxTimer.current = null;
    }
    rxPending.current = [];
    setLogs([]);
    setRxBytes(0);
    setTxBytes(0);
  }

  function writePayload(payload: Uint8Array) {
    const session = sessionRef.current;
    const port = session?.port;
    if (!session || !port?.writable || session.stopping) {
      return Promise.reject(new Error("串口已关闭"));
    }
    const job = sendQueue.current.then(async () => {
      if (!port.writable) throw new Error("串口已关闭");
      let writer: WritableStreamDefaultWriter<Uint8Array>;
      try {
        writer = port.writable.getWriter();
      } catch (err) {
        throw err instanceof Error ? err : new Error("串口操作失败");
      }
      try {
        await writer.write(payload);
        pushLog("tx", payload);
      } finally {
        writer.releaseLock();
      }
    });
    sendQueue.current = job.catch(() => undefined);
    return job;
  }

  function waitGap(ms: number) {
    if (ms <= 0) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const started = Date.now();
      const timer = window.setInterval(() => {
        if (loopStopRef.current || !alive.current || Date.now() - started >= ms) {
          window.clearInterval(timer);
          resolve();
        }
      }, 40);
    });
  }

  function sendDraft() {
    const session = sessionRef.current;
    if (!session?.port.writable || session.stopping) {
      setSendError("请先打开串口");
      return;
    }
    const payload = encodePayload(draftRef.current, sendModeRef.current, endingRef.current);
    if (!payload) {
      setSendError("HEX 需要成对的十六进制字符，例如 01 03 00 00");
      return;
    }
    if (!payload.length) return;
    setSendError("");
    void writePayload(payload).catch((err) => {
      if (alive.current) setSendError(err instanceof Error ? err.message : "串口操作失败");
    });
  }

  function payloadsFromRows(): { bytes: Uint8Array; gap: number }[] | null {
    const mode = sendModeRef.current;
    const lineEnding = endingRef.current;
    const list: { bytes: Uint8Array; gap: number }[] = [];
    for (let i = 0; i < rowsRef.current.length; i++) {
      const row = rowsRef.current[i];
      if (!row.text.trim()) continue;
      const payload = encodePayload(row.text, mode, lineEnding);
      if (!payload) {
        setSendError(`第 ${i + 1} 条 HEX 需要成对的十六进制字符`);
        return null;
      }
      if (payload.length) {
        const gap = Number.isFinite(row.gap) ? Math.max(MIN_ROW_GAP_MS, Math.round(row.gap)) : DEFAULT_ROW_GAP_MS;
        list.push({ bytes: payload, gap });
      }
    }
    if (!list.length) {
      setSendError("请先填写要发送的内容");
      return null;
    }
    return list;
  }

  async function sendRows() {
    const session = sessionRef.current;
    if (!session?.port.writable || session.stopping) {
      setSendError("请先打开串口");
      return;
    }
    const payloads = payloadsFromRows();
    if (!payloads) return;
    const looping = loopEnabledRef.current;
    const times = loopCountRef.current > 0 ? loopCountRef.current : 0;
    setSendError("");
    loopStopRef.current = false;
    runningRef.current = true;
    setSequenceRunning(true);
    setLoopRound(0);
    let round = 0;
    try {
      do {
        if (loopStopRef.current || !alive.current) break;
        round += 1;
        if (alive.current) setLoopRound(round);
        for (let i = 0; i < payloads.length; i++) {
          if (loopStopRef.current || !alive.current) return;
          await writePayload(payloads[i].bytes);
          if (loopStopRef.current || !alive.current) return;
          const anotherRound = looping && (times === 0 || round < times);
          if (i < payloads.length - 1 || anotherRound) await waitGap(payloads[i].gap);
        }
      } while (looping && !loopStopRef.current && (times === 0 || round < times));
    } catch (err) {
      if (alive.current && !loopStopRef.current && !sessionRef.current?.stopping) {
        setSendError(err instanceof Error ? err.message : "串口操作失败");
      }
    } finally {
      runningRef.current = false;
      if (alive.current) setSequenceRunning(false);
    }
  }

  function handleSend(event: FormEvent) {
    event.preventDefault();
    if (runningRef.current) {
      loopStopRef.current = true;
      return;
    }
    if (expandedRef.current) void sendRows();
    else sendDraft();
  }

  useEffect(() => {
    alive.current = true;
    const serial = getSerial();
    setSupported(Boolean(serial));
    if (!serial) {
      return () => {
        alive.current = false;
      };
    }

    const onDeviceChange = () => {
      void refreshPorts();
    };
    serial.addEventListener("connect", onDeviceChange);
    serial.addEventListener("disconnect", onDeviceChange);
    void refreshPorts();

    return () => {
      alive.current = false;
      serial.removeEventListener("connect", onDeviceChange);
      serial.removeEventListener("disconnect", onDeviceChange);
      const session = sessionRef.current;
      if (session) void shutdown(session);
    };
    // 只在挂载时订阅一次；刷新和关闭都通过 ref 操作当前会话
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!autoScroll) return;
    const node = logRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [logs, autoScroll]);

  const locked = open || busy;
  const frame = frameText(baudRate, dataBits, parity, stopBits);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur sm:p-7">
      {supported === false && (
        <p className="mb-4 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm leading-relaxed text-zinc-300">
          当前浏览器不能访问串口。请换桌面版 Chrome、Edge，或较新的 Firefox。
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-zinc-300">端口</span>
        <select
          value={selected}
          disabled={locked || supported === false || ports.length === 0}
          onChange={(event) => {
            const index = Number(event.target.value);
            selectedRef.current = index;
            setSelected(index);
            setError("");
          }}
          className={`${fieldClass} min-w-[14rem] flex-1`}
        >
          {ports.length === 0 ? (
            <option value={-1}>暂无已授权端口</option>
          ) : (
            ports.map((port, index) => (
              <option key={index} value={index}>
                {portLabel(port, index, ports)}
              </option>
            ))
          )}
        </select>
        <button
          type="button"
          onClick={() => void refreshPorts()}
          disabled={supported === false || refreshing}
          className={quietButtonClass}
        >
          {refreshing ? "刷新中" : "刷新"}
        </button>
        <button
          type="button"
          onClick={() => void choosePort()}
          disabled={locked || supported === false}
          className={quietButtonClass}
        >
          选择端口
        </button>
        <button
          type="button"
          onClick={() => void (open ? closePort() : openPort())}
          disabled={supported === false || busy || (!open && selected < 0)}
          className={
            open
              ? quietButtonClass
              : "rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
          }
        >
          {open ? "关闭" : "打开"}
        </button>
        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
          <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-neon" : "bg-zinc-600"}`} />
          {open ? `已连接 · ${frame}` : "未连接"}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          波特率
          <select
            value={baudRate}
            disabled={locked}
            onChange={(event) => setBaudRate(Number(event.target.value))}
            className={fieldClass}
          >
            {BAUD_RATES.map((rate) => (
              <option key={rate} value={rate}>
                {rate}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          数据位
          <select
            value={dataBits}
            disabled={locked}
            onChange={(event) => setDataBits(Number(event.target.value) as DataBits)}
            className={fieldClass}
          >
            <option value={8}>8</option>
            <option value={7}>7</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          停止位
          <select
            value={stopBits}
            disabled={locked}
            onChange={(event) => setStopBits(Number(event.target.value) as StopBits)}
            className={fieldClass}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          校验
          <select
            value={parity}
            disabled={locked}
            onChange={(event) => setParity(event.target.value as Parity)}
            className={fieldClass}
          >
            <option value="none">无</option>
            <option value="even">偶校验</option>
            <option value="odd">奇校验</option>
          </select>
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-zinc-300">接收</span>
          {(
            [
              { key: "ascii", label: "ASCII" },
              { key: "hex", label: "HEX" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setView(item.key)}
              className={`rounded-full px-3 py-1 text-xs transition-all duration-200 ${
                view === item.key
                  ? "bg-accent font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.3)]"
                  : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowTime((value) => !value)}
            className={`rounded-full px-3 py-1 text-xs transition-all duration-200 ${
              showTime
                ? "bg-accent font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.3)]"
                : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
            }`}
          >
            时间戳
          </button>
          <button
            type="button"
            onClick={() => setAutoScroll((value) => !value)}
            className={`rounded-full px-3 py-1 text-xs transition-all duration-200 ${
              autoScroll
                ? "bg-accent font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.3)]"
                : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
            }`}
          >
            自动滚动
          </button>
          <button type="button" onClick={clearView} className={quietButtonClass}>
            清空
          </button>
          <span className="text-[11px] text-zinc-600">
            收 {rxBytes} B · 发 {txBytes} B
          </span>
        </div>

        <div
          ref={logRef}
          className="mt-2 h-72 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 sm:h-80"
        >
          {logs.length === 0 ? (
            <p className="font-mono text-sm text-zinc-600">等待数据…</p>
          ) : (
            <div className="break-all font-mono text-[13px] leading-6 whitespace-pre-wrap">
              {logs.map((entry) => (
                <div key={entry.id} className={entry.dir === "tx" ? "text-neon" : "text-zinc-200"}>
                  {showTime && <span className="text-zinc-500">[{entry.time}] </span>}
                  <span className="text-zinc-500">{entry.dir === "tx" ? "发 " : "收 "}</span>
                  {view === "hex" ? hexOf(entry.bytes) : asciiOf(entry.bytes)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <form className="mt-4" onSubmit={handleSend}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-zinc-300">发送</span>
          {(
            [
              { key: "ascii", label: "ASCII" },
              { key: "hex", label: "HEX" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setSendMode(item.key);
                setSendError("");
              }}
              className={`rounded-full px-3 py-1 text-xs transition-all duration-200 ${
                sendMode === item.key
                  ? "bg-accent font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.3)]"
                  : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
              }`}
            >
              {item.label}
            </button>
          ))}
          <span className="ml-1 text-sm text-zinc-300">结尾</span>
          {(
            [
              { key: "none", label: "无" },
              { key: "cr", label: "\\r" },
              { key: "lf", label: "\\n" },
              { key: "crlf", label: "\\r\\n" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setEnding(item.key)}
              className={`rounded-full px-3 py-1 font-mono text-xs transition-all duration-200 ${
                ending === item.key
                  ? "bg-accent font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.3)]"
                  : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              if (runningRef.current) loopStopRef.current = true;
              setExpanded((value) => !value);
            }}
            className={`rounded-full px-3 py-1 text-xs transition-all duration-200 ${
              expanded
                ? "bg-accent font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.3)]"
                : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
            }`}
          >
            拓展
          </button>
        </div>

        {expanded ? (
          <div className="mt-3 space-y-2">
            {rows.map((row, index) => (
              <div key={row.id} className="flex items-center gap-2">
                <span className="w-12 shrink-0 text-xs text-zinc-500">第{index + 1}条</span>
                <input
                  value={row.text}
                  onChange={(event) => {
                    const text = event.target.value;
                    setRows((current) =>
                      current.map((item) => (item.id === row.id ? { ...item, text } : item)),
                    );
                    setSendError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.preventDefault();
                  }}
                  placeholder={sendMode === "hex" ? "例如 01 03 00 00" : "这一条要发送的内容"}
                  className="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-accent/50"
                />
                <label className="flex shrink-0 items-center gap-1.5 text-xs text-zinc-400">
                  间隔
                  <input
                    type="number"
                    min={MIN_ROW_GAP_MS}
                    value={row.gap}
                    disabled={sequenceRunning}
                    onChange={(event) => {
                      const next = Number.parseInt(event.target.value, 10);
                      setRows((current) =>
                        current.map((item) =>
                          item.id === row.id
                            ? { ...item, gap: Number.isFinite(next) ? next : MIN_ROW_GAP_MS }
                            : item,
                        ),
                      );
                    }}
                    onBlur={() => {
                      setRows((current) =>
                        current.map((item) =>
                          item.id === row.id
                            ? { ...item, gap: Math.max(MIN_ROW_GAP_MS, Math.round(item.gap) || MIN_ROW_GAP_MS) }
                            : item,
                        ),
                      );
                    }}
                    className={`${fieldClass} w-20`}
                  />
                  ms
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setRows((current) =>
                      current.length <= 1 ? current : current.filter((item) => item.id !== row.id),
                    )
                  }
                  disabled={rows.length <= 1 || sequenceRunning}
                  className={quietButtonClass}
                >
                  删除
                </button>
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  rowSeed.current += 1;
                  const id = rowSeed.current;
                  setRows((current) => [...current, { id, text: "", gap: DEFAULT_ROW_GAP_MS }]);
                }}
                disabled={sequenceRunning}
                className={quietButtonClass}
              >
                添加一条
              </button>
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={loopEnabled}
                  onChange={(event) => {
                    if (!event.target.checked && loopEnabledRef.current) loopStopRef.current = true;
                    setLoopEnabled(event.target.checked);
                  }}
                  className="h-3.5 w-3.5 accent-[#ff5c1a]"
                />
                循环
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                次数
                <input
                  type="number"
                  min={0}
                  value={loopCount}
                  disabled={sequenceRunning}
                  onChange={(event) => {
                    const next = Number.parseInt(event.target.value, 10);
                    setLoopCount(Number.isFinite(next) && next > 0 ? next : 0);
                  }}
                  className={`${fieldClass} w-20`}
                />
              </label>
              {sequenceRunning && loopEnabled && (
                <span className="text-xs text-zinc-400">
                  循环中 · 第 {loopRound} 轮{loopCount > 0 ? ` / ${loopCount}` : " · 一直循环"}
                </span>
              )}
              <button
                type="submit"
                disabled={(!open || busy) && !sequenceRunning}
                className={`ml-auto rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 ${
                  sequenceRunning
                    ? "border border-zinc-700 bg-zinc-900"
                    : "bg-accent shadow-[0_0_20px_rgba(255,92,26,0.25)]"
                }`}
              >
                {sequenceRunning ? "停止" : "发送"}
              </button>
            </div>
            <p className="text-xs leading-relaxed text-zinc-600">
              没勾选循环时，点发送会按顺序发完一轮。勾选后，次数 0 表示一直循环，填 10 就整组发 10 轮。每条右侧的间隔是这条发完后再发下一条的等待，最小 10 ms。
            </p>
          </div>
        ) : (
          <div className="mt-2 flex gap-2">
            <input
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setSendError("");
              }}
              placeholder={sendMode === "hex" ? "例如 01 03 00 00 00 01" : "输入要发送的文本，回车发送"}
              className="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-accent/50"
            />
            <button
              type="submit"
              disabled={!open || busy}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              发送
            </button>
          </div>
        )}

        {sendError && <p className="mt-2 text-sm text-red-400">{sendError}</p>}
      </form>

      <p className="mt-4 text-xs leading-relaxed text-zinc-600">
        「选择端口」会弹出浏览器的系统窗口，COM 口号只在那里显示；「刷新」只更新已经授权过的端口。
        需要桌面版 Chrome、Edge 或较新的 Firefox，并且设备已经在系统里显示为串口。
        收发只发生在本机浏览器和串口之间，不会上传。绿色文字是发出的数据。
      </p>
    </div>
  );
}
