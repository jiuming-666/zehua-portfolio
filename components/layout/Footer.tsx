"use client";

import { Mail } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-zinc-900 bg-surface/40 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Contact
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            一起做点看得见的东西。
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-400 sm:text-base">
            无论是嵌入式岗位机会、项目合作，还是想聊聊软硬件实现，欢迎随时联系。
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex items-center gap-3 text-lg font-medium tracking-tight text-zinc-100 transition-colors hover:text-accent sm:text-xl"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur transition-colors group-hover:border-accent/40">
                <Mail className="h-5 w-5 text-accent" />
              </span>
              {site.email}
            </a>
            <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
              <span className="text-zinc-600">Tel</span>
              {site.phone}
              <span className="text-zinc-600">· {site.location}</span>
            </span>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col gap-2 border-t border-zinc-900 pt-8 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {site.nameZh} ({site.nameEn}). Built with Next.js.</p>
          <p>{site.location}</p>
        </div>
      </div>
    </footer>
  );
}
