import { createSvgKit } from "./svg-kit.js";

/**
 * Procedural avatar drawn as a 200×220 SVG string.
 *
 * Layers are painted back to front (see `renderAvatar`). Each style option in
 * src/data/avatar-catalog.js maps to a drawer in one of the tables below; a
 * missing entry (e.g. "none", "tee") draws nothing. Every drawer receives the
 * SVG kit `k` and the avatar `a`.
 *
 * @typedef {ReturnType<typeof import("./svg-kit.js").createSvgKit>} Kit
 * @typedef {Record<string, string>} Avatar
 * @typedef {(k: Kit, a: Avatar) => string} Drawer
 */

const BODY = "M34 220Q34 166 100 160Q166 166 166 220Z";
const HEAD = "M100 38C140 38 156 66 156 98C156 134 134 156 100 156C66 156 44 134 44 98C44 66 60 38 100 38Z";
const DARK = "#2a2b3d";
const EYE_INK = "#26202a";
const LIPS = "#5a1a22";
const GOLD = "#f2c12e";
/** Fringe shared by most hairstyles, drawn over the forehead. */
const FRINGE = "M44 98Q38 34 100 30Q162 34 156 98Q148 66 100 62Q52 66 44 98Z";
const HAT_DOME = "M46 80Q44 28 100 26Q156 28 154 80Q100 66 46 80Z";
const BEANIE_CUFF = "M44 62Q100 50 156 62L158 84Q100 72 42 84Z";

/** @type {Record<string, Drawer>} Hair drawn behind the body and head. */
const HAIR_BACK = {
  long: (k, a) => k.clay("M38 76Q38 28 100 28Q162 28 162 76L168 184Q100 200 32 184Z", a.hairC),
  bob: (k, a) => k.clay("M38 78Q38 28 100 28Q162 28 162 78L160 142Q100 156 40 142Z", a.hairC),
  afro: (k, a) => k.clay("M100 4C150 4 172 40 164 80C160 100 40 100 36 80C28 40 50 4 100 4Z", a.hairC),
};

/** @type {Record<string, Drawer>} Parts of the top drawn behind the body. */
const TOP_BACK = {
  hoodie: (k, a) => k.clay("M50 148Q100 124 150 148L162 192Q100 170 38 192Z", a.topC),
};

/** @type {Record<string, Drawer>} Details drawn over the body. */
const TOP_FRONT = {
  hoodie: (k) =>
    k.stroke("M92 172v22", "#fff", 3) + k.stroke("M108 172v22", "#fff", 3) +
    k.path("M62 204Q100 194 138 204L142 220H58Z", "#000", 'opacity=".12"'),
  stripes: (k, a) =>
    `<g clip-path="url(#${k.ids.bodyClip})" fill="${a.acC}">` +
    [172, 188, 204].map((y) => `<rect x="30" y="${y}" width="140" height="8"/>`).join("") + `</g>`,
  jersey: (k, a) =>
    `<g clip-path="url(#${k.ids.bodyClip})" fill="${a.acC}"><rect x="30" y="160" width="28" height="60"/><rect x="142" y="160" width="28" height="60"/></g>` +
    `<text x="100" y="206" text-anchor="middle" font-size="30" font-weight="800" font-family="Arial Black,Arial,sans-serif" fill="${a.acC}">10</text>`,
  band: (k, a) => k.star(100, 192, 2, a.acC) + k.stroke("M72 212h56", a.acC, 3),
  overalls: (k, a) =>
    k.clay("M66 184H134V220H66Z", a.acC) +
    k.path("M66 184L76 163L87 166L79 184Z", a.acC) + k.path("M134 184L124 163L113 166L121 184Z", a.acC) +
    k.circle(73, 182, 3.2, "#ffe36b") + k.circle(127, 182, 3.2, "#ffe36b") +
    k.path("M88 198h24v14H88z", "#000", 'opacity=".12"'),
};

