import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/common/Reveal";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
};

/** 子页面统一页头：眉题 + 大标题 + 描述（让每个选项卡都有独立的开场） */
export default function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden pb-4 pt-32 sm:pt-40">
      {/* 背景光晕 */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[360px] w-[640px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-3.5 py-1.5 text-xs text-zinc-400 backdrop-blur">
            {Icon && <Icon className="h-3.5 w-3.5 text-accent" />}
            {eyebrow}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-zinc-50 sm:text-6xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={200}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
