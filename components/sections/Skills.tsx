import { portfolioData } from "@/lib/data";

const groups = [
  { title: "Core", items: portfolioData.skills.core },
  { title: "AI & ML", items: portfolioData.skills.ai },
  { title: "Stack", items: portfolioData.skills.stack },
];

export default function Skills() {
  return (
    <section id="skills" className="relative px-4 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-2 md:mb-12">
          <h2 className="font-mono text-3xl font-bold text-white md:text-5xl">
            Tool<span className="text-cyber-yellow">kit</span>
          </h2>
          <p className="text-neutral-400 md:text-lg">Technologies and tools I work with.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title} className="flex flex-col gap-3">
              <h3 className="font-mono text-sm uppercase tracking-[0.18em] text-cyber-yellow">
                {g.title}
              </h3>
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
