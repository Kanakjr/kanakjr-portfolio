"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MagicCard from "@/components/magicui/magic-card";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Java: "#B07219",
  "Jupyter Notebook": "#DA5B0B",
  Shell: "#89E051",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Dockerfile: "#384D54",
};

export default function GitHubActivity() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://api.github.com/users/kanakjr/repos?sort=pushed&per_page=6&type=owner"
    )
      .then((r) => r.json())
      .then((data: GitHubRepo[]) => {
        if (Array.isArray(data)) {
          setRepos(data.filter((r) => !r.fork).slice(0, 6));
        }
      })
      .catch(() => setRepos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="relative py-20 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <div className="w-6 h-6 border-2 border-cyber-yellow/40 border-t-cyber-yellow rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (repos.length === 0) return null;

  return (
    <section className="relative py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white font-mono md:text-5xl mb-4">
            Open <span className="text-cyber-yellow">Source</span>
          </h2>
          <p className="text-neutral-400 text-lg">
            Recent activity on GitHub
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {repos.map((repo, i) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <MagicCard className="p-5 h-full hover:border-cyber-yellow/30 transition-all duration-300 cursor-pointer">
                <div className="flex flex-col gap-2 h-full">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-neutral-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                    </svg>
                    <span className="text-sm font-mono font-semibold text-white truncate">
                      {repo.name}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 line-clamp-2 flex-1">
                    {repo.description || "No description"}
                  </p>

                  <div className="flex items-center gap-3 mt-auto pt-2">
                    {repo.language && (
                      <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              LANGUAGE_COLORS[repo.language] || "#8b8b8b",
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                        </svg>
                        {repo.stargazers_count}
                      </span>
                    )}
                    <span className="text-[11px] text-neutral-600 ml-auto">
                      {new Date(repo.pushed_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </MagicCard>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://github.com/kanakjr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-mono text-neutral-500 hover:text-cyber-yellow transition-colors"
          >
            View all on GitHub
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
