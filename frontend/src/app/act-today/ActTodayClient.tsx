"use client";

import { useState } from "react";
import Link from "next/link";

interface Contact {
  id?: number;
  name: string;
  job_title: string;
  is_persona?: boolean;
  relevance_reason?: string;
}

interface TopAction {
  rank: number;
  company_id: number;
  company_name: string;
  website: string;
  action_index: number;
  opportunity_score: number;
  priority: string;
  trigger: string;
  trigger_type: string;
  trigger_strength: string;
  recommended_contact: Contact | null;
  recommended_action: string;
  why_selected: string;
  confidence: string;
  score_factors: Record<string, number>;
  last_updated: string;
}

interface BacklogItem {
  company_id: number;
  company_name: string;
  website: string;
  opportunity_score: number;
  action_index: number;
  priority: string;
  confidence: string;
  deferral_reason: string;
}

interface DashboardTodayData {
  top_5_actions: TopAction[];
  backlog: BacklogItem[];
  total_evaluated: number;
  selection_framework: {
    algorithm: string;
    weights: Record<string, string>;
    rule: string;
  };
  generated_at: string;
}

export default function ActTodayClient({ initialData }: { initialData: DashboardTodayData | null }) {
  const [activeTab, setActiveTab] = useState<"top5" | "backlog" | "methodology">("top5");

  if (!initialData || !initialData.top_5_actions) {
    return (
      <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4 text-2xl">
          ⚡
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No Active Companies Yet</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Ingest target companies to run multi-factor opportunity scoring, trigger detection, and top 5 curation.
        </p>
        <Link
          href="/companies/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          <span>+ Add & Analyze Company</span>
        </Link>
      </div>
    );
  }

  const { top_5_actions, backlog, total_evaluated, selection_framework } = initialData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            ⚡ Daily Action Intelligence Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
            ACT TODAY
            <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Top 5 Actions
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            "I don't want 100 opportunities. I only want the 5 things worth acting on today."
            Evaluated across {total_evaluated} companies to prioritize highest-yield outreach targets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/companies/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5 transition-all"
          >
            <span>+ Add & Analyze Target</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("top5")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "top5"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          🎯 Top 5 Focus Today ({top_5_actions.length})
        </button>
        <button
          onClick={() => setActiveTab("backlog")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "backlog"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          📋 Monitored Backlog ({backlog.length})
        </button>
        <button
          onClick={() => setActiveTab("methodology")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "methodology"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          ⚖️ Prioritization Framework
        </button>
      </div>

      {/* Tab: Top 5 Focus */}
      {activeTab === "top5" && (
        <div className="space-y-5">
          {top_5_actions.map((act) => (
            <div
              key={act.company_id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl transition-all relative overflow-hidden group"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Left Side: Rank, Company, & Scores */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black text-sm flex items-center justify-center shadow-md">
                      #{act.rank}
                    </span>
                    <h3 className="text-2xl font-black text-white hover:text-blue-400 transition-colors">
                      <Link href={`/companies/${act.company_id}`}>{act.company_name}</Link>
                    </h3>
                    <a
                      href={act.website.startsWith("http") ? act.website : `https://${act.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-blue-400 font-mono transition-colors"
                    >
                      {act.website.replace("https://", "")} ↗
                    </a>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Priority: {act.priority}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
                      Confidence: {act.confidence}
                    </span>
                  </div>

                  {/* Why it was selected */}
                  <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/30 text-xs text-blue-200">
                    <div className="font-bold text-blue-400 uppercase tracking-wider text-[10px] mb-1">
                      💡 Why Selected For Today's Top 5
                    </div>
                    <p className="leading-relaxed">{act.why_selected}</p>
                  </div>

                  {/* Grid: Trigger & Recommended Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <span>🔔</span> Active Buying Trigger ({act.trigger_strength} Urgency)
                      </div>
                      <div className="text-xs text-slate-200 font-medium">
                        {act.trigger}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <span>👤</span> Recommended Contact
                      </div>
                      <div className="text-xs text-slate-200 font-medium">
                        {act.recommended_contact ? (
                          <>
                            <span className="font-bold text-white">
                              {act.recommended_contact.name || act.recommended_contact.job_title}
                            </span>
                            {act.recommended_contact.name && (
                              <span className="text-slate-400 text-[11px] block">
                                Role: {act.recommended_contact.job_title}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400">Target Persona: Technical Decision Maker</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Score Box & CTAs */}
                <div className="flex flex-col items-center lg:items-end justify-between gap-4 shrink-0 lg:w-64 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                  <div className="text-center lg:text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Opportunity Score
                    </div>
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                      {act.opportunity_score}
                      <span className="text-sm text-slate-400 font-normal">/100</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Action Index: {act.action_index}
                    </div>
                  </div>

                  <div className="w-full space-y-2">
                    <div className="text-[11px] text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="font-bold text-blue-400 block text-[10px] uppercase">Next Action</span>
                      {act.recommended_action}
                    </div>

                    <div className="flex gap-2 w-full">
                      <Link
                        href={`/companies/${act.company_id}/outreach`}
                        className="flex-1 py-2 rounded-xl text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all"
                      >
                        ✉️ Outreach
                      </Link>
                      <Link
                        href={`/companies/${act.company_id}`}
                        className="px-3 py-2 rounded-xl text-center text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all"
                      >
                        Deep Dive
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Backlog */}
      {activeTab === "backlog" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            Accounts deferred from the Top 5 focus today. Monitored continuously for new buying triggers, headcount spikes, or product launches.
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Company</th>
                  <th className="p-4">Opportunity Score</th>
                  <th className="p-4">Action Index</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Deferral Rationale</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {backlog.map((item) => (
                  <tr key={item.company_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">
                      <Link href={`/companies/${item.company_id}`} className="hover:text-blue-400">
                        {item.company_name}
                      </Link>
                      <div className="text-[10px] text-slate-400 font-mono">{item.website}</div>
                    </td>
                    <td className="p-4 font-bold text-blue-400">{item.opportunity_score}/100</td>
                    <td className="p-4 font-mono text-slate-300">{item.action_index}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 max-w-md">{item.deferral_reason}</td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/companies/${item.company_id}`}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Prioritization Framework */}
      {activeTab === "methodology" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Multi-Factor Action Selection Algorithm
            </h3>
            <p className="text-xs text-slate-400">
              {selection_framework.rule}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(selection_framework.weights).map(([factor, weight]) => (
              <div key={factor} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Factor Weight
                </div>
                <div className="text-2xl font-black text-white mt-1">{weight}</div>
                <div className="text-xs font-semibold text-blue-400 mt-1 capitalize">
                  {factor.replace(/_/g, " ")}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-blue-400">Why Explainability Matters</div>
            <p>
              Sales reps lose trust in AI when presented with unexplained black-box scores. AI Intelligence Engine provides clear, factual reasons why an account was selected today (e.g. active hiring surge + CTO identified + high ICP fit) versus why another was deferred to the backlog.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
