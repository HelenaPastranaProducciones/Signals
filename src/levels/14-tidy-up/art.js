import { createPaintKit } from "../../avatar/svg-kit.js";

/**
 * Level 14's things: everyday objects a teen might put on a shelf, painted
 * like the avatar. Each one says something about you (`style`); the shelf's
 * label comes from the style you pick most. Drawn in a 100 × 100 box.
 */

const INK = "#2b2630";

export const THINGS = [
  { id: "vinyl", name: "Vinyl", style: "music", draw: (k) => k.clay("M50 14a36 36 0 1 0 .1 0Z", "#26252f") + k.circle(50, 50, 12, "#e07aa6") + k.circle(50, 50, 3, "#26252f") },
  { id: "headphones", name: "Headphones", style: "music", draw: (k) => k.stroke("M22 60Q22 18 50 18Q78 18 78 60", "#5c6270", 8) + k.clay("M14 54h20v30H14Z", "#6f9fd8") + k.clay("M66 54h20v30H66Z", "#6f9fd8") },
  { id: "guitar", name: "Mini guitar", style: "music", draw: (k) => `<g transform="rotate(-35 50 50)">${k.clay("M46 8h8v46h-8Z", "#7a5238")}${k.clay("M50 50C68 50 74 62 70 74C66 90 34 90 30 74C26 62 32 50 50 50Z", "#e2a04a")}${k.circle(50, 68, 6, INK)}</g>` },
  { id: "controller", name: "Controller", style: "gamer", draw: (k) => k.clay("M16 40Q50 30 84 40Q96 70 80 74Q68 76 62 64H38Q32 76 20 74Q4 70 16 40Z", "#3a3d48") + k.stroke("M28 50h12M34 44v12", "#f1ece4", 4) + k.circle(66, 48, 4, "#d9573f") + k.circle(74, 54, 4, "#6fbf8c") },
  { id: "console", name: "Handheld", style: "gamer", draw: (k) => k.clay("M8 30h84v42H8Z", "#9c8ad0") + k.path("M30 36h40v30H30Z", "#7cf0b0") + k.stroke("M14 50h10M19 45v10", INK, 3) + k.circle(82, 48, 3.5, INK) },
  { id: "dice", name: "Dice", style: "gamer", draw: (k) => k.clay("M24 24h52v52H24Z", "#fbf6ee") + [[36, 36], [64, 36], [50, 50], [36, 64], [64, 64]].map(([x, y]) => k.circle(x, y, 4, INK)).join("") },
  { id: "sketchbook", name: "Sketchbook", style: "creative", draw: (k) => k.clay("M18 14h64v72H18Z", "#d9573f") + k.path("M28 26h44v34H28Z", "#fbf6ee") + k.stroke("M32 52Q42 34 52 46T68 36", "#6f9fd8", 3) },
  { id: "palette", name: "Paints", style: "creative", draw: (k) => k.clay("M50 16C80 16 90 40 84 56C80 66 66 60 62 68C58 78 66 86 50 86C24 86 12 66 14 48C16 30 30 16 50 16Z", "#e9c24a") + [[34, 36, "#d9573f"], [52, 30, "#6f9fd8"], [68, 40, "#6fbf8c"], [32, 58, "#9c8ad0"]].map(([x, y, c]) => k.circle(x, y, 6, c)).join("") },
  { id: "camera", name: "Film camera", style: "creative", draw: (k) => k.clay("M10 32h80v46H10Z", "#5c6270") + k.clay("M22 24h18v10H22Z", INK) + k.circle(50, 55, 16, INK) + k.circle(50, 55, 9, "#6f9fd8") },
  { id: "football", name: "Football", style: "sporty", draw: (k) => k.clay("M50 14a36 36 0 1 0 .1 0Z", "#fbf6ee") + k.path("M50 36l12 9-5 14H43l-5-14Z", INK) },
  { id: "sneaker", name: "Sneaker", style: "sporty", draw: (k) => k.clay("M10 66Q10 42 30 44L56 52Q86 56 90 70V78H10Z", "#d9573f") + k.clay("M8 74H92V84H8Z", "#fbf6ee") + k.stroke("M40 50l6 10M50 52l6 10", "#fbf6ee", 3) },
  { id: "trophy", name: "Trophy", style: "sporty", draw: (k) => k.clay("M30 18h40v22Q70 58 50 58Q30 58 30 40Z", "#e9c24a") + k.stroke("M30 26Q14 26 18 40Q22 48 32 46M70 26Q86 26 82 40Q78 48 68 46", "#e9c24a", 5) + k.clay("M44 58h12v14H44Z", "#e2a04a") + k.clay("M32 72h36v10H32Z", "#7a5238") },
  { id: "book", name: "Novel", style: "bookworm", draw: (k) => k.clay("M20 14h56v74H20Z", "#2f7f7a") + k.path("M20 14h8v74h-8Z", INK, 'opacity=".25"') + k.stroke("M36 30h30M36 38h24", "#f1ece4", 3) },
  { id: "glasses", name: "Reading glasses", style: "bookworm", draw: (k) => k.stroke("M14 52a14 14 0 1 0 28 0a14 14 0 1 0-28 0ZM58 52a14 14 0 1 0 28 0a14 14 0 1 0-28 0ZM42 50Q50 44 58 50", INK, 4) },
  { id: "plant", name: "Little plant", style: "cozy", draw: (k) => k.clay("M30 62h40l-6 26H36Z", "#c0577a") + k.clay("M50 62Q30 50 28 30Q46 34 50 54Z", "#6fbf8c") + k.clay("M50 62Q70 46 74 26Q56 32 50 52Z", "#5f9a5c") },
  { id: "candle", name: "Candle", style: "cozy", draw: (k) => k.clay("M34 40h32v46H34Z", "#f3dfa2") + k.stroke("M50 40V32", INK, 2) + k.clay("M50 14Q58 24 50 32Q42 24 50 14Z", "#e2a04a") },
  { id: "plushie", name: "Plushie", style: "cozy", draw: (k) => k.circle(30, 30, 10, "#c08a5a") + k.circle(70, 30, 10, "#c08a5a") + k.clay("M50 24C72 24 78 42 76 58C74 80 26 80 24 58C22 42 28 24 50 24Z", "#c08a5a") + k.circle(42, 48, 3, INK) + k.circle(58, 48, 3, INK) + k.circle(50, 58, 4, INK) },
  { id: "map", name: "Old map", style: "adventurer", draw: (k) => k.clay("M10 22L36 14L64 22L90 14V78L64 86L36 78L10 86Z", "#f3dfa2") + k.stroke("M22 64Q40 40 56 54T80 32", "#d9573f", 3, 'stroke-dasharray="5 4"') },
  { id: "shell", name: "Seashell", style: "adventurer", draw: (k) => k.clay("M50 84L18 42Q30 16 50 16Q70 16 82 42Z", "#e8cfe0") + k.stroke("M50 84L34 28M50 84V20M50 84L66 28", "#c0577a", 2.5) },
  { id: "compass", name: "Compass", style: "adventurer", draw: (k) => k.clay("M50 14a36 36 0 1 0 .1 0Z", "#a9764e") + k.circle(50, 50, 28, "#fbf6ee") + k.path("M50 26L56 50H44Z", "#d9573f") + k.path("M50 74L56 50H44Z", "#5c6270") },
];

/** What the shelf says about you, by the style you picked most. */
export const LABELS = {
  music: "The Music Head",
  gamer: "The Gamer",
  creative: "The Artist",
  sporty: "The Athlete",
  bookworm: "The Bookworm",
  cozy: "The Cozy One",
  adventurer: "The Explorer",
};

let count = 0;
/** A thing, painted. */
export function thingSvg(thing) {
  const k = createPaintKit(`level-14-thing-${++count}`, { grain: 1.4, wobble: 1.6 });
  return `<svg viewBox="0 0 100 100" aria-label="${thing.name}">${k.defs()}<g filter="url(#${k.ids.paint})">${thing.draw(k)}</g></svg>`;
}
