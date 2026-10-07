"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ImageOff, X, ZoomIn } from "lucide-react";
import type { ProjectWithEvidence } from "@/lib/artifacts";
import ArtifactsLightbox, {
  type LightboxArtifact,
} from "@/components/projects/ArtifactsLightbox";

/** Deep Dive 弹窗：工程实拍组图（滑动浏览 + 点击全屏）+ 研发过程 + 硬核规格 */
export default function DeepDiveModal({
  project,
  onClose,
}: {
  project: ProjectWithEvidence | null;
  onClose: () => void;
}) {
  const [lightbox, setLightbox] = useLightboxState();

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !lightbox) onClose();
    },
    [onClose, lightbox],
  );

  useEffect(() => {
    if (!project) return;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
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
        <button
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950/70 text-zinc-300 backdrop-blur transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto sm:max-h-[88vh]">
          {/* ── Proof of Artifacts：工程实拍组图，横向滑动 ── */}
          <div className="border-b border-zinc-800 bg-zinc-900/40 py-4">
            <p className="mb-3 px-5 text-[11px] font-medium uppercase tracking-[0.2em] text-accent sm:px-6">
              Proof of Artifacts · 工程实拍组图（左右滑动）
            </p>
            <div className="flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:px-6">
              {project.evidence.map((art) => (
                <EvidenceCard
                  key={art.slot}
                  projectId={project.id}
                  art={art}
                  onZoom={() => setLightbox(art)}
                />
              ))}
            </div>
          </div>

          {/* ── 项目详情 ── */}
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

      {/* 全屏高清查看 */}
      <ArtifactsLightbox
        artifact={lightbox}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}

/* ── 单张工程实拍：骨架占位 / 可放大实拍 ── */
function EvidenceCard({
  projectId,
  art,
  onZoom,
}: {
  projectId: string;
  art: ProjectWithEvidence["evidence"][number];
  onZoom: () => void;
}) {
  return (
    <figure className="w-[78%] shrink-0 snap-center sm:w-[46%]">
      {art.available ? (
        <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-800">
          <Image
            src={art.src}
            alt={art.caption}
            fill
            sizes="(max-width: 640px) 80vw, 340px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/0 opacity-0 transition-all duration-200 group-hover:bg-zinc-950/40 group-hover:opacity-100">
            <span className="flex items-center gap-1.5 rounded-full border border-zinc-600 bg-zinc-950/80 px-3 py-1.5 text-xs text-zinc-200 backdrop-blur">
              <ZoomIn className="h-3.5 w-3.5" />
              点击全屏查看
            </span>
          </div>
          <button
            onClick={onZoom}
            aria-label={`全屏查看：${art.caption}`}
            className="absolute inset-0 cursor-zoom-in"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700/80 bg-zinc-900/60">
          <ImageOff className="h-6 w-6 text-zinc-600" />
          <p className="text-xs text-zinc-500">工程实拍待补充</p>
          <code className="rounded bg-zinc-950/80 px-2 py-0.5 text-[10px] text-zinc-500">
            {`projects/${projectId}/photo-${art.slot}.jpg`}
          </code>
        </div>
      )}
      <figcaption className="mt-2.5">
        <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
          {art.categoryZh}
        </span>
        <span className="ml-1.5 text-[11px] text-zinc-500">{art.category}</span>
        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
          {art.caption}
        </p>
      </figcaption>
    </figure>
  );
}

/* ── Lightbox 状态 hook ── */
function useLightboxState() {
  return useState<LightboxArtifact | null>(null);
}
