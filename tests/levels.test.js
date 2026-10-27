import { test } from "node:test";
import assert from "node:assert/strict";
import { getLevel, LEVELS, TOTAL_LEVELS } from "../src/data/levels.js";

test("there are 19 levels numbered 1 to 19 in order", () => {
  assert.equal(TOTAL_LEVELS, 19);
  LEVELS.forEach((level, index) => assert.equal(level.number, index + 1));
});

test("every level has all its texts", () => {
  for (const level of LEVELS) {
    for (const field of ["signal", "minigame", "explanation", "closingLine"]) {
      assert.equal(typeof level[field], "string", `level ${level.number} ${field}`);
      assert.ok(level[field].trim().length > 0, `level ${level.number} ${field} is empty`);
    }
  }
});

test("getLevel is 1-based", () => {
  assert.equal(getLevel(1).minigame, "Game & Chat");
  assert.equal(getLevel(19).minigame, "Jigsaw");
});
