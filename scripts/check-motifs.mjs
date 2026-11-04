/* 2026-11-03: MAX-1002. Build fails when the three contour SVGs are missing.
   Local files only. No network. */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../public/motifs");
const names = ["contours-a.svg", "contours-b.svg", "contours-c.svg"];
const missing = names.filter((name) => !fs.existsSync(path.join(dir, name)));

if (missing.length) {
  console.error(`missing motif svg: ${missing.join(", ")} in ${dir}`);
  process.exit(1);
}
