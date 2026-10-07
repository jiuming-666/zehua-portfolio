/**
 * 项目数据集中配置文件：项目文案、图片、状态标签、规格数据均在此维护。
 */

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  /** 卡片封面大图 */
  cover: string;
  /** Deep Dive 弹窗中的多角度实拍图 */
  images: { src: string; caption: string }[];
  status: string[];
  tags: string[];
  /** 一句话硬核说明（用数据说话） */
  highlight: string;
  /** 研发过程细节描述（弹窗中展示） */
  deepDive: string;
  specs: { label: string; value: string }[];
  /** Bento Grid 尺寸：lg 下占几列 */
  span: "wide" | "normal";
  /** 是否在首页精选区展示 */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "spectral-colorimeter",
    title: "光谱彩色亮度计",
    subtitle: "Spectral Colorimeter · 整机研发",
    category: "仪器 / FPGA+MCU",
    cover:
      "https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?q=80&w=1600&auto=format&fit=crop",
    images: [
      {
        src: "https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?q=80&w=1600&auto=format&fit=crop",
        caption: "整机联调 · 光源色度检测",
      },
      {
        src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
        caption: "FPGA + STM32F427 双芯片架构",
      },
      {
        src: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1600&auto=format&fit=crop",
        caption: "LVGL 界面 · 双缓冲防撕裂调试",
      },
    ],
    status: ["100% 全链路参与", "已落地产线"],
    tags: ["HC2000 FPGA", "STM32F427", "Verilog", "LVGL", "C++/Qt"],
    highlight:
      "「FPGA采集 + MCU控制 + Qt上位机」三维架构，LVGL 双缓冲彻底解决高刷新率画面撕裂，自研上位机实现自动化测试",
    deepDive:
      "负责 FPGA 端基于 Verilog 状态机实现 CCD 传感器的精密驱动与高速采样；MCU 端利用 FMC 总线以 8080 并口驱动屏幕，通过 LVGL 结合双缓冲区机制解决高刷新率下光谱曲线绘制的画面撕裂；基于 C++/Qt 自研 PC 端测试上位机，实现光谱波形实时绘制、参数校准及自动化测试，大幅提升系统联调效率。",
    specs: [
      { label: "架构", value: "FPGA+MCU+Qt" },
      { label: "传感器", value: "CCD" },
      { label: "显示", value: "LVGL 双缓冲" },
      { label: "上位机", value: "C++/Qt 自研" },
    ],
    span: "wide",
    featured: true,
  },
  {
    id: "wireless-spectrometer",
    title: "无线光谱照度计",
    subtitle: "Wireless Spectrometer · 便携探头",
    category: "IoT / 异构芯片",
    cover:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1600&auto=format&fit=crop",
    images: [
      {
        src: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1600&auto=format&fit=crop",
        caption: "便携式光谱采集探头",
      },
      {
        src: "https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=1600&auto=format&fit=crop",
        caption: "CPLD 时序 · 零 CPU 占用采集验证",
      },
    ],
    status: ["100% 独立负责硬件+底层", "无线传输完整可靠"],
    tags: ["AG32 CPLD+MCU", "FreeRTOS", "DSP/FFT", "BLE/Wi-Fi", "Bootloader"],
    highlight:
      "CPLD 硬件逻辑生成精密时序，零 CPU 占用完成高频光谱采集；四路通信 + 断点续传协议，无线传输零丢包",
    deepDive:
      "负责探头硬件原理图/PCB 设计、样机调试及底层软件开发。利用 AG32 内置 CPLD 硬件逻辑生成传感器精密时序，零 CPU 占用完成高频光谱数据采集，配合 DMA 实现高效 Flash 存储；软件基于 FreeRTOS 架构，调用 DSP 库完成 FFT 实时频谱分析；构建 USB、串口及蓝牙/Wi-Fi（透传模式）多路通信架构，设计断点续传协议确保无线传输完整性，支持 Bootloader 固件升级。",
    specs: [
      { label: "芯片", value: "AG32 CPLD+MCU" },
      { label: "通信", value: "USB/串口/BLE/WiFi" },
      { label: "算法", value: "FFT 实时频谱" },
      { label: "升级", value: "Bootloader" },
    ],
    span: "normal",
    featured: true,
  },
];

export const navLinks = [
  { label: "项目", href: "#projects", en: "Projects" },
  { label: "技能栈", href: "#skills", en: "Skills" },
  { label: "关于我", href: "#about", en: "About" },
  { label: "联系", href: "#contact", en: "Contact" },
];
