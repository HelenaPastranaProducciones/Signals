import { createPaintKit } from "../../avatar/svg-kit.js";

/**
 * Level 7's gestures: the group's little rituals, each with its colour, its
 * word and a painted drawing (flat colours, hard shadow, paint grain).
 * Each attempt picks four to start with and one more that a friend makes up.
 */

const SKIN = "#e0a77a";
const INK = "#2b2630";

/** A hand seen from the front: a palm and four fingers, the thumb out to one side. */
const palm = (k, x, y, turn = 0, colour = SKIN) =>
  `<g transform="translate(${x} ${y}) rotate(${turn})">` +
  k.clay("M-12 -2Q-13 18 0 20Q13 18 12 -2Z", colour) +
  [-9, -3, 3, 9].map((fx, i) => k.clay(`M${fx - 3} -2V${-18 + Math.abs(i - 1.5) * 3}a3 3 0 0 1 6 0V-2Z`, colour)).join("") +
  k.clay("M12 4Q22 -2 22 6Q18 12 11 12Z", colour) + `</g>`;

const DRAW = {
  highFive: (k) => palm(k, 34, 54, -18) + palm(k, 66, 54, 18, "#c98a62") +
    k.stroke("M50 18V28M40 22l4 8M60 22l-4 8", "#e9c24a", 4),
  shout: (k) => k.clay("M14 22H86Q92 22 92 30V62Q92 70 86 70H44L28 84V70H14Q8 70 8 62V30Q8 22 14 22Z", "#fff8ee") +
    `<text x="50" y="56" text-anchor="middle" font-family="Schoolbell, sans-serif" font-size="24" fill="${INK}">AYYY!</text>`,
  fistBump: (k) => k.clay("M10 40h26a10 10 0 0 1 10 10v8a10 10 0 0 1-10 10H10Z", SKIN) +
    k.clay("M90 40H64a10 10 0 0 0-10 10v8a10 10 0 0 0 10 10h26Z", "#c98a62") +
    k.stroke("M50 22V32M38 26l5 8M62 26l-5 8M50 78V88", "#e9c24a", 4),
  peace: (k) => k.clay("M36 58Q34 88 52 88Q70 88 68 58Z", SKIN) +
    k.clay("M38 60L30 18a5 5 0 0 1 10-2L48 58Z", SKIN) + k.clay("M54 58L60 16a5 5 0 0 1 10 2L64 60Z", SKIN) +
    k.stroke("M40 66h22M40 74h20", "#b0784f", 3),
  heart: (k) => k.clay("M50 84L18 52Q6 38 18 26Q32 14 50 32Q68 14 82 26Q94 38 82 52Z", "#e07aa6") +
    palm(k, 24, 70, -40) + palm(k, 76, 70, 40, "#c98a62"),
  thumbsUp: (k) => k.clay("M28 50h40a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H28Z", SKIN) +
    k.clay("M40 50L44 22a7 7 0 0 1 13 3L56 50Z", SKIN) + k.stroke("M30 62h30M30 72h28", "#b0784f", 3),
  dab: (k) => k.circle(42, 30, 12, SKIN) + k.stroke("M42 44L46 78M44 50L80 24M44 50L20 40L36 30", "#6f9fd8", 9),
  wiggle: (k) => k.circle(50, 26, 12, SKIN) + k.stroke("M50 40V70M50 48Q36 38 26 50T10 50M50 48Q64 58 74 46T90 46M50 70L40 88M50 70L60 88", "#9c8ad0", 8),
  snap: (k) => k.clay("M30 60Q30 86 52 86Q74 86 72 58L60 40H38Z", SKIN) + k.clay("M58 42L66 18a5 5 0 0 1 9 3L68 46Z", SKIN) +
    k.stroke("M80 20l8-6M84 30h10M78 10l2-8", "#e9c24a", 4),
};

/** Every gesture the group might have: its word, colour and drawing. */
export const GESTURES = [
  { id: "highFive", word: "HIGH FIVE", colour: "#e2a04a" },
  { id: "shout", word: "AYYY!", colour: "#d9573f" },
  { id: "fistBump", word: "FIST BUMP", colour: "#6f9fd8" },
  { id: "peace", word: "PEACE", colour: "#6fbf8c" },
  { id: "heart", word: "HEART HANDS", colour: "#e07aa6" },
  { id: "thumbsUp", word: "THUMBS UP", colour: "#e9c24a" },
  { id: "dab", word: "THE DAB", colour: "#5f9a5c" },
  { id: "wiggle", word: "THE WIGGLE", colour: "#9c8ad0" },
  { id: "snap", word: "SNAP", colour: "#c0577a" },
];

let count = 0;
/** The painted drawing of one gesture. */
export function gestureSvg(gesture) {
  const k = createPaintKit(`level-07-gesture-${++count}`, { grain: 1.3, wobble: 1.6 });
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${k.defs()}<g filter="url(#${k.ids.paint})">${DRAW[gesture.id](k)}</g></svg>`;
}
