"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AddCompanyModal from "./AddCompanyModal";

interface NavItem {
  label: string;
  href: string;
  badge?: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "📊" },
  { label: "Act Today", href: "/act-today", badge: "Top 5", icon: "⚡" },
  { label: "All Companies", href: "/companies", icon: "🏢" },
  { label: "Add & Analyze Company", href: "/companies/add", icon: "➕" },
  { label: "Opportunities", href: "/opportunities", icon: "🎯" },
  { label: "Contacts", href: "/contacts", icon: "👥" },
  { label: "Triggers", href: "/triggers", icon: "🔔" },
  { label: "Outreach", href: "/outreach", icon: "✉️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Header Toggle */}
      <div className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <Link href="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/20">
            AI
          </div>
          <span className="font-bold text-white text-base tracking-tight">
            AI Intelligence
          </span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Main Sidebar (Mobile Drawer & Laptop Sticky Sidebar) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0 shadow-2xl shadow-black" : "-translate-x-full"
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              AI
            </div>
            <div>
              <div className="font-black text-base text-white tracking-tight flex items-center gap-1.5">
                AI Intelligence
              </div>
              <div className="text-[11px] font-medium text-slate-400 tracking-wider uppercase -mt-0.5">
                Opportunity Engine
              </div>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close navigation menu"
            className="lg:hidden p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all cursor-pointer"
          >
            <span>+ Quick Analyze Modal</span>
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            Menu Navigation
          </div>
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || (item.href !== "/companies/add" && pathname.startsWith(item.href) && item.href !== "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Status Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Engine Active
            </span>
            <span className="text-[10px] font-mono text-slate-400">PostgreSQL</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Model: Gemini 2.5 / 3.8 Flash
          </div>
        </div>
      </aside>

      <AddCompanyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
