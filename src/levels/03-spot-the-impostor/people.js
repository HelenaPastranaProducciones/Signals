import { createPaintKit } from "../../avatar/svg-kit.js";
import { paintedPieces } from "../../avatar/painted-avatar.js";

/**
 * Level 3's people: the painted avatar seen from the front (exactly the face,
 * hair and clothes chosen in the editor, painted-avatar.js), dressed in their
 * tribe's outfit and standing around with what their tribe carries: a
 * skateboard, a controller, a plushie, a coffee, a ball, or a fist in the air.
 *
 * Drawing units: the painted avatar's (200 wide, shoulders at y 160, feet at
 * y 410). Arms, props and the outfits' chest pieces are drawn in the older
 * 160-wide units and placed on the body by HANDS (shoulders at (58, 122)
 * and (102, 122) there). The arms have classes (`.arm-left`, `.arm-right`)
 * that level.css moves.
 */

let count = 0;

/** Puts drawings made in the older units onto the painted body. */
const HANDS = (content) => `<g transform="translate(100 164) scale(1.55) translate(-80 -122)">${content}</g>`;
/** The same for things worn on the head (the older head was centred on (80, 76)). */
const ON_HEAD = (content) => `<g transform="translate(100 88) scale(.98) translate(-80 -76)">${content}</g>`;

// The painted legs: x 86 (left) and 114 (right), from the hips (y 250) to the ankles (y 386).
const LEG_X = [86, 114];

/**
 * Each tribe's own outfit, worn over the avatar's choices: the trousers and
 * shoes (`bottoms`, `trousers`, `shoes`), things on the legs (`legs`, in
 * painted units), on the chest (`body`, older units) and on the headphones
 * (`head`, the gamers' mic). These pieces aren't in the avatar editor:
 * they're what makes each tribe look like itself.
 */
const OUTFITS = {
  // Baggy khaki trousers, knee pads and chunky skate shoes.
  skaters: (k, a) => ({
    bottoms: "cargo", trousers: "#c9a46a", shoes: "#2f2a26",
    legs: LEG_X.map((x) => k.clay(`M${x - 15} 310h30v22h-30z`, "#2f2a26") + k.circle(x, 321, 4, "#e07b39") +
      k.stroke(`M${x - 18} 404h36`, "#f1ece4", 4)).join(""),
  }),
  // Dark joggers with a neon stripe, glowing edges on the top, and a mic on the headphones.
  gamers: (k, a) => ({
    bottoms: "jeans", trousers: "#24203a", shoes: "#24203a",
    legs: k.stroke("M68 254L64 376", a.acC, 3) + k.stroke("M132 254L136 376", a.acC, 3) +
      LEG_X.map((x) => k.stroke(`M${x - 16} 404h32`, a.acC, 3)).join(""),
    body: k.stroke("M58 118L54 164M102 118L106 164", a.acC, 2.4, 'opacity=".9"') +
      k.stroke("M70 112L80 134L90 112", "#14102a", 1.6) + `<rect x="73" y="132" width="14" height="18" rx="3" fill="#f1ece4"/><rect x="75" y="135" width="10" height="4" rx="1" fill="${a.acC}"/>`,
    head: k.stroke("M124 92Q120 106 98 104", "#2b2233", 3) + k.circle(97, 104, 3.4, "#2b2233"),
  }),
  // A pleated skirt in their colour, striped knee socks and shoes with a strap.
  otakus: (k, a) => ({
    bottoms: "skirt", trousers: a.topC, shoes: "#3a2a4a",
    legs: k.stroke("M70 252L62 316M86 254L84 320M100 254V322M114 254L116 320M130 252L138 316", "#3a1e2a", 1.6, 'opacity=".18"') +
      LEG_X.map((x) => k.clay(`M${x - 8} 334h16v54h-16z`, "#f1ece4") +
        [344, 356, 368].map((y) => k.stroke(`M${x - 8} ${y}h16`, a.acC, 3)).join("") +
        k.stroke(`M${x - 12} 396h24`, "#e2b545", 2.4)).join(""),
  }),
  // Ripped black jeans, tall boots, and a studded jacket with a big collar.
  punks: (k, a) => ({
    bottoms: "jeans", trousers: "#1c1a22", shoes: "#2b2233",
    legs: LEG_X.map((x) => k.stroke(`M${x - 7} 296h12M${x - 5} 306h9`, a.skin, 3) +
      k.clay(`M${x - 15} 334h30v62q0 12-12 12h-6q-14 0-12-12Z`, "#2b2233") +
      [346, 358, 370].map((y) => k.stroke(`M${x - 7} ${y}h14`, "#8a8ca0", 2)).join("")).join(""),
    body: k.clay("M58 116Q66 112 74 114L72 168Q62 168 54 164Z", "#2b2233") + k.clay("M102 116Q94 112 86 114L88 168Q98 168 106 164Z", "#2b2233") +
      k.path("M74 114L66 134L60 118Z", "#3a3a4a") + k.path("M86 114L94 134L100 118Z", "#3a3a4a") +
      [[62, 126], [64, 140], [63, 154], [98, 126], [96, 140], [97, 154]].map(([x, y]) => k.circle(x, y, 2.2, "#d8dae6")).join(""),
  }),
  // Cream chinos and loafers, a jumper knotted over the shoulders and a polo collar.
  posh: (k, a) => {
    const jumper = ["#ff9fb8", "#9fd3ff", "#b8e6a8"][a.skin.charCodeAt(3) % 3];
    return {
      bottoms: "cargo", trousers: "#efe7d6", shoes: "#8a5a3c",
      legs: LEG_X.map((x) => k.stroke(`M${x - 8} 398h16`, "#e2b545", 2.4)).join(""),
      body: k.path("M72 108L80 118L76 122Z", "#f1ece4") + k.path("M88 108L80 118L84 122Z", "#f1ece4") +
        k.clay("M56 120Q80 108 104 120Q100 128 80 124Q60 128 56 120Z", jumper) +
        k.clay("M74 122Q80 118 86 122L90 146Q84 148 82 136Q80 148 72 146Z", jumper),
    };
  },
  // Shorts in the team colour, tall sports socks and white sneakers.
  sporty: (k, a) => ({
    bottoms: "shorts", trousers: a.topC, shoes: "#f1ece4",
    legs: k.stroke("M70 252H130", "#f1ece4", 3) +
      LEG_X.map((x) => k.clay(`M${x - 8} 330h16v58h-16z`, "#f1ece4") + k.stroke(`M${x - 8} 340h16M${x - 8} 348h16`, a.topC, 3) +
        k.stroke(`M${x - 18} 404h36`, a.topC, 3)).join(""),
  }),
};

