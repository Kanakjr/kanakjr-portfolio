"use client";

import RetroGrid from "@/components/magicui/retro-grid";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import Image from "next/image";
import Link from "next/link";
import { portfolioData } from "@/lib/data";

const proof = [
  { label: "AI Tech Lead @ Amdocs", href: "#career" },
  { label: "2 US patents", href: "#patents" },
  { label: "MS Cybersecurity, Georgia Tech", href: "#achievements" },
];

export default function Hero() {
  const { hero } = portfolioData;
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <RetroGrid className="opacity-100" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-24 text-center">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/15 md:h-44 md:w-44">
          <Image
            src="/avatar.jpg"
            alt={hero.name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        <div className="flex flex-col items-center gap-3 md:gap-4">
          <h1 className="font-mono text-4xl font-bold text-white sm:text-5xl md:text-7xl">
            I&apos;m <span className="whitespace-nowrap text-cyber-yellow">{hero.name}</span>
          </h1>

          {/* Fixed height + no wrapping so the typing effect never reflows the page */}
          <div className="flex h-9 items-center gap-2 whitespace-nowrap text-xl md:h-12 md:gap-3 md:text-4xl">
            <span className="text-neutral-300">I am a</span>
            <TypingAnimation
              words={["AI Engineer", "Security Specialist", "Innovator", "Hacker"]}
              className="font-bold text-cyber-yellow"
              typeSpeed={80}
              deleteSpeed={40}
              pauseDelay={2000}
              loop
              cursorStyle="line"
            />
          </div>
        </div>

        <p className="max-w-2xl text-base text-neutral-400 md:text-xl">
          {hero.tagline}
        </p>

        <ul className="flex flex-wrap justify-center gap-2">
          {proof.map((p) => (
            <li key={p.label}>
              <a
                href={p.href}
                className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-neutral-300 transition-colors hover:border-cyber-yellow/50 hover:text-cyber-yellow"
              >
                {p.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/resume"
            className="rounded-lg bg-cyber-yellow px-6 py-3 font-mono text-sm font-semibold text-black transition-opacity hover:opacity-85"
          >
            View resume
          </Link>
          <a
            href={`mailto:${hero.email}`}
            className="rounded-lg border border-white/20 px-6 py-3 font-mono text-sm text-white transition-colors hover:border-cyber-yellow hover:text-cyber-yellow"
          >
            Email me
          </a>
        </div>
      </div>
    </section>
  );
}
