/**
 * Build-time embedding generator for the Jarvis chatbot knowledge base.
 *
 * Reads all knowledge sources (portfolio data, resume, videos, blog posts),
 * chunks them into semantic pieces, embeds each chunk using Google's
 * text-embedding-004 model via LangChain, and writes the result to
 * data/knowledge-embeddings.json.
 *
 * Run: npm run embeddings
 * Requires GOOGLE_API_KEY in .env.local
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  existsSync,
} from "fs";
import { join } from "path";
import matter from "gray-matter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { portfolioData } from "../lib/data";
import { resumeData } from "../lib/resume";
import { videosData, type Video } from "../lib/videos";

// ---------------------------------------------------------------------------
// Load .env.local (Next.js does this automatically at runtime, but standalone
// scripts need to handle it manually -- avoids adding dotenv as a dependency)
// ---------------------------------------------------------------------------
function loadEnvLocal() {
  try {
    const envPath = join(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local doesn't exist -- rely on environment variables
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface KnowledgeChunk {
  id: string;
  source: string;
  content: string;
}

// Loose project type covering all optional fields across portfolio entries
interface ProjectEntry {
  title: string;
  category: string;
  description: string;
  tech: string[];
  demoVideo?: string;
  blog?: string;
  github?: string;
  githubLinks?: { label: string; url: string }[];
}

// ---------------------------------------------------------------------------
// Chunk builder -- converts all knowledge sources into semantic text chunks
// ---------------------------------------------------------------------------
function buildChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  // --- Profile & Contact ---
  const hero = portfolioData.hero;
  chunks.push({
    id: "profile",
    source: "profile",
    content: [
      `Kanak Dahake Jr is a ${hero.role} based in ${hero.location}.`,
      hero.bio,
      `Contact: ${hero.email}`,
      `Website: https://kanakjr.in`,
      `GitHub: ${hero.links.github}`,
      `LinkedIn: ${hero.links.linkedin}`,
      `Medium: ${hero.links.medium}`,
      `YouTube: https://youtube.com/@kanakdahake`,
    ].join("\n"),
  });

  // --- Professional Summary ---
  chunks.push({
    id: "summary",
    source: "summary",
    content: `Professional Summary: ${resumeData.summary}`,
  });

  // --- Experience (one chunk per role) ---
  for (const company of resumeData.experience) {
    for (const role of company.roles) {
      const slug = `${company.company}-${role.title}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      chunks.push({
        id: `exp-${slug}`,
        source: "experience",
        content: [
          `Work Experience: ${role.title} at ${company.company}`,
          `Period: ${role.period} | Location: ${role.location}`,
          ...role.bullets.map((b) => `- ${b}`),
        ].join("\n"),
      });
    }
  }

  // --- Education ---
  chunks.push({
    id: "education",
    source: "education",
    content: [
      "Education:",
      ...resumeData.education.map(
        (e) =>
          `- ${e.degree} from ${e.school} (${e.period}, ${e.location}). GPA: ${e.gpa}`
      ),
    ].join("\n"),
  });

  // --- Patents ---
  for (const patent of portfolioData.patents) {
    const resumePatent = resumeData.patents.find((p) => p.id === patent.id);
    chunks.push({
      id: `patent-${patent.id}`,
      source: "patents",
      content: [
        `US Patent ${patent.id}: "${patent.title}" (${patent.date})`,
        patent.description,
        `Patent PDF: ${patent.link}`,
        resumePatent?.explanation
          ? `Blog post: ${resumePatent.explanation}`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  // --- Skills ---
  chunks.push({
    id: "skills",
    source: "skills",
    content: [
      "Technical Skills:",
      `Programming: ${resumeData.skills.programming.join(", ")}`,
      `Tech Stack: ${resumeData.skills.techStack.join(", ")}`,
    ].join("\n"),
  });

  // --- Projects (one chunk per project) ---
  const projects = portfolioData.projects as unknown as ProjectEntry[];
  for (const project of projects) {
    const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const links: string[] = [];
    if (project.demoVideo) links.push(`Demo: ${project.demoVideo}`);
    if (project.blog) links.push(`Blog: ${project.blog}`);
    if (project.github) links.push(`GitHub: ${project.github}`);
    if (project.githubLinks) {
      for (const gl of project.githubLinks) {
        links.push(`GitHub (${gl.label}): ${gl.url}`);
      }
    }
    chunks.push({
      id: `project-${slug}`,
      source: "projects",
      content: [
        `Project: ${project.title} [${project.category}]`,
        project.description,
        `Tech: ${project.tech.join(", ")}`,
        ...links,
      ].join("\n"),
    });
  }

  // --- Certifications ---
  chunks.push({
    id: "certifications",
    source: "certifications",
    content: `Certifications: ${resumeData.certificates.join(", ")}`,
  });

  // --- Awards ---
  chunks.push({
    id: "awards",
    source: "awards",
    content: [
      "Awards and Recognition:",
      ...resumeData.awards.map((a) => `- ${a}`),
      ...portfolioData.achievements
        .filter((a) => a.link)
        .map((a) => `- ${a.title} (${a.organization}): ${a.description}`),
    ].join("\n"),
  });

  // --- Volunteer & Speaking ---
  chunks.push({
    id: "volunteer",
    source: "volunteer",
    content: [
      "Volunteer and Speaking Experience:",
      ...resumeData.volunteerExperience.map(
        (v) => `- ${v.title}: ${v.description}`
      ),
    ].join("\n"),
  });

  // --- Blog Posts ---
  const blogDir = join(process.cwd(), "blog", "content");
  if (existsSync(blogDir)) {
    const files = readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      const slug = file.replace(/\.mdx$/, "");
      const raw = readFileSync(join(blogDir, file), "utf-8");
      const { data: frontmatter, content } = matter(raw);

      // Clean content: remove images, HTML, code blocks, excessive whitespace
      const cleanContent = content
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/<[^>]+\/?>[\s\S]*?(?:<\/[^>]+>)?/g, "")
        .replace(/```[\s\S]*?```/g, "[code example]")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      // Truncate to keep embeddings focused (first ~2000 chars)
      const maxLen = 2000;
      const truncated =
        cleanContent.length > maxLen
          ? cleanContent.slice(0, maxLen) + "..."
          : cleanContent;

      chunks.push({
        id: `blog-${slug}`,
        source: "blog",
        content: [
          `Blog Post: "${frontmatter.title}" (${frontmatter.date})`,
          `Tags: ${(frontmatter.tags || []).join(", ")}`,
          `URL: /blog/${slug}`,
          frontmatter.description,
          "",
          truncated,
        ].join("\n"),
      });
    }
  }

  // --- YouTube Videos (grouped by category) ---
  const videosByCategory = new Map<string, Video[]>();
  for (const video of videosData) {
    if (!videosByCategory.has(video.category)) {
      videosByCategory.set(video.category, []);
    }
    videosByCategory.get(video.category)!.push(video);
  }
  for (const [category, videos] of videosByCategory) {
    const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    chunks.push({
      id: `videos-${slug}`,
      source: "videos",
      content: [
        `YouTube Videos - ${category} (available at /reels):`,
        ...videos.map(
          (v) =>
            `- "${v.title}": ${v.description} [Tags: ${v.tags.join(", ")}] (https://youtube.com/watch?v=${v.youtubeId})`
        ),
      ].join("\n"),
    });
  }

  // --- Site Navigation ---
  chunks.push({
    id: "navigation",
    source: "navigation",
    content: [
      "Site Navigation for kanakjr.in:",
      "- Home: / (Hero section, Career timeline, Patents, Skills, Projects, Achievements, Portfolio)",
      "- Blog: /blog (Technical blog posts with tag filtering)",
      "- Reels: /reels (YouTube video gallery with category filter)",
      "- Stills: /stills (Photo gallery - Yamaha XSR, 3D prints, sketches)",
      "- Resume: /resume (Detailed CV with print/PDF option)",
    ].join("\n"),
  });

  // --- Gallery ---
  chunks.push({
    id: "gallery",
    source: "gallery",
    content: [
      "Photo Gallery (at /stills):",
      "- Yamaha XSR: Neo-retro motorcycle photos",
      "- 3D Prints: Bambu Lab printer creations -- functional parts and creative builds",
      "- Sketches: Digital illustrations drawn on iPad with Apple Pencil, anime-inspired characters",
    ].join("\n"),
  });

  return chunks;
}

// ---------------------------------------------------------------------------
// Main: build chunks, generate embeddings, write output
// ---------------------------------------------------------------------------
async function main() {
  loadEnvLocal();

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error(
      "Error: GOOGLE_API_KEY not found. Set it in .env.local or as an environment variable."
    );
    process.exit(1);
  }

  console.log("Building knowledge chunks...\n");
  const chunks = buildChunks();

  console.log(`Created ${chunks.length} chunks:\n`);
  for (const chunk of chunks) {
    console.log(
      `  [${chunk.source.padEnd(14)}] ${chunk.id} (${chunk.content.length} chars)`
    );
  }

  console.log("\nGenerating embeddings with Google gemini-embedding-001...\n");

  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "gemini-embedding-001",
    apiKey,
  });

  const texts = chunks.map((c) => c.content);
  const vectors = await embeddings.embedDocuments(texts);

  const output = {
    model: "text-embedding-004",
    dimensions: vectors[0].length,
    generatedAt: new Date().toISOString(),
    chunks: chunks.map((chunk, i) => ({
      id: chunk.id,
      source: chunk.source,
      content: chunk.content,
      embedding: vectors[i],
    })),
  };

  const outDir = join(process.cwd(), "data");
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, "knowledge-embeddings.json");
  writeFileSync(outPath, JSON.stringify(output));

  const fileSizeKB = (readFileSync(outPath).length / 1024).toFixed(1);
  console.log(`Embeddings written to ${outPath}`);
  console.log(
    `  ${chunks.length} chunks, ${vectors[0].length} dimensions each`
  );
  console.log(`  File size: ${fileSizeKB} KB`);
}

main().catch((err) => {
  console.error("Embedding generation failed:", err);
  process.exit(1);
});
