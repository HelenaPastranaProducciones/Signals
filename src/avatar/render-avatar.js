import { createSvgKit } from "./svg-kit.js";

/**
 * The player's avatar as shown in the menus (title, lobby, editor, chat
 * pictures): a small, cute full-body figure facing the viewer, drawn as SVG.
 *
 * Levels don't bolt animations onto this drawing: each level draws its own
 * avatar from the same choices, in the view its game needs (see CLAUDE.md,
 * "Avatar system"). Level 1's side-view runner is in its folder.
 *
 * Layers are painted back to front (see `renderAvatar`). Each style option in
 * src/data/avatar-catalog.js maps to a drawer in one of the tables below; a
 * missing entry (e.g. "none", "tee") draws nothing. Every drawer receives the
 * SVG kit `k` and the avatar `a`.
 *
 * Drawing units: 160 × 234, centred on x = 80, feet on y = 229.
 *
 * @typedef {ReturnType<typeof import("./svg-kit.js").createSvgKit>} Kit
 * @typedef {Record<string, string>} Avatar
 * @typedef {(k: Kit, a: Avatar) => string} Drawer
 */

const INK = "#2b2233";
const LIPS = "#7a2f3d";
const GOLD = "#f2c12e";
const TROUSERS = "#414a7a";

/** Frames shown by `renderAvatar` (x, y, width, height). */
const VIEW = { full: "0 0 160 234", bust: "10 4 140 176", head: "14 0 132 124" };

// Head and body shapes.
const HEAD = "M80 36C106 36 121 54 121 76C121 98 104 112 80 112C56 112 39 98 39 76C39 54 54 36 80 36Z";
const TORSO = "M58 116Q80 106 102 116L106 164Q80 174 54 164Z";

// Hair shapes. FRINGE covers the top of the head and ends in soft locks over the forehead.
const FRINGE =
  "M39 86C33 50 54 30 80 30C106 30 127 50 121 86" +
  "Q118 74 113 66Q108 64 102 58Q96 64 88 60Q84 54 80 50Q76 56 70 60Q62 62 58 58Q52 64 47 66Q42 74 39 86Z";
const CAP_BACK = "M35 84C29 46 52 26 80 26C108 26 131 46 125 84C118 62 100 50 80 50C60 50 42 62 35 84Z";

/** @type {Record<string, Drawer>} Hair drawn behind the head (and, when long, behind the body). */
const HAIR_BACK = {
  short: (k, a) => k.clay(CAP_BACK, shade(a.hairC, -0.12)),
  bob: (k, a) => k.clay("M35 80C31 44 52 26 80 26C108 26 129 44 125 80L127 112Q118 122 108 114L106 100H54L52 114Q42 122 33 112Z", shade(a.hairC, -0.12)),
  long: (k, a) => k.clay("M35 80C31 44 52 26 80 26C108 26 129 44 125 80L129 150Q118 166 102 156L100 118H60L58 156Q42 166 31 150Z", shade(a.hairC, -0.12)),
  bun: (k, a) => k.clay(CAP_BACK, shade(a.hairC, -0.12)) + k.clay("M80 4a16 16 0 1 0 .1 0Z", a.hairC),
  buns: (k, a) =>
    k.clay(CAP_BACK, shade(a.hairC, -0.12)) + k.clay("M48 16a15 15 0 1 0 .1 0Z", a.hairC) + k.clay("M112 16a15 15 0 1 0 .1 0Z", a.hairC),
  curls: (k, a) =>
    [[38, 72, 14], [42, 48, 16], [60, 32, 17], [80, 28, 17], [100, 32, 17], [118, 48, 16], [122, 72, 14], [36, 94, 11], [124, 94, 11]]
      .map(([x, y, r]) => k.clay(`M${x} ${y - r}a${r} ${r} 0 1 0 .1 0Z`, shade(a.hairC, -0.12))).join(""),
  afro: (k, a) => k.clay("M80 4C120 4 140 30 138 64C136 92 118 100 80 100C42 100 24 92 22 64C20 30 40 4 80 4Z", shade(a.hairC, -0.08)),
};

