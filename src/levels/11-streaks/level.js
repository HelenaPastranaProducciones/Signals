import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 11 · Streaks
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 11,
  signal: "Friendship happens in the background",
  minigame: "Streaks",
  explanation: "You can feel close just by sharing a space, like staying on a Discord call while studying. Knowing someone is there is enough.",
  closingLine: "You don’t need to meet daily to be friends.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    friends: 4, // flames or plants to look after
    duration: 45, // seconds no flame may go out
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
