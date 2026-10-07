import type { Metadata } from "next";
import { Bot } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import AgentsGrid from "@/components/agents/AgentsGrid";

export const metadata: Metadata = {
  title: "我的智能体",
  description:
    "自研多智能体工作台：立创选型助手、手册答疑精灵。ReAct 框架 + 真实浏览器抓取 + 本地 RAG 知识库。",
};

export default function AgentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Agents · 自研智能体"
        icon={Bot}
        title="我的智能体工作台"
        description="我把日常研发里重复的活儿交给自研智能体：元器件选型、手册答疑。全部基于自建 ReAct 框架与本地 RAG，数据真实可溯源。启动本地工作台后，可从本页一键直达控制台。"
      />
      <div className="pt-10">
        <AgentsGrid />
      </div>
    </>
  );
}
