"use client";

import { useState } from "react";
import Link from "next/link";

interface SignalItem {
  id: number;
  signal_type: string;
  description: string;
  meaningful: string;
  is_meaningful?: boolean;
  worth_acting_on?: boolean;
  recommended_action?: string;
  source: string;
  created_at?: string;
}

interface SnapshotItem {
  id: number;
  snapshot_data: Record<string, any>;
  change_summary?: string;
  created_at: string;
}

export default function TriggersHistoryClient({
  company,
  initialSignals,
  initialSnapshots,
}: {
  company: { id: number; name: string; website: string };
  initialSignals: SignalItem[];
  initialSnapshots: SnapshotItem[];
}) {
  const [signals, setSignals] = useState<SignalItem[]>(initialSignals);
  const [snapshots, setSnapshots] = useState<SnapshotItem[]>(initialSnapshots);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"signals" | "snapshots">("signals");

  const handleRunTriggerCheck = async () => {
    setRunning(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/companies/${company.id}/trigger-check`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Trigger check failed");
      const newSignals = await res.json();
      setSignals([...newSignals, ...signals]);

      // Refresh snapshots
      const snapRes = await fetch(`http://127.0.0.1:8000/api/companies/${company.id}/snapshots`);
      if (snapRes.ok) {
        setSnapshots(await snapRes.json());
      }
    } catch (err) {
      console.error(err);
      alert("Failed to run trigger check. Please make sure research has been performed.");
    } finally {
      setRunning(false);
    }
  };

  const meaningfulSignals = signals.filter(
    (s) => s.is_meaningful !== false && !s.meaningful.toLowerCase().includes("noise")
  );
  const noiseSignals = signals.filter(
    (s) => s.is_meaningful === false || s.meaningful.toLowerCase().includes("noise")
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/companies" className="hover:text-white">Companies</Link>
          <span>/</span>
          <Link href={`/companies/${company.id}`} className="hover:text-white">{company.name}</Link>
          <span>/</span>
          <span className="text-blue-400 font-semibold">Trigger History</span>
        </div>
        <Link
          href={`/companies/${company.id}`}
          className="text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
        >
          ← Back to Company Overview
        </Link>
      </div>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            Task 6 — Temporal Trigger Detection & History
          </div>
          <h1 className="text-3xl font-black text-white">
            {company.name} — Trigger History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compares company snapshots over time. Separates high-yield buying signals from marketing noise.
          </p>
        </div>

        <button
          onClick={handleRunTriggerCheck}
          disabled={running}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-md shadow-orange-600/30 disabled:opacity-50 transition-all cursor-pointer"
        >
          {running ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Diffing Snapshots...</span>
            </>
          ) : (
            <>
              <span>⚡ Run Trigger Diff Now</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("signals")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "signals"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          🔔 Active Buying Triggers ({signals.length})
        </button>
        <button
          onClick={() => setActiveTab("snapshots")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "snapshots"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          📸 Research Snapshots History ({snapshots.length})
        </button>
      </div>

      {/* Tab: Signals View */}
      {activeTab === "signals" && (
        <div className="space-y-8">
          {/* Meaningful Signals Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span>🟢</span> Meaningful Buying Signals ({meaningfulSignals.length})
              </h2>
              <span className="text-[11px] text-slate-400">High outreach timing yield</span>
            </div>

            {meaningfulSignals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meaningfulSignals.map((sig) => (
                  <div
                    key={sig.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 shadow-xl space-y-3 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {sig.signal_type}
                        </span>
                        <div className="text-sm font-bold text-white mt-1.5 leading-snug">
                          {sig.description}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 shrink-0">
                        Actionable
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                      <span className="font-bold text-blue-400 text-[10px] uppercase block mb-0.5">
                        Recommended Action
                      </span>
                      <p className="text-slate-300">
                        {sig.recommended_action || "Initiate timely outreach to relevant decision maker."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Source: {sig.source || "Snapshot Diff Analysis"}</span>
                      {sig.created_at && (
                        <span>{new Date(sig.created_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
                No active meaningful signals detected yet.
              </div>
            )}
          </div>

          {/* Noise Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span>⚪</span> Filtered Marketing Noise ({noiseSignals.length})
              </h2>
              <span className="text-[11px] text-slate-400">Low-yield cosmetic changes separated to prevent distraction</span>
            </div>

            {noiseSignals.length > 0 ? (
              <div className="space-y-3">
                {noiseSignals.map((noise) => (
                  <div
                    key={noise.id}
                    className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="font-bold text-slate-300 mr-2">[{noise.signal_type}]:</span>
                      <span>{noise.description}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 shrink-0">
                      Noise (Ignored)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 italic">
                No noise changes recorded.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Snapshots History */}
      {activeTab === "snapshots" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            Immutable snapshots of company states captured across time. The engine diffs consecutive snapshots to identify real growth metrics versus marketing noise.
          </div>

          {snapshots.length > 0 ? (
            <div className="space-y-4">
              {snapshots.map((snap, idx) => (
                <div key={snap.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                        {snapshots.length - idx}
                      </span>
                      <span className="font-bold text-white text-sm">
                        Snapshot #{snap.id}
                      </span>
                      {snap.change_summary && (
                        <span className="text-xs text-slate-400">({snap.change_summary})</span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {new Date(snap.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Size</span>
                      <span className="text-slate-200 font-semibold">{snap.snapshot_data?.company_size || "N/A"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Industry</span>
                      <span className="text-slate-200 font-semibold">{snap.snapshot_data?.industry || "N/A"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Business Model</span>
                      <span className="text-slate-200 font-semibold">{snap.snapshot_data?.business_model || "N/A"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Products Count</span>
                      <span className="text-slate-200 font-semibold">{snap.snapshot_data?.products_services?.length || 0} Products</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
              No historical snapshots captured yet. Snapshots are created every time research is run.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
