/**
 * 串口文本编解码：UTF-8 / GBK(GB2312) / ASCII
 * 接收优先用浏览器 TextDecoder；GBK 发送走 iconv-lite。
 */

import iconv from "iconv-lite";

export type Charset = "utf8" | "gbk" | "ascii";

export const CHARSET_OPTIONS: { key: Charset; label: string }[] = [
  { key: "utf8", label: "UTF-8" },
  { key: "gbk", label: "GBK/GB2312" },
  { key: "ascii", label: "ASCII" },
];

function toBuffer(bytes: Uint8Array): Buffer {
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

/** 字节 → 文本（接收区 ASCII 显示） */
export function decodeText(bytes: Uint8Array, charset: Charset): string {
  if (!bytes.length) return "";
  try {
    if (charset === "utf8") {
      return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    }
    if (charset === "ascii") {
      return new TextDecoder("ascii", { fatal: false }).decode(bytes);
    }
    return new TextDecoder("gbk", { fatal: false }).decode(bytes);
  } catch {
    const name = charset === "utf8" ? "utf8" : charset === "ascii" ? "ascii" : "gbk";
    return iconv.decode(toBuffer(bytes), name);
  }
}

/** 文本 → 字节（发送区非 HEX） */
export function encodeText(text: string, charset: Charset): Uint8Array {
  if (charset === "utf8") return new TextEncoder().encode(text);
  if (charset === "ascii") {
    const out = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      out[i] = code <= 0x7f ? code : 0x3f;
    }
    return out;
  }
  const buf = iconv.encode(text, "gbk");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}
