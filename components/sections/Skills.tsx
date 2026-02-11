"use client";

import IconCloud from "@/components/magicui/icon-cloud";
import { portfolioData } from "@/lib/data";

const slugs = [
  "python",
  "javascript",
  "bash",
  "react",
  "streamlit",
  "amazonaws",
  "microsoftazure",
  "docker",
  "kubernetes",
  "git",
  "ansible",
  "mongodb",
  "neo4j",
  "tensorflow",
  "pytorch",
  "openai",
];

export default function Skills() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white font-mono md:text-5xl mb-4">
            Competency <span className="text-cyber-yellow">Spectrum</span>
          </h2>
          <p className="text-neutral-400 text-lg">
            Technologies and tools I work with
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Icon Cloud */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-[500px] aspect-square">
              <IconCloud iconSlugs={slugs} />
            </div>
          </div>

          {/* Skill Categories */}
          <div className="space-y-8">
            <div className="group">
              <h3 className="text-2xl font-bold text-cyber-yellow font-mono mb-4 group-hover:text-retro-red transition-colors">
                Core Technologies
              </h3>
              <div className="flex flex-wrap gap-3">
                {portfolioData.skills.core.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-neutral-300 hover:border-cyber-yellow/50 hover:text-cyber-yellow transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="group">
              <h3 className="text-2xl font-bold text-cyber-yellow font-mono mb-4 group-hover:text-retro-red transition-colors">
                AI & Machine Learning
              </h3>
              <div className="flex flex-wrap gap-3">
                {portfolioData.skills.ai.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-neutral-300 hover:border-cyber-yellow/50 hover:text-cyber-yellow transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="group">
              <h3 className="text-2xl font-bold text-cyber-yellow font-mono mb-4 group-hover:text-retro-red transition-colors">
                Development Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {portfolioData.skills.stack.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-neutral-300 hover:border-cyber-yellow/50 hover:text-cyber-yellow transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
