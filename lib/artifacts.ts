/**
 * 工程实拍证据（Proof of Artifacts）构建时检测
 *
 * 用法（仅在服务端组件中调用）：
 *   import { attachEvidence } from "@/lib/artifacts";
 *   const items = projects.map(attachEvidence);
 *
 * photo-N.jpg 存在 → available: true，页面直接展示该实拍图；
 * 不存在 → available: false，页面渲染骨架占位并提示应放置的文件名。
 */
import fs from "fs";
import path from "path";
import { artifactPath, type ArtifactSlot, type Project } from "./projects";

export type ResolvedArtifact = ArtifactSlot & {
  /** 页面可直接使用的图片路径 */
  src: string;
  /** 文件是否已放入 public 目录 */
  available: boolean;
};

export type ProjectWithEvidence = Omit<Project, "artifacts"> & {
  evidence: ResolvedArtifact[];
};

/** 检测单个项目的 4 个实拍图槽位 */
export function resolveEvidence(project: Project): ResolvedArtifact[] {
  return project.artifacts.map((slot) => ({
    ...slot,
    src: artifactPath(project.id, slot.slot),
    available: fs.existsSync(
      path.join(process.cwd(), "public", "projects", project.id, `photo-${slot.slot}.jpg`),
    ),
  }));
}

/** 给项目对象附加 evidence 字段（页面传入客户端组件前调用） */
export function attachEvidence<T extends Project>(project: T): ProjectWithEvidence {
  const { artifacts: _artifacts, ...rest } = project;
  return { ...rest, evidence: resolveEvidence(project) };
}
