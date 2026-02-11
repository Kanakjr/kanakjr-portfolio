"use client";

import { portfolioData } from "@/lib/data";

export default function Achievements() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-white/5 to-transparent">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white font-mono md:text-5xl mb-4">
            Awards & <span className="text-cyber-yellow">Recognition</span>
          </h2>
          <p className="text-neutral-400 text-lg">
            Celebrating excellence in innovation and technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {portfolioData.achievements.map((achievement, index) => (
            <div
              key={achievement.title}
              className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyber-yellow/50 transition-all duration-500 p-6"
            >
              {achievement.link ? (
                <a
                  href={achievement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <div className="flex flex-col h-full">
                    <div className="text-3xl mb-3">🏆</div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyber-yellow transition-colors">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-cyber-yellow font-mono mb-2">
                      {achievement.organization}
                    </p>
                    <p className="text-xs text-neutral-400 leading-relaxed flex-1">
                      {achievement.description}
                    </p>
                    <div className="mt-4 flex items-center text-xs text-cyber-yellow opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View Certificate</span>
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="text-3xl mb-3">🏆</div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-cyber-yellow font-mono mb-2">
                    {achievement.organization}
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed flex-1">
                    {achievement.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
