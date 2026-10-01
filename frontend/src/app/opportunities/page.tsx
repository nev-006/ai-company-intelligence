import Link from "next/link";

export const dynamic = "force-dynamic";

async function getOpportunities() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/opportunities/", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getCompanies() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/companies/`", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function OpportunitiesPage() {
  const [opportunities, companies] = await Promise.all([
    getOpportunities(),
    getCompanies(),
  ]);

  const companyMap = companies.reduce((acc: Record<number, any>, c: any) => {
    acc[c.id] = c;
    return acc;
  }, {});

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            Task 2 — Global Opportunity Scoring
          </div>
          <h1 className="text-3xl font-black text-white">
            All Company Opportunities ({opportunities.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            7-Factor algorithmic opportunity scores ranked by likelihood of high-yield sales engagement.
          </p>
        </div>
        <Link
          href="/companies/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          <span>+ Add & Analyze Target</span>
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
            <tr>
              <th className="p-4">Company</th>
              <th className="p-4">Score</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Key Signals</th>
              <th className="p-4">Recommended Next Action</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {opportunities.map((opp: any) => {
              const comp = companyMap[opp.company_id] || { name: `Company #${opp.company_id}`, website: "" };
              const priority = opp.priority || (opp.score >= 75 ? "High" : opp.score >= 50 ? "Medium" : "Low");

              return (
                <tr key={opp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <Link href={`/companies/${opp.company_id}`} className="font-bold text-white hover:text-blue-400 text-sm">
                      {comp.name}
                    </Link>
                    <div className="text-[10px] text-slate-400 font-mono">{comp.website}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-black text-base text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                      {opp.score}/100
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        priority === "High"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : priority === "Medium"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {priority}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 max-w-xs">
                    {opp.positive_signals && opp.positive_signals.length > 0 ? (
                      <span className="truncate block">{opp.positive_signals[0]}</span>
                    ) : (
                      <span className="text-slate-400 italic">Multi-factor evaluation</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-300 max-w-sm">
                    {opp.recommended_action}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/companies/${opp.company_id}/opportunity`}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 text-[11px] font-semibold"
                    >
                      Factors
                    </Link>
                    <Link
                      href={`/companies/${opp.company_id}/outreach`}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold"
                    >
                      Outreach
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

