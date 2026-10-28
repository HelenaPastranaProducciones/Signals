import { createSvgKit } from "./svg-kit.js";

/**
 * The player's avatar: a small, cute full-body figure in a three-quarter
 * view, facing right, drawn as SVG. The same drawing is used everywhere
 * (title, lobby, editor and inside the levels), so what the player builds
 * is exactly what plays.
 *
 * Layers are painted back to front (see `renderAvatar`). Each style option in
 * src/data/avatar-catalog.js maps to a drawer in one of the tables below; a
 * missing entry (e.g. "none", "tee") draws nothing. Every drawer receives the
 * SVG kit `k` and the avatar `a`.
 *
 * Arms and legs are nested groups with classes, so a level can animate them
 * with CSS (`transform-origin: 0 0` turns each part around its joint):
 * `.body` > `.thigh-front/.thigh-back` > `.shin-…`, and
 * `.upperarm-front/.upperarm-back` > `.forearm-…`.
 *
 * Drawing units: 160 × 234, feet on y = 229.
 *
 * @typedef {ReturnType<typeof import("./svg-kit.js").createSvgKit>} Kit
 * @typedef {Record<string, string>} Avatar
 * @typedef {(k: Kit, a: Avatar) => string} Drawer
 */

const INK = "#2b2233";
const LIPS = "#7a2f3d";
const GOLD = "#f2c12e";
const TROUSERS = "#414a7a";

/** Size of the drawing, and the frames shown by `renderAvatar` (x, y, width, height). */
const VIEW = { full: "0 0 160 234", bust: "14 4 140 176", head: "18 0 132 124" };

// Head and body shapes.
const HEAD = "M84 36C110 36 124 54 124 76C124 98 108 112 84 112C58 112 42 98 42 76C42 54 58 36 84 36Z";
const TORSO = "M64 116Q84 108 104 116L109 164Q84 174 59 164Z";

// Hair shapes. FRINGE covers the top of the head and ends in soft locks over the forehead.
const FRINGE =
  "M42 86C36 52 56 30 86 30C112 30 128 46 126 70" +
  "Q120 64 116 58Q112 66 104 64Q100 56 96 52Q90 62 80 60Q76 54 72 50Q64 60 56 62Q52 72 50 84Q46 82 42 86Z";
const CAP_BACK = "M38 82C32 46 54 26 84 26C114 26 132 46 128 78C122 60 104 50 84 50C64 50 48 60 38 82Z";

/** @type {Record<string, Drawer>} Hair drawn behind the head (and, when long, behind the body). */
const HAIR_BACK = {
  short: (k, a) => k.clay(CAP_BACK, shade(a.hairC, -0.12)),
  bob: (k, a) => k.clay("M38 80C34 44 56 26 84 26C112 26 132 44 128 80L130 112Q122 122 112 114L110 100H56L54 114Q44 122 36 112Z", shade(a.hairC, -0.12)),
  long: (k, a) => k.clay("M38 80C34 44 56 26 84 26C112 26 132 44 128 80L132 150Q120 166 104 156L102 118H64L60 158Q44 166 34 150Z", shade(a.hairC, -0.12)),
  bun: (k, a) => k.clay(CAP_BACK, shade(a.hairC, -0.12)) + k.clay("M62 12a17 17 0 1 0 .1 0Z", a.hairC),
  buns: (k, a) =>
    k.clay(CAP_BACK, shade(a.hairC, -0.12)) + k.clay("M52 18a15 15 0 1 0 .1 0Z", a.hairC) + k.clay("M114 16a15 15 0 1 0 .1 0Z", a.hairC),
  curls: (k, a) =>
    [[44, 70, 14], [48, 46, 16], [66, 32, 17], [88, 28, 17], [110, 34, 16], [124, 54, 14], [40, 92, 11], [128, 76, 11]]
      .map(([x, y, r]) => k.clay(`M${x} ${y - r}a${r} ${r} 0 1 0 .1 0Z`, shade(a.hairC, -0.12))).join(""),
  afro: (k, a) => k.clay("M84 4C122 4 142 30 140 64C138 92 120 100 84 100C48 100 28 92 28 64C26 30 46 4 84 4Z", shade(a.hairC, -0.08)),
};

