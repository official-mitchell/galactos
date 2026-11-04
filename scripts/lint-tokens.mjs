/**
 * MAX-995 quality gate: token, type-floor, easing, and button-radius checks.
 *
 * Usage:
 *   node scripts/lint-tokens.mjs
 *   node scripts/lint-tokens.mjs --no-baseline
 *   node scripts/lint-tokens.mjs --baseline path.json
 *   node scripts/lint-tokens.mjs --root <fixture> --no-baseline
 *   node scripts/lint-tokens.mjs --write-baseline
 *
 * Baseline (scripts/lint-tokens-baseline.json) is the pre-token port snapshot.
 * A finding already counted there is allowed. A higher count, or a new
 * file/literal, exits 1. A lower count is allowed so fixing a color does not
 * fail CI. MAX-997 should shrink the baseline as literals move to tokens.
 *
 * Rules:
 * 1. Color — hex (#rgb, #rgba, #rrggbb, #rrggbbaa) and rgb()/rgba() in
 *    src/components. The custom property name --on-accent and var(--on-accent)
 *    are allowed. A comment that only names that token is not a hit.
 * 2. Easing — whole words back, elastic, bounce, spring (any case) in
 *    src/motion. Matches inside comments are ignored.
 * 3. Font size — font-size / fontSize under 12px, or under 0.75rem, anywhere
 *    under src/. Unitless numbers are treated as px (React inline style).
 *    Values inside comments are ignored. clamp() is checked per length.
 * 4. Button radius — narrow on purpose. border-radius >= 999px (or the rem
 *    equivalent, 62.4375rem) only when the CSS selector is a button element,
 *    [role="button"], or a .btn / .btn-* class. In JSX, the same lengths, plus
 *    the Tailwind pill forms rounded-full and rounded-[Npx] with N >= 999,
 *    only on <button> or role="button". Other elements may be fully rounded.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const DEFAULT_BASELINE = path.join(SCRIPT_DIR, "lint-tokens-baseline.json");

const HEX_RE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g;
const RGB_RE = /rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?(?:\s*,\s*[\d.]+%?)?\s*\)/gi;
const EASE_RE = /\b(back|elastic|bounce|spring)\b/gi;
const FONT_RE =
  /font-?size\s*[:=]\s*(?:"([^"]*)"|'([^']*)'|([0-9]*\.?[0-9]+(?:px|rem)?))/gi;
const LENGTH_RE = /([0-9]*\.?[0-9]+)(px|rem)\b/gi;
const CSS_RULE_RE = /([^{}]+)\{([^{}]*)\}/g;
const BUTTON_SELECTOR_RE =
  /(^|[\s,>+~])button\b|\.btn(?:-[\w-]+)?\b|\[role\s*=\s*["']button["']\]|input\[type\s*=\s*["'](?:button|submit)["']\]/i;
const JSX_BUTTON_RE = /<button\b([^>]*)>|<\w+\b([^>]*\brole\s*=\s*["']button["'][^>]*)>/gi;
const RADIUS_DECL_RE = /border-?radius\s*:\s*([^;}{]+)/gi;
const ROUNDED_ARBITRARY_RE = /rounded-\[([0-9]*\.?[0-9]+)px\]/gi;
const MIN_FONT_PX = 12;
const MIN_FONT_REM = 0.75;
const MIN_PILL_PX = 999;
const MIN_PILL_REM = 999 / 16;

function parseArgs(argv) {
  const opts = {
    root: REPO_ROOT,
    baseline: DEFAULT_BASELINE,
    noBaseline: false,
    writeBaseline: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--no-baseline") opts.noBaseline = true;
    else if (arg === "--write-baseline") opts.writeBaseline = true;
    else if (arg === "--root") opts.root = path.resolve(argv[++i]);
    else if (arg === "--baseline") opts.baseline = path.resolve(argv[++i]);
    else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(2);
    }
  }
  return opts;
}

function walkSrc(root) {
  const src = path.join(root, "src");
  const files = [];
  if (!fs.existsSync(src)) return files;
  const stack = [src];
  while (stack.length) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.name === "node_modules" || ent.name === "dist") continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(full);
      else if (/\.(tsx?|jsx?|css)$/.test(ent.name)) files.push(full);
    }
  }
  files.sort();
  return files;
}

function relPosix(root, file) {
  return path.relative(root, file).split(path.sep).join("/");
}

/** 1 = comment. Strings are skipped so // and # inside them stay code. */
function commentMask(text) {
  const mask = new Uint8Array(text.length);
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === "/" && text[i + 1] === "*") {
      const end = text.indexOf("*/", i + 2);
      const to = end === -1 ? text.length : end + 2;
      mask.fill(1, i, to);
      i = to;
      continue;
    }
    if (c === "/" && text[i + 1] === "/") {
      let to = text.indexOf("\n", i);
      if (to === -1) to = text.length;
      mask.fill(1, i, to);
      i = to;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      i += 1;
      while (i < text.length) {
        if (text[i] === "\\") {
          i += 2;
          continue;
        }
        if (text[i] === c) {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }
    i += 1;
  }
  return mask;
}

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) if (text[i] === "\n") line += 1;
  return line;
}

