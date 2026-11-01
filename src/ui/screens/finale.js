import { renderAvatar } from "../../avatar/render-avatar.js";
import { TOTAL_LEVELS } from "../../levels/index.js";
import { bouncyTitle, confettiPieces } from "./level.js";

/**
 * The end of the game (Helena, 01/11/2026): after the last signal, a big
 * "you finished it" with your avatar celebrating, then back to the map.
 */
export function finaleScreen({ progress }) {
  return `<div class="splash finale">
    <div class="confetti" aria-hidden="true">${confettiPieces(48)}</div>
    <span class="tag">Signals Journal</span>
    <div class="result-title finale-title">${bouncyTitle("YOU DID IT!")}</div>
    <div class="splash-avatar finale-avatar">${renderAvatar(progress.avatar, { pose: "wave" })}</div>
    <p class="finale-count">${Math.min(progress.completed, TOTAL_LEVELS)} / ${TOTAL_LEVELS} signals played</p>
    <p>You’ve been through every signal: chats, songs, rituals, objects and friends. That’s how teens connect today.</p>
    <p class="intro-motto">Gaming is no longer just playing.</p>
    <div class="button-row"><button class="btn" data-action="to-map">Back to map</button><button class="btn btn-secondary" data-action="open-lobby">Lobby</button></div>
  </div>`;
}
