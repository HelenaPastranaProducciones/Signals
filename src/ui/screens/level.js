import { unlocksForLevel } from "../../data/avatar-catalog.js";
import { getLevel, TOTAL_LEVELS } from "../../levels/index.js";
import { screenHeader } from "../components.js";
import { pad } from "../html.js";

/**
 * The level screen has four states:
 * - playing: a frame with the level bar and an empty stage. The minigame
 *   draws itself into the stage (src/ui/level-session.js starts it);
 * - won: closing line, unlocked pieces and where to go next;
 * - lost: the level's message and "Try again";
 * - not built yet (no `play`): a "coming soon" card with a demo button.
 */

/** Level bar on top of the stage: name, the level's info and clock, restart and exit. */
function playingFrame(level) {
  return `<div class="level-frame">
    <div class="level-bar">
      <span class="tag">${pad(level.number)} · ${level.minigame}</span>
      <div class="level-hud" aria-live="polite"><span class="hud-info"></span><span class="hud-time"></span></div>
      <div class="level-controls">
        <button class="btn btn-secondary btn-small" data-action="restart-level">↺ Restart</button>
        <button class="btn btn-secondary btn-small" data-action="to-map">✕ Exit</button>
      </div>
    </div>
    <div class="level-stage level-${pad(level.number)}" id="level-stage"></div>
  </div>`;
}

function wonCard(level) {
  const unlocked = unlocksForLevel(level.number);
  const next = level.number < TOTAL_LEVELS
    ? `<button class="btn btn-secondary" data-action="open-level" data-level="${level.number + 1}">Next signal</button>`
    : "";
  const playAgain = level.play ? `<button class="btn btn-secondary" data-action="restart-level">Play again</button>` : "";
  return `<span class="tag">Level complete</span>
    <h2 class="card-title">“${level.closingLine}”</h2>
    <p class="muted">Unlocked: ${unlocked.length ? unlocked.join(", ") : "nothing new"}</p>
    <div class="button-row"><button class="btn" data-action="to-map">Back to map</button>${next}${playAgain}</div>`;
}

function lostCard(message) {
  return `<span class="tag">Not this time</span>
    <h2 class="card-title">${message || "So close! Want another go?"}</h2>
    <div class="button-row"><button class="btn" data-action="restart-level">Try again</button><button class="btn btn-secondary" data-action="to-map">Back to map</button></div>`;
}

/** Stand-in for levels whose minigame is not built yet. */
function comingSoonCard(level) {
  return `<span class="tag">${level.minigame}</span>
    <h2 class="card-title">Mini-game coming soon</h2>
    <p class="muted">This is where “${level.minigame}” will be played. For now you can simulate finishing it.</p>
    <div class="button-row"><button class="btn" data-action="complete-level">Complete (demo)</button><button class="btn btn-secondary" data-action="to-map">Back</button></div>`;
}

/** @param {import("../../state.js").state} state */
export function levelScreen({ ui }) {
  const level = getLevel(ui.level);
  if (!ui.levelResult && level.play) return playingFrame(level);
  const card = ui.levelResult === "won" ? wonCard(level)
    : ui.levelResult === "lost" ? lostCard(ui.levelMessage)
    : comingSoonCard(level);
  return screenHeader(`${pad(level.number)} · ${level.signal}`) + `<div class="card level-card">${card}</div>`;
}