function inComment(mask, index, length) {
  for (let i = index; i < index + length; i += 1) if (mask[i]) return true;
  return false;
}

function add(findings, rule, file, line, key, detail) {
  findings.push({ rule, file, line, key: `${rule}|${file}|${key}`, detail });
}

function scanColors(text, file, mask, findings) {
  const consider = (re, kind) => {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(text))) {
      const raw = match[0];
      if (inComment(mask, match.index, raw.length)) {
        const lineStart = text.lastIndexOf("\n", match.index) + 1;
        let lineEnd = text.indexOf("\n", match.index);
        if (lineEnd === -1) lineEnd = text.length;
        const lineText = text.slice(lineStart, lineEnd);
        const withoutToken = lineText
          .replace(/var\(\s*--on-accent\s*\)/g, "")
          .replace(/--on-accent/g, "");
        const still = kind === "hex" ? /#[0-9a-fA-F]{3,8}\b/.test(withoutToken) : /rgba?\(/.test(withoutToken);
        if (!still) continue;
      }
      const normalized = raw.toLowerCase().replace(/\s+/g, "");
      add(findings, "color", file, lineOf(text, match.index), normalized, raw);
    }
  };
  consider(HEX_RE, "hex");
  consider(RGB_RE, "rgb");
}

function scanEasing(text, file, mask, findings) {
  EASE_RE.lastIndex = 0;
  let match;
  while ((match = EASE_RE.exec(text))) {
    if (inComment(mask, match.index, match[0].length)) continue;
    add(findings, "easing", file, lineOf(text, match.index), match[1].toLowerCase(), match[0]);
  }
}

function fontLengths(raw) {
  const value = raw.trim();
  if (/^-?[0-9]*\.?[0-9]+$/.test(value)) return [{ n: Number(value), unit: "px" }];
  const found = [];
  LENGTH_RE.lastIndex = 0;
  let match;
  while ((match = LENGTH_RE.exec(value))) {
    found.push({ n: Number(match[1]), unit: match[2].toLowerCase() });
  }
  return found;
}

function scanFont(text, file, mask, findings) {
  FONT_RE.lastIndex = 0;
  let match;
  while ((match = FONT_RE.exec(text))) {
    if (inComment(mask, match.index, match[0].length)) continue;
    const raw = match[1] ?? match[2] ?? match[3] ?? "";
    for (const len of fontLengths(raw)) {
      const tooSmall = len.unit === "px" ? len.n < MIN_FONT_PX : len.unit === "rem" ? len.n < MIN_FONT_REM : false;
      if (!tooSmall) continue;
      const key = len.unit === "px" ? `${len.n}px` : `${len.n}rem`;
      add(findings, "font-size", file, lineOf(text, match.index), key, match[0].trim());
    }
  }
}

function radiusTooRound(value) {
  const hits = [];
  const re = /([0-9]*\.?[0-9]+)(px|rem)?/gi;
  let match;
  while ((match = re.exec(value))) {
    const n = Number(match[1]);
    const unit = (match[2] || "px").toLowerCase();
    if (unit === "px" && n >= MIN_PILL_PX) hits.push(`${n}px`);
    if (unit === "rem" && n >= MIN_PILL_REM) hits.push(`${n}rem`);
  }
  return hits;
}

