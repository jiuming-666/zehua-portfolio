import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ProjectsSection from "@/components/projects/ProjectsSection";
import { projects } from "@/lib/projects";
import { attachEvidence } from "@/lib/artifacts";

export const metadata: Metadata = {
  title: "实物项目",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects · Artifact Archive"
        icon={FolderKanban}
        title="实物项目档案"
        description="5 个整机级工程项目，覆盖「MCU+FPGA/CPLD 异构架构」「射频硬件」「光电精密测量」。每个项目均预留实物、原理图、波形、上位机四维工程证据。"
      />
      <ProjectsSection
        eyebrow="Full Archive"
        title="全部项目"
        description="点击分类标签即时筛选；点击「Deep Dive」滑动浏览工程实拍组图。"
        items={projects.map(attachEvidence)}
        filterable
      />
    </>
  );
}
