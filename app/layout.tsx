import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zehuajiang.com"),
  title: "Jiang Zehua — Hardware & Engineering Builder",
  description:
    "江泽华 · 硬件与全栈构建者。高保真实物原型研发、硬件创新与全栈实现。每一个项目都有真实的电路、机械或成品支撑。",
  keywords: [
    "Jiang Zehua",
    "江泽华",
    "Hardware Engineer",
    "Embedded Systems",
    "PCB Design",
    "Portfolio",
  ],
  alternates: {
    canonical: "https://zehuajiang.com",
  },
  openGraph: {
    type: "website",
    url: "https://zehuajiang.com",
    siteName: "Jiang Zehua — Engineering Hub",
    title: "Jiang Zehua — Hardware & Engineering Builder",
    description:
      "江泽华 · 硬件与全栈构建者。每一个项目都有真实的电路、机械或成品支撑。",
    locale: "zh_CN",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
