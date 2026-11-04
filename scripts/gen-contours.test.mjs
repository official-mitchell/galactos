/* 2026-11-03: MAX-1002. Two generator runs must hash to the same bytes. */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "gen-contours.mjs");
const names = ["contours-a.svg", "contours-b.svg", "contours-c.svg"];

function hashDir(dir) {
  const hash = crypto.createHash("sha256");
  for (const name of names) {
    hash.update(name);
    hash.update(fs.readFileSync(path.join(dir, name)));
  }
  return hash.digest("hex");
}

test("two generator runs produce the same hash", () => {
  const a = fs.mkdtempSync(path.join(os.tmpdir(), "contours-a-"));
  const b = fs.mkdtempSync(path.join(os.tmpdir(), "contours-b-"));
  try {
    for (const dir of [a, b]) {
      const run = spawnSync(process.execPath, [script, "--out", dir], { encoding: "utf8" });
      assert.equal(run.status, 0, run.stderr);
      assert.match(run.stdout, /seed 1002/);
      assert.match(run.stdout, /contours-a\.svg paths \d+/);
    }
    assert.equal(hashDir(a), hashDir(b));
  } finally {
    fs.rmSync(a, { recursive: true, force: true });
    fs.rmSync(b, { recursive: true, force: true });
  }
});
