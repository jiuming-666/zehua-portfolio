import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nameEn} — ${site.role}`,
    template: `%s — ${site.nameZh}`,
  },
  description: `${site.nameZh} · ${site.role}。${site.tagline}。每一个项目都有真实的电路、波形与整机支撑。`,
  keywords: [
    "蒋泽华",
    "Jiang Zehua",
    "嵌入式软件工程师",
    "STM32",
    "FPGA",
    "FreeRTOS",
    "MCU",
    "Portfolio",
  ],
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: `${site.nameEn} — Engineering Hub`,
    title: `${site.nameEn} — ${site.role}`,
    description: `${site.nameZh} · ${site.role}。每一个项目都有真实的电路、波形与整机支撑。`,
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
      <body className="font-sans">
        <Navbar />
        <main className="relative overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
