import { Metadata } from "next";
import Link from "next/link";
import { resumeData } from "@/lib/resume";
import PrintButton from "./print-button";

export const metadata: Metadata = {
  title: "Resume | Kanak Dahake",
  description:
    "Resume of Kanak Dahake - Experienced Engineer specializing in GenAI, CyberSecurity, NLP, and multimodal RAG pipelines.",
};

/* Section heading: mono label with a hairline, yellow on screen, dark in print */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-cyber-yellow print:mb-2 print:text-black">
      <span>{children}</span>
      <span className="h-px flex-1 bg-white/10 print:bg-neutral-300" />
    </h2>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-neutral-300 print:border-neutral-300 print:bg-transparent print:px-1.5 print:py-0.5 print:text-neutral-700">
      {children}
    </li>
  );
}

const linkCls = "text-cyber-yellow underline-offset-2 hover:underline print:text-blue-700";

export default function ResumePage() {
  const r = resumeData;
  const contacts = [
    { label: r.email, href: `mailto:${r.email}` },
    { label: "kanakjr.in", href: r.website },
    { label: "LinkedIn", href: r.linkedin },
    { label: "GitHub", href: r.github },
    { label: "Medium", href: r.medium },
  ];

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-24 md:pt-28 print:bg-white print:p-0 print:text-black">
      <div className="mx-auto max-w-[1000px] 2xl:max-w-[1100px]">
        {/* Toolbar (screen only) */}
        <div className="mb-4 flex items-center justify-between print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm text-neutral-500 transition-colors hover:text-cyber-yellow"
          >
            ← Home
          </Link>
          <PrintButton />
        </div>

        <article className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl print:rounded-none print:border-none print:bg-white print:shadow-none">
          {/* ========== HEADER ========== */}
          <header className="relative border-b border-white/10 px-6 py-8 md:px-10 md:py-10 print:border-neutral-300 print:px-0 print:py-4">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyber-yellow/10 blur-3xl print:hidden" />
            <h1 className="relative font-mono text-3xl font-bold text-white md:text-5xl print:text-3xl print:text-black">
              {r.name.replace(/, MS$/, "")}
              <span className="ml-3 align-middle font-mono text-base font-normal text-neutral-500 md:text-lg print:text-neutral-500">
                MS
              </span>
            </h1>
            <p className="relative mt-2 text-base text-cyber-yellow md:text-lg print:text-neutral-800">
              AI Tech Lead · GenAI, agents &amp; cybersecurity
            </p>
            <ul className="relative mt-5 flex flex-wrap gap-2 print:mt-2 print:gap-x-3 print:gap-y-0">
              <li className="hidden print:inline">
                <span className="text-xs text-neutral-700">{r.phone}</span>
              </li>
              {contacts.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs text-neutral-200 transition-colors hover:border-cyber-yellow/60 hover:text-cyber-yellow print:border-none print:bg-transparent print:p-0 print:text-neutral-700"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="relative mt-6 max-w-3xl text-sm leading-relaxed text-neutral-300 md:text-base print:mt-3 print:text-sm print:text-neutral-700">
              {r.summary}
            </p>
          </header>

          {/* ========== BODY ========== */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] print:grid-cols-[1fr_230px]">
            {/* ---------- MAIN: experience + projects ---------- */}
            <div className="space-y-10 px-6 py-8 md:px-10 print:space-y-4 print:px-0 print:py-3 print:pr-5">
              <section>
                <SectionHeading>Experience</SectionHeading>
                <ol className="relative space-y-8 border-l border-white/10 pl-6 print:space-y-3 print:border-none print:pl-0">
                  {r.experience.map((exp) => (
                    <li key={exp.company} className="relative">
                      <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyber-yellow ring-4 ring-neutral-950 print:hidden" />
                      <p className="font-mono text-base font-bold text-white md:text-lg print:text-base print:text-black">
                        {exp.company}
                      </p>
                      {exp.roles.map((role) => (
                        <div key={role.title + role.period} className="mt-3 print:mt-1.5">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <p className="font-semibold text-cyber-yellow print:text-neutral-900">{role.title}</p>
                            <p className="font-mono text-xs text-neutral-500 print:text-neutral-600">
                              {role.period} · {role.location}
                            </p>
                          </div>
                          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-neutral-300 marker:text-neutral-600 print:mt-1 print:space-y-0.5 print:text-[12px] print:leading-snug print:text-neutral-700">
                            {role.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </li>
                  ))}
                </ol>
              </section>

              <section className="print:break-inside-avoid">
                <SectionHeading>Projects</SectionHeading>
                <div className="space-y-5 print:space-y-2">
                  {r.projects.map((proj) => (
                    <div key={proj.title}>
                      <p className="font-semibold text-white print:text-black">{proj.title}</p>
                      {proj.description && (
                        <p className="mt-1 text-sm leading-relaxed text-neutral-300 print:text-[12px] print:text-neutral-700">
                          {proj.description}
                          {proj.demoVideo && (
                            <>
                              {" "}
                              <a href={proj.demoVideo} target="_blank" rel="noopener noreferrer" className={linkCls}>
                                Demo
                              </a>
                            </>
                          )}
                          {proj.github && (
                            <>
                              {" · "}
                              <a href={proj.github} target="_blank" rel="noopener noreferrer" className={linkCls}>
                                GitHub
                              </a>
                            </>
                          )}
                        </p>
                      )}
                      {"items" in proj &&
                        proj.items &&
                        proj.items.map((item) => (
                          <p key={item.name} className="mt-1 text-sm leading-relaxed text-neutral-300 print:text-[12px] print:text-neutral-700">
                            <span className="font-medium text-white print:text-black">{item.name}:</span> {item.description}
                            {item.github && (
                              <>
                                {" "}
                                <a href={item.github} target="_blank" rel="noopener noreferrer" className={linkCls}>
                                  GitHub
                                </a>
                              </>
                            )}
                          </p>
                        ))}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ---------- SIDEBAR ---------- */}
            <aside className="space-y-8 border-t border-white/10 bg-white/[0.02] px-6 py-8 text-sm md:border-l md:border-t-0 print:space-y-3 print:border-none print:bg-transparent print:px-0 print:py-3 print:text-[12px]">
              <section>
                <SectionHeading>Education</SectionHeading>
                <div className="space-y-4 print:space-y-2">
                  {r.education.map((edu) => (
                    <div key={edu.school}>
                      <p className="font-semibold text-white print:text-black">{edu.school}</p>
                      <p className="text-neutral-300 print:text-neutral-700">{edu.degree}</p>
                      <p className="mt-0.5 font-mono text-xs text-neutral-500">
                        {edu.period} · GPA {edu.gpa}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <SectionHeading>Skills</SectionHeading>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">Programming</p>
                <ul className="mb-4 flex flex-wrap gap-1.5">
                  {r.skills.programming.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </ul>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">Tech stack</p>
                <ul className="flex flex-wrap gap-1.5">
                  {r.skills.techStack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </ul>
              </section>

              <section>
                <SectionHeading>Patents</SectionHeading>
                <ul className="space-y-3 print:space-y-1.5">
                  {r.patents.map((p) => (
                    <li key={p.id} className="text-neutral-300 print:text-neutral-700">
                      <span className="block font-mono text-xs text-cyber-yellow print:text-black">{p.id}</span>
                      {p.title}{" "}
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className={linkCls}>
                        PDF
                      </a>
                      {"explanation" in p && p.explanation && (
                        <>
                          {" · "}
                          <a href={p.explanation} className={linkCls}>
                            Explainer
                          </a>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <SectionHeading>Certificates</SectionHeading>
                <ul className="space-y-1.5 text-neutral-300 print:space-y-0.5 print:text-neutral-700">
                  {r.certificates.map((c) => (
                    <li key={c} className="flex gap-2">
                      <span className="text-cyber-yellow print:text-neutral-500">▸</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <SectionHeading>Awards</SectionHeading>
                <ul className="space-y-1.5 text-neutral-300 print:space-y-0.5 print:text-neutral-700">
                  {r.awards.map((a) => (
                    <li key={a} className="flex gap-2">
                      <span className="text-cyber-yellow print:text-neutral-500">▸</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <SectionHeading>Speaking &amp; volunteering</SectionHeading>
                <ul className="space-y-3 print:space-y-1">
                  {r.volunteerExperience.map((v) => (
                    <li key={v.title}>
                      <span className="font-medium text-white print:text-black">{v.title}</span>
                      {v.description && (
                        <span className="mt-0.5 block text-xs text-neutral-400 print:text-neutral-600">{v.description}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}