/** An arm from the shoulder to the elbow to the hand, turning at the shoulder. */
function arm(k, a, side, elbow, hand, extra = "") {
  const shoulder = side === "left" ? [58, 122] : [102, 122];
  return `<g class="arm-${side}" style="transform-origin:${shoulder[0]}px ${shoulder[1]}px">` +
    k.stroke(`M${shoulder[0]} ${shoulder[1]}L${elbow[0]} ${elbow[1]}`, a.topC, 9) +
    k.stroke(`M${elbow[0]} ${elbow[1]}L${hand[0]} ${hand[1]}`, a.skin, 6) +
    k.circle(hand[0], hand[1], 4.6, a.skin) + extra + `</g>`;
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

/** Opens a person's drawing; `pieces` comes from paintedPieces. */
const open = (p, label) =>
  `<svg class="person-svg" viewBox="-30 -30 260 450" role="img" aria-label="${label}">${p.defs}${p.clip}<g filter="url(#${p.id}-paint)">${p.shadow}`;

/**
 * One person in the scene.
 * @param {Record<string, string>} a  Their avatar.
 * @param {string} prop  Key of PROPS.
 * @param {string} outfit  Key of OUTFITS (the tribe whose clothes they wear).
 * @param {string} label  Accessible name.
 */
export function person(a, prop, outfit, label) {
  const k = createPaintKit(`level-03-person-${++count}`);
  const clothes = OUTFITS[outfit]?.(k, a) ?? {};
  const p = paintedPieces(a, { bottoms: clothes.bottoms, trousers: clothes.trousers, shoes: clothes.shoes });
  const [behind, front] = (PROPS[prop] || PROPS.fist)(k, a);
  return open(p, label) + HANDS(behind) + p.backHair + p.lower + (clothes.legs ?? "") + p.neck + p.top +
    HANDS(clothes.body ?? "") + p.acc + p.head + (a.acc === "phones" ? ON_HEAD(clothes.head ?? "") : "") +
    HANDS(front) + `</g></svg>`;
}

/** The player, waving: used in the last round. @param {Record<string, string>} a */
export function waving(a) {
  const k = createPaintKit(`level-03-you-${++count}`);
  const p = paintedPieces(a);
  return open(p, "You") + p.backHair + p.lower + p.neck + p.top + p.acc + p.head +
    HANDS(hangLeft(k, a) + arm(k, a, "right", [120, 106], [126, 84])) + `</g></svg>`;
}
