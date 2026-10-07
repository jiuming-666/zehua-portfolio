import Link from "next/link";
import { ArrowDownRight, Bot } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-24 pt-36 sm:pt-44">
      {/* 背景网格 + 光晕 */}
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3.5 py-1.5 text-xs text-zinc-400 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-neon" />
            {site.role} · {site.location}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
            Writing Firmware
            <br />
            for{" "}
            <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
              Real Machines.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            你好，我是{site.nameZh}，{site.role}。
            <span className="text-zinc-200">
              {site.tagline}——每一个项目都有真实的电路、波形与整机支撑。
            </span>
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/projects"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white shadow-[0_0_32px_rgba(255,92,26,0.35)] transition-all duration-200 hover:bg-accent-soft hover:shadow-[0_0_44px_rgba(255,92,26,0.5)]"
            >
              浏览实物成果 (View Artifacts)
              <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </Link>
            <Link
              href="/agents"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-6 py-3.5 text-sm font-medium text-zinc-300 backdrop-blur transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100"
            >
              我的智能体
              <Bot className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-12" />
            </Link>
          </div>
        </Reveal>

        {/* 底部数据条 */}
        <Reveal delay={400}>
          <dl className="mt-20 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 sm:mt-24">
            {[
              { k: "异构架构", v: "MCU+FPGA", sub: "AG32 / HC2000" },
              { k: "交付链路", v: "全链路", sub: "HW + FW + UI" },
              { k: "调试方法", v: "波形导向", sub: "Data-Driven" },
            ].map((s) => (
              <div
                key={s.k}
                className="bg-zinc-950/80 px-5 py-5 backdrop-blur sm:px-8"
              >
                <dd className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
                  {s.v}
                </dd>
                <dt className="mt-1 text-xs text-zinc-500">
                  {s.k} · <span className="hidden sm:inline">{s.sub}</span>
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
