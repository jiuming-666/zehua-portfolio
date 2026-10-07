"use client";

import { useMemo, useState } from "react";
import { Binary } from "lucide-react";

const RESOLUTIONS = [8, 10, 12, 14, 16];

/** ADC 电压换算器：码值 ↔ 电压双向换算，分辨率与参考电压可调 */
export default function AdcConverter() {
  const [bits, setBits] = useState(12);
  const [vref, setVref] = useState("3.3");
  const [code, setCode] = useState("2048");
  const [volt, setVolt] = useState("1.65");

  const maxCode = Math.pow(2, bits) - 1;

  const num = (s: string) => {
    const v = parseFloat(s);
    return Number.isFinite(v) ? v : NaN;
  };

  const vrefN = num(vref);
  const lsb = Number.isNaN(vrefN) ? NaN : (vrefN * 1000) / (maxCode + 1); // mV

  const codeN = num(code);
  const voltFromCode =
    Number.isNaN(codeN) || Number.isNaN(vrefN)
      ? NaN
      : (codeN / (maxCode + 1)) * vrefN;

  const voltN = num(volt);
  const codeFromVolt =
    Number.isNaN(voltN) || Number.isNaN(vrefN)
      ? NaN
      : Math.round((voltN / vrefN) * (maxCode + 1));

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur sm:p-7">
      {/* 参数设置 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="mb-1.5 block text-sm text-zinc-300">分辨率</span>
          <div className="flex flex-wrap gap-2">
            {RESOLUTIONS.map((b) => (
              <button
                key={b}
                onClick={() => setBits(b)}
                className={`rounded-full px-4 py-1.5 text-sm transition-all duration-200 ${
                  bits === b
                    ? "bg-accent font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.3)]"
                    : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
                }`}
              >
                {b} bit
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm text-zinc-300">
            参考电压 Vref
          </span>
          <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950/80 focus-within:border-accent/50">
            <input
              type="number"
              value={vref}
              onChange={(e) => setVref(e.target.value)}
              className="w-full bg-transparent px-4 py-2.5 text-sm text-zinc-100 outline-none"
              inputMode="decimal"
            />
            <span className="px-4 text-xs text-zinc-500">V</span>
          </div>
        </label>
      </div>

      <p className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-500">
        满量程 {maxCode.toLocaleString()} · 1 LSB ≈ {lsb.toFixed(3)} mV
      </p>

      {/* 双向换算 */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* 码值 → 电压 */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5">
          <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-400">
            <Binary className="h-3.5 w-3.5 text-accent" />
            码值 → 电压
          </p>
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950/80 focus-within:border-accent/50">
            <input
              type="number"
              value={code}
              min={0}
              max={maxCode}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none"
              inputMode="numeric"
            />
            <span className="px-3 text-xs text-zinc-500">code</span>
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            →{" "}
            <span className="text-lg font-semibold text-accent">
              {Number.isNaN(voltFromCode) ? "—" : voltFromCode.toFixed(4) + " V"}
            </span>
          </p>
          {Number.isNaN(codeN) || codeN < 0 || codeN > maxCode ? (
            <p className="mt-1.5 text-[11px] text-amber-500/80">
              范围 0 ~ {maxCode.toLocaleString()}
            </p>
          ) : null}
        </div>

        {/* 电压 → 码值 */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5">
          <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-400">
            <Binary className="h-3.5 w-3.5 text-accent" />
            电压 → 码值
          </p>
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950/80 focus-within:border-accent/50">
            <input
              type="number"
              value={volt}
              onChange={(e) => setVolt(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none"
              inputMode="decimal"
            />
            <span className="px-3 text-xs text-zinc-500">V</span>
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            →{" "}
            <span className="text-lg font-semibold text-accent">
              {Number.isNaN(codeFromVolt) ? "—" : codeFromVolt.toLocaleString()}
            </span>
            <span className="ml-1 text-xs text-zinc-600">code</span>
          </p>
          {Number.isNaN(voltN) || voltN < 0 || (voltN > vrefN && !Number.isNaN(vrefN)) ? (
            <p className="mt-1.5 text-[11px] text-amber-500/80">
              范围 0 ~ {vrefN || "—"} V
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-zinc-600">
        公式：V = Code / (2^N) × Vref · 换算含四舍五入，实际精度以 1 LSB
        步进为限
      </p>
    </div>
  );
}
