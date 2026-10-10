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
        description="项目按「软硬件结合 / 硬件设计 / 嵌入式软件设计 / 上位机设计」四大板块组织。公司在职项目受保密要求展示架构与成果，细节欢迎面试现场交流。"
      />
      <div className="pt-10">
        <ProjectsSection items={projects.map(attachEvidence)} />
      </div>
    </>
  );
}
