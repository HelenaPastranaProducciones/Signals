import { createSvgKit } from "../../avatar/svg-kit.js";
import { shade, trousersColour } from "../../avatar/render-avatar.js";

/**
 * Level 1's own avatar: the player's choices (skin, hair, hat, glasses,
 * clothes, extras) drawn side-on, facing right, in the same cute style as
 * the menu avatar, ready to run, jump and duck.
 *
 * Arms and legs are nested groups that turn around their joint
 * (`transform-origin: 0 0` in level.css): `.body` > `.thigh-*` > `.shin-*`
 * and `.upperarm-*` > `.forearm-*`, with `-front` / `-back`.
 *
 * Drawing units: 140 × 220, feet on y = 215.
 */

const INK = "#2b2233";
const LIPS = "#7a2f3d";
const GOLD = "#f2c12e";

const HEAD = "M70 30C94 30 107 46 107 66C107 88 92 102 70 102C48 102 33 88 33 66C33 46 46 30 70 30Z";
const TORSO = "M53 106Q70 98 86 106L90 152Q70 160 50 152Z";
const EYE = { x: 89, y: 70, rx: 6, ry: 8.2 };
// Seen from the side, the ear sits in the middle of the head, in front of the hair.
const EAR = { x: 64, y: 76 };

/*
 * Hair from the side. Each style is ONE shape, so it reads at a glance:
 * - its outline wraps the skull with some volume, and the style shows in
 *   that outline (length at the back, a bun, curls, spikes);
 * - it shares one hairline with the others: a fringe of locks over the
 *   forehead, a sideburn in front of the ear, over the ear and down behind
 *   it to the nape, so the face and the ear always stay clear;
 * - strands drawn inside it grow from the crown and fall back and down,
 *   with one soft shine on top.
 * Every path starts at the tip of the fringe, goes over the top and down
 * the back, and comes back along the hairline (UP) from behind the ear.
 */
const TOP = "M108 56C111 30 92 18 70 18C46 18 26 34 26 62";
const UP = "C56 68 61 60 68 61Q72 64 73 74Q75 64 80 58Q85 45 90 52Q95 44 100 51Q104 45 108 56Z";

/** Turns a list of points into a bumpy outline: one round bump between each pair (curls, afro). */
const bumps = (points) => points.slice(1).map(([x, y], i) => {
  const [px, py] = points[i];
  return `A${(Math.hypot(x - px, y - py) * 0.6).toFixed(1)} ${(Math.hypot(x - px, y - py) * 0.6).toFixed(1)} 0 0 0 ${x} ${y}`;
}).join("");

/** The shaved sides of the mohawk and the buzz cut: a light shadow of hair on the scalp. */
const SHAVED = "M106 53C106 34 90 27 70 27C48 27 31 42 31 64C31 82 38 94 48 100Q54 98 57 93Q60 88 58 84C56 68 61 60 68 61Q72 64 73 72Q75 62 80 57Q92 49 106 53Z";

