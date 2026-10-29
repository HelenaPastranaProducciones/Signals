import { randomBetween, shuffle } from "../engine/random.js";

/**
 * Shared parts of the "odd one out" levels (3 Spot the Impostor, 18 Odd One
 * Out): spreading a group over a scene, and the hearts (mistakes allowed,
 * with a short grace after each lost heart so one slip can't snowball).
 */

/**
 * Places `count` people over a floor seen in perspective, in rows, with a
 * little disorder so it doesn't look like a grid. Positions are percentages
 * of the scene: `x` across, `y` where the feet touch the floor (further back
 * is higher up). `depth` goes from 0 (back row) to 1 (front row).
 *
 * @param {number} count
 * @param {{ top?: number, bottom?: number, left?: number, right?: number }} [floor]  Edges of the floor, in %.
 * @returns {{ x: number, y: number, depth: number }[]} In random order.
 */
export function spreadOut(count, { top = 48, bottom = 92, left = 8, right = 92 } = {}) {
  const rows = count <= 5 ? 2 : 3;
  const spots = [];
  for (let row = 0; row < rows; row += 1) {
    // Back rows hold a few more people than front rows, which take more room.
    const inRow = Math.round(count / rows) + (row === 0 && count % rows ? 1 : 0);
    const depth = rows === 1 ? 1 : row / (rows - 1);
    for (let i = 0; i < inRow && spots.length < count; i += 1) {
      const step = (right - left) / inRow;
      spots.push({
        x: left + step * (i + 0.5) + randomBetween(-step * 0.22, step * 0.22) + (row % 2 ? step * 0.25 : 0),
        y: top + (bottom - top) * depth + randomBetween(-2, 2),
        depth,
      });
    }
  }
  while (spots.length < count) spots.push({ x: randomBetween(left, right), y: bottom, depth: 1 });
  return shuffle(spots);
}

/**
 * The hearts in the corner of the stage. `lose()` takes one heart, unless a
 * heart was lost less than `graceSeconds` ago; it returns true once the
 * player has no mistakes left (time to call `game.lose`).
 *
 * @param {HTMLElement} box  Where the hearts are drawn.
 * @param {{ mistakesAllowed: number, graceSeconds: number }} options
 */
export function createLives(box, { mistakesAllowed, graceSeconds }) {
  box.classList.add("ooo-lives");
  box.innerHTML = "<b>♥</b>".repeat(mistakesAllowed);
  const hearts = [...box.querySelectorAll("b")];
  let mistakes = 0;
  let safeUntil = -Infinity;
  return {
    get mistakes() {
      return mistakes;
    },
    lose() {
      const now = performance.now() / 1000;
      if (now < safeUntil) return false;
      safeUntil = now + graceSeconds;
      mistakes += 1;
      hearts[mistakesAllowed - mistakes]?.classList.add("lost");
      box.classList.remove("recovering");
      void box.offsetWidth;
      box.classList.add("recovering");
      return mistakes > mistakesAllowed;
    },
  };
}
