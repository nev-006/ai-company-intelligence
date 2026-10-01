import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getCompany(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/companies/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getOpportunities(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/opportunities/company/${id}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function CompanyOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [company, opportunities] = await Promise.all([
    getCompany(id),
    getOpportunities(id),
  ]);

  if (!company) {
    notFound();
  }

  const latestOpp = opportunities[0] || null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/companies" className="hover:text-white">Companies</Link>
          <span>/</span>
          <Link href={`/companies/${id}`} className="hover:text-white">{company.name}</Link>
          <span>/</span>
          <span className="text-blue-400 font-semibold">Opportunity Scoring</span>
        </div>
        <Link
          href={`/companies/${id}`}
          className="text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
        >
          ← Back to Company Overview
        </Link>
      </div>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
              Task 2 — Explainable Opportunity Scoring
            </div>
            <h1 className="text-3xl font-black text-white">
              {company.name} — Opportunity Analysis
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              7-Factor scoring framework evaluating ICP fit, growth, hiring, tech signals, and timing triggers.
            </p>
          </div>

          {latestOpp && (
            <div className="text-right bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Overall Score
              </div>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                {latestOpp.score}
                <span className="text-sm font-normal text-slate-400">/100</span>
              </div>
              <div className="text-xs font-semibold text-emerald-400 mt-1">
                Priority: {latestOpp.priority || (latestOpp.score >= 75 ? "High" : "Medium")}
              </div>
            </div>
          )}
        </div>
      </div>

      {latestOpp ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: 7 Factors Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                📊 7-Factor Scoring Framework Breakdown
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(latestOpp.score_factors || {}).map(([factor, score]: [string, any]) => (
                  <div key={factor} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-semibold text-slate-300 capitalize">
                        {factor.replace(/_/g, " ")}
                      </span>
                      <span className="font-mono font-bold text-blue-400">{score}/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence & Reasoning */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                🔍 Factual Evidence & Sales Rationale
              </h2>
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-blue-400 uppercase text-[10px] block mb-1">
                    Verified Factual Evidence
                  </span>
                  <p className="text-slate-300 leading-relaxed">{latestOpp.evidence}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-indigo-400 uppercase text-[10px] block mb-1">
                    Strategic Sales Reasoning
                  </span>
                  <p className="text-slate-300 leading-relaxed">{latestOpp.reasoning}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Signals & Recommended Action */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                🎯 Recommended Next Action
              </h2>
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200">
                {latestOpp.recommended_action}
              </div>
              <Link
                href={`/companies/${id}/outreach`}
                className="w-full block py-2.5 rounded-xl text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all"
              >
                Proceed to Personalized Outreach →
              </Link>
            </div>

            {/* Positive & Negative Signals */}
            {latestOpp.positive_signals && latestOpp.positive_signals.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  ✓ Positive Growth Signals
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {latestOpp.positive_signals.map((sig: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {latestOpp.negative_signals && latestOpp.negative_signals.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  ⚠ Risks & Friction Points
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {latestOpp.negative_signals.map((sig: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-sm text-slate-400 mb-4">No opportunity score generated yet for this company.</p>
          <Link
            href={`/companies/${id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Run Pipeline on Overview Page
          </Link>
        </div>
      )}
    </main>
  );
}
