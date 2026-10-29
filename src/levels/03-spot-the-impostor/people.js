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

/** A shoe seen from the front; `sole` is the colour of a thick sole (sneakers, skate shoes), if any. */
const shoe = (k, x, colour, sole) =>
  k.clay(`M${x - 11} 222Q${x - 12} 211 ${x} 210Q${x + 12} 211 ${x + 11} 222Q${x + 10} 229 ${x} 229Q${x - 10} 229 ${x - 11} 222Z`, colour) +
  (sole ? k.path(`M${x - 12} 223H${x + 12}V227Q${x + 12} 231 ${x + 8} 231H${x - 8}Q${x - 12} 231 ${x - 12} 227Z`, sole) : "");

/** Two standing legs with shoes, as the avatar has them. */
function legs(k, a) {
  return [70, 90].map((x) => k.stroke(`M${x} 170V212`, trousersColour(a), 19) + shoe(k, x, a.acC)).join("");
}

/**
 * Each tribe's own outfit, drawn over the avatar's choices: `legs` replaces
 * the plain legs, `body` goes over the top (under the head), `head` goes on
 * the headphones (the gamers' mic). These pieces aren't in the avatar editor: they're what makes each
 * tribe look like itself.
 */
const OUTFITS = {
  // Baggy khaki trousers, knee pads and chunky skate shoes.
  skaters: (k, a) => ({
    legs: [70, 90].map((x) =>
      k.stroke(`M${x} 166V212`, "#c9a46a", 25) + k.stroke(`M${x + 4} 176V208`, "#a88650", 1.6) +
      k.clay(`M${x - 13} 182h26v14h-26z`, "#2f2a26") + k.circle(x, 189, 3, "#e07b39") +
      shoe(k, x, "#2f2a26", "#f4f4f6")).join(""),
  }),
  // Dark joggers with a neon stripe, glowing edges on the top, and a mic on the headphones.
  gamers: (k, a) => ({
    legs: [70, 90].map((x, i) =>
      k.stroke(`M${x} 170V212`, "#24203a", 19) + k.stroke(`M${x + (i ? 8 : -8)} 172V208`, a.acC, 2.5) +
      shoe(k, x, "#24203a", a.acC)).join(""),
    body: k.stroke("M58 118L54 164M102 118L106 164", a.acC, 2.4, 'opacity=".9"') +
      k.stroke("M70 112L80 134L90 112", "#14102a", 1.6) + `<rect x="73" y="132" width="14" height="18" rx="3" fill="#fff"/><rect x="75" y="135" width="10" height="4" rx="1" fill="${a.acC}"/>`,
    head: k.stroke("M124 92Q120 106 98 104", "#2b2233", 3) + k.circle(97, 104, 3.4, "#2b2233"),
  }),
  // A pleated pastel skirt, striped knee socks and shiny shoes with a strap.
  otakus: (k, a) => ({
    legs: [70, 90].map((x) =>
      k.stroke(`M${x} 176V212`, a.skin, 15) + k.stroke(`M${x} 192V212`, "#fff", 16) +
      [196, 202].map((y) => k.stroke(`M${x - 8} ${y}h16`, a.acC, 2.2)).join("") +
      shoe(k, x, "#3a2a4a") + k.stroke(`M${x - 8} 215h16`, "#f2c12e", 1.8)).join("") +
      k.clay("M56 162H104L114 190Q80 198 46 190Z", a.topC) +
      [62, 72, 80, 88, 98].map((x) => k.stroke(`M${x} 166L${x + (x - 80) * 0.3} 192`, "rgba(0,0,0,.12)", 1.6)).join(""),
  }),
  // Ripped black jeans, tall boots, and a studded jacket with a big collar.
  punks: (k, a) => ({
    legs: [70, 90].map((x) =>
      k.stroke(`M${x} 170V212`, "#1c1a22", 19) + k.stroke(`M${x - 4} 184h7M${x - 2} 190h6`, a.skin, 2.4) +
      k.clay(`M${x - 11} 196h22v20q0 12-10 13h-4q-10-1-8-13Z`, "#2b2233") +
      [200, 206, 212].map((y) => k.stroke(`M${x - 5} ${y}h10`, "#8a8ca0", 1.4)).join("")).join(""),
    body: k.clay("M58 116Q66 112 74 114L72 168Q62 168 54 164Z", "#2b2233") + k.clay("M102 116Q94 112 86 114L88 168Q98 168 106 164Z", "#2b2233") +
      k.path("M74 114L66 134L60 118Z", "#3a3a4a") + k.path("M86 114L94 134L100 118Z", "#3a3a4a") +
      [[62, 126], [64, 140], [63, 154], [98, 126], [96, 140], [97, 154]].map(([x, y]) => k.circle(x, y, 2.2, "#d8dae6")).join(""),
  }),
  // Cream chinos and loafers, a jumper knotted over the shoulders and a polo collar.
  posh: (k, a) => {
    const jumper = ["#ff9fb8", "#9fd3ff", "#b8e6a8"][a.skin.charCodeAt(3) % 3];
    return {
      legs: [70, 90].map((x) =>
        k.stroke(`M${x} 170V212`, "#efe7d6", 19) + k.stroke(`M${x - 9} 208h18`, "#e0d6c0", 4) +
        shoe(k, x, "#8a5a3c") + k.stroke(`M${x - 5} 216h10`, "#f2c12e", 1.6)).join(""),
      body: k.path("M72 108L80 118L76 122Z", "#fff") + k.path("M88 108L80 118L84 122Z", "#fff") +
        k.clay("M56 120Q80 108 104 120Q100 128 80 124Q60 128 56 120Z", jumper) +
        k.clay("M74 122Q80 118 86 122L90 146Q84 148 82 136Q80 148 72 146Z", jumper),
    };
  },
  // Shorts in the team colour, tall sports socks and white sneakers.
  sporty: (k, a) => ({
    legs: [70, 90].map((x) =>
      k.stroke(`M${x} 178V212`, a.skin, 15) + k.stroke(`M${x} 196V212`, "#fff", 16) +
      k.stroke(`M${x - 8} 199h16M${x - 8} 203h16`, a.topC, 2) + shoe(k, x, "#fff", a.topC)).join("") +
      k.clay("M54 162H106L108 186H84L80 178L76 186H52Z", a.topC) + k.stroke("M54 166H106", "#fff", 2.4, 'opacity=".8"'),
  }),
};

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
 * @param {string} outfit  Key of OUTFITS (the tribe whose clothes they wear).
 * @param {string} label  Accessible name.
 */
