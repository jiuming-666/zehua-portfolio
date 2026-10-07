import type { Metadata } from "next";
import ProjectsSection from "@/components/Projects";
import { projects } from "@/lib/projects";
import { attachEvidence } from "@/lib/artifacts";

export const metadata: Metadata = {
  title: "实物项目",
};

export default function ProjectsPage() {
  return <ProjectsSection items={projects.map(attachEvidence)} />;
}
