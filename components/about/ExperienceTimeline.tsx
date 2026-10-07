"use client";

import { GitCommitHorizontal } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { workExperience } from "@/lib/resume";

/** /about 页：工作经历时间线（数据源 lib/resume.ts） */
export default function ExperienceTimeline() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Experience
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          工作经历
        </h2>
      </Reveal>

      <div className="relative mt-10 space-y-8 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-gradient-to-b before:from-accent/60 before:via-zinc-700 before:to-transparent sm:before:left-[9px]">
        {workExperience.map((job, i) => (
          <Reveal key={job.company} delay={i * 100}>
            <div className="relative pl-8 sm:pl-12">
              {/* 时间线节点 */}
              <span className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-accent/50 bg-zinc-950 sm:h-[19px] sm:w-[19px]">
                <GitCommitHorizontal className="h-3 w-3 text-accent" />
              </span>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur transition-colors duration-300 hover:border-zinc-700 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold tracking-tight text-zinc-50 sm:text-lg">
                    {job.company}
                    <span className="ml-2 text-sm font-normal text-accent">
                      {job.title}
                    </span>
                    <span className="ml-1 text-sm font-normal text-zinc-500">
                      | {job.field}
                    </span>
                  </h3>
                  <span className="rounded-full border border-zinc-800 bg-zinc-950/60 px-2.5 py-0.5 text-xs text-zinc-400">
                    {job.period}
                  </span>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {job.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-400"
                    >
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
