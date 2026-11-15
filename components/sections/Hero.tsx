"use client";

import { TypingAnimation } from "@/components/magicui/typing-animation";
import Image from "next/image";
import Link from "next/link";
import { portfolioData } from "@/lib/data";

const HERO_IMAGE = "/hero/workshop-desk.jpg";

const proof = [
  { label: "AI Tech Lead @ Amdocs", href: "#career" },
  { label: "2 US patents", href: "#patents" },
  { label: "MS Cybersecurity, Georgia Tech", href: "#achievements" },
];

export default function Hero() {
  const { hero } = portfolioData;
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black md:min-h-[92vh] md:justify-center">
      {/* Full-bleed photo; the subject sits in the right third, text goes over the dark left side */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt={`${hero.name} in his home-lab workshop`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_30%] md:object-center"
        />
        {/* Mobile: fade up from the bottom. Desktop: fade in from the left. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/0 md:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-black from-15% via-black/60 via-40% to-transparent to-70% md:block" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-40 md:py-28">
        <div className="flex max-w-xl flex-col items-start gap-5 text-left">
          <span className="font-mono text-sm uppercase tracking-[0.2em] text-neutral-400">
            Hi, I&apos;m
          </span>
          <h1 className="-mt-3 font-mono text-4xl font-bold leading-tight text-cyber-yellow sm:text-5xl lg:text-6xl">
            {hero.name}
          </h1>

          {/* Fixed height + no wrapping so the typing effect never reflows the page */}
          <div className="flex h-9 items-center gap-2 whitespace-nowrap text-xl md:h-11 md:text-3xl">
            <span className="text-neutral-300">I am a</span>
            <TypingAnimation
              words={["AI Engineer", "Security Specialist", "Innovator", "Hacker"]}
              className="font-bold text-white"
              typeSpeed={80}
              deleteSpeed={40}
              pauseDelay={2000}
              loop
              cursorStyle="line"
            />
          </div>

          <p className="text-base text-neutral-300 md:text-lg">{hero.tagline}</p>

          <ul className="flex flex-wrap gap-2">
            {proof.map((p) => (
              <li key={p.label}>
                <a
                  href={p.href}
                  className="inline-block rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-xs text-neutral-200 backdrop-blur-sm transition-colors hover:border-cyber-yellow/60 hover:text-cyber-yellow"
                >
                  {p.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/resume"
              className="rounded-lg bg-cyber-yellow px-6 py-3 font-mono text-sm font-semibold text-black transition-opacity hover:opacity-85"
            >
              View resume
            </Link>
            <a
              href={`mailto:${hero.email}`}
              className="rounded-lg border border-white/25 bg-black/30 px-6 py-3 font-mono text-sm text-white backdrop-blur-sm transition-colors hover:border-cyber-yellow hover:text-cyber-yellow"
            >
              Email me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
