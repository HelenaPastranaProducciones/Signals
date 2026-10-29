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

/** Fictional fans in the crowd: a head and shoulders in a soft colour. */
export function fan(colour, skin) {
  return `<svg viewBox="0 0 60 70" aria-hidden="true">` +
    `<path d="M4 70Q6 44 30 44Q54 44 56 70Z" fill="${colour}"/>` +
    `<circle cx="30" cy="26" r="17" fill="${skin}"/><path d="M13 24Q14 6 30 6Q46 6 47 24Q40 14 30 14Q20 14 13 24Z" fill="${shade(colour, -0.35)}"/>` +
    `<g class="fan-arms"><path d="M8 52L2 26" stroke="${colour}" stroke-width="8" stroke-linecap="round"/><circle cx="2" cy="24" r="5" fill="${skin}"/>` +
    `<path d="M52 52L58 26" stroke="${colour}" stroke-width="8" stroke-linecap="round"/><circle cx="58" cy="24" r="5" fill="${skin}"/></g></svg>`;
}
