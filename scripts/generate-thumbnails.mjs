/**
 * Build-time thumbnail generator for the photo gallery.
 * Scans public/portfolio/images/<section>/ and outputs optimized
 * WebP thumbnails to public/portfolio/images/<section>/_thumbs/.
 *
 * Run: node scripts/generate-thumbnails.mjs
 * Automatically runs via the "prebuild" npm script.
 */

import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";

const IMAGES_ROOT = "public/portfolio/images";
const THUMBS_DIR = "_thumbs";
const THUMB_WIDTH = 600;
const THUMB_QUALITY = 80;
const SUPPORTED_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function generateThumbnails() {
  const sections = await readdir(IMAGES_ROOT);

  let generated = 0;
  let skipped = 0;

  for (const section of sections) {
    const sectionPath = join(IMAGES_ROOT, section);
    const sectionStat = await stat(sectionPath);
    if (!sectionStat.isDirectory() || section.startsWith(".") || section === THUMBS_DIR) {
      continue;
    }

    const thumbsPath = join(sectionPath, THUMBS_DIR);
    await mkdir(thumbsPath, { recursive: true });

    const files = await readdir(sectionPath);

    for (const file of files) {
      if (file === THUMBS_DIR || file.startsWith(".")) continue;

      const ext = extname(file).toLowerCase();
      if (!SUPPORTED_EXTS.has(ext)) continue;

      const inputPath = join(sectionPath, file);
      const outputName = basename(file, ext) + ".webp";
      const outputPath = join(thumbsPath, outputName);

      // Skip if thumbnail already exists and is newer than source
      try {
        const srcStat = await stat(inputPath);
        const thumbStat = await stat(outputPath);
        if (thumbStat.mtimeMs >= srcStat.mtimeMs) {
          skipped++;
          continue;
        }
      } catch {
        // Thumbnail doesn't exist yet, generate it
      }

      await sharp(inputPath)
        .resize(THUMB_WIDTH, THUMB_WIDTH, {
          fit: "cover",
          position: "centre",
        })
        .webp({ quality: THUMB_QUALITY })
        .toFile(outputPath);

      generated++;
      console.log(`  [thumb] ${section}/${file} -> _thumbs/${outputName}`);
    }
  }

  console.log(
    `\nThumbnails: ${generated} generated, ${skipped} up-to-date.\n`
  );
}

console.log("Generating gallery thumbnails...\n");
generateThumbnails().catch((err) => {
  console.error("Thumbnail generation failed:", err);
  process.exit(1);
});
