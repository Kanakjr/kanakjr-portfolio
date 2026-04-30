/**
 * Build-time thumbnail generator for the photo galleries.
 * Scans each configured root for sectioned images and outputs optimized
 * WebP thumbnails to <section>/_thumbs/. Also handles flat layouts where
 * all images live directly under the root (no per-section subfolders).
 *
 * Run: node scripts/generate-thumbnails.mjs
 * Automatically runs via the "build" npm script after Instagram sync.
 */

import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";

const THUMBS_DIR = "_thumbs";
const THUMB_WIDTH = 600;
const THUMB_QUALITY = 80;
const SUPPORTED_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/**
 * Roots scanned for thumbnail generation.
 * - portfolio/images: per-section subfolders (xsr, 3d_prints, sketches, ...)
 * - instagram/posts: flat layout, all photos directly under the root
 */
const ROOTS = [
  { path: "public/portfolio/images", flat: false },
  { path: "public/instagram/posts", flat: true },
];

async function safeReaddir(path) {
  try {
    return await readdir(path);
  } catch (err) {
    if (err && err.code === "ENOENT") return null;
    throw err;
  }
}

async function generateForDirectory(label, dirPath) {
  const entries = await safeReaddir(dirPath);
  if (!entries) return { generated: 0, skipped: 0 };

  const thumbsPath = join(dirPath, THUMBS_DIR);
  await mkdir(thumbsPath, { recursive: true });

  let generated = 0;
  let skipped = 0;

  for (const file of entries) {
    if (file === THUMBS_DIR || file.startsWith(".")) continue;

    const ext = extname(file).toLowerCase();
    if (!SUPPORTED_EXTS.has(ext)) continue;

    const inputPath = join(dirPath, file);
    const inputStat = await stat(inputPath);
    if (!inputStat.isFile()) continue;

    const outputName = basename(file, ext) + ".webp";
    const outputPath = join(thumbsPath, outputName);

    try {
      const thumbStat = await stat(outputPath);
      if (thumbStat.mtimeMs >= inputStat.mtimeMs) {
        skipped++;
        continue;
      }
    } catch {
      // thumbnail doesn't exist yet, fall through and generate
    }

    await sharp(inputPath)
      .resize(THUMB_WIDTH, THUMB_WIDTH, { fit: "cover", position: "centre" })
      .webp({ quality: THUMB_QUALITY })
      .toFile(outputPath);

    generated++;
    console.log(`  [thumb] ${label}/${file} -> _thumbs/${outputName}`);
  }

  return { generated, skipped };
}

async function generateThumbnailsForRoot({ path: root, flat }) {
  const entries = await safeReaddir(root);
  if (!entries) {
    console.log(`  (skipped: ${root} does not exist)`);
    return { generated: 0, skipped: 0 };
  }

  if (flat) {
    return generateForDirectory(basename(root), root);
  }

  let generated = 0;
  let skipped = 0;
  for (const section of entries) {
    if (section === THUMBS_DIR || section.startsWith(".")) continue;
    const sectionPath = join(root, section);
    const sectionStat = await stat(sectionPath);
    if (!sectionStat.isDirectory()) continue;
    const result = await generateForDirectory(section, sectionPath);
    generated += result.generated;
    skipped += result.skipped;
  }
  return { generated, skipped };
}

async function main() {
  console.log("Generating gallery thumbnails...\n");
  let totalGenerated = 0;
  let totalSkipped = 0;
  for (const root of ROOTS) {
    console.log(`Scanning ${root.path}...`);
    const { generated, skipped } = await generateThumbnailsForRoot(root);
    totalGenerated += generated;
    totalSkipped += skipped;
  }
  console.log(
    `\nThumbnails: ${totalGenerated} generated, ${totalSkipped} up-to-date.\n`
  );
}

main().catch((err) => {
  console.error("Thumbnail generation failed:", err);
  process.exit(1);
});
