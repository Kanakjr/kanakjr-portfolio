import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { resumeData } from "@/lib/resume";

export async function POST(req: Request) {
  try {
    const { jobRole } = await req.json();

    if (!jobRole || typeof jobRole !== "string") {
      return Response.json({ error: "Job role is required" }, { status: 400 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return Response.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const model = new ChatGoogleGenerativeAI({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.4,
      maxOutputTokens: 4096,
    });

    const resumeText = buildResumeText();

    const response = await model.invoke([
      {
        role: "system",
        content: `You are a professional resume advisor. Given a full resume and a target job role, identify which parts are most relevant and produce a structured JSON response that highlights the most applicable experience, skills, and projects.

Return ONLY valid JSON with this shape:
{
  "tailoredSummary": "A 2-3 sentence summary rewritten to target the role",
  "relevantSkills": ["skill1", "skill2", ...],
  "highlightedExperience": ["company-role identifier1", ...],
  "highlightedProjects": ["project title1", ...],
  "tips": "A brief tip on how this resume could be improved for the target role"
}

For highlightedExperience, use the format "CompanyName - RoleTitle" exactly as they appear in the resume.
For highlightedProjects, use exact project titles from the resume.
For relevantSkills, pick from the skills listed in the resume.
Do not invent information not in the resume.`,
      },
      {
        role: "user",
        content: `Target job role: ${jobRole}\n\n=== RESUME ===\n${resumeText}`,
      },
    ]);

    const text =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const tailored = JSON.parse(jsonMatch[0]);
    return Response.json(tailored);
  } catch (error) {
    console.error("Resume tailor error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

function buildResumeText(): string {
  const r = resumeData;
  const lines: string[] = [];

  lines.push(`Name: ${r.name}`);
  lines.push(`Summary: ${r.summary}`);
  lines.push("");

  lines.push("SKILLS:");
  lines.push(`Programming: ${r.skills.programming.join(", ")}`);
  lines.push(`Tech Stack: ${r.skills.techStack.join(", ")}`);
  lines.push("");

  lines.push("EXPERIENCE:");
  for (const exp of r.experience) {
    for (const role of exp.roles) {
      lines.push(`${exp.company} - ${role.title} (${role.period})`);
      for (const b of role.bullets) lines.push(`  - ${b}`);
    }
  }
  lines.push("");

  lines.push("EDUCATION:");
  for (const edu of r.education) {
    lines.push(`${edu.degree} - ${edu.school} (${edu.period}, GPA: ${edu.gpa})`);
  }
  lines.push("");

  lines.push("PATENTS:");
  for (const p of r.patents) {
    lines.push(`${p.id}: ${p.title}`);
  }
  lines.push("");

  lines.push("PROJECTS:");
  for (const proj of r.projects) {
    lines.push(`${proj.title}: ${proj.description || ""}`);
  }
  lines.push("");

  lines.push(`CERTIFICATES: ${r.certificates.join(", ")}`);

  return lines.join("\n");
}
