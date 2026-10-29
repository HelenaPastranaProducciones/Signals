import { unlocksForLevel } from "../../data/avatar-catalog.js";
import { getLevel, TOTAL_LEVELS } from "../../levels/index.js";
import { screenHeader } from "../components.js";
import { pad } from "../html.js";

/**
 * The level screen has four states:
 * - playing: a frame with the level bar and an empty stage. The minigame
 *   draws itself into the stage (src/ui/level-session.js starts it);
 * - won: closing line, unlocked pieces and where to go next;
 * - won / lost: while playing, `resultOverlay` is laid over the frozen game
 *   (see src/ui/level-session.js). The cards below are used when the screen
 *   is redrawn afterwards, and for levels without a minigame;
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

function wonCard(level, { tag = true } = {}) {
  const unlocked = unlocksForLevel(level.number);
  const next = level.number < TOTAL_LEVELS
    ? `<button class="btn btn-secondary" data-action="open-level" data-level="${level.number + 1}">Next signal</button>`
    : "";
  const playAgain = level.play ? `<button class="btn btn-secondary" data-action="restart-level">Play again</button>` : "";
  return `${tag ? `<span class="tag">Level complete</span>` : ""}
    <h2 class="card-title">“${level.closingLine}”</h2>
    <p class="muted">Unlocked: ${unlocked.length ? unlocked.join(", ") : "nothing new"}</p>
    <div class="button-row"><button class="btn" data-action="to-map">Back to map</button>${next}${playAgain}</div>`;
}

function lostCard(message, { tag = true } = {}) {
  return `${tag ? `<span class="tag">Not this time</span>` : ""}
    <h2 class="card-title">${message || "So close! Want another go?"}</h2>
    <div class="button-row"><button class="btn" data-action="restart-level">Try again</button><button class="btn btn-secondary" data-action="to-map">Back to map</button></div>`;
}

/** Confetti pieces scattered in place, speed and colour (the same every time). */
function confettiPieces(count) {
  return Array.from({ length: count }, (_, i) => {
    const spread = (i * 61) % 100;
    return `<i style="left:${spread}%;background:hsl(${(i * 137) % 360} 90% 65%);` +
      `animation-duration:${(2 + ((i * 7) % 10) / 6).toFixed(2)}s;animation-delay:-${((i * 13) % 30) / 10}s"></i>`;
  }).join("");
}

/** A big title whose letters drop in one by one. */
const bouncyTitle = (text) =>
  [...text].map((char, i) => `<span style="--i:${i}">${char === " " ? "&nbsp;" : char}</span>`).join("");

/**
 * Shown over the frozen game when an attempt ends: a big title drops in
 * ("Game over" or "Level complete", with confetti), then a card with the
 * level's message or closing line and where to go next.
 *
 * @param {import("../../engine/define-level.js").LevelDefinition} level
 * @param {"won" | "lost"} result
 * @param {string} [message]  The level's message when lost.
 */
export function resultOverlay(level, result, message) {
  const won = result === "won";
  const confetti = won ? `<div class="confetti" aria-hidden="true">${confettiPieces(36)}</div>` : "";
  const card = won ? wonCard(level, { tag: false }) : lostCard(message, { tag: false });
  return `<div class="result-overlay ${won ? "is-won" : "is-lost"}" role="dialog" aria-modal="true" aria-labelledby="result-title">
    ${confetti}
    <div class="result-title" id="result-title">${bouncyTitle(won ? "LEVEL COMPLETE" : "GAME OVER")}</div>
    <div class="result-card">${card}</div>
  </div>`;
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
