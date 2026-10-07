/**
 * 简历结构化数据（与 /resume 页面一一对应）
 * 更新简历时只需修改本文件，页面自动渲染。
 */

export const resumeBasics = {
  name: "蒋泽华",
  gender: "男",
  age: "25",
  location: "浙江省杭州市",
  political: "中共党员",
  phone: "19294554827",
  email: "909969231@qq.com",
  intent: "嵌入式软硬件工程师",
};

export const resumeSkills = [
  "熟悉 C/C++ 语言编程，掌握 STM32(ARM) / AG32(RISC-V) 系列芯片架构；深入理解 DMA、中断机制及时序控制；熟练驱动 SPI、I2C、UART、USB-CDC 等总线外设。",
  "掌握 FreeRTOS 内核机制，具备多任务调度、信号量/队列通信、内存管理及并发逻辑开发能力；具备 Bootloader 固件升级与无线断点续传协议设计经验。",
  "具备软硬件联合调试能力。熟练使用示波器、逻辑分析仪、SWD/JTAG 进行底层协议抓包、代码优化与 Bug 快速定位；掌握 Altium Designer 原理图与 PCB 设计，能独立完成样机联调。",
  "了解 Verilog/FPGA 时序逻辑开发，具备「MCU+FPGA」异构架构协同开发经验；掌握 ARM-DSP 库（如 FFT 算法）及 LVGL 图形界面移植与双缓冲优化。",
];

export type WorkExperience = {
  period: string;
  company: string;
  title: string;
  field: string;
  bullets: string[];
};

export const workExperience: WorkExperience[] = [
  {
    period: "2025.01 - 至今",
    company: "浙江虹谱光色科技有限公司",
    title: "嵌入式软硬件工程师",
    field: "光谱仪",
    bullets: [
      "软件与界面开发：基于 STM32/AG32 进行传感器驱动与数据采集开发，并利用 Linux Qt / LVGL 构建人机交互界面；",
      "FPGA 逻辑设计：负责 FPGA 端传感器驱动与采样逻辑编写，优化「MCU+FPGA」通信时序，保障高频采集；",
      "硬件设计与联调：负责原理图与 PCB 绘制，主导首板样机软硬件联调，定位并解决底层驱动与通信稳定性故障。",
    ],
  },
  {
    period: "2024.09 - 2024.12（实习）",
    company: "杭州得明电子有限公司",
    title: "硬件助理工程师",
    field: "开关电源",
    bullets: [
      "样机制作与改版：辅助完成电源改版，负责 BOM 核对，并独立完成首板样机的器件焊接与通电 Bring-up；",
      "性能与测试验证：熟练运用示波器与电子负载，完成电源输出纹波、转换效率等指标测试，输出测试报告；",
      "故障排查与优化：协助排查样机调试中的波形异常与发热问题，配合工程师完成电路优化，提升电源稳定性。",
    ],
  },
  {
    period: "2022.10 - 2023.09（实习）",
    company: "杭州汇誉新能源科技有限公司",
    title: "嵌入式软件工程师",
    field: "充电桩",
    bullets: [
      "根据公司充电桩产品控制系统的需求，完成功能设计、编码实现等开发工作；",
      "负责对疑难问题的跟踪和解决；",
      "协助硬件工程师完成硬件的调试；",
      "负责整体软件系统的功能调试与集成测试工作。",
    ],
  },
];

export type ResumeProject = {
  period: string;
  name: string;
  stack: string;
  description: string;
};

export const resumeProjects: ResumeProject[] = [
  {
    period: "2026.02 - 2026.06",
    name: "光谱彩色亮度计",
    stack: "HC2000 FPGA | STM32F427 | LVGL | 8080并口/双缓冲 | C++/Qt 上位机",
    description:
      "用于光源亮度、色温及色度测量的高精度检测设备，采用「FPGA采集 + MCU控制 + Qt上位机」三维架构。负责 FPGA 端基于 Verilog 状态机实现 CCD 传感器的精密驱动与高速采样；MCU 端利用 FMC 总线以 8080 并口驱动屏幕，通过 LVGL 结合双缓冲区机制，彻底解决高刷新率下光谱曲线绘制的画面撕裂问题；基于 C++/Qt 自研 PC 端测试上位机，实现光谱波形实时绘制、参数校准及自动化测试，极大提升系统联调效率。",
  },
  {
    period: "2025.05 - 2025.07",
    name: "无线光谱照度计",
    stack: "AG32（CPLD+MCU） | FreeRTOS | DSP库 | 串口/USB/蓝牙/Wi-Fi | SPI/UART DMA | Bootloader",
    description:
      "基于 AG32（CPLD+MCU）异构芯片的高精度便携式光谱采集探头。负责探头硬件原理图/PCB 设计、样机调试及底层软件开发；利用 AG32 内置 CPLD 硬件逻辑生成传感器精密时序，零 CPU 占用完成高频光谱数据采集，配合 DMA 实现高效 Flash 存储；软件基于 FreeRTOS 架构，调用 DSP 库完成 FFT 实时频谱分析；构建 USB、串口及蓝牙/Wi-Fi（透传模式）多路通信架构，设计断点续传协议确保无线传输完整性，并支持 Bootloader 固件升级。",
  },
];

export const selfEvaluation =
  "具备软硬件双重视角的嵌入式工程师。技术上不仅限于写代码，更具备从原理图设计、底层驱动、FPGA 逻辑到 LVGL/Qt 界面的全链路交付能力。工程习惯上，坚持「数据与波形导向」，擅长借助逻辑分析仪等仪器排查软硬件交界处的疑难杂症。";
