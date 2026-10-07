"use client";

import { useState } from "react";
import { Bot, Lock } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import VoltageDivider from "@/components/tools/calculators/VoltageDivider";
import { tools, type Tool } from "@/lib/tools";

/** /tools 页面主体：工具目录 + 点击展开工具面板（数据源 lib/tools.ts） */
export default function ToolsExplorer() {
  const [active, setActive] = useState<Tool | null>(
    tools.find((t) => t.available) ?? null,
  );

  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      {/* ── 当前工具面板 ── */}
      {active && (
        <Reveal>
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                Now Running
              </p>
              <span className="text-sm text-zinc-300">{active.name}</span>
            </div>
            {active.id === "voltage-divider" && <VoltageDivider />}
          </div>
        </Reveal>
      )}

      {/* ── 工具目录 ── */}
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Toolbox
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
          全部工具
        </h2>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, i) => (
          <Reveal key={tool.id} delay={(i % 3) * 80}>
            <button
              onClick={() => tool.available && setActive(tool)}
              disabled={!tool.available}
              className={`h-full w-full rounded-2xl border p-5 text-left backdrop-blur transition-all duration-300 ${
                tool.available
                  ? active?.id === tool.id
                    ? "border-accent/50 bg-zinc-900/80"
                    : "border-zinc-800 bg-zinc-900/50 hover:-translate-y-1 hover:border-accent/40 hover:bg-zinc-900/80"
                  : "cursor-not-allowed border-zinc-800/60 bg-zinc-950/40 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold tracking-tight text-zinc-50">
                  {tool.name}
                </h3>
                {tool.available ? (
                  <span className="rounded-full border border-neon/30 bg-zinc-950/60 px-2 py-0.5 text-[10px] font-medium text-neon">
                    可用
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950/60 px-2 py-0.5 text-[10px] text-zinc-500">
                    <Lock className="h-2.5 w-2.5" />
                    开发中
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-zinc-600">
                {tool.en}
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                {tool.desc}
              </p>
            </button>
          </Reveal>
        ))}

        {/* 未来入口预告：智能体 */}
        <Reveal delay={80}>
          <div className="flex h-full flex-col rounded-2xl border border-dashed border-zinc-700/80 bg-zinc-950/40 p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold tracking-tight text-zinc-50">
                我的智能体
              </h3>
              <Bot className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-500">
              选型助手与手册答疑精灵已上线，
              <span className="text-zinc-400">部署到云端后将接入这里直接使用</span>
              。
            </p>
            <span className="mt-auto pt-3 text-[11px] text-zinc-600">
              详见「智能体」选项卡
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