/** @type {Record<string, Drawer>} Hair drawn over the forehead. */
const HAIR_FRONT = {
  short: (k, a) => k.clay(FRINGE, a.hairC) + shine(k, "M64 40Q78 34 92 36"),
  bob: (k, a) => k.clay(FRINGE, a.hairC) + shine(k, "M64 40Q78 34 92 36"),
  long: (k, a) => k.clay(FRINGE, a.hairC) + shine(k, "M64 40Q78 34 92 36"),
  bun: (k, a) => k.clay(FRINGE, a.hairC) + shine(k, "M64 40Q78 34 92 36"),
  buns: (k, a) => k.clay(FRINGE, a.hairC) + shine(k, "M64 40Q78 34 92 36"),
  buzz: (k, a) =>
    k.path("M44 80C40 50 58 34 84 34C110 34 126 48 124 70Q116 56 98 54Q80 52 64 58Q50 64 44 80Z", a.hairC, 'opacity=".92"'),
  curls: (k, a) =>
    [[54, 52, 12], [68, 42, 13], [84, 38, 13], [100, 42, 12], [114, 52, 11], [60, 62, 9], [106, 58, 8]]
      .map(([x, y, r]) => k.clay(`M${x} ${y - r}a${r} ${r} 0 1 0 .1 0Z`, a.hairC)).join(""),
  afro: (k, a) => k.clay("M44 72C42 46 60 34 84 34C108 34 126 46 124 68Q108 56 84 56Q60 56 44 72Z", a.hairC),
  mohawk: (k, a) =>
    k.path("M46 80C42 52 58 38 84 38C110 38 124 50 122 70Q110 56 84 56Q60 56 46 80Z", a.hairC, 'opacity=".35"') +
    k.clay("M64 46Q62 30 70 14Q76 26 80 30Q82 16 92 4Q94 20 96 26Q102 14 112 10Q110 28 108 46Q86 38 64 46Z", a.hairC),
};

/** A soft highlight stroke on hair. */
const shine = (k, d) => k.stroke(d, "#fff", 4, 'opacity=".28"');

/** Eyes at the near (x 104) and far (x 78) side of the face. */
const NEAR = { x: 104, y: 82, rx: 6.4, ry: 8.4 };
const FAR = { x: 77, y: 82, rx: 5.4, ry: 8 };

const ovalEye = (k, e) =>
  `<ellipse cx="${e.x}" cy="${e.y}" rx="${e.rx}" ry="${e.ry}" fill="${INK}"/>` +
  k.circle(e.x + 1.8, e.y - 3, e.rx * 0.42, "#fff") + k.circle(e.x - 2, e.y + 3.2, e.rx * 0.2, "#fff");

/** @type {Record<string, (k: Kit, a: Avatar, e: typeof NEAR) => string>} One eye. */
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
  smile: (k) => k.stroke("M86 98Q92 104 98 98", LIPS, 2.6),
  grin: (k) => k.path("M84 96Q92 108 101 96Q92 99 84 96Z", LIPS) + k.path("M86 97Q92 99 99 97L98 99.5Q92 101 87 99.5Z", "#fff"),
  smirk: (k) => k.stroke("M86 100Q94 101 99 95", LIPS, 2.6),
  tongue: (k) => k.path("M85 96Q92 106 100 96Z", LIPS) + k.path("M89 100Q92 108 97 100Z", "#ff6f8a"),
  oh: () => `<ellipse cx="92" cy="100" rx="3.6" ry="4.4" fill="${LIPS}"/>`,
};

/** @type {Record<string, Drawer>} Marks painted on the cheeks ("blush" only makes the cheeks pinker). */
const FACE_MARKS = {
  freckles: (k) =>
    [[66, 90], [70, 94], [74, 90], [108, 91], [112, 95], [116, 91]].map(([x, y]) => k.circle(x, y, 1.3, "#a85a34", ".7")).join(""),
  stripes: (k, a) => k.stroke("M62 92h9", a.acC, 2.6) + k.stroke("M63 97h9", a.acC, 2.6) + k.stroke("M110 92h9", a.acC, 2.6) + k.stroke("M109 97h9", a.acC, 2.6),
  star: (k) => k.star(114, 94, 0.62, "#ffe36b"),
  bandaid: () =>
    `<g transform="rotate(-18 70 94)"><rect x="62" y="90" width="17" height="8" rx="4" fill="#f3c9a0" stroke="rgba(0,0,0,.18)"/><rect x="68" y="90" width="5" height="8" fill="#e8b184"/></g>`,
};

