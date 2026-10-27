import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 4 · Claw Machine
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 4,
  signal: "Digital generation. Physical objects. Physical comeback",
  minigame: "Claw Machine",
  explanation: "Surrounded by screens, teens give new value to CDs, cameras, fanzines, stickers and cards: things you can keep, swap and personalise.",
  closingLine: "You can touch them. That’s why they matter.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    objectsToCatch: 3, // physical objects you must grab
    attempts: 5, // tries with the claw
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
