"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { portfolioData } from "@/lib/data";

const { stats, awards, certifications } = portfolioData.recognition;

function CountUp({ value, decimals, suffix }: { value: number; decimals: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setN(0);
    raf = requestAnimationFrame(tick);
    // Guarantee the final value even if rAF is throttled (background tab, low-power mode)
    const done = setTimeout(() => setN(value), dur + 150);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function Medal({ big = false }: { big?: boolean }) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyber-yellow to-orange-500 text-black shadow-[0_0_30px_rgba(255,200,0,0.25)] ${
        big ? "h-16 w-16" : "h-11 w-11"
      }`}
    >
      <svg
        className={big ? "h-8 w-8" : "h-5 w-5"}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4zM17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3" />
      </svg>
    </div>
  );
}

function Shield() {
  return (
    <svg className="h-5 w-5 text-cyber-yellow" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

export default function Achievements() {
  const featured = awards.find((a) => a.featured);
  const others = awards.filter((a) => !a.featured);

  return (
    <section id="achievements" className="relative overflow-hidden px-4 py-14 md:py-20">
      {/* soft spotlight behind the section */}
      <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-cyber-yellow/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-6xl 2xl:max-w-7xl">
        <div className="mb-10 flex flex-col gap-2 md:mb-12">
          <h2 className="font-mono text-3xl font-bold text-white md:text-5xl">
            Awards & <span className="text-cyber-yellow">recognition</span>
          </h2>
          <p className="text-neutral-400 md:text-lg">The highlight reel.</p>
        </div>

        {/* Headline numbers */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => {
            const body = (
              <>
                <div className="font-mono text-5xl font-bold leading-none text-cyber-yellow md:text-6xl">
                  <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
                </div>
                <div className="mt-3 font-mono text-sm uppercase tracking-[0.18em] text-white">{s.label}</div>
                <div className="mt-1 text-sm text-neutral-400">{s.detail}</div>
              </>
            );
            const cls =
              "group block rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-6 transition-colors duration-300 hover:border-cyber-yellow/40 md:p-7";
            return s.href ? (
              <a key={s.label} href={s.href} className={cls}>
                {body}
              </a>
            ) : (
              <div key={s.label} className={cls}>
                {body}
              </div>
            );
          })}
        </div>

        {/* Awards: featured card spans two columns and two rows */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featured && (
            <a
              href={featured.link ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-xl border border-cyber-yellow/40 bg-gradient-to-br from-cyber-yellow/[0.14] via-orange-500/[0.06] to-transparent p-6 md:col-span-2 lg:row-span-2 md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <Medal big />
                {featured.year && (
                  <span className="rounded-full border border-cyber-yellow/40 px-3 py-1 font-mono text-xs text-cyber-yellow">
                    {featured.year}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyber-yellow/80">{featured.org}</span>
                <h3 className="font-mono text-3xl font-bold text-white md:text-5xl">{featured.title}</h3>
                <p className="max-w-md text-neutral-300 md:text-lg">{featured.note}</p>
                <span className="mt-2 font-mono text-xs text-neutral-400 transition-colors group-hover:text-cyber-yellow">
                  See the announcement ↗
                </span>
              </div>
            </a>
          )}

          {others.map((a) => (
            <div
              key={a.title}
              className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-cyber-yellow/30"
            >
              <Medal />
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="font-bold leading-snug text-white">{a.title}</h3>
                <span className="font-mono text-xs text-cyber-yellow/80">
                  {a.org}
                  {a.year ? ` · ${a.year}` : ""}
                </span>
                <p className="text-sm text-neutral-400">{a.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">Certified</span>
          <div className="flex flex-wrap gap-3">
            {certifications.map((c) => {
              const inner = (
                <>
                  <Shield />
                  <span className="text-sm text-white">{c.title}</span>
                  <span className="font-mono text-xs text-neutral-500">{c.org}</span>
                  {c.link && <span className="font-mono text-xs text-neutral-500">↗</span>}
                </>
              );
              const cls =
                "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 transition-colors hover:border-cyber-yellow/50";
              return c.link ? (
                <a key={c.title} href={c.link} target="_blank" rel="noopener noreferrer" className={cls}>
                  {inner}
                </a>
              ) : (
                <span key={c.title} className={cls}>
                  {inner}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
