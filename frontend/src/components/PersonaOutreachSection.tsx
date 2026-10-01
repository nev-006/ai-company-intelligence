"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Person {
  id: number;
  name?: string | null;
  job_title: string;
  relevance_reason: string;
  source: string;
  confidence: string;
}

interface Outreach {
  id: number;
  person_id?: number | null;
  subject: string;
  opening: string;
  body: string;
  evidence_used?: any;
  created_at: string;
}

interface PersonaOutreachSectionProps {
  companyId: number | string;
  people: Person[];
  outreaches: Outreach[];
}

export default function PersonaOutreachSection({
  companyId,
  people,
  outreaches,
}: PersonaOutreachSectionProps) {
  const router = useRouter();
  const [generatingForPersonId, setGeneratingForPersonId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerateOutreach(personId: number) {
    setGeneratingForPersonId(personId);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/outreach/generate/${personId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to generate outreach");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to generate outreach");
    } finally {
      setGeneratingForPersonId(null);
    }
  }

  function handleCopy(text: string, id: number) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* Personas Section (Task 3) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🎯</span> Recommended Personas & Decision Makers
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Task 3: Who to approach and why, adhering to anti-hallucination standards.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            {people.length} Persona{people.length === 1 ? "" : "s"}
          </span>
        </div>

        {people.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
            <p className="text-slate-400 text-sm">No personas identified yet.</p>
            <p className="text-xs text-slate-400">
              Click "Find Personas" in the action bar above to extract relevant leadership targets.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {people.map((p) => {
              const hasOutreach = outreaches.some((o) => o.person_id === p.id);
              const isGenerating = generatingForPersonId === p.id;

              return (
                <div
                  key={p.id}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-white text-base">
                          {p.name || p.job_title}
                        </h3>
                        {p.name && (
                          <span className="text-xs text-slate-400 font-medium">
                            • {p.job_title}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {p.source}
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={isGenerating}
                      onClick={() => handleGenerateOutreach(p.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        hasOutreach
                          ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                          <span>Drafting...</span>
                        </>
                      ) : (
                        <>
                          <span>✉️</span>
                          <span>{hasOutreach ? "Regenerate Outreach" : "Draft Personalised Outreach"}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-400 font-medium">Relevance: </strong>
                    {p.relevance_reason}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Generated Outreach Section (Task 4) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>✉️</span> Personalised Outreach Drafts
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Task 4: High-context first approaches built on concrete research facts rather than generic spam.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            {outreaches.length} Draft{outreaches.length === 1 ? "" : "s"}
          </span>
        </div>

        {outreaches.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
            <p className="text-slate-400 text-sm">No outreach generated yet.</p>
            <p className="text-xs text-slate-400">
              Click "Draft Personalised Outreach" on any persona card above to generate a customized first touch.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {outreaches.map((o) => {
              const fullEmail = `Subject: ${o.subject}\n\n${o.opening}\n\n${o.body}`;
              const isCopied = copiedId === o.id;

              return (
                <div
                  key={o.id}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 relative group"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                        Email Subject
                      </span>
                      <h4 className="text-sm font-bold text-blue-400">{o.subject}</h4>
                    </div>

                    <button
                      onClick={() => handleCopy(fullEmail, o.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <span className="text-emerald-400">✓</span>
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <span>📋</span>
                          <span>Copy Full Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300 font-sans leading-relaxed">
                    <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-900/30 text-blue-200">
                      <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">
                        Personalized Hook / Opening:
                      </span>
                      {o.opening}
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 whitespace-pre-wrap">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Value Proposition & Low-Friction CTA:
                      </span>
                      {o.body}
                    </div>
                  </div>

                  {/* Evidence Used Badges */}
                  {o.evidence_used && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
                        Specific Research Facts Injected:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {typeof o.evidence_used === "object" ? (
                          Object.entries(o.evidence_used).map(([k, v], idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-400 text-[10px] font-mono border border-slate-700/50"
                            >
                              <strong className="text-slate-300">{k}:</strong> {String(v)}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400">{String(o.evidence_used)}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

