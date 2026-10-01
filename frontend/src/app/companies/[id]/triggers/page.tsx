import TriggersHistoryClient from "./TriggersHistoryClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getCompany(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getSignals(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signals/company/${id}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getSnapshots(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${id}/snapshots`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function CompanyTriggersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [company, signals, snapshots] = await Promise.all([
    getCompany(id),
    getSignals(id),
    getSnapshots(id),
  ]);

  if (!company) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <TriggersHistoryClient
        company={company}
        initialSignals={signals}
        initialSnapshots={snapshots}
      />
    </main>
  );
}
