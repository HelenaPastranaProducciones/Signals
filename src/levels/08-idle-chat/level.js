import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 8 · Idle Chat
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 8,
  signal: "Socialising doesn’t always require energy",
  minigame: "Idle Chat",
  explanation: "Staying connected doesn’t need big plans. A meme, a quick game or a video together is enough to feel close without pressure.",
  closingLine: "You don’t need to say much to be there.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    duration: 45, // seconds the chat must stay alive
    tapEverySeconds: 5, // one tap at least this often keeps the chat going
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
