import { createSvgKit } from "../../avatar/svg-kit.js";
import { chance, pick, randomBetween, randomInt, shuffle } from "../../engine/random.js";

/**
 * Drawings for level 1: the obstacles and the landscape layers, in the
 * clay style. The runner is the player's avatar (src/avatar/render-avatar.js).
 */

const kit = createSvgKit("level-01");

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
  `<svg viewBox="0 0 ${o.width} ${o.height}" width="${o.width * scale}" height="${o.height * scale}">${o.svg()}</svg>`;

// Landscape tiles, repeated sideways and scrolled at different speeds.
// Every attempt builds a new landscape: the places you run through, their
// order, where each tree or building stands, their colours and the time of day.
const tile = (width, height, body) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${body}</svg>`)}")`;

const CROWNS = [["#7bd389", "#9be3a3"], ["#5cc46a", "#86d98f"], ["#ffb3cf", "#ffd1e2"], ["#ffc46b", "#ffdc9a"], ["#9fd37b", "#c2e8a3"]];
const WALLS = ["#b9c7f0", "#f2b8c6", "#c9b6f2", "#ffd59e", "#a8d8e8", "#bfe3c6", "#ffcfb0", "#d9c4f5"];
const HOUSE_WALLS = ["#ffd9c7", "#fff0b8", "#d6f1f1", "#f6d8f0", "#e4f2d0", "#ffe3ec"];
const ROOFS = ["#ff8a7a", "#ffb347", "#5aa9ff", "#c97ad9", "#4fbf8f", "#f06a8a"];
const AWNINGS = ["#ff6f91", "#5aa9ff", "#ffb347", "#4fbf8f", "#a174ff"];

const tree = (x, h, crown, [dark, light] = CROWNS[0]) =>
  `<rect x="${x - 5}" y="${200 - h}" width="10" height="${h}" rx="4" fill="#b98a6a"/>` +
  `<circle cx="${x}" cy="${200 - h}" r="${crown}" fill="${dark}"/><circle cx="${x - crown * 0.35}" cy="${200 - h - crown * 0.3}" r="${crown * 0.45}" fill="${light}"/>`;

const bush = (x, r, [dark, light]) =>
  `<ellipse cx="${x}" cy="${200 - r * 0.5}" rx="${r * 1.4}" ry="${r}" fill="${dark}"/><ellipse cx="${x - r * 0.4}" cy="${200 - r * 0.8}" rx="${r * 0.6}" ry="${r * 0.45}" fill="${light}"/>`;

const bench = (x) =>
  `<rect x="${x}" y="176" width="70" height="8" rx="4" fill="#c98a5a"/><rect x="${x}" y="164" width="70" height="6" rx="3" fill="#b37548"/>` +
  `<rect x="${x + 6}" y="184" width="6" height="16" fill="#5b5f7a"/><rect x="${x + 58}" y="184" width="6" height="16" fill="#5b5f7a"/>`;

const lamp = (x) =>
  `<rect x="${x - 2}" y="110" width="4" height="90" fill="#5b5f7a"/><circle cx="${x}" cy="108" r="8" fill="#fff4b8"/>`;

const building = (x, w, h, colour) =>
  `<rect x="${x}" y="${200 - h}" width="${w}" height="${h}" rx="6" fill="${colour}"/>` +
  Array.from({ length: Math.floor((h - 20) / 24) }, (_, row) =>
    Array.from({ length: Math.floor((w - 10) / 18) }, (_, col) =>
      `<rect x="${x + 8 + col * 18}" y="${200 - h + 12 + row * 24}" width="9" height="12" rx="2" fill="#fff" opacity="${chance(0.2) ? ".95" : ".6"}"/>`).join("")).join("");

