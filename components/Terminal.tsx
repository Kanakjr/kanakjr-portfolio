"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalLine {
  type: "input" | "output" | "error" | "system";
  text: string;
}

const PAGES: Record<string, { path: string; description: string }> = {
  home: { path: "/", description: "Home page" },
  blog: { path: "/blog", description: "Technical blog" },
  resume: { path: "/resume", description: "Resume / CV" },
  reels: { path: "/reels", description: "YouTube video gallery" },
  stills: { path: "/stills", description: "Photo gallery" },
  search: { path: "/search", description: "Semantic search" },
  graph: { path: "/graph", description: "Knowledge graph" },
};

const HELP_TEXT = `Available commands:

  help          Show this help message
  ls            List pages and sections
  cd <page>     Navigate to a page (e.g. cd blog)
  whoami        About Kanak Dahake Jr
  search <q>    Semantic search across the site
  cat <page>    Show page description
  clear         Clear terminal
  exit          Close terminal

Shortcut: press backtick (\`) to toggle terminal`;

const WHOAMI_TEXT = `Kanak Dahake Jr
Software Development Specialist - GenAI @ Amdocs
MS Cybersecurity - Georgia Tech (4.0 GPA)
2 US Patents | CompTIA Security+

Turning complex problems into intelligent systems --
from enterprise GenAI and cybersecurity to smart home automation.

GitHub:   github.com/kanakjr
LinkedIn: linkedin.com/in/kanak-dahake
Web:      kanakjr.in`;

const BOOT_LINES: TerminalLine[] = [
  { type: "system", text: "kanakjr.in terminal v1.0" },
  { type: "system", text: 'Type "help" for available commands.\n' },
];

export default function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>(BOOT_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "`" && !e.metaKey && !e.ctrlKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const addLines = useCallback(
    (...newLines: TerminalLine[]) => {
      setLines((prev) => [...prev, ...newLines]);
    },
    []
  );

  const executeCommand = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      addLines({ type: "input", text: `$ ${trimmed}` });
      setHistory((prev) => [...prev, trimmed]);
      setHistoryIdx(-1);

      const [cmd, ...args] = trimmed.split(/\s+/);
      const arg = args.join(" ");

      switch (cmd.toLowerCase()) {
        case "help":
          addLines({ type: "output", text: HELP_TEXT });
          break;

        case "ls":
          addLines({
            type: "output",
            text: Object.entries(PAGES)
              .map(([name, p]) => `  ${name.padEnd(10)} ${p.description}`)
              .join("\n"),
          });
          break;

        case "cd": {
          const target = PAGES[arg.toLowerCase()];
          if (!arg) {
            addLines({ type: "error", text: "Usage: cd <page>  (try: cd blog)" });
          } else if (target) {
            addLines({ type: "system", text: `Navigating to ${target.path}...` });
            setTimeout(() => {
              router.push(target.path);
              setIsOpen(false);
            }, 400);
          } else {
            addLines({
              type: "error",
              text: `cd: ${arg}: no such page. Try "ls" to see available pages.`,
            });
          }
          break;
        }

        case "cat": {
          const target = PAGES[arg.toLowerCase()];
          if (!arg) {
            addLines({ type: "error", text: "Usage: cat <page>" });
          } else if (target) {
            addLines({
              type: "output",
              text: `${arg}\n  Path: ${target.path}\n  ${target.description}`,
            });
          } else {
            addLines({ type: "error", text: `cat: ${arg}: not found` });
          }
          break;
        }

        case "whoami":
          addLines({ type: "output", text: WHOAMI_TEXT });
          break;

        case "search": {
          if (!arg) {
            addLines({ type: "error", text: "Usage: search <query>" });
            break;
          }
          addLines({ type: "system", text: `Searching for "${arg}"...` });
          try {
            const res = await fetch(
              `/api/search?q=${encodeURIComponent(arg)}`
            );
            const data = await res.json();
            const results = (data.results || []).slice(0, 5);
            if (results.length === 0) {
              addLines({ type: "output", text: "No results found." });
            } else {
              addLines({
                type: "output",
                text: results
                  .map(
                    (r: { title: string; source: string; url: string; score: number }) =>
                      `  [${r.source}] ${r.title}\n         ${r.url} (score: ${r.score})`
                  )
                  .join("\n\n"),
              });
            }
          } catch {
            addLines({ type: "error", text: "Search failed. Try again." });
          }
          break;
        }

        case "clear":
          setLines(BOOT_LINES);
          break;

        case "exit":
          setIsOpen(false);
          break;

        case "sudo":
          addLines({
            type: "error",
            text: "Permission denied. This incident will be reported... to no one, because this is a portfolio website.",
          });
          break;

        case "matrix":
          addLines({ type: "system", text: "Entering the Matrix..." });
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("easter-egg", { detail: "matrix" }));
          }, 500);
          break;

        case "coffee":
          addLines({
            type: "output",
            text: `
   ( (
    ) )
  ........
  |      |]
  \\      /
   \`----'
418: I'm a teapot... just kidding. Here's your coffee.`,
          });
          break;

        case "neofetch":
          addLines({
            type: "output",
            text: `  kanakjr.in @ ${new Date().getFullYear()}
  ─────────────────
  OS:        Next.js 15 / React 19
  Shell:     Terminal v1.0
  Theme:     Neo-Retro Dark
  AI:        Gemini 2.5 Flash
  RAG:       LangChain + Embeddings
  Uptime:    Since Dec 2024
  Stack:     TypeScript, Tailwind, Framer Motion`,
          });
          break;

        default:
          addLines({
            type: "error",
            text: `command not found: ${cmd}. Type "help" for available commands.`,
          });
      }
    },
    [addLines, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx !== -1) {
        const idx = historyIdx + 1;
        if (idx >= history.length) {
          setHistoryIdx(-1);
          setInput("");
        } else {
          setHistoryIdx(idx);
          setInput(history[idx]);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed z-[70] inset-4 sm:inset-12 md:inset-x-24 md:inset-y-16 flex flex-col rounded-xl border border-cyber-yellow/20 bg-[#0a0a0a]/98 shadow-2xl shadow-cyber-yellow/5 overflow-hidden"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors"
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-neutral-500 ml-3">
                kanakjr.in -- terminal
              </span>
              <kbd className="ml-auto text-[10px] font-mono text-neutral-600 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                ` to toggle
              </kbd>
            </div>

            {/* Output area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed scrollbar-thin"
            >
              {lines.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap mb-0.5">
                  {line.type === "input" && (
                    <span className="text-cyber-yellow">{line.text}</span>
                  )}
                  {line.type === "output" && (
                    <span className="text-neutral-300">{line.text}</span>
                  )}
                  {line.type === "error" && (
                    <span className="text-red-400">{line.text}</span>
                  )}
                  {line.type === "system" && (
                    <span className="text-neutral-500 italic">{line.text}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-white/10 bg-white/[0.02] px-4 py-3 flex items-center gap-2">
              <span className="text-cyber-yellow font-mono text-sm">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm font-mono text-white placeholder:text-neutral-600 focus:outline-none"
                placeholder="type a command..."
                autoFocus
                spellCheck={false}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
