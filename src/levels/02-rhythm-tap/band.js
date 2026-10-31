import { createPaintKit } from "../../avatar/svg-kit.js";
import { paintedPieces } from "../../avatar/painted-avatar.js";
import { shade } from "../../avatar/render-avatar.js";

/**
 * Level 2's band: each member is the painted avatar (exactly the face, hair
 * and clothes chosen in the editor, painted-avatar.js) with its own arms and
 * instrument, drawn front-on. The moving parts have classes that level.css
 * animates in time with the song:
 * .strum, .fret (guitar), .mic-arm, .wave, .mouth (vocals), .hand-left,
 * .hand-right (keyboard), .stick-left, .stick-right, .cymbal (drums).
 *
 * Drawing units: the painted avatar's (200 wide, shoulders at y 160, feet at
 * y 410). The instruments and arms are drawn in the old 160-wide units and
 * placed on the body by HANDS (shoulders at (58, 122) and (102, 122) there).
 */

let count = 0;

const kit = () => createPaintKit(`level-02-band-${++count}`);

/** Puts drawings made in the old units onto the painted body. */
const HANDS = (content) => `<g transform="translate(100 164) scale(1.55) translate(-80 -122)">${content}</g>`;

/** Opens a member's drawing: the painted avatar without its arms. */
function member(a, label, { legs = true } = {}) {
  const p = paintedPieces(a);
  return {
    p,
    open: `<svg class="member-svg" viewBox="-44 -30 300 450" role="img" aria-label="${label}">${p.defs}${p.clip}<g filter="url(#${p.id}-paint)">` +
      p.shadow + p.backHair + (legs ? p.lower : "") + p.neck + p.top + p.acc,
    close: "</g></svg>",
  };
}

/** An arm from shoulder to elbow to hand, inside a group that turns at the shoulder. */
function arm(k, p, cls, shoulder, elbow, hand, extra = "") {
  return `<g class="${cls}" style="transform-origin:${shoulder[0]}px ${shoulder[1]}px">` +
    k.stroke(`M${shoulder[0]} ${shoulder[1]}L${elbow[0]} ${elbow[1]}`, p.colours.top, 9) +
    k.stroke(`M${elbow[0]} ${elbow[1]}L${hand[0]} ${hand[1]}`, p.colours.skin, 6) +
    `<circle cx="${hand[0]}" cy="${hand[1]}" r="4.6" fill="${p.colours.skin}"/>` + extra + `</g>`;
}

/** You: the guitar. */
export function guitarist(a, label) {
  const k = kit();
  const { p, open, close } = member(a, label);
  const guitar =
    `<g transform="rotate(-24 70 156)">` +
    k.clay("M118 150h58v9h-58z", "#7a4f35") + // neck
    k.clay("M172 146h14v17h-14z", "#5b3a26") + // head
    [176, 181].map((x) => k.circle(x, 144, 2, "#e2b545") + k.circle(x, 165, 2, "#e2b545")).join("") +
    k.clay("M70 132C88 132 96 142 104 142C116 142 124 146 124 156C124 166 116 170 104 170C96 170 88 180 70 180C52 180 40 170 40 156C40 142 52 132 70 132Z", "#d9763a") +
    k.circle(92, 156, 8, "#4a2e1f") +
    k.clay("M60 150h8v12h-8z", "#4a2e1f") +
    [152, 155, 158, 161].map((y) => k.stroke(`M64 ${y}H182`, "#f1ece4", 0.8, 'opacity=".75"')).join("") +
    `</g>`;
  return open + HANDS(guitar +
    arm(k, p, "fret", [102, 122], [128, 128], [140, 116]) +
    arm(k, p, "strum", [58, 122], [56, 148], [86, 156])) +
    p.head + close;
}

/** A friend at the microphone, singing. */
export function singer(a, label) {
  const k = kit();
  // Singing: an open mouth (unless they already have one), animated by level.css.
  const { p, open, close } = member({ ...a, mouth: ["smile", "smirk"].includes(a.mouth) ? "oh" : a.mouth }, label);
  const stand = k.stroke("M150 410V128", "#3a3f66", 5) + k.stroke("M126 410h48", "#3a3f66", 7) + k.stroke("M150 128L130 120", "#3a3f66", 4);
  const mic = k.clay("M120 112a11 11 0 1 0 .1 0Z", "#c9cbd6");
  return open + stand +
    HANDS(arm(k, p, "wave", [58, 122], [40, 104], [36, 84])) +
    p.head + mic +
    HANDS(arm(k, p, "mic-arm", [102, 122], [114, 130], [104, 100])) + close;
}

/** A friend on the keyboard. */
export function keyboardist(a, label) {
  const k = kit();
  const { p, open, close } = member(a, label);
  const keys =
    k.stroke("M40 229L120 176M120 229L40 176", "#3a3f66", 4) +
    k.clay("M14 160h132v18H14z", "#2b2233") +
    Array.from({ length: 15 }, (_, i) => `<rect x="${18 + i * 8.4}" y="163" width="7.4" height="13" rx="1.5" fill="#f1ece4"/>`).join("") +
    [0, 1, 3, 4, 5, 7, 8, 10, 11, 12].map((i) => `<rect x="${23.5 + i * 8.4}" y="163" width="4.6" height="8" rx="1" fill="#2b2233"/>`).join("") +
    k.circle(130, 156, 2, "#e4573d");
  return open + HANDS(keys +
    arm(k, p, "hand-left", [58, 122], [48, 146], [60, 164]) +
    arm(k, p, "hand-right", [102, 122], [112, 146], [98, 164])) +
    p.head + close;
}

/** A friend on the drums, sitting behind the kit. */
export function drummer(a, label) {
  const k = kit();
  const { p, open, close } = member(a, label, { legs: false });
  const stick = (x, y) => k.stroke(`M${x} ${y}l20 -16`, "#e8c48a", 3);
  const kitFront =
    k.stroke("M144 232V104M10 232V128", "#8a8ca0", 2.5) +
    `<g class="cymbal" style="transform-origin:144px 104px">${k.clay("M120 104Q144 94 168 104Q144 110 120 104Z", "#e2b545")}</g>` +
    k.clay("M-6 128Q10 120 26 128Q10 133-6 128Z", "#e2b545") +
    k.clay("M18 168Q40 160 62 168V184Q40 192 18 184Z", "#f1ece4") + // snare
    k.clay("M104 156Q122 150 140 156V172Q122 178 104 172Z", "#d9576f") + // tom
    k.clay("M80 168a36 36 0 1 0 .1 0Z", "#d9576f") + // bass drum
    k.circle(80, 204, 26, "#f1ece4", ".95") +
    `<text x="80" y="210" text-anchor="middle" font-size="15" font-family="Schoolbell, Arial, sans-serif" fill="#c0475f">SIGNALS</text>`;
  return open + HANDS(
    arm(k, p, "stick-left", [58, 122], [44, 146], [42, 166], stick(36, 170)) +
    arm(k, p, "stick-right", [102, 122], [118, 140], [118, 156], stick(112, 160))) +
    p.head + HANDS(kitFront) + close;
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
