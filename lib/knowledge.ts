/**
 * Runtime knowledge retrieval for the Jarvis chatbot and site-wide search.
 *
 * Loads pre-computed embeddings from data/knowledge-embeddings.json and
 * performs cosine similarity search. Only the user's query is embedded at
 * runtime (1 API call per search). All chunk embeddings are pre-computed.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface EmbeddedChunk {
  id: string;
  source: string;
  content: string;
  embedding: number[];
}

interface KnowledgeStore {
  model: string;
  dimensions: number;
  generatedAt: string;
  chunks: EmbeddedChunk[];
}

export interface SearchResult {
  id: string;
  source: string;
  title: string;
  snippet: string;
  url: string;
  score: number;
}

// ---------------------------------------------------------------------------
// Module-level cache (loaded once per server lifecycle)
// ---------------------------------------------------------------------------
let store: KnowledgeStore | null = null;
let storeLoaded = false;
let embeddingsModel: GoogleGenerativeAIEmbeddings | null = null;

function getStore(): KnowledgeStore | null {
  if (storeLoaded) return store;
  storeLoaded = true;

  try {
    const filePath = join(process.cwd(), "data", "knowledge-embeddings.json");
    store = JSON.parse(readFileSync(filePath, "utf-8"));
    console.log(
      `[knowledge] Loaded ${store!.chunks.length} chunks (${store!.dimensions}d, generated ${store!.generatedAt})`
    );
  } catch {
    console.warn(
      "[knowledge] Embeddings file not found. Run: npm run embeddings"
    );
    store = null;
  }

  return store;
}

function getEmbeddingsModel(): GoogleGenerativeAIEmbeddings {
  if (embeddingsModel) return embeddingsModel;
  embeddingsModel = new GoogleGenerativeAIEmbeddings({
    modelName: "gemini-embedding-001",
    apiKey: process.env.GOOGLE_API_KEY,
  });
  return embeddingsModel;
}

// ---------------------------------------------------------------------------
// Cosine similarity
// ---------------------------------------------------------------------------
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ---------------------------------------------------------------------------
// Chunk metadata extraction (title + URL derivation)
// ---------------------------------------------------------------------------
function chunkToMeta(chunk: EmbeddedChunk): { title: string; url: string } {
  const { id, content } = chunk;

  if (id.startsWith("blog-")) {
    const slug = id.replace("blog-", "");
    const m = content.match(/Blog Post: "(.+?)"/);
    return { title: m?.[1] || slug, url: `/blog/${slug}` };
  }
  if (id.startsWith("project-")) {
    const m = content.match(/Project: (.+?) \[/);
    return { title: m?.[1] || id, url: "/#projects" };
  }
  if (id.startsWith("exp-")) {
    const m = content.match(/Work Experience: (.+)/);
    return { title: m?.[1] || id, url: "/resume" };
  }
  if (id.startsWith("videos-")) {
    const m = content.match(/YouTube Videos - (.+?) \(/);
    return { title: `${m?.[1] || "YouTube"} Videos`, url: "/reels" };
  }
  if (id.startsWith("patent-")) {
    const m = content.match(/"(.+?)"/);
    return { title: m?.[1] || id, url: "/" };
  }

  const known: Record<string, { title: string; url: string }> = {
    profile: { title: "Kanak Dahake Jr -- Profile", url: "/" },
    summary: { title: "Professional Summary", url: "/resume" },
    education: { title: "Education", url: "/resume" },
    skills: { title: "Technical Skills", url: "/resume" },
    certifications: { title: "Certifications", url: "/resume" },
    awards: { title: "Awards & Recognition", url: "/" },
    volunteer: { title: "Speaking & Volunteer Work", url: "/resume" },
    navigation: { title: "Site Navigation", url: "/" },
    gallery: { title: "Photo Gallery", url: "/stills" },
  };
  return known[id] || { title: id, url: "/" };
}

// ---------------------------------------------------------------------------
// Page-aware chunk boosting
// ---------------------------------------------------------------------------
function getPageRelevantIds(
  path: string,
  chunks: EmbeddedChunk[]
): Set<string> {
  const ids = new Set<string>();

  if (path.startsWith("/blog/")) {
    const slug = path.replace("/blog/", "");
    ids.add(`blog-${slug}`);
    // Also boost matching project chunks
    for (const c of chunks) {
      if (c.source === "projects" && c.content.toLowerCase().includes(slug.split("-")[0])) {
        ids.add(c.id);
      }
    }
  } else if (path === "/reels") {
    for (const c of chunks) if (c.source === "videos") ids.add(c.id);
  } else if (path === "/resume") {
    for (const c of chunks) {
      if (["experience", "education", "skills", "certifications", "summary"].includes(c.source)) {
        ids.add(c.id);
      }
    }
  } else if (path === "/stills" || path === "/frames") {
    ids.add("gallery");
  } else if (path === "/blog") {
    for (const c of chunks) if (c.source === "blog") ids.add(c.id);
  }

  return ids;
}

// ---------------------------------------------------------------------------
// Public API: Retrieve context for Jarvis (returns text)
// ---------------------------------------------------------------------------
export async function retrieveContext(
  query: string,
  topK: number = 5,
  currentPath?: string
): Promise<string | null> {
  const knowledgeStore = getStore();
  if (!knowledgeStore) return null;

  const model = getEmbeddingsModel();
  const queryVector = await model.embedQuery(query);

  const boostIds = currentPath
    ? getPageRelevantIds(currentPath, knowledgeStore.chunks)
    : new Set<string>();

  const scored = knowledgeStore.chunks.map((chunk) => ({
    chunk,
    score:
      cosineSimilarity(queryVector, chunk.embedding) +
      (boostIds.has(chunk.id) ? 0.1 : 0),
  }));

  scored.sort((a, b) => b.score - a.score);
  const topChunks = scored.slice(0, topK);

  return topChunks.map((item) => item.chunk.content).join("\n\n---\n\n");
}

// ---------------------------------------------------------------------------
// Public API: Search content (returns structured results for search UI)
// ---------------------------------------------------------------------------
export async function searchContent(
  query: string,
  topK: number = 8
): Promise<SearchResult[]> {
  const knowledgeStore = getStore();
  if (!knowledgeStore) return [];

  const model = getEmbeddingsModel();
  const queryVector = await model.embedQuery(query);

  const scored = knowledgeStore.chunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryVector, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK).map(({ chunk, score }) => {
    const meta = chunkToMeta(chunk);
    // Extract a clean snippet (first 200 chars of content, skip metadata lines)
    const lines = chunk.content.split("\n").filter((l) => l.trim());
    const snippet =
      lines.length > 1
        ? lines
            .slice(1)
            .join(" ")
            .replace(/\s+/g, " ")
            .slice(0, 200)
            .trim() + "..."
        : lines[0].slice(0, 200);

    return {
      id: chunk.id,
      source: chunk.source,
      title: meta.title,
      snippet,
      url: meta.url,
      score: Math.round(score * 100) / 100,
    };
  });
}

// ---------------------------------------------------------------------------
// Public API: Get content graph data (for /graph page)
// ---------------------------------------------------------------------------
export function getContentGraph(): {
  nodes: { id: string; label: string; source: string; url: string }[];
  edges: { source: string; target: string; weight: number }[];
} | null {
  const filePath = join(process.cwd(), "data", "content-graph.json");
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

// ---------------------------------------------------------------------------
// Public API: Get blog summaries (for blog listing TL;DR)
// ---------------------------------------------------------------------------
export function getBlogSummaries(): Record<string, string> {
  const filePath = join(process.cwd(), "data", "blog-summaries.json");
  if (!existsSync(filePath)) return {};
  return JSON.parse(readFileSync(filePath, "utf-8"));
}
