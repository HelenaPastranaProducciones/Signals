import { INTRO_LOADING_MS, LEVEL_LOADING_MS } from "../config.js";
import { state } from "../state.js";
import { render } from "./render.js";

let loadingTimer;

/**
 * Moves to another screen. The caller renders afterwards; the fake loading
 * screens ("intro", "level-intro") then move on by themselves.
 *
 * @param {typeof state.ui.screen} screen
 * @param {number} [level] Level to load, for "level-intro".
 */
export function goTo(screen, level) {
  clearTimeout(loadingTimer);
  Object.assign(state.ui, { screen, lobbyOpen: false, levelResult: null, levelMessage: "" });
  if (level) state.ui.level = level;
  if (screen === "intro") startLoading(INTRO_LOADING_MS, "map");
  if (screen === "level-intro") startLoading(LEVEL_LOADING_MS, "level");
}

function startLoading(ms, nextScreen) {
  // Two frames: the empty bar must be painted before its width transition starts.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const bar = document.querySelector(".loader i");
    if (!bar) return;
    bar.style.transitionDuration = `${ms}ms`;
    bar.style.width = "100%";
  }));
  loadingTimer = setTimeout(() => {
    goTo(nextScreen);
    render();
  }, ms);
}
