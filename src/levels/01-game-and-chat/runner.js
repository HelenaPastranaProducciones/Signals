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

// Hair from the side: a cap over the top and back of the head, with a fringe at the front.
const CAP = "M30 74C26 40 46 24 70 24C94 24 110 38 108 60Q104 56 100 54Q96 60 90 57Q86 52 82 50Q76 58 68 56Q62 62 58 64Q52 68 50 76Q44 82 41 92Q32 86 30 74Z";

let count = 0;

/** @param {Record<string, string>} a  The player's avatar choices. */
export function runnerAvatar(a, { label = "Avatar" } = {}) {
  const k = createSvgKit(`level-01-runner-${++count}`);
  const hairBehindBody = a.hair === "long";
  return [
    `<svg class="runner-avatar" viewBox="0 0 140 220" role="img" aria-label="${label}">`,
    k.defs(`<clipPath id="${k.ids.bodyClip}"><path d="${TORSO}"/></clipPath>`),
    `<ellipse class="shadow" cx="70" cy="215" rx="32" ry="4.5" fill="#000" opacity=".14"/>`,
    `<g class="body">`,
    hairBehindBody ? draw(HAIR_BACK, a.hair, k, a) : "",
    arm(k, a, "back", 64),
    leg(k, a, "back", 63),
    leg(k, a, "front", 76),
    draw(TOP_BACK, a.top, k, a),
    k.clay(TORSO, a.topC),
    `<g clip-path="url(#${k.ids.bodyClip})">${draw(TOP_FRONT, a.top, k, a)}</g>`,
    k.clay("M63 96H77V108Q70 112 63 108Z", shade(a.skin, -0.12)),
    draw(ACCESSORIES, a.acc === "phones" ? "none" : a.acc, k, a),
    hairBehindBody ? "" : draw(HAIR_BACK, a.hair, k, a),
    k.circle(54, 70, 8, a.skin) + k.circle(54, 70, 3.8, shade(a.skin, -0.12)),
    draw(EARRINGS, a.ear, k, a),
    k.clay(HEAD, a.skin),
    k.circle(105, 76, 4, a.skin),
    face(k, a),
    draw(HAIR_FRONT, a.hair, k, a),
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

const EARRINGS = {
  hoops: (k) => k.stroke("M54 81a5 5 0 1 0 .1 0", GOLD, 2.2),
  studs: (k) => k.circle(54, 79, 2.6, GOLD),
  gems: (k) => k.circle(54, 81, 3.4, "#4fd8ff") + k.circle(53, 80, 1.1, "#fff"),
};

const HAIR_BACK = {
  short: (k, a) => k.clay("M28 76C24 40 46 22 70 22C92 22 108 36 108 56L60 70L56 98Q40 100 28 76Z", shade(a.hairC, -0.12)),
  bob: (k, a) => k.clay("M28 74C24 40 46 22 70 22C92 22 108 36 108 56L64 66L60 104Q44 112 30 100Z", shade(a.hairC, -0.12)),
  long: (k, a) => k.clay("M28 74C24 40 46 22 70 22C92 22 108 36 108 56L64 66L62 144Q46 156 30 140Z", shade(a.hairC, -0.12)),
  bun: (k, a) => k.clay("M28 76C24 40 46 22 70 22C92 22 108 36 108 56L60 70L56 98Q40 100 28 76Z", shade(a.hairC, -0.12)) + k.clay("M40 14a15 15 0 1 0 .1 0Z", a.hairC),
  buns: (k, a) =>
    k.clay("M28 76C24 40 46 22 70 22C92 22 108 36 108 56L60 70L56 98Q40 100 28 76Z", shade(a.hairC, -0.12)) +
    k.clay("M48 8a13 13 0 1 0 .1 0Z", a.hairC) + k.clay("M88 8a12 12 0 1 0 .1 0Z", a.hairC),
  curls: (k, a) =>
    [[34, 70, 14], [36, 46, 15], [54, 30, 16], [74, 24, 16], [94, 30, 14], [40, 92, 11]]
      .map(([x, y, r]) => k.clay(`M${x} ${y - r}a${r} ${r} 0 1 0 .1 0Z`, shade(a.hairC, -0.12))).join(""),
  afro: (k, a) => k.clay("M66 6C102 6 118 30 114 58C110 84 90 90 62 92C34 92 18 80 16 58C14 28 34 6 66 6Z", shade(a.hairC, -0.08)),
};

const HAIR_FRONT = {
  short: (k, a) => k.clay(CAP, a.hairC) + shine(k),
  bob: (k, a) => k.clay(CAP, a.hairC) + shine(k),
  long: (k, a) => k.clay(CAP, a.hairC) + shine(k),
  bun: (k, a) => k.clay(CAP, a.hairC) + shine(k),
  buns: (k, a) => k.clay(CAP, a.hairC) + shine(k),
  buzz: (k, a) => k.path("M34 76C30 44 48 30 70 30C92 30 106 42 104 58Q90 46 72 48Q52 52 44 70Q40 76 34 76Z", a.hairC, 'opacity=".92"'),
  curls: (k, a) =>
    [[48, 44, 11], [62, 36, 12], [78, 34, 12], [92, 40, 11], [100, 52, 9], [40, 58, 10]]
      .map(([x, y, r]) => k.clay(`M${x} ${y - r}a${r} ${r} 0 1 0 .1 0Z`, a.hairC)).join(""),
  afro: (k, a) => k.clay("M36 70C34 42 50 30 72 30C92 30 106 42 104 58Q90 48 72 50Q52 52 36 70Z", a.hairC),
  mohawk: (k, a) =>
    k.path("M34 76C30 46 48 32 70 32C92 32 106 44 104 58Q88 48 70 50Q50 52 34 76Z", a.hairC, 'opacity=".35"') +
    k.clay("M40 46Q40 30 46 18Q52 28 56 30Q58 14 66 4Q70 20 72 26Q80 12 90 10Q90 26 92 40Q66 32 40 46Z", a.hairC),
};

const shine = (k) => k.stroke("M52 36Q66 28 82 30", "#fff", 4, 'opacity=".28"');

const GLASSES = {
  round: (k) => `<circle cx="${EYE.x}" cy="${EYE.y}" r="10" fill="rgba(255,255,255,.18)" stroke="#ff7a45" stroke-width="2.6"/>` + k.stroke("M79 68L60 66", "#ff7a45", 2.4),
  square: (k) => `<rect x="${EYE.x - 10}" y="${EYE.y - 9}" width="20" height="18" rx="5" fill="rgba(255,255,255,.18)" stroke="#2fc4b2" stroke-width="2.6"/>` + k.stroke("M79 68L60 66", "#2fc4b2", 2.4),
  sun: (k) =>
    k.path(`M${EYE.x - 11} ${EYE.y - 8}H${EYE.x + 11}V${EYE.y}Q${EYE.x + 11} ${EYE.y + 9} ${EYE.x} ${EYE.y + 9}Q${EYE.x - 11} ${EYE.y + 9} ${EYE.x - 11} ${EYE.y}Z`, "#1f1d2b") +
    k.stroke(`M${EYE.x - 6} ${EYE.y - 4}l5-1`, "#fff", 2, 'opacity=".55"') + k.stroke("M78 64L60 66", "#1f1d2b", 2.4),
  shutter: (k, a) =>
    `<rect x="${EYE.x - 11}" y="${EYE.y - 9}" width="22" height="18" rx="4" fill="${a.acC}"/>` +
    [-4, 0, 4].map((d) => k.stroke(`M${EYE.x - 8} ${EYE.y + d}h16`, "#fff", 1.6)).join("") + k.stroke("M78 68L60 66", a.acC, 2.4),
  pixel: (k) => k.path("M76 62H104V68H100V76H86V68H76Z", "#1f1d2b") + k.path("M90 64h4v3h-4z", "#fff", 'opacity=".7"') + k.stroke("M76 65L60 66", "#1f1d2b", 2.4),
  hearts: (k) =>
    `<path transform="translate(${EYE.x} ${EYE.y - 1})" d="M0 9C-15-1-11-13 0-5C11-13 15-1 0 9Z" fill="#ff4f8b"/>` +
    k.circle(EYE.x - 4, EYE.y - 4, 2, "#fff") + k.stroke("M78 68L60 66", "#ff4f8b", 2.4),
};

const DOME = "M30 64C28 34 48 18 70 18C94 18 112 32 110 58Q70 46 30 64Z";

const HATS = {
  cap: (k, a) => k.clay(DOME, a.hatC) + k.clay("M100 50Q124 48 134 58Q124 64 104 62Z", shade(a.hatC, -0.12)),
  backcap: (k, a) => k.clay(DOME, a.hatC) + k.clay("M40 56Q16 54 6 64Q18 70 38 66Z", shade(a.hatC, -0.12)),
  beanie: (k, a) =>
    k.clay("M30 62C28 28 48 12 70 12C94 12 112 26 110 56Q70 44 30 62Z", a.hatC) +
    k.clay("M28 56Q70 40 112 52L113 64Q70 52 27 68Z", shade(a.hatC, -0.14)) +
    [36, 46, 56, 66, 76, 86, 96, 106].map((x) => k.stroke(`M${x} 52v10`, "rgba(0,0,0,.15)", 1.6)).join("") +
    k.clay("M66 -2a10 10 0 1 0 .1 0Z", "#fff"),
  bucket: (k, a) =>
    k.clay("M36 56C36 28 52 18 70 18C90 18 104 28 104 54Z", a.hatC) + k.stroke("M36 52Q70 60 104 50", a.acC, 4) +
    k.clay("M14 60Q70 46 126 58Q132 68 122 70Q70 58 18 72Q8 70 14 60Z", shade(a.hatC, -0.1)),
  bandana: (k, a) =>
    k.clay("M30 62C28 38 48 26 70 26C92 26 110 38 108 58Q70 46 30 62Z", a.hatC) +
    k.clay("M32 58L14 52L18 70Z", a.hatC) + k.clay("M32 62L18 76L30 78Z", shade(a.hatC, -0.12)) +
    [[48, 42], [66, 36], [84, 38], [98, 46]].map(([x, y]) => k.circle(x, y, 2, "#fff")).join(""),
};

const EXTRA_UNDER_HAT = {
  cat: (k, a) =>
    k.clay("M40 46L36 14L62 30Z", a.hairC) + k.clay("M74 28L90 4L98 38Z", a.hairC) +
    k.path("M44 40L42 22L56 31Z", "#ff9fc0") + k.path("M80 28L90 14L94 34Z", "#ff9fc0"),
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
  hoodie: (k, a) => k.clay("M44 114Q38 94 58 94Q70 96 72 106Z", shade(a.topC, -0.12)),
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
  phones: (k, a) => k.stroke("M50 70C46 30 66 22 76 22C96 22 108 34 106 48", "#2b2233", 4.5) + `<rect x="47" y="60" width="14" height="20" rx="7" fill="${a.acC}"/>`,
  chain: (k) => k.stroke("M70 104Q80 118 88 104", GOLD, 2.6, 'stroke-dasharray="4 2"'),
  pearls: (k) => [[72, 106], [76, 111], [81, 113], [86, 110], [89, 105]].map(([x, y]) => k.circle(x, y, 2.6, "#fff")).join(""),
  scarf: (k, a) => k.clay("M56 100Q72 112 88 100L90 112Q72 124 54 112Z", a.acC) + k.clay("M80 112L90 112L92 132L80 130Z", shade(a.acC, -0.1)),
  cassette: (k, a) =>
    k.stroke("M70 104L80 120L88 104", "#2b2233", 1.6) +
    `<g transform="translate(80 124)"><rect x="-8" y="-5.5" width="16" height="11" rx="2.5" fill="${a.acC}"/><rect x="-5" y="-3.5" width="10" height="4.5" rx="1.5" fill="#fff"/></g>`,
  camera: (k, a) =>
    k.stroke("M64 104L82 124L88 106", "#2b2233", 1.6) +
    `<g transform="translate(82 128)"><rect x="-10" y="-7" width="20" height="14" rx="4" fill="#f4f4f6"/><rect x="-10" y="-7" width="20" height="4.5" rx="2.2" fill="${a.acC}"/>` +
    k.circle(0, 2, 4, "#2b2233") + k.circle(0, 2, 2, "#6c86ff") + `</g>`,
  bag: (k, a) => k.stroke("M84 104L52 144", "#2b2233", 3) + k.clay("M36 136Q50 132 58 140V154H34Z", a.acC),
};