const HAIR_SHAPES = {
  // A soft cap over the top and back of the head, ending at the nape.
  short: `${TOP}C26 82 33 96 44 102Q52 100 56 96Q60 90 58 84${UP}`,
  // Close to the head, no volume, a straight short fringe.
  buzz: SHAVED,
  // Down to the jaw at the back, with the ends curling in under it.
  bob: `${TOP}C23 90 27 108 38 113Q50 119 63 111Q58 100 58 84${UP}`,
  // One long fall of hair down the back, to the waist.
  long: `${TOP}C20 100 24 140 32 158Q44 168 60 158Q54 130 58 104Q60 94 58 84${UP}`,
  // Short hair gathered into a round bun at the back of the crown.
  bun: `M108 56C111 30 92 18 70 18C60 18 52 20 46 24A16 16 0 1 0 28 44C27 50 26 56 26 62C26 82 33 96 44 102Q52 100 56 96Q60 90 58 84${UP}`,
  // Two round buns on top, one in front of the other.
  buns: `M108 56C111 34 102 24 92 20A12 12 0 1 0 72 15C64 15 58 16 52 19A11 11 0 1 0 34 32C29 40 26 50 26 62C26 82 33 96 44 102Q52 100 56 96Q60 90 58 84${UP}`,
  // A bumpy outline of curls all round, and a curly fringe.
  curls: `M108 56${bumps([[108, 56], [107, 40], [99, 27], [86, 19], [71, 16], [56, 18], [43, 25], [33, 36], [26, 50], [24, 65], [26, 80], [31, 93], [40, 102], [52, 104], [58, 94]])}` +
    "Q60 90 58 84C56 68 61 60 68 61Q72 64 73 74Q75 64 80 58A6 6 0 0 1 90 52A6 6 0 0 1 100 51A5 5 0 0 1 108 56Z",
  // One big round cloud of hair around the head.
  afro: `M110 60${bumps([[110, 60], [114, 42], [108, 24], [94, 11], [76, 5], [57, 6], [40, 13], [26, 26], [17, 43], [14, 62], [18, 81], [27, 96], [40, 106], [54, 106], [58, 94]])}` +
    "Q60 90 58 84C56 68 61 60 68 61Q72 64 73 74Q75 64 80 58Q94 48 110 60Z",
  // A crest of spikes along the top, from the forehead to the back of the crown; the sides are shaved.
  mohawk: mohawkPath(),
};

/**
 * The mohawk crest: spikes standing on the middle of the skull, leaning back,
 * smaller towards the nape. Built around the head's centre (70, 66): angles
 * go from the forehead (40°) over the top (90°) to the back (200°).
 */
function mohawkPath() {
  const at = (deg, r) => {
    const rad = (deg * Math.PI) / 180;
    return `${(70 + r * Math.cos(rad)).toFixed(1)} ${(66 - r * Math.sin(rad)).toFixed(1)}`;
  };
  const spikes = 7;
  const [first, last] = [44, 170];
  const step = (last - first) / spikes;
  let d = `M${at(first, 35)}`;
  for (let i = 0; i < spikes; i += 1) {
    d += `L${at(first + step * (i + 0.7), 60 - i * 2.4)}L${at(first + step * (i + 1), 44)}`;
  }
  // Lying flat down the back of the head, then back along the scalp to the start.
  d += `L${at(205, 40)}L${at(208, 34)}`;
  for (let deg = 195; deg >= first; deg -= 15) d += `L${at(deg, 34)}`;
  return `${d}Z`;
}


/** Strands inside the hair, from the crown back and down, plus extra ones for long styles. */
const STRANDS = ["M92 24Q72 26 54 46", "M80 20Q58 30 42 62", "M68 20Q46 32 34 82", "M100 34Q92 42 88 50"];
const LONG_STRANDS = ["M36 94Q30 124 38 152", "M46 100Q42 128 50 156", "M30 96Q30 104 36 110"];
/** Little curls drawn inside curly hair instead of long strands. */
const CURLS = [[46, 36], [62, 28], [80, 26], [36, 54], [50, 52], [34, 74], [44, 88], [94, 34], [24, 40], [22, 66]]
  .map(([x, y]) => `M${x - 4} ${y + 2}q0-6 5-6q5 0 4 5q-1 3-4 2`);
/** Shaved hair on the sides (buzz cut and mohawk). */
const STUBBLE = [[50, 40], [62, 35], [76, 34], [44, 54], [40, 70], [90, 40], [48, 84], [54, 60], [98, 46]];

let count = 0;

