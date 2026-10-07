import {
  Download,
  User,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Code2,
  FolderKanban,
  Flag,
} from "lucide-react";
import Reveal from "@/components/common/Reveal";
import {
  resumeBasics,
  resumeSkills,
  workExperience,
  resumeProjects,
  selfEvaluation,
} from "@/lib/resume";
import { site } from "@/lib/site";

/** /resume 页面：结构化在线简历（数据源 lib/resume.ts） */
export default function ResumeView() {
  return (
    <section className="mx-auto max-w-4xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      {/* 基本信息 */}
      <Reveal>
        <div className="flex flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
              {resumeBasics.name}
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              {resumeBasics.intent} · {resumeBasics.political}
            </p>
          </div>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white shadow-[0_0_24px_rgba(255,92,26,0.35)] transition-all duration-200 hover:bg-accent-soft"
          >
            <Download className="h-4 w-4" />
            下载简历 PDF
          </a>
        </div>
      </Reveal>

      {/* 联系信息条 */}
      <Reveal delay={80}>
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 sm:grid-cols-4">
          {[
            { Icon: User, label: resumeBasics.gender + " · " + resumeBasics.age + " 岁" },
            { Icon: MapPin, label: resumeBasics.location },
            { Icon: Phone, label: resumeBasics.phone },
            { Icon: Mail, label: resumeBasics.email },
          ].map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 bg-zinc-950/80 px-4 py-3.5"
            >
              <Icon className="h-4 w-4 shrink-0 text-accent" />
              <span className="truncate text-xs text-zinc-300">{label}</span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 专业技能 */}
      <Reveal delay={120}>
        <SectionTitle icon={Code2} title="专业技能" />
        <div className="mt-4 space-y-3">
          {resumeSkills.map((skill, i) => (
            <p
              key={i}
              className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4 text-sm leading-relaxed text-zinc-300"
            >
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
              {skill}
            </p>
          ))}
        </div>
      </Reveal>

      {/* 工作经历 */}
      <Reveal delay={160}>
        <SectionTitle icon={Briefcase} title="工作经历" />
        <div className="mt-4 space-y-5">
          {workExperience.map((job) => (
            <div
              key={job.company}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold tracking-tight text-zinc-50">
                  {job.company}
                  <span className="ml-2 text-sm font-normal text-accent">
                    {job.title}
                  </span>
                  <span className="ml-1 text-sm font-normal text-zinc-500">
                    | {job.field}
                  </span>
                </h3>
                <span className="text-xs text-zinc-500">{job.period}</span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {job.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-400"
                  >
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 项目经历 */}
      <Reveal delay={200}>
        <SectionTitle icon={FolderKanban} title="项目经历" />
        <div className="mt-4 space-y-5">
          {resumeProjects.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold tracking-tight text-zinc-50">
                  {p.name}
                </h3>
                <span className="text-xs text-zinc-500">{p.period}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-accent-soft">
                {p.stack}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 自我评价 */}
      <Reveal delay={240}>
        <SectionTitle icon={Flag} title="自我评价" />
        <p className="mt-4 rounded-2xl border border-accent/20 bg-accent/5 p-5 text-sm leading-relaxed text-zinc-300 sm:p-6">
          {selfEvaluation}
        </p>
        <p className="mt-6 text-center text-xs text-zinc-600">
          本页与 PDF 简历内容一致 · 最近更新 2026 · {site.location}
        </p>
      </Reveal>
    </section>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <h2 className="mt-12 flex items-center gap-2.5 text-lg font-semibold tracking-tight text-zinc-50">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/25 bg-accent/10">
        <Icon className="h-4 w-4 text-accent" />
      </span>
      {title}
    </h2>
  );
}
