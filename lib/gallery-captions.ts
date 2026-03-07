import { readFileSync, existsSync } from "fs";
import { join } from "path";

const CAPTIONS_PATH = join(process.cwd(), "data", "gallery-captions.json");

let captionsCache: Record<string, string> | null = null;

export function getGalleryCaptions(): Record<string, string> {
  if (captionsCache) return captionsCache;
  if (!existsSync(CAPTIONS_PATH)) return {};
  try {
    captionsCache = JSON.parse(readFileSync(CAPTIONS_PATH, "utf-8"));
    return captionsCache!;
  } catch {
    return {};
  }
}