/** @type {Record<string, Drawer>} Hair drawn over the forehead. */
const HAIR_FRONT = {
  short: (k, a) => k.clay(FRINGE, a.hairC) + shine(k),
  bob: (k, a) => k.clay(FRINGE, a.hairC) + shine(k),
  long: (k, a) => k.clay(FRINGE, a.hairC) + shine(k),
  bun: (k, a) => k.clay(FRINGE, a.hairC) + shine(k),
  buns: (k, a) => k.clay(FRINGE, a.hairC) + shine(k),
  buzz: (k, a) =>
    k.path("M41 80C37 50 56 34 80 34C104 34 123 50 119 80Q114 62 100 56Q80 50 60 56Q46 62 41 80Z", a.hairC, 'opacity=".92"'),
  curls: (k, a) =>
    [[50, 54, 12], [64, 44, 13], [80, 40, 13], [96, 44, 13], [110, 54, 12], [56, 64, 9], [104, 64, 9]]
      .map(([x, y, r]) => k.clay(`M${x} ${y - r}a${r} ${r} 0 1 0 .1 0Z`, a.hairC)).join(""),
  afro: (k, a) => k.clay("M41 72C39 46 58 34 80 34C102 34 121 46 119 72Q104 56 80 56Q56 56 41 72Z", a.hairC),
  mohawk: (k, a) =>
    k.path("M42 80C38 52 56 38 80 38C104 38 122 52 118 80Q106 56 80 56Q54 56 42 80Z", a.hairC, 'opacity=".35"') +
    k.clay("M66 46Q64 28 70 12Q76 24 78 28Q80 12 86 2Q88 18 90 24Q96 12 100 10Q100 28 96 46Q80 40 66 46Z", a.hairC),
};

/** A soft highlight on hair. */
const shine = (k) => k.stroke("M58 40Q72 33 88 35", "#fff", 4, 'opacity=".28"');

/** The two eyes. */
const LEFT = { x: 66, y: 82, rx: 6.2, ry: 8.4 };
const RIGHT = { x: 94, y: 82, rx: 6.2, ry: 8.4 };

const ovalEye = (k, e) =>
  `<ellipse cx="${e.x}" cy="${e.y}" rx="${e.rx}" ry="${e.ry}" fill="${INK}"/>` +
  k.circle(e.x + 1.8, e.y - 3, e.rx * 0.42, "#fff") + k.circle(e.x - 2, e.y + 3.2, e.rx * 0.2, "#fff");

/** @type {Record<string, (k: Kit, a: Avatar, e: typeof LEFT) => string>} One eye. */
const EYES = {
  dots: (k, a, e) => ovalEye(k, e),
  happy: (k, a, e) => k.stroke(`M${e.x - e.rx - 1} ${e.y + 2}Q${e.x} ${e.y - 9} ${e.x + e.rx + 1} ${e.y + 2}`, INK, 3.4),
  sleepy: (k, a, e) =>
    `<ellipse cx="${e.x}" cy="${e.y + 2}" rx="${e.rx}" ry="${e.ry * 0.55}" fill="${INK}"/>` +
    k.stroke(`M${e.x - e.rx - 1.5} ${e.y - 0.5}Q${e.x} ${e.y - 3} ${e.x + e.rx + 1.5} ${e.y - 0.5}`, INK, 2.6),
  sparkle: (k, a, e) =>
    `<ellipse cx="${e.x}" cy="${e.y}" rx="${e.rx + 0.8}" ry="${e.ry + 0.8}" fill="${INK}"/>` +
    `<ellipse cx="${e.x}" cy="${e.y + 3}" rx="${e.rx - 1}" ry="${e.ry * 0.45}" fill="#6c5ce7" opacity=".55"/>` +
    k.star(e.x + 1.5, e.y - 2.5, 0.42, "#fff") + k.circle(e.x - 2.2, e.y + 3.6, 1.3, "#fff"),
};

