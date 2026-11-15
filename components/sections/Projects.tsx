import Image from "next/image";
import Link from "next/link";
import { portfolioData } from "@/lib/data";

type ProjectLink = { label: string; url: string; kind: "blog" | "code" | "demo" };

const projects = portfolioData.projects;

function linksFor(project: (typeof projects)[number]): ProjectLink[] {
  const links: ProjectLink[] = [];
  if (project.blog) links.push({ label: "Read the build", url: project.blog, kind: "blog" });
  if (project.githubLinks) {
    project.githubLinks.forEach((l) => links.push({ label: `${l.label} code`, url: l.url, kind: "code" }));
  } else if (project.github) {
    links.push({ label: "Code", url: project.github, kind: "code" });
  }
  if (project.demoVideos) {
    project.demoVideos.forEach((v) => links.push({ label: `Demo ${v.label}`, url: v.url, kind: "demo" }));
  } else if (project.demoVideo) {
    links.push({ label: "Demo", url: project.demoVideo, kind: "demo" });
  }
  return links;
}

const positionClass: Record<string, string> = {
  left: "object-left",
  right: "object-right",
  top: "object-top",
};

function Cover({ project }: { project: (typeof projects)[number] }) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt=""
        fill
        sizes={project.wide ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
          positionClass[project.imagePosition ?? ""] ?? "object-center"
        }`}
      />
    );
  }
  // No screenshot available: a typographic cover in the site's palette
  return (
    <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.18),transparent_60%)] p-6">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyber-yellow/70">
        {project.category}
      </span>
      <span className="font-mono text-2xl font-bold text-white/90">
        {project.githubLinks?.map((l) => l.label).join(" · ") ?? project.title}
      </span>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative px-4 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-2 md:mb-12">
          <h2 className="font-mono text-3xl font-bold text-white md:text-5xl">
            Things I&apos;ve <span className="text-cyber-yellow">built</span>
          </h2>
          <p className="text-neutral-400 md:text-lg">
            AI agents, home-lab hardware, and the occasional rescued router.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const links = linksFor(project);
            const primary = links[0];
            const rest = links.slice(1);
            return (
              <article
                key={project.title}
                className={`group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-cyber-yellow/40 ${
                  project.wide ? "lg:col-span-2" : ""
                }`}
              >
                <div className="relative aspect-[2/1] overflow-hidden border-b border-white/10 bg-neutral-900 md:aspect-[16/9] lg:aspect-auto lg:h-56">
                  <Cover project={project} />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyber-yellow/80">
                    {project.category}
                  </span>
                  <h3 className="font-mono text-xl font-bold leading-snug text-white">
                    {project.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-neutral-400">
                    {project.description}
                  </p>
                  <p className="font-mono text-xs text-neutral-500">
                    {project.tech.slice(0, 4).join(" · ")}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                    {primary &&
                      (primary.kind === "blog" ? (
                        <Link
                          href={primary.url}
                          className="inline-flex items-center gap-1.5 rounded-md bg-cyber-yellow px-3 py-1.5 font-mono text-xs font-semibold text-black transition-opacity hover:opacity-85"
                        >
                          {primary.label} →
                        </Link>
                      ) : (
                        <a
                          href={primary.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md bg-cyber-yellow px-3 py-1.5 font-mono text-xs font-semibold text-black transition-opacity hover:opacity-85"
                        >
                          {primary.label} ↗
                        </a>
                      ))}
                    {rest.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target={l.kind === "blog" ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-neutral-400 underline-offset-4 transition-colors hover:text-cyber-yellow hover:underline"
                      >
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
