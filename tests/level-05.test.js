import test from "node:test";
import assert from "node:assert/strict";
import { PALETTE, TEMPLATES, nextTemplate } from "../src/levels/05-feed-to-canvas/art.js";

test("every level 5 drawing is 16 by 16 and uses the palette's colours", () => {
  for (const { name, rows } of TEMPLATES) {
    assert.equal(rows.length, 16, name);
    for (const row of rows) {
      assert.equal(row.length, 16, `${name}: ${row}`);
      for (const c of row) assert.ok(c === "." || c in PALETTE, `${name}: ${c}`);
    }
  }
});

test("level 5 shows every drawing before repeating, never the same twice in a row", () => {
  let last = null;
  for (let round = 0; round < 50; round += 1) {
    const seen = new Set();
    for (let i = 0; i < TEMPLATES.length; i += 1) {
      const drawing = nextTemplate();
      assert.notEqual(drawing, last);
      seen.add(drawing);
      last = drawing;
    }
    assert.equal(seen.size, TEMPLATES.length);
  }
});
