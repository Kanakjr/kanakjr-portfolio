"use client";

import { portfolioData } from "@/lib/data";
import MagicCard from "@/components/magicui/magic-card";
import { Particles } from "@/components/magicui/particles";

export default function Patents() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color="#FFD700"
        refresh={false}
      />
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white font-mono md:text-5xl mb-4">
            Patent <span className="text-cyber-yellow">Portfolio</span>
          </h2>
          <p className="text-neutral-400 text-lg">
            Innovations in AI-powered data analysis and visualization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioData.patents.map((patent) => (
            <MagicCard
              key={patent.id}
              className="p-8 hover:scale-105 transition-transform duration-300"
              gradientSize={300}
              gradientColor="#FFD700"
              gradientOpacity={0.4}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="text-5xl">📜</div>
                  <span className="text-xs font-mono text-neutral-500 bg-white/5 px-3 py-1 rounded-full">
                    {patent.date}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-mono text-cyber-yellow">
                    {patent.id}
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {patent.title}
                  </h3>
                </div>

                <p className="text-neutral-400 text-sm leading-relaxed">
                  {patent.description}
                </p>

                <a
                  href={patent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-cyber-yellow/10 hover:bg-cyber-yellow/20 border border-cyber-yellow/20 hover:border-cyber-yellow/50 rounded-lg text-cyber-yellow hover:text-white transition-all font-mono text-sm"
                >
                  View Patent PDF →
                </a>
              </div>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  );
}
