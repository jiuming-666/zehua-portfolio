import type { Metadata } from "next";
import ProjectsSection from "@/components/Projects";

export const metadata: Metadata = {
  title: "实物项目",
};

export default function ProjectsPage() {
  return <ProjectsSection />;
}
