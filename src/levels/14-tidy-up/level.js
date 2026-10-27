import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 14 · Tidy Up
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 14,
  signal: "Curation is a form of self-expression",
  minigame: "Tidy Up",
  explanation: "Teens express identity through what they collect and save: boards, playlists, moodboards. Choosing references builds a visual language of who they are.",
  closingLine: "What you leave out says who you are, too.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    objectsMin: 10, // fewest objects that appear
    objectsMax: 12, // most objects that appear
    shelfSlots: 5, // objects that fit on the shelf
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
