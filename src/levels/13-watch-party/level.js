import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 13 · Watch Party
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 13,
  signal: "Shared experiences don’t need shared locations",
  minigame: "Watch Party",
  explanation: "Watching a film online or playing the same game creates togetherness across distance. What matters is who you share it with, not where you are.",
  closingLine: "Each at home, yet together.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    events: 10, // moments to sync on
    syncsToWin: 8, // syncs needed to win
    syncWindowSeconds: 0.5, // time to tap both sides
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
