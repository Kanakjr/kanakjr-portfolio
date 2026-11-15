import { portfolioData } from "@/lib/data";

export default function Patents() {
  return (
    <section id="patents" className="relative px-4 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-2 md:mb-12">
          <h2 className="font-mono text-3xl font-bold text-white md:text-5xl">
            <span className="text-cyber-yellow">Patents</span>
          </h2>
          <p className="text-neutral-400 md:text-lg">
            Innovations in AI-powered data analysis and visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {portfolioData.patents.map((patent) => (
            <a
              key={patent.id}
              href={patent.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-cyber-yellow/40"
            >
              <div className="flex items-center justify-between gap-4 font-mono text-xs">
                <span className="text-cyber-yellow">{patent.id}</span>
                <span className="text-neutral-500">{patent.date}</span>
              </div>
              <h3 className="text-lg font-bold leading-snug text-white md:text-xl">
                {patent.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-400">{patent.description}</p>
              <span className="mt-auto pt-1 font-mono text-xs text-neutral-400 transition-colors group-hover:text-cyber-yellow">
                Read the patent (PDF) ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
