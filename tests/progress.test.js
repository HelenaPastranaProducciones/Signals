import { test } from "node:test";
import assert from "node:assert/strict";
import { AVATAR_CATEGORIES, findOption } from "../src/data/avatar-catalog.js";
import {
  completeLevel, createProgress, isLevelAvailable, isUnlocked, normalizeNickname, randomizeAvatar, resetProgress,
  setAvatarPart, setNickname,
} from "../src/game/progress.js";

test("levels open one after another", () => {
  const progress = createProgress();
  assert.ok(isLevelAvailable(progress, 1));
  assert.ok(!isLevelAvailable(progress, 2));
  completeLevel(progress, 1);
  assert.ok(isLevelAvailable(progress, 2));
  assert.ok(!isLevelAvailable(progress, 3));
});

test("replaying an earlier level keeps progress", () => {
  const progress = createProgress();
  completeLevel(progress, 3);
  completeLevel(progress, 1);
  assert.equal(progress.completed, 3);
});

test("locked pieces cannot be selected until their level is completed", () => {
  const progress = createProgress();
  assert.equal(setAvatarPart(progress, "hair", "afro"), false);
  assert.equal(progress.avatar.hair, "short");
  completeLevel(progress, 2);
  assert.equal(setAvatarPart(progress, "hair", "afro"), true);
  assert.equal(progress.avatar.hair, "afro");
});

test("unknown pieces are ignored", () => {
  const progress = createProgress();
  assert.equal(setAvatarPart(progress, "hair", "nope"), false);
  assert.equal(setAvatarPart(progress, "nope", "short"), false);
});

test("random avatars only use unlocked pieces", () => {
  const progress = createProgress();
  for (let i = 0; i < 50; i++) {
    randomizeAvatar(progress);
    for (const category of AVATAR_CATEGORIES) {
      assert.ok(isUnlocked(progress, findOption(category.key, progress.avatar[category.key]).unlockLevel));
    }
  }
});

test("reset clears levels and takes off pieces that become locked", () => {
  const progress = createProgress();
  completeLevel(progress, 5);
  setAvatarPart(progress, "hair", "mohawk");
  setAvatarPart(progress, "skin", "#c9f23a");
  setAvatarPart(progress, "eyes", "happy");
  resetProgress(progress);
  assert.equal(progress.completed, 0);
  assert.equal(progress.avatar.hair, "none");
  assert.equal(progress.avatar.skin, "#f6c7a0");
  assert.equal(progress.avatar.eyes, "happy");
});

test("nicknames are capped and never left blank", () => {
  const progress = createProgress();
  setNickname(progress, "a very long nickname indeed");
  assert.equal(progress.nickname.length, 14);
  setNickname(progress, "   ");
  normalizeNickname(progress);
  assert.equal(progress.nickname, "Player");
});