/** @type {Record<string, Drawer>} */
const EARRINGS = {
  hoops: (k) => k.stroke("M45 98a5 5 0 1 0 .1 0", GOLD, 2.2),
  studs: (k) => k.circle(45, 96, 2.6, GOLD),
  gems: (k) => k.circle(45, 98, 3.4, "#4fd8ff") + k.circle(44, 97, 1.1, "#fff"),
};

/** Lens shapes around both eyes; `lens(x, y, w, h)` draws one. */
const pair = (lens) => lens(NEAR.x, NEAR.y, 21, 18) + lens(FAR.x, FAR.y, 17, 17);

/** @type {Record<string, Drawer>} */
const GLASSES = {
  round: (k) =>
    pair((x, y, w, h) => `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h / 2}" fill="rgba(255,255,255,.18)" stroke="#ff7a45" stroke-width="2.6"/>`) +
    k.stroke("M86 81h8", "#ff7a45", 2.4) + k.stroke("M68 80L48 78", "#ff7a45", 2.4),
  square: (k) =>
    pair((x, y, w, h) => `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="5" fill="rgba(255,255,255,.18)" stroke="#2fc4b2" stroke-width="2.6"/>`) +
    k.stroke("M86 81h8", "#2fc4b2", 2.4) + k.stroke("M68 80L48 78", "#2fc4b2", 2.4),
  sun: (k) =>
    pair((x, y, w, h) => `<path d="M${x - w / 2} ${y - h / 2}H${x + w / 2}V${y}Q${x + w / 2} ${y + h / 2} ${x} ${y + h / 2}Q${x - w / 2} ${y + h / 2} ${x - w / 2} ${y}Z" fill="#1f1d2b"/>`) +
    k.stroke("M86 76h8", "#1f1d2b", 2.6) + k.stroke("M68 76L48 78", "#1f1d2b", 2.4) + k.stroke("M97 76l5-1", "#fff", 2, 'opacity=".55"'),
  shutter: (k, a) =>
    pair((x, y, w, h) =>
      `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="4" fill="${a.acC}"/>` +
      [-4, 0, 4].map((d) => k.stroke(`M${x - w / 2 + 3} ${y + d}h${w - 6}`, "#fff", 1.6)).join("")) +
    k.stroke("M68 80L48 78", a.acC, 2.4),
  pixel: (k) =>
    k.path("M64 74H116V80H112V88H98V80H94V88H80V80H70V88H66V80H64Z", "#1f1d2b") +
    k.path("M101 76h4v3h-4zM83 76h4v3h-4z", "#fff", 'opacity=".7"') + k.stroke("M64 77L48 78", "#1f1d2b", 2.4),
  hearts: (k) =>
    [[NEAR.x, 1.05], [FAR.x, 0.9]].map(([x, s]) =>
      `<path transform="translate(${x} ${NEAR.y - 1}) scale(${s})" d="M0 9C-15-1-11-13 0-5C11-13 15-1 0 9Z" fill="#ff4f8b"/>` +
      k.circle(x - 4, NEAR.y - 4, 2, "#fff")).join("") + k.stroke("M68 80L48 78", "#ff4f8b", 2.4),
};

/** Crown of the hats that sit on top of the head. */
const DOME = "M40 66C38 36 58 22 84 22C110 22 130 36 128 64Q84 50 40 66Z";