/** @param {Record<string, string>} a  The player's avatar choices. */
export function runnerAvatar(a, { label = "Avatar" } = {}) {
  const k = createSvgKit(`level-01-runner-${++count}`);
  return [
    `<svg class="runner-avatar" viewBox="0 0 140 220" role="img" aria-label="${label}">`,
    k.defs(`<clipPath id="${k.ids.bodyClip}"><path d="${TORSO}"/></clipPath>`),
    `<ellipse class="shadow" cx="70" cy="215" rx="32" ry="4.5" fill="#000" opacity=".14"/>`,
    `<g class="body">`,
    arm(k, a, "back", 64),
    leg(k, a, "back", 63),
    leg(k, a, "front", 76),
    draw(TOP_BACK, a.top, k, a),
    k.clay(TORSO, a.topC),
    `<g clip-path="url(#${k.ids.bodyClip})">${draw(TOP_FRONT, a.top, k, a)}</g>`,
    k.clay("M63 96H77V108Q70 112 63 108Z", shade(a.skin, -0.12)),
    draw(ACCESSORIES, a.acc === "phones" ? "none" : a.acc, k, a),
    k.clay(HEAD, a.skin),
    k.circle(105, 76, 4, a.skin),
    face(k, a),
    hair(k, a),
    ear(k, a),
    draw(EARRINGS, a.ear, k, a),
    draw(EXTRA_UNDER_HAT, a.pin, k, a),
    draw(HATS, a.hat, k, a),
    draw(EXTRA_OVER_HAT, a.pin, k, a),
    draw(GLASSES, a.gl, k, a),
    a.acc === "phones" ? ACCESSORIES.phones(k, a) : "",
    arm(k, a, "front", 72),
    `</g>`,
    "</svg>",
  ].join("");
}

const draw = (table, option, k, a) => (table[option] ? table[option](k, a) : "");

/** A leg from the hip: thigh, then shin and a shoe pointing forward. */
function leg(k, a, side, x) {
  const back = side === "back";
  const colour = back ? shade(trousersColour(a), -0.18) : trousersColour(a);
  const shoe = back ? shade(a.acC, -0.15) : a.acC;
  return `<g transform="translate(${x} 150)"><g class="thigh thigh-${side}">${k.stroke("M0 0V26", colour, 18)}` +
    `<g transform="translate(0 26)"><g class="shin shin-${side}">${k.stroke("M0 0V24", colour, 15)}` +
    k.clay("M-9 26Q-11 38-5 39H16Q22 36 17 30Q8 22-9 26Z", shoe) +
    k.path("M-8 37H17", "none", 'stroke="#fff" stroke-width="2.4" opacity=".85"') +
    `</g></g></g></g>`;
}

/** An arm from the shoulder: sleeve, then forearm and hand. */
function arm(k, a, side, x) {
  const back = side === "back";
  const sleeve = back ? shade(a.topC, -0.15) : a.topC;
  const skin = back ? shade(a.skin, -0.1) : a.skin;
  return `<g transform="translate(${x} 112)"><g class="upperarm upperarm-${side}">${k.stroke("M0 0V19", sleeve, 13)}` +
    `<g transform="translate(0 19)"><g class="forearm forearm-${side}">${k.stroke("M0 0V14", skin, 10)}${k.circle(0, 17, 6.5, skin)}` +
    `</g></g></g></g>`;
}

function face(k, a) {
  const blush = a.face === "blush";
  return `<ellipse cx="93" cy="84" rx="${blush ? 8 : 6}" ry="${blush ? 5.2 : 4}" fill="${blush ? "#ff4f8b" : "#ff8fa3"}" opacity="${blush ? ".45" : ".5"}"/>` +
    draw(FACE_MARKS, a.face, k, a) +
    k.stroke("M82 57Q89 53 96 57", shade(a.hairC, -0.2), 2.4) +
    (EYES[a.eyes] || EYES.dots)(k) +
    (MOUTHS[a.mouth] || MOUTHS.smile)(k);
}

