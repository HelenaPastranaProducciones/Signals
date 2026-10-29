import { createSvgKit } from "../../avatar/svg-kit.js";
import { pick, randomBetween } from "../../engine/random.js";

/**
 * The prizes inside the claw machine, drawn in the clay style. Physical
 * objects (the ones to win) and digital ones (the ones that waste a try).
 * Every call picks its own colours, so no two machines look the same.
 */

const BRIGHT = ["#ff5f9e", "#3f8fff", "#3cb371", "#ff9a1f", "#a26bff", "#18b6c9", "#e8503a", "#f2c12e"];
const SKIES = [["#9fd3ff", "#3cb371"], ["#ffb38a", "#a26bff"], ["#ffe08a", "#ff7a45"], ["#c9b6f2", "#18b6c9"]];

const svg = (k, body, tilt = 0) =>
  `<svg viewBox="0 0 100 100" class="prize-svg" aria-hidden="true">${k.defs()}<g transform="rotate(${tilt.toFixed(1)} 50 50)">${body}</g></svg>`;

/** Rounded rectangle path. */
const box = (x, y, w, h, r) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1-${r} ${r}h-${w - 2 * r}a${r} ${r} 0 0 1-${r}-${r}v-${h - 2 * r}a${r} ${r} 0 0 1 ${r}-${r}Z`;
const disc = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0-${2 * r} 0Z`;

const DRAW = {
  polaroid(k) {
    const [sky, hill] = pick(SKIES);
    return svg(k,
      k.clay(box(16, 10, 68, 80, 5), "#fbfaf3") +
      k.path(box(23, 17, 54, 50, 2), sky) +
      k.circle(62, 32, 7, "#fff6c2") +
      k.path("M23 58Q38 42 52 54T77 50V67H23Z", hill) +
      k.path("M30 78h28", "none", 'stroke="#cfcab8" stroke-width="3" stroke-linecap="round"'),
    randomBetween(-12, 12));
  },
  vinyl(k) {
    const sleeve = pick(BRIGHT);
    return svg(k,
      k.clay(disc(62, 50, 34), "#26252f") +
      k.path(disc(62, 50, 26), "none", 'stroke="#3d3c4a" stroke-width="1.5"') +
      k.path(disc(62, 50, 19), "none", 'stroke="#3d3c4a" stroke-width="1.5"') +
      k.circle(62, 50, 10, pick(BRIGHT)) + k.circle(62, 50, 2, "#26252f") +
      k.clay(box(8, 16, 64, 68, 4), sleeve) +
      k.circle(40, 50, 17, "#fff", ".35") + k.star(40, 50, 1.2, "#ffe36b"),
    randomBetween(-8, 8));
  },
  cassette(k) {
    const body = pick(BRIGHT);
    return svg(k,
      k.clay(box(6, 24, 88, 54, 7), body) +
      k.path(box(14, 30, 72, 22, 3), "#fff8e6") +
      k.path("M20 38h40M20 45h28", "none", 'stroke="#ff5a3c" stroke-width="2.5" stroke-linecap="round"') +
      k.path(box(28, 56, 44, 14, 6), "#3a3946") +
      k.circle(39, 63, 5, "#fff") + k.circle(61, 63, 5, "#fff") +
      k.circle(39, 63, 2, "#3a3946") + k.circle(61, 63, 2, "#3a3946"),
    randomBetween(-14, 14));
  },
  camera(k) {
    const body = pick(["#e8503a", "#3f8fff", "#f2c12e", "#3cb371", "#fbfaf3"]);
    return svg(k,
      k.clay(box(20, 22, 22, 14, 4), "#3a3946") +
      k.clay(box(8, 30, 84, 52, 9), body) +
      k.path(box(8, 50, 84, 16, 0), "#3a3946", 'opacity=".85"') +
      k.clay(disc(52, 57, 19), "#2a2933") +
      k.circle(52, 57, 11, "#5fa8ff") + k.circle(47, 52, 4, "#fff", ".8") +
      k.path(box(72, 36, 12, 8, 2), "#fff8c8"),
    randomBetween(-10, 10));
  },
  zine(k) {
    const cover = pick(BRIGHT);
    return svg(k,
      k.path(box(20, 14, 62, 76, 3), "#e9e3d2") +
      k.clay(box(16, 10, 62, 76, 3), cover) +
      k.path(box(24, 18, 46, 18, 2), "#fff") +
      k.path("M30 27h34", "none", 'stroke="#23243a" stroke-width="5" stroke-linecap="round"') +
      k.star(47, 58, 2, "#ffe36b") +
      k.path("M18 30v10M18 58v10", "none", 'stroke="#9a9aa8" stroke-width="2.5"'),
    randomBetween(-14, 14));
  },
  phone(k) {
    const glow = pick(["#5fd8ff", "#b6a4ff", "#ff8fc0", "#7cf0b0"]);
    return svg(k,
      k.clay(box(28, 6, 44, 88, 9), "#23232c") +
      k.path(box(32, 12, 36, 76, 5), glow) + apps(k, 36, 18, 3, 4) +
      k.circle(66, 12, 6, "#ff3b3b") + k.path("M64.5 12h3", "none", 'stroke="#fff" stroke-width="2"'),
    randomBetween(-16, 16));
  },
  tablet(k) {
    const glow = pick(["#5fd8ff", "#b6a4ff", "#ff8fc0", "#7cf0b0"]);
    return svg(k,
      k.clay(box(6, 18, 88, 64, 8), "#2b2b35") +
      k.path(box(12, 24, 76, 52, 4), glow) + apps(k, 18, 30, 5, 3),
    randomBetween(-10, 10));
  },
  watch(k) {
    const band = pick(BRIGHT);
    return svg(k,
      k.clay(box(38, 4, 24, 92, 10), band) +
      k.clay(box(26, 28, 48, 44, 12), "#23232c") +
      k.path(box(31, 33, 38, 34, 8), pick(["#5fd8ff", "#7cf0b0", "#ff8fc0"])) +
      k.path("M50 40v10l6 4", "none", 'stroke="#fff" stroke-width="3" stroke-linecap="round"'),
    randomBetween(-16, 16));
  },
};

/** Little app icons on a glowing screen. */
function apps(k, x, y, columns, rows) {
  let out = "";
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < columns; c += 1) out += k.path(box(x + c * 13, y + r * 14, 9, 9, 3), "#fff", 'opacity=".75"');
  }
  return out;
}

export const PHYSICAL = [
  { type: "polaroid", name: "Polaroid" },
  { type: "vinyl", name: "Vinyl" },
  { type: "cassette", name: "Cassette" },
  { type: "camera", name: "Film camera" },
  { type: "zine", name: "Zine" },
];
export const DIGITAL = [
  { type: "phone", name: "Phone" },
  { type: "tablet", name: "Tablet" },
  { type: "watch", name: "Smartwatch" },
];

let count = 0;
/** SVG markup of one prize, with its own random colours and tilt. */
export const drawPrize = (type) => DRAW[type](createSvgKit(`prize-${++count}`));
