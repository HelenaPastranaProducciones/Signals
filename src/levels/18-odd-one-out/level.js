import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 18 · Odd One Out
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 18,
  signal: "Friend groups have their own culture",
  minigame: "Odd One Out",
  // Not in the Signals Journal PDF: the explanation text is provisional.
  explanation: "Every friend group builds its own references, inside jokes and codes that only its members understand.",
  closingLine: "Only we know this code.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    patterns: 4, // patterns to complete
    duration: 40, // seconds to complete them
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