const EYES = {
  dots: (k) =>
    `<ellipse cx="${EYE.x}" cy="${EYE.y}" rx="${EYE.rx}" ry="${EYE.ry}" fill="${INK}"/>` +
    k.circle(EYE.x + 1.8, EYE.y - 3, 2.6, "#fff") + k.circle(EYE.x - 2, EYE.y + 3.2, 1.2, "#fff"),
  happy: (k) => k.stroke(`M${EYE.x - 7} ${EYE.y + 2}Q${EYE.x} ${EYE.y - 9} ${EYE.x + 7} ${EYE.y + 2}`, INK, 3.4),
  sleepy: (k) =>
    `<ellipse cx="${EYE.x}" cy="${EYE.y + 2}" rx="${EYE.rx}" ry="${EYE.ry * 0.55}" fill="${INK}"/>` +
    k.stroke(`M${EYE.x - 7.5} ${EYE.y - 0.5}Q${EYE.x} ${EYE.y - 3} ${EYE.x + 7.5} ${EYE.y - 0.5}`, INK, 2.6),
  sparkle: (k) =>
    `<ellipse cx="${EYE.x}" cy="${EYE.y}" rx="${EYE.rx + 0.8}" ry="${EYE.ry + 0.8}" fill="${INK}"/>` +
    `<ellipse cx="${EYE.x}" cy="${EYE.y + 3}" rx="${EYE.rx - 1}" ry="${EYE.ry * 0.45}" fill="#6c5ce7" opacity=".55"/>` +
    k.star(EYE.x + 1.5, EYE.y - 2.5, 0.42, "#fff") + k.circle(EYE.x - 2.2, EYE.y + 3.6, 1.3, "#fff"),
};

const MOUTHS = {
  smile: (k) => k.stroke("M94 89Q98 93 103 88", LIPS, 2.4),
  grin: (k) => k.path("M92 87Q98 98 104 86Q98 89 92 87Z", LIPS) + k.path("M94 88Q98 89.5 103 87.5L102 90Q98 91 95 90Z", "#fff"),
  smirk: (k) => k.stroke("M94 91Q100 91 104 86", LIPS, 2.4),
  tongue: (k) => k.path("M93 87Q98 96 104 86Z", LIPS) + k.path("M96 90Q99 97 102 90Z", "#ff6f8a"),
  oh: () => `<ellipse cx="99" cy="90" rx="3.2" ry="4" fill="${LIPS}"/>`,
};

const FACE_MARKS = {
  freckles: (k) => [[86, 80], [90, 84], [95, 80]].map(([x, y]) => k.circle(x, y, 1.3, "#a85a34", ".7")).join(""),
  stripes: (k, a) => k.stroke("M86 81h9", a.acC, 2.6) + k.stroke("M87 86h9", a.acC, 2.6),
  star: (k) => k.star(96, 84, 0.62, "#ffe36b"),
  bandaid: () =>
    `<g transform="rotate(-18 90 82)"><rect x="82" y="78" width="16" height="8" rx="4" fill="#f3c9a0" stroke="rgba(0,0,0,.18)"/><rect x="88" y="78" width="5" height="8" fill="#e8b184"/></g>`,
};

/** The ear, drawn over the hair so it always shows (and earrings hang from it). */
function ear(k, a) {
  return k.clay(`M${EAR.x} ${EAR.y - 9}C${EAR.x + 7} ${EAR.y - 9} ${EAR.x + 8} ${EAR.y + 8} ${EAR.x + 1} ${EAR.y + 9}` +
    `C${EAR.x - 6} ${EAR.y + 9} ${EAR.x - 8} ${EAR.y - 9} ${EAR.x} ${EAR.y - 9}Z`, a.skin) +
    k.stroke(`M${EAR.x + 2} ${EAR.y - 4}Q${EAR.x - 3} ${EAR.y} ${EAR.x + 2} ${EAR.y + 4}`, shade(a.skin, -0.2), 2);
}

const EARRINGS = {
  hoops: (k) => k.stroke(`M${EAR.x} ${EAR.y + 8}a5 5 0 1 0 .1 0`, GOLD, 2.2),
  studs: (k) => k.circle(EAR.x, EAR.y + 7, 2.6, GOLD) + k.circle(EAR.x - 0.8, EAR.y + 6.2, 0.9, "#fff"),
  gems: (k) => k.stroke(`M${EAR.x} ${EAR.y + 8}v4`, GOLD, 1.4) + k.circle(EAR.x, EAR.y + 14, 3.4, "#4fd8ff") + k.circle(EAR.x - 1, EAR.y + 13, 1.1, "#fff"),
};

