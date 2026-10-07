"use client";

import { useState } from "react";
import { Bot, BookOpenText, ShoppingCart, Boxes, ExternalLink, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { agents, agentsPlatform, type Agent } from "@/lib/agents";

/** 智能体图标映射（新增智能体时可在此补一个图标，缺省用 Bot） */
const icons: Record<string, typeof Bot> = {
  "lcsc-component": ShoppingCart,
  "datasheet-rag": BookOpenText,
};

/** /agents 页面内容：平台框架卡 + 智能体发射台（纯数据驱动，加智能体零改动） */
export default function AgentsGrid() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      {/* ── 温和提示：本地部署，暂不可在线体验 ── */}
      <Reveal>
        <div className="mb-8 flex items-start gap-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm leading-relaxed text-zinc-400 backdrop-blur sm:p-6">
          <Bot className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <p>
            小提示：这两个小伙伴运行在我的工作电脑上——
            <span className="text-zinc-300">
              作者本机点「打开控制台」即可直达
            </span>
            ，其他设备暂时连不上。如果你对它们感兴趣，欢迎通过页面底部的邮箱联系我——
            <span className="text-zinc-300">我可以现场演示，或聊聊它们的实现思路</span>
            。
          </p>
        </div>
      </Reveal>

      {/* ── 平台框架卡 ── */}
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-[80px]" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10">
                <Boxes className="h-5 w-5 text-accent" />
              </span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-50 sm:text-xl">
                  {agentsPlatform.name}
                </h2>
                <p className="text-[11px] uppercase tracking-widest text-zinc-500">
                  {agentsPlatform.nameEn}
                </p>
              </div>
              <span className="ml-auto rounded-full border border-neon/30 bg-zinc-950/60 px-2.5 py-1 text-[10px] font-medium text-neon">
                持续迭代中
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              {agentsPlatform.desc}
            </p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {agentsPlatform.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-300"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {agentsPlatform.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-zinc-800 bg-zinc-950/60 px-2 py-0.5 text-[11px] text-zinc-400"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── 智能体发射台 ── */}
      <Reveal delay={100}>
        <div className="mb-6 mt-14 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Launchpad
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
              智能体矩阵
            </h2>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2">
        {agents.map((agent, i) => (
          <Reveal key={agent.id} delay={i * 100}>
            <AgentCard agent={agent} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────── 智能体卡片 ────────────────────────── */

function AgentCard({ agent }: { agent: Agent }) {
  const Icon = icons[agent.id] ?? Bot;
  const [connecting, setConnecting] = useState(false);
  const [unreachable, setUnreachable] = useState(false);

  /**
   * 点击「打开控制台」：先探测 127.0.0.1 是否可达（约 2s 超时）
   * 可达（作者本机）→ 直接打开控制台；不可达 → 温和弹窗说明
   */
  async function handleOpen() {
    setConnecting(true);
    try {
      await Promise.race([
        fetch(agent.consoleUrl, { mode: "no-cors" }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 2000),
        ),
      ]);
      window.open(agent.consoleUrl, "_blank", "noopener");
    } catch {
      setUnreachable(true);
    } finally {
      setConnecting(false);
    }
  }

  return (
    <>
      <article className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-zinc-900/80">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10">
          <Icon className="h-5 w-5 text-accent" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold tracking-tight text-zinc-50">
            {agent.name}
          </h3>
          <p className="truncate text-[11px] uppercase tracking-widest text-zinc-500">
            {agent.nameEn}
          </p>
        </div>
        <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-neon/30 bg-zinc-950/60 px-2.5 py-1 text-[10px] font-medium text-neon">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon" />
          </span>
          {agent.status}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-zinc-400">{agent.desc}</p>

      <ul className="mt-4 space-y-2">
        {agent.capabilities.map((c) => (
          <li
            key={c}
            className="flex items-start gap-2 text-[13px] leading-relaxed text-zinc-400"
          >
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent/80" />
            {c}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {agent.stack.map((s) => (
          <span
            key={s}
            className="rounded-md border border-zinc-800 bg-zinc-950/60 px-2 py-0.5 text-[11px] text-zinc-400"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-5">
        <button
          onClick={handleOpen}
          disabled={connecting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(255,92,26,0.3)] transition-all duration-200 hover:bg-accent-soft hover:shadow-[0_0_32px_rgba(255,92,26,0.45)] disabled:cursor-wait disabled:opacity-70"
        >
          <Bot className="h-4 w-4" />
          {connecting ? "正在连接…" : "打开控制台"}
        </button>
        <p className="mt-2.5 text-center text-[11px] text-zinc-600">
          运行在作者的工作电脑上 · 其他设备点击会提示无法连接
        </p>
      </div>
      </article>

      {/* 连接失败时的温和弹窗 */}
      {unreachable && (
        <div
          className="animate-fade-in fixed inset-0 z-[110] flex items-center justify-center bg-zinc-950/80 p-5 backdrop-blur-md"
          onClick={() => setUnreachable(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="animate-scale-in w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10">
                <Bot className="h-5 w-5 text-accent" />
              </span>
              <div>
                <h4 className="text-base font-semibold tracking-tight text-zinc-50">
                  连不上～它还住在作者的电脑里
                </h4>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                  这两个智能体目前只在作者的电脑上运行，当前设备暂时无法访问。
                  如果你有兴趣，欢迎通过页面底部的邮箱联系作者——
                  <span className="text-zinc-300">现场演示随时安排！</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setUnreachable(false)}
              className="mt-6 w-full rounded-full bg-zinc-800 py-2.5 text-sm text-zinc-200 transition-colors hover:bg-zinc-700"
            >
              知道啦
            </button>
          </div>
        </div>
      )}
    </>
  );
}
