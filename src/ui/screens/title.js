import { renderAvatar } from "../../avatar/render-avatar.js";

/** @param {import("../../state.js").state} state */
export function titleScreen({ progress }) {
  return `<div class="splash">
    <h1 class="game-title">SIGNALS</h1>
    <p class="muted">Gaming is no longer just playing</p>
    <div class="splash-avatar">${renderAvatar(progress.avatar, { pose: "hips" })}</div>
    <button class="btn" data-action="start">Play</button>
    <p class="muted hint keys-only">Press Enter</p>
  </div>`;
}