/** The hair: one shape in the hair colour, with its strands and shine kept inside it. */
function hair(k, a) {
  const d = HAIR_SHAPES[a.hair];
  if (!d) return "";
  const clip = `${k.ids.bodyClip}-hair`;
  const dark = shade(a.hairC, -0.22);
  const stubble = a.hair === "buzz" || a.hair === "mohawk"
    ? STUBBLE.map(([x, y]) => k.circle(x, y, 1.2, dark, ".55")).join("") : "";
  const strands = { buzz: [], long: [...STRANDS, ...LONG_STRANDS], curls: CURLS, afro: CURLS, mohawk: [] }[a.hair] ?? STRANDS;
  // The mohawk's shaved sides: a light shadow of hair kept on the scalp (never past the head's outline).
  const shaved = a.hair === "mohawk"
    ? `<clipPath id="${clip}-head"><path d="${HEAD}"/></clipPath><g clip-path="url(#${clip}-head)">${k.path(SHAVED, dark, 'opacity=".22"')}${stubble}</g>`
    : "";
  return shaved +
    `<clipPath id="${clip}"><path d="${d}"/></clipPath>` +
    // The crest is a strong solid shape; the other styles get the full clay shine.
    (a.hair === "mohawk" ? k.path(d, a.hairC) + k.shade(d) : k.clay(d, a.hairC)) +
    `<g clip-path="url(#${clip})">` +
    (a.hair === "buzz" ? stubble : "") +
    strands.map((s) => k.stroke(s, dark, 1.8, 'opacity=".45"')).join("") +
    k.stroke("M56 27Q76 19 96 29", "#fff", 4.5, 'opacity=".32"') +
    `</g>`;
}

/** The arm of the glasses, from the lens back to the top of the ear. */
const glassesArm = (colour) => `<path d="M79 67L${EAR.x + 2} ${EAR.y - 7}" fill="none" stroke="${colour}" stroke-width="2.4" stroke-linecap="round"/>`;

const GLASSES = {
  round: () => `<circle cx="${EYE.x}" cy="${EYE.y}" r="10" fill="rgba(255,255,255,.18)" stroke="#ff7a45" stroke-width="2.6"/>` + glassesArm("#ff7a45"),
  square: () => `<rect x="${EYE.x - 10}" y="${EYE.y - 9}" width="20" height="18" rx="5" fill="rgba(255,255,255,.18)" stroke="#2fc4b2" stroke-width="2.6"/>` + glassesArm("#2fc4b2"),
  sun: (k) =>
    k.path(`M${EYE.x - 9} ${EYE.y - 7}H${EYE.x + 12}V${EYE.y}Q${EYE.x + 12} ${EYE.y + 8} ${EYE.x + 2} ${EYE.y + 8}Q${EYE.x - 9} ${EYE.y + 8} ${EYE.x - 9} ${EYE.y}Z`, "#1f1d2b") +
    k.stroke(`M${EYE.x - 3} ${EYE.y - 3}l6-1.4`, "#fff", 2, 'opacity=".55"') + glassesArm("#1f1d2b"),
  shutter: (k, a) =>
    `<rect x="${EYE.x - 10}" y="${EYE.y - 9}" width="22" height="18" rx="4" fill="${a.acC}"/>` +
    [-4, 0, 4].map((d) => k.stroke(`M${EYE.x - 7} ${EYE.y + d}h16`, "#fff", 1.6)).join("") + glassesArm(a.acC),
  pixel: (k) => k.path("M78 63H104V68H100V76H86V68H78Z", "#1f1d2b") + k.path("M90 64h4v3h-4z", "#fff", 'opacity=".7"') + glassesArm("#1f1d2b"),
  hearts: (k) =>
    `<path transform="translate(${EYE.x + 1} ${EYE.y - 1})" d="M0 9C-15-1-11-13 0-5C11-13 15-1 0 9Z" fill="#ff4f8b"/>` +
    k.circle(EYE.x - 3, EYE.y - 4, 2, "#fff") + glassesArm("#ff4f8b"),
};

