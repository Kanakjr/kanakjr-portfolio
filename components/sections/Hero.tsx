"use client";

import RetroGrid from "@/components/magicui/retro-grid";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import ShimmerButton from "@/components/magicui/shimmer-button";
import BorderBeam from "@/components/magicui/border-beam";
import Image from "next/image";
import { portfolioData } from "@/lib/data";

export default function Hero() {
  const { hero } = portfolioData;
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <RetroGrid className="opacity-100" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center max-w-5xl mx-auto py-20">
        {/* Avatar with Border Beam */}
        <div className="relative h-48 w-48">
          <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/20">
            <Image
              src="/avatar.jpg"
              alt={hero.name}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          <BorderBeam
            size={220}
            duration={12}
            borderWidth={2}
            colorFrom="rgba(255, 215, 0, 0.6)"
            colorTo="rgba(255, 69, 0, 0.6)"
          />
        </div>

        {/* Title with Typing Animation */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-bold text-white font-mono md:text-7xl">
            I&apos;m <span className="text-cyber-yellow">{hero.name}</span>
          </h1>

          <div className="flex items-center gap-3 text-3xl md:text-4xl">
            <span className="text-neutral-300">I am a</span>
            <TypingAnimation
              words={["GenAI Engineer", "Security Specialist", "Agent Builder", "Innovator"]}
              className="text-cyber-yellow font-bold"
              typeSpeed={80}
              deleteSpeed={40}
              pauseDelay={2000}
              loop
              cursorStyle="line"
            />
          </div>
        </div>

        {/* Description */}
        <p className="max-w-2xl text-lg text-neutral-400 md:text-xl">
          {hero.tagline}
        </p>
        
        <p className="max-w-2xl text-base text-neutral-500 font-mono">
          {hero.bio}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="/resume">
            <ShimmerButton
              shimmerColor="#FFD700"
              background="rgba(255, 215, 0, 0.1)"
              className="border-cyber-yellow/30 text-cyber-yellow hover:border-cyber-yellow"
            >
              View Resume
            </ShimmerButton>
          </a>

          <ShimmerButton
            shimmerColor="#FF4500"
            background="rgba(255, 69, 0, 0.1)"
            className="border-retro-red/30 text-retro-red hover:border-retro-red"
            onClick={() => {
              const footer = document.querySelector('footer');
              if (footer) {
                footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            Get in Touch
          </ShimmerButton>
        </div>

      </div>
    </section>
  );
}
