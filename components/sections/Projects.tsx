"use client";

import MagicCard from "@/components/magicui/magic-card";
import { portfolioData } from "@/lib/data";

const projects = portfolioData.projects;

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
                <div className="text-5xl">{project.icon}</div>

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
