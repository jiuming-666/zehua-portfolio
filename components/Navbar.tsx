"use client";

import { useEffect, useState } from "react";
import { FileText, Menu, X } from "lucide-react";
import { navLinks } from "@/lib/projects";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* Logo + status light */}
        <a href="#top" className="group flex items-center gap-3">
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            ZEHUA&nbsp;JIANG
          </span>
          <span className="hidden items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11px] text-zinc-400 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon" />
            </span>
            Available for opportunities
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
            >
              {link.label}
              <span className="ml-1 text-[10px] uppercase tracking-widest text-zinc-600">
                {link.en}
              </span>
            </a>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_rgba(255,92,26,0.35)] transition-all duration-200 hover:bg-accent-soft hover:shadow-[0_0_32px_rgba(255,92,26,0.5)]"
          >
            <FileText className="h-4 w-4" />
            完整简历 PDF
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-300 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="菜单"
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="animate-fade-in border-t border-zinc-800/80 bg-zinc-950/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
              >
                {link.label}
                <span className="ml-1.5 text-[10px] uppercase tracking-widest text-zinc-600">
                  {link.en}
                </span>
              </a>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white"
            >
              <FileText className="h-4 w-4" />
              查看/下载完整简历 PDF
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
