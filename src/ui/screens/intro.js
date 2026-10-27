import { loader } from "../components.js";

/** Fake loading screen with the game concept. The text is provisional (see CLAUDE.md, open questions). */
export function introScreen() {
  return `<div class="splash">
    <span class="tag">Loading</span>
    <h1>SIGNALS</h1>
    <p>Signals is a collection of 19 mini-games about how teens connect today. Each level is a signal: a small truth about friendship, culture and belonging.</p>
    ${loader()}
  </div>`;
}
