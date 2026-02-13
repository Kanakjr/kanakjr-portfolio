"use client";

import { BentoGrid } from "@/components/magicui/bento-grid";
import { Meteors } from "@/components/magicui/meteors";
import { portfolioData } from "@/lib/data";

const experienceIcons = {
  "Amdocs (Amaiz AI)": (
    <svg
      className="h-8 w-8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
    </svg>
  ),
  "PwC U.S. Advisory": (
    <svg
      className="h-8 w-8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
    </svg>
  ),
  "Digitate (Ignio AI), TCS": (
    <svg
      className="h-8 w-8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
    </svg>
  ),
};

export default function Career() {
  return (
    <section id="career" className="relative py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white font-mono md:text-5xl mb-4">
            Career <span className="text-cyber-yellow">Journey</span>
          </h2>
          <p className="text-neutral-400 text-lg">
            Building the future of AI and Cybersecurity
          </p>
        </div>

        <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[28rem]">
          {portfolioData.experience.map((exp, index) => (
            <div
              key={exp.company}
              className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyber-yellow/50 transition-all duration-500 ease-out hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]"
            >
              <Meteors number={15} opacity={0.2} />
              
              <div className="relative z-10 flex flex-col gap-4 p-6">
                <div className="flex items-start justify-between">
                  <div className="text-cyber-yellow">
                    {experienceIcons[exp.company as keyof typeof experienceIcons]}
                  </div>
                  <span className="text-xs text-neutral-500 font-mono bg-white/5 px-3 py-1 rounded-full">
                    {exp.period}
                  </span>
                </div>
                
                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold text-white font-mono leading-tight">
                    {exp.role}
                  </h3>
                  <p className="text-lg text-cyber-yellow font-mono">
                    {exp.company}
                  </p>
                  <p className="text-neutral-400 leading-relaxed text-sm">
                    {exp.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
