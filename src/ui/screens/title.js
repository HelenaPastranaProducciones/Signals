import { renderAvatar } from "../../avatar/render-avatar.js";

/** @param {import("../../state.js").state} state */
export function titleScreen({ progress }) {
  return `<div class="splash">
    <h1 class="game-title">SIGNALS</h1>
    <p class="muted">Gaming is no longer just playing</p>
    <div class="splash-avatar">${renderAvatar(progress.avatar)}</div>
    <button class="btn" data-action="start">Play</button>
    <p class="muted hint">Press Enter</p>
  </div>`;
}