/** @type {Record<string, Drawer>} */
const MOUTHS = {
  smile: (k) => k.stroke("M74 98Q80 104 86 98", LIPS, 2.6),
  grin: (k) => k.path("M72 96Q80 108 88 96Q80 99 72 96Z", LIPS) + k.path("M74 97Q80 99 86 97L85 99.5Q80 101 75 99.5Z", "#fff"),
  smirk: (k) => k.stroke("M74 100Q82 101 87 95", LIPS, 2.6),
  tongue: (k) => k.path("M73 96Q80 106 87 96Z", LIPS) + k.path("M77 100Q80 108 84 100Z", "#ff6f8a"),
  oh: () => `<ellipse cx="80" cy="100" rx="3.6" ry="4.4" fill="${LIPS}"/>`,
};

/** @type {Record<string, Drawer>} Marks painted on the cheeks ("blush" only makes the cheeks pinker). */
const FACE_MARKS = {
  freckles: (k) =>
    [[52, 90], [56, 94], [60, 90], [100, 90], [104, 94], [108, 90]].map(([x, y]) => k.circle(x, y, 1.3, "#a85a34", ".7")).join(""),
  stripes: (k, a) => k.stroke("M48 92h9", a.acC, 2.6) + k.stroke("M49 97h9", a.acC, 2.6) + k.stroke("M103 92h9", a.acC, 2.6) + k.stroke("M102 97h9", a.acC, 2.6),
  star: (k) => k.star(106, 94, 0.62, "#ffe36b"),
  bandaid: () =>
    `<g transform="rotate(-18 56 94)"><rect x="48" y="90" width="17" height="8" rx="4" fill="#f3c9a0" stroke="rgba(0,0,0,.18)"/><rect x="54" y="90" width="5" height="8" fill="#e8b184"/></g>`,
};

/** @type {Record<string, Drawer>} One on each ear. */
const EARRINGS = {
  hoops: (k) => k.stroke("M38 96a5 5 0 1 0 .1 0", GOLD, 2.2) + k.stroke("M122 96a5 5 0 1 0 .1 0", GOLD, 2.2),
  studs: (k) => k.circle(38, 94, 2.6, GOLD) + k.circle(122, 94, 2.6, GOLD),
  gems: (k) => k.circle(38, 96, 3.4, "#4fd8ff") + k.circle(37, 95, 1.1, "#fff") + k.circle(122, 96, 3.4, "#4fd8ff") + k.circle(121, 95, 1.1, "#fff"),
};

/** Draws a lens around both eyes; `lens(x, y)` draws one, plus bridge and arms in `colour`. */
const pair = (k, lens, colour) =>
  lens(LEFT.x, LEFT.y) + lens(RIGHT.x, RIGHT.y) + k.stroke("M76 81h8", colour, 2.4) +
  k.stroke("M56 80L41 78", colour, 2.4) + k.stroke("M104 80L119 78", colour, 2.4);

