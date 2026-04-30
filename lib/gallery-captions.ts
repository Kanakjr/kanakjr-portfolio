import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { instagramPosts } from "./instagram";

const CAPTIONS_PATH = join(process.cwd(), "data", "gallery-captions.json");

let captionsCache: Record<string, string> | null = null;

function loadAiCaptions(): Record<string, string> {
  if (!existsSync(CAPTIONS_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CAPTIONS_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function loadInstagramCaptions(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const post of instagramPosts) {
    const caption = (post.caption ?? "").trim();
    if (caption) map[post.src] = caption;
  }
  return map;
}

export function getGalleryCaptions(): Record<string, string> {
  if (captionsCache) return captionsCache;
  // AI captions act as the base map; IG post text overrides for any /instagram/posts/* keys
  // because those are the user's own words and should win over generated descriptions.
  captionsCache = { ...loadAiCaptions(), ...loadInstagramCaptions() };
  return captionsCache;
}
