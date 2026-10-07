import { Cpu, Code2, Wrench } from "lucide-react";
import Reveal from "@/components/Reveal";

/** 技能矩阵数据（与简历 lib/resume.ts 的 resumeSkills 同源，此处按类目重组展示） */
const groups = [
  {
    icon: Cpu,
    title: "芯片与硬件",
    en: "Chips & Hardware",
    items: [
      "STM32 (ARM) / AG32 (RISC-V) 系列芯片架构",
      "DMA、中断机制与时序控制",
      "SPI / I2C / UART / USB-CDC 总线外设驱动",
      "Altium Designer 原理图与 PCB 设计",
      "首板样机焊接、Bring-up 与软硬件联调",
    ],
  },
  {
    icon: Code2,
    title: "固件与软件",
    en: "Firmware & Software",
    items: [
      "嵌入式 C/C++ 固件开发",
      "FreeRTOS：多任务调度、信号量/队列、内存管理",
      "Bootloader 固件升级与无线断点续传协议设计",
      "ARM-DSP 库（FFT）实时频谱分析",
      "LVGL 图形界面移植与双缓冲优化 · C++/Qt 上位机",
    ],
  },
  {
    icon: Wrench,
    title: "调试与工具",
    en: "Debug & Lab Tools",
    items: [
      "示波器 / 逻辑分析仪 / SWD / JTAG 底层抓包",
      "电子负载与电源纹波、效率测试",
      "Verilog / FPGA 时序逻辑（MCU+FPGA 异构协同）",
      "数据与波形导向的疑难问题定位",
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
            不用进度条衡量能力——以下每一项，都对应着项目区的真实产出。
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
