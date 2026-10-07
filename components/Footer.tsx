import { Mail, Github, Linkedin } from "lucide-react";
import Reveal from "@/components/Reveal";

/** Bilibili / 知乎没有官方 Lucide 图标，用简洁内联 SVG 代替 */
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

function ZhihuIcon({ className }: { className?: string }) {
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
      <path d="M13 4.5v13.5M13 4.5H5.5A1.5 1.5 0 0 0 4 6v2.5m9-4h5.5A1.5 1.5 0 0 1 20 6v12a1.5 1.5 0 0 1-1.5 1.5H13m-9-8.5 2 9.5m1.5-6.5h4l-1 6.5" />
    </svg>
  );
}

const socials = [
  { label: "GitHub", href: "https://github.com/jiuming-666", Icon: Github },
  {
    label: "Bilibili",
    href: "#contact",
    Icon: BilibiliIcon,
  },
  { label: "知乎", href: "#contact", Icon: ZhihuIcon },
  {
    label: "LinkedIn",
    href: "#contact",
    Icon: Linkedin,
  },
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
            无论是硬件研发岗位、项目合作，还是纯粹想聊聊工程实现，欢迎随时联系。
          </p>
        </Reveal>

        <Reveal delay={120}>
          <a
            href="mailto:hi@zehuajiang.com"
            className="group mt-8 inline-flex items-center gap-3 text-xl font-medium tracking-tight text-zinc-100 transition-colors hover:text-accent sm:text-2xl"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur transition-colors group-hover:border-accent/40">
              <Mail className="h-5 w-5 text-accent" />
            </span>
            hi@zehuajiang.com
          </a>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
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
          <p>© 2025 Jiang Zehua. Built with Next.js &amp; AI.</p>
          <p className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-neon" />
            Available for opportunities
          </p>
        </div>
      </div>
    </footer>
  );
}
