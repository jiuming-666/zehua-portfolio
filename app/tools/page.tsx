import type { Metadata } from "next";
import { Wrench } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ToolsExplorer from "@/components/tools/ToolsExplorer";

export const metadata: Metadata = {
  title: "工具箱",
  description: "嵌入式工程师的在线工具箱：分压电阻、波特率、CRC、ADC 换算等常用计算器",
};

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Workbench · 常用工具"
        icon={Wrench}
        title="工具箱"
        description="我日常调试与设计时高频使用的在线小工具，纯前端实现、打开即用。会随着工作需要持续添加。"
      />
      <div className="pt-10">
        <ToolsExplorer />
      </div>
    </>
  );
}
