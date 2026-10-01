"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AddCompanyModal from "./AddCompanyModal";

export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  AI
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    AI Intelligence
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
                    B2B Opportunity Engine
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === "/"
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Act Today (Top 5)
              </Link>
              <Link
                href="/companies"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pathname.startsWith("/companies")
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                All Companies
              </Link>

              {/* Add Company Trigger Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="ml-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add & Analyze Company</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Reusable Add Company Modal */}
      <AddCompanyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