/** @type {Record<string, Drawer>} */
const EARRINGS = {
  hoops: (k) => k.stroke("M43 112a7 7 0 1 0 .1 0", GOLD, 3) + k.stroke("M157 112a7 7 0 1 0 .1 0", GOLD, 3),
  studs: (k) => k.circle(43, 113, 3.5, GOLD) + k.circle(157, 113, 3.5, GOLD),
  gems: (k) =>
    k.circle(43, 114, 4.5, "#4fd8ff") + k.circle(157, 114, 4.5, "#4fd8ff") +
    k.circle(42, 113, 1.5, "#fff") + k.circle(156, 113, 1.5, "#fff"),
};

/** @type {Record<string, Drawer>} Marks painted on the cheeks ("blush" only enlarges the cheeks). */
const FACE_MARKS = {
  freckles: (k) =>
    [[62, 112], [69, 118], [76, 112], [124, 112], [131, 118], [138, 112]]
      .map(([x, y]) => k.circle(x, y, 1.7, "#a85a34", ".7")).join(""),
  stripes: (k, a) =>
    k.stroke("M56 113h16", a.acC, 3.5) + k.stroke("M58 121h16", a.acC, 3.5) +
    k.stroke("M128 113h16", a.acC, 3.5) + k.stroke("M126 121h16", a.acC, 3.5),
  star: (k) => k.star(133, 122, 1.1, "#ffe36b"),
  bandaid: () =>
    `<g transform="rotate(-25 70 118)"><rect x="58" y="112" width="24" height="11" rx="5" fill="#f3c9a0" stroke="rgba(0,0,0,.2)"/><rect x="66" y="112" width="8" height="11" fill="#e8b184"/></g>`,
};

/** Classic oval eye with a highlight, the base for "dots" and "sleepy". */
const ovalEye = (k, x) => `<ellipse cx="${x}" cy="102" rx="5.5" ry="7" fill="${EYE_INK}"/>` + k.circle(x + 2, 99, 2, "#fff");

/** @type {Record<string, (k: Kit, a: Avatar, x: number) => string>} One eye centred on x. */
const EYES = {
  dots: (k, a, x) => ovalEye(k, x),
  happy: (k, a, x) => k.stroke(`M${x - 10} 105Q${x} 91 ${x + 10} 105`, EYE_INK, 4.5),
  sleepy: (k, a, x) =>
    ovalEye(k, x) + `<rect x="${x - 8}" y="92" width="16" height="10" fill="${a.skin}"/>` + k.stroke(`M${x - 7} 102h14`, EYE_INK, 3),
  sparkle: (k, a, x) =>
    `<ellipse cx="${x}" cy="102" rx="6.5" ry="8.5" fill="${EYE_INK}"/>` + k.circle(x + 2.5, 98, 2.6, "#fff") + k.circle(x - 2.5, 106, 1.4, "#fff"),
};

/** @type {Record<string, Drawer>} */
const MOUTHS = {
  smile: (k) => k.path("M84 124Q100 148 116 124Q100 130 84 124Z", LIPS) + k.path("M89 126Q100 131 111 126L109 131Q100 135 91 131Z", "#fff"),
  grin: (k) =>
    k.path("M82 122Q100 154 118 122Z", LIPS) + k.path("M85 123Q100 128 115 123L113 130Q100 134 87 130Z", "#fff") +
    k.path("M92 142Q100 136 108 142Q100 148 92 142Z", "#ff7a8a"),
  smirk: (k) => k.stroke("M86 128Q100 138 118 122", LIPS, 4.5),
  tongue: (k) => k.path("M86 124Q100 142 114 124Z", LIPS) + k.path("M94 134Q100 154 106 134Z", "#ff6f8a"),
  oh: () => `<ellipse cx="100" cy="131" rx="7" ry="9" fill="${LIPS}"/>`,
};