export function person(a, prop, outfit, label) {
  const k = createSvgKit(`level-03-person-${++count}`);
  const [behind, front] = (PROPS[prop] || PROPS.fist)(k, a);
  const clothes = OUTFITS[outfit]?.(k, a) ?? {};
  return `<svg class="person-svg" viewBox="0 -10 160 250" role="img" aria-label="${label}">${k.defs(torsoClip(k))}` +
    `<ellipse cx="80" cy="230" rx="40" ry="6" fill="#000" opacity=".16"/>` +
    behind + avatarHairBehind(k, a) + (clothes.legs ?? legs(k, a)) + avatarTorso(k, a) + (clothes.body ?? "") +
    avatarHead(k, a) + (a.acc === "phones" ? clothes.head ?? "" : "") + front + `</svg>`;
}

/** The player, waving: used in the last round. @param {Record<string, string>} a */
export function waving(a) {
  const k = createSvgKit(`level-03-you-${++count}`);
  return `<svg class="person-svg" viewBox="0 -10 160 250" role="img" aria-label="You">${k.defs(torsoClip(k))}` +
    `<ellipse cx="80" cy="230" rx="40" ry="6" fill="#000" opacity=".16"/>` +
    avatarHairBehind(k, a) + legs(k, a) + avatarTorso(k, a) + avatarHead(k, a) +
    hangLeft(k, a) + arm(k, a, "right", [120, 106], [126, 84]) + `</svg>`;
}

