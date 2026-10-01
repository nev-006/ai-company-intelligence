import OutreachPageClient from "./OutreachPageClient";
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

async function getOutreaches(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/outreach/company/${id}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getContacts(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/companies/${id}/contacts`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function CompanyOutreachPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [company, outreaches, contacts] = await Promise.all([
    getCompany(id),
    getOutreaches(id),
    getContacts(id),
  ]);

  if (!company) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <OutreachPageClient
        company={company}
        outreaches={outreaches}
        contacts={contacts}
      />
    </main>
  );
}
