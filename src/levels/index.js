/**
 * The 19 levels, in map order. Each level lives in its own folder with
 * everything about it: `level.js` (texts, settings, minigame), `README.md`
 * (design notes and progress) and, once built, `level.css` and `assets/`.
 * How to build a level: src/levels/README.md.
 */
import level01 from "./01-game-and-chat/level.js";
import level02 from "./02-rhythm-tap/level.js";
import level03 from "./03-spot-the-impostor/level.js";
import level04 from "./04-claw-machine/level.js";
import level05 from "./05-feed-to-canvas/level.js";
import level06 from "./06-club-crest-match-3/level.js";
import level07 from "./07-ritual-simon/level.js";
import level08 from "./08-idle-chat/level.js";
import level09 from "./09-the-room/level.js";
import level10 from "./10-customizer/level.js";
import level11 from "./11-streaks/level.js";
import level12 from "./12-spot-the-difference/level.js";
import level13 from "./13-watch-party/level.js";
import level14 from "./14-tidy-up/level.js";
import level15 from "./15-phone-off/level.js";
import level16 from "./16-most-likely-to/level.js";
import level17 from "./17-collectibles-match-3/level.js";
import level18 from "./18-odd-one-out/level.js";
import level19 from "./19-jigsaw/level.js";

/** @type {ReadonlyArray<import("../engine/define-level.js").LevelDefinition>} */
export const LEVELS = [
  level01, level02, level03, level04, level05, level06, level07, level08, level09, level10,
  level11, level12, level13, level14, level15, level16, level17, level18, level19,
];

export const TOTAL_LEVELS = LEVELS.length;

/** @param {number} number 1-based level number. */
export const getLevel = (number) => LEVELS[number - 1];
