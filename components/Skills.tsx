import { Cpu, Code2, Wrench } from "lucide-react";
import Reveal from "@/components/Reveal";

const groups = [
  {
    icon: Cpu,
    title: "硬件与机械",
    en: "Hardware & Fabrication",
    items: [
      "PCB 设计（Altium Designer / 嘉立创EDA）",
      "单片机系统（STM32 / ESP32 / Arduino）",
      "3D 建模与打印（SolidWorks / FDM / 光固化）",
      "CNC 加工与工装设计",
      "整机装配、调试与可靠性验证",
    ],
  },
  {
    icon: Code2,
    title: "软件与算法",
    en: "Software & Firmware",
    items: [
      "嵌入式 C / C++ 固件开发",
      "Python（数据处理、上位机、自动化测试）",
      "AI 工具链辅助研发（代码生成 / 视觉方案）",
      "前端全栈（React / Next.js / Node.js）",
    ],
  },
  {
    icon: Wrench,
    title: "研发工具",
    en: "Lab Tools",
    items: [
      "示波器 / 逻辑分析仪 / 电源负载测试",
      "Git 版本管理与硬件工程文档沉淀",
      "SolidWorks 仿真与结构验证",
      "万用表 · 焊台 · 回流焊 · 复测工装",
    ],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative border-t border-zinc-900 bg-surface/40 py-24 scroll-mt-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Engineering Stack
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
            技能与工具矩阵
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            不用进度条衡量能力——以下每一项，都对应着上面项目区的真实产出。
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {groups.map((group, i) => (
            <Reveal key={group.title} delay={i * 100}>
              <div className="h-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition-colors duration-300 hover:border-zinc-700 sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10">
                  <group.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-zinc-50">
                  {group.title}
                </h3>
                <p className="mt-0.5 text-[11px] uppercase tracking-widest text-zinc-500">
                  {group.en}
                </p>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-400"
                    >
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
