import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const publicDir = join(root, "public");

async function copy(source, target) {
  await cp(join(root, source), join(publicDir, target), {
    recursive: true,
    force: true,
  });
}

await rm(publicDir, { recursive: true, force: true });
await mkdir(publicDir, { recursive: true });

await copy("index.html", "site.html");
await copy("app.js", "app.js");
await copy("styles.css", "styles.css");
await copy("grandfather-scenes.js", "grandfather-scenes.js");
await copy("assets", "assets");
await copy("family", "family");

await optimizeImages(join(publicDir, "assets"));

async function optimizeImages(dir) {
  const entries = await fsReaddir(dir);
  for (const entry of entries) {
    const source = join(dir, entry.name);
    if (entry.isDirectory()) {
      await optimizeImages(source);
      continue;
    }

    if (!/\.(png|jpe?g)$/i.test(entry.name)) {
      continue;
    }

    const metadata = await sharp(source, { failOn: "none" }).metadata();
    const maxWidth = source.includes("\\grandfather\\") || source.includes("/grandfather/")
      ? 1400
      : 1800;
    const image = sharp(source, { failOn: "none" }).rotate();

    if (metadata.width && metadata.width > maxWidth) {
      image.resize({ width: maxWidth, withoutEnlargement: true });
    }

    const optimized = await image
      .png({ compressionLevel: 9, effort: 10, palette: true, quality: 82 })
      .toBuffer();

    const original = await fsStat(source);
    if (optimized.length < original.size) {
      await fsWriteFile(source, optimized);
    }
  }
}

async function fsReaddir(dir) {
  return (await import("node:fs/promises")).readdir(dir, { withFileTypes: true });
}

async function fsStat(file) {
  return (await import("node:fs/promises")).stat(file);
}

async function fsWriteFile(file, data) {
  return (await import("node:fs/promises")).writeFile(file, data);
}
