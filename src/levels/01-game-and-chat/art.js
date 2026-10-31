import { createPaintKit } from "../../avatar/svg-kit.js";
import { chance, pick, randomBetween, randomInt, shuffle } from "../../engine/random.js";

/**
 * Drawings for level 1: the obstacles and the landscape layers, in the
 * hand-drawn look (31/10/2026): warm, muted colours outlined in dark ink, like
 * the menus; the obstacles are painted (flat colour, hard shadow, grain).
 * The runner is in runner.js.
 */

const kit = createPaintKit("level-01");

/** Gradients shared by every drawing of this level; put once in the stage. */
export const sharedDefs = () => `<svg width="0" height="0" aria-hidden="true" style="position:absolute">${kit.defs()}</svg>`;


/** Obstacles on the ground: jump over them. Sizes in pixels. */
export const GROUND_OBSTACLES = [
  {
    width: 34, height: 44,
    svg: () => kit.clay("M17 2L30 40H4Z", "#ff8a3c") + kit.path("M10 22h14l2 6H8Z", "#fff") + kit.clay("M0 38h34v6H0Z", "#ff6a3c"),
  },
  {
    width: 40, height: 52,
    svg: () => kit.clay("M4 10h32l-3 42H7Z", "#7bb6ff") + kit.clay("M0 4h40v9H0Z", "#5a8fe0") + kit.path("M14 22v22M26 22v22", "none", 'stroke="#fff" stroke-width="3" opacity=".5"'),
  },
  {
    width: 64, height: 36,
    svg: () => kit.clay("M2 12h60v10H2Z", "#c98a5a") + kit.clay("M2 0h60v8H2Z", "#b37548") + kit.clay("M8 22h6v14H8ZM50 22h6v14h-6Z", "#5b5f7a"),
  },
  {
    width: 46, height: 46,
    svg: () => kit.clay("M2 6h42v40H2Z", "#e6b77a") + kit.path("M2 6h42l-6-6H8Z", "#f2cd99") + kit.path("M18 6h10v14H18Z", "#fff", 'opacity=".5"'),
  },
  {
    width: 36, height: 50,
    svg: () => kit.clay("M6 30h24l-3 20H9Z", "#ff7ab0") + kit.clay("M18 2C30 6 32 20 18 30C4 20 6 6 18 2Z", "#5cc46a") + kit.clay("M18 10C26 14 26 24 18 30C10 24 10 14 18 10Z", "#7bd389"),
  },
];

/** Obstacles flying at head height: duck under them. */
export const FLYING_OBSTACLES = [
  {
    width: 60, height: 26,
    svg: () => kit.clay("M14 10h32v12H14Z", "#9a9fc4") + kit.clay("M0 4h22v5H0ZM38 4h22v5H38Z", "#5b5f7a") + kit.circle(30, 16, 4, "#ff5a3c"),
  },
  {
    width: 54, height: 28,
    svg: () => kit.clay("M0 14L54 2L30 28Z", "#ffffff") + kit.path("M54 2L22 18L30 28Z", "#dfe6ee"),
  },
  {
    width: 48, height: 32,
    svg: () => kit.clay("M6 16C10 6 32 6 38 14C34 26 12 28 6 16Z", "#b9a6ff") + kit.clay("M14 14L26 0L30 14Z", "#9a86f0") + kit.path("M38 14l10 3-10 3Z", "#ffb347") + kit.circle(33, 13, 2.2, "#23243a"),
  },
  {
    width: 44, height: 44,
    svg: () => kit.clay("M22 0C36 0 42 10 42 18C42 30 30 34 22 36C14 34 2 30 2 18C2 10 8 0 22 0Z", "#ffe36b") + kit.path("M22 36v8", "none", 'stroke="#23243a" stroke-width="1.5"'),
  },
];

/** Wraps a drawing in an <svg>, `scale` times its drawn size. */
export const obstacleSvg = (o, scale) =>
  `<svg viewBox="0 0 ${o.width} ${o.height}" width="${o.width * scale}" height="${o.height * scale}"><g filter="url(#${kit.ids.paint})" stroke="${INK}" stroke-width="2" stroke-linejoin="round">${o.svg()}</g></svg>`;

// Landscape tiles, repeated sideways and scrolled at different speeds.
// Every attempt builds a new landscape: the places you run through, their
// order, where each tree or building stands, their colours and the time of day.
// Everything is outlined in dark ink, like the menus (hand-drawn look, 31/10/2026).
const INK = "#2b2630";
const tile = (width, height, body) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><g stroke="${INK}" stroke-width="2.4" stroke-linejoin="round">${body}</g></svg>`)}")`;

