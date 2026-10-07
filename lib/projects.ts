/**
 * ─────────────────────────────────────────────────────────────────────────
 *  项目数据集中在这里。后续替换成你自己的真实实物照片时：
 *  1. 把照片放进 /public/projects/<项目名>/ 目录（或换成你自己的图床 URL）
 *  2. 修改下面每个项目的 cover / images 字段
 *  3. 文案、状态标签、技术栈标签按需增删即可，网格布局会自动适应
 * ─────────────────────────────────────────────────────────────────────────
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
};

export const projects: Project[] = [
  {
    id: "quadruped",
    title: "四足仿生机器人",
    subtitle: "Quadruped Robot · v3",
    category: "Robotics",
    cover:
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=1600&auto=format&fit=crop",
    images: [
      {
        src: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=1600&auto=format&fit=crop",
        caption: "整机装配 · 第三代结构",
      },
      {
        src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
        caption: "主控 PCB · 双层板自绘走线",
      },
      {
        src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
        caption: "实验室步态调试现场",
      },
    ],
    status: ["100% 独立研发", "运行正常"],
    tags: ["STM32", "Altium Designer", "3D Printing", "C++"],
    highlight: "从0到1完成结构设计与PCB打样，12自由度运动学解算，待机功耗降低 40%",
    deepDive:
      "三代迭代：v1 验证舵机方案，v2 重构电源与运动学，v3 采用自研主控板 + IMU 闭环姿态补偿。全部结构件自行建模并 3D 打印，运动学解算与步态规划固件约 6000 行 C++ 代码，全部手写。",
    specs: [
      { label: "自由度", value: "12 DoF" },
      { label: "主控", value: "STM32F407" },
      { label: "续航", value: "90 min" },
      { label: "迭代版本", value: "v1 → v3" },
    ],
    span: "wide",
  },
  {
    id: "iot-greenhouse",
    title: "智能温室监测系统",
    subtitle: "IoT Environmental Station",
    category: "IoT / Embedded",
    cover:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    images: [
      {
        src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
        caption: "传感器节点主板 · 已投产 20 片",
      },
      {
        src: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1600&auto=format&fit=crop",
        caption: "LoRa 长距离链路实测",
      },
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
        caption: "云端数据看板",
      },
    ],
    status: ["已投产", "已部署运行 8 个月"],
    tags: ["ESP32", "LoRa", "Python", "React"],
    highlight:
      "6 节点组网 + 云端看板全栈交付，LoRa 视距通信 2.1km，误码率 < 0.3%",
    deepDive:
      "从传感器选型、电源树设计到外壳注塑替代方案（3D 打印 + 后处理）独立完成。自建 MQTT → 时序数据库 → Web 看板的数据链路，前端使用 React 实现 10s 级实时刷新。",
    specs: [
      { label: "节点数", value: "6 nodes" },
      { label: "通信距离", value: "2.1 km" },
      { label: "采集周期", value: "10 s" },
      { label: "运行时长", value: "8 mo+" },
    ],
    span: "normal",
  },
  {
    id: "portable-instrument",
    title: "手持式信号分析仪",
    subtitle: "Portable Signal Analyzer",
    category: "Instrumentation",
    cover:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1600&auto=format&fit=crop",
    images: [
      {
        src: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1600&auto=format&fit=crop",
        caption: "整机与测试工装",
      },
      {
        src: "https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=1600&auto=format&fit=crop",
        caption: "模拟前端调试 · 示波器实测",
      },
    ],
    status: ["100% 独立研发", "功能验证通过"],
    tags: ["Altium Designer", "STM32", "C", "Signal Processing"],
    highlight: "4 通道采集，最高 2MSa/s 采样率，BOM 成本控制在商用方案 1/6",
    deepDive:
      "自研模拟前端（程控增益 + 抗混叠滤波）与 DMA 高速采样链路。使用逻辑分析仪与示波器完成全套时序验证，机壳采用 CNC 加工铝合金外壳。",
    specs: [
      { label: "通道", value: "4 CH" },
      { label: "采样率", value: "2 MSa/s" },
      { label: "成本", value: "1/6 商用" },
    ],
    span: "normal",
  },
  {
    id: "cnc-fabrication",
    title: "桌面级 CNC 工装平台",
    subtitle: "Desktop CNC Workbench",
    category: "Fabrication",
    cover:
      "https://images.unsplash.com/photo-1563520239648-a24e51d4b570?q=80&w=1600&auto=format&fit=crop",
    images: [
      {
        src: "https://images.unsplash.com/photo-1563520239648-a24e51d4b570?q=80&w=1600&auto=format&fit=crop",
        caption: "整机刚性测试",
      },
      {
        src: "https://images.unsplash.com/photo-1615947914616-65cc1c1b9dc2?q=80&w=1600&auto=format&fit=crop",
        caption: "G代码加工现场",
      },
    ],
    status: ["在役使用", "重复定位 ±0.05mm"],
    tags: ["SolidWorks", "GRBL", "CNC", "Arduino"],
    highlight: "自建加工能力闭环，作品集内全部样机外壳均由该平台完成",
    deepDive:
      "为解决样机外壳与结构件的外协周期问题，自建桌面 CNC 平台：SolidWorks 结构设计 → GRBL 固件定制 → 加工参数库沉淀，将单件外壳交付周期从 2 周压缩到 1 天。",
    specs: [
      { label: "行程", value: "300×300mm" },
      { label: "定位精度", value: "±0.05 mm" },
      { label: "主轴", value: "500 W" },
    ],
    span: "wide",
  },
];

export const navLinks = [
  { label: "项目", href: "#projects", en: "Projects" },
  { label: "技能栈", href: "#skills", en: "Skills" },
  { label: "关于我", href: "#about", en: "About" },
  { label: "联系", href: "#contact", en: "Contact" },
];
