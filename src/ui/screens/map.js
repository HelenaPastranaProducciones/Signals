import { LEVELS, TOTAL_LEVELS } from "../../levels/index.js";
import { isLevelAvailable } from "../../game/progress.js";
import { progressBar, screenHeader } from "../components.js";

/** Pastel backgrounds for the level tiles, repeated in order. */
const TILE_COLOURS = ["#ffd9c7", "#d8e6ff", "#dff5d6", "#f6d8f0", "#fff0b8", "#d6f1f1"];

function levelTile(level, progress, testMode) {
  const locked = !testMode && !isLevelAvailable(progress, level.number);
  const done = level.number <= progress.completed;
  const status = locked ? ", locked" : done ? ", completed" : "";
  return `<button class="level-tile${locked ? " is-locked" : ""}${done ? " is-done" : ""}"
    style="background:${TILE_COLOURS[(level.number - 1) % TILE_COLOURS.length]}" ${locked ? "disabled" : ""}
    data-action="open-level" data-level="${level.number}" aria-label="Signal ${level.number}: ${level.minigame}${status}">
    <b>${locked ? "🔒" : level.number}</b>${level.minigame}</button>`;
}

/** @param {import("../../state.js").state} state */
export function mapScreen({ progress, ui }) {
  const summary = `<div class="map-progress"><b>${progress.completed} / ${TOTAL_LEVELS} completed</b>${progressBar(progress.completed)}</div>`;
  const testNotice = ui.testMode ? `<p class="test-notice"><span class="tag">Test mode</span> Every level is open.</p>` : "";
  return screenHeader("Choose a signal", summary) + testNotice +
    `<div class="level-grid">${LEVELS.map((level) => levelTile(level, progress, ui.testMode)).join("")}</div>`;
}
