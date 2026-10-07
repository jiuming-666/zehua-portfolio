"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";

type Order = "ABCD" | "DCBA";

/** HEX 字符串（4 字节）→ float（order 为输入字节的书写顺序） */
function hexToFloat(hex: string, order: Order): number | null {
  const clean = hex.replace(/0x/gi, "").replace(/[^0-9a-fA-F]/g, "");
  if (clean.length !== 8) return null;
  const bytes: number[] = [];
  for (let i = 0; i < 4; i++)
    bytes.push(parseInt(clean.slice(i * 2, i * 2 + 2), 16));
  const ordered = order === "DCBA" ? [...bytes].reverse() : bytes;
  const view = new DataView(new ArrayBuffer(4));
  ordered.forEach((b, i) => view.setUint8(i, b));
  return view.getFloat32(0, false);
}

/** float → HEX 字符串（order 为输出字节的书写顺序） */
function floatToHex(f: number, order: Order): string | null {
  const view = new DataView(new ArrayBuffer(4));
  view.setFloat32(0, f, false);
  let bytes = [0, 1, 2, 3].map((i) => view.getUint8(i));
  if (order === "DCBA") bytes = [...bytes].reverse();
  return bytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
}

/** IEEE-754 浮点数与十六进制转换器（串口 / 工业总线数据解析） */
export default function FloatHexConverter() {
  const [order, setOrder] = useState<Order>("ABCD");
  const [hexText, setHexText] = useState("42 F6 E6 66");
  const [floatText, setFloatText] = useState("123.45");

  const f = hexToFloat(hexText, order);
  const fN = parseFloat(floatText);
  const hex = Number.isNaN(fN) ? null : floatToHex(fN, order);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur sm:p-7">
      {/* 字节序切换 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-zinc-300">字节序：</span>
        {(
          [
            { key: "ABCD", label: "大端序 ABCD (Big-Endian)" },
            { key: "DCBA", label: "小端序 DCBA (Little-Endian)" },
          ] as const
        ).map((o) => (
          <button
            key={o.key}
            onClick={() => setOrder(o.key)}
            className={`rounded-full px-4 py-1.5 text-sm transition-all duration-200 ${
              order === o.key
                ? "bg-accent font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.3)]"
                : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* 双向换算 */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* HEX → FLOAT */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-400">
            4 字节 HEX → Float32
          </p>
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950/80 focus-within:border-accent/50">
            <input
              type="text"
              value={hexText}
              onChange={(e) => setHexText(e.target.value)}
              placeholder="42 F6 E6 66"
              className="w-full bg-transparent px-3 py-2 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
            />
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            →{" "}
            <span className="text-xl font-semibold text-accent">
              {f === null ? "需 4 字节 HEX" : f.toPrecision(7)}
            </span>
          </p>
        </div>

        {/* FLOAT → HEX */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5">
          <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-400">
            Float32 → 4 字节 HEX
            <ArrowLeftRight className="h-3 w-3 text-zinc-600" />
          </p>
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950/80 focus-within:border-accent/50">
            <input
              type="text"
              value={floatText}
              onChange={(e) => setFloatText(e.target.value)}
              placeholder="123.45"
              className="w-full bg-transparent px-3 py-2 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
            />
          </div>
          <p className="mt-3 font-mono text-sm text-zinc-400">
            →{" "}
            <span className="text-lg font-semibold tracking-wider text-accent">
              {hex ?? "输入有效浮点数"}
            </span>
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-zinc-600">
        单精度浮点 (IEEE-754 float32) · 大端序按 ABCD 顺序解析 ·
        小端序自动反转字节（多数 STM32 / Modbus 设备为小端序）· HEX 输入容忍空格与 0x 前缀
      </p>
    </div>
  );
}
