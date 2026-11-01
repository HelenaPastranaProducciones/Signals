import { getLevel, TOTAL_LEVELS } from "../../levels/index.js";
import { SHOW_SKIP_BUTTON } from "../../config.js";
import { JOURNAL_SECTIONS, SIGNAL_JOURNAL } from "../../data/signal-journal.js";
import { signalPicture } from "../../data/signal-pictures.js";
import { loader } from "../components.js";
import { pad } from "../html.js";

/**
 * Loading screen before a level: the signal's number and title, a painted
 * picture of it and its Signals Journal explanation (Helena, 01/11/2026).
 * There's a lot to read, so it doesn't move on by itself: once the bar is
 * full, a Play button appears (navigation.js adds `.ready`).
 */
export function levelIntroScreen({ ui }) {
  const level = getLevel(ui.level);
  const journal = SIGNAL_JOURNAL[level.number];
  const text = journal
    ? `<dl class="journal">${JOURNAL_SECTIONS.map(([key, label]) => `<div><dt>${label}</dt><dd>${journal[key]}</dd></div>`).join("")}</dl>`
    : `<p>${level.explanation}</p>`;
  return `<div class="splash signal-splash">
    <div class="signal-head">
      <span class="tag">Signal ${pad(level.number)} / ${TOTAL_LEVELS}</span>
      <h1 class="signal-title">${level.signal}</h1>
    </div>
    <div class="signal-body">
      <figure class="signal-figure">${signalPicture(level.number)}</figure>
      ${text}
    </div>
    <div class="signal-go">
      ${loader()}
      <button class="btn play-signal" data-action="skip">Play</button>
      ${SHOW_SKIP_BUTTON ? `<button class="btn btn-secondary skip-button" data-action="skip">Skip</button>` : ""}
    </div>
  </div>`;
}
