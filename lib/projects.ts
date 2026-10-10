/**
 * ─────────────────────────────────────────────────────────────────────
 *  项目数据集中配置（新增项目 = 复制一个对象，改 id 和文字即可）
 *
 *  工程实拍图（Proof of Artifacts）约定：
 *  每个项目在 /public/projects/<id>/ 下预留 4 张图：
 *    photo-1.jpg  实物整机/样机成品 (Hardware Prototype)
 *    photo-2.jpg  原理图 / PCB Layout (Altium Designer)
 *    photo-3.jpg  示波器 / 逻辑分析仪实测波形 (Waveform Debugging)
 *    photo-4.jpg  上位机 / 屏显 UI (Qt / LVGL Interface)
 *  把照片放进对应文件夹后重新部署即可自动展示，无需改代码。
 * ─────────────────────────────────────────────────────────────────────
 */

/** 工程实拍图槽位（纯数据；文件是否存在由 lib/artifacts.ts 构建时检测） */
export type ArtifactSlot = {
  slot: 1 | 2 | 3 | 4;
  /** 英文类目（图上角标） */
  category: string;
  /** 中文类目 */
  categoryZh: string;
  /** 工程图注（全屏查看时显示） */
  caption: string;
};

/** 项目所属维度：软硬件结合 / 硬件 / 嵌入式软件 / 上位机 */
export type Domain = "hw-sw" | "hw" | "sw" | "host";

export const domainLabels: Record<Domain, { title: string; en: string; desc: string }> = {
  "hw-sw": {
    title: "软硬件结合",
    en: "HW + SW Integrated",
    desc: "从原理图、底层驱动、FPGA 逻辑到人机界面的全链路交付",
  },
  hw: {
    title: "硬件设计",
    en: "Hardware Design",
    desc: "原理图、PCB、射频与时序的独立设计能力",
  },
  sw: {
    title: "嵌入式软件设计",
    en: "Embedded Software",
    desc: "嵌入式固件架构与底层算法的独立开发能力",
  },
  host: {
    title: "上位机设计",
    en: "Host Software Design",
    desc: "Qt 桌面级上位机：通信、界面与业务的一体化交付",
  },
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  /** 所属维度（/projects 页据此分四大板块） */
  domain: Domain;
  /** 卡片封面（若 photo-1.jpg 存在则自动被实拍图替代） */
  cover: string;
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
  /** 在职公司项目、涉密不放实拍图时置 true（弹窗显示保密说明卡） */
  confidential?: boolean;
  /** 封面使用项目名艺术字排版（涉密项目不配图时使用） */
  typo?: boolean;
  /** 工程实拍证据槽位（confidential 项目留空数组） */
  artifacts: ArtifactSlot[];
};

/** 生成工程实拍图的标准路径 */
export const artifactPath = (id: string, slot: number) =>
  `/projects/${id}/photo-${slot}.jpg`;

