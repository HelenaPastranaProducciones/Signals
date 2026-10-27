import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 9 · The Room
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 9,
  signal: "The group chat is a place",
  minigame: "The Room",
  explanation: "Group chats are shared digital spaces where everyday life unfolds. Like a meeting place, they bring continuity and belonging even when apart.",
  closingLine: "The chat is where we meet.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    seatedToWin: 6, // friends seated to win
    leftToLose: 3, // friends leaving that make you lose
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
