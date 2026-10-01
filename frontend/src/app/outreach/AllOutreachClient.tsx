"use client";

import { useState } from "react";
import Link from "next/link";

interface OutreachItem {
  id: number;
  company_id: number;
  company_name: string;
  company_website: string;
  person_id: number;
  subject: string;
  opening: string;
  body: string;
  evidence_used?: string[];
  personalization_reasons?: string[];
}

export default function AllOutreachClient({ outreaches }: { outreaches: OutreachItem[] }) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (item: OutreachItem) => {
    navigator.clipboard.writeText(`Subject: ${item.subject}\n\n${item.body}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            Task 4 — Contextual Non-Generic Outreach Drafts
          </div>
          <h1 className="text-3xl font-black text-white">
            Generated Outreach Messages ({outreaches.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Grounded first-touch sales copy referencing verified company context, technical signals, and low-friction CTAs.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {outreaches.map((draft) => (
          <div
            key={draft.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 shadow-xl space-y-4 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <Link
                  href={`/companies/${draft.company_id}`}
                  className="text-xs font-bold text-blue-400 hover:underline"
                >
                  {draft.company_name}
                </Link>
                <div className="text-base font-bold text-white mt-0.5">
                  Subject: {draft.subject}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(draft)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {copiedId === draft.id ? (
                    <>
                      <span className="text-emerald-400">✓</span> Copied
                    </>
                  ) : (
                    <>
                      <span>📋</span> Copy
                    </>
                  )}
                </button>
                <Link
                  href={`/companies/${draft.company_id}/outreach`}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                >
                  Customize
                </Link>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
              {draft.body}
            </div>

            {draft.evidence_used && draft.evidence_used.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400 pt-1">
                <span className="font-semibold text-slate-400 uppercase text-[10px]">Evidence Hook:</span>
                {draft.evidence_used.map((ev, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {ev}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
