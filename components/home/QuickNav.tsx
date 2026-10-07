import Link from "next/link";
import { LayoutGrid, FileText, User, FolderKanban } from "lucide-react";
import Reveal from "@/components/common/Reveal";

const tiles = [
  {
    href: "/projects",
    icon: FolderKanban,
    title: "实物项目",
    en: "Projects",
    desc: "5 个整机级项目，含工程实拍证据与研发过程",
  },
  {
    href: "/resume",
    icon: FileText,
    title: "在线简历",
    en: "Resume",
    desc: "技能、经历与项目一页速览，附 PDF 下载",
  },
  {
    href: "/about",
    icon: User,
    title: "关于我",
    en: "About",
    desc: "工作经历时间线、技术理念与能力全景",
  },
  {
    href: "#contact",
    icon: LayoutGrid,
    title: "联系方式",
    en: "Contact",
    desc: "页面底部可直接邮件或电话联系",
  },
];

/** 首页四宫格入口导览：让每个选项卡都有清晰的入口 */
export default function QuickNav() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Site Map
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          站内导航
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile, i) => {
          const isExternal = tile.href.startsWith("#");
          const Wrapper = isExternal ? "a" : Link;
          return (
            <Reveal key={tile.title} delay={i * 80}>
              <Wrapper
                href={tile.href}
                className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-zinc-900/80"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-accent/10">
                  <tile.icon className="h-5 w-5 text-accent" />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-zinc-50">
                  {tile.title}
                  <span className="ml-1.5 text-[10px] uppercase tracking-widest text-zinc-600">
                    {tile.en}
                  </span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {tile.desc}
                </p>
              </Wrapper>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
