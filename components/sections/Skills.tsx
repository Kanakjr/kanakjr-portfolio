import { portfolioData } from "@/lib/data";

export default function Skills() {
  const groups = portfolioData.skillGroups;
  const featured = groups.find((g) => g.featured);
  const rest = groups.filter((g) => !g.featured);

  return (
    <section id="skills" className="relative px-4 py-14 md:py-20">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
        <div className="mb-10 flex flex-col gap-2 md:mb-12">
          <h2 className="font-mono text-3xl font-bold text-white md:text-5xl">
            Tool<span className="text-cyber-yellow">kit</span>
          </h2>
          <p className="text-neutral-400 md:text-lg">
            Agents first: what I build them with, and what I ship them on.
          </p>
        </div>

        {featured && (
          <div className="mb-8 rounded-xl border border-cyber-yellow/30 bg-cyber-yellow/[0.04] p-6 md:p-8">
            <div className="mb-5 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
              <h3 className="font-mono text-xl font-bold text-cyber-yellow md:text-2xl">{featured.title}</h3>
              <p className="text-sm text-neutral-400 md:text-right">{featured.blurb}</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {featured.items.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md border border-cyber-yellow/25 bg-black/40 px-3 py-1.5 font-mono text-sm text-neutral-100"
                >
                  {skill}
                </li>
              ))}
            </ul>
            {featured.usedIn && (
              <p className="mt-5 font-mono text-xs text-neutral-500">
                Used in: <span className="text-neutral-300">{featured.usedIn.join(" · ")}</span>
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((g) => (
            <div key={g.title} className="flex flex-col gap-3">
              <h3 className="font-mono text-sm uppercase tracking-[0.18em] text-cyber-yellow">{g.title}</h3>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-neutral-300"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
