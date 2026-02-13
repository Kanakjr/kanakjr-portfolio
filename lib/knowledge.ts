/**
 * Runtime knowledge retrieval for the Jarvis chatbot.
 *
 * Loads pre-computed embeddings from data/knowledge-embeddings.json (generated
 * at build time by scripts/generate-embeddings.ts) and performs cosine
 * similarity search to find the most relevant knowledge chunks for a query.
 *
 * Only the user's query is embedded at runtime (1 API call per chat message).
 * All knowledge chunk embeddings are pre-computed and loaded from disk.
 */

import { readFileSync } from "fs";
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
// Cosine similarity (pure math, no dependencies)
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
// Public API
// ---------------------------------------------------------------------------

/**
 * Retrieve the most relevant knowledge chunks for a given query.
 *
 * 1. Embeds the query using Google text-embedding-004 (1 API call)
 * 2. Computes cosine similarity against all pre-computed chunk embeddings
 * 3. Returns the top-K chunk contents joined as a single context string
 *
 * Returns null if the knowledge store is unavailable.
 */
export async function retrieveContext(
  query: string,
  topK: number = 5
): Promise<string | null> {
  const knowledgeStore = getStore();
  if (!knowledgeStore) return null;

  const model = getEmbeddingsModel();
  const queryVector = await model.embedQuery(query);

  // Score every chunk
  const scored = knowledgeStore.chunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryVector, chunk.embedding),
  }));

  // Sort descending by similarity
  scored.sort((a, b) => b.score - a.score);
  const topChunks = scored.slice(0, topK);

  return topChunks.map((item) => item.chunk.content).join("\n\n---\n\n");
}
