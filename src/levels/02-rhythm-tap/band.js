import { createSvgKit } from "../../avatar/svg-kit.js";
import { avatarHairBehind, avatarHead, avatarTorso, shade, torsoClip, trousersColour } from "../../avatar/render-avatar.js";

/**
 * Level 2's band: each member is the avatar (same head and clothes as in the
 * editor) with its own pose and instrument, drawn front-on. The moving parts
 * have classes that level.css animates in time with the song:
 * .strum, .fret (guitar), .mic-arm, .wave, .mouth (vocals), .hand-left,
 * .hand-right (keyboard), .stick-left, .stick-right, .cymbal (drums).
 *
 * Drawing units: 160 × 250, like the editor avatar, feet on y = 229.
 */

let count = 0;

const kit = () => createSvgKit(`level-02-band-${++count}`);

function open(k, a, label) {
  return `<svg class="member-svg" viewBox="0 -10 160 260" role="img" aria-label="${label}">${k.defs(torsoClip(k))}` +
    `<ellipse cx="80" cy="231" rx="44" ry="6" fill="#000" opacity=".18"/>` + avatarHairBehind(k, a);
}

/** Two standing legs with shoes. */
function legs(k, a) {
  return [70, 90].map((x) =>
    k.stroke(`M${x} 170V212`, trousersColour(a), 19) +
    k.clay(`M${x - 11} 222Q${x - 12} 211 ${x} 210Q${x + 12} 211 ${x + 11} 222Q${x + 10} 229 ${x} 229Q${x - 10} 229 ${x - 11} 222Z`, a.acC)).join("");
}

/** An arm from shoulder to elbow to hand, inside a group that turns at the shoulder. */
function arm(k, a, cls, shoulder, elbow, hand, extra = "") {
  return `<g class="${cls}" style="transform-origin:${shoulder[0]}px ${shoulder[1]}px">` +
    k.stroke(`M${shoulder[0]} ${shoulder[1]}L${elbow[0]} ${elbow[1]}`, a.topC, 14) +
    k.stroke(`M${elbow[0]} ${elbow[1]}L${hand[0]} ${hand[1]}`, a.skin, 11) +
    k.circle(hand[0], hand[1], 7, a.skin) + extra + `</g>`;
}

/** You: the guitar. */
export function guitarist(a, label) {
  const k = kit();
  const wood = "#ff8a3c";
  const guitar =
    `<g transform="rotate(-24 70 156)">` +
    k.clay("M118 150h58v9h-58z", "#8a5a3c") + // neck
    k.clay("M172 146h14v17h-14z", "#5b3a26") + // head
    [176, 181].map((x) => k.circle(x, 144, 2, "#f2c12e") + k.circle(x, 165, 2, "#f2c12e")).join("") +
    k.clay("M70 132C88 132 96 142 104 142C116 142 124 146 124 156C124 166 116 170 104 170C96 170 88 180 70 180C52 180 40 170 40 156C40 142 52 132 70 132Z", wood) +
    k.path("M70 138C84 138 92 146 100 146C110 146 116 150 116 156C116 162 110 166 100 166C92 166 84 174 70 174C56 174 46 166 46 156C46 146 56 138 70 138Z", "#ffd27a", 'opacity=".55"') +
    k.circle(92, 156, 8, "#4a2e1f") +
    k.clay("M60 150h8v12h-8z", "#4a2e1f") +
    [152, 155, 158, 161].map((y) => k.stroke(`M64 ${y}H182`, "#fff", 0.8, 'opacity=".75"')).join("") +
    `</g>`;
  return open(k, a, label) + legs(k, a) +
    avatarTorso(k, a) + guitar +
    arm(k, a, "fret", [102, 122], [128, 128], [140, 116]) +
    arm(k, a, "strum", [58, 122], [56, 148], [86, 156]) +
    avatarHead(k, a) + `</svg>`;
}