/** @type {Record<string, Drawer>} */
const HATS = {
  cap: (k, a) =>
    k.clay(DOME, a.hatC) + k.circle(84, 23, 3.4, shade(a.hatC, -0.15)) +
    k.clay("M116 56Q140 54 150 64Q140 70 120 66Z", shade(a.hatC, -0.12)),
  backcap: (k, a) =>
    k.clay(DOME, a.hatC) + k.circle(84, 23, 3.4, shade(a.hatC, -0.15)) +
    k.clay("M48 58Q28 56 20 66Q30 72 46 68Z", shade(a.hatC, -0.12)),
  beanie: (k, a) =>
    k.clay("M40 64C38 30 58 16 84 16C110 16 130 30 128 62Q84 48 40 64Z", a.hatC) +
    k.clay("M38 58Q84 42 130 56L131 68Q84 54 37 70Z", shade(a.hatC, -0.14)) +
    [48, 58, 68, 78, 88, 98, 108, 118].map((x) => k.stroke(`M${x} 54v10`, "rgba(0,0,0,.15)", 1.6)).join("") +
    k.clay("M84 0a10 10 0 1 0 .1 0Z", "#fff"),
  bucket: (k, a) =>
    k.clay("M48 58C48 30 64 20 84 20C104 20 120 30 120 56Z", a.hatC) + k.stroke("M48 54Q84 62 120 52", a.acC, 4) +
    k.clay("M28 60Q84 46 140 58Q146 68 136 70Q84 60 32 72Q22 70 28 60Z", shade(a.hatC, -0.1)),
  bandana: (k, a) =>
    k.clay("M40 64C38 40 58 28 84 28C110 28 128 40 126 62Q84 48 40 64Z", a.hatC) +
    k.clay("M42 60L24 54L28 72Z", a.hatC) + k.clay("M42 64L28 78L40 80Z", shade(a.hatC, -0.12)) +
    [[60, 44], [78, 38], [96, 38], [112, 46]].map(([x, y]) => k.circle(x, y, 2, "#fff")).join(""),
};

/** @type {Record<string, Drawer>} Head extras that go under the hat. */
const HEAD_EXTRA_UNDER_HAT = {
  cat: (k, a) =>
    k.clay("M48 52L46 18L72 36Z", a.hairC) + k.clay("M100 34L118 10L124 46Z", a.hairC) +
    k.path("M52 46L51 26L66 37Z", "#ff9fc0") + k.path("M105 34L117 18L120 40Z", "#ff9fc0"),
};

/** @type {Record<string, Drawer>} Head extras that go over the hat. */
const HEAD_EXTRA_OVER_HAT = {
  flower: (k) =>
    `<g transform="translate(56 50)">` +
    [0, 1, 2, 3, 4].map((i) => k.circle(Math.cos(i * 1.2566) * 5, Math.sin(i * 1.2566) * 5, 4.6, "#a174ff")).join("") +
    k.circle(0, 0, 3.2, "#ffe36b") + `</g>`,
  bow: (k) => k.clay("M58 40L42 30V50Z", "#ff5c93") + k.clay("M58 40L74 30V50Z", "#ff5c93") + k.circle(58, 40, 4.4, "#e63e78"),
  stars: (k) => k.star(54, 56, 0.8, "#ffe36b") + k.star(64, 44, 0.65, "#7fe3c0"),
};

/** @type {Record<string, Drawer>} Parts of the top drawn behind the body. */
const TOP_BACK = {
  hoodie: (k, a) => k.clay("M62 122Q56 104 74 104Q90 104 92 114Z", shade(a.topC, -0.12)),
};

/** @type {Record<string, Drawer>} Details drawn over the body (clipped to it). */
const TOP_FRONT = {
  hoodie: (k) =>
    k.stroke("M88 118v12M96 118v10", "#fff", 2) + k.path("M70 146Q84 140 100 146L102 160Q84 166 68 160Z", "#000", 'opacity=".1"'),
  stripes: (k, a) => [128, 140, 152].map((y) => `<rect x="50" y="${y}" width="70" height="5.5" fill="${a.acC}"/>`).join(""),
  band: (k, a) => k.star(86, 138, 1.1, a.acC) + k.stroke("M74 154h24", a.acC, 2.4),
  jersey: (k, a) =>
    `<rect x="50" y="114" width="16" height="60" fill="${a.acC}"/>` +
    `<text x="88" y="152" text-anchor="middle" font-size="20" font-weight="800" font-family="Arial Black,Arial,sans-serif" fill="${a.acC}">10</text>`,
  overalls: (k, a) =>
    k.path("M68 136H104V176H64Z", a.acC) + k.path("M70 136L66 114H72L76 136ZM98 136L100 114H106L104 136Z", a.acC) +
    k.circle(72, 138, 2.2, "#ffe36b") + k.circle(100, 138, 2.2, "#ffe36b") + k.path("M78 144h14v10H78z", "#000", 'opacity=".1"'),
};

