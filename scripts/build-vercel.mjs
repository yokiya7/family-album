import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const distDir = join(root, "dist");

const productionFiles = [
  "index.html",
  "app.js",
  "styles.css",
  "grandfather-scenes.js",
  "assets",
  "family",
];

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const file of productionFiles) {
  await cp(join(root, file), join(distDir, file), {
    recursive: true,
    force: true,
  });
}

console.log(`Built static site into ${distDir}`);
