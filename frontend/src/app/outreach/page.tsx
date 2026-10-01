import AllOutreachClient from "./AllOutreachClient";

export const dynamic = "force-dynamic";

async function getCompanies() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getAllOutreaches(companies: any[]) {
  const outreachPromises = companies.map(async (c) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/outreach/company/${c.id}`, { cache: "no-store" });
      if (!res.ok) return [];
      const drafts = await res.json();
      return drafts.map((d: any) => ({ ...d, company_name: c.name, company_website: c.website }));
    } catch {
      return [];
    }
  });

  const results = await Promise.all(outreachPromises);
  return results.flat();
}

export default async function GlobalOutreachPage() {
  const companies = await getCompanies();
  const outreaches = await getAllOutreaches(companies);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <AllOutreachClient outreaches={outreaches} />
    </main>
  );
}

