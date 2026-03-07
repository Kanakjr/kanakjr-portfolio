/**
 * Standalone blog summary generator.
 *
 * Reads all blog MDX files, sends each to Gemini for a concise TL;DR,
 * and writes the results to data/blog-summaries.json.
 *
 * Includes per-request delay and retry logic to stay within API rate limits.
 *
 * Run: npm run summaries
 * Requires GOOGLE_API_KEY in .env.local
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

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
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local doesn't exist
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  baseDelay: number = 15_000
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      if (attempt === retries) throw err;
      const delay = baseDelay * Math.pow(2, attempt);
      const status = (err as { status?: number }).status;
      console.log(
        `    Attempt ${attempt + 1} failed (${status || "unknown"}), retrying in ${(delay / 1000).toFixed(0)}s...`
      );
      await sleep(delay);
    }
  }
  throw new Error("unreachable");
}

async function main() {
  loadEnvLocal();

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Error: GOOGLE_API_KEY not found in .env.local");
    process.exit(1);
  }

  const blogDir = join(process.cwd(), "blog", "content");
  if (!existsSync(blogDir)) {
    console.error("Error: blog/content directory not found");
    process.exit(1);
  }

  const files = readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
  console.log(`Found ${files.length} blog posts\n`);

  const outDir = join(process.cwd(), "data");
  mkdirSync(outDir, { recursive: true });

  // Load existing summaries to skip already-generated ones
  const summariesPath = join(outDir, "blog-summaries.json");
  let summaries: Record<string, string> = {};
  if (existsSync(summariesPath)) {
    try {
      summaries = JSON.parse(readFileSync(summariesPath, "utf-8"));
    } catch {
      summaries = {};
    }
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  console.log(`Using model: ${model}\n`);

  const llm = new ChatGoogleGenerativeAI({
    modelName: model,
    apiKey,
    temperature: 0.3,
    maxOutputTokens: 2048,
  });

  const DELAY_BETWEEN_REQUESTS_MS = 12_000;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const slug = file.replace(/\.mdx$/, "");

    if (summaries[slug] && summaries[slug].length > 0) {
      console.log(`[${i + 1}/${files.length}] ${slug} -- already exists, skipping`);
      continue;
    }

    const raw = readFileSync(join(blogDir, file), "utf-8");
    const { data: frontmatter, content } = matter(raw);

    const cleanContent = content
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/<[^>]+\/?>[\s\S]*?(?:<\/[^>]+>)?/g, "")
      .replace(/```[\s\S]*?```/g, "[code example]")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const truncated =
      cleanContent.length > 2000 ? cleanContent.slice(0, 2000) + "..." : cleanContent;

    const prompt = [
      `Blog Post: "${frontmatter.title}" (${frontmatter.date})`,
      `Tags: ${(frontmatter.tags || []).join(", ")}`,
      frontmatter.description || "",
      "",
      truncated,
    ].join("\n");

    console.log(`[${i + 1}/${files.length}] ${slug}...`);

    try {
      const response = await withRetry(() =>
        llm.invoke([
          {
            role: "system",
            content:
              "You are a concise technical writer. Generate a 2-3 sentence TL;DR summary of the following blog post. Be specific about what the post covers and what the reader will learn. Do not use emojis.",
          },
          { role: "user", content: prompt },
        ])
      );

      const text =
        typeof response.content === "string"
          ? response.content
          : JSON.stringify(response.content);

      summaries[slug] = text.trim();
      console.log(`  -> ${text.trim().slice(0, 100)}...`);

      // Write after each successful generation so progress isn't lost
      writeFileSync(summariesPath, JSON.stringify(summaries, null, 2));
    } catch (err) {
      console.error(`  FAILED for ${slug}:`, err);
      summaries[slug] = "";
    }

    if (i < files.length - 1) {
      console.log(`  Waiting ${DELAY_BETWEEN_REQUESTS_MS / 1000}s before next request...`);
      await sleep(DELAY_BETWEEN_REQUESTS_MS);
    }
  }

  writeFileSync(summariesPath, JSON.stringify(summaries, null, 2));

  const generated = Object.values(summaries).filter((s) => s.length > 0).length;
  console.log(
    `\nDone! ${generated}/${files.length} summaries written to ${summariesPath}`
  );
}

main().catch((err) => {
  console.error("Summary generation failed:", err);
  process.exit(1);
});
