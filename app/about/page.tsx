import type { Metadata } from "next";
import Skills from "@/components/Skills";
import Philosophy from "@/components/Philosophy";

export const metadata: Metadata = {
  title: "关于我",
};

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-32 sm:px-8 sm:pt-40">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          About Me
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
          技术理念与能力全景
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          从原理图到固件再到人机界面——以下是我完整的技术版图。
        </p>
      </div>
      <Skills />
      <Philosophy />
    </>
  );
}
