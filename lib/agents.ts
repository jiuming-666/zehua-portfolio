/**
 * 智能体数据集中配置（与 lib/projects.ts 同一套范式）
 * 新增智能体 = 复制一个对象，改 id 和文字即可；导航与 /agents 页面自动更新。
 */

export type Agent = {
  id: string;
  name: string;
  nameEn: string;
  /** 一句话定位 */
  desc: string;
  /** 核心能力列表 */
  capabilities: string[];
  stack: string[];
  /** 状态标签 */
  status: string;
  /** 代码仓库（可选，开源后填写） */
  repoUrl?: string;
};

export const agentsPlatform = {
  name: "智能体乐园 · 多智能体工作台",
  nameEn: "Agent Playground",
  desc: "从零实现的多智能体平台：ReAct 循环框架 + 真实浏览器抓取 + 本地 RAG 知识库。四层架构单向依赖，接入新智能体只需注册一行，框架层零改动。",
  highlights: [
    "ReAct 循环：思考 → 行动 → 观察 → 回答，数据全部来自工具真实返回",
    "真实浏览器抓取：Playwright 单例管理，处理登录态与风控",
    "本地 RAG 知识库：多格式解析（PDF/Word/Excel/图片 OCR）+ 页码溯源",
    "Web 控制台：SSE 流式思考过程实时推送，多智能体独立会话",
  ],
  stack: ["Python", "FastAPI", "SSE", "Playwright", "RAG / BM25", "ReAct"],
};

export const agents: Agent[] = [
  {
    id: "lcsc-component",
    name: "立创商城选型助手",
    nameEn: "LCSC Component Selector",
    desc: "实时抓取立创商城现货与价格，自动筛选对比输出 TOP3 选型报告——只给一个词也绝不空手反问。",
    capabilities: [
      "参数级选型：输入「12V转3.3V/500mA/SOT-223/1元内/有现货」→ 对比表 + 推荐理由",
      "单词直查：直接输入 STM32 → 主流系列/代表型号总览 + 选型方向引导",
      "真实浏览器抓取：登录态保持与风控处理，价格库存实时",
    ],
    stack: ["Python", "Playwright", "ReAct", "SSE"],
    status: "已交付 · 持续迭代",
  },
  {
    id: "datasheet-rag",
    name: "手册答疑精灵",
    nameEn: "Datasheet RAG Tutor",
    desc: "基于本地 RAG 知识库的手册答疑「私人技术老师」，每条结论标注（来源：文件名 · 第N页），找不到的明确说未覆盖，绝不编造寄存器。",
    capabilities: [
      "多格式解析：PDF（按页）/ Word / Excel / CSV / TXT / 图片（OCR 可选）",
      "跨语言检索：中文提问自动转英文术语重试（传感器→sensor、时序→timing）",
      "老师模式：通读全文后像老师一样讲解原理，通俗类比 → 带页码细节 → 举一反三",
      "网页拖拽上传资料，索引状态与失败原因透明可见",
    ],
    stack: ["RAG", "BM25", "多格式解析", "FastAPI", "SSE"],
    status: "已交付 · 持续迭代",
  },
];

/** 导航/落地页引用的智能体入口摘要 */
export const agentsEntry = {
  href: "/agents",
  title: "我的智能体",
  en: "AI Agents",
  desc: "自研多智能体工作台：选型助手、手册答疑精灵",
};
