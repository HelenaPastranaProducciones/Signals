/** Tunable values. Durations come from the project brief. */

/** Fake loading screen shown once after the title screen. */
export const INTRO_LOADING_MS = 7000;

/** Fake loading screen shown before every level. */
export const LEVEL_LOADING_MS = 5000;

/** The brief keeps a Skip button on level loading screens during development. */
export const SHOW_SKIP_BUTTON = true;

// Empty until the player writes a name: the lobby's name field shows "Name" (Helena, 31/10/2026).
export const DEFAULT_NICKNAME = "";
/** What levels show above the player when no name was written. */
export const NAMELESS = "You";
export const NICKNAME_MAX_LENGTH = 14;

/** Every level open on the map for everyone (Helena, 02/11/2026). Set to false to open them in order again, with only level 1 at the start. */
export const UNLOCK_ALL_LEVELS = true;