export const projects: Project[] = [
  {
    id: "wireless-spectrometer",
    title: "无线光谱照度计",
    subtitle: "Wireless Spectral Illuminance Meter",
    category: "IoT / 异构芯片",
    domain: "hw-sw",
    typo: true,
    cover:
      "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1600&auto=format&fit=crop",
    status: ["独立全链路交付", "无线 OTA 已验证"],
    tags: ["AG32 (MCU+CPLD)", "FreeRTOS", "ARM-DSP (FFT)", "多模无线通信", "Bootloader"],
    highlight:
      "CPLD 硬件逻辑生成传感器精密时序，零 CPU 占用完成高频光谱采集；USB/串口/蓝牙/Wi-Fi 四模通信 + 断点续传协议，支持无线 OTA 升级",
    deepDive:
      "独立负责原理图/PCB 设计、CPLD 逻辑、FreeRTOS 固件架构与软硬件联调。利用 AG32 内置 CPLD 硬件逻辑生成传感器精密时序，零 CPU 占用完成高频光谱数据采集，配合 DMA 实现高效 Flash 存储；软件基于 FreeRTOS 架构，调用 ARM-DSP 库完成 FFT 实时频谱分析；构建 USB、串口及蓝牙/Wi-Fi（透传模式）四模通信架构，设计断点续传协议确保无线传输完整性，并支持 Bootloader 无线 OTA 升级。",
    specs: [
      { label: "芯片", value: "AG32 MCU+CPLD" },
      { label: "通信", value: "4 模" },
      { label: "算法", value: "FFT 实时频谱" },
      { label: "升级", value: "无线 OTA" },
    ],
    span: "wide",
    featured: true,
    confidential: true,
    artifacts: [],
  },
  {
    id: "spectral-colorimeter",
    title: "光谱彩色亮度计",
    subtitle: "Spectral Color Luminance Meter",
    category: "仪器 / FPGA+MCU",
    domain: "hw-sw",
    typo: true,
    cover:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1600&auto=format&fit=crop",
    status: ["FPGA+MCU+Qt 三维架构", "已落地产线"],
    tags: ["HC2000 FPGA", "STM32F427", "LVGL 双缓冲", "FMC 并口", "C++/Qt 上位机"],
    highlight:
      "FPGA 驱动 CCD 精密高速采集；FMC 总线 8080 并口 + LVGL 双缓冲彻底消除曲线重绘撕裂；自研 Qt 自动化校准上位机",
    deepDive:
      "负责 FPGA 采样状态机编写、MCU 图形系统优化及 Qt 上位机全套开发。FPGA 端基于 Verilog 状态机实现 CCD 传感器精密驱动与高速采样；MCU 端利用 FMC 总线以 8080 并口驱动屏幕，通过 LVGL 结合双缓冲机制彻底解决高刷新率下光谱曲线重绘的画面撕裂；基于 C++/Qt 自研 PC 端自动化校准上位机，实现光谱波形实时绘制、参数校准及自动化测试，大幅提升系统联调效率。",
    specs: [
      { label: "架构", value: "FPGA+MCU+Qt" },
      { label: "传感器", value: "CCD" },
      { label: "显示", value: "LVGL 双缓冲" },
      { label: "上位机", value: "Qt 自动化校准" },
    ],
    span: "normal",
    featured: true,
    confidential: true,
    artifacts: [],
  },
  {
    id: "optical-flicker-analyzer",
    title: "十合一多功能光源频闪测试仪",
    subtitle: "10-in-1 Optical Flicker Analyzer",
    category: "检测仪器 / FPGA+DSP",
    domain: "hw-sw",
    typo: true,
    cover:
      "https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1600&auto=format&fit=crop",
    status: ["主导架构设计", "十项指标全通过"],
    tags: ["FPGA (Verilog)", "STM32 Cortex-M4", "FSMC 高速总线", "ARM-DSP", "光电模拟前端"],
    highlight:
      "FPGA 状态机驱动高速 ADC + 硬件均值滤波，STM32 经 FSMC 高速吞吐并运行加窗 FFT，精准计算 SVM、PstLM、频闪百分比等 10 项指标，系统底噪降低 25%",
    deepDive:
      "主导「FPGA 采集 + STM32 算法分析」架构设计、固件编写与高频模拟前端联调。FPGA 负责状态机驱动高速 ADC 及硬件均值滤波；STM32 经 FSMC 总线高速吞吐数据并运行加窗 FFT 算法，精准计算 SVM、PstLM、频闪百分比等 10 项严苛指标；期间深入排查光电转换微弱信号的阶跃响应问题，通过模拟前端优化将系统底噪降低 25%。",
    specs: [
      { label: "指标", value: "10 项" },
      { label: "总线", value: "FSMC 高速" },
      { label: "算法", value: "加窗 FFT" },
      { label: "底噪", value: "↓25%" },
    ],
    span: "wide",
    featured: true,
    confidential: true,
    artifacts: [],
  },
  {
    id: "hpcs-550-probe",
    title: "HPCS-550 高精度光谱分析仪智能探头",
    subtitle: "HPCS-550 Smart Spectrometer Probe",
    category: "工业探头 / CPLD 时序",
    domain: "sw",
    cover:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1600&auto=format&fit=crop",
    status: ["主导首板调测", "工业级稳定输出"],
    tags: ["AG32 异构芯片", "线性线阵 CCD", "纳秒级低抖动时序", "曝光自适应算法", "Modbus-RTU"],
    highlight:
      "CPLD 实现线阵 CCD 纳秒级转移脉冲与微秒级积分时序，消减暗电流与时钟抖动；二分法极速自适应曝光 + 温漂多项式校正，工业级稳定输出",
    deepDive:
      "主导智能探头硬件首板调测、CPLD 硬件时序设计与底层高精度自校准算法实现。利用 AG32 内部 CPLD 实现线阵 CCD 纳秒级转移脉冲与微秒级积分时序，从硬件层面消减暗电流与时钟抖动；MCU 端编写二分法极速自适应曝光算法与温漂多项式校正，保证探头在工业现场宽温宽光照条件下输出稳定、可复现的高精度光谱数据。",
    specs: [
      { label: "时序", value: "ns 级低抖动" },
      { label: "传感器", value: "线性线阵 CCD" },
      { label: "曝光", value: "二分法自适应" },
      { label: "接口", value: "Modbus-RTU" },
    ],
    span: "normal",
    featured: true,
    confidential: true,
    artifacts: [],
  },
  {
    id: "cat1-dual-sim-telemetry",
    title: "工业级 Cat.1 蜂窝物联网双卡冗余通信模组",
    subtitle: "Industrial LTE Cat.1 Dual-SIM Telemetry Core",
    category: "IoT / 射频硬件",
    domain: "hw",
    cover:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    status: ["独立硬件设计", "射频指标达标"],
    tags: ["Quectel EG915N", "50Ω 射频阻抗匹配", "eSIM+SIM 双卡冗余", "瞬态脉冲供电设计", "电平转换"],
    highlight:
      "Nano-SIM + 贴片 eSIM 双卡防掉线架构；针对 2A 脉冲发射电流设计低跌落稳压滤波电路；π 型天线匹配网络 + 50Ω 阻抗控制，实现 1.8V⇄3.3V/5V 双向电平转换",
    deepDive:
      "面向工业物联网与野外遥测场景的高可靠 4G 通信底板，基于 Quectel EG915N 独立完成整板设计。针对蜂窝模块 2A 瞬态脉冲发射电流，设计低跌落稳压与大容量储能滤波电路，杜绝发射瞬间的电压跌落复位；独立设计 Nano-SIM + 贴片 eSIM 双卡防掉线架构，保障野外弱网环境下的链路冗余；完成 π 型天线匹配网络调谐与全链路 50Ω 阻抗控制，并实现 1.8V 至 3.3V/5V 的双向电平转换，兼容主流 MCU 接口。",
    specs: [
      { label: "峰值电流", value: "2A 脉冲" },
      { label: "射频阻抗", value: "50Ω 受控" },
      { label: "冗余", value: "eSIM + SIM" },
      { label: "电平", value: "1.8/3.3/5V" },
    ],
    span: "wide",
    featured: true,
    artifacts: [
      { slot: 1, category: "Schematic", categoryZh: "原理图", caption: "模块化标注原理图 · 大电流供电 / 双卡电路 / 射频匹配 / 电平转换" },
      { slot: 2, category: "PCB Layout", categoryZh: "PCB走线", caption: "顶层/底层双层走线与 50Ω 阻抗铜箔实拍" },
      { slot: 3, category: "Prototype", categoryZh: "PCB实物", caption: "打样实物 PCB" },
    ],
  },
  {
    id: "edge-iot-master-controller",
    title: "工业级多路隔离式边缘物联网综合测控主板",
    subtitle: "Industrial Multi-Channel Isolated Edge-IoT Master Controller",
    category: "IoT / 工业主板",
    domain: "hw",
    cover:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1600&auto=format&fit=crop",
    status: ["独立硬件设计", "工业级 EMI 防护"],
    tags: [
      "STM32F407VET6",
      "4G-LTE",
      "12路光耦隔离 DI",
      "9路继电器驱动 DO",
      "JQ8400+8002A 语音",
      "双路 RS232",
    ],
    highlight:
      "面向户外复杂工业环境与无人值守终端：12 路全光耦隔离输入 + 9 路 ULN2003 继电器强电驱动阵列，ACM9070 共模电感 + TVS + 防反接的阶梯降压供电架构，极致抗电磁干扰",
    deepDive:
      "面向户外复杂工业环境与无人值守终端自研的高性能综合测控主板。供电级集成 ACM9070 共模电感、TVS 及防反接保护，经 DC-DC (XL1509) 与 LDO 阶梯降压，保证恶劣电源环境下的稳定输出；设计 12 路全光耦隔离输入与 9 路 ULN2003 继电器强电驱动阵列，具备极致的抗电磁干扰性能；板载双路 RS232 分别对接工业 HMI 触摸屏与 RFID 读卡模块，集成 Type-C 可更换的 JQ8400+8002A 语音播报系统，并经 4G-LTE 实现远程遥测链路。",
    specs: [
      { label: "隔离输入", value: "12 路 DI" },
      { label: "继电器", value: "9 路 DO" },
      { label: "总线", value: "双路 RS232" },
      { label: "供电防护", value: "TVS+防反接" },
    ],
    span: "wide",
    featured: true,
    artifacts: [
      { slot: 1, category: "Schematic", categoryZh: "原理图", caption: "整板模块化原理图 · 供电 / 隔离输入 / 继电器阵列 / 通信与语音" },
      { slot: 2, category: "PCB Layout", categoryZh: "PCB设计", caption: "双层 PCB Layout · 工业 EMI 滤波与隔离布局" },
      { slot: 3, category: "Prototype", categoryZh: "PCB实物", caption: "打样实物 PCB" },
    ],
  },
  {
    id: "spectrometer-host",
    title: "光谱仪光色校准上位机",
    subtitle: "Spectrometer Colorimetric Calibration Host App",
    category: "上位机 / Qt 6",
    domain: "host",
    typo: true,
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    status: ["独立开发", "产测 · 调试 · 回归全覆盖"],
    tags: [
      "C++",
      "Qt 6 Widgets",
      "SerialPort / Bluetooth / Network",
      "QCustomPlot",
      "多线程信号槽",
      "远程固件升级",
    ],
    highlight:
      "一套界面贯通串口 / 蓝牙 / USB / Wi-Fi TCP 四条链路：光谱与频闪测量定标、色温照度直读、远程固件升级与一键冒烟测试；协议收发独立线程，耗时操作不卡 UI，Windows 单 exe 直接交付",
    deepDive:
      "独立开发光谱仪上位机，用于产测和调试时与设备联机，完成测量、定标、升级和回归测试。界面、通信和业务都放在 Qt 上，一条链路从串口收到数据，可以直接刷新曲线和页面。用 Qt Widgets 搭整套工作站界面：光谱、频闪、升级、设备管理和冒烟测试分页切换，自定义标题栏、深色主题，光谱和波形用 QCustomPlot 绘图，结果表格和曲线在同一套界面里看。通信全部用 Qt 模块：SerialPort 走串口和 USB，Bluetooth 走蓝牙，Network 走 WiFi 的 TCP，四种口共用同一套收发，页面只订阅结果、不关心当前是哪条链路。协议收发放在独立线程，用信号槽把测量数据、定标进度和错误抛回界面，校零、定标、大包光谱等耗时操作不会卡住窗口，状态和曲线可以边收边画。完成光谱测量与定标、频闪测量与定标，在界面上直接给出色温、照度等光色结果，并支持曲线查看和导出。用 Qt 做设备参数管理、远程固件升级和一键冒烟测试，测试失败时把收发记录留在界面上，方便和固件对问题。最后用 Qt 自带的部署工具把依赖收齐，在 Windows 上打成一个可直接运行的 exe。",
    specs: [
      { label: "通信", value: "串口/蓝牙/WiFi" },
      { label: "绘图", value: "QCustomPlot" },
      { label: "升级", value: "远程固件" },
      { label: "交付", value: "Windows 单 exe" },
    ],
    span: "wide",
    featured: true,
    confidential: true,
    artifacts: [],
  },
];

