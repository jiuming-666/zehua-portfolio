import Hero from "@/components/Hero";
import ProjectsSection from "@/components/Projects";
import Philosophy from "@/components/Philosophy";
import { projects } from "@/lib/projects";
import { attachEvidence } from "@/lib/artifacts";

export default function Home() {
  const items = projects
    .filter((p) => p.featured)
    .map(attachEvidence);

  return (
    <>
      <Hero />
      {/* 首页仅展示精选项目，完整列表见 /projects */}
      <ProjectsSection
        eyebrow="Selected Artifacts"
        title="精选实物项目"
        description="每个项目都有真实的电路、波形与整机支撑。点击「Deep Dive」查看多角度工程实拍与研发过程。"
        items={items}
        viewAll
      />
      <Philosophy />
    </>
  );
}
