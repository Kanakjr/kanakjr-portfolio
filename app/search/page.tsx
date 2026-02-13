"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import RetroGrid from "@/components/magicui/retro-grid";
import MagicCard from "@/components/magicui/magic-card";

interface SearchResult {
  id: string;
  source: string;
  title: string;
  snippet: string;
  url: string;
  score: number;
}

const SOURCE_LABELS: Record<string, string> = {
  blog: "Blog Post",
  projects: "Project",
  experience: "Experience",
  videos: "YouTube",
  patents: "Patent",
  skills: "Skills",
  certifications: "Certifications",
  awards: "Awards",
  profile: "Profile",
  summary: "Summary",
  education: "Education",
  volunteer: "Speaking",
  navigation: "Navigation",
  gallery: "Gallery",
};

const SOURCE_COLORS: Record<string, string> = {
  blog: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  projects: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  experience: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  videos: "text-red-400 border-red-400/30 bg-red-400/10",
  patents: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  skills: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchSkeleton() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <RetroGrid className="opacity-30" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-32">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white font-mono md:text-6xl mb-4">
            <span className="text-cyber-yellow">Search</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Semantic search across blog posts, projects, experience, and more.
          </p>
          <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-cyber-yellow to-retro-red" />
        </div>
        <div className="h-14 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
      </div>
    </main>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q.trim())}`
        );
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Search on initial load if query param exists
  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Update URL for bookmarkability without triggering a Next.js navigation
    window.history.replaceState(
      null,
      "",
      `/search?q=${encodeURIComponent(query.trim())}`
    );
    doSearch(query);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <RetroGrid className="opacity-30" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-32">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white font-mono md:text-6xl mb-4">
            <span className="text-cyber-yellow">Search</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Semantic search across blog posts, projects, experience, and more.
          </p>
          <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-cyber-yellow to-retro-red" />
        </div>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by meaning, e.g. 'smart home AI automation' or 'blockchain security'..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white text-lg placeholder:text-neutral-500 focus:outline-none focus:border-cyber-yellow/40 focus:ring-2 focus:ring-cyber-yellow/10 transition-all"
              autoFocus
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-cyber-yellow/40 border-t-cyber-yellow rounded-full animate-spin" />
              </div>
            )}
          </div>
        </form>

        {/* Results */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {results.map((result, i) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={result.url}>
                  <MagicCard className="p-5 hover:border-cyber-yellow/30 transition-all duration-300 cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono rounded-full border uppercase tracking-wider ${
                              SOURCE_COLORS[result.source] ||
                              "text-neutral-400 border-white/10 bg-white/5"
                            }`}
                          >
                            {SOURCE_LABELS[result.source] || result.source}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-600">
                            {result.score}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white font-mono mb-1 truncate">
                          {result.title}
                        </h3>
                        <p className="text-sm text-neutral-400 line-clamp-2">
                          {result.snippet}
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                  </MagicCard>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {hasSearched && !isSearching && results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500 font-mono">
                No results found. Try a different query.
              </p>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-neutral-500 hover:text-cyber-yellow transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
