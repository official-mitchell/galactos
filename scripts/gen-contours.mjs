/* 2026-11-03: MAX-1002. Seeded value noise and marching squares write
   public/motifs/contours-{a,b,c}.svg. Same seed, same bytes. No d3. */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const SEED = 1002;

const COLS = 48;
const ROWS = 28;
const CELL = 10;
const VIEW_W = COLS * CELL;
const VIEW_H = ROWS * CELL;

const VARIANTS = [
  { id: "a", salt: 1, levels: [0.42, 0.55, 0.68] },
  { id: "b", salt: 2, levels: [0.38, 0.5, 0.62] },
  { id: "c", salt: 3, levels: [0.45, 0.58, 0.72] },
];

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function valueNoise(rng, latticeCols, latticeRows) {
  const lattice = [];
  for (let i = 0; i < latticeCols * latticeRows; i += 1) lattice.push(rng());
  return function sample(x, y) {
    const x0 = Math.max(0, Math.min(latticeCols - 2, Math.floor(x)));
    const y0 = Math.max(0, Math.min(latticeRows - 2, Math.floor(y)));
    const tx = x - x0;
    const ty = y - y0;
    const at = (yy, xx) => lattice[yy * latticeCols + xx];
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);
    const v00 = at(y0, x0);
    const v10 = at(y0, x0 + 1);
    const v01 = at(y0 + 1, x0);
    const v11 = at(y0 + 1, x0 + 1);
    const top = v00 + (v10 - v00) * sx;
    const bot = v01 + (v11 - v01) * sx;
    return top + (bot - top) * sy;
  };
}

function mix(a, b, level) {
  const d = b - a;
  const f = d === 0 ? 0.5 : (level - a) / d;
  return Math.min(1, Math.max(0, f));
}

function edgePoint(edge, x, y, tl, tr, br, bl, level) {
  if (edge === 0) {
    return [(x + mix(tl, tr, level)) * CELL, y * CELL];
  }
  if (edge === 1) {
    return [(x + 1) * CELL, (y + mix(tr, br, level)) * CELL];
  }
  if (edge === 2) {
    return [(x + 1 - mix(br, bl, level)) * CELL, (y + 1) * CELL];
  }
  return [x * CELL, (y + 1 - mix(bl, tl, level)) * CELL];
}

function segmentsForCell(x, y, tl, tr, br, bl, level) {
  let bits = 0;
  if (tl >= level) bits |= 1;
  if (tr >= level) bits |= 2;
  if (br >= level) bits |= 4;
  if (bl >= level) bits |= 8;
  const center = (tl + tr + br + bl) / 4;
  let pairs;
  if (bits === 5) pairs = center >= level ? [[3, 2], [0, 1]] : [[3, 0], [1, 2]];
  else if (bits === 10) pairs = center >= level ? [[0, 3], [1, 2]] : [[0, 1], [2, 3]];
  else {
    const table = {
      1: [[3, 0]],
      2: [[0, 1]],
      3: [[3, 1]],
      4: [[1, 2]],
      6: [[0, 2]],
      7: [[3, 2]],
      8: [[2, 3]],
      9: [[0, 2]],
      11: [[1, 2]],
      12: [[1, 3]],
      13: [[0, 1]],
      14: [[3, 0]],
    };
    pairs = table[bits] ?? [];
  }
  return pairs.map(([a, b]) => [
    edgePoint(a, x, y, tl, tr, br, bl, level),
    edgePoint(b, x, y, tl, tr, br, bl, level),
  ]);
}

function keyOf(p) {
  return `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
}

function stitch(segs) {
  const adj = new Map();
  segs.forEach((seg, i) => {
    for (const p of seg) {
      const k = keyOf(p);
      if (!adj.has(k)) adj.set(k, []);
      adj.get(k).push(i);
    }
  });
  const used = new Set();
  const paths = [];
  for (let i = 0; i < segs.length; i += 1) {
    if (used.has(i)) continue;
    used.add(i);
    const poly = [segs[i][0], segs[i][1]];
    let grew = true;
    while (grew) {
      grew = false;
      const ends = [poly.length - 1, 0];
      for (const endIdx of ends) {
        const cands = adj.get(keyOf(poly[endIdx])) ?? [];
        const next = cands.find((id) => !used.has(id));
        if (next == null) continue;
        used.add(next);
        const [a, b] = segs[next];
        const other = keyOf(a) === keyOf(poly[endIdx]) ? b : a;
        if (endIdx === 0) poly.unshift(other);
        else poly.push(other);
        grew = true;
        break;
      }
    }
    paths.push(poly);
  }
  return paths;
}

function pathD(poly) {
  return poly
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)} ${p[1].toFixed(2)}`)
    .join("");
}

function field(seed, salt) {
  const rng = mulberry32(seed * 1000 + salt);
  const noise = valueNoise(rng, 16, 12);
  const samples = [];
  for (let y = 0; y <= ROWS; y += 1) {
    for (let x = 0; x <= COLS; x += 1) {
      samples.push(noise(x / 4, y / 4));
    }
  }
  return samples;
}

function contours(samples, level) {
  const segs = [];
  const stride = COLS + 1;
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const tl = samples[y * stride + x];
      const tr = samples[y * stride + x + 1];
      const bl = samples[(y + 1) * stride + x];
      const br = samples[(y + 1) * stride + x + 1];
      segs.push(...segmentsForCell(x, y, tl, tr, br, bl, level));
    }
  }
  return stitch(segs).map(pathD);
}

export function buildSvgs(seed = SEED) {
  return VARIANTS.map((variant) => {
    const samples = field(seed, variant.salt);
    const paths = variant.levels.flatMap((level) => contours(samples, level));
    const body = paths.map((d) => `  <path d="${d}" vector-effect="non-scaling-stroke"/>`).join("\n");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" fill="none" stroke="currentColor" stroke-width="0.75">\n${body}\n</svg>\n`;
    return { id: variant.id, file: `contours-${variant.id}.svg`, paths: paths.length, svg };
  });
}

export function writeContours(outDir, seed = SEED) {
  fs.mkdirSync(outDir, { recursive: true });
  const files = buildSvgs(seed);
  console.log(`seed ${seed}`);
  for (const file of files) {
    fs.writeFileSync(path.join(outDir, file.file), file.svg);
    console.log(`${file.file} paths ${file.paths}`);
  }
  return files;
}

const isMain =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isMain) {
  const outFlag = process.argv.indexOf("--out");
  const outDir =
    outFlag >= 0
      ? path.resolve(process.argv[outFlag + 1])
      : path.join(path.dirname(fileURLToPath(import.meta.url)), "../public/motifs");
  writeContours(outDir, SEED);
}
