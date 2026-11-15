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
            <div
              key={patent.id}
              className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-cyber-yellow/40"
            >
              <div className="flex items-center justify-between gap-4 font-mono text-xs">
                <span className="text-cyber-yellow">{patent.id}</span>
                <span className="text-neutral-500">{patent.date}</span>
              </div>
              <h3 className="text-lg font-bold leading-snug text-white md:text-xl">
                {patent.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-400">{patent.description}</p>
              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                <a
                  href={patent.googlePatents}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-cyber-yellow px-3 py-1.5 font-mono text-xs font-semibold text-black transition-opacity hover:opacity-85"
                >
                  Google Patents ↗
                </a>
                <a
                  href={patent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-neutral-400 underline-offset-4 transition-colors hover:text-cyber-yellow hover:underline"
                >
                  PDF ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
