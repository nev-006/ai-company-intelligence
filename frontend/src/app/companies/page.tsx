import CompaniesListClient from "@/components/CompaniesListClient";

export const dynamic = "force-dynamic";

async function getCompanies() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/companies/`", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function Companies() {
  const companies = await getCompanies();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <CompaniesListClient initialCompanies={companies} />
    </main>
  );
}

