import { test } from "node:test";
import assert from "node:assert/strict";
import { createProgress, completeLevel } from "../src/game/progress.js";
import { escapeHtml } from "../src/ui/html.js";
import { introScreen } from "../src/ui/screens/intro.js";
import { levelIntroScreen } from "../src/ui/screens/level-intro.js";
import { levelScreen, resultOverlay } from "../src/ui/screens/level.js";
import { getLevel } from "../src/levels/index.js";
import { lobbyScreen } from "../src/ui/screens/lobby.js";
import { EDITOR_GROUPS } from "../src/ui/screens/avatar-editor.js";
import { AVATAR_CATEGORIES } from "../src/data/avatar-catalog.js";
import { mapScreen } from "../src/ui/screens/map.js";
import { titleScreen } from "../src/ui/screens/title.js";

const makeState = (ui = {}) => ({
  progress: createProgress(),
  ui: { screen: "map", level: 1, levelResult: null, levelMessage: "", lobbyOpen: false, lobbyView: "main", avatarCategory: "face", confirmingReset: false, testMode: false, ...ui },
});

const assertClean = (html, where) => assert.doesNotMatch(html, /undefined|NaN|\[object/, where);

test("every screen renders for every level", () => {
  const state = makeState();
  assertClean(titleScreen(state), "title");
  assertClean(introScreen(state), "intro");
  assertClean(mapScreen(state), "map");
  for (let level = 1; level <= 19; level++) {
    for (const levelResult of [null, "won", "lost"]) {
      const levelState = makeState({ level, levelResult });
      assertClean(levelIntroScreen(levelState), `level intro ${level}`);
      assertClean(levelScreen(levelState), `level ${level}`);
    }
  }
});

test("every lobby view and avatar category renders", () => {
  for (const lobbyView of ["main", "avatar", "options"]) {
    assertClean(lobbyScreen(makeState({ lobbyView })), lobbyView);
  }
  for (const avatarCategory of ["face", "hair", "hat", "extras", "clothes", "backdrop", "skin"]) {
    assertClean(lobbyScreen(makeState({ lobbyView: "avatar", avatarCategory })), avatarCategory);
  }
});

test("every avatar category is in exactly one editor tab", () => {
  const keys = EDITOR_GROUPS.flatMap((group) => group.keys);
  assert.deepEqual([...keys].sort(), AVATAR_CATEGORIES.map((category) => category.key).sort());
});

test("losing shows a game over with the message, Try again and Back to map", () => {
  const html = resultOverlay(getLevel(1), "lost", "Ouch! You crashed.");
  assert.match(html, /Ouch! You crashed\./);
  assert.match(html, /data-action="restart-level"/);
  assert.match(html, /data-action="to-map"/);
});

test("winning shows the closing line and the next signal over the game", () => {
  const html = resultOverlay(getLevel(1), "won");
  assert.match(html, /You were playing, but you were with them\./);
  assert.match(html, /data-action="open-level" data-level="2"/);
});

test("the last level has no Next signal button", () => {
  assert.match(levelScreen(makeState({ level: 18, levelResult: "won" })), /Next signal/);
  assert.doesNotMatch(levelScreen(makeState({ level: 19, levelResult: "won" })), /Next signal/);
});

test("the map locks levels beyond the next one", () => {
  const state = makeState();
  completeLevel(state.progress, 2);
  const html = mapScreen(state);
  assert.equal((html.match(/is-done/g) ?? []).length, 2);
  assert.equal((html.match(/ disabled/g) ?? []).length, 16);
});

test("the nickname is escaped in the lobby", () => {
  const state = makeState();
  state.progress.nickname = `"><img src=x>`;
  const html = lobbyScreen(state);
  assert.ok(html.includes(`value="${escapeHtml(state.progress.nickname)}"`));
  assert.ok(!html.includes("<img"));
});

test("a lost level shows its message and a Try again button", () => {
  const html = levelScreen(makeState({ level: 1, levelResult: "lost", levelMessage: "Your friends left the chat." }));
  assert.match(html, /Your friends left the chat\./);
  assert.match(html, /data-action="restart-level"/);
});

test("levels without a minigame show the coming soon card", () => {
  assert.match(levelScreen(makeState({ level: 2 })), /Mini-game coming soon/);
});

test("levels with a minigame show an empty stage for it", () => {
  const html = levelScreen(makeState({ level: 1 }));
  assert.match(html, /id="level-stage"/);
  assert.doesNotMatch(html, /Mini-game coming soon/);
});

test("test mode opens every level on the map", () => {
  const html = mapScreen(makeState({ testMode: true }));
  assert.doesNotMatch(html, / disabled/);
  assert.match(html, /Test mode/);
});
