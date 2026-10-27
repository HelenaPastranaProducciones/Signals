/** Randomness helpers for minigames. */

/** Whole number between min and max, both included. */
export const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

/** Decimal number between min (included) and max (excluded). */
export const randomBetween = (min, max) => min + Math.random() * (max - min);

/** One random item of a list. */
export const pick = (list) => list[Math.floor(Math.random() * list.length)];

/** A shuffled copy of a list (the original is left untouched). */
export function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** True with the given probability (0–1). */
export const chance = (probability) => Math.random() < probability;
