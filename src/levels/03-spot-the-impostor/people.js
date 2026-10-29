import { createSvgKit } from "../../avatar/svg-kit.js";
import { avatarHairBehind, avatarHead, avatarTorso, torsoClip, trousersColour } from "../../avatar/render-avatar.js";

/**
 * Level 3's people: an avatar seen from the front (same head and clothes as
 * in the editor), standing around with what their tribe carries: a
 * skateboard, a controller, a plushie, a coffee, a ball, or a fist in the air.
 *
 * Drawing units: 160 × 250 like the editor avatar, feet on y = 229.
 * The arms have classes (`.arm-left`, `.arm-right`) that level.css moves.
 */

let count = 0;

/** Two standing legs with shoes. */
function legs(k, a) {
  return [70, 90].map((x) =>
    k.stroke(`M${x} 170V212`, trousersColour(a), 19) +
    k.clay(`M${x - 11} 222Q${x - 12} 211 ${x} 210Q${x + 12} 211 ${x + 11} 222Q${x + 10} 229 ${x} 229Q${x - 10} 229 ${x - 11} 222Z`, a.acC)).join("");
}

/** An arm from the shoulder to the elbow to the hand, turning at the shoulder. */
function arm(k, a, side, elbow, hand, extra = "") {
  const shoulder = side === "left" ? [58, 122] : [102, 122];
  return `<g class="arm-${side}" style="transform-origin:${shoulder[0]}px ${shoulder[1]}px">` +
    k.stroke(`M${shoulder[0]} ${shoulder[1]}L${elbow[0]} ${elbow[1]}`, a.topC, 14) +
    k.stroke(`M${elbow[0]} ${elbow[1]}L${hand[0]} ${hand[1]}`, a.skin, 11) +
    k.circle(hand[0], hand[1], 7, a.skin) + extra + `</g>`;
}

const hangLeft = (k, a, extra) => arm(k, a, "left", [52, 144], [50, 164], extra);
const hangRight = (k, a, extra) => arm(k, a, "right", [108, 144], [110, 164], extra);

/** What each tribe carries, and how the arms hold it: [behind the body, in front]. */
const PROPS = {
  skateboard: (k, a) => [
    // The board stands on its tail beside them, held at the top.
    `<g transform="rotate(8 128 176)">${k.clay("M120 108h16a6 6 0 0 1 6 6v108a6 6 0 0 1-6 6h-16a6 6 0 0 1-6-6V114a6 6 0 0 1 6-6Z", "#ff8a3c")}` +
    k.path("M122 140h12v40h-12z", "#ffe36b", 'opacity=".8"') +
    [118, 218].map((y) => k.circle(115, y, 5, "#f4f4f6") + k.circle(141, y, 5, "#f4f4f6")).join("") + `</g>`,
    hangLeft(k, a) + arm(k, a, "right", [116, 136], [124, 116]),
  ],
  controller: (k, a) => [
    "",
    arm(k, a, "left", [56, 150], [70, 156]) + arm(k, a, "right", [104, 150], [90, 156]) +
      k.clay("M58 150Q80 142 102 150Q108 164 98 168Q88 170 84 162H76Q72 170 62 168Q52 164 58 150Z", "#2b2233") +
      k.circle(68, 154, 3, "#7fe3c0") + k.circle(92, 152, 2.2, "#ff5a8a") + k.circle(96, 157, 2.2, "#ffe36b"),
  ],
  plushie: (k, a) => [
    "",
    k.clay("M80 128a22 22 0 1 0 .1 0Z", "#f6c7a0") + k.circle(64, 132, 7, "#f6c7a0") + k.circle(96, 132, 7, "#f6c7a0") +
      k.circle(73, 148, 2.6, "#2b2233") + k.circle(87, 148, 2.6, "#2b2233") + k.path("M76 156q4 4 8 0", "none", 'stroke="#2b2233" stroke-width="2"') +
      arm(k, a, "left", [52, 150], [68, 164]) + arm(k, a, "right", [108, 150], [92, 164]),
  ],
  coffee: (k, a) => [
    "",
    hangLeft(k, a, k.clay("M36 166h26v26a4 4 0 0 1-4 4H40a4 4 0 0 1-4-4Z", "#f2b8c6") + k.stroke("M42 168q7-10 14 0", "#2b2233", 2)) +
      arm(k, a, "right", [114, 146], [104, 132], k.clay("M98 116h14l-2 18h-10Z", "#fff") + k.path("M98 122h14v5H98z", "#7a4b2a")),
  ],
  ball: (k, a) => [
    "",
    hangLeft(k, a) + k.clay("M118 144a17 17 0 1 0 .1 0Z", "#ff8a3c") +
      k.stroke("M101 161h34M118 144v34", "#2b2233", 1.6, 'opacity=".55"') + arm(k, a, "right", [114, 148], [104, 168]),
  ],
  // Punks: one fist up in the air.
  fist: (k, a) => ["", hangLeft(k, a) + arm(k, a, "right", [118, 104], [122, 80])],
};

/**
 * One person in the scene.
 * @param {Record<string, string>} a  Their avatar.
 * @param {string} prop  Key of PROPS.
 * @param {string} label  Accessible name.
 */
export function person(a, prop, label) {
  const k = createSvgKit(`level-03-person-${++count}`);
  const [behind, front] = (PROPS[prop] || PROPS.fist)(k, a);
  return `<svg class="person-svg" viewBox="0 -10 160 250" role="img" aria-label="${label}">${k.defs(torsoClip(k))}` +
    `<ellipse cx="80" cy="230" rx="40" ry="6" fill="#000" opacity=".16"/>` +
    behind + avatarHairBehind(k, a) + legs(k, a) + avatarTorso(k, a) + avatarHead(k, a) + front + `</svg>`;
}

/** The player, waving: used in the last round. @param {Record<string, string>} a */
export function waving(a) {
  const k = createSvgKit(`level-03-you-${++count}`);
  return `<svg class="person-svg" viewBox="0 -10 160 250" role="img" aria-label="You">${k.defs(torsoClip(k))}` +
    `<ellipse cx="80" cy="230" rx="40" ry="6" fill="#000" opacity=".16"/>` +
    avatarHairBehind(k, a) + legs(k, a) + avatarTorso(k, a) + avatarHead(k, a) +
    hangLeft(k, a) + arm(k, a, "right", [120, 106], [126, 84]) + `</svg>`;
}

