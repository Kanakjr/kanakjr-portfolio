import { portfolioData } from "@/lib/data";

export default function Career() {
  return (
    <section id="career" className="relative px-4 py-14 md:py-20">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
        <div className="mb-10 flex flex-col gap-2 md:mb-12">
          <h2 className="font-mono text-3xl font-bold text-white md:text-5xl">
            Career <span className="text-cyber-yellow">journey</span>
          </h2>
          <p className="text-neutral-400 md:text-lg">
            Building the future of AI and cybersecurity.
          </p>
        </div>

        <ol className="flex flex-col divide-y divide-white/10 border-y border-white/10">
          {portfolioData.experience.map((exp) => (
            <li
              key={exp.company}
              className="grid grid-cols-1 gap-2 py-6 md:grid-cols-[200px_1fr] md:gap-8 md:py-8"
            >
              <span className="pt-1 font-mono text-xs uppercase tracking-wider text-neutral-500">
                {exp.period}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-mono text-lg font-bold text-white md:text-xl">
                  {exp.role}{" "}
                  <span className="text-cyber-yellow">· {exp.company}</span>
                </h3>
                <p className="max-w-3xl text-sm leading-relaxed text-neutral-400 md:text-base">
                  {exp.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
