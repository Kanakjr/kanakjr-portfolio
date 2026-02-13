"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLE_QUESTIONS = [
  "What are Kanak's key skills?",
  "Tell me about his patents",
  "What GenAI projects has he built?",
  "What's his work experience?",
];

/* ------------------------------------------------------------------ */
/*  Simple inline markdown renderer (bold, links, inline code)        */
/* ------------------------------------------------------------------ */
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Regex: **bold** | [link text](url) | `code`
  const regex = /(\*\*(.*?)\*\*|\[(.*?)\]\((.*?)\)|`(.*?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>
      );
    }

    if (match[2] !== undefined) {
      // Bold
      parts.push(
        <strong key={key++} className="font-semibold text-white">
          {match[2]}
        </strong>
      );
    } else if (match[3] !== undefined && match[4] !== undefined) {
      // Link
      const isExternal = match[4].startsWith("http");
      parts.push(
        <a
          key={key++}
          href={match[4]}
          className="text-cyber-yellow underline underline-offset-2 decoration-cyber-yellow/40 hover:decoration-cyber-yellow transition-colors"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {match[3]}
        </a>
      );
    } else if (match[5] !== undefined) {
      // Inline code
      parts.push(
        <code
          key={key++}
          className="px-1 py-0.5 rounded bg-white/10 text-cyber-yellow text-xs font-mono"
        >
          {match[5]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return parts.length > 0 ? parts : [<Fragment key={0}>{text}</Fragment>];
}

function MessageContent({ content }: { content: string }) {
  const paragraphs = content.split("\n\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Unordered list
        if (/^[-*] /m.test(trimmed)) {
          const items = trimmed.split("\n").filter(Boolean);
          return (
            <ul key={i} className="list-disc list-outside pl-4 space-y-1">
              {items.map((item, j) => (
                <li key={j}>{renderInline(item.replace(/^[-*] /, ""))}</li>
              ))}
            </ul>
          );
        }

        // Numbered list
        if (/^\d+\. /m.test(trimmed)) {
          const items = trimmed.split("\n").filter(Boolean);
          return (
            <ol key={i} className="list-decimal list-outside pl-4 space-y-1">
              {items.map((item, j) => (
                <li key={j}>
                  {renderInline(item.replace(/^\d+\.\s*/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        // Regular paragraph
        const lines = trimmed.split("\n");
        return (
          <p key={i}>
            {lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {renderInline(line)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading dots animation                                            */
/* ------------------------------------------------------------------ */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-cyber-yellow/70"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Jarvis Chat component                                        */
/* ------------------------------------------------------------------ */
export default function JarvisChat() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    error,
  } = useChat({
    api: "/api/chat",
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Keyboard shortcuts: Cmd/Ctrl+K to toggle, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleExampleClick = (question: string) => {
    append({ role: "user", content: question });
  };

  const showExamples = messages.length === 0;

  return (
    <>
      {/* ── Floating trigger button ─────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/15 text-white text-sm font-medium shadow-lg shadow-black/30 hover:border-cyber-yellow/50 hover:shadow-cyber-yellow/10 transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Jarvis icon */}
        <span className="relative flex items-center justify-center w-5 h-5">
          <span className="absolute inset-0 rounded-full bg-cyber-yellow/20 group-hover:bg-cyber-yellow/30 transition-colors" />
          <svg
            className="relative w-3.5 h-3.5 text-cyber-yellow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
            />
          </svg>
        </span>
        <span>Ask Jarvis</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-neutral-400">
          <span className="text-[9px]">&#8984;</span>K
        </kbd>
      </motion.button>

      {/* ── Chat panel ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop (mobile) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed z-50 bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[min(600px,calc(100vh-8rem))] flex flex-col rounded-2xl border border-white/10 bg-[#0c0c0c]/95 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden"
            >
              {/* ── Header ──────────────────────────────────────── */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyber-yellow/10 border border-cyber-yellow/20">
                    <svg
                      className="w-4 h-4 text-cyber-yellow"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white font-mono">
                      Jarvis
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      AI-powered assistant
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* ── Messages area ───────────────────────────────── */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0 scrollbar-thin">
                {/* Welcome message */}
                {showExamples && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-cyber-yellow/10 border border-cyber-yellow/20 flex items-center justify-center mt-0.5">
                        <svg
                          className="w-3.5 h-3.5 text-cyber-yellow"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                          />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-neutral-300">
                          Hi! I&apos;m Jarvis, Kanak&apos;s AI assistant.
                          I can help you learn about his experience, projects,
                          skills, and more. How can I help you today?
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          AI-generated response
                        </p>
                      </div>
                    </div>

                    {/* Example questions */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                        Example questions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {EXAMPLE_QUESTIONS.map((question) => (
                          <button
                            key={question}
                            onClick={() => handleExampleClick(question)}
                            disabled={isLoading}
                            className="text-left text-xs px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-300 hover:border-cyber-yellow/30 hover:bg-cyber-yellow/5 hover:text-white transition-all duration-200 disabled:opacity-50"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat messages */}
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    {message.role === "assistant" ? (
                      <>
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-cyber-yellow/10 border border-cyber-yellow/20 flex items-center justify-center mt-0.5">
                          <svg
                            className="w-3.5 h-3.5 text-cyber-yellow"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-neutral-300">
                            <MessageContent content={message.content} />
                          </div>
                          <p className="text-[11px] text-neutral-500 mt-1.5">
                            AI-generated response
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="ml-auto max-w-[85%]">
                        <div className="px-3.5 py-2.5 rounded-2xl rounded-br-md bg-cyber-yellow/10 border border-cyber-yellow/20 text-sm text-white">
                          {message.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading &&
                  messages.length > 0 &&
                  messages[messages.length - 1].role === "user" && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-cyber-yellow/10 border border-cyber-yellow/20 flex items-center justify-center mt-0.5">
                        <svg
                          className="w-3.5 h-3.5 text-cyber-yellow"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                          />
                        </svg>
                      </div>
                      <TypingIndicator />
                    </div>
                  )}

                {/* Error message */}
                {error && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-red-400">
                      Something went wrong. Please try again.
                    </p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ── Input area ──────────────────────────────────── */}
              <div className="border-t border-white/10 bg-white/[0.02] p-3">
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about Kanak's work..."
                    disabled={isLoading}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyber-yellow/40 focus:ring-1 focus:ring-cyber-yellow/20 disabled:opacity-50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyber-yellow/10 border border-cyber-yellow/20 text-cyber-yellow hover:bg-cyber-yellow/20 disabled:opacity-30 disabled:hover:bg-cyber-yellow/10 transition-colors"
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
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