/** @type {Record<string, Drawer>} Neck and body accessories, drawn over the body. */
const ACCESSORIES = {
  phones: (k, a) =>
    k.stroke("M42 82C38 36 62 24 84 24C108 24 124 34 124 56", "#2b2233", 4.5) +
    `<rect x="36" y="72" width="14" height="22" rx="7" fill="${a.acC}"/>` + k.circle(43, 83, 3, "#2b2233", ".35"),
  chain: (k) => k.stroke("M72 114Q86 132 100 114", GOLD, 2.6, 'stroke-dasharray="4 2"'),
  pearls: (k) => [[73, 116], [77, 121], [82, 124], [88, 124], [94, 121], [98, 116]].map(([x, y]) => k.circle(x, y, 2.6, "#fff")).join(""),
  scarf: (k, a) =>
    k.clay("M66 110Q86 122 104 110L106 122Q86 134 64 122Z", a.acC) + k.clay("M92 124L102 124L104 146L92 144Z", shade(a.acC, -0.1)),
  cassette: (k, a) =>
    k.stroke("M74 114L86 132L98 114", "#2b2233", 1.6) +
    `<g transform="translate(86 136)"><rect x="-9" y="-6" width="18" height="12" rx="2.5" fill="${a.acC}"/><rect x="-6" y="-4" width="12" height="5" rx="1.5" fill="#fff"/>` +
    k.circle(-3, -1.5, 1.6, "#2b2233") + k.circle(3, -1.5, 1.6, "#2b2233") + `</g>`,
  camera: (k, a) =>
    k.stroke("M70 116L88 134L100 116", "#2b2233", 1.6) +
    `<g transform="translate(88 140)"><rect x="-11" y="-8" width="22" height="16" rx="4" fill="#f4f4f6"/><rect x="-11" y="-8" width="22" height="5" rx="2.5" fill="${a.acC}"/>` +
    k.circle(0, 2, 4.6, "#2b2233") + k.circle(0, 2, 2.2, "#6c86ff") + `</g>`,
  bag: (k, a) => k.stroke("M100 116L64 160", "#2b2233", 3) + k.clay("M52 152Q66 148 74 156V170H50Z", a.acC) + k.circle(62, 160, 2, "#fff"),
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

/** Lightens (amount > 0) or darkens (amount < 0) a #rrggbb colour. */
function shade(hex, amount) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const target = amount < 0 ? 0 : 255;
  return `rgb(${channels.map((c) => Math.round(c + (target - c) * Math.abs(amount))).join(",")})`;
}

/** One leg from the hip: thigh, then shin and shoe, each turning at its joint. */
function leg(k, a, side, x) {
  const back = side === "back";
  const trousers = a.top === "overalls" ? a.acC : TROUSERS;
  const colour = back ? shade(trousers, -0.18) : trousers;
  const shoe = back ? shade(a.acC, -0.15) : a.acC;
  return `<g transform="translate(${x} 170)"><g class="thigh thigh-${side}" transform="rotate(${back ? 4 : -4})">${k.stroke("M0 0V24", colour, 20)}` +
    `<g transform="translate(0 24)"><g class="shin shin-${side}">${k.stroke("M0 0V20", colour, 17)}` +
    k.clay("M-10 20Q-12 34-6 35H16Q22 32 18 26Q9 18-10 20Z", shoe) +
    k.path("M-9 33H17", "none", 'stroke="#fff" stroke-width="2.6" opacity=".85"') +
    `</g></g></g></g>`;
}

/** One arm from the shoulder: sleeve, then forearm and hand. */
function arm(k, a, side, x) {
  const back = side === "back";
  const sleeve = back ? shade(a.topC, -0.15) : a.topC;
  const skin = back ? shade(a.skin, -0.1) : a.skin;
  return `<g transform="translate(${x} 122)"><g class="upperarm upperarm-${side}" transform="rotate(${back ? 14 : -14})">${k.stroke("M0 0V22", sleeve, 14)}` +
    `<g transform="translate(0 22)"><g class="forearm forearm-${side}" transform="rotate(-10)">${k.stroke("M0 0V16", skin, 11)}${k.circle(0, 19, 7, skin)}` +
    `</g></g></g></g>`;
}

