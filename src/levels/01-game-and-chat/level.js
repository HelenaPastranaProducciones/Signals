import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 1 · Game & Chat
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 1,
  signal: "Gaming is no longer just playing",
  minigame: "Game & Chat",
  explanation: "Games like Roblox and Fortnite aren’t only about winning. They’re places where teens spend time together, share experiences and feel part of a community.",
  closingLine: "You were playing, but you were with them.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    duration: 45, // seconds you have to survive
    repliesNeeded: 3, // chat replies needed to win
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
