import { portfolioData } from "@/lib/data";

// Simple stroke icons (24px grid), one per kind of recognition
const ICONS: Record<string, string> = {
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4zM17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3",
  patent: "M9 12h6M9 16h6M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v5h5",
  grad: "M12 14l9-5-9-5-9 5 9 5zM5 11.5v4.5c0 1.5 3.1 3 7 3s7-1.5 7-3v-4.5",
  download: "M12 3v12m0 0l-4-4m4 4l4-4M5 21h14",
  star: "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3z",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0012 3z",
  rocket: "M5 15c-1.5 1.5-2 4-2 6 2 0 4.5-.5 6-2M9 15l-3-3c1-4 4.5-8 11-9-1 6.5-5 10-9 11l-3-3zM15 9a1 1 0 100-2 1 1 0 000 2z",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4",
  lock: "M6 11h12v10H6zM8 11V8a4 4 0 018 0v3",
};

function Icon({ name, highlight }: { name: string; highlight?: boolean }) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
        highlight
          ? "border-cyber-yellow/50 bg-cyber-yellow/10 text-cyber-yellow"
          : "border-white/10 bg-white/[0.04] text-neutral-300"
      }`}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d={ICONS[name] ?? ICONS.star} />
      </svg>
    </div>
  );
}

export default function Achievements() {
  const items = portfolioData.recognition;

  return (
    <section id="achievements" className="relative px-4 py-14 md:py-20">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
        <div className="mb-8 flex flex-col gap-2 md:mb-10">
          <h2 className="font-mono text-3xl font-bold text-white md:text-5xl">
            Awards & <span className="text-cyber-yellow">recognition</span>
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
          {items.map((a) => {
            const external = a.link?.startsWith("http");
            const row = (
              <>
                <Icon name={a.icon} highlight={a.highlight} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span
                    className={`font-medium leading-snug transition-colors group-hover:text-cyber-yellow ${
                      a.highlight ? "text-cyber-yellow" : "text-white"
                    }`}
                  >
                    {a.title}
                    {a.link && <span className="ml-1.5 font-mono text-xs text-neutral-500">{external ? "↗" : "→"}</span>}
                  </span>
                  <span className="truncate font-mono text-xs text-neutral-500">{a.org}</span>
                  <span className="hidden text-sm text-neutral-400 md:block">{a.note}</span>
                </div>
                {a.year && <span className="shrink-0 pt-0.5 font-mono text-xs text-neutral-500">{a.year}</span>}
              </>
            );
            const cls = "group flex items-start gap-4 py-4";
            return (
              <li key={a.title} className="border-b border-white/10">
                {a.link ? (
                  <a
                    href={a.link}
                    className={cls}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {row}
                  </a>
                ) : (
                  <div className={cls}>{row}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
