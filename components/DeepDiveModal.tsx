"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { Project } from "@/lib/projects";

/** Deep Dive 弹窗：多角度实拍 + 研发过程 + 硬核规格数据 */
export default function DeepDiveModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!project) return;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden"; // 锁定背景滚动
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [project, handleKey]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-zinc-950/80 backdrop-blur-md sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        className="animate-scale-in relative my-auto w-full max-w-3xl overflow-hidden rounded-t-2xl border border-zinc-800 bg-zinc-950 shadow-2xl sm:my-0 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950/70 text-zinc-300 backdrop-blur transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto sm:max-h-[88vh]">
          {/* 多角度实拍 */}
          <div className="grid gap-px bg-zinc-800 sm:grid-cols-2">
            {project.images.map((img, i) => (
              <figure
                key={img.src}
                className={`relative aspect-[4/3] bg-zinc-900 ${
                  i === 0 ? "sm:col-span-2" : ""
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950/85 to-transparent px-4 pb-2.5 pt-8 text-xs text-zinc-300">
                  {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          {/* 详情 */}
          <div className="p-6 sm:p-8">
            <p className="text-[11px] uppercase tracking-widest text-zinc-500">
              {project.subtitle} · {project.category}
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-zinc-50">
              {project.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              {project.deepDive}
            </p>

            {/* 硬核规格数据 */}
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {project.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-3"
                >
                  <dd className="text-base font-semibold tracking-tight text-accent">
                    {spec.value}
                  </dd>
                  <dt className="mt-0.5 text-[11px] text-zinc-500">
                    {spec.label}
                  </dt>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-zinc-800 bg-zinc-950/60 px-2 py-0.5 text-[11px] text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
