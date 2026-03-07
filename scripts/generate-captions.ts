/**
 * Build-time gallery caption generator.
 *
 * Reads all gallery images, sends each to Gemini Vision for a descriptive
 * caption, and writes the results to data/gallery-captions.json.
 *
 * Run: npm run captions
 * Requires GOOGLE_API_KEY in .env.local
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

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
  retries = 3,
  baseDelay = 15_000
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

// Gallery data inline (avoid import issues with TS path aliases in scripts)
interface GalleryImage {
  src: string;
  alt: string;
  section: string;
}

function getGalleryImages(): GalleryImage[] {
  const sections = [
    {
      id: "xsr",
      images: [
        "/portfolio/images/xsr/street-parked.jpg",
        "/portfolio/images/xsr/beach-ride.jpg",
        "/portfolio/images/xsr/office-parking.jpg",
        "/portfolio/images/xsr/ruins-backdrop.jpg",
        "/portfolio/images/xsr/coastal-sunset.jpg",
        "/portfolio/images/xsr/hilltop-stop.jpg",
        "/portfolio/images/xsr/park-dappled-light.jpg",
      ],
    },
    {
      id: "3d_prints",
      images: [
        "/portfolio/images/3d_prints/first-prints.jpg",
        "/portfolio/images/3d_prints/cup-holder.jpg",
        "/portfolio/images/3d_prints/first-batch.jpg",
        "/portfolio/images/3d_prints/ipad-arm-stand.jpg",
        "/portfolio/images/3d_prints/enclosure-parts.jpg",
        "/portfolio/images/3d_prints/gundam-figure.jpg",
        "/portfolio/images/3d_prints/t13-figure.jpg",
        "/portfolio/images/3d_prints/space-shuttle.jpg",
        "/portfolio/images/3d_prints/tanjiro-sword.jpg",
        "/portfolio/images/3d_prints/alpaca.jpg",
        "/portfolio/images/3d_prints/pegboard-wall.jpg",
        "/portfolio/images/3d_prints/ha-bambu-dashboard.jpg",
        "/portfolio/images/3d_prints/headphone-stand.jpg",
        "/portfolio/images/3d_prints/demogorgon.jpg",
        "/portfolio/images/3d_prints/sims-cat.jpg",
        "/portfolio/images/3d_prints/stormtrooper.jpg",
        "/portfolio/images/3d_prints/baby-chimp.jpg",
      ],
    },
    {
      id: "sketches",
      images: [
        "/portfolio/images/sketches/luffy.jpg",
        "/portfolio/images/sketches/portrait-wip.jpg",
        "/portfolio/images/sketches/sasuke.jpg",
        "/portfolio/images/sketches/zenitsu.jpg",
        "/portfolio/images/sketches/todoroki.jpg",
        "/portfolio/images/sketches/blonde-boy.jpg",
        "/portfolio/images/sketches/anime-girl-blue.jpg",
        "/portfolio/images/sketches/portrait-bold.jpg",
        "/portfolio/images/sketches/anime-boy-blue.jpg",
        "/portfolio/images/sketches/killua.jpg",
        "/portfolio/images/sketches/anime-girl-ponytail.jpg",
      ],
    },
  ];

  const images: GalleryImage[] = [];
  for (const section of sections) {
    for (const src of section.images) {
      images.push({ src, alt: "", section: section.id });
    }
  }
  return images;
}

async function main() {
  loadEnvLocal();

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Error: GOOGLE_API_KEY not found in .env.local");
    process.exit(1);
  }

  const images = getGalleryImages();
  console.log(`Found ${images.length} gallery images\n`);

  const outDir = join(process.cwd(), "data");
  mkdirSync(outDir, { recursive: true });

  const captionsPath = join(outDir, "gallery-captions.json");
  let captions: Record<string, string> = {};
  if (existsSync(captionsPath)) {
    try {
      captions = JSON.parse(readFileSync(captionsPath, "utf-8"));
    } catch {
      captions = {};
    }
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  console.log(`Using model: ${model}\n`);

  const DELAY_BETWEEN_REQUESTS_MS = 20_000;

  const sectionDescriptions: Record<string, string> = {
    xsr: "This is from the Yamaha XSR motorcycle photo gallery of the website owner.",
    "3d_prints":
      "This is from the 3D printing gallery. The owner uses a Bambu Lab A1 printer.",
    sketches:
      "This is from the digital sketches gallery. Drawn on iPad with Apple Pencil, mostly anime-inspired.",
  };

  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    if (captions[image.src] && captions[image.src].length > 0) {
      console.log(
        `[${i + 1}/${images.length}] ${image.src} -- already exists, skipping`
      );
      continue;
    }

    // Prefer thumbnail (much smaller, reduces token usage dramatically)
    const dir = image.src.substring(0, image.src.lastIndexOf("/"));
    const nameNoExt = image.src.split("/").pop()!.replace(/\.[^.]+$/, "");
    const thumbPath = join(process.cwd(), "public", dir, "_thumbs", `${nameNoExt}.webp`);
    const fullPath = join(process.cwd(), "public", image.src);

    const imagePath = existsSync(thumbPath) ? thumbPath : fullPath;
    if (!existsSync(imagePath)) {
      console.log(`[${i + 1}/${images.length}] ${image.src} -- file not found, skipping`);
      captions[image.src] = "";
      continue;
    }

    const imageBuffer = readFileSync(imagePath);
    const base64 = imageBuffer.toString("base64");
    const mimeType = imagePath.endsWith(".webp") ? "image/webp" : "image/jpeg";

    console.log(`[${i + 1}/${images.length}] ${image.src}...`);

    try {
      const caption = await withRetry(async () => {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${sectionDescriptions[image.section] || ""}\n\nWrite a single concise, descriptive caption (1-2 sentences) for this image. Focus on what's visible. Do not use emojis. Do not start with "This image shows" or similar.`,
                    },
                    {
                      inlineData: {
                        mimeType,
                        data: base64,
                      },
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 2048,
              },
            }),
          }
        );

        if (!response.ok) {
          const err = await response.text();
          throw Object.assign(new Error(err), { status: response.status });
        }

        const data = await response.json();
        return (
          data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ""
        );
      });

      captions[image.src] = caption;
      console.log(`  -> ${caption.slice(0, 100)}...`);

      writeFileSync(captionsPath, JSON.stringify(captions, null, 2));
    } catch (err) {
      console.error(`  FAILED for ${image.src}:`, err);
      captions[image.src] = "";
    }

    if (i < images.length - 1) {
      console.log(
        `  Waiting ${DELAY_BETWEEN_REQUESTS_MS / 1000}s before next request...`
      );
      await sleep(DELAY_BETWEEN_REQUESTS_MS);
    }
  }

  writeFileSync(captionsPath, JSON.stringify(captions, null, 2));

  const generated = Object.values(captions).filter((c) => c.length > 0).length;
  console.log(
    `\nDone! ${generated}/${images.length} captions written to ${captionsPath}`
  );
}

main().catch((err) => {
  console.error("Caption generation failed:", err);
  process.exit(1);
});
