"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export type LightboxArtifact = {
  src: string;
  caption: string;
  category: string;
  categoryZh: string;
};

/** 工程实拍全屏高清查看（Lightbox）：Esc / 点击空白关闭 */
export default function ArtifactsLightbox({
  artifact,
  onClose,
}: {
  artifact: LightboxArtifact | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!artifact) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [artifact, onClose]);

  if (!artifact) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[110] flex flex-col bg-zinc-950/95 backdrop-blur-lg"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="全屏查看工程实拍"
    >
      <div className="flex items-start justify-between gap-4 p-4 sm:px-8 sm:pt-6">
        <div>
          <span className="rounded border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
            {artifact.categoryZh} · {artifact.category}
          </span>
          <p className="mt-1.5 text-sm text-zinc-300">{artifact.caption}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="关闭"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div
        className="relative min-h-0 flex-1 px-4 pb-4 sm:px-8 sm:pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={artifact.src}
          alt={artifact.caption}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>
      <p className="pb-4 text-center text-[11px] text-zinc-600">
        按 Esc 或点击空白处关闭
      </p>
    </div>
  );
}
