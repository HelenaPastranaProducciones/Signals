import { unlocksForLevel } from "../../data/avatar-catalog.js";
import { getLevel, TOTAL_LEVELS } from "../../data/levels.js";
import { screenHeader } from "../components.js";
import { pad } from "../html.js";

/** Shown when a level is completed: closing line, unlocked pieces and where to go next. */
function completionCard(level) {
  const unlocked = unlocksForLevel(level.number);
  const next = level.number < TOTAL_LEVELS
    ? `<button class="btn btn-secondary" data-action="open-level" data-level="${level.number + 1}">Next signal</button>`
    : "";
  return `<span class="tag">Level complete</span>
    <h2 class="card-title">“${level.closingLine}”</h2>
    <p class="muted">Unlocked: ${unlocked.length ? unlocked.join(", ") : "nothing new"}</p>
    <div class="button-row"><button class="btn" data-action="to-map">Back to map</button>${next}</div>`;
}

/** Stand-in until the minigame engine exists (see CLAUDE.md, pending work). */
function minigamePlaceholder(level) {
  return `<span class="tag">${level.minigame}</span>
    <h2 class="card-title">Mini-game coming soon</h2>
    <p class="muted">This is where “${level.minigame}” will be played. For now you can simulate finishing it.</p>
    <div class="button-row"><button class="btn" data-action="complete-level">Complete (demo)</button><button class="btn btn-secondary" data-action="to-map">Back</button></div>`;
}

/** @param {import("../../state.js").state} state */
export function levelScreen({ ui }) {
  const level = getLevel(ui.level);
  return screenHeader(`${pad(level.number)} · ${level.signal}`) +
    `<div class="card level-card">${ui.levelFinished ? completionCard(level) : minigamePlaceholder(level)}</div>`;
}