/** @type {Record<string, Drawer>} */
const GLASSES = {
  round: (k) =>
    k.stroke("M64 102a15 15 0 1 0 30 0a15 15 0 1 0-30 0", "#ff7a45", 5) +
    k.stroke("M106 102a15 15 0 1 0 30 0a15 15 0 1 0-30 0", "#ff7a45", 5) + k.stroke("M94 100h12", "#ff7a45", 4.5),
  square: (k) =>
    [62, 104].map((x) => `<rect x="${x}" y="89" width="34" height="26" rx="8" fill="rgba(255,255,255,.2)" stroke="#2fc4b2" stroke-width="5"/>`).join("") +
    k.stroke("M96 99h8", "#2fc4b2", 4.5),
  sun: (k) =>
    k.path("M60 92H98V108Q98 118 80 118Q60 118 60 108Z", DARK) + k.path("M102 92H140V108Q140 118 120 118Q102 118 102 108Z", DARK) +
    k.stroke("M98 96h4", DARK, 4) + k.stroke("M66 97Q72 94 80 95", "rgba(255,255,255,.55)", 3),
  shutter: (k) =>
    [62, 102].map((x) =>
      `<rect x="${x}" y="88" width="36" height="26" rx="8" fill="#ff9a3c"/>` +
      [95, 101, 107].map((y) => k.stroke(`M${x + 5} ${y}h26`, "#fff", 2.4)).join(""),
    ).join(""),
  pixel: () => `<rect x="54" y="90" width="92" height="17" fill="#ffe21f"/><rect x="54" y="90" width="92" height="5" fill="#fff" opacity=".4"/>`,
  hearts: (k) =>
    [79, 121].map((x) =>
      `<path transform="translate(${x} 101) scale(1.9)" d="M0 8C-14-2-10-13 0-6C10-13 14-2 0 8Z" fill="#ff4f8b"/>` + k.circle(x - 5, 97, 2.5, "#fff"),
    ).join(""),
};

/** @type {Record<string, Drawer>} Hair drawn over the forehead. */
const HAIR_FRONT = {
  short: (k, a) => k.clay(FRINGE, a.hairC),
  long: (k, a) => k.clay(FRINGE, a.hairC),
  bob: (k, a) => k.clay(FRINGE, a.hairC),
  bun: (k, a) => k.clay(FRINGE, a.hairC) + k.clay("M82 24a18 18 0 1 0 36 0a18 18 0 1 0-36 0", a.hairC),
  buns: (k, a) =>
    k.clay(FRINGE, a.hairC) +
    k.clay("M40 40a15 15 0 1 0 30 0a15 15 0 1 0-30 0", a.hairC) + k.clay("M130 40a15 15 0 1 0 30 0a15 15 0 1 0-30 0", a.hairC),
  buzz: (k, a) => k.clay("M48 90Q52 42 100 40Q148 42 152 90Q144 64 100 60Q56 64 48 90Z", a.hairC),
  afro: (k, a) => k.clay("M50 92Q50 64 100 58Q150 64 150 92Q140 72 100 70Q60 72 50 92Z", a.hairC),
  curls: (k, a) =>
    [[58, 62, 23], [84, 42, 25], [116, 42, 25], [142, 62, 23], [100, 58, 22]]
      .map(([x, y, r]) => k.circle(x, y, r, a.hairC) + k.circle(x - 7, y - 8, r / 2.4, "#fff", ".25")).join(""),
  mohawk: (k, a) =>
    k.path("M48 90Q52 52 100 50Q148 52 152 90Q144 66 100 64Q56 66 48 90Z", a.hairC, 'opacity=".45"') +
    k.clay("M80 68L76 20Q100 -4 124 20L120 68Z", a.hairC),
};

/** @type {Record<string, Drawer>} Head extras that go under the hat. */
const HEAD_EXTRA_UNDER_HAT = {
  cat: (k, a) =>
    k.clay("M50 68L46 18L90 42Z", a.hairC) + k.clay("M150 68L154 18L110 42Z", a.hairC) +
    k.path("M56 56L55 30L78 43Z", "#ff9ab8") + k.path("M144 56L145 30L122 43Z", "#ff9ab8"),
};

/** Crown of the cap, shared by "cap" and "backcap". */
const capDome = (k, a) =>
  k.clay(HAT_DOME, a.hatC) + k.stroke("M100 28Q93 52 100 70", "rgba(0,0,0,.2)", 2) +
  k.circle(100, 27, 4, a.hatC) + k.light("M96 24a4 4 0 1 0 8 0a4 4 0 1 0-8 0");

