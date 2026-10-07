import type { Metadata } from "next";
import { User } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ExperienceTimeline from "@/components/about/ExperienceTimeline";
import Skills from "@/components/about/Skills";
import Philosophy from "@/components/about/Philosophy";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于我",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={`About · ${site.location}`}
        icon={User}
        title="关于我"
        description={`${site.nameZh}，${site.role}。${site.tagline}。坚持「数据与波形导向」，擅长借助逻辑分析仪等仪器排查软硬件交界处的疑难杂症。`}
      />
      <ExperienceTimeline />
      <Skills />
      <Philosophy />
    </>
  );
}
