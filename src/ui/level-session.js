import { completeLevel } from "../game/progress.js";
import { getLevel } from "../levels/index.js";
import { startLevel, stopLevel } from "../engine/level-runner.js";
import { state } from "../state.js";
import { render } from "./render.js";

/**
 * Connects the level screen with the level runner. Registered as a render
 * hook in main.js: every redraw stops the running attempt, and if the level
 * screen is showing a playing frame afterwards, a fresh attempt starts in it.
 * That is also how "Restart" works.
 */
export const levelSession = {
  beforeRender: stopLevel,

  afterRender(app) {
    const { ui, progress } = state;
    const root = app.querySelector("#level-stage");
    if (ui.screen !== "level" || ui.levelResult || !root) return;

    const level = getLevel(ui.level);
    loadStylesheet(level.stylesheet);
    const info = app.querySelector(".hud-info");
    const time = app.querySelector(".hud-time");
    try {
      startLevel(level, {
        root,
        player: { nickname: progress.nickname, avatar: { ...progress.avatar } },
        vibration: progress.settings.vibration,
        hud: {
          setInfo: (text) => (info.textContent = text),
          setTime: (seconds) => (time.textContent = seconds === null ? "" : `⏱ ${Math.ceil(seconds)}`),
        },
        onEnd(result, message) {
          if (result === "won") completeLevel(progress, level.number);
          ui.levelResult = result;
          ui.levelMessage = message;
          render();
        },
      });
    } catch (error) {
      console.error(`Level ${level.number} crashed while starting:`, error);
      root.innerHTML = `<div class="level-error"><b>Something went wrong in this level.</b><p class="muted">The details are in the browser console.</p></div>`;
    }
  },
};

/** Adds a level's stylesheet to the page the first time the level is played. */
function loadStylesheet(href) {
  if (!href || document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.append(link);
}