/** A friend at the microphone, singing. */
export function singer(a, label) {
  const k = kit();
  const stand = k.stroke("M112 229V110", "#3a3f66", 4) + k.stroke("M96 229h32", "#3a3f66", 5) + k.stroke("M112 110L100 104", "#3a3f66", 3);
  const mic = k.clay("M92 96a8 8 0 1 0 .1 0Z", "#c9cbd6") + k.path("M92 98a6 6 0 0 1 12 0", "none", 'stroke="#8a8ca0" stroke-width="1.5"');
  const mouth = `<ellipse class="mouth" cx="80" cy="100" rx="4.5" ry="5.5" fill="#7a2f3d" style="transform-origin:80px 98px"/>`;
  return open(k, a, label) + legs(k, a) + stand +
    avatarTorso(k, a) +
    arm(k, a, "wave", [58, 122], [40, 100], [36, 76]) +
    avatarHead(k, a) + mouth + mic +
    arm(k, a, "mic-arm", [102, 122], [114, 132], [100, 108]) + `</svg>`;
}

/** A friend on the keyboard. */
export function keyboardist(a, label) {
  const k = kit();
  const keys =
    k.stroke("M40 229L120 176M120 229L40 176", "#3a3f66", 4) +
    k.clay("M14 160h132v18H14z", "#2b2233") +
    Array.from({ length: 15 }, (_, i) => `<rect x="${18 + i * 8.4}" y="163" width="7.4" height="13" rx="1.5" fill="#fff"/>`).join("") +
    [0, 1, 3, 4, 5, 7, 8, 10, 11, 12].map((i) => `<rect x="${23.5 + i * 8.4}" y="163" width="4.6" height="8" rx="1" fill="#2b2233"/>`).join("") +
    k.circle(130, 156, 2, "#ff5a3c");
  return open(k, a, label) + legs(k, a) +
    avatarTorso(k, a) + keys +
    arm(k, a, "hand-left", [58, 122], [48, 146], [60, 164]) +
    arm(k, a, "hand-right", [102, 122], [112, 146], [98, 164]) +
    avatarHead(k, a) + `</svg>`;
}

/** A friend on the drums, sitting behind the kit. */
export function drummer(a, label) {
  const k = kit();
  const stick = (x, y) => k.stroke(`M${x} ${y}l20 -16`, "#e8c48a", 3.5);
  const kitFront =
    k.stroke("M144 232V104M10 232V128", "#8a8ca0", 2.5) +
    `<g class="cymbal" style="transform-origin:144px 104px">${k.clay("M120 104Q144 94 168 104Q144 110 120 104Z", "#f2c12e")}</g>` +
    k.clay("M-6 128Q10 120 26 128Q10 133-6 128Z", "#f2c12e") +
    k.clay("M18 168Q40 160 62 168V184Q40 192 18 184Z", "#f4f4f6") + // snare
    k.clay("M104 156Q122 150 140 156V172Q122 178 104 172Z", "#ff5a8a") + // tom
    k.clay("M80 168a36 36 0 1 0 .1 0Z", "#ff5a8a") + // bass drum
    k.circle(80, 204, 26, "#fff", ".92") +
    `<text x="80" y="210" text-anchor="middle" font-size="15" font-weight="800" font-family="Baloo 2, Arial, sans-serif" fill="#ff5a8a">SIGNALS</text>`;
  return open(k, a, label) +
    avatarTorso(k, a) +
    arm(k, a, "stick-left", [58, 122], [44, 146], [42, 166], stick(36, 170)) +
    arm(k, a, "stick-right", [102, 122], [118, 140], [118, 156], stick(112, 160)) +
    avatarHead(k, a) + kitFront + `</svg>`;
}

/*
 * The crowd: fictional fans seen from behind, watching the band. Each one is
 * drawn from a random avatar (hair, hat, headphones, clothes…) in the same
 * clay style, so the crowd looks as detailed as the band.
 *
 * Drawing units: 70 × 96, head centred on (35, 30), shoulders at the bottom.
 */

const ball = (k, x, y, r, colour) => k.clay(`M${x} ${y - r}a${r} ${r} 0 1 0 .1 0Z`, colour);

