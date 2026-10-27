import { state } from "../state.js";
import { applyTheme } from "./browser.js";
import { introScreen } from "./screens/intro.js";
import { levelIntroScreen } from "./screens/level-intro.js";
import { levelScreen } from "./screens/level.js";
import { lobbyScreen } from "./screens/lobby.js";
import { mapScreen } from "./screens/map.js";
import { titleScreen } from "./screens/title.js";

const SCREENS = {
  title: titleScreen,
  intro: introScreen,
  map: (s) => (s.ui.lobbyOpen ? lobbyScreen(s) : mapScreen(s)),
  "level-intro": levelIntroScreen,
  level: levelScreen,
};

/** Floating house button that opens the lobby from the map. */
const lobbyButton = (open) =>
  `<button class="lobby-button" data-action="toggle-lobby" aria-label="${open ? "Back to map" : "Open lobby"}">${open ? "🗺️" : "🏠"}</button>`;

/** Identifies what is on screen; scroll and focus are kept while it stays the same. */
const viewKey = ({ screen, lobbyOpen, lobbyView, level, levelFinished }) =>
  [screen, lobbyOpen && lobbyView, level, levelFinished].join("|");

/** Selector that finds the same action button after the markup is rebuilt. */
function selectorFor(element) {
  const data = element?.dataset;
  if (!data?.action) return null;
  return ["action", "key", "value", "level"]
    .filter((name) => data[name] !== undefined)
    .map((name) => `[data-${name}="${CSS.escape(data[name])}"]`)
    .join("");
}

let lastView = "";

/** Redraws the whole app from `state`. Called after every action. */
export function render() {
  const app = document.getElementById("app");
  const { ui } = state;
  const view = viewKey(ui);
  const sameView = view === lastView;
  const scrollTop = sameView ? (app.querySelector("main")?.scrollTop ?? 0) : 0;
  const focus = sameView ? selectorFor(document.activeElement) : null;

  app.innerHTML = `<main>${SCREENS[ui.screen](state)}</main>${ui.screen === "map" ? lobbyButton(ui.lobbyOpen) : ""}`;

  app.querySelector("main").scrollTop = scrollTop;
  if (focus) app.querySelector(focus)?.focus({ preventScroll: true });
  applyTheme(state.progress.settings.theme);
  lastView = view;
}
