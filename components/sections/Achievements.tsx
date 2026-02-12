"use client";

import { portfolioData } from "@/lib/data";
import { Particles } from "@/components/magicui/particles";

const achievementIcons: Record<string, React.ReactNode> = {
  "MS Cybersecurity - 4.0 GPA": (
    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path d="M12 14v7" />
    </svg>
  ),
  "2 US Patents Filed": (
    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  "Certified Security+": (
    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  "Certified Information Assurance Professional": (
    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  "Innovator Award": (
    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  "The Best Engineering Student": (
    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  "Promising Innovator": (
    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  "100k+ App Downloads": (
    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
};

export default function Achievements() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-white/5 to-transparent overflow-hidden">
      <Particles
        className="absolute inset-0"
        quantity={150}
        ease={80}
        color="#FFD700"
        refresh={false}
      />
      
      <div className="mx-auto max-w-7xl relative z-10">
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
                    <div className="text-cyber-yellow mb-3">
                      {achievementIcons[achievement.title]}
                    </div>
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
                  <div className="text-cyber-yellow mb-3">
                    {achievementIcons[achievement.title]}
                  </div>
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
