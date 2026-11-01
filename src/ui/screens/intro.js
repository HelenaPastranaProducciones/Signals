import { loader } from "../components.js";

/**
 * Opening loading screen: what the Signals Journal is and why it is a video
 * game (Helena, 01/11/2026). There's text to read, so it waits for the
 * Continue button once the bar is full (navigation.js adds `.ready`).
 */
export function introScreen() {
  return `<div class="splash intro-splash">
    <span class="tag">Loading</span>
    <h1>SIGNALS JOURNAL</h1>
    <p>A signal is a small, real behaviour that hints at a cultural change. This journal collects 19 signals about how teenagers connect today: friendship, culture, belonging, objects and networks.</p>
    <p><b>Why a video game?</b> My final degree project is about teenagers in hospital. To design for them, I first went looking for signals of how teens live and connect, and so many of them happen while playing. So the journal became what it talks about: a game, where every level is a signal you can play.</p>
    <p class="intro-motto">Gaming is no longer just playing.</p>
    <div class="signal-go">
      ${loader()}
      <button class="btn play-signal" data-action="continue-intro">Continue</button>
    </div>
  </div>`;
}
