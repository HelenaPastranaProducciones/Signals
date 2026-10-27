import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 12 · Spot the Difference
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 12,
  signal: "Small things carry big meanings",
  minigame: "Spot the Difference",
  explanation: "A friendship bracelet or a handwritten note holds more meaning than it seems. Little details keep memories and affection alive.",
  closingLine: "A tiny detail can mean a lot.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    differences: 5, // differences to find
    duration: 45, // seconds to find them
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
