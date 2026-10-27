import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 6 · Club Crest Match-3
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 6,
  signal: "Fandoms turn interests into communities",
  minigame: "Club Crest Match-3",
  explanation: "Being a fan means connecting with people who share your passion, through inside jokes, theories and fan art, even without ever meeting.",
  closingLine: "A shared interest, and we’re a community.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    duration: 40, // seconds to play
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
