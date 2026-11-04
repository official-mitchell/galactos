/**
 * MAX-995: each lint:tokens rule fails on a temp fixture and passes once the
 * violation is removed. Fixtures use --no-baseline so the repo snapshot cannot
 * hide a new hit.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "lint-tokens.mjs");

function run(root) {
  return spawnSync(process.execPath, [script, "--root", root, "--no-baseline"], {
    encoding: "utf8",
  });
}

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lint-tokens-"));
  return {
    root,
    write(rel, text) {
      const full = path.join(root, rel);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, text);
    },
    rm() {
      fs.rmSync(root, { recursive: true, force: true });
    },
  };
}

test("color literals fail, then var(--on-accent) passes", () => {
  const dir = fixture();
  try {
    dir.write(
      "src/components/ColorSeed.tsx",
      "export const ink = '#ff00aa';\nexport const wash = 'rgba(255, 0, 170, 0.4)';\n",
    );
    const bad = run(dir.root);
    assert.equal(bad.status, 1, bad.stdout + bad.stderr);

    dir.write(
      "src/components/ColorSeed.tsx",
      "// color is the --on-accent token\nexport const ink = 'var(--on-accent)';\n",
    );
    const good = run(dir.root);
    assert.equal(good.status, 0, good.stdout + good.stderr);
  } finally {
    dir.rm();
  }
});

test("easing names fail, then a plain name passes", () => {
  const dir = fixture();
  try {
    dir.write("src/motion/ease.ts", "export const curve = 'Spring';\n");
    const bad = run(dir.root);
    assert.equal(bad.status, 1, bad.stdout + bad.stderr);

    dir.write("src/motion/ease.ts", "export const curve = 'standard';\n// spring is only a comment\n");
    const good = run(dir.root);
    assert.equal(good.status, 0, good.stdout + good.stderr);
  } finally {
    dir.rm();
  }
});

test("font-size under 12px and 0.75rem fails, then the floor passes", () => {
  const dir = fixture();
  try {
    dir.write("src/styles/type.css", ".label { font-size: 10px; }\n");
    const px = run(dir.root);
    assert.equal(px.status, 1, px.stdout + px.stderr);

    dir.write("src/styles/type.css", ".label { font-size: 0.5rem; }\n");
    const rem = run(dir.root);
    assert.equal(rem.status, 1, rem.stdout + rem.stderr);

    dir.write("src/styles/type.css", ".label { font-size: 12px; }\n.lede { font-size: 0.75rem; }\n/* font-size: 9px */\n");
    const good = run(dir.root);
    assert.equal(good.status, 0, good.stdout + good.stderr);
  } finally {
    dir.rm();
  }
});

test("button radius >= 999 fails, then a small radius passes", () => {
  const dir = fixture();
  try {
    dir.write("src/components/card.css", ".card { border-radius: 9999px; }\n");
    const other = run(dir.root);
    assert.equal(other.status, 0, other.stdout + other.stderr);

    dir.write(
      "src/components/button.css",
      ".btn-primary { border-radius: 9999px; }\nbutton { border-radius: 999px; }\n",
    );
    const bad = run(dir.root);
    assert.equal(bad.status, 1, bad.stdout + bad.stderr);

    dir.write(
      "src/components/Pill.tsx",
      "export function Pill() {\n  return <button className=\"rounded-full\">Go</button>;\n}\n",
    );
    dir.write("src/components/button.css", ".btn-primary { border-radius: 4px; }\n");
    const pill = run(dir.root);
    assert.equal(pill.status, 1, pill.stdout + pill.stderr);

    dir.write(
      "src/components/Pill.tsx",
      "export function Pill() {\n  return <button className=\"rounded-sm\">Go</button>;\n}\n",
    );
    const good = run(dir.root);
    assert.equal(good.status, 0, good.stdout + good.stderr);
  } finally {
    dir.rm();
  }
});
