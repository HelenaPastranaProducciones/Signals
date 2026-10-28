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
    /** Result of the current attempt: null while playing, then "won" or "lost". */
    levelResult: null,
    /** Message the level gave when it was lost (e.g. "Time's up!"). */
    levelMessage: "",
    /** The lobby opens over the map from the floating house button. */
    lobbyOpen: false,
    /** @type {"main" | "avatar" | "options"} */
    lobbyView: "main",
    /** Category tab selected in the avatar editor. */
    avatarCategory: "face",
    /** "Reset progress" needs a second click to confirm. */
    confirmingReset: false,
    /** Test mode (address ending in ?test or ?level=N): every level is open. */
    testMode: false,
  },
};