const DOME = "M26 66C24 34 46 16 70 16C96 16 112 32 110 58Q70 48 26 66Z";
/** Seams and the button on top of a cap. */
const capDetails = (k, a) =>
  k.stroke("M70 17Q62 36 66 54", shade(a.hatC, -0.2), 1.6, 'opacity=".6"') + k.circle(70, 17, 3.4, shade(a.hatC, -0.18));

const HATS = {
  cap: (k, a) =>
    k.clay(DOME, a.hatC) + capDetails(k, a) +
    k.clay("M96 50Q122 44 138 54Q140 62 128 64Q112 62 98 62Z", shade(a.hatC, -0.12)),
  backcap: (k, a) =>
    k.clay(DOME, a.hatC) + capDetails(k, a) + k.path("M90 40h10v8H90z", "rgba(0,0,0,.25)") +
    k.clay("M42 52Q16 46 2 58Q2 66 14 68Q28 66 42 64Z", shade(a.hatC, -0.12)),
  beanie: (k, a) =>
    k.clay("M30 62C28 28 48 12 70 12C94 12 112 26 110 56Q70 44 30 62Z", a.hatC) +
    k.clay("M28 56Q70 40 112 52L113 64Q70 52 27 68Z", shade(a.hatC, -0.14)) +
    [36, 46, 56, 66, 76, 86, 96, 106].map((x) => k.stroke(`M${x} 52v10`, "rgba(0,0,0,.15)", 1.6)).join("") +
    k.clay("M66 -2a10 10 0 1 0 .1 0Z", "#fff"),
  bucket: (k, a) =>
    k.clay("M32 60C30 28 50 12 72 12C96 12 110 28 108 56Q70 48 32 60Z", a.hatC) + k.stroke("M32 56Q70 44 108 52", a.acC, 5) +
    k.clay("M10 70Q14 56 70 50Q126 46 130 60Q132 70 120 72Q100 60 70 62Q40 64 22 78Q8 80 10 70Z", shade(a.hatC, -0.1)),
  bandana: (k, a) =>
    k.clay("M30 62C28 38 48 26 70 26C92 26 110 38 108 58Q70 46 30 62Z", a.hatC) +
    k.clay("M32 58L14 52L18 70Z", a.hatC) + k.clay("M32 62L18 76L30 78Z", shade(a.hatC, -0.12)) +
    [[48, 42], [66, 36], [84, 38], [98, 46]].map(([x, y]) => k.circle(x, y, 2, "#fff")).join(""),
};

const EXTRA_UNDER_HAT = {
  // The far ear peeks out behind the near one.
  cat: (k, a) =>
    k.clay("M44 36Q40 18 46 4Q60 12 68 26Z", shade(a.hairC, -0.18)) +
    k.clay("M70 28Q74 10 90 0Q98 16 98 36Z", a.hairC) + k.path("M76 26Q80 14 89 8Q93 20 92 32Z", "#ff9fc0"),
};

const EXTRA_OVER_HAT = {
  flower: (k) =>
    `<g transform="translate(46 48)">` +
    [0, 1, 2, 3, 4].map((i) => k.circle(Math.cos(i * 1.2566) * 5, Math.sin(i * 1.2566) * 5, 4.6, "#a174ff")).join("") +
    k.circle(0, 0, 3.2, "#ffe36b") + `</g>`,
  bow: (k) => k.clay("M42 38L26 28V48Z", "#ff5c93") + k.clay("M42 38L58 28V48Z", "#ff5c93") + k.circle(42, 38, 4.4, "#e63e78"),
  stars: (k) => k.star(44, 52, 0.8, "#ffe36b") + k.star(54, 40, 0.65, "#7fe3c0"),
};