/** @type {Record<string, Drawer>} */
const HATS = {
  cap: (k, a) =>
    capDome(k, a) + k.clay("M100 74L186 88Q194 102 150 106L100 92Z", a.hatC) +
    k.path("M100 92L150 106Q194 102 186 88Z", "#000", 'opacity=".18"'),
  backcap: (k, a) => capDome(k, a) + k.path("M82 72h36v7H82z", "rgba(0,0,0,.28)") + k.clay("M153 70L172 76L153 84Z", a.hatC),
  beanie: (k, a) => {
    let s = k.clay("M46 76Q44 30 100 28Q156 30 154 76Z", a.hatC) + k.clay(BEANIE_CUFF, a.hatC) + k.path(BEANIE_CUFF, "#fff", 'opacity=".22"');
    for (let i = 0; i < 10; i++) s += k.stroke(`M${53 + i * 10.4} ${65 + (i % 2)}v15`, "rgba(0,0,0,.16)", 2);
    return s + k.clay("M88 24a12 12 0 1 0 24 0a12 12 0 1 0-24 0", "#fff");
  },
  bucket: (k, a) =>
    k.clay("M54 74Q54 28 100 28Q146 28 146 74Z", a.hatC) + k.stroke("M54 66Q100 76 146 66", a.acC, 6) +
    k.clay("M26 78Q100 62 174 78Q184 94 100 96Q16 94 26 78Z", a.hatC) +
    k.stroke("M34 82Q100 94 166 82", "rgba(0,0,0,.2)", 2, 'stroke-dasharray="4 4"'),
  bandana: (k, a) =>
    k.clay("M44 74Q100 52 156 74L156 90Q100 70 44 90Z", a.hatC) + k.clay("M154 80L178 68L174 100Z", a.hatC) +
    [[64, 77], [82, 70], [100, 67], [118, 70], [136, 77]].map(([x, y]) => k.circle(x, y, 2.4, "#fff")).join(""),
};

/** @type {Record<string, Drawer>} Head extras that go over the hat. */
const HEAD_EXTRA_OVER_HAT = {
  flower: (k) => {
    let s = `<g transform="translate(142 50)">`;
    for (let i = 0; i < 5; i++) s += k.circle(Math.cos(i * 1.2566) * 8, Math.sin(i * 1.2566) * 8, 7, "#a174ff");
    return s + k.circle(0, 0, 5, "#ffe36b") + `</g>`;
  },
  bow: (k) => k.clay("M138 48L116 36V60Z", "#ff5c93") + k.clay("M138 48L160 36V60Z", "#ff5c93") + k.circle(138, 48, 6, "#e63e78"),
  stars: (k) => k.star(60, 54, 1.2, "#ffe36b") + k.star(78, 40, 0.9, "#7fe3c0"),
};

