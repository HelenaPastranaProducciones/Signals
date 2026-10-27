import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 5 · Feed to Canvas
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 5,
  signal: "From consumer to creator",
  minigame: "Feed to Canvas",
  explanation: "Teens don’t just consume content, they create, remix and share it. Creativity is a way to express identity and connect.",
  closingLine: "One day you went from watching to making.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    paletteColours: 8, // colours on the pixel-art palette
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
