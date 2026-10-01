"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ActionPipelineBarProps {
  companyId: number | string;
  companyName: string;
}

export default function ActionPipelineBar({ companyId, companyName }: ActionPipelineBarProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleRunAction(endpoint: string, actionName: string, method: string = "POST") {
    setLoadingAction(actionName);
    setStatusMessage(`Running ${actionName}...`);
    setErrorMessage(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to execute ${actionName}`);
      }

      setStatusMessage(`✓ ${actionName} completed successfully!`);
      setTimeout(() => {
        setStatusMessage(null);
        router.refresh();
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || `An error occurred during ${actionName}`);
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span>⚡</span> AI Action & Automation Suite
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Trigger individual AI tasks or run the complete autonomous research & outreach pipeline.
          </p>
        </div>

        {/* Primary Run All Button */}
        <button
          disabled={loadingAction !== null}
          onClick={() => handleRunAction(`companies/${companyId}/pipeline`, "Full AI Intelligence Pipeline")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loadingAction === "Full AI Intelligence Pipeline" ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Running Autonomous Pipeline...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Run Full AI Pipeline</span>
            </>
          )}
        </button>
      </div>

      {/* Granular Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
        <button
          disabled={loadingAction !== null}
          onClick={() => handleRunAction(`companies/${companyId}/research`, "Web Scrape & AI Research")}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
        >
          {loadingAction === "Web Scrape & AI Research" && <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />}
          <span>🔍 Re-run Web Scrape</span>
        </button>

        <button
          disabled={loadingAction !== null}
          onClick={() => handleRunAction(`opportunities/company/${companyId}/score`, "Opportunity Scoring")}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
        >
          {loadingAction === "Opportunity Scoring" && <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />}
          <span>🎯 Score Opportunity</span>
        </button>

        <button
          disabled={loadingAction !== null}
          onClick={() => handleRunAction(`companies/${companyId}/people`, "Persona Extraction")}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
        >
          {loadingAction === "Persona Extraction" && <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />}
          <span>👥 Find Personas</span>
        </button>

        <button
          disabled={loadingAction !== null}
          onClick={() => handleRunAction(`signals/company/${companyId}/detect`, "Trigger Detection")}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
        >
          {loadingAction === "Trigger Detection" && <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />}
          <span>📡 Detect Triggers (Diff)</span>
        </button>
      </div>

      {/* Real-time Status / Feedback */}
      {statusMessage && (
        <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/80 text-blue-300 text-xs flex items-center gap-2 animate-in fade-in">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <span>⚠️ {errorMessage}</span>
        </div>
      )}
    </div>
  );
}

