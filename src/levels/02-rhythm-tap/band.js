import { createPaintKit } from "../../avatar/svg-kit.js";
import { avatarHairBehind, avatarHead, avatarTorso, shade, torsoClip, trousersColour } from "../../avatar/render-avatar.js";

/**
 * Level 2's band: each member is the avatar (same head and clothes as in the
 * editor) with its own pose and instrument, drawn front-on. The moving parts
 * have classes that level.css animates in time with the song:
 * .strum, .fret (guitar), .mic-arm, .wave, .mouth (vocals), .hand-left,
 * .hand-right (keyboard), .stick-left, .stick-right, .cymbal (drums).
 *
 * In the hand-painted teen look of the avatar (31/10/2026): drawn with the
 * paint kit (flat colours, hard shadow, paint grain), the head shrunk
 * (HEAD_SCALE) and the body and arms stretched (BODY_STRETCH), with long
 * thin legs, so they read as teenagers rather than toys.
 *
 * Drawing units: 160 wide, feet on y = 250.
 */

let count = 0;

const kit = () => createPaintKit(`level-02-band-${++count}`);

// Teen proportions: the head shrinks around the neck, the body grows downwards.
const NECK_Y = 114;
const HEAD_SCALE = 0.74;
const BODY_STRETCH = 1.28;
const head = (content) => `<g transform="translate(80 ${NECK_Y}) scale(${HEAD_SCALE}) translate(-80 -${NECK_Y})">${content}</g>`;
const body = (content) => `<g transform="translate(0 ${NECK_Y}) scale(1 ${BODY_STRETCH}) translate(0 -${NECK_Y})">${content}</g>`;

function open(k, a, label) {
  return `<svg class="member-svg" viewBox="0 -4 160 264" role="img" aria-label="${label}">${k.defs(torsoClip(k))}` +
    `<ellipse cx="80" cy="251" rx="44" ry="6" fill="#3a1e2a" opacity=".16"/>` +
    `<g filter="url(#${k.ids.paint})">` + head(avatarHairBehind(k, a));
}

const close = () => "</g></svg>";

/** Two long standing legs with shoes. */
function legs(k, a) {
  return [71, 89].map((x) =>
    k.stroke(`M${x} 176V236`, trousersColour(a), 14) +
    `<g transform="translate(0 21)">` +
    k.clay(`M${x - 11} 222Q${x - 12} 211 ${x} 210Q${x + 12} 211 ${x + 11} 222Q${x + 10} 229 ${x} 229Q${x - 10} 229 ${x - 11} 222Z`, a.acC) +
    `</g>`).join("");
}

/** An arm from shoulder to elbow to hand, inside a group that turns at the shoulder. */
function arm(k, a, cls, shoulder, elbow, hand, extra = "") {
  return `<g class="${cls}" style="transform-origin:${shoulder[0]}px ${shoulder[1]}px">` +
    k.stroke(`M${shoulder[0]} ${shoulder[1]}L${elbow[0]} ${elbow[1]}`, a.topC, 11) +
    k.stroke(`M${elbow[0]} ${elbow[1]}L${hand[0]} ${hand[1]}`, a.skin, 8) +
    k.circle(hand[0], hand[1], 5.5, a.skin) + extra + `</g>`;
}

/** You: the guitar. */
export function guitarist(a, label) {
  const k = kit();
  const wood = "#d9763a";
  const guitar =
    `<g transform="rotate(-24 70 156)">` +
    k.clay("M118 150h58v9h-58z", "#7a4f35") + // neck
    k.clay("M172 146h14v17h-14z", "#5b3a26") + // head
    [176, 181].map((x) => k.circle(x, 144, 2, "#e2b545") + k.circle(x, 165, 2, "#e2b545")).join("") +
    k.clay("M70 132C88 132 96 142 104 142C116 142 124 146 124 156C124 166 116 170 104 170C96 170 88 180 70 180C52 180 40 170 40 156C40 142 52 132 70 132Z", wood) +
    k.circle(92, 156, 8, "#4a2e1f") +
    k.clay("M60 150h8v12h-8z", "#4a2e1f") +
    [152, 155, 158, 161].map((y) => k.stroke(`M64 ${y}H182`, "#f1ece4", 0.8, 'opacity=".75"')).join("") +
    `</g>`;
  return open(k, a, label) + legs(k, a) +
    body(avatarTorso(k, a) + guitar +
      arm(k, a, "fret", [102, 122], [128, 128], [140, 116]) +
      arm(k, a, "strum", [58, 122], [56, 148], [86, 156])) +
    head(avatarHead(k, a)) + close();
}