// The back of the head with hair, seen from behind.
const HAIR_CAP = "M19 32C16 14 25 10 35 10C45 10 54 14 51 32Q50 42 45 46Q35 50 25 46Q20 42 19 32Z";
const FAN_HAIR = {
  short: (k, a) => k.clay(HAIR_CAP, a.hairC),
  buzz: (k, a) => k.path("M20 30C19 17 26 14 35 14C44 14 51 17 50 30Q49 40 44 44Q35 47 26 44Q21 40 20 30Z", a.hairC, 'opacity=".85"'),
  bob: (k, a) => k.clay("M17 32C14 12 25 8 35 8C45 8 56 12 53 32L55 50Q35 56 15 50Z", a.hairC),
  long: (k, a) => k.clay("M17 32C14 12 25 8 35 8C45 8 56 12 53 32L56 72Q35 78 14 72Z", a.hairC) + k.stroke("M35 40V72", "rgba(0,0,0,.14)", 1.6),
  bun: (k, a) => k.clay(HAIR_CAP, a.hairC) + ball(k, 35, 12, 8, a.hairC),
  buns: (k, a) => k.clay(HAIR_CAP, a.hairC) + ball(k, 22, 14, 7, a.hairC) + ball(k, 48, 14, 7, a.hairC),
  curls: (k, a) =>
    k.clay(HAIR_CAP, shade(a.hairC, -0.1)) +
    [[22, 22], [30, 15], [40, 15], [48, 22], [20, 34], [50, 34], [28, 28], [42, 28], [26, 42], [44, 42], [35, 36]]
      .map(([x, y]) => ball(k, x, y, 6.5, a.hairC)).join(""),
  afro: (k, a) => ball(k, 35, 28, 23, a.hairC),
  mohawk: (k, a) =>
    k.path("M20 30C19 17 26 14 35 14C44 14 51 17 50 30Q49 40 44 44Q35 47 26 44Q21 40 20 30Z", shade(a.hairC, -0.3), 'opacity=".8"') +
    k.clay("M30 46V12L33 2L35 10L37 2L40 12V46Z", a.hairC),
};

// Hats and other things on the head, seen from behind.
const FAN_DOME = "M18 30C17 14 26 10 35 10C44 10 53 14 52 30Q35 25 18 30Z";
const FAN_HATS = {
  cap: (k, a) => k.clay(FAN_DOME, a.hatC) + k.path("M31 25h8v5h-8z", "rgba(0,0,0,.3)") + k.circle(35, 11, 2.4, shade(a.hatC, -0.2)),
  backcap: (k, a) => k.clay(FAN_DOME, a.hatC) + k.clay("M17 28Q35 40 53 28Q35 33 17 28Z", shade(a.hatC, -0.15)) + k.circle(35, 11, 2.4, shade(a.hatC, -0.2)),
  beanie: (k, a) => k.clay("M18 30C17 10 26 4 35 4C44 4 53 10 52 30Q35 24 18 30Z", a.hatC) + k.clay("M17 26Q35 20 53 26V32Q35 26 17 32Z", shade(a.hatC, -0.14)) + ball(k, 35, 3, 4.5, "#fff"),
  bucket: (k, a) => k.clay("M21 28C21 12 28 8 35 8C42 8 49 12 49 28Z", a.hatC) + k.clay("M10 31Q35 22 60 31Q60 36 52 36Q35 30 18 36Q10 36 10 31Z", shade(a.hatC, -0.1)),
  bandana: (k, a) => k.clay(FAN_DOME, a.hatC) + k.clay("M33 28L27 40L33 38Z", a.hatC) + k.clay("M37 28L43 40L37 38Z", shade(a.hatC, -0.1)),
};

const FAN_EXTRAS = {
  cat: (k, a) => k.clay("M20 20L18 2L32 12Z", a.hairC) + k.clay("M50 20L52 2L38 12Z", a.hairC),
  bow: (k) => k.clay("M44 18L36 13V23Z", "#ff5c93") + k.clay("M44 18L52 13V23Z", "#ff5c93") + k.circle(44, 18, 2.6, "#e63e78"),
  flower: (k) => [0, 1, 2, 3, 4].map((i) => k.circle(46 + Math.cos(i * 1.2566) * 3, 22 + Math.sin(i * 1.2566) * 3, 2.8, "#a174ff")).join("") + k.circle(46, 22, 2, "#ffe36b"),
  stars: (k) => k.star(46, 24, 0.5, "#ffe36b") + k.star(24, 22, 0.45, "#7fe3c0"),
};

