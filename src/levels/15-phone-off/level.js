import { defineLevel } from "../../engine/define-level.js";

/**
 * Level 15 · Phone Off
 * Design notes, progress and decisions: README.md in this folder.
 *
 * Helena (01/11/2026): just a message on a black screen. The game asks you
 * to put it down for a while: grab a paper and a pen and write a letter to
 * someone you love. When you're back, a quiet button lets you go on.
 * There is no way to lose.
 */
export default defineLevel({
  number: 15,
  signal: "Analog gestures feel more personal",
  minigame: "Phone Off",
  explanation: "In a world of instant screens, a letter, a printed photo or a handmade gift shows time and intention. They become keepsakes.",
  closingLine: "Paper carries your pulse.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level.
  settings: {
    buttonAfterSeconds: 4, // the "keep playing" button appears after the message (Helena 01/11: it was too late at 20 s)
  },

  play(game) {
    const s = game.settings;
    game.root.innerHTML = `
      <div class="paper-time">
        <p class="message">Grab a paper and a pen<br>and write a letter<br>to someone you love.</p>
        <p class="hint">Take your time. The game will wait.</p>
        <button class="done" hidden>I wrote it, keep playing</button>
      </div>`;
    const done = game.root.querySelector(".done");
    game.after(s.buttonAfterSeconds * 1000, () => (done.hidden = false));
    game.listen(done, "pointerdown", () => game.win());
  },
});
