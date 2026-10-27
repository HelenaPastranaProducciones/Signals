import { defineLevel } from "../../engine/define-level.js";
import { randomInt } from "../../engine/random.js";

/**
 * TEMPLATE: a tiny working minigame ("pop the bubbles") that shows how a
 * level uses the game toolbox. It is not part of the game. To start building
 * a level, copy `play`, `stylesheet` and level.css from here into the
 * level's folder, then change them to the agreed idea.
 * When copying level.css, replace `.level-00` with the level's class (e.g. `.level-07`).
 */
export default defineLevel({
  number: 0,
  signal: "Template signal",
  minigame: "Pop the bubbles",
  explanation: "Template explanation.",
  closingLine: "Template closing line.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  settings: {
    duration: 20, // seconds to play
    bubblesToWin: 10, // bubbles to pop before the time runs out
    secondsBetweenBubbles: 0.8, // how often a new bubble appears
    bubbleLifetime: 2.5, // seconds before a bubble disappears by itself
  },

  play(game) {
    const { duration, bubblesToWin, secondsBetweenBubbles, bubbleLifetime } = game.settings;
    let popped = 0;

    // 1. Draw the starting scene inside game.root.
    game.root.innerHTML = `
      <div class="board">
        <div class="me">${game.avatar()}<span>${game.player.nickname}</span></div>
      </div>`;
    const board = game.root.querySelector(".board");
    const showScore = () => game.showInfo(`Popped ${popped} / ${bubblesToWin}`);
    showScore();

    // 2. Things that happen over time: a new bubble every few seconds.
    game.every(secondsBetweenBubbles * 1000, () => {
      const bubble = document.createElement("button");
      bubble.className = "bubble";
      bubble.setAttribute("aria-label", "Bubble");
      bubble.style.left = `${randomInt(5, 85)}%`;
      bubble.style.top = `${randomInt(5, 75)}%`;
      board.append(bubble);
      game.after(bubbleLifetime * 1000, () => bubble.remove());
    });

    // 3. What the player does: tap or click a bubble to pop it.
    game.listen(board, "pointerdown", (event) => {
      const bubble = event.target.closest(".bubble");
      if (!bubble) return;
      bubble.remove();
      popped += 1;
      showScore();
      game.vibrate();
      if (popped >= bubblesToWin) game.win();
    });

    // 4. How it ends: win above; lose when the clock reaches zero.
    game.countdown(duration, () => game.lose("Time's up! Try again."));
  },
});
