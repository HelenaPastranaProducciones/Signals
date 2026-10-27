import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 16 · Most Likely To
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 16,
  signal: "There are different levels of being social",
  minigame: "Most Likely To",
  explanation: "Being social is a spectrum, from viewing a story or sending an emoji to a deep talk or meeting in person. Everyone connects at their own pace.",
  closingLine: "We don’t all speak alike. We all mean the same.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {},

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
