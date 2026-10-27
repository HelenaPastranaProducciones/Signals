import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 17 · Collectibles Match-3
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 17,
  signal: "The object is an excuse to connect",
  minigame: "Collectibles Match-3",
  explanation: "Cards, board games and swappable accessories give people a reason to approach each other. The value lies in the connections they make possible.",
  closingLine: "An object, and suddenly there’s something to talk about.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    crossGenerationCombosToWin: 5, // combos joining two generations needed to win
    duration: 40, // seconds to play (same as level 6, to tune)
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
