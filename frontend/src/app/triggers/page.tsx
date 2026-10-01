import TriggersPageClient from "./TriggersPageClient";

export const dynamic = "force-dynamic";

async function getSignals() {
  try {
    const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/signals/", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getCompanies() {
  try {
    const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/companies/", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TriggersPage() {
  const [signals, companies] = await Promise.all([
    getSignals(),
    getCompanies(),
  ]);

  const companyMap = companies.reduce((acc: Record<number, any>, c: any) => {
    acc[c.id] = c;
    return acc;
  }, {});

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <TriggersPageClient signals={signals} companyMap={companyMap} />
    </main>
  );
}

