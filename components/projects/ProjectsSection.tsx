"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import DeepDiveModal from "@/components/projects/DeepDiveModal";
import { projects, type Project } from "@/lib/projects";
import type { ProjectWithEvidence } from "@/lib/artifacts";

type ProjectsSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** 展示的项目列表（须先经服务端 attachEvidence 处理） */
  items: ProjectWithEvidence[];
  viewAll?: boolean;
  /** 是否显示分类筛选器（/projects 页启用） */
  filterable?: boolean;
};

/**
 * 项目展示区块（Bento Grid + Deep Dive 弹窗）
 * 首页传精选子集 + viewAll；/projects 页传全量。
 */
export default function ProjectsSection({
  eyebrow = "Selected Artifacts",
  title = "实物项目展示",
  description = "不承诺、不包装——每一个项目都有真实的电路、波形与整机支撑。点击「Deep Dive」查看多角度工程实拍与研发过程。",
  items,
  viewAll = false,
  filterable = false,
}: ProjectsSectionProps) {
  const [active, setActive] = useState<ProjectWithEvidence | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("全部");

  // 从数据自动归纳分类（加新项目无需维护此列表）
  const categories = [
    "全部",
    ...Array.from(new Set(items.map((p) => p.category))),
  ];
  const visible =
    activeCategory === "全部"
      ? items
      : items.filter((p) => p.category === activeCategory);

  return (
    <section
      id="projects"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32"
    >
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          {description}
        </p>
      </Reveal>

      {/* 分类筛选器 */}
      {filterable && (
        <Reveal delay={250}>
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-accent font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.3)]"
                    : "border border-zinc-800 bg-zinc-900/50 text-zinc-400 backdrop-blur hover:border-zinc-700 hover:text-zinc-100"
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="ml-auto hidden items-center text-xs text-zinc-600 sm:flex">
              {visible.length} / {items.length} 个项目
            </span>
          </div>
        </Reveal>
      )}

      {/* Bento Grid */}
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => (
          <Reveal
            key={project.id}
            delay={(i % 3) * 100}
            className={project.span === "wide" ? "lg:col-span-2" : ""}
          >
            <ProjectCard project={project} onOpen={() => setActive(project)} />
          </Reveal>
        ))}
      </div>

      {viewAll && (
        <Reveal delay={150}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-6 py-3 text-sm font-medium text-zinc-300 backdrop-blur transition-all duration-200 hover:border-zinc-700 hover:text-zinc-100"
            >
              查看全部项目与研发细节
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      )}

      <DeepDiveModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}

/* ────────────────────────── 项目卡片 ────────────────────────── */

function ProjectCard({
  project,
  onOpen,
}: {
  project: ProjectWithEvidence;
  onOpen: () => void;
}) {
  // photo-1（实物整机）存在时自动作为封面，否则退回数据里的 cover 占位图
  const prototype = project.evidence.find((e) => e.slot === 1);
  const coverSrc = prototype?.available ? prototype.src : project.cover;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/70">
      {/* 封面大图：悬停平滑微放大 */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={coverSrc}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
        {/* 状态标签 */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {project.status.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-full border border-neon/30 bg-zinc-950/70 px-2.5 py-1 text-[10px] font-medium text-neon backdrop-blur"
            >
              <BadgeCheck className="h-3 w-3" />
              {s}
            </span>
          ))}
        </div>
        <span className="absolute right-3 top-3 rounded-full border border-zinc-700 bg-zinc-950/70 px-2.5 py-1 text-[10px] uppercase tracking-widest text-zinc-300 backdrop-blur">
          {project.category}
        </span>
      </div>

      {/* 内容 */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-widest text-zinc-500">
          {project.subtitle}
        </p>
        <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-50 sm:text-xl">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {project.highlight}
        </p>

        {/* 技术栈标签 */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-zinc-800 bg-zinc-950/60 px-2 py-0.5 text-[11px] text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors duration-200 hover:text-accent-soft"
          >
            查看工程实拍与研发过程 (Deep Dive)
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export type { Project };
