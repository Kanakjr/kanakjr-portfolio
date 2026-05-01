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
  demoVideos?: { label: string; url: string }[];
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
    if (project.demoVideos) {
      for (const vid of project.demoVideos) {
        links.push(`Demo (${vid.label}): ${vid.url}`);
      }
    }
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

  const outDir = join(process.cwd(), "data");
  mkdirSync(outDir, { recursive: true });

  // ─── Write embeddings ────────────────────────────────────────────────
  const output = {
    model: "gemini-embedding-001",
    dimensions: vectors[0].length,
    generatedAt: new Date().toISOString(),
    chunks: chunks.map((chunk, i) => ({
      id: chunk.id,
      source: chunk.source,
      content: chunk.content,
      embedding: vectors[i],
    })),
  };

  const outPath = join(outDir, "knowledge-embeddings.json");
  writeFileSync(outPath, JSON.stringify(output));

  const fileSizeKB = (readFileSync(outPath).length / 1024).toFixed(1);
  console.log(`Embeddings written to ${outPath}`);
  console.log(
    `  ${chunks.length} chunks, ${vectors[0].length} dimensions each`
  );
  console.log(`  File size: ${fileSizeKB} KB`);

  // ─── Compute content graph ───────────────────────────────────────────
  console.log("\nComputing content graph...\n");

  // Build node metadata
  const graphNodes = chunks
    .filter((c) => !["navigation", "gallery"].includes(c.id))
    .map((c) => {
      let label = c.id;
      let url = "/";

      if (c.id.startsWith("blog-")) {
        const m = c.content.match(/Blog Post: "(.+?)"/);
        label = m?.[1] || c.id;
        url = `/blog/${c.id.replace("blog-", "")}`;
      } else if (c.id.startsWith("project-")) {
        const m = c.content.match(/Project: (.+?) \[/);
        label = m?.[1] || c.id;
        url = "/#projects";
      } else if (c.id.startsWith("exp-")) {
        const m = c.content.match(/Work Experience: (.+?) at (.+)/);
        label = m ? `${m[1].split(" - ")[0]} @ ${m[2].split("\n")[0]}` : c.id;
        url = "/resume";
      } else if (c.id.startsWith("videos-")) {
        const m = c.content.match(/YouTube Videos - (.+?) \(/);
        label = `${m?.[1] || "Videos"} Videos`;
        url = "/reels";
      } else if (c.id.startsWith("patent-")) {
        const m = c.content.match(/"(.+?)"/);
        label = m?.[1]?.slice(0, 50) || c.id;
        url = "/";
      } else {
        const knownLabels: Record<string, string> = {
          profile: "Kanak Dahake Jr",
          summary: "Professional Summary",
          education: "Education",
          skills: "Technical Skills",
          certifications: "Certifications",
          awards: "Awards",
          volunteer: "Speaking & Volunteer",
        };
        label = knownLabels[c.id] || c.id;
        if (["summary", "education", "skills", "certifications", "volunteer"].includes(c.id)) url = "/resume";
      }

      return { id: c.id, label, source: c.source, url };
    });

  // Compute pairwise similarities and keep strong edges
  const SIMILARITY_THRESHOLD = 0.70;
  const graphEdges: { source: string; target: string; weight: number }[] = [];
  const nodeIds = new Set(graphNodes.map((n) => n.id));

  for (let i = 0; i < chunks.length; i++) {
    if (!nodeIds.has(chunks[i].id)) continue;
    for (let j = i + 1; j < chunks.length; j++) {
      if (!nodeIds.has(chunks[j].id)) continue;
      const sim = cosineSim(vectors[i], vectors[j]);
      if (sim >= SIMILARITY_THRESHOLD) {
        graphEdges.push({
          source: chunks[i].id,
          target: chunks[j].id,
          weight: Math.round(sim * 100) / 100,
        });
      }
    }
  }

  // Force-directed layout (Fruchterman-Reingold)
  const W = 1200, H = 800;
  const positions = forceLayout(graphNodes, graphEdges, W, H, 400);

  const graphOutput = {
    width: W,
    height: H,
    nodes: graphNodes.map((n, i) => ({
      ...n,
      x: Math.round(positions[i].x),
      y: Math.round(positions[i].y),
    })),
    edges: graphEdges,
  };

  const graphPath = join(outDir, "content-graph.json");
  writeFileSync(graphPath, JSON.stringify(graphOutput, null, 2));
  console.log(
    `Content graph written to ${graphPath} (${graphNodes.length} nodes, ${graphEdges.length} edges)`
  );

}

// ---------------------------------------------------------------------------
// Cosine similarity (for graph computation)
// ---------------------------------------------------------------------------
function cosineSim(a: number[], b: number[]): number {
  let dot = 0, nA = 0, nB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    nA += a[i] * a[i];
    nB += b[i] * b[i];
  }
  return dot / (Math.sqrt(nA) * Math.sqrt(nB));
}

// ---------------------------------------------------------------------------
// Simple Fruchterman-Reingold force-directed layout
// ---------------------------------------------------------------------------
function forceLayout(
  nodes: { id: string }[],
  edges: { source: string; target: string }[],
  width: number,
  height: number,
  iterations: number
): { x: number; y: number }[] {
  const n = nodes.length;
  const area = width * height;
  const k = Math.sqrt(area / n) * 0.8;
  const nodeIndex = new Map(nodes.map((node, i) => [node.id, i]));

  // Seed positions in a circle to start
  const pos = nodes.map((_, i) => ({
    x: width / 2 + (width * 0.35) * Math.cos((2 * Math.PI * i) / n),
    y: height / 2 + (height * 0.35) * Math.sin((2 * Math.PI * i) / n),
  }));

  for (let iter = 0; iter < iterations; iter++) {
    const temp = Math.max(0.5, (1 - iter / iterations) * 40);
    const disp = nodes.map(() => ({ x: 0, y: 0 }));

    // Repulsive forces between all pairs
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pos[i].x - pos[j].x;
        const dy = pos[i].y - pos[j].y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 0.1);
        const force = (k * k) / dist;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        disp[i].x += fx;
        disp[i].y += fy;
        disp[j].x -= fx;
        disp[j].y -= fy;
      }
    }

    // Attractive forces along edges
    for (const edge of edges) {
      const si = nodeIndex.get(edge.source);
      const ti = nodeIndex.get(edge.target);
      if (si === undefined || ti === undefined) continue;
      const dx = pos[si].x - pos[ti].x;
      const dy = pos[si].y - pos[ti].y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 0.1);
      const force = (dist * dist) / k;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      disp[si].x -= fx;
      disp[si].y -= fy;
      disp[ti].x += fx;
      disp[ti].y += fy;
    }

    // Center gravity
    for (let i = 0; i < n; i++) {
      disp[i].x += (width / 2 - pos[i].x) * 0.01;
      disp[i].y += (height / 2 - pos[i].y) * 0.01;
    }

    // Apply displacements capped by temperature
    for (let i = 0; i < n; i++) {
      const dx = disp[i].x;
      const dy = disp[i].y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 0.1);
      const cap = Math.min(dist, temp);
      pos[i].x += (dx / dist) * cap;
      pos[i].y += (dy / dist) * cap;
      pos[i].x = Math.max(60, Math.min(width - 60, pos[i].x));
      pos[i].y = Math.max(60, Math.min(height - 60, pos[i].y));
    }
  }

  return pos;
}

main().catch((err) => {
  console.error("Embedding generation failed:", err);
  process.exit(1);
});