/** @type {Record<string, Drawer>} */
const GLASSES = {
  round: (k) => pair(k, (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="rgba(255,255,255,.18)" stroke="#ff7a45" stroke-width="2.6"/>`, "#ff7a45"),
  square: (k) => pair(k, (x, y) => `<rect x="${x - 10}" y="${y - 9}" width="20" height="18" rx="5" fill="rgba(255,255,255,.18)" stroke="#2fc4b2" stroke-width="2.6"/>`, "#2fc4b2"),
  sun: (k) =>
    pair(k, (x, y) => `<path d="M${x - 11} ${y - 8}H${x + 11}V${y}Q${x + 11} ${y + 9} ${x} ${y + 9}Q${x - 11} ${y + 9} ${x - 11} ${y}Z" fill="#1f1d2b"/>` +
      k.stroke(`M${x - 6} ${y - 4}l5-1`, "#fff", 2, 'opacity=".55"'), "#1f1d2b"),
  shutter: (k, a) =>
    pair(k, (x, y) =>
      `<rect x="${x - 11}" y="${y - 9}" width="22" height="18" rx="4" fill="${a.acC}"/>` +
      [-4, 0, 4].map((d) => k.stroke(`M${x - 8} ${y + d}h16`, "#fff", 1.6)).join(""), a.acC),
  pixel: (k) =>
    k.path("M52 74H108V80H104V88H90V80H86V82H74V80H70V88H56V80H52Z", "#1f1d2b") +
    k.path("M59 76h4v3h-4zM93 76h4v3h-4z", "#fff", 'opacity=".7"') + k.stroke("M52 77L41 78M108 77L119 78", "#1f1d2b", 2.4),
  hearts: (k) =>
    [LEFT.x, RIGHT.x].map((x) =>
      `<path transform="translate(${x} ${LEFT.y - 1})" d="M0 9C-15-1-11-13 0-5C11-13 15-1 0 9Z" fill="#ff4f8b"/>` +
      k.circle(x - 4, LEFT.y - 4, 2, "#fff")).join("") + k.stroke("M76 81h8M54 80L41 78M106 80L119 78", "#ff4f8b", 2.4),
};

/** Crown of the hats that sit on top of the head. */
const DOME = "M37 66C35 36 55 22 80 22C105 22 125 36 123 66Q80 52 37 66Z";

/** @type {Record<string, Drawer>} */
const HATS = {
  cap: (k, a) =>
    k.clay(DOME, a.hatC) + k.circle(80, 23, 3.4, shade(a.hatC, -0.15)) +
    k.clay("M44 62Q80 50 116 62Q120 74 80 74Q40 74 44 62Z", shade(a.hatC, -0.12)),
  backcap: (k, a) =>
    k.clay(DOME, a.hatC) + k.circle(80, 23, 3.4, shade(a.hatC, -0.15)) +
    k.path("M70 52h20v8H70z", "rgba(0,0,0,.3)") + k.stroke("M37 64Q80 52 123 64", shade(a.hatC, -0.2), 2.4),
  beanie: (k, a) =>
    k.clay("M37 64C35 30 55 16 80 16C105 16 125 30 123 64Q80 48 37 64Z", a.hatC) +
    k.clay("M34 58Q80 42 126 58L127 70Q80 54 33 72Z", shade(a.hatC, -0.14)) +
    [44, 54, 64, 74, 86, 96, 106, 116].map((x) => k.stroke(`M${x} 54v10`, "rgba(0,0,0,.15)", 1.6)).join("") +
    k.clay("M80 0a10 10 0 1 0 .1 0Z", "#fff"),
  bucket: (k, a) =>
    k.clay("M44 58C44 30 60 20 80 20C100 20 116 30 116 58Z", a.hatC) + k.stroke("M44 54Q80 62 116 54", a.acC, 4) +
    k.clay("M24 62Q80 48 136 62Q142 72 132 74Q80 62 28 74Q18 72 24 62Z", shade(a.hatC, -0.1)),
  bandana: (k, a) =>
    k.clay("M37 64C35 40 55 28 80 28C105 28 125 40 123 64Q80 50 37 64Z", a.hatC) +
    k.clay("M123 58L140 50L138 70Z", a.hatC) + k.clay("M122 64L136 78L124 80Z", shade(a.hatC, -0.12)) +
    [[54, 46], [70, 40], [90, 40], [106, 46]].map(([x, y]) => k.circle(x, y, 2, "#fff")).join(""),
};

/** @type {Record<string, Drawer>} Head extras that go under the hat. */
const HEAD_EXTRA_UNDER_HAT = {
  cat: (k, a) =>
    k.clay("M44 52L42 16L70 34Z", a.hairC) + k.clay("M116 52L118 16L90 34Z", a.hairC) +
    k.path("M48 46L47 24L63 35Z", "#ff9fc0") + k.path("M112 46L113 24L97 35Z", "#ff9fc0"),
};

/** @type {Record<string, Drawer>} Head extras that go over the hat. */
const HEAD_EXTRA_OVER_HAT = {
  flower: (k) =>
    `<g transform="translate(110 52)">` +
    [0, 1, 2, 3, 4].map((i) => k.circle(Math.cos(i * 1.2566) * 5, Math.sin(i * 1.2566) * 5, 4.6, "#a174ff")).join("") +
    k.circle(0, 0, 3.2, "#ffe36b") + `</g>`,
  bow: (k) => k.clay("M108 40L92 30V50Z", "#ff5c93") + k.clay("M108 40L124 30V50Z", "#ff5c93") + k.circle(108, 40, 4.4, "#e63e78"),
  stars: (k) => k.star(108, 54, 0.8, "#ffe36b") + k.star(98, 44, 0.65, "#7fe3c0"),
};

/** @type {Record<string, Drawer>} Parts of the top drawn behind the body. */
const TOP_BACK = {
  hoodie: (k, a) => k.clay("M56 122Q50 102 80 100Q110 102 104 122Z", shade(a.topC, -0.12)),
};

/** @type {Record<string, Drawer>} Details drawn over the body (clipped to it). */
const TOP_FRONT = {
  hoodie: (k) =>
    k.stroke("M75 118v12M85 118v12", "#fff", 2) + k.path("M64 146Q80 140 96 146L98 160Q80 166 62 160Z", "#000", 'opacity=".1"'),
  stripes: (k, a) => [128, 140, 152].map((y) => `<rect x="50" y="${y}" width="60" height="5.5" fill="${a.acC}"/>`).join(""),
  band: (k, a) => k.star(80, 138, 1.1, a.acC) + k.stroke("M68 154h24", a.acC, 2.4),
  jersey: (k, a) =>
    `<rect x="50" y="114" width="10" height="60" fill="${a.acC}"/><rect x="100" y="114" width="10" height="60" fill="${a.acC}"/>` +
    `<text x="80" y="152" text-anchor="middle" font-size="20" font-weight="800" font-family="Arial Black,Arial,sans-serif" fill="${a.acC}">10</text>`,
  overalls: (k, a) =>
    k.path("M64 136H96V176H64Z", a.acC) + k.path("M64 136L62 114H68L70 136ZM96 136L98 114H92L90 136Z", a.acC) +
    k.circle(67, 138, 2.2, "#ffe36b") + k.circle(93, 138, 2.2, "#ffe36b") + k.path("M73 144h14v10H73z", "#000", 'opacity=".1"'),
};

/** @type {Record<string, Drawer>} Neck and body accessories, drawn over the body. */
const ACCESSORIES = {
  phones: (k, a) =>
    k.stroke("M36 82C32 36 56 22 80 22C104 22 128 36 124 82", "#2b2233", 4.5) +
    `<rect x="30" y="72" width="13" height="22" rx="6.5" fill="${a.acC}"/><rect x="117" y="72" width="13" height="22" rx="6.5" fill="${a.acC}"/>`,
  chain: (k) => k.stroke("M68 114Q80 132 92 114", GOLD, 2.6, 'stroke-dasharray="4 2"'),
  pearls: (k) => [[68, 116], [72, 121], [77, 124], [83, 124], [88, 121], [92, 116]].map(([x, y]) => k.circle(x, y, 2.6, "#fff")).join(""),
  scarf: (k, a) =>
    k.clay("M60 110Q80 122 100 110L102 122Q80 134 58 122Z", a.acC) + k.clay("M86 124L96 124L98 146L86 144Z", shade(a.acC, -0.1)),
  cassette: (k, a) =>
    k.stroke("M68 114L80 132L92 114", "#2b2233", 1.6) +
    `<g transform="translate(80 136)"><rect x="-9" y="-6" width="18" height="12" rx="2.5" fill="${a.acC}"/><rect x="-6" y="-4" width="12" height="5" rx="1.5" fill="#fff"/>` +
    k.circle(-3, -1.5, 1.6, "#2b2233") + k.circle(3, -1.5, 1.6, "#2b2233") + `</g>`,
  camera: (k, a) =>
    k.stroke("M64 116L80 134L96 116", "#2b2233", 1.6) +
    `<g transform="translate(80 140)"><rect x="-11" y="-8" width="22" height="16" rx="4" fill="#f4f4f6"/><rect x="-11" y="-8" width="22" height="5" rx="2.5" fill="${a.acC}"/>` +
    k.circle(0, 2, 4.6, "#2b2233") + k.circle(0, 2, 2.2, "#6c86ff") + `</g>`,
  bag: (k, a) => k.stroke("M98 114L62 160", "#2b2233", 3) + k.clay("M48 152Q62 148 70 156V170H46Z", a.acC) + k.circle(58, 160, 2, "#fff"),
};

/** Style categories and the drawer tables that handle their options (used by tests). */
export const DRAWERS = {
  hair: [HAIR_BACK, HAIR_FRONT],
  top: [TOP_BACK, TOP_FRONT],
  ear: [EARRINGS],
  face: [FACE_MARKS],
  eyes: [EYES],
  mouth: [MOUTHS],
  gl: [GLASSES],
  pin: [HEAD_EXTRA_UNDER_HAT, HEAD_EXTRA_OVER_HAT],
  hat: [HATS],
  acc: [ACCESSORIES],
};

const draw = (table, option, k, a) => (table[option] ? table[option](k, a) : "");

/** Lightens (amount > 0) or darkens (amount < 0) a #rrggbb colour. Levels use it for their own drawings. */
export function shade(hex, amount) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const target = amount < 0 ? 0 : 255;
  return `rgb(${channels.map((c) => Math.round(c + (target - c) * Math.abs(amount))).join(",")})`;
}

/** Colour of the trousers: the accent colour with overalls, navy otherwise. Levels use it too. */
export const trousersColour = (a) => (a.top === "overalls" ? a.acC : TROUSERS);

/** One leg, standing, with a shoe seen from the front. */
function leg(k, a, x) {
  return k.stroke(`M${x} 170V212`, trousersColour(a), 19) +
    k.clay(`M${x - 11} 222Q${x - 12} 211 ${x} 210Q${x + 12} 211 ${x + 11} 222Q${x + 10} 229 ${x} 229Q${x - 10} 229 ${x - 11} 222Z`, a.acC) +
    k.path(`M${x - 10} 225H${x + 10}`, "none", 'stroke="#fff" stroke-width="2.4" opacity=".85"');
}

/** One arm hanging a little away from the body; `side` is -1 (left) or 1 (right). */
function arm(k, a, side) {
  const x = 80 + side * 23;
  const hand = { x: x + side * 7, y: 162 };
  return k.stroke(`M${x} 122L${x + side * 4} 144`, a.topC, 14) +
    k.stroke(`M${x + side * 4} 144L${hand.x} ${hand.y - 4}`, a.skin, 11) + k.circle(hand.x, hand.y, 7, a.skin);
}

function face(k, a) {
  const blush = a.face === "blush";
  const cheek = (x) => `<ellipse cx="${x}" cy="93" rx="${blush ? 8 : 6.4}" ry="${blush ? 5.5 : 4.2}" fill="${blush ? "#ff4f8b" : "#ff8fa3"}" opacity="${blush ? ".45" : ".5"}"/>`;
  const eye = EYES[a.eyes] || EYES.dots;
  const brow = shade(a.hairC, -0.2);
  return cheek(55) + cheek(105) +
    draw(FACE_MARKS, a.face, k, a) +
    k.stroke("M59 69Q66 65 73 69", brow, 2.4) + k.stroke("M87 69Q94 65 101 69", brow, 2.4) +
    eye(k, a, LEFT) + eye(k, a, RIGHT) +
    k.stroke("M78 89Q80 91 82 89", "rgba(0,0,0,.18)", 1.8) +
    draw(MOUTHS, a.mouth, k, a);
}

/**
 * The avatar's head with everything on it (hair, face, hat, glasses, extras),
 * in this file's drawing units. Levels that draw their own front-facing
 * figure (e.g. a band member holding an instrument) use it with
 * `avatarTorso` and their own arms and legs, so the player is recognisable.
 * Long hair goes behind the body: draw `avatarHairBehind` first.
 *
 * @param {Kit} k  @param {Avatar} a
 */
export function avatarHead(k, a) {
  return [
    a.hair === "long" ? "" : draw(HAIR_BACK, a.hair, k, a),
    [38, 122].map((x) => k.circle(x, 84, 8.5, a.skin) + k.circle(x, 84, 4, shade(a.skin, -0.12))).join(""),
    draw(EARRINGS, a.ear, k, a),
    k.clay(HEAD, a.skin),
    face(k, a),
    draw(HAIR_FRONT, a.hair, k, a),
    draw(HEAD_EXTRA_UNDER_HAT, a.pin, k, a),
    draw(HATS, a.hat, k, a),
    draw(HEAD_EXTRA_OVER_HAT, a.pin, k, a),
    draw(GLASSES, a.gl, k, a),
    a.acc === "phones" ? ACCESSORIES.phones(k, a) : "",
  ].join("");
}

/** Long hair, drawn behind the whole body. @param {Kit} k @param {Avatar} a */
export const avatarHairBehind = (k, a) => (a.hair === "long" ? draw(HAIR_BACK, a.hair, k, a) : "");

/**
 * The avatar's torso with its top, neck and neck/body accessory. Put
 * `torsoClip(k)` in the <defs> of the drawing that uses it. `arms` is
 * markup drawn over the top but under the neck and accessories.
 *
 * @param {Kit} k  @param {Avatar} a  @param {string} [arms]
 */
export function avatarTorso(k, a, arms = "") {
  return [
    draw(TOP_BACK, a.top, k, a),
    k.clay(TORSO, a.topC),
    `<g clip-path="url(#${k.ids.bodyClip})">${draw(TOP_FRONT, a.top, k, a)}</g>`,
    arms,
    k.clay("M73 104H87V116Q80 120 73 116Z", shade(a.skin, -0.12)),
    draw(ACCESSORIES, a.acc === "phones" ? "none" : a.acc, k, a),
  ].join("");
}

/** The clip path `avatarTorso` needs, for the drawing's <defs>. @param {Kit} k */
export const torsoClip = (k) => `<clipPath id="${k.ids.bodyClip}"><path d="${TORSO}"/></clipPath>`;

let instanceCount = 0;

/**
 * Draws an avatar. Each call uses fresh gradient ids, so the result can be
 * placed next to other avatars on the same page.
 *
 * @param {Avatar} a Selected option id per category (see DEFAULT_AVATAR).
 * @param {{ label?: string, backdrop?: boolean, crop?: "full" | "bust" | "head" }} [options]
 *   `backdrop: false` leaves out the coloured card behind the avatar.
 *   `crop: "head"` frames only the head (chat pictures, editor thumbnails),
 *   `crop: "bust"` head and body.
 * @returns {string} SVG markup.
 */
export function renderAvatar(a, { label = "Avatar", backdrop = true, crop = "full" } = {}) {
  const k = createSvgKit(`avatar-${++instanceCount}`);
  return [
    `<svg class="avatar" viewBox="${VIEW[crop] || VIEW.full}" role="img" aria-label="${label}">`,
    k.defs(torsoClip(k)),
    backdrop ? `<rect width="160" height="234" rx="28" fill="${a.bg}"/>` + k.circle(80, 120, 70, "#fff", ".35") : "",
    `<ellipse cx="80" cy="229" rx="34" ry="5" fill="#000" opacity=".13"/>`,
    avatarHairBehind(k, a),
    leg(k, a, 70),
    leg(k, a, 90),
    avatarTorso(k, a, arm(k, a, -1) + arm(k, a, 1)),
    avatarHead(k, a),
    "</svg>",
  ].join("");
}
