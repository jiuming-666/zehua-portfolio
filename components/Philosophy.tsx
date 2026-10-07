import { Quote } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function Philosophy() {
  return (
    <section id="about" className="relative overflow-hidden py-24 scroll-mt-24 sm:py-32">
      {/* 背景光晕 */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur">
            <Quote className="h-5 w-5 text-accent" />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <blockquote className="mt-8">
            <p className="text-xl font-medium leading-relaxed tracking-tight text-zinc-100 sm:text-2xl lg:text-3xl">
              我相信「看得见的工程」才是最好的证明。
              <br className="hidden sm:block" />
              <span className="text-zinc-400">
                代码不会说谎，亲手装配并点亮的硬件更是如此。
              </span>
            </p>
          </blockquote>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
            <p className="text-sm text-zinc-500">
              江泽华 · Jiang Zehua — Maker / Hardware &amp; Engineering Builder
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
