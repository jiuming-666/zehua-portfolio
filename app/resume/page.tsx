import type { Metadata } from "next";
import ResumeView from "@/components/ResumeView";

export const metadata: Metadata = {
  title: "在线简历",
  description: "蒋泽华 · 嵌入式软件工程师（MCU 方向）在线简历",
};

export default function ResumePage() {
  return <ResumeView />;
}
