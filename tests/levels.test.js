import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { getLevel, LEVELS, TOTAL_LEVELS } from "../src/levels/index.js";
import { defineLevel } from "../src/engine/define-level.js";
import { readLevelProgress } from "../scripts/level-status.js";

const LEVELS_DIR = new URL("../src/levels/", import.meta.url);
const folders = readdirSync(LEVELS_DIR).filter((name) => /^\d\d-/.test(name)).sort();

test("there are 19 levels numbered 1 to 19 in order", () => {
  assert.equal(TOTAL_LEVELS, 19);
  LEVELS.forEach((level, index) => assert.equal(level.number, index + 1));
});

test("every level has all its texts", () => {
  for (const level of LEVELS) {
    for (const field of ["signal", "minigame", "explanation", "closingLine"]) {
      assert.ok(level[field].trim().length > 0, `level ${level.number} ${field} is empty`);
    }
  }
});

test("each level has its own numbered folder with level.js and README.md", () => {
  assert.equal(folders.length, 19);
  folders.forEach((folder, index) => {
    assert.ok(folder.startsWith(String(index + 1).padStart(2, "0")), folder);
    assert.ok(existsSync(new URL(`${folder}/level.js`, LEVELS_DIR)), `${folder}/level.js`);
    assert.ok(existsSync(new URL(`${folder}/README.md`, LEVELS_DIR)), `${folder}/README.md`);
  });
});

test("the registry lists the level folders in order", () => {
  const registry = readFileSync(new URL("index.js", LEVELS_DIR), "utf8");
  const imported = [...registry.matchAll(/from "\.\/(\d\d-[^/]+)\/level\.js"/g)].map((match) => match[1]);
  assert.deepEqual(imported, folders);
});

test("every level notebook has the six progress steps", () => {
  for (const folder of folders) {
    const steps = readLevelProgress(readFileSync(new URL(`${folder}/README.md`, LEVELS_DIR), "utf8"));
    assert.deepEqual(steps.map((step) => step.number), [1, 2, 3, 4, 5, 6], folder);
  }
});

test("settings, stylesheet and play are well formed", () => {
  for (const level of LEVELS) {
    assert.equal(typeof level.settings, "object", `level ${level.number} settings`);
    assert.ok(level.play === undefined || typeof level.play === "function", `level ${level.number} play`);
    assert.ok(level.stylesheet === undefined || level.stylesheet.endsWith(".css"), `level ${level.number} stylesheet`);
  }
});

test("defineLevel explains what is missing", () => {
  assert.throws(() => defineLevel({ number: 3, signal: "x", minigame: "y", explanation: "z" }), /closingLine/);
  assert.throws(() => defineLevel({ signal: "x" }), /number/);
  assert.deepEqual(defineLevel({ number: 1, signal: "a", minigame: "b", explanation: "c", closingLine: "d" }).settings, {});
});

test("getLevel is 1-based", () => {
  assert.equal(getLevel(1).minigame, "Game & Chat");
  assert.equal(getLevel(19).minigame, "Jigsaw");
});
