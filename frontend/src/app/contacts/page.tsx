import Link from "next/link";

export const dynamic = "force-dynamic";

async function getCompanies() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/companies/`", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getAllContacts(companies: any[]) {
  const contactPromises = companies.map(async (c) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/companies/${c.id}/contacts`, { cache: "no-store" });
      if (!res.ok) return [];
      const contacts = await res.json();
      return contacts.map((ct: any) => ({ ...ct, company_name: c.name, company_website: c.website }));
    } catch {
      return [];
    }
  });

  const results = await Promise.all(contactPromises);
  return results.flat();
}

export default async function ContactsPage() {
  const companies = await getCompanies();
  const contacts = await getAllContacts(companies);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
            Task 3 — Global Decision-Maker Contacts & Personas
          </div>
          <h1 className="text-3xl font-black text-white">
            Decision-Maker Directory ({contacts.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Target buyers identified across all target accounts. Unverified names are strictly labeled as strategic personas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {contacts.map((contact: any) => {
          const isPersona = contact.is_persona || !contact.name;

          return (
            <div
              key={`${contact.company_id}-${contact.id}`}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/companies/${contact.company_id}`}
                      className="text-xs font-bold text-blue-400 hover:underline block"
                    >
                      {contact.company_name}
                    </Link>
                    <div className="text-sm font-black text-white mt-0.5">
                      {contact.name || contact.job_title}
                    </div>
                    {contact.name && (
                      <div className="text-xs text-slate-400 font-medium">
                        {contact.job_title}
                      </div>
                    )}
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                      isPersona
                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    }`}
                  >
                    {isPersona ? "Strategic Persona" : "Verified Individual"}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {contact.relevance_reason}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">
                  {contact.source || "Persona Matching"}
                </span>
                <Link
                  href={`/companies/${contact.company_id}/outreach`}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-colors"
                >
                  ✉️ Outreach
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

