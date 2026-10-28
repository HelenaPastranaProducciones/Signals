import { createSvgKit } from "../../avatar/svg-kit.js";
import { AVATAR_CATEGORIES } from "../../data/avatar-catalog.js";
import { pick } from "../../engine/random.js";

/**
 * Drawings for level 1: the running character (an avatar with arms and
 * legs), the obstacles and the landscape layers. Simple clay-style SVG.
 */

const kit = createSvgKit("level-01");

/** Gradients shared by every drawing of this level; put once in the stage. */
export const sharedDefs = () => `<svg width="0" height="0" aria-hidden="true" style="position:absolute">${kit.defs()}</svg>`;

/**
 * A full-body character: the avatar's head and torso with hips, legs, shoes
 * and arms. The parts have classes so level.css can animate them
 * (.legs .leg-front/.leg-back, .arm-front/.arm-back, .upper).
 *
 * @param {string} avatarSvg  Markup from game.avatar(avatar, { backdrop: false }).
 * @param {Record<string, string>} avatar
 */
export function character(avatarSvg, avatar) {
  const trousers = "#3a3f66";
  const shoes = avatar.acC;
  const torso = avatarSvg.replace("<svg ", '<svg x="0" y="0" width="200" height="220" ');
  const leg = (cls, x) =>
    `<g class="leg ${cls}">${kit.stroke(`M${x} 222L${x} 280`, trousers, 22)}` +
    `${kit.clay(`M${x - 13} 290Q${x - 13} 276 ${x + 4} 276Q${x + 22} 278 ${x + 22} 290Z`, shoes)}</g>`;
  const arm = (cls, x) =>
    `<g class="arm ${cls}">${kit.stroke(`M${x} 186L${x} 232`, avatar.topC, 18)}${kit.circle(x, 240, 10, avatar.skin)}</g>`;
  return `<svg class="character" viewBox="0 0 200 300" aria-hidden="true">
    <ellipse class="shadow" cx="100" cy="292" rx="46" ry="7" fill="#000" opacity=".12"/>
    <g class="upper">
      <g class="legs">${leg("leg-back", 108)}${leg("leg-front", 92)}</g>
      ${kit.clay("M60 204Q100 196 140 204L138 238Q100 246 62 238Z", trousers)}
      ${arm("arm-back", 146)}
      ${torso}
      ${arm("arm-front", 54)}
    </g>
  </svg>`;
}

/** A random look for a friend, from every avatar piece. */
export function randomAvatar() {
  return Object.fromEntries(AVATAR_CATEGORIES.map((category) => [category.key, pick(category.options).id]));
}

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

/** Wraps a drawing in an <svg> of its size. */
export const obstacleSvg = (o) => `<svg viewBox="0 0 ${o.width} ${o.height}" width="${o.width}" height="${o.height}">${o.svg()}</svg>`;

// Landscape tiles, repeated sideways and scrolled at different speeds.
const tile = (width, height, body) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${body}</svg>`)}")`;

const tree = (x, h, crown) =>
  `<rect x="${x - 5}" y="${200 - h}" width="10" height="${h}" rx="4" fill="#b98a6a"/>` +
  `<circle cx="${x}" cy="${200 - h}" r="${crown}" fill="#7bd389"/><circle cx="${x - crown * 0.35}" cy="${200 - h - crown * 0.3}" r="${crown * 0.45}" fill="#9be3a3"/>`;

const building = (x, w, h, colour) =>
  `<rect x="${x}" y="${200 - h}" width="${w}" height="${h}" rx="6" fill="${colour}"/>` +
  Array.from({ length: Math.floor((h - 20) / 24) }, (_, row) =>
    Array.from({ length: Math.floor((w - 10) / 18) }, (_, col) =>
      `<rect x="${x + 8 + col * 18}" y="${200 - h + 12 + row * 24}" width="9" height="12" rx="2" fill="#fff" opacity=".7"/>`).join("")).join("");

const house = (x, w, h, wall, roof) =>
  `<rect x="${x}" y="${200 - h}" width="${w}" height="${h}" rx="4" fill="${wall}"/>` +
  `<path d="M${x - 6} ${200 - h}L${x + w / 2} ${200 - h - w * 0.45}L${x + w + 6} ${200 - h}Z" fill="${roof}"/>` +
  `<rect x="${x + w / 2 - 7}" y="${180}" width="14" height="20" rx="3" fill="#fff" opacity=".7"/>`;

/** The landscape layers. `speed` is relative to the ground. */
export const LANDSCAPE = {
  clouds: {
    speed: 0.08,
    image: tile(900, 200,
      `<g fill="#fff" opacity=".85"><ellipse cx="120" cy="60" rx="60" ry="22"/><ellipse cx="150" cy="46" rx="34" ry="22"/>` +
      `<ellipse cx="520" cy="110" rx="70" ry="20"/><ellipse cx="490" cy="98" rx="30" ry="18"/><ellipse cx="780" cy="40" rx="44" ry="16"/></g>`),
  },
  hills: {
    speed: 0.2,
    image: tile(800, 200, `<path d="M0 200V120Q100 40 220 110T460 90T680 120T800 120V200Z" fill="#c7e6cf"/><path d="M0 200V160Q140 100 300 150T600 140T800 160V200Z" fill="#b2dcbd"/>`),
  },
  // The middle layer changes along the run: park, then city, then the neighbourhood where friends wait.
  scenes: [
    {
      speed: 0.5,
      image: tile(600, 200, tree(60, 70, 34) + tree(170, 50, 26) + `<rect x="230" y="176" width="70" height="8" rx="4" fill="#c98a5a"/>` + tree(360, 80, 38) + tree(470, 56, 28) + `<ellipse cx="560" cy="196" rx="40" ry="14" fill="#9be3a3"/>`),
    },
    {
      speed: 0.5,
      image: tile(600, 200, building(10, 90, 150, "#b9c7f0") + building(110, 70, 110, "#f2b8c6") + building(190, 110, 180, "#c9b6f2") + building(310, 80, 130, "#ffd59e") + building(400, 100, 160, "#a8d8e8") + building(510, 80, 100, "#f2b8c6")),
    },
    {
      speed: 0.5,
      image: tile(600, 200, house(20, 80, 70, "#ffd9c7", "#ff8a7a") + tree(140, 60, 26) + house(190, 90, 80, "#fff0b8", "#ffb347") + house(320, 70, 60, "#d6f1f1", "#5aa9ff") + tree(430, 70, 30) + house(480, 90, 76, "#f6d8f0", "#c97ad9")),
    },
  ],
};

/** Sky and ground colours at the start, middle and end of the run. */
export const PALETTES = [
  { skyTop: "#bcd8ff", skyBottom: "#f1e6ff", ground: "#bfe8b0", groundEdge: "#93cf83" },
  { skyTop: "#ffd2b8", skyBottom: "#fff0c8", ground: "#d9d4e8", groundEdge: "#b8b1cf" },
  { skyTop: "#c9b2f5", skyBottom: "#ffc9dc", ground: "#f2dcc0", groundEdge: "#dcbf9c" },
];
