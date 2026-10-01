"use client";

import { useState } from "react";
import Link from "next/link";
import AddCompanyModal from "./AddCompanyModal";

interface Opportunity {
  id: number;
  company_id: number;
  score: number;
  score_factors?: any;
  evidence?: string;
  reasoning?: string;
  confidence?: string;
  recommended_action?: string;
  created_at: string;
}

interface Signal {
  id: number;
  company_id: number;
  signal_type: string;
  description: string;
  meaningful: string;
  source: string;
  created_at: string;
}

interface Company {
  id: number;
  name: string;
  website: string;
  created_at: string;
}

interface DashboardClientProps {
  topOpps: Opportunity[];
  allOpps: Opportunity[];
  signals: Signal[];
  companies: Company[];
}

export default function DashboardClient({
  topOpps,
  allOpps,
  signals,
  companies,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"top5" | "backlog">("top5");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Map company_id to company for fast lookup
  const companyMap = companies.reduce((acc: Record<number, Company>, c) => {
    acc[c.id] = c;
    return acc;
  }, {});

  const displayedOpps = activeTab === "top5" ? topOpps : allOpps;

  // Compute metrics
  const avgScore =
    displayedOpps.length > 0
      ? Math.round(displayedOpps.reduce((sum, o) => sum + (o.score || 0), 0) / displayedOpps.length)
      : 0;

  return (
    <>
      <div className="space-y-8">
        {/* Executive Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
              ⚡ Daily Prioritization Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Act Today
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Which companies deserve your attention first and why? Streamlined to the top opportunities so you never waste time on low-yield outreach.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Add & Analyze Company</span>
            </button>
          </div>
        </div>

        {/* Task 9 Requirement Change Banner */}
        <div className="bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-800/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-base shrink-0 border border-blue-500/30">
              🎯
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white">
                Task 9: Executive "Top 5 Only" Synthesis
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                Instead of overwhelming you with 100 lukewarm leads, this dashboard filters and ranks the <strong>top 5 actionable targets</strong> using a multi-factor score: business ICP fit, hiring/growth momentum, and recent trigger events.
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab("top5")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "top5"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🔥 Top 5 Today
            </button>
            <button
              onClick={() => setActiveTab("backlog")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "backlog"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              📋 All Monitored ({allOpps.length})
            </button>
          </div>
        </div>

        {/* Top Metric Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Focus Companies
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {activeTab === "top5" ? Math.min(topOpps.length, 5) : allOpps.length}
            </div>
            <span className="text-[11px] text-blue-400 font-medium">Curated for immediate outreach</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Average Opportunity Score
            </span>
            <div className="text-2xl font-black text-blue-400 mt-1">{avgScore}/100</div>
            <span className="text-[11px] text-slate-400 font-medium">Weighted likelihood of conversion</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Trigger Signals
            </span>
            <div className="text-2xl font-black text-purple-400 mt-1">{signals.length}</div>
            <span className="text-[11px] text-purple-300 font-medium">Temporal buying catalysts</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Accounts Tracked
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{companies.length}</div>
            <span className="text-[11px] text-emerald-300 font-medium">In PostgreSQL database</span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Opportunities Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{activeTab === "top5" ? "🔥" : "📋"}</span>
                <span>
                  {activeTab === "top5" ? "Top 5 Actionable Opportunities" : "All Monitored Accounts"}
                </span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Sorted by priority & score
              </span>
            </div>

            {displayedOpps.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center text-xl font-bold border border-blue-500/20">
                  🎯
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">No opportunities scored yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Add a company to automatically run the research & scoring engine.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-md shadow-blue-600/30 transition-all"
                >
                  <span>+ Ingest Company Now</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedOpps.map((opp, idx) => {
                  const company = companyMap[opp.company_id];
                  const isHigh = opp.confidence?.toLowerCase() === "high";

                  return (
                    <div
                      key={opp.id}
                      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl transition-all relative overflow-hidden group space-y-4"
                    >
                      {/* Left accent bar */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-600" />

                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-black">
                              #{idx + 1}
                            </span>
                            <h3 className="text-lg font-extrabold text-white group-hover:text-blue-400 transition-colors">
                              {company?.name || `Company #${opp.company_id}`}
                            </h3>
                            {company?.website && (
                              <span className="text-xs text-slate-400 font-mono">
                                ({company.website.replace("https://", "").replace("http://", "").split("/")[0]})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            Score: {opp.score}/100
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              isHigh
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            }`}
                          >
                            {opp.confidence || "Moderate"} Confidence
                          </span>
                        </div>
                      </div>

                      {/* Evidence & Reasoning */}
                      <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                        {opp.reasoning && (
                          <p className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                            <strong className="text-slate-400 font-semibold block mb-0.5">
                              Why Act Now:
                            </strong>
                            {opp.reasoning}
                          </p>
                        )}

                        {opp.evidence && (
                          <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pl-1">
                            <span className="text-blue-400 font-bold">✓ Evidence:</span>
                            <span>{opp.evidence}</span>
                          </div>
                        )}
                      </div>

                      {/* Recommended Action & CTA */}
                      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {opp.recommended_action && (
                          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                            <span>💡</span>
                            <span>{opp.recommended_action}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 sm:ml-auto">
                          <Link
                            href={`/companies/${opp.company_id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all"
                          >
                            <span>Open Deep Dive & Outreach</span>
                            <span>&rarr;</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Recent Signals & Trigger Events */}
          <div className="space-y-6">
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📡</span> Recent Trigger Signals
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  Top 5
                </span>
              </div>

              {signals.length === 0 ? (
                <div className="p-6 text-center bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                  <p className="text-xs text-slate-400">No trigger signals logged yet.</p>
                  <p className="text-[11px] text-slate-500">
                    Triggers appear when company changes are detected across sequential research runs.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {signals.map((s) => {
                    const company = companyMap[s.company_id];
                    return (
                      <div
                        key={s.id}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-blue-400">
                            {company?.name || `Company #${s.company_id}`}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {s.signal_type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{s.description}</p>
                        <p className="text-[11px] text-emerald-400 font-medium">
                          <strong>Impact: </strong>
                          {s.meaningful}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <AddCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
