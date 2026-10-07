"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** 转义字符表：\r \n \t \0 \a \b \f \v \\ 与 \xHH */
const ESCAPES: Record<string, number> = {
  r: 13, n: 10, t: 9, "0": 0, a: 7, b: 8, f: 12, v: 11, "\\": 92,
};
const UNESCAPES: Record<number, string> = {
  13: "\\r", 10: "\\n", 9: "\\t", 0: "\\0", 7: "\\a", 8: "\\b", 12: "\\f", 11: "\\v", 92: "\\\\",
};

type Format = "space" | "none" | "carray";

/** 文本 → 字节数组（支持转义字符与 UTF-8 多字节） */
function textToBytes(text: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "\\") {
      const next = text[i + 1];
      if (next !== undefined && next in ESCAPES) {
        bytes.push(ESCAPES[next]);
        i++;
        continue;
      }
      if (next === "x" || next === "X") {
        const hh = text.slice(i + 2, i + 4);
        if (/^[0-9a-fA-F]{2}$/.test(hh)) {
          bytes.push(parseInt(hh, 16));
          i += 3;
          continue;
        }
      }
    }
    bytes.push(...new TextEncoder().encode(ch));
  }
  return bytes;
}

/** 字节数组 → 文本（不可见字节转义显示） */
function bytesToText(bytes: number[]): string {
  return bytes
    .map((b) => {
      if (b in UNESCAPES) return UNESCAPES[b];
      if (b >= 0x20 && b <= 0x7e) return String.fromCharCode(b);
      return "\\x" + b.toString(16).padStart(2, "0");
    })
    .join("");
}

/** HEX 输入 → 字节数组（容忍空格 / 0x / 逗号） */
function hexToBytes(hex: string): number[] {
  const clean = hex.replace(/0x/gi, "").replace(/[^0-9a-fA-F]/g, "");
  const bytes: number[] = [];
  for (let i = 0; i + 1 < clean.length; i += 2)
    bytes.push(parseInt(clean.slice(i, i + 2), 16));
  return bytes;
}

function formatHex(bytes: number[], format: Format): string {
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase());
  if (format === "none") return hex.join("");
  if (format === "carray") return hex.length ? "0x" + hex.join(", 0x") : "";
  return hex.join(" ");
}

/** Hex / ASCII 字符串互转工具 */
export default function HexAsciiConverter() {
  const [bytes, setBytes] = useState<number[]>([]);
  const [textValue, setTextValue] = useState("");
  const [hexValue, setHexValue] = useState("");
  const [format, setFormat] = useState<Format>("space");
  const [copied, setCopied] = useState(false);

  function onTextChange(v: string) {
    const b = textToBytes(v);
    setTextValue(v);
    setBytes(b);
    setHexValue(formatHex(b, format));
  }

  function onHexChange(v: string) {
    const b = hexToBytes(v);
    setHexValue(v);
    setBytes(b);
    setTextValue(bytesToText(b));
  }

  function onFormatChange(f: Format) {
    setFormat(f);
    setHexValue(formatHex(bytes, f));
  }

  async function copyHex() {
    await navigator.clipboard.writeText(hexValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur sm:p-7">
      {/* 输出格式控制 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-zinc-300">HEX 输出格式：</span>
        {(
          [
            { key: "space", label: "空格分隔 (41 54)" },
            { key: "none", label: "无分隔 (4154)" },
            { key: "carray", label: "C 数组 (0x41, 0x54)" },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            onClick={() => onFormatChange(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs transition-all duration-200 ${
              format === f.key
                ? "bg-accent font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.3)]"
                : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 双栏互转 */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* 文本 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-zinc-300">
              文本 (ASCII)
              <span className="ml-2 text-[11px] text-zinc-600">
                支持 \r \n \t \0 \xHH 转义
              </span>
            </span>
            <span className="text-[11px] text-zinc-600">
              {bytes.length} Byte
            </span>
          </div>
          <textarea
            value={textValue}
            onChange={(e) => onTextChange(e.target.value)}
            rows={6}
            placeholder={"例如：AT+RST\\r\\n"}
            className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-accent/50"
          />
        </div>

        {/* HEX */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-zinc-300">十六进制 (HEX)</span>
            <button
              onClick={copyHex}
              disabled={!bytes.length}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[11px] text-zinc-300 transition-colors hover:border-zinc-600 disabled:opacity-40"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-neon" /> 已复制
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> 复制
                </>
              )}
            </button>
          </div>
          <textarea
            value={hexValue}
            onChange={(e) => onHexChange(e.target.value)}
            rows={6}
            placeholder="例如：41 54 2B 52 53 54 0D 0A"
            className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-accent/50"
          />
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-zinc-600">
        双向实时转换：任意一侧输入，另一侧即时更新 · 非打印字节以 \xHH 转义显示 ·
        中文等非 ASCII 字符按 UTF-8 编码展开
      </p>
    </div>
  );
}