/** What the fan does with their hands: wave both, film with a phone or hold a light stick. */
const FAN_ARMS = {
  wave: (k, a) =>
    `<g class="fan-arms">${k.stroke("M14 72L6 34", a.topC, 9)}${k.circle(6, 31, 5, a.skin)}` +
    `${k.stroke("M56 72L64 34", a.topC, 9)}${k.circle(64, 31, 5, a.skin)}</g>`,
  phone: (k, a) =>
    `<g class="fan-item">${k.stroke("M56 72L60 30", a.topC, 9)}${k.circle(60, 28, 5, a.skin)}` +
    `<rect x="53" y="8" width="14" height="22" rx="3" fill="#2b2233"/><rect x="55" y="10" width="10" height="17" rx="1.5" fill="#bfe3ff"/>` +
    `<rect x="55" y="10" width="10" height="17" rx="1.5" fill="#fff" class="fan-screen"/></g>`,
  stick: (k, a, glow) =>
    `<g class="fan-item">${k.stroke("M14 72L8 30", a.topC, 9)}` +
    `<rect x="1" y="-2" width="14" height="36" rx="7" fill="${glow}" opacity=".3"/><rect x="5" y="2" width="6" height="28" rx="3" fill="${glow}"/>${k.circle(8, 30, 5, a.skin)}</g>`,
};

/**
 * One fan in the crowd, from behind.
 * @param {Record<string, string>} a  A random avatar.
 * @param {"wave" | "phone" | "stick"} hands
 * @param {string} glow  Colour of the light stick.
 */
export function fan(a, hands, glow) {
  const k = kit();
  const back = a.top === "jersey"
    ? `<text x="35" y="86" text-anchor="middle" font-size="13" font-weight="800" font-family="Arial Black,Arial,sans-serif" fill="${a.acC}">10</text>`
    : a.top === "stripes" ? [74, 82, 90].map((y) => `<rect x="8" y="${y}" width="54" height="3.5" fill="${a.acC}"/>`).join("")
    : a.top === "overalls" ? k.stroke("M22 62L46 96M48 62L24 96", a.acC, 5)
    : "";
  return `<svg viewBox="0 0 70 96" aria-hidden="true">${k.defs(`<clipPath id="${k.ids.bodyClip}"><path d="M4 96Q4 62 35 60Q66 62 66 96Z"/></clipPath>`)}` +
    k.clay("M4 96Q4 62 35 60Q66 62 66 96Z", a.topC) +
    `<g clip-path="url(#${k.ids.bodyClip})">${back}</g>` +
    (a.top === "hoodie" ? k.clay("M20 66Q35 52 50 66Q35 76 20 66Z", shade(a.topC, -0.15)) : "") +
    (a.acc === "bag" ? k.stroke("M12 66L58 94", "#2b2233", 3) : "") +
    k.path("M29 48h12v14H29z", shade(a.skin, -0.12)) +
    // A big head, like the avatars.
    `<g transform="translate(35 40) scale(1.2) translate(-35 -40)">` +
    k.circle(18, 34, 5, a.skin) + k.circle(52, 34, 5, a.skin) +
    k.clay("M35 12C46 12 51 20 51 31C51 42 44 49 35 49C26 49 19 42 19 31C19 20 24 12 35 12Z", a.skin) +
    (FAN_HAIR[a.hair] ? FAN_HAIR[a.hair](k, a) : "") +
    (a.pin === "cat" ? FAN_EXTRAS.cat(k, a) : "") +
    (FAN_HATS[a.hat] ? FAN_HATS[a.hat](k, a) : "") +
    (a.pin !== "cat" && FAN_EXTRAS[a.pin] ? FAN_EXTRAS[a.pin](k, a) : "") +
    (a.acc === "phones" ? k.stroke("M17 34C15 6 55 6 53 34", "#2b2233", 3.5) + k.clay("M12 28h8v13h-8zM50 28h8v13h-8z", a.acC) : "") +
    `</g>` +
    FAN_ARMS[hands](k, a, glow) +
    `</svg>`;
}
