/**
 * Every level file (src/levels/NN-name/level.js) exports
 * `defineLevel({ ... })`. See src/levels/README.md for the full guide.
 *
 * @typedef {object} LevelDefinition
 * @property {number} number       1–19, position on the map.
 * @property {string} signal       Title of the signal.
 * @property {string} minigame     Name of the minigame (map tile, level bar).
 * @property {string} explanation  Shown on the loading screen before the level.
 * @property {string} closingLine  Shown when the level is won.
 * @property {Record<string, number | string | boolean | Array<unknown>>} [settings]
 *   Numbers and words that tune the level (time, targets, speed…). Kept apart
 *   from the code so they are easy to find and change.
 * @property {string} [stylesheet] The level's CSS, usually `new URL("./level.css", import.meta.url).href`.
 * @property {(game: import("./level-runner.js").Game) => (void | (() => void))} [play]
 *   Builds and runs the minigame. Without it the level shows a "coming soon" card.
 */

const REQUIRED_TEXT = ["signal", "minigame", "explanation", "closingLine"];

/**
 * Checks a level definition and fills in defaults.
 * @param {LevelDefinition} level
 * @returns {Readonly<LevelDefinition>}
 */
export function defineLevel(level) {
  if (!Number.isInteger(level.number)) throw new Error(`A level is missing its "number"`);
  for (const field of REQUIRED_TEXT) {
    if (typeof level[field] !== "string" || !level[field].trim()) {
      throw new Error(`Level ${level.number} is missing its "${field}" text`);
    }
  }
  if (level.play !== undefined && typeof level.play !== "function") {
    throw new Error(`Level ${level.number}: "play" must be a function`);
  }
  return Object.freeze({ settings: {}, ...level });
}
