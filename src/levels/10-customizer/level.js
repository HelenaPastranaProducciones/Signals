import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 10 · Customizer
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 10,
  signal: "Personalisation makes things ours",
  minigame: "Customizer",
  explanation: "Stickers, charms and patches turn everyday objects into reflections of who you are and which communities you belong to.",
  closingLine: "It’s not just any object. It’s mine.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    duration: 45, // seconds to decorate (there is no way to lose)
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