const TOP_BACK = {
  hoodie: (k, a) => k.clay("M50 118C38 114 38 98 50 94C58 92 66 96 70 104Z", shade(a.topC, -0.12)),
};

const TOP_FRONT = {
  hoodie: (k) => k.stroke("M82 108v12", "#fff", 2) + k.path("M60 136Q72 130 88 136L90 150Q72 156 58 150Z", "#000", 'opacity=".1"'),
  stripes: (k, a) => [118, 130, 142].map((y) => `<rect x="44" y="${y}" width="52" height="5.5" fill="${a.acC}"/>`).join(""),
  band: (k, a) => k.star(78, 126, 1, a.acC),
  jersey: (k, a) =>
    `<rect x="44" y="104" width="10" height="56" fill="${a.acC}"/>` +
    `<text x="74" y="140" text-anchor="middle" font-size="17" font-weight="800" font-family="Arial Black,Arial,sans-serif" fill="${a.acC}">10</text>`,
  overalls: (k, a) => k.path("M64 124H92V160H58Z", a.acC) + k.path("M80 124L84 104H90L86 124Z", a.acC) + k.circle(84, 126, 2.2, "#ffe36b"),
};

const ACCESSORIES = {
  // Seen from the side, the headband rises straight up from the ear.
  phones: (k, a) =>
    k.stroke(`M${EAR.x - 2} ${EAR.y - 6}C${EAR.x - 10} 48 ${EAR.x - 8} 26 ${EAR.x - 2} 19`, "#2b2233", 5) +
    k.clay(`M${EAR.x - 8} ${EAR.y - 4}a8 11 0 1 0 16 0a8 11 0 1 0-16 0Z`, a.acC) +
    k.circle(EAR.x, EAR.y - 4, 3.4, shade(a.acC, -0.2)),
  // Neck pieces hang in front of the chest, ahead of the arm.
  chain: (k) => k.stroke("M74 104Q82 122 90 108", GOLD, 2.6, 'stroke-dasharray="4 2"'),
  pearls: (k) => [[76, 106], [78, 111], [82, 115], [86, 114], [89, 110], [90, 105]].map(([x, y]) => k.circle(x, y, 2.6, "#fff")).join(""),
  scarf: (k, a) => k.clay("M58 100Q74 112 90 100L92 112Q74 124 56 112Z", a.acC) + k.clay("M82 112L92 112L96 134L84 132Z", shade(a.acC, -0.1)),
  cassette: (k, a) =>
    k.stroke("M74 104L84 120L90 106", "#2b2233", 1.6) +
    `<g transform="translate(85 126) rotate(-8)"><rect x="-8" y="-5.5" width="16" height="11" rx="2.5" fill="${a.acC}"/><rect x="-5" y="-3.5" width="10" height="4.5" rx="1.5" fill="#fff"/>` +
    k.circle(-2.4, -1.2, 1.3, "#2b2233") + k.circle(2.4, -1.2, 1.3, "#2b2233") + `</g>`,
  camera: (k, a) =>
    k.stroke("M72 104L86 124L90 106", "#2b2233", 1.6) +
    `<g transform="translate(88 130)"><rect x="-10" y="-7" width="20" height="14" rx="4" fill="#f4f4f6"/><rect x="-10" y="-7" width="20" height="4.5" rx="2.2" fill="${a.acC}"/>` +
    k.circle(2, 2, 4, "#2b2233") + k.circle(2, 2, 2, "#6c86ff") + `</g>`,
  // A strap across the chest and the bag resting on the back hip.
  bag: (k, a) =>
    k.stroke("M86 106L52 140", "#2b2233", 3) +
    k.clay("M38 136Q38 130 46 130H58Q64 130 64 136V150Q64 154 58 154H44Q38 154 38 150Z", a.acC) +
    k.path("M38 138H64V142H38Z", "#000", 'opacity=".12"') + k.circle(51, 142, 2, "#fff"),
};