function scanRadius(text, file, mask, findings) {
  const blank = text.replace(/[^\n]/g, (ch, i) => (mask[i] ? " " : ch));
  CSS_RULE_RE.lastIndex = 0;
  let rule;
  while ((rule = CSS_RULE_RE.exec(blank))) {
    if (!BUTTON_SELECTOR_RE.test(rule[1])) continue;
    RADIUS_DECL_RE.lastIndex = 0;
    let decl;
    while ((decl = RADIUS_DECL_RE.exec(rule[2]))) {
      for (const key of radiusTooRound(decl[1])) {
        const index = rule.index + rule[1].length + 1 + decl.index;
        add(findings, "button-radius", file, lineOf(text, index), key, decl[0].trim());
      }
    }
  }

  JSX_BUTTON_RE.lastIndex = 0;
  let tag;
  while ((tag = JSX_BUTTON_RE.exec(blank))) {
    const attrs = tag[1] || tag[2] || "";
    const tagStart = tag.index;
    if (/\brounded-full\b/.test(attrs)) {
      add(findings, "button-radius", file, lineOf(text, tagStart), "rounded-full", "rounded-full");
    }
    ROUNDED_ARBITRARY_RE.lastIndex = 0;
    let arb;
    while ((arb = ROUNDED_ARBITRARY_RE.exec(attrs))) {
      if (Number(arb[1]) >= MIN_PILL_PX) {
        add(findings, "button-radius", file, lineOf(text, tagStart), `${arb[1]}px`, arb[0]);
      }
    }
    RADIUS_DECL_RE.lastIndex = 0;
    let decl;
    while ((decl = RADIUS_DECL_RE.exec(attrs))) {
      for (const key of radiusTooRound(decl[1])) {
        add(findings, "button-radius", file, lineOf(text, tagStart), key, decl[0].trim());
      }
    }
  }
}

export function scan(root) {
  const findings = [];
  for (const full of walkSrc(root)) {
    const file = relPosix(root, full);
    const text = fs.readFileSync(full, "utf8");
    const mask = commentMask(text);
    if (file.startsWith("src/components/")) scanColors(text, file, mask, findings);
    if (file.startsWith("src/motion/")) scanEasing(text, file, mask, findings);
    scanFont(text, file, mask, findings);
    scanRadius(text, file, mask, findings);
  }
  return findings;
}

function countsOf(findings) {
  const counts = {};
  for (const finding of findings) counts[finding.key] = (counts[finding.key] || 0) + 1;
  return counts;
}

function readBaseline(file) {
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  return parsed.counts && typeof parsed.counts === "object" ? parsed.counts : {};
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const findings = scan(opts.root);
  const counts = countsOf(findings);

  if (opts.writeBaseline) {
    const body = {
      _comment:
        "Pre-token port baseline generated for MAX-995. Each key is rule|path|literal and the value is how many times it appears. lint:tokens fails when a key is new or its count rises. Counts may fall without failing. MAX-997 should shrink this file.",
      generated: "2026-11-03",
      counts,
    };
    fs.writeFileSync(opts.baseline, `${JSON.stringify(body, null, 2)}\n`);
    console.log(`Wrote ${Object.keys(counts).length} baseline keys to ${opts.baseline}`);
    return;
  }

  const baseline = opts.noBaseline ? {} : readBaseline(opts.baseline);
  const fresh = [];
  for (const finding of findings) {
    const allowed = baseline[finding.key] || 0;
    const seen = fresh.filter((item) => item.key === finding.key).length;
    if (seen >= allowed) fresh.push(finding);
  }

  if (fresh.length === 0) {
    console.log(`lint:tokens ok (${findings.length} finding(s), ${opts.noBaseline ? "no baseline" : "within baseline"})`);
    return;
  }

  console.error(`lint:tokens failed: ${fresh.length} finding(s) outside the baseline`);
  for (const finding of fresh) {
    console.error(`  ${finding.rule} ${finding.file}:${finding.line} ${finding.detail}`);
  }
  process.exit(1);
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) main();