// The game's warm, muted palette: paper tints for walls, tomato, mustard, teal and lilac for accents.
const CROWNS = [["#7fa877", "#a3c48f"], ["#6f9a6c", "#94b984"], ["#d99a8a", "#ecc0ac"], ["#d9a94e", "#ebc985"], ["#8fae73", "#b5cb92"]];
const WALLS = ["#c9d9e8", "#e8cfe0", "#d3e6c5", "#f3dfa2", "#c6e2dc", "#f4c7b0", "#dcd2ee", "#efe3c6"];
const HOUSE_WALLS = ["#f4c7b0", "#f3dfa2", "#c6e2dc", "#e8cfe0", "#d3e6c5", "#fff8ee"];
const ROOFS = ["#e4573d", "#e9b03b", "#2f8f8a", "#9c8ad0", "#3e5c8a", "#c0577a"];
const AWNINGS = ["#e4573d", "#2f8f8a", "#e9b03b", "#9c8ad0", "#3e5c8a"];

const tree = (x, h, crown, [dark, light] = CROWNS[0]) =>
  `<rect x="${x - 5}" y="${200 - h}" width="10" height="${h}" rx="4" fill="#8a5f45"/>` +
  `<circle cx="${x}" cy="${200 - h}" r="${crown}" fill="${dark}"/><circle cx="${x - crown * 0.35}" cy="${200 - h - crown * 0.3}" r="${crown * 0.45}" fill="${light}"/>`;

const bush = (x, r, [dark, light]) =>
  `<ellipse cx="${x}" cy="${200 - r * 0.5}" rx="${r * 1.4}" ry="${r}" fill="${dark}"/><ellipse cx="${x - r * 0.4}" cy="${200 - r * 0.8}" rx="${r * 0.6}" ry="${r * 0.45}" fill="${light}"/>`;

const bench = (x) =>
  `<rect x="${x}" y="176" width="70" height="8" rx="4" fill="#c08a5a"/><rect x="${x}" y="164" width="70" height="6" rx="3" fill="#b37548"/>` +
  `<rect x="${x + 6}" y="184" width="6" height="16" fill="#4a4550"/><rect x="${x + 58}" y="184" width="6" height="16" fill="#4a4550"/>`;

const lamp = (x) =>
  `<rect x="${x - 2}" y="110" width="4" height="90" fill="#4a4550"/><circle cx="${x}" cy="108" r="8" fill="#f3dfa2"/>`;

const building = (x, w, h, colour) =>
  `<rect x="${x}" y="${200 - h}" width="${w}" height="${h}" rx="6" fill="${colour}"/>` +
  Array.from({ length: Math.floor((h - 20) / 24) }, (_, row) =>
    Array.from({ length: Math.floor((w - 10) / 18) }, (_, col) =>
      `<rect x="${x + 8 + col * 18}" y="${200 - h + 12 + row * 24}" width="9" height="12" rx="2" fill="${chance(0.25) ? "#f3dfa2" : "#fff8ee"}"/>`).join("")).join("");

const house = (x, w, h, wall, roof) =>
  `<rect x="${x}" y="${200 - h}" width="${w}" height="${h}" rx="4" fill="${wall}"/>` +
  `<path d="M${x - 6} ${200 - h}L${x + w / 2} ${200 - h - w * 0.45}L${x + w + 6} ${200 - h}Z" fill="${roof}"/>` +
  `<rect x="${x + w / 2 - 7}" y="180" width="14" height="20" rx="3" fill="#fff8ee"/>` +
  `<rect x="${x + 8}" y="${200 - h + 12}" width="14" height="12" rx="2" fill="#fff8ee"/>`;

const shop = (x, w, h, wall, awning) =>
  `<rect x="${x}" y="${200 - h}" width="${w}" height="${h}" rx="5" fill="${wall}"/>` +
  `<rect x="${x + 8}" y="${200 - h * 0.55}" width="${w - 16}" height="${h * 0.4}" rx="3" fill="#fff8ee"/>` +
  Array.from({ length: Math.ceil(w / 14) }, (_, i) =>
    `<path d="M${x - 4 + i * 14} ${200 - h * 0.7}h14v10q-7 8-14 0Z" fill="${i % 2 ? "#fff8ee" : awning}"/>`).join("") +
  `<rect x="${x + 10}" y="${200 - h + 8}" width="${w - 20}" height="12" rx="6" fill="${awning}"/>`;

/** Fills a 600-wide tile with things placed at random gaps. `place(x)` draws one and returns its width. */
function scatter(place, minGap, maxGap) {
  let body = "";
  for (let x = randomBetween(0, 30); x < 560;) {
    const [svg, width] = place(x);
    body += svg;
    x += width + randomBetween(minGap, maxGap);
  }
  return tile(600, 200, body);
}

