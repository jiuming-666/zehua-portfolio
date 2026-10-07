"use client";

import Link from "next/link";
import { Mail, Github } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { site } from "@/lib/site";

/** Bilibili / 知乎暂无真实主页，先只展示已确认的链接 */
function BilibiliIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7.17 4.5 4.5 7.5m12.33-3 2.67 3M4 7.5h16a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V9A1.5 1.5 0 0 1 4 7.5Z" />
      <path d="M8.5 11.5v3m7-3v3" />
    </svg>
  );
}

const socials = [
  { label: "GitHub", href: "https://github.com/jiuming-666", Icon: Github },
  { label: "Bilibili", href: "#", Icon: BilibiliIcon },
];

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

        <Reveal delay={200}>
          <div className="mt-10 flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 backdrop-blur transition-all duration-200 hover:border-zinc-600 hover:text-zinc-100"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col gap-2 border-t border-zinc-900 pt-8 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {site.nameZh} ({site.nameEn}). Built with Next.js.</p>
          <p className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-neon" />
            {site.status}
          </p>
        </div>
      </div>
    </footer>
  );
}