/** @type {Record<string, Drawer>} Neck and body accessories, drawn last. */
const ACCESSORIES = {
  phones: (k) =>
    k.stroke("M44 104Q40 30 100 30Q160 30 156 104", DARK, 7) +
    `<rect x="34" y="92" width="16" height="32" rx="8" fill="#ff5a3c"/><rect x="150" y="92" width="16" height="32" rx="8" fill="#ff5a3c"/>`,
  chain: (k) => k.stroke("M66 160Q100 194 134 160", GOLD, 6, 'stroke-dasharray="7 3"'),
  pearls: (k) => {
    let s = "";
    for (let i = 0; i <= 8; i++) {
      // Nine pearls along the quadratic curve (66,160) → (134,160) through (100,194).
      const q = i / 8;
      const y = 160 * (1 - q) * (1 - q) + 388 * q * (1 - q) + 160 * q * q;
      s += k.circle(66 + 68 * q, y, 4.2, "#fff") + k.circle(65 + 68 * q, 159 + (y - 160), 1.4, "#dfe6ee");
    }
    return s;
  },
  scarf: (k, a) =>
    k.clay("M60 150Q100 172 140 150L142 168Q100 190 58 168Z", a.acC) + k.clay("M116 168L134 172L130 204L114 200Z", a.acC) +
    k.stroke("M64 160Q100 180 138 160", a.hatC, 4),
  cassette: (k, a) =>
    k.stroke("M72 158L100 194L128 158", DARK, 2.5) +
    `<g transform="translate(100 196)"><rect x="-17" y="-11" width="34" height="22" rx="4" fill="${a.acC}"/><rect x="-12" y="-7" width="24" height="9" rx="2" fill="#fff"/>` +
    k.circle(-6, -2.5, 3, DARK) + k.circle(6, -2.5, 3, DARK) + `</g>`,
  camera: (k, a) =>
    k.stroke("M72 158L100 192L128 158", DARK, 2.5) +
    `<g transform="translate(100 198)"><rect x="-20" y="-13" width="40" height="26" rx="6" fill="#f4f4f6"/><rect x="-20" y="-13" width="40" height="9" rx="4" fill="${a.acC}"/>` +
    k.circle(0, 3, 8, DARK) + k.circle(0, 3, 4, "#6c86ff") + `</g>`,
  bag: (k, a) =>
    k.path("M60 168L72 161L160 212L158 220L142 220Z", DARK) + k.circle(96, 186, 5, a.acC) + k.circle(118, 200, 4, "#ff5a3c") +
    k.clay("M138 196Q158 190 168 206V220H136Z", DARK),
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

function open(k, a, label) {
  return `<svg viewBox="0 0 200 220" role="img" aria-label="${label}">` +
    k.defs(`<clipPath id="${k.ids.bodyClip}"><path d="${BODY}"/></clipPath>`) +
    `<rect width="200" height="220" rx="30" fill="${a.bg}"/>` + k.circle(100, 110, 86, "#fff", ".3") +
    `<ellipse cx="100" cy="213" rx="72" ry="8" fill="#000" opacity=".13"/>`;
}

const neck = (k, a) => k.clay("M84 132H116V168Q100 178 84 168Z", a.skin) + k.stroke("M80 162Q100 184 120 162", "rgba(0,0,0,.25)", 3);

const ears = (k, a) =>
  [43, 157].map((x) => k.circle(x, 102, 11, a.skin) + `<ellipse cx="${x}" cy="102" rx="5" ry="7" fill="#000" opacity=".1"/>`).join("");

function cheeks(k, a) {
  const blush = a.face === "blush";
  return [66, 134].map((x) => k.circle(x, 120, blush ? 12 : 9, blush ? "#ff4f8b" : "#ff6a6a", blush ? ".45" : ".28")).join("");
}

const brows = (k) => k.stroke("M67 86Q79 79 91 85", "#2a1f24", 4) + k.stroke("M109 85Q121 79 133 86", "#2a1f24", 4);

function eyes(k, a) {
  const eye = EYES[a.eyes];
  return eye ? eye(k, a, 79) + eye(k, a, 121) : "";
}

const nose = (k) => k.stroke("M97 113Q100 118 104 114", "rgba(0,0,0,.25)", 2.5);

let instanceCount = 0;

/**
 * Draws an avatar. Each call uses fresh gradient ids, so the result can be
 * placed next to other avatars on the same page.
 *
 * @param {Avatar} a Selected option id per category (see DEFAULT_AVATAR).
 * @param {{ label?: string }} [options]
 * @returns {string} SVG markup.
 */
export function renderAvatar(a, { label = "Avatar" } = {}) {
  const k = createSvgKit(`avatar-${++instanceCount}`);
  return [
    open(k, a, label),
    draw(HAIR_BACK, a.hair, k, a),
    draw(TOP_BACK, a.top, k, a),
    k.clay(BODY, a.topC),
    draw(TOP_FRONT, a.top, k, a),
    neck(k, a),
    ears(k, a),
    draw(EARRINGS, a.ear, k, a),
    k.clay(HEAD, a.skin),
    cheeks(k, a),
    draw(FACE_MARKS, a.face, k, a),
    brows(k),
    eyes(k, a),
    nose(k),
    draw(MOUTHS, a.mouth, k, a),
    draw(GLASSES, a.gl, k, a),
    draw(HAIR_FRONT, a.hair, k, a),
    draw(HEAD_EXTRA_UNDER_HAT, a.pin, k, a),
    draw(HATS, a.hat, k, a),
    draw(HEAD_EXTRA_OVER_HAT, a.pin, k, a),
    draw(ACCESSORIES, a.acc, k, a),
    "</svg>",
  ].join("");
}
