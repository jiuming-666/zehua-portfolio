import Hero from "@/components/home/Hero";
import QuickNav from "@/components/home/QuickNav";
import Philosophy from "@/components/about/Philosophy";

/**
 * 首页 = 纯 Landing：只做自我介绍与站内导航。
 * 项目 → /projects · 智能体 → /agents · 简历 → /resume · 关于 → /about
 */
export default function Home() {
  return (
    <>
      <Hero />
      <QuickNav />
      <Philosophy />
    </>
  );
}
