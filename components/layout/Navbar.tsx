"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navPages, site } from "@/lib/site";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 路由变化时收起移动端菜单
  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            {site.nameEn.toUpperCase().replace(" ", "\u00A0")}
          </span>
        </Link>

        {/* 桌面端：选项卡导航 */}
        <div className="hidden items-center gap-1 md:flex">
          {navPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className={`rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200 ${
                isActive(page.href)
                  ? "bg-zinc-800/80 font-medium text-zinc-50"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {page.label}
              <span className="ml-1 hidden text-[10px] uppercase tracking-widest text-zinc-600 xl:inline">
                {page.en}
              </span>
            </Link>
          ))}
        </div>

        {/* 移动端菜单按钮 */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-300 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="菜单"
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {/* 移动端下拉菜单 */}
      {menuOpen && (
        <div className="animate-fade-in border-t border-zinc-800/80 bg-zinc-950/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {navPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive(page.href)
                    ? "bg-zinc-900 font-medium text-zinc-50"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                {page.label}
                <span className="ml-1.5 text-[10px] uppercase tracking-widest text-zinc-600">
                  {page.en}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
