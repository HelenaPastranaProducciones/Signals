import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 2 · Rhythm Tap
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 2,
  signal: "Music creates connection",
  minigame: "Rhythm Tap",
  explanation: "Music is a way to connect. Sharing a song or going to a concert says what’s hard to put into words and strengthens friendships.",
  closingLine: "Alone, a note. Together, a song.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    instruments: ["drums","bass","guitar","vocals"], // one lane per instrument
    hitPercentToWin: 70, // % of notes you must hit
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
