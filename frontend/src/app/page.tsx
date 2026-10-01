import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

async function getDashboardToday() {
  try {
    const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/today", { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getOpportunities(limit: number = 100) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/?limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getRecentSignals() {
  try {
    const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/signals/", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 10);
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getCompanies() {
  try {
    const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/companies/", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function Dashboard() {
  const [dashboardToday, allOpps, signals, companies] = await Promise.all([
    getDashboardToday(),
    getOpportunities(100),
    getRecentSignals(),
    getCompanies(),
  ]);

  // Use dynamically prioritized top 5 if available
  const topOpps = dashboardToday?.top_5_actions && dashboardToday.top_5_actions.length > 0
    ? dashboardToday.top_5_actions.map((item: any) => {
        // Find matching raw opp or transform item
        const raw = allOpps.find((o: any) => o.company_id === item.company_id);
        return {
          id: raw?.id || item.company_id,
          company_id: item.company_id,
          score: item.opportunity_score,
          priority: item.priority,
          score_factors: item.score_factors,
          evidence: item.trigger,
          reasoning: item.why_selected,
          confidence: item.confidence,
          recommended_action: item.recommended_action,
          created_at: item.last_updated,
        };
      })
    : allOpps.slice(0, 5);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <DashboardClient
        topOpps={topOpps}
        allOpps={allOpps}
        signals={signals}
        companies={companies}
      />
    </main>
  );
}

