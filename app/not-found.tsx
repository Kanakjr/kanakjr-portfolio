"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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

const SOURCE_COLORS: Record<string, string> = {
  blog: "text-emerald-400 border-emerald-400/30",
  projects: "text-blue-400 border-blue-400/30",
  experience: "text-purple-400 border-purple-400/30",
  videos: "text-red-400 border-red-400/30",
};

export default function NotFound() {
  const pathname = usePathname();
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use the attempted path as a semantic search query
    const pathQuery = pathname
      .replace(/^\//, "")
      .replace(/[-_/]/g, " ")
      .trim();

    if (pathQuery) {
      fetch(`/api/search?q=${encodeURIComponent(pathQuery)}`)
        .then((r) => r.json())
        .then((data) => {
          setSuggestions((data.results || []).slice(0, 4));
        })
        .catch(() => setSuggestions([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [pathname]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <RetroGrid className="opacity-30" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-32">
        {/* 404 Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-8xl font-bold font-mono text-cyber-yellow/20 mb-4"
          >
            404
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-neutral-400 mb-2"
          >
            This page doesn&apos;t exist.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-neutral-500 font-mono"
          >
            Attempted: <span className="text-neutral-400">{pathname}</span>
          </motion.p>
        </div>

        {/* AI-powered suggestions */}
        {(loading || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider mb-4 text-center">
              You might be looking for
            </p>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-cyber-yellow/40 border-t-cyber-yellow rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((result, i) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Link href={result.url}>
                      <MagicCard className="p-4 hover:border-cyber-yellow/30 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-white font-mono truncate">
                              {result.title}
                            </h3>
                            <p className="text-xs text-neutral-500 truncate mt-0.5">
                              {result.snippet}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${
                              SOURCE_COLORS[result.source] ||
                              "text-neutral-400 border-white/10"
                            }`}
                          >
                            {result.source}
                          </span>
                        </div>
                      </MagicCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyber-yellow/10 border border-cyber-yellow/20 text-sm font-mono text-cyber-yellow hover:bg-cyber-yellow/20 transition-all"
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
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Go Home
          </Link>
          <Link
            href="/search"
            className="text-sm font-mono text-neutral-500 hover:text-cyber-yellow transition-colors"
          >
            Or try searching the site
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
