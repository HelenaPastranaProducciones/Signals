import {
  completeLevel, isLevelAvailable, normalizeNickname, randomizeAvatar, resetProgress, setAvatarPart, setNickname,
} from "../game/progress.js";
import { state } from "../state.js";
import { nextTheme, toggleFullscreen } from "./browser.js";
import { goTo } from "./navigation.js";
import { render } from "./render.js";

const { progress, ui } = state;

/**
 * What each `data-action` button does. Handlers receive the button's dataset
 * (`key`, `value`, `level` as strings) and only change state; `runAction`
 * renders afterwards.
 */
const ACTIONS = {
  start: () => goTo("intro"),
  "open-level": ({ level }) => {
    if (isLevelAvailable(progress, Number(level))) goTo("level-intro", Number(level));
  },
  skip: () => goTo("level"),
  "to-map": () => goTo("map"),
  "complete-level": () => {
    completeLevel(progress, ui.level);
    ui.levelFinished = true;
  },

  "toggle-lobby": () => {
    ui.lobbyOpen = !ui.lobbyOpen;
    ui.lobbyView = "main";
  },
  "lobby-view": ({ key }) => {
    ui.lobbyView = key;
  },
  "avatar-category": ({ key }) => {
    ui.avatarCategory = key;
  },
  "avatar-part": ({ key, value }) => setAvatarPart(progress, key, value),
  "randomize-avatar": () => randomizeAvatar(progress),

  "toggle-sound": () => {
    progress.settings.sound = !progress.settings.sound;
  },
  "toggle-vibration": () => {
    progress.settings.vibration = !progress.settings.vibration;
  },
  "toggle-fullscreen": toggleFullscreen,
  "toggle-theme": () => {
    progress.settings.theme = nextTheme(progress.settings.theme);
  },
  "reset-progress": () => {
    if (ui.confirmingReset) resetProgress(progress);
    ui.confirmingReset = !ui.confirmingReset;
  },
};

/** @param {string} name  @param {DOMStringMap} [data] */
export function runAction(name, data = {}) {
  const action = ACTIONS[name];
  if (!action) return;
  // Any other action cancels a pending "click again to reset".
  if (name !== "reset-progress") ui.confirmingReset = false;
  action(data);
  render();
}

/** Esc goes back one step: lobby sub-screen → lobby → map, and level → map. */
function goBack() {
  if (ui.lobbyOpen) runAction(ui.lobbyView === "main" ? "toggle-lobby" : "lobby-view", { key: "main" });
  else if (ui.screen === "level" || ui.screen === "level-intro") runAction("to-map");
}

export function bindEvents() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (button) runAction(button.dataset.action, button.dataset);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && ui.screen === "title") runAction("start");
    else if (event.key === "Escape") goBack();
  });

  // Typing the nickname updates state without re-rendering, so the input keeps focus.
  document.addEventListener("input", (event) => {
    if (event.target.id === "nickname") setNickname(progress, event.target.value);
  });
  document.addEventListener("change", (event) => {
    if (event.target.id !== "nickname") return;
    normalizeNickname(progress);
    event.target.value = progress.nickname;
  });
}
