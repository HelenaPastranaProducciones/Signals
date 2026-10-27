import { createProgress } from "./game/progress.js";

/**
 * The running game's state.
 * - `progress`: what the player earned and chose (to be saved, see progress.js).
 * - `ui`: where the player is right now; never saved.
 */
export const state = {
  progress: createProgress(),
  ui: {
    /** @type {"title" | "intro" | "map" | "level-intro" | "level"} */
    screen: "title",
    /** Level being loaded or played. */
    level: 1,
    /** Whether the current level shows its completion card. */
    levelFinished: false,
    /** The lobby opens over the map from the floating house button. */
    lobbyOpen: false,
    /** @type {"main" | "avatar" | "options"} */
    lobbyView: "main",
    /** Category tab selected in the avatar editor. */
    avatarCategory: "skin",
    /** "Reset progress" needs a second click to confirm. */
    confirmingReset: false,
  },
};
