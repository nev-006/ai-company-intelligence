import Link from "next/link";
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

async function getContacts(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${id}/contacts`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function CompanyContactsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [company, contacts] = await Promise.all([
    getCompany(id),
    getContacts(id),
  ]);

  if (!company) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/companies" className="hover:text-white">Companies</Link>
          <span>/</span>
          <Link href={`/companies/${id}`} className="hover:text-white">{company.name}</Link>
          <span>/</span>
          <span className="text-blue-400 font-semibold">Contacts & Personas</span>
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
          Task 3 — Find the Right Person & Anti-Hallucination
        </div>
        <h1 className="text-3xl font-black text-white">
          {company.name} — Relevant Contacts & Personas
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Identifies strategic decision-maker roles. Confirmed individuals are verified; unverified names are strictly designated as generic personas.
        </p>
      </div>

      {/* Contacts Grid */}
      {contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contacts.map((contact: any) => {
            const isPersona = contact.is_persona || !contact.name;

            return (
              <div
                key={contact.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-black text-white">
                          {contact.name || contact.job_title}
                        </span>
                        {isPersona ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            Strategic Persona
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            Confirmed Individual
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                          {contact.confidence || "High"} Confidence
                        </span>
                      </div>
                      {contact.name && (
                        <div className="text-xs font-semibold text-blue-400 mt-0.5">
                          {contact.job_title}
                        </div>
                      )}
                    </div>

                    {contact.linkedin_url && (
                      <a
                        href={contact.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline shrink-0 font-medium"
                      >
                        LinkedIn ↗
                      </a>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-slate-400 text-[10px] uppercase block">
                      Why this person is relevant
                    </span>
                    <p className="leading-relaxed">{contact.relevance_reason}</p>
                  </div>

                  {contact.approach_now_reason && (
                    <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/30 text-xs text-blue-200 space-y-1">
                      <span className="font-bold text-blue-400 text-[10px] uppercase block">
                        Why approach right now
                      </span>
                      <p className="leading-relaxed">{contact.approach_now_reason}</p>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Source: {contact.source || "Persona Matching Engine"}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <Link
                    href={`/companies/${id}/outreach`}
                    className="w-full block py-2 rounded-xl text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all"
                  >
                    Draft Outreach for this Role →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-sm text-slate-400 mb-4">No contacts or personas identified yet.</p>
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
