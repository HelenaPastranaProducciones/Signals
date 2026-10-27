import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 3 · Spot the Impostor
 * Design notes, progress and decisions: README.md in this folder.
 */
export default defineLevel({
  number: 3,
  signal: "We don’t need everyone. We need our people",
  minigame: "Spot the Impostor",
  explanation: "Teens don’t need to fit in everywhere. They look for people who share their interests and values, and a group where they can be themselves.",
  closingLine: "You spot your people at a glance.",

  // Numbers that tune the level. First proposal from the brief: adjust while playing.
  settings: {
    groupSizeMin: 8, // fewest characters on screen
    groupSizeMax: 10, // most characters on screen
    rounds: 5, // rounds to play
    secondsPerRound: 5, // time to find the impostor each round
  },

  // play(game) { ... }  Not built yet, so the game shows a "coming soon" card.
  // To start building it, follow src/levels/README.md (step 2 copies src/levels/_template).
});
