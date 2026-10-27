import { getLevel, TOTAL_LEVELS } from "../../data/levels.js";
import { SHOW_SKIP_BUTTON } from "../../config.js";
import { loader } from "../components.js";
import { pad } from "../html.js";

/** Fake loading screen before a level: signal number, title and explanation. */
export function levelIntroScreen({ ui }) {
  const level = getLevel(ui.level);
  return `<div class="splash">
    <span class="tag">Signal ${pad(level.number)} / ${TOTAL_LEVELS}</span>
    <h1 class="signal-title">${level.signal}</h1>
    <p>${level.explanation}</p>
    ${loader()}
    ${SHOW_SKIP_BUTTON ? `<button class="btn btn-secondary skip-button" data-action="skip">Skip</button>` : ""}
  </div>`;
}
