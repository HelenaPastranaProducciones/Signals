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

// Hair from the side. Every style shares the same hairline: from the nape, up
// behind the ear, a sideburn in front of it, then a fringe of soft locks over
// the forehead, so the face and the ear always stay clear.
const HAIRLINE = "Q60 92 60 84Q58 66 66 58Q72 52 80 54Q86 46 92 52Q98 46 106 54";
// Short hair: a soft cap over the top and back of the head.
const CAP = `M106 54C108 30 90 20 70 20C46 20 28 36 28 64C28 84 34 96 44 102L54 98${HAIRLINE}Z`;
// Bob: the same cap, falling to the jaw at the back with a rounded end.
const BOB = "M106 54C108 30 90 20 70 20C46 20 26 36 26 66C26 90 30 104 38 110Q50 114 60 108Q62 100 62 92Q60 70 66 58Q72 52 80 54Q86 46 92 52Q98 46 106 54Z";
// Buzz: close to the head, no volume.
const BUZZ = "M104 52C104 34 90 29 70 29C48 29 32 44 32 66C32 82 38 94 46 100L54 96Q60 90 60 82Q60 66 68 58Q84 48 104 52Z";
// Afro: one big round mass around the head, with the face cut out.
const AFRO = "M108 62C118 30 94 4 64 6C30 8 8 38 14 70C18 96 34 108 52 104Q60 98 60 86Q58 66 66 58Q72 52 80 54Q94 50 108 62Z";

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
    k.clay(HEAD, a.skin),
    k.circle(105, 76, 4, a.skin),
    face(k, a),
    draw(HAIR_FRONT, a.hair, k, a),
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

/** A round blob of hair (bun, curl). */
const ball = (k, x, y, r, colour) => k.clay(`M${x} ${y - r}a${r} ${r} 0 1 0 .1 0Z`, colour);

/** Hair drawn behind the head (and, when long, behind the body). */
const HAIR_BACK = {
  long: (k, a) =>
    k.clay("M30 66C22 96 24 128 30 150Q36 160 46 158Q54 160 62 150Q56 124 58 98Z", shade(a.hairC, -0.12)) +
    k.stroke("M38 104Q36 128 42 150", "rgba(0,0,0,.12)", 2),
  bun: (k, a) => ball(k, 34, 32, 15, a.hairC) + k.stroke("M42 44Q48 38 46 30", shade(a.acC, -0.05), 4),
  buns: (k, a) => ball(k, 46, 18, 12, shade(a.hairC, -0.15)) + ball(k, 68, 12, 13, a.hairC),
};

/** Hair over the head. */
const HAIR_FRONT = {
  short: (k, a) => k.clay(CAP, a.hairC) + shine(k),
  bob: (k, a) => k.clay(BOB, a.hairC) + shine(k) + k.stroke("M36 94Q40 104 48 108", "rgba(0,0,0,.12)", 2),
  long: (k, a) => k.clay(BOB, a.hairC) + shine(k),
  bun: (k, a) => k.clay(CAP, a.hairC) + shine(k),
  buns: (k, a) => k.clay(CAP, a.hairC) + shine(k),
  buzz: (k, a) =>
    k.path(BUZZ, a.hairC, 'opacity=".9"') +
    [[50, 40], [62, 34], [76, 33], [44, 54], [40, 70], [90, 38]].map(([x, y]) => k.circle(x, y, 1.2, shade(a.hairC, -0.3), ".5")).join(""),
  curls: (k, a) =>
    k.clay(CAP, shade(a.hairC, -0.1)) +
    [[30, 82, 10], [28, 64, 11], [34, 46, 12], [46, 32, 12], [62, 24, 12], [78, 22, 12], [94, 28, 11], [104, 42, 9],
      [40, 96, 9], [92, 48, 7], [80, 50, 7]]
      .map(([x, y, r]) => ball(k, x, y, r, a.hairC)).join(""),
  afro: (k, a) =>
    k.clay(AFRO, a.hairC) +
    [[34, 30], [56, 18], [80, 16], [24, 56], [28, 82], [98, 30], [46, 44], [70, 34]]
      .map(([x, y]) => k.stroke(`M${x - 4} ${y}q4-5 8 0`, shade(a.hairC, -0.25), 1.6, 'opacity=".5"')).join(""),
  mohawk: (k, a) =>
    k.path(BUZZ, shade(a.hairC, -0.3), 'opacity=".85"') +
    k.clay("M102 48Q98 32 108 20Q94 26 90 28Q90 12 96 2Q82 12 78 24Q74 8 70 -2Q62 12 62 24Q54 10 44 6Q48 20 48 30Q40 26 30 26Q38 36 38 50Q66 26 102 48Z", a.hairC),
};

const shine = (k) => k.stroke("M58 28Q76 22 92 30", "#fff", 4, 'opacity=".3"');

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
