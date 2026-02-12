import { Metadata } from "next";
import Link from "next/link";
import { resumeData } from "@/lib/resume";
import PrintButton from "./print-button";

export const metadata: Metadata = {
  title: "Resume | Kanak Dahake",
  description:
    "Resume of Kanak Dahake - Experienced Engineer specializing in GenAI, CyberSecurity, NLP, and multimodal RAG pipelines.",
};

/* ------------------------------------------------------------------ */
/*  Tiny helper: section heading used across the page                  */
/* ------------------------------------------------------------------ */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-white border-b border-white/20 pb-1 mb-3 tracking-wide uppercase">
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
export default function ResumePage() {
  const r = resumeData;

  return (
    <main className="min-h-screen bg-background py-12 px-4 print:bg-white print:text-black">
      {/* Container */}
      <div className="mx-auto max-w-[900px] bg-neutral-950 border border-white/10 shadow-2xl print:shadow-none print:border-none print:bg-white">
        {/* ========== HEADER ========== */}
        <header className="bg-[#6b7c3f] px-8 py-6 text-center print:bg-[#6b7c3f]">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            {r.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-white/90 font-mono">
            <span>{r.phone}</span>
            <span className="hidden sm:inline">|</span>
            <a href={`mailto:${r.email}`} className="hover:underline">
              {r.email}
            </a>
            <span className="hidden sm:inline">|</span>
            <a
              href={r.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Website
            </a>
            <span className="hidden sm:inline">|</span>
            <a
              href={r.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
            <span className="hidden sm:inline">|</span>
            <a
              href={r.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
            <span className="hidden sm:inline">|</span>
            <a
              href={r.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Medium
            </a>
          </div>
        </header>

        {/* ========== SUMMARY ========== */}
        <div className="px-8 py-4 border-b border-white/10">
          <p className="text-sm text-neutral-300 leading-relaxed print:text-neutral-700">
            <span className="font-semibold text-white print:text-black">
              Summary:
            </span>{" "}
            {r.summary}
          </p>
        </div>

        {/* ========== TWO-COLUMN BODY ========== */}
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] print:grid-cols-[320px_1fr]">
          {/* ---------- LEFT COLUMN ---------- */}
          <aside className="px-6 py-6 border-r border-white/10 space-y-6 text-sm">
            {/* Education */}
            <section>
              <SectionHeading>Education</SectionHeading>
              <div className="space-y-4">
                {r.education.map((edu) => (
                  <div key={edu.school}>
                    <p className="font-bold text-white print:text-black">
                      {edu.school}
                    </p>
                    <p className="text-neutral-300 print:text-neutral-600">
                      {edu.degree}
                    </p>
                    <p className="text-neutral-400 print:text-neutral-500 text-xs">
                      {edu.period} | {edu.location}
                    </p>
                    <p className="text-neutral-400 print:text-neutral-500 text-xs">
                      GPA: {edu.gpa}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <SectionHeading>Skills</SectionHeading>

              <p className="font-semibold text-white print:text-black mb-1">
                Programming
              </p>
              <ul className="list-disc list-inside text-neutral-300 print:text-neutral-600 mb-3">
                {r.skills.programming.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>

              <p className="font-semibold text-white print:text-black mb-1">
                Tech Stack
              </p>
              <ul className="list-disc list-inside text-neutral-300 print:text-neutral-600">
                {r.skills.techStack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>

            {/* Patents */}
            <section>
              <SectionHeading>Patents</SectionHeading>
              <ul className="space-y-2 text-neutral-300 print:text-neutral-600">
                {r.patents.map((p) => (
                  <li key={p.id}>
                    <span className="font-semibold text-white print:text-black">
                      {p.id}:
                    </span>{" "}
                    {p.title} (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-yellow hover:underline print:text-blue-600"
                    >
                      Link
                    </a>
                    {"explanation" in p && p.explanation && (
                      <>
                        ,{" "}
                        <a
                          href={p.explanation}
                          className="text-cyber-yellow hover:underline print:text-blue-600"
                        >
                          Explanation
                        </a>
                      </>
                    )}
                    ).
                  </li>
                ))}
              </ul>
            </section>

            {/* Certificates */}
            <section>
              <SectionHeading>Certificates</SectionHeading>
              <ul className="list-disc list-inside text-neutral-300 print:text-neutral-600 space-y-0.5">
                {r.certificates.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>

            {/* Volunteer Experience */}
            <section>
              <SectionHeading>Volunteer Experience</SectionHeading>
              <ul className="space-y-2 text-neutral-300 print:text-neutral-600">
                {r.volunteerExperience.map((v) => (
                  <li key={v.title}>
                    <span className="font-semibold text-white print:text-black">
                      {v.title}
                    </span>
                    {v.description && (
                      <span className="block text-xs text-neutral-400 print:text-neutral-500 mt-0.5">
                        {v.description}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* Awards */}
            <section>
              <SectionHeading>Awards</SectionHeading>
              <ul className="list-disc list-inside text-neutral-300 print:text-neutral-600 space-y-0.5">
                {r.awards.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </section>
          </aside>

          {/* ---------- RIGHT COLUMN ---------- */}
          <div className="px-6 py-6 space-y-6 text-sm">
            {/* Experience */}
            <section>
              <SectionHeading>Experience</SectionHeading>
              <div className="space-y-5">
                {r.experience.map((exp) => (
                  <div key={exp.company}>
                    <p className="font-bold text-cyber-yellow print:text-[#6b7c3f] text-base">
                      {exp.company}
                    </p>
                    {exp.roles.map((role) => (
                      <div key={role.title + role.period} className="mt-2">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                          <p className="font-semibold text-white print:text-black">
                            {role.title}
                          </p>
                          <p className="text-xs text-neutral-400 print:text-neutral-500 whitespace-nowrap">
                            {role.period} | {role.location}
                          </p>
                        </div>
                        <ul className="mt-1 list-disc list-outside ml-4 text-neutral-300 print:text-neutral-600 space-y-1">
                          {role.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <SectionHeading>Projects</SectionHeading>
              <div className="space-y-4">
                {r.projects.map((proj) => (
                  <div key={proj.title}>
                    <p className="font-bold text-cyber-yellow print:text-[#6b7c3f]">
                      {proj.title}
                    </p>
                    {proj.description && (
                      <p className="text-neutral-300 print:text-neutral-600 mt-0.5">
                        {proj.description}
                        {proj.demoVideo && (
                          <>
                            {" "}
                            <a
                              href={proj.demoVideo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyber-yellow hover:underline print:text-blue-600"
                            >
                              Demo Video
                            </a>
                          </>
                        )}
                        {proj.github && (
                          <>
                            {" | "}
                            <a
                              href={proj.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyber-yellow hover:underline print:text-blue-600"
                            >
                              GitHub Link
                            </a>
                          </>
                        )}
                      </p>
                    )}
                    {"items" in proj &&
                      proj.items &&
                      proj.items.map((item) => (
                        <div key={item.name} className="mt-1 ml-4">
                          <p className="text-neutral-300 print:text-neutral-600">
                            <span className="font-semibold text-white print:text-black">
                              {item.name}:
                            </span>{" "}
                            {item.description}
                            {item.github && (
                              <>
                                {" "}
                                <a
                                  href={item.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyber-yellow hover:underline print:text-blue-600"
                                >
                                  GitHub Link
                                </a>
                              </>
                            )}
                          </p>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ========== FOOTER (screen only) ========== */}
        <div className="px-8 py-4 border-t border-white/10 flex items-center justify-between print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-neutral-500 hover:text-cyber-yellow transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Back to Home
          </Link>
          <PrintButton />
        </div>
      </div>
    </main>
  );
}
