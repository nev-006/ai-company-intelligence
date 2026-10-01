"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PIPELINE_STEPS = [
  "Connecting to company & scraping website...",
  "AI Analysis: Extracting business model, products & sources...",
  "Task 7: Reconciling conflicting data & evaluating reliability...",
  "Scoring opportunity, business fit & tech relevance...",
  "Identifying key executive personas & target roles...",
  "Drafting contextual, non-spam outreach...",
  "Detecting trigger events & finalizing..."
];

export default function AddCompanyModal({ isOpen, onClose, onSuccess }: AddCompanyModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [runPipeline, setRunPipeline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !website.trim()) {
      setError("Please provide both company name and website URL.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setCurrentStepIndex(0);

    // Simulate animated progress steps while backend runs
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev));
    }, 2800);

    try {
      if (runPipeline) {
        // Call the unified pipeline endpoint
        const res = await fetch("http://127.0.0.1:8000/api/companies/pipeline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), website: website.trim() }),
        });

        clearInterval(interval);

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Failed to run pipeline for company");
        }

        const data = await res.json();
        setIsLoading(false);
        onClose();
        setName("");
        setWebsite("");
        if (onSuccess) onSuccess();
        router.push(`/companies/${data.company_id}`);
        router.refresh();
      } else {
        // Just create the basic company entry
        const res = await fetch("http://127.0.0.1:8000/api/companies/`", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), website: website.trim() }),
        });

        clearInterval(interval);

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Failed to save company");
        }

        const newCompany = await res.json();
        setIsLoading(false);
        onClose();
        setName("");
        setWebsite("");
        if (onSuccess) onSuccess();
        router.push(`/companies/${newCompany.id}`);
        router.refresh();
      }
    } catch (err: any) {
      clearInterval(interval);
      setIsLoading(false);
      setError(err.message || "An unexpected error occurred.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white">
        {/* Close Button */}
        {!isLoading && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            ✨ AI Company Intelligence Ingestion
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Add New Company</h2>
          <p className="text-sm text-slate-400 mt-1">
            Provide a target company's name and website to automatically research, score, and find actionable personas.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-sm flex items-start gap-2.5">
            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-8 space-y-6 text-center">
            {/* Spinning Indicator */}
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-blue-400">
                AI
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white animate-pulse">
                Running Full Intelligence Pipeline
              </h3>
              <p className="text-sm text-blue-400 font-medium">
                {PIPELINE_STEPS[currentStepIndex]}
              </p>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${((currentStepIndex + 1) / PIPELINE_STEPS.length) * 100}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-400">
              Live web scraping, Gemini LLM reasoning & structured database persistence in progress...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Stripe, Linear, Datadog"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Website URL *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. https://stripe.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Checkbox for Full Pipeline */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <input
                id="runPipeline"
                type="checkbox"
                checked={runPipeline}
                onChange={(e) => setRunPipeline(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 bg-slate-900 cursor-pointer"
              />
              <label htmlFor="runPipeline" className="text-xs text-slate-300 cursor-pointer select-none">
                <span className="font-semibold text-white block">Run Automated Pipeline Immediately</span>
                Automatically scrape website, score opportunity, extract personas & draft outreach in one step.
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 transition-all cursor-pointer"
              >
                {runPipeline ? "Ingest & Analyze Now" : "Save Company"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

