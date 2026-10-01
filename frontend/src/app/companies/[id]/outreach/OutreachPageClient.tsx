"use client";

import { useState } from "react";
import Link from "next/link";

interface OutreachItem {
  id: number;
  person_id: number;
  subject: string;
  opening: string;
  body: string;
  main_message?: string;
  call_to_action?: string;
  personalization_reasons?: string[];
  evidence_used?: string[];
  created_at?: string;
}

interface ContactItem {
  id: number;
  name: string | null;
  job_title: string;
  is_persona?: boolean;
}

export default function OutreachPageClient({
  company,
  outreaches,
  contacts,
}: {
  company: { id: number; name: string; website: string };
  outreaches: OutreachItem[];
  contacts: ContactItem[];
}) {
  const [selectedOutreach, setSelectedOutreach] = useState<OutreachItem | null>(outreaches[0] || null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [list, setList] = useState<OutreachItem[]>(outreaches);

  const contactMap = contacts.reduce((acc: Record<number, ContactItem>, c) => {
    acc[c.id] = c;
    return acc;
  }, {});

  const handleCopy = () => {
    if (!selectedOutreach) return;
    const textToCopy = `Subject: ${selectedOutreach.subject}\n\n${selectedOutreach.body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/companies/${company.id}/outreach`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Generation failed");
      const newDraft = await res.json();
      setList([newDraft, ...list]);
      setSelectedOutreach(newDraft);
    } catch (err) {
      console.error(err);
      alert("Failed to generate outreach. Ensure research has been run.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/companies" className="hover:text-white">Companies</Link>
          <span>/</span>
          <Link href={`/companies/${company.id}`} className="hover:text-white">{company.name}</Link>
          <span>/</span>
          <span className="text-blue-400 font-semibold">Personalized Outreach</span>
        </div>
        <Link
          href={`/companies/${company.id}`}
          className="text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
        >
          ← Back to Company Overview
        </Link>
      </div>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            Task 4 — Contextual Outreach Generator
          </div>
          <h1 className="text-3xl font-black text-white">
            {company.name} — Personalized Outreach
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in verified company research, active buying triggers, and specific persona priorities.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 disabled:opacity-50 transition-all cursor-pointer"
        >
          {generating ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Drafting Contextual Email...</span>
            </>
          ) : (
            <>
              <span>⚡ Generate New Draft</span>
            </>
          )}
        </button>
      </div>

      {selectedOutreach ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Draft Viewer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Recipient Role
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {contactMap[selectedOutreach.person_id]
                      ? contactMap[selectedOutreach.person_id].name || contactMap[selectedOutreach.person_id].job_title
                      : "Technical Decision Maker Persona"}
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <span className="text-emerald-400">✓</span> Copied to Clipboard
                    </>
                  ) : (
                    <>
                      <span>📋</span> Copy Full Email
                    </>
                  )}
                </button>
              </div>

              {/* Subject Line */}
              <div>
                <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider mb-1.5">
                  Subject Line
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-sm text-slate-200 border border-slate-800">
                  {selectedOutreach.subject}
                </div>
              </div>

              {/* Email Content Box */}
              <div>
                <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-1.5">
                  Email Body Content
                </div>
                <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {selectedOutreach.body}
                </div>
              </div>

              {/* Structural Sections Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <span className="font-bold text-cyan-400 text-[10px] uppercase block mb-1">
                    Opening Hook
                  </span>
                  <p className="text-slate-400 text-[11px]">{selectedOutreach.opening}</p>
                </div>
                {selectedOutreach.main_message && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <span className="font-bold text-indigo-400 text-[10px] uppercase block mb-1">
                      Core Value Prop
                    </span>
                    <p className="text-slate-400 text-[11px]">{selectedOutreach.main_message}</p>
                  </div>
                )}
                {selectedOutreach.call_to_action && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <span className="font-bold text-amber-400 text-[10px] uppercase block mb-1">
                      Low-Friction CTA
                    </span>
                    <p className="text-slate-400 text-[11px]">{selectedOutreach.call_to_action}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Personalization Evidence */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span>🎯</span> Grounded Company Evidence
              </h2>
              <p className="text-[11px] text-slate-400">
                Exact facts and trigger signals injected into this outreach draft to avoid generic boilerplate:
              </p>

              {selectedOutreach.evidence_used && selectedOutreach.evidence_used.length > 0 ? (
                <ul className="space-y-2 text-xs">
                  {selectedOutreach.evidence_used.map((ev, idx) => (
                    <li key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-start gap-2">
                      <span className="text-blue-400 font-bold shrink-0">✓</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-slate-400 italic">Context drawn from primary company intelligence.</div>
              )}

              {selectedOutreach.personalization_reasons && selectedOutreach.personalization_reasons.length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="font-bold text-[10px] uppercase text-emerald-400 block tracking-wider">
                    Personalization Strategy
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedOutreach.personalization_reasons.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Other Drafts Selector */}
            {list.length > 1 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
                <span className="font-bold text-[10px] uppercase text-slate-400 block tracking-wider mb-2">
                  Draft History ({list.length} Versions)
                </span>
                <div className="space-y-1.5">
                  {list.map((draft, idx) => (
                    <button
                      key={draft.id}
                      onClick={() => setSelectedOutreach(draft)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all ${
                        selectedOutreach.id === draft.id
                          ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <div className="truncate font-semibold">{draft.subject}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Version #{list.length - idx}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-sm text-slate-400 mb-4">No outreach drafted yet for this company.</p>
          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {generating ? "Drafting..." : "⚡ Generate Tailored Outreach Now"}
          </button>
        </div>
      )}
    </div>
  );
}
