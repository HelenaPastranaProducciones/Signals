import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 19 · Jigsaw
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 19,
  signal: "Digital culture leaves physical traces",
  minigame: "Jigsaw",
  // The PDF cuts the title off at "...leaves physical"; "traces" was added.
  explanation: "Online moments, memes and conversations can become physical objects: printed screenshots, meme stickers, photos. They give digital life a lasting presence.",
  closingLine: "Digital leaves a trace too.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    duration: 60, // seconds to finish the puzzle
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
