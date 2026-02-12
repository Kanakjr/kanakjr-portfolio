"use client";

import MagicCard from "@/components/magicui/magic-card";
import { portfolioData } from "@/lib/data";

const projects = portfolioData.projects;

const projectIcons: Record<string, React.ReactNode> = {
  "NewsGenius - GenAI based News Article Generation": (
    <svg className="h-10 w-10" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
  SalesCompanionAgent: (
    <svg className="h-10 w-10" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  BillBot: (
    <svg className="h-10 w-10" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  "CryptoVulnerability - Responsible Vulnerability Reporting": (
    <svg className="h-10 w-10" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  KanoServer: (
    <svg className="h-10 w-10" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
};

export default function Projects() {
  return (
    <section className="relative py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white font-mono md:text-5xl mb-4">
            Project <span className="text-cyber-yellow">Showcase</span>
          </h2>
          <p className="text-neutral-400 text-lg">
            Building innovative solutions across multiple domains
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <MagicCard
              key={project.title}
              className="p-6 hover:scale-105 transition-transform duration-300"
              gradientSize={300}
              gradientColor="#FFD700"
              gradientOpacity={0.4}
            >
              <div className="space-y-4">
                <div className="text-white">
                  {projectIcons[project.title]}
                </div>

                <h3 className="text-2xl font-bold text-white font-mono">
                  {project.title}
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/20 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-white/5 hover:bg-cyber-yellow/10 border border-white/10 hover:border-cyber-yellow/50 rounded-lg text-white hover:text-cyber-yellow transition-all font-mono text-center text-sm"
                    >
                      GitHub →
                    </a>
                  )}
                  {project.demoVideo && (
                    <a
                      href={project.demoVideo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-retro-red/10 hover:bg-retro-red/20 border border-retro-red/20 hover:border-retro-red/50 rounded-lg text-white hover:text-retro-red transition-all font-mono text-center text-sm"
                    >
                      Demo →
                    </a>
                  )}
                </div>
              </div>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  );
}
