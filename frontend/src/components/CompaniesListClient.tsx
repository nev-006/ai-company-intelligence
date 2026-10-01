"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddCompanyModal from "./AddCompanyModal";

interface Company {
  id: number;
  name: string;
  website: string;
  created_at: string;
}

interface CompaniesListClientProps {
  initialCompanies: Company[];
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  } catch {
    return dateStr;
  }
}

export default function CompaniesListClient({ initialCompanies }: CompaniesListClientProps) {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.website.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleDelete(companyId: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this company and all its intelligence data?")) {
      return;
    }

    setDeletingId(companyId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${companyId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCompanies((prev) => prev.filter((c) => c.id !== companyId));
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete company:", err);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Companies Directory</h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage target accounts, trigger autonomous research, and track opportunity lifecycles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 cursor-pointer transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Add & Analyze Company</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <svg
            className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search companies by name or website..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Companies Table / Card Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center text-xl font-bold border border-blue-500/20">
                🏢
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No companies found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {searchQuery
                    ? `No companies matching "${searchQuery}". Try clearing your search.`
                    : "Get started by adding your first target company to run the intelligence pipeline."}
                </p>
              </div>
              {!searchQuery && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer transition-all shadow-md shadow-blue-600/30"
                >
                  <span>+ Ingest First Company</span>
                </button>
              )}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-950/60">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Website
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Date Ingested
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900">
                {filtered.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                          {company.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                          {company.name}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-mono inline-flex items-center gap-1"
                      >
                        <span>{company.website}</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-mono" suppressHydrationWarning>
                      {formatDate(company.created_at)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-2">
                      <Link
                        href={`/companies/${company.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition-all font-medium"
                      >
                        <span>View Intelligence Deep Dive</span>
                        <span>&rarr;</span>
                      </Link>

                      <button
                        disabled={deletingId === company.id}
                        onClick={(e) => handleDelete(company.id, e)}
                        className="inline-flex items-center p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Company"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}

