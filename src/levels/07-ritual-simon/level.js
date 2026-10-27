import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 7 · Ritual Simon
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 7,
  signal: "Belonging comes from rituals",
  minigame: "Ritual Simon",
  explanation: "Small repeated actions become rituals: a song every morning, playing at the same time, the same photo. They build shared memories and identity.",
  closingLine: "We do it this way because we always have.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    maxSequence: 6, // the sequence grows one gesture per round up to this length
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
