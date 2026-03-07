"use client";

import { useState, useRef, useEffect, useCallback, Fragment } from "react";
import { useChat } from "ai/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const EXAMPLE_QUESTIONS = [
  "What are Kanak's key skills?",
  "Tell me about his patents",
  "What GenAI projects has he built?",
  "What's his work experience?",
];

// Number of messages after which we trigger conversation summarization
const SUMMARY_THRESHOLD = 8;

/* ------------------------------------------------------------------ */
/*  Simple inline markdown renderer (bold, links, inline code)        */
/* ------------------------------------------------------------------ */
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
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
      parts.push(
        <strong key={key++} className="font-semibold text-white">
          {match[2]}
        </strong>
      );
    } else if (match[3] !== undefined && match[4] !== undefined) {
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
/*  Jarvis sparkle icon (reused in multiple places)                   */
/* ------------------------------------------------------------------ */
function JarvisIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={`${className} text-cyber-yellow`}
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
  );
}

/* ------------------------------------------------------------------ */
/*  Voice helpers (browser-native Web Speech API)                      */
/* ------------------------------------------------------------------ */
function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    setSupported(!!SR);
    if (SR) {
      const recognition: SpeechRecognitionLike = new SR();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = useCallback(
    (onResult: (transcript: string) => void) => {
      const recognition = recognitionRef.current;
      if (!recognition) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
      setIsListening(true);
    },
    []
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, supported, startListening, stopListening };
}

function speakText(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const clean = text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/`(.*?)`/g, "$1");
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = 1.05;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

/* ------------------------------------------------------------------ */
/*  Main Jarvis Chat component                                        */
/* ------------------------------------------------------------------ */
export default function JarvisChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationSummary, setConversationSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { isListening, supported: sttSupported, startListening, stopListening } =
    useSpeechRecognition();

  useEffect(() => {
    setTtsSupported(typeof window !== "undefined" && !!window.speechSynthesis);
  }, []);

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
    body: {
      currentPath: pathname,
      conversationSummary,
    },
  });

  // ── Conversation memory: summarize when history grows long ──────
  const summarizeConversation = useCallback(async () => {
    if (isSummarizing || messages.length < SUMMARY_THRESHOLD) return;
    setIsSummarizing(true);

    try {
      // Send older messages for summarization
      const toSummarize = messages.slice(0, -4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: toSummarize }),
      });

      const data = await res.json();
      if (data.summary) {
        setConversationSummary(data.summary);
      }
    } catch (err) {
      console.error("Summarization failed:", err);
    } finally {
      setIsSummarizing(false);
    }
  }, [messages, isSummarizing]);

  // Trigger summarization when conversation exceeds threshold
  useEffect(() => {
    if (
      messages.length >= SUMMARY_THRESHOLD &&
      messages.length % 4 === 0 &&
      !isLoading &&
      !isSummarizing
    ) {
      summarizeConversation();
    }
  }, [messages.length, isLoading, isSummarizing, summarizeConversation]);

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

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        append({ role: "user", content: transcript });
      });
    }
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
        <span className="relative flex items-center justify-center w-5 h-5">
          <span className="absolute inset-0 rounded-full bg-cyber-yellow/20 group-hover:bg-cyber-yellow/30 transition-colors" />
          <JarvisIcon className="relative w-3.5 h-3.5" />
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm sm:hidden"
              onClick={() => setIsOpen(false)}
            />

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
                    <JarvisIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white font-mono">
                      Jarvis
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      {conversationSummary
                        ? "Context-aware mode"
                        : "AI-powered assistant"}
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
                {showExamples && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-cyber-yellow/10 border border-cyber-yellow/20 flex items-center justify-center mt-0.5">
                        <JarvisIcon />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-neutral-300">
                          Hi! I&apos;m Jarvis, Kanak&apos;s AI assistant. I can
                          help you learn about his experience, projects, skills,
                          and more. How can I help you today?
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          AI-generated response
                        </p>
                      </div>
                    </div>

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

                {messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    {message.role === "assistant" ? (
                      <>
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-cyber-yellow/10 border border-cyber-yellow/20 flex items-center justify-center mt-0.5">
                          <JarvisIcon />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-neutral-300">
                            <MessageContent content={message.content} />
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <p className="text-[11px] text-neutral-500">
                              AI-generated response
                            </p>
                            {ttsSupported && (
                              <button
                                onClick={() => speakText(message.content)}
                                className="text-neutral-600 hover:text-cyber-yellow transition-colors"
                                title="Read aloud"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                </svg>
                              </button>
                            )}
                          </div>
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

                {isLoading &&
                  messages.length > 0 &&
                  messages[messages.length - 1].role === "user" && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-cyber-yellow/10 border border-cyber-yellow/20 flex items-center justify-center mt-0.5">
                        <JarvisIcon />
                      </div>
                      <TypingIndicator />
                    </div>
                  )}

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
                    placeholder={isListening ? "Listening..." : "Ask about Kanak's work..."}
                    disabled={isLoading || isListening}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyber-yellow/40 focus:ring-1 focus:ring-cyber-yellow/20 disabled:opacity-50 transition-colors"
                  />
                  {sttSupported && (
                    <button
                      type="button"
                      onClick={handleMicClick}
                      className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-colors ${
                        isListening
                          ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse"
                          : "bg-white/5 border-white/10 text-neutral-400 hover:text-cyber-yellow hover:border-cyber-yellow/30"
                      }`}
                      title={isListening ? "Stop listening" : "Voice input"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                  )}
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
