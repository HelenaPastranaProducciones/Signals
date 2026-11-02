import { signalPicture } from "../../data/signal-pictures.js";
import { shuffle } from "../../engine/random.js";
import { pad } from "../html.js";

// The title shows signals, not the avatar (Helena, 01/11/2026): a fan of five
// signal polaroids, picked at random once per visit so it stays still on redraws.
const FEATURED = shuffle(Array.from({ length: 19 }, (_, i) => i + 1)).slice(0, 5);

/** @param {import("../../state.js").state} state */
export function titleScreen() {
  return `<div class="splash">
    <h1 class="game-title">SIGNALS</h1>
    <p class="muted">Gaming is no longer just playing</p>
    <div class="title-collage" aria-hidden="true">
      ${FEATURED.map((n, i) => `<figure style="--i:${i - 2}">${signalPicture(n)}<figcaption>Signal ${pad(n)}</figcaption></figure>`).join("")}
    </div>
    <button class="btn" data-action="start">Play</button>
    <p class="muted hint keys-only">Press Enter</p>
    <p class="title-credit">A project by <b>Helena Pastrana</b></p>
  </div>`;
}
