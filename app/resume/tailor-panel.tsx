"use client";

import { useState } from "react";

interface TailorResult {
  tailoredSummary: string;
  relevantSkills: string[];
  highlightedExperience: string[];
  highlightedProjects: string[];
  tips: string;
}

export default function TailorPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TailorResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobRole.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/resume-tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobRole: jobRole.trim() }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-yellow/10 border border-cyber-yellow/30 text-cyber-yellow text-sm font-mono hover:bg-cyber-yellow/20 transition-colors print:hidden"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        AI Tailor for a Role
      </button>
    );
  }

  return (
    <div className="print:hidden border border-cyber-yellow/20 rounded-xl bg-cyber-yellow/5 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono font-semibold text-cyber-yellow flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          AI Resume Tailoring
        </h3>
        <button
          onClick={() => { setIsOpen(false); setResult(null); }}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-neutral-400">
        Enter a target job role and AI will highlight the most relevant parts of this resume.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          placeholder="e.g. Senior GenAI Engineer, ML Platform Lead..."
          disabled={loading}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyber-yellow/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !jobRole.trim()}
          className="px-4 py-2 rounded-lg bg-cyber-yellow/20 border border-cyber-yellow/30 text-cyber-yellow text-sm font-mono hover:bg-cyber-yellow/30 disabled:opacity-30 transition-colors whitespace-nowrap"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-cyber-yellow/40 border-t-cyber-yellow rounded-full animate-spin" />
              Analyzing...
            </span>
          ) : (
            "Tailor"
          )}
        </button>
      </form>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {result && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          <div>
            <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
              Tailored Summary
            </p>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {result.tailoredSummary}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-2">
              Most Relevant Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {result.relevantSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-full bg-cyber-yellow/10 border border-cyber-yellow/20 text-cyber-yellow text-xs font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
              Key Experience
            </p>
            <ul className="space-y-1">
              {result.highlightedExperience.map((exp) => (
                <li
                  key={exp}
                  className="text-sm text-neutral-300 flex items-start gap-2"
                >
                  <span className="text-cyber-yellow mt-1 flex-shrink-0">&#9679;</span>
                  {exp}
                </li>
              ))}
            </ul>
          </div>

          {result.highlightedProjects.length > 0 && (
            <div>
              <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                Relevant Projects
              </p>
              <ul className="space-y-1">
                {result.highlightedProjects.map((proj) => (
                  <li
                    key={proj}
                    className="text-sm text-neutral-300 flex items-start gap-2"
                  >
                    <span className="text-cyber-yellow mt-1 flex-shrink-0">&#9679;</span>
                    {proj}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.tips && (
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                Tip
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {result.tips}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
