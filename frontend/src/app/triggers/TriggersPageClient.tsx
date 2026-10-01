"use client";

import { useState } from "react";
import Link from "next/link";

interface Signal {
  id: number;
  company_id: number;
  signal_type: string;
  description: string;
  meaningful: string;
  is_meaningful?: boolean;
  worth_acting_on?: boolean;
  recommended_action?: string;
  source: string;
  created_at?: string;
}

export default function TriggersPageClient({
  signals,
  companyMap,
}: {
  signals: Signal[];
  companyMap: Record<number, any>;
}) {
  const [filter, setFilter] = useState<"all" | "meaningful" | "noise">("meaningful");

  const meaningfulCount = signals.filter(
    (s) => s.is_meaningful !== false && !s.meaningful.toLowerCase().includes("noise")
  ).length;
  const noiseCount = signals.filter(
    (s) => s.is_meaningful === false || s.meaningful.toLowerCase().includes("noise")
  ).length;

  const displayedSignals = signals.filter((s) => {
    const isNoise = s.is_meaningful === false || s.meaningful.toLowerCase().includes("noise");
    if (filter === "meaningful") return !isNoise;
    if (filter === "noise") return isNoise;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            Task 6 — Temporal Trigger & Signal Intelligence
          </div>
          <h1 className="text-3xl font-black text-white">
            Buying Triggers & Events Stream
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time change detection diffing company snapshots to spot hiring surges, product launches, and funding events.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setFilter("meaningful")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "meaningful"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          🟢 Meaningful Buying Signals ({meaningfulCount})
        </button>
        <button
          onClick={() => setFilter("noise")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "noise"
              ? "bg-slate-700 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          ⚪ Marketing Noise ({noiseCount})
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          All Recorded Changes ({signals.length})
        </button>
      </div>

      {/* Signals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedSignals.map((sig) => {
          const comp = companyMap[sig.company_id] || { name: `Company #${sig.company_id}` };
          const isNoise = sig.is_meaningful === false || sig.meaningful.toLowerCase().includes("noise");

          return (
            <div
              key={sig.id}
              className={`p-5 rounded-2xl border shadow-xl space-y-3 transition-colors ${
                isNoise
                  ? "bg-slate-950/40 border-slate-800 text-slate-400"
                  : "bg-slate-900 border-slate-800 hover:border-emerald-500/30 text-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/companies/${sig.company_id}`}
                    className="text-xs font-bold text-blue-400 hover:underline block"
                  >
                    {comp.name}
                  </Link>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${
                      isNoise
                        ? "bg-slate-800 text-slate-400"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {sig.signal_type}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isNoise
                      ? "bg-slate-800 text-slate-400"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}
                >
                  {isNoise ? "Noise" : "Actionable Signal"}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {sig.description}
              </p>

              {!isNoise && sig.recommended_action && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <span className="font-bold text-blue-400 text-[10px] uppercase block mb-0.5">
                    Recommended Action
                  </span>
                  <p className="text-slate-300">{sig.recommended_action}</p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>Source: {sig.source || "Snapshot Diff Engine"}</span>
                <Link
                  href={`/companies/${sig.company_id}/triggers`}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Inspect Diff →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
