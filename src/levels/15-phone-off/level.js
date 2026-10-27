import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 15 · Phone Off
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 15,
  signal: "Analog gestures feel more personal",
  minigame: "Phone Off",
  explanation: "In a world of instant screens, a letter, a printed photo or a handmade gift shows time and intention. They become keepsakes.",
  closingLine: "Paper carries your pulse.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {},

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
