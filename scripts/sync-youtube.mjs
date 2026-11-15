/**
 * Build-time YouTube sync.
 *
 * Reads the channel's public RSS feed (no API key, latest 15 uploads) and
 * merges it into data/youtube.json. Entries accumulate across runs, so videos
 * that fall out of the 15-item feed are kept. Non-fatal: on any network or
 * parse error the build continues with whatever JSON is already on disk.
 *
 * Run:
 *   node scripts/sync-youtube.mjs
 *   STRICT=1 node scripts/sync-youtube.mjs   # exit 1 on sync failure
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UCLAN_-PS2OrlHqbAHaxeU-A";
const OUT = resolve(process.cwd(), "data", "youtube.json");
const STRICT = process.env.STRICT === "1";

function decode(s = "") {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function pick(block, re) {
  const m = block.match(re);
  return m ? decode(m[1].trim()) : "";
}

async function main() {
  const existing = existsSync(OUT)
    ? JSON.parse(readFileSync(OUT, "utf-8"))
    : { channelId: CHANNEL_ID, fetchedAt: null, videos: [] };

  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, {
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`feed HTTP ${res.status}`);
  const xml = await res.text();

  const entries = xml.split("<entry>").slice(1).map((block) => {
    const link = block.match(/<link rel="alternate" href="([^"]+)"/)?.[1] ?? "";
    return {
      youtubeId: pick(block, /<yt:videoId>([^<]+)<\/yt:videoId>/),
      title: pick(block, /<title>([^<]*)<\/title>/),
      description: pick(block, /<media:description>([\s\S]*?)<\/media:description>/),
      published: pick(block, /<published>([^<]+)<\/published>/),
      isShort: link.includes("/shorts/"),
    };
  }).filter((v) => v.youtubeId);

  if (entries.length === 0) throw new Error("feed had no entries");

  const byId = new Map(existing.videos.map((v) => [v.youtubeId, v]));
  for (const v of entries) byId.set(v.youtubeId, { ...byId.get(v.youtubeId), ...v });
  const videos = [...byId.values()].sort((a, b) => b.published.localeCompare(a.published));

  writeFileSync(OUT, JSON.stringify({ channelId: CHANNEL_ID, fetchedAt: new Date().toISOString(), videos }, null, 2) + "\n");
  console.log(`[sync-youtube] ${entries.length} in feed, ${videos.length} total -> data/youtube.json`);
}

main().catch((err) => {
  console.warn(`[sync-youtube] skipped: ${err.message}`);
  if (!existsSync(OUT)) {
    writeFileSync(OUT, JSON.stringify({ channelId: CHANNEL_ID, fetchedAt: null, videos: [] }, null, 2) + "\n");
  }
  if (STRICT) process.exit(1);
});