/** A friend at the microphone, singing. */
export function singer(a, label) {
  const k = kit();
  const stand = k.stroke("M112 250V104", "#3a3f66", 4) + k.stroke("M96 250h32", "#3a3f66", 5) + k.stroke("M112 104L100 98", "#3a3f66", 3);
  const mic = k.clay("M92 96a8 8 0 1 0 .1 0Z", "#c9cbd6") + k.path("M92 98a6 6 0 0 1 12 0", "none", 'stroke="#8a8ca0" stroke-width="1.5"');
  const mouth = `<ellipse class="mouth" cx="80" cy="100" rx="4.5" ry="5.5" fill="#7a2f3d" style="transform-origin:80px 98px"/>`;
  return open(k, a, label) + legs(k, a) + stand +
    body(avatarTorso(k, a) + arm(k, a, "wave", [58, 122], [40, 104], [36, 84])) +
    head(avatarHead(k, a) + mouth) + mic +
    body(arm(k, a, "mic-arm", [102, 122], [114, 130], [100, 104])) + close();
}

/** A friend on the keyboard. */
export function keyboardist(a, label) {
  const k = kit();
  const keys =
    k.stroke("M40 250L120 190M120 250L40 190", "#3a3f66", 4) +
    k.clay("M14 176h132v18H14z", "#2b2233") +
    Array.from({ length: 15 }, (_, i) => `<rect x="${18 + i * 8.4}" y="179" width="7.4" height="13" rx="1.5" fill="#f1ece4"/>`).join("") +
    [0, 1, 3, 4, 5, 7, 8, 10, 11, 12].map((i) => `<rect x="${23.5 + i * 8.4}" y="179" width="4.6" height="8" rx="1" fill="#2b2233"/>`).join("") +
    k.circle(130, 172, 2, "#e4573d");
  return open(k, a, label) + legs(k, a) +
    body(avatarTorso(k, a)) + keys +
    body(arm(k, a, "hand-left", [58, 122], [48, 146], [60, 164]) +
      arm(k, a, "hand-right", [102, 122], [112, 146], [98, 164])) +
    head(avatarHead(k, a)) + close();
}

/** A friend on the drums, sitting behind the kit. */
export function drummer(a, label) {
  const k = kit();
  const stick = (x, y) => k.stroke(`M${x} ${y}l20 -16`, "#e8c48a", 3.5);
  const kitFront =
    k.stroke("M144 252V104M10 252V128", "#8a8ca0", 2.5) +
    `<g class="cymbal" style="transform-origin:144px 104px">${k.clay("M120 104Q144 94 168 104Q144 110 120 104Z", "#e2b545")}</g>` +
    k.clay("M-6 128Q10 120 26 128Q10 133-6 128Z", "#e2b545") +
    k.clay("M18 180Q40 172 62 180V196Q40 204 18 196Z", "#f1ece4") + // snare
    k.clay("M104 168Q122 162 140 168V184Q122 190 104 184Z", "#d9576f") + // tom
    k.clay("M80 180a38 38 0 1 0 .1 0Z", "#d9576f") + // bass drum
    k.circle(80, 218, 27, "#f1ece4", ".95") +
    `<text x="80" y="224" text-anchor="middle" font-size="15" font-family="Schoolbell, Arial, sans-serif" fill="#c0475f">SIGNALS</text>`;
  return open(k, a, label) +
    body(avatarTorso(k, a) +
      arm(k, a, "stick-left", [58, 122], [44, 146], [42, 166], stick(36, 170)) +
      arm(k, a, "stick-right", [102, 122], [118, 140], [118, 156], stick(112, 160))) +
    head(avatarHead(k, a)) + kitFront + close();
}

/*
 * The crowd: fictional fans seen from behind, watching the band. Each one is
 * drawn from a random avatar (hair, hat, headphones, clothes…), painted
 * like the band (flat colours and a hard shadow; no grain, so the big moving
 * crowd stays smooth). The head is smaller than the old toy one: teens.
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
    // A teen-sized head.
    `<g transform="translate(35 48) scale(.92) translate(-35 -48)">` +
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
