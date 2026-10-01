import Link from "next/link";
import { notFound } from "next/navigation";
import ActionPipelineBar from "@/components/ActionPipelineBar";
import DataReliabilityCard from "@/components/DataReliabilityCard";
import PersonaOutreachSection from "@/components/PersonaOutreachSection";

export const dynamic = "force-dynamic";

// Fetchers
async function getCompany(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/companies/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getResearch(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/companies/${id}/research`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
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

async function getPeople(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/companies/${id}/people`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getSignals(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/signals/company/${id}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getOutreach(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/outreach/company/${id}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function CompanyDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const company = await getCompany(resolvedParams.id);

  if (!company) {
    notFound();
  }

  const [researchList, oppsList, people, signals, outreaches] = await Promise.all([
    getResearch(resolvedParams.id),
    getOpportunities(resolvedParams.id),
    getPeople(resolvedParams.id),
    getSignals(resolvedParams.id),
    getOutreach(resolvedParams.id),
  ]);

  const latestResearch = researchList.length > 0 ? researchList[0] : null;
  const latestOpp = oppsList.length > 0 ? oppsList[0] : null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/companies" className="hover:text-blue-400 transition-colors">
            Companies
          </Link>
          <span>/</span>
          <span className="text-white font-semibold">{company.name}</span>
        </div>

        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-2xl text-white shadow-md">
                {company.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {company.name}
                </h1>
                <a
                  href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <span>{company.website}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            {latestOpp && (
              <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Opportunity Score
                </span>
                <span className="text-2xl font-black text-blue-400">{latestOpp.score}/100</span>
              </div>
            )}

            {latestResearch && (
              <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Data Confidence
                </span>
                <span
                  className={`text-sm font-bold uppercase tracking-wider ${
                    latestResearch.confidence_score === "High"
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {latestResearch.confidence_score || "Moderate"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Pipeline Bar (1-Click Run) */}
        <ActionPipelineBar companyId={company.id} companyName={company.name} />

        {/* Main Grid: Left deep dive, Right side metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2-column pane */}
          <div className="lg:col-span-2 space-y-8">
            {/* Task 2: Opportunity Scoring & Evaluation */}
            {latestOpp && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5 text-white">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>🔥</span> Opportunity Scoring & Priority Rationale
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Task 2: Why this company deserves attention first and concrete evidence.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Priority Score: {latestOpp.score}/100
                  </span>
                </div>

                {/* Score Factor Breakdown */}
                {latestOpp.score_factors && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(latestOpp.score_factors).map(([k, v]: [string, any], idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="capitalize font-semibold text-slate-300">
                            {k.replace("_", " ")}
                          </span>
                          <span className="font-bold text-blue-400">{v}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                            style={{ width: `${Math.min(Number(v) || 0, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Evidence & Strategic Reasoning */}
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                      Concrete Evidence Observed:
                    </span>
                    <p className="text-slate-300">{latestOpp.evidence}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                      Strategic Sales Reasoning:
                    </span>
                    <p className="text-slate-300">{latestOpp.reasoning}</p>
                  </div>
                </div>

                {/* Recommended Action */}
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold text-sm">💡</span>
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px] block text-emerald-400">
                      Recommended Next Action:
                    </span>
                    <p className="mt-0.5 font-medium text-emerald-200">{latestOpp.recommended_action}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Task 1: Company Intelligence Overview */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🏢</span> Company Intelligence & Research
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Task 1: Structured public knowledge extracted from live web scrape & LLM synthesis.
                  </p>
                </div>
              </div>

              {latestResearch ? (
                <div className="space-y-5">
                  {/* Description */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Business Overview
                    </h3>
                    <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                      {latestResearch.description || "No description available."}
                    </p>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                        Industry
                      </span>
                      <span className="text-sm font-semibold text-white mt-1 block">
                        {latestResearch.industry || "Technology"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                        Business Model
                      </span>
                      <span className="text-sm font-semibold text-white mt-1 block">
                        {latestResearch.business_model || "B2B SaaS"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                        Estimated Size
                      </span>
                      <span className="text-sm font-semibold text-white mt-1 block">
                        {latestResearch.company_size || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Products / Services */}
                  {latestResearch.products_services && latestResearch.products_services.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Core Products & Capabilities
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {latestResearch.products_services.map((item: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-slate-950 text-slate-200 rounded-lg text-xs font-medium border border-slate-800 shadow-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Target Customers */}
                  {latestResearch.target_customers && latestResearch.target_customers.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Target Customers & ICP
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {latestResearch.target_customers.map((item: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-lg text-xs font-medium border border-blue-500/20"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                  <p className="text-slate-400 text-sm">No research data available yet.</p>
                  <p className="text-xs text-slate-500">
                    Click "Run Full AI Pipeline" in the top bar to trigger the autonomous workflow.
                  </p>
                </div>
              )}
            </section>

            {/* Tasks 3 & 4: Personas and Personalized Outreach */}
            <PersonaOutreachSection
              companyId={company.id}
              people={people}
              outreaches={outreaches}
            />
          </div>

          {/* Right Column: Task 7 Reliability & Task 6 Signals */}
          <div className="space-y-8">
            {/* Task 7: Data Reliability & Conflict Resolution */}
            <DataReliabilityCard
              confidenceScore={latestResearch?.confidence_score}
              sources={latestResearch?.sources}
              conflicts={latestResearch?.data_conflicts}
              uncertaintyNotes={latestResearch?.uncertainty_notes}
            />

            {/* Task 6: Trigger Detection & Signals */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>📡</span> Temporal Trigger Signals
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Task 6: Meaningful diffs across research snapshots.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  {signals.length}
                </span>
              </div>

              {signals.length === 0 ? (
                <div className="p-6 text-center bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                  <p className="text-xs text-slate-400">
                    No trigger events detected yet.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Run the research pipeline twice to compare snapshots and isolate meaningful signals from noise.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {signals.map((s: any) => (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <h4 className="font-semibold text-xs text-blue-400">{s.signal_type}</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pl-4">{s.description}</p>
                      <div className="pl-4 pt-1 text-[11px] text-emerald-400 font-medium">
                        <strong>Why it matters:</strong> {s.meaningful}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
  );
}
