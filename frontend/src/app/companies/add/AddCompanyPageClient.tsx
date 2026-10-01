"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PIPELINE_STEPS = [
  { id: 1, label: "Validating Target URL & Fetching Public Content" },
  { id: 2, label: "AI Business Intelligence Reasoning & Extraction" },
  { id: 3, label: "Multi-Factor Opportunity Scoring & Fit Analysis" },
  { id: 4, label: "Decision-Maker Persona & Contact Identification" },
  { id: 5, label: "Generating Tailored Contextual Outreach Email" },
  { id: 6, label: "Resolving Conflicts & Saving to PostgreSQL" },
];

export default function AddCompanyPageClient() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [runPipeline, setRunPipeline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a valid company website URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentStep(1);

    try {
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => (prev < 5 ? prev + 1 : prev));
      }, 3500);

      const endpoint = runPipeline ? `${process.env.NEXT_PUBLIC_API_URL}/api/companies/pipeline` : `${process.env.NEXT_PUBLIC_API_URL}/api/companies/analyze`;
      const payload = {
        name: name.trim() || undefined,
        website: url.trim(),
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setCurrentStep(6);

      const targetId = data.company_id || (data.company && data.company.id);
      setTimeout(() => {
        if (targetId) {
          router.push(`/companies/${targetId}`);
        } else {
          router.push("/companies");
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to analyze target company. Please try again.");
      setLoading(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Dashboard</Link>
        <span>/</span>
        <Link href="/companies" className="hover:text-white">Companies</Link>
        <span>/</span>
        <span className="text-blue-400 font-semibold">Add & Analyze</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            ✨ Autonomous Intelligence Pipeline
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Add & Analyze Company
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Enter a company website URL to extract company intelligence, compute an explainable opportunity score, identify decision makers, and draft tailored outreach.
          </p>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {/* Form */}
        {!loading ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Company Website URL <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://posthog.com or stripe.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-400 text-sm outline-none transition-colors"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                We'll automatically extract metadata and analyze the company website.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Company Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. PostHog, Stripe (auto-inferred if omitted)"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-400 text-sm outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <input
                type="checkbox"
                id="runPipelineToggle"
                checked={runPipeline}
                onChange={(e) => setRunPipeline(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500"
              />
              <label htmlFor="runPipelineToggle" className="text-xs text-slate-300 font-medium cursor-pointer">
                <span className="font-bold text-white block">Run Complete Pipeline Automatically</span>
                Execute scoring, decision maker discovery, personalized outreach, and trigger detection in one pass.
              </label>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>⚡ Ingest & Analyze Company Now</span>
              </button>
              <Link
                href="/companies"
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        ) : (
          /* Live Progress Stepper */
          <div className="mt-8 space-y-6">
            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-center">
              <div className="inline-block w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mb-3"></div>
              <h3 className="text-base font-bold text-white">
                Executing Multi-Stage Intelligence Pipeline...
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ingesting <span className="font-mono text-blue-400">{url}</span> into PostgreSQL
              </p>
            </div>

            <div className="space-y-3">
              {PIPELINE_STEPS.map((step) => {
                const isDone = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs font-medium transition-all ${
                      isDone
                        ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                        : isCurrent
                        ? "bg-blue-950/40 border-blue-700/60 text-blue-200 animate-pulse"
                        : "bg-slate-950/40 border-slate-800/60 text-slate-400"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-blue-500 text-white animate-spin"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isDone ? "✓" : step.id}
                    </div>
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

