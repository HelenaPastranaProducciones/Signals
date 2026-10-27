import { test } from "node:test";
import assert from "node:assert/strict";
import { AVATAR_CATEGORIES, DEFAULT_AVATAR, findOption, unlocksForLevel } from "../src/data/avatar-catalog.js";
import { TOTAL_LEVELS } from "../src/data/levels.js";

/** Unlock table from the project brief (section 5), as "category key: option label". */
const BRIEF_UNLOCKS = {
  1: ["acc: Headphones"],
  2: ["top: Band tee", "hair: Afro"],
  3: ["hair: Mohawk", "hat: Beanie"],
  4: ["acc: Cassette"],
  5: ["skin: Lime", "skin: Blue", "skin: Pink", "skin: Lilac"],
  6: ["face: Star sticker", "top: Jersey"],
  7: ["hair: Space buns"],
  8: ["gl: Shutter"],
  9: ["bg: Room", "pin: Star clips"],
  10: ["hat: Bucket hat", "top: Overalls"],
  11: ["face: Band-aid", "hairC: Blue", "bg: Aquarium"],
  12: ["gl: Pixel"],
  13: ["ear: Gems", "bg: Tokyo"],
  14: ["pin: Cat ears"],
  15: ["acc: Polaroid", "bg: Paper"],
  16: ["gl: Hearts"],
  17: ["acc: Crossbody bag"],
  18: ["hairC: Green"],
  19: ["bg: Finale"],
};

test("16 categories with 117 options", () => {
  assert.equal(AVATAR_CATEGORIES.length, 16);
  assert.equal(AVATAR_CATEGORIES.reduce((sum, category) => sum + category.options.length, 0), 117);
});

test("category keys and option ids are unique", () => {
  const keys = AVATAR_CATEGORIES.map((category) => category.key);
  assert.equal(new Set(keys).size, keys.length);
  for (const category of AVATAR_CATEGORIES) {
    const ids = category.options.map((option) => option.id);
    assert.equal(new Set(ids).size, ids.length, `duplicate id in ${category.key}`);
  }
});

test("unlock levels are between 0 and the last level", () => {
  for (const category of AVATAR_CATEGORIES) {
    for (const option of category.options) {
      assert.ok(Number.isInteger(option.unlockLevel) && option.unlockLevel >= 0 && option.unlockLevel <= TOTAL_LEVELS,
        `${category.key}: ${option.label}`);
    }
  }
});

test("unlocks match the brief, level by level", () => {
  for (let level = 1; level <= TOTAL_LEVELS; level++) {
    const actual = AVATAR_CATEGORIES.flatMap((category) =>
      category.options.filter((option) => option.unlockLevel === level).map((option) => `${category.key}: ${option.label}`));
    assert.deepEqual(actual.sort(), [...BRIEF_UNLOCKS[level]].sort(), `level ${level}`);
  }
});

test("the default avatar sets every category to a piece available from the start", () => {
  assert.deepEqual(Object.keys(DEFAULT_AVATAR).sort(), AVATAR_CATEGORIES.map((category) => category.key).sort());
  for (const [key, id] of Object.entries(DEFAULT_AVATAR)) {
    assert.equal(findOption(key, id)?.unlockLevel, 0, `${key} = ${id}`);
  }
});

test("unlocksForLevel describes pieces for the completion card", () => {
  assert.deepEqual(unlocksForLevel(1), ["neck & body: Headphones"]);
  assert.deepEqual(unlocksForLevel(2), ["hair: Afro", "top: Band tee"]);
});
