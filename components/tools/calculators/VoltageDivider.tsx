"use client";

import { useMemo, useState } from "react";
import { Divide, Percent } from "lucide-react";

const E24 = [
  1, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.7, 3, 3.3, 3.6, 3.9, 4.3,
  4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
];

/** 生成 1kΩ ~ 10MΩ 范围内的全部 E24 标称值（单位 kΩ） */
const E24_KOHM = E24.flatMap((base) =>
  [0, 1, 2, 3, 4].map((decade) => base * Math.pow(10, decade)),
);

type Mode = "measure" | "design";

/** 分压电阻计算器：实测分压 + LDO 反馈电阻设计（E24 自动配对） */
export default function VoltageDivider() {
  const [mode, setMode] = useState<Mode>("design");

  // 模式一：实测分压
  const [vin, setVin] = useState("12");
  const [r1, setR1] = useState("10");
  const [r2, setR2] = useState("2");

  // 模式二：反馈设计
  const [voutTarget, setVoutTarget] = useState("3.3");
  const [vref, setVref] = useState("0.8");
  const [r2Fixed, setR2Fixed] = useState("10");

  const num = (s: string) => {
    const v = parseFloat(s);
    return Number.isFinite(v) && v > 0 ? v : NaN;
  };

  // ── 模式一计算 ──
  const measure = useMemo(() => {
    const vinN = num(vin), r1N = num(r1), r2N = num(r2);
    if (Number.isNaN(vinN) || Number.isNaN(r1N) || Number.isNaN(r2N))
      return null;
    const vout = (vinN * r2N) / (r1N + r2N);
    const current = vinN / (r1N + r2N); // mA（电阻单位 kΩ）
    return {
      vout,
      current,
      p1: current * current * r1N, // mW
      p2: current * current * r2N,
      ratio: r1N / r2N,
    };
  }, [vin, r1, r2]);

  // ── 模式二计算：E24 全组合搜索 ──
  const design = useMemo(() => {
    const voutN = num(voutTarget), vrefN = num(vref), r2N = num(r2Fixed);
    if (Number.isNaN(voutN) || Number.isNaN(vrefN) || Number.isNaN(r2N) || voutN <= vrefN)
      return null;
    const idealR1 = r2N * (voutN / vrefN - 1);
    let best = { r1: 0, r2: 0, vout: 0, err: Infinity };
    for (const r2c of E24_KOHM) {
      for (const r1c of E24_KOHM) {
        const v = vrefN * (1 + r1c / r2c);
        const err = Math.abs((v - voutN) / voutN) * 100;
        if (err < best.err) best = { r1: r1c, r2: r2c, vout: v, err };
      }
    }
    return { idealR1, ...best };
  }, [voutTarget, vref, r2Fixed]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur sm:p-7">
      {/* 模式切换 */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "design", label: "反馈电阻设计（LDO / DC-DC）" },
            { key: "measure", label: "实测分压计算" },
          ] as const
        ).map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`rounded-full px-4 py-1.5 text-sm transition-all duration-200 ${
              mode === m.key
                ? "bg-accent font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.3)]"
                : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "design" ? (
        /* ── 模式二：反馈电阻设计 ── */
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Field label="目标输出电压 Vout" unit="V" value={voutTarget} onChange={setVoutTarget} />
            <Field label="反馈基准电压 Vref" unit="V" value={vref} onChange={setVref} hint="芯片数据手册里的 FB / REF 电压" />
            <Field label="下分压电阻 R2（搜索起点）" unit="kΩ" value={r2Fixed} onChange={setR2Fixed} hint="自动搜索误差最小的 E24 标称值组合" />
          </div>
          <ResultPanel>
            {design ? (
              <>
                <Row label="理想 R1" value={fmt(design.idealR1) + " kΩ"} />
                <Row label="E24 最佳配对 R1 / R2" value={`${fmtE24(design.r1)} / ${fmtE24(design.r2)} kΩ`} accent />
                <Row label="实际输出电压" value={design.vout.toFixed(4) + " V"} />
                <Row label="误差" value={design.err.toFixed(3) + " %"} accent={design.err < 1} />
                <p className="mt-3 text-xs leading-relaxed text-zinc-600">
                  Vout = Vref × (1 + R1/R2) · 已在 1kΩ~10MΩ 的 E24 全系列中搜索误差最小组合
                </p>
              </>
            ) : (
              <p className="text-sm text-zinc-500">请填写全部输入（Vout 需大于 Vref）</p>
            )}
          </ResultPanel>
        </div>
      ) : (
        /* ── 模式一：实测分压 ── */
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Field label="输入电压 Vin" unit="V" value={vin} onChange={setVin} />
            <Field label="上分压电阻 R1" unit="kΩ" value={r1} onChange={setR1} />
            <Field label="下分压电阻 R2" unit="kΩ" value={r2} onChange={setR2} />
          </div>
          <ResultPanel>
            {measure ? (
              <>
                <Row label="输出电压 Vout" value={measure.vout.toFixed(4) + " V"} accent />
                <Row label="分压比 R1 / R2" value={measure.ratio.toFixed(3) + " : 1"} />
                <Row label="回路电流" value={fmtCurrent(measure.current)} />
                <Row label="R1 功耗" value={fmtPower(measure.p1)} />
                <Row label="R2 功耗" value={fmtPower(measure.p2)} />
                <p className="mt-3 text-xs leading-relaxed text-zinc-600">
                  Vout = Vin × R2 / (R1 + R2) · 单电阻功耗超过 100mW 时注意封装选型
                </p>
              </>
            ) : (
              <p className="text-sm text-zinc-500">请填写全部输入</p>
            )}
          </ResultPanel>
        </div>
      )}
    </div>
  );
}

/* ── 小组件 ── */

function Field({
  label,
  unit,
  value,
  onChange,
  hint,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-zinc-300">{label}</span>
      <div className="mt-1.5 flex items-center rounded-xl border border-zinc-800 bg-zinc-950/80 focus-within:border-accent/50">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-4 py-2.5 text-sm text-zinc-100 outline-none"
          inputMode="decimal"
        />
        <span className="px-4 text-xs text-zinc-500">{unit}</span>
      </div>
      {hint && <span className="mt-1 block text-[11px] text-zinc-600">{hint}</span>}
    </label>
  );
}

function ResultPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 sm:p-6">
      <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-accent">
        <Divide className="h-3.5 w-3.5" />
        计算结果
      </p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-zinc-400">
        <Percent className="h-3 w-3 text-zinc-600" />
        {label}
      </span>
      <span
        className={`font-medium tracking-tight ${
          accent ? "text-accent" : "text-zinc-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* ── 工具函数 ── */
function fmt(n: number) {
  return n >= 100 ? n.toFixed(0) : n >= 1 ? n.toFixed(2) : n.toFixed(4);
}
function fmtE24(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + " MΩ" : n.toFixed(1) + " kΩ";
}
function fmtCurrent(mA: number) {
  return mA >= 1 ? mA.toFixed(2) + " mA" : (mA * 1000).toFixed(1) + " µA";
}
function fmtPower(mW: number) {
  return mW >= 1 ? mW.toFixed(2) + " mW" : (mW * 1000).toFixed(1) + " µW";
}