/** The places a run can go through. Each call draws a new version. */
const SCENES = {
  park: () => {
    const crowns = [pick(CROWNS), pick(CROWNS)];
    return scatter((x) => pick([
      () => [tree(x + 30, randomInt(50, 85), randomInt(24, 38), pick(crowns)), 60],
      () => [bush(x + 25, randomInt(12, 18), pick(crowns)), 50],
      () => [bench(x), 70],
      () => [lamp(x + 6), 12],
    ])(), 20, 70);
  },
  city: () => scatter((x) => {
    const w = randomInt(60, 110);
    return [building(x, w, randomInt(90, 185), pick(WALLS)), w];
  }, 4, 16),
  neighbourhood: () => scatter((x) => {
    if (chance(0.3)) return [tree(x + 25, randomInt(50, 75), randomInt(22, 30), pick(CROWNS)), 50];
    const w = randomInt(66, 96);
    return [house(x, w, randomInt(56, 84), pick(HOUSE_WALLS), pick(ROOFS)), w];
  }, 16, 40),
  shops: () => scatter((x) => {
    if (chance(0.2)) return [lamp(x + 6), 12];
    const w = randomInt(70, 100);
    return [shop(x, w, randomInt(80, 110), pick(WALLS), pick(AWNINGS)), w];
  }, 6, 20),
};

/** Sky and ground colours along a run (start, middle, finish). One is picked per attempt. */
const SKIES = [
  [ // a sunny day that ends in a pink sunset
    { skyTop: "#bcd6dd", skyBottom: "#f1e7d4", ground: "#d9cfa8", groundEdge: "#2b2630" },
    { skyTop: "#f2c9a8", skyBottom: "#f6e6cc", ground: "#d8c7a6", groundEdge: "#2b2630" },
    { skyTop: "#d9a3b0", skyBottom: "#f3cdb6", ground: "#cdb79a", groundEdge: "#2b2630" },
  ],
  [ // early morning to a bright midday
    { skyTop: "#f2c9a8", skyBottom: "#f6ead2", ground: "#cfd6a8", groundEdge: "#2b2630" },
    { skyTop: "#b8d4dc", skyBottom: "#eef0e2", ground: "#c9d6a6", groundEdge: "#2b2630" },
    { skyTop: "#a9cbd8", skyBottom: "#e6efe6", ground: "#d9cba0", groundEdge: "#2b2630" },
  ],
  [ // an evening that turns into a starry night
    { skyTop: "#f0b9a0", skyBottom: "#f5dcc2", ground: "#d8c2a0", groundEdge: "#2b2630" },
    { skyTop: "#b49ac0", skyBottom: "#ecc0c4", ground: "#c2b2c6", groundEdge: "#2b2630" },
    { skyTop: "#4e4f7c", skyBottom: "#9d86b4", ground: "#8d84ab", groundEdge: "#2b2630" },
  ],
  [ // a soft cloudy day
    { skyTop: "#cdd4d8", skyBottom: "#efeae0", ground: "#c9d3b4", groundEdge: "#2b2630" },
    { skyTop: "#c3cfd6", skyBottom: "#ece8de", ground: "#cbd5b2", groundEdge: "#2b2630" },
    { skyTop: "#c6c6d6", skyBottom: "#efe2e2", ground: "#d6cfc6", groundEdge: "#2b2630" },
  ],
];

const clouds = () => {
  let body = "";
  for (let x = randomBetween(40, 160); x < 860; x += randomBetween(160, 320)) {
    const y = randomBetween(30, 120);
    const r = randomBetween(36, 70);
    body += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.33}"/><ellipse cx="${x + r * 0.4}" cy="${y - r * 0.2}" rx="${r * 0.5}" ry="${r * 0.32}"/>`;
  }
  return tile(900, 200, `<g fill="#fff8ee">${body}</g>`);
};

const hills = () => {
  const [a, b, c] = [0, 0, 0].map(() => randomInt(40, 110));
  // Pushed down a little so no hilltop is cut by the top of the tile (it showed as a line in the sky).
  return tile(800, 200,
    `<g transform="translate(0 34)"><path d="M0 200V120Q100 ${a} 220 110T460 ${70 + a / 3}T680 ${b + 30}T800 120V200Z" fill="#c3d3ad"/>` +
    `<path d="M0 200V160Q140 ${c + 40} 300 150T600 140T800 160V200Z" fill="#a9c095"/></g>`);
};

/**
 * A new landscape for one attempt: clouds and hills far away, three places
 * in a random order for the middle layer, and the sky colours along the run.
 * `speed` is relative to the ground.
 */
export function randomLandscape() {
  return {
    clouds: { speed: 0.08, image: clouds() },
    hills: { speed: 0.2, image: hills() },
    scenes: shuffle(Object.keys(SCENES)).slice(0, 3).map((name) => ({ speed: 0.5, image: SCENES[name]() })),
    palettes: pick(SKIES),
  };
}
