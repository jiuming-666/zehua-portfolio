"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  BadgeCheck,
  Bot,
  CircuitBoard,
  Cpu,
  Monitor,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/common/Reveal";
import DeepDiveModal from "@/components/projects/DeepDiveModal";
import type { Domain } from "@/lib/projects";
import { domainLabels } from "@/lib/projects";
import type { ProjectWithEvidence } from "@/lib/artifacts";

const domainIcons: Record<Domain, LucideIcon> = {
  "hw-sw": CircuitBoard,
  hw: Cpu,
  sw: Bot,
  host: Monitor,
};

/** 四大板块的展示顺序 */
const domainOrder: Domain[] = ["hw-sw", "hw", "sw", "host"];

type ProjectsSectionProps = {
  /** 展示的项目列表（须先经服务端 attachEvidence 处理） */
  items: ProjectWithEvidence[];
};

/**
 * /projects 页主体：按「软硬件结合 / 硬件设计 / 嵌入式软件设计 / 上位机设计」四大板块分组展示。
 * 纯数据驱动——新项目在 lib/projects.ts 里标 domain 字段即自动归组。
 */
export default function ProjectsSection({
  items,
}: ProjectsSectionProps) {
  const [active, setActive] = useState<ProjectWithEvidence | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      {domainOrder.map((domain, i) => {
        const group = items.filter((p) => p.domain === domain);
        const label = domainLabels[domain];
        const Icon = domainIcons[domain];
        return (
          <div key={domain} className={i > 0 ? "mt-20" : ""}>
            {/* 板块标题 */}
            <Reveal>
              <div className="flex items-end justify-between gap-4 border-b border-zinc-800 pb-5">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/25 bg-accent/10">
                    <Icon className="h-6 w-6 text-accent" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
                      {label.title}
                      <span className="ml-2 text-xs font-normal uppercase tracking-widest text-zinc-600">
                        {label.en}
                      </span>
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">{label.desc}</p>
                  </div>
                </div>
                <span className="hidden shrink-0 text-xs text-zinc-600 sm:block">
                  {group.length} 个项目
                </span>
              </div>
            </Reveal>

            {/* 板块内容 */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((project, j) => (
                <Reveal
                  key={project.id}
                  delay={(j % 3) * 100}
                  className={
                    project.span === "wide" && group.length > 1
                      ? "lg:col-span-2"
                      : ""
                  }
                >
                  <ProjectCard
                    project={project}
                    onOpen={() => setActive(project)}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        );
      })}

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
      {/* 封面：涉密项目用艺术字排版，否则显示图片（悬停微放大） */}
      <div
        className={`relative aspect-[16/10] overflow-hidden ${
          project.typo
            ? "bg-gradient-to-br from-zinc-900 via-zinc-950 to-black"
            : ""
        }`}
      >
        {project.typo ? (
          <>
            <div className="bg-grid absolute inset-0" />
            <div className="pointer-events-none absolute -bottom-14 -right-14 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-6 text-center">
              <span className="text-[10px] uppercase tracking-[0.3em] text-accent">
                {project.subtitle}
              </span>
              <span className="text-xl font-bold leading-snug tracking-tight text-zinc-100 sm:text-2xl">
                {project.title}
              </span>
              <span className="mt-1 h-px w-12 bg-gradient-to-r from-transparent via-accent to-transparent" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
          </>
        ) : (
          <>
            <Image
              src={coverSrc}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
          </>
        )}
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
            {project.confidential
              ? "查看项目详情 (Deep Dive)"
              : "查看工程实拍与研发过程 (Deep Dive)"}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