const house = (x, w, h, wall, roof) =>
  `<rect x="${x}" y="${200 - h}" width="${w}" height="${h}" rx="4" fill="${wall}"/>` +
  `<path d="M${x - 6} ${200 - h}L${x + w / 2} ${200 - h - w * 0.45}L${x + w + 6} ${200 - h}Z" fill="${roof}"/>` +
  `<rect x="${x + w / 2 - 7}" y="180" width="14" height="20" rx="3" fill="#fff" opacity=".7"/>` +
  `<rect x="${x + 8}" y="${200 - h + 12}" width="14" height="12" rx="2" fill="#fff" opacity=".6"/>`;

const shop = (x, w, h, wall, awning) =>
  `<rect x="${x}" y="${200 - h}" width="${w}" height="${h}" rx="5" fill="${wall}"/>` +
  `<rect x="${x + 8}" y="${200 - h * 0.55}" width="${w - 16}" height="${h * 0.4}" rx="3" fill="#fff" opacity=".65"/>` +
  Array.from({ length: Math.ceil(w / 14) }, (_, i) =>
    `<path d="M${x - 4 + i * 14} ${200 - h * 0.7}h14v10q-7 8-14 0Z" fill="${i % 2 ? "#fff" : awning}"/>`).join("") +
  `<rect x="${x + 10}" y="${200 - h + 8}" width="${w - 20}" height="12" rx="6" fill="${awning}" opacity=".85"/>`;

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
    { skyTop: "#bcd8ff", skyBottom: "#f1e6ff", ground: "#bfe8b0", groundEdge: "#93cf83" },
    { skyTop: "#ffd2b8", skyBottom: "#fff0c8", ground: "#d9d4e8", groundEdge: "#b8b1cf" },
    { skyTop: "#c9b2f5", skyBottom: "#ffc9dc", ground: "#f2dcc0", groundEdge: "#dcbf9c" },
  ],
  [ // early morning to a bright midday
    { skyTop: "#ffc6a8", skyBottom: "#fff1d6", ground: "#cde8b8", groundEdge: "#a6d38f" },
    { skyTop: "#a8d4ff", skyBottom: "#e6f4ff", ground: "#c8eab8", groundEdge: "#9fd48a" },
    { skyTop: "#8fc8ff", skyBottom: "#d8f0ff", ground: "#ffe3b8", groundEdge: "#f0c68c" },
  ],
  [ // an evening that turns into a starry night
    { skyTop: "#ffb8a0", skyBottom: "#ffe2c4", ground: "#e8d6c0", groundEdge: "#d2b89a" },
    { skyTop: "#a78bdc", skyBottom: "#f6b8d0", ground: "#cfc4e6", groundEdge: "#ac9fd0" },
    { skyTop: "#4b4c9a", skyBottom: "#b38ad8", ground: "#9d93c8", groundEdge: "#7c71b0" },
  ],
  [ // a soft cloudy day
    { skyTop: "#d4dcef", skyBottom: "#f2f0f8", ground: "#c4e2c4", groundEdge: "#9ccb9e" },
    { skyTop: "#c2d6f2", skyBottom: "#eef3fb", ground: "#d4e6cc", groundEdge: "#aed0a2" },
    { skyTop: "#b8c8f0", skyBottom: "#ffe8f0", ground: "#e8e0f4", groundEdge: "#c8bce4" },
  ],
];

const clouds = () => {
  let body = "";
  for (let x = randomBetween(40, 160); x < 860; x += randomBetween(160, 320)) {
    const y = randomBetween(30, 120);
    const r = randomBetween(36, 70);
    body += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.33}"/><ellipse cx="${x + r * 0.4}" cy="${y - r * 0.2}" rx="${r * 0.5}" ry="${r * 0.32}"/>`;
  }
  return tile(900, 200, `<g fill="#fff" opacity=".85">${body}</g>`);
};

const hills = () => {
  const [a, b, c] = [0, 0, 0].map(() => randomInt(40, 110));
  return tile(800, 200,
    `<path d="M0 200V120Q100 ${a} 220 110T460 ${70 + a / 3}T680 ${b + 30}T800 120V200Z" fill="#c7e6cf"/>` +
    `<path d="M0 200V160Q140 ${c + 40} 300 150T600 140T800 160V200Z" fill="#b2dcbd"/>`);
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
