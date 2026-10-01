import ActTodayClient from "./ActTodayClient";

export const dynamic = "force-dynamic";

async function getDashboardToday() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/dashboard/today", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Failed to load /api/dashboard/today:", err);
    return null;
  }
}

export default async function ActTodayPage() {
  const data = await getDashboardToday();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <ActTodayClient initialData={data} />
    </main>
  );
}

