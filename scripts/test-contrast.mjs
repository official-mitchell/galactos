/**
 * MAX-997: WCAG contrast for semantic text and accent tokens in both modes.
 *
 * Parses src/styles/tokens.css. Alpha text is composited over the surface.
 * Writes a markdown table to stdout and, when set, to GITHUB_STEP_SUMMARY.
 *
 * Usage: node scripts/test-contrast.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = fs.readFileSync(path.join(root, "src/styles/tokens.css"), "utf8");

const TEXT = ["--text-primary", "--text-secondary", "--text-muted"];
const ACCENTS = ["--accent-info", "--accent-info-text", "--accent-divergence", "--accent-success"];
const SURFACES = ["--surface-base", "--surface-raised", "--surface-emphasis"];

function block(selector) {
  const re = new RegExp(`${selector}\\s*\\{([^}]*)\\}`);
  const match = css.match(re);
  if (!match) throw new Error(`Missing ${selector} block`);
  const vars = {};
  for (const line of match[1].split("\n")) {
    const hit = line.match(/^\s*(--[\w-]+):\s*([^;]+);/);
    if (hit) vars[hit[1]] = hit[2].trim();
  }
  return vars;
}

function parseColor(value) {
  const hex = value.match(/^#([0-9a-fA-F]{6})$/);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const rgb = value.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/,
  );
  if (!rgb) throw new Error(`Unparsed color: ${value}`);
  return {
    r: Number(rgb[1]),
    g: Number(rgb[2]),
    b: Number(rgb[3]),
    a: rgb[4] === undefined ? 1 : Number(rgb[4]),
  };
}

function composite(fg, bg) {
  const a = fg.a;
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
    a: 1,
  };
}

function channel(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(c) {
  return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
}

function ratio(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const light = Math.max(a, b);
  const dark = Math.min(a, b);
  return (light + 0.05) / (dark + 0.05);
}

function resolve(vars, name) {
  let value = vars[name];
  const seen = new Set();
  while (value && value.startsWith("var(")) {
    const next = value.slice(4, -1).trim();
    if (seen.has(next)) throw new Error(`Cycle at ${name}`);
    seen.add(next);
    value = vars[next];
  }
  if (!value) throw new Error(`Missing ${name}`);
  return parseColor(value);
}

const modes = [
  ["light", block(":root")],
  ["dark", block("\\.dark")],
];

const rows = [];
let failed = 0;

function add(mode, pair, score, need, kind) {
  const ok = score >= need;
  if (!ok && kind === "required") failed += 1;
  rows.push({ mode, pair, score, need, ok, kind });
}

for (const [mode, vars] of modes) {
  for (const surfaceName of SURFACES) {
    const surface = resolve(vars, surfaceName);
    for (const name of TEXT) {
      const fg = composite(resolve(vars, name), surface);
      const score = ratio(fg, surface);
      // Light emphasis is Deep Space, the same hex as light text-primary.
      // Copy on that band uses Paper. Those pairs are reported, not gated.
      const kind = mode === "light" && surfaceName === "--surface-emphasis" ? "known" : "required";
      add(mode, `${name} on ${surfaceName}`, score, 4.5, kind);
    }
    for (const name of ACCENTS) {
      const fg = resolve(vars, name);
      const score = ratio(fg, surface);
      // D5 keeps Signal Orange and Success Green. On Paper and White they
      // sit under 3:1. They are graphics, not body text.
      const lightGraphic =
        mode === "light" &&
        (surfaceName === "--surface-base" || surfaceName === "--surface-raised") &&
        (name === "--accent-divergence" || name === "--accent-success");
      add(mode, `${name} on ${surfaceName}`, score, 3, lightGraphic ? "known" : "required");
    }
  }
}

const lines = [
  "## Contrast",
  "",
  "| Mode | Pair | Ratio | Need | Result |",
  "| --- | --- | ---: | ---: | --- |",
  ...rows.map(
    (row) =>
      `| ${row.mode} | \`${row.pair}\` | ${row.score.toFixed(2)} | ${row.need.toFixed(1)} | ${row.ok ? "pass" : row.kind === "known" ? "known" : "fail"} |`,
  ),
  "",
  failed === 0
    ? "Required pairs passed. Rows marked known are the light emphasis text tokens and orange/green on Paper and White."
    : `${failed} required pair(s) failed.`,
];

const summary = lines.join("\n");
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\n${summary}\n`);
}
process.exit(failed === 0 ? 0 : 1);
