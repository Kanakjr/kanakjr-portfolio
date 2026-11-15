import { portfolioData } from "@/lib/data";

export default function Achievements() {
  return (
    <section id="achievements" className="relative px-4 py-14 md:py-20">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
        <div className="mb-10 flex flex-col gap-2 md:mb-12">
          <h2 className="font-mono text-3xl font-bold text-white md:text-5xl">
            Awards & <span className="text-cyber-yellow">recognition</span>
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-x-10 border-t border-white/10 md:grid-cols-2">
          {portfolioData.achievements.map((a) => {
            const inner = (
              <>
                <span className="font-medium text-white transition-colors group-hover:text-cyber-yellow">
                  {a.title}
                </span>
                <span className="font-mono text-xs text-neutral-500">
                  {a.organization}
                  {a.link ? " ↗" : ""}
                </span>
              </>
            );
            return (
              <li key={a.title} className="border-b border-white/10">
                {a.link ? (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={a.description}
                    className="group flex flex-col gap-1 py-4"
                  >
                    {inner}
                  </a>
                ) : (
                  <div title={a.description} className="flex flex-col gap-1 py-4">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