function face(k, a) {
  const blush = a.face === "blush";
  const cheek = (x, rx) => `<ellipse cx="${x}" cy="93" rx="${blush ? rx + 2 : rx}" ry="${blush ? 5.5 : 4.2}" fill="${blush ? "#ff4f8b" : "#ff8fa3"}" opacity="${blush ? ".45" : ".5"}"/>`;
  const eye = EYES[a.eyes] || EYES.dots;
  return cheek(112, 7) + cheek(70, 5.5) +
    draw(FACE_MARKS, a.face, k, a) +
    k.stroke("M97 69Q104 65 111 69", shade(a.hairC, -0.2), 2.4) + k.stroke("M71 69Q77 66 83 69", shade(a.hairC, -0.2), 2.2) +
    eye(k, a, NEAR) + eye(k, a, FAR) +
    k.stroke("M93 88Q95 90 93 92", "rgba(0,0,0,.18)", 1.8) +
    draw(MOUTHS, a.mouth, k, a);
}

let instanceCount = 0;

/**
 * Draws an avatar. Each call uses fresh gradient ids, so the result can be
 * placed next to other avatars on the same page.
 *
 * @param {Avatar} a Selected option id per category (see DEFAULT_AVATAR).
 * @param {{ label?: string, backdrop?: boolean, crop?: "full" | "bust" | "head" }} [options]
 *   `backdrop: false` leaves out the coloured card behind the avatar (for
 *   levels that draw the avatar inside a scene). `crop: "head"` frames only
 *   the head (chat pictures, editor thumbnails), `crop: "bust"` head and body.
 * @returns {string} SVG markup.
 */
export function renderAvatar(a, { label = "Avatar", backdrop = true, crop = "full" } = {}) {
  const k = createSvgKit(`avatar-${++instanceCount}`);
  const hairBehindBody = a.hair === "long";
  return [
    `<svg class="avatar" viewBox="${VIEW[crop] || VIEW.full}" role="img" aria-label="${label}">`,
    k.defs(`<clipPath id="${k.ids.bodyClip}"><path d="${TORSO}"/></clipPath>`),
    backdrop
      ? `<rect width="160" height="234" rx="28" fill="${a.bg}"/>` + k.circle(84, 120, 70, "#fff", ".35")
      : "",
    `<ellipse class="shadow" cx="84" cy="229" rx="34" ry="5" fill="#000" opacity=".13"/>`,
    `<g class="body">`,
    hairBehindBody ? draw(HAIR_BACK, a.hair, k, a) : "",
    arm(k, a, "back", 68),
    leg(k, a, "back", 74),
    leg(k, a, "front", 94),
    draw(TOP_BACK, a.top, k, a),
    k.clay(TORSO, a.topC),
    `<g clip-path="url(#${k.ids.bodyClip})">${draw(TOP_FRONT, a.top, k, a)}</g>`,
    k.clay("M77 104H91V116Q84 120 77 116Z", shade(a.skin, -0.12)),
    draw(ACCESSORIES, a.acc === "phones" ? "none" : a.acc, k, a),
    hairBehindBody ? "" : draw(HAIR_BACK, a.hair, k, a),
    k.circle(46, 84, 8.5, a.skin) + k.circle(46, 84, 4, shade(a.skin, -0.12)),
    draw(EARRINGS, a.ear, k, a),
    k.clay(HEAD, a.skin),
    face(k, a),
    draw(HAIR_FRONT, a.hair, k, a),
    draw(HEAD_EXTRA_UNDER_HAT, a.pin, k, a),
    draw(HATS, a.hat, k, a),
    draw(HEAD_EXTRA_OVER_HAT, a.pin, k, a),
    draw(GLASSES, a.gl, k, a),
    a.acc === "phones" ? ACCESSORIES.phones(k, a) : "",
    arm(k, a, "front", 100),
    `</g>`,
    "</svg>",
  ].join("");
}
