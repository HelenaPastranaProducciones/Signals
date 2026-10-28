import { createSvgKit } from "../../avatar/svg-kit.js";

/**
 * The runner of level 1: a side-on, chibi platformer character built from
 * the player's avatar choices (skin, hair, hat, glasses, clothes, extras).
 * It faces right. Limbs are nested groups so level.css can animate them:
 * .thigh/.shin and .upperarm/.forearm (each with -front or -back), inside
 * .body (everything above the ground, for the bob and the crouch).
 *
 * Drawing units: 140 × 210, feet on y = 206.
 */

const TROUSERS = "#3a3f66";
const INK = "#26202a";
const GOLD = "#f2c12e";

const HEAD = { x: 74, y: 58, rx: 42, ry: 41 };
const TORSO = "M52 98Q72 90 94 98L96 140Q72 150 48 140Z";

let count = 0;

/** @param {Record<string, string>} a  An avatar (see DEFAULT_AVATAR). */
export function runnerCharacter(a) {
  const k = createSvgKit(`level-01-runner-${++count}`);
  const clip = `${k.ids.bodyClip}`;
  const darker = shade(a.topC, -0.18);
  const skinDark = shade(a.skin, -0.12);

  const leg = (side, x) => {
    const colour = side === "back" ? shade(TROUSERS, -0.15) : TROUSERS;
    const shoe = side === "back" ? shade(a.acC, -0.15) : a.acC;
    return `<g transform="translate(${x} 136)"><g class="thigh thigh-${side}">` +
      k.stroke("M0 0V30", colour, 18) +
      `<g transform="translate(0 30)"><g class="shin shin-${side}">` +
      k.stroke("M0 0V30", colour, 15) +
      k.clay("M-9 26Q-10 34-6 36H17Q20 30 13 26Q4 22-9 26Z", shoe) +
      k.path("M-7 34H17", "none", `stroke="#fff" stroke-width="2.5" opacity=".7"`) +
      `</g></g></g></g>`;
  };

  const arm = (side, x) => {
    const sleeve = side === "back" ? darker : a.topC;
    const skin = side === "back" ? skinDark : a.skin;
    return `<g transform="translate(${x} 104)"><g class="upperarm upperarm-${side}">` +
      k.stroke("M0 0V20", sleeve, 14) +
      `<g transform="translate(0 20)"><g class="forearm forearm-${side}">` +
      k.stroke("M0 0V16", skin, 11) + k.circle(0, 19, 7.5, skin) +
      `</g></g></g></g>`;
  };

  const head = [
    draw(HAIR_BACK, a.hair, k, a),
    k.circle(60, 62, 10, a.skin),
    `<ellipse cx="60" cy="62" rx="4.5" ry="6" fill="#000" opacity=".1"/>`,
    k.clay(`M${HEAD.x} ${HEAD.y - HEAD.ry}C${HEAD.x + 30} ${HEAD.y - HEAD.ry} ${HEAD.x + HEAD.rx} ${HEAD.y - 22} ${HEAD.x + HEAD.rx} ${HEAD.y}C${HEAD.x + HEAD.rx} ${HEAD.y + 26} ${HEAD.x + 24} ${HEAD.y + HEAD.ry} ${HEAD.x} ${HEAD.y + HEAD.ry}C${HEAD.x - 26} ${HEAD.y + HEAD.ry} ${HEAD.x - HEAD.rx} ${HEAD.y + 24} ${HEAD.x - HEAD.rx} ${HEAD.y}C${HEAD.x - HEAD.rx} ${HEAD.y - 24} ${HEAD.x - 28} ${HEAD.y - HEAD.ry} ${HEAD.x} ${HEAD.y - HEAD.ry}Z`, a.skin),
    k.circle(116, 64, 5, a.skin),
    k.circle(96, 74, a.face === "blush" ? 9 : 7, a.face === "blush" ? "#ff4f8b" : "#ff6a6a", a.face === "blush" ? ".45" : ".3"),
    draw(FACE_MARKS, a.face, k, a),
    k.stroke("M88 40Q96 36 104 40", "#2a1f24", 3.5),
    (EYES[a.eyes] || EYES.dots)(k, a),
    (MOUTHS[a.mouth] || MOUTHS.smile)(k, a),
    draw(HAIR_FRONT, a.hair, k, a),
    draw(EXTRAS_UNDER_HAT, a.pin, k, a),
    draw(HATS, a.hat, k, a),
    draw(EXTRAS_OVER_HAT, a.pin, k, a),
    draw(GLASSES, a.gl, k, a),
    a.acc === "phones" ? HEADPHONES(k, a) : "",
  ].join("");

  return `<svg class="character" viewBox="0 0 140 210" aria-hidden="true">
    ${k.defs(`<clipPath id="${clip}"><path d="${TORSO}"/></clipPath>`)}
    <ellipse class="shadow" cx="72" cy="206" rx="34" ry="5" fill="#000" opacity=".14"/>
    <g class="body">
      ${a.hair === "long" ? k.clay("M34 60Q30 112 44 132Q62 138 66 120L64 70Z", shade(a.hairC, -0.08)) : ""}
      ${arm("back", 64)}
      ${leg("back", 64)}
      ${draw(TOP_BACK, a.top, k, a)}
      ${k.clay(TORSO, a.topC)}
      <g clip-path="url(#${clip})">${draw(TOP_FRONT, a.top, k, a)}</g>
      ${draw(BODY_ACCESSORIES, a.acc, k, a)}
      ${leg("front", 80)}
      ${head}
      ${arm("front", 80)}
    </g>
  </svg>`;
}

const draw = (table, option, k, a) => (table[option] ? table[option](k, a) : "");

/** Lightens (amount > 0) or darkens (amount < 0) a #rrggbb colour. */
function shade(hex, amount) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const target = amount < 0 ? 0 : 255;
  return `rgb(${channels.map((c) => Math.round(c + (target - c) * Math.abs(amount))).join(",")})`;
}

// Hair seen from the side: a cap over the top and back of the head, a fringe at the front.
const CAP = "M32 66Q26 16 76 14Q108 14 116 42Q104 32 88 34Q84 44 70 46Q54 48 50 66Q44 82 36 84Z";

const HAIR_BACK = {
  afro: (k, a) => k.clay("M66 -4C108 -4 124 26 118 52C110 64 30 72 22 54C12 22 30 -4 66 -4Z", a.hairC),
  bob: (k, a) => k.clay("M32 50Q30 16 72 14Q100 16 108 36L66 50Q60 92 54 98Q36 100 30 88Z", a.hairC),
  bun: (k, a) => k.clay("M44 4a16 16 0 1 0 .1 0Z", a.hairC),
  buns: (k, a) => k.clay("M52 0a15 15 0 1 0 .1 0Z", a.hairC) + k.clay("M94 2a14 14 0 1 0 .1 0Z", a.hairC),
};

const HAIR_FRONT = {
  short: (k, a) => k.clay(CAP, a.hairC),
  buzz: (k, a) => k.path("M34 62Q28 18 76 16Q106 16 114 40Q96 30 72 34Q50 40 44 64Z", a.hairC, 'opacity=".9"'),
  bob: (k, a) => k.clay(CAP, a.hairC),
  long: (k, a) => k.clay(CAP, a.hairC),
  bun: (k, a) => k.clay(CAP, a.hairC),
  buns: (k, a) => k.clay(CAP, a.hairC),
  curls: (k, a) =>
    [[40, 40, 14], [52, 24, 14], [70, 18, 14], [88, 20, 13], [104, 30, 12], [36, 60, 11], [112, 42, 9]]
      .map(([x, y, r]) => k.clay(`M${x} ${y - r}a${r} ${r} 0 1 0 .1 0Z`, a.hairC)).join(""),
  afro: (k, a) => k.clay("M40 52Q40 20 76 18Q104 20 112 40Q96 32 80 38Q60 44 50 60Z", a.hairC),
  mohawk: (k, a) =>
    k.clay("M44 34L50 6L60 26L68 2L76 24L86 4L92 26L102 14L104 34Q76 22 44 34Z", a.hairC) +
    k.path("M34 64Q32 40 46 30", "none", `stroke="${a.hairC}" stroke-width="5" opacity=".35"`),
};

const EYES = {
  dots: () => `<ellipse cx="98" cy="54" rx="5.5" ry="8" fill="${INK}"/><circle cx="100" cy="51" r="2" fill="#fff"/>`,
  happy: (k) => k.stroke("M91 56Q98 47 105 56", INK, 4),
  sleepy: (k) => k.stroke("M91 54Q98 60 105 54", INK, 4) + k.stroke("M91 54h14", INK, 2.5),
  sparkle: (k) =>
    `<ellipse cx="98" cy="54" rx="6.5" ry="9" fill="${INK}"/><circle cx="100" cy="50" r="2.6" fill="#fff"/>` +
    k.star(95, 58, 0.25, "#fff"),
};

const MOUTHS = {
  smile: (k) => k.stroke("M98 78Q106 84 112 76", "#5a1a22", 3.5),
  grin: (k) => k.path("M96 76Q106 90 114 74Z", "#5a1a22") + k.path("M99 77h13l-1 3H100Z", "#fff"),
  smirk: (k) => k.stroke("M100 80Q108 80 113 74", "#5a1a22", 3.5),
  tongue: (k) => k.path("M96 76Q106 88 114 74Z", "#5a1a22") + k.circle(106, 83, 4.5, "#ff6f8f"),
  oh: (k) => `<ellipse cx="107" cy="79" rx="4.5" ry="5.5" fill="#5a1a22"/>`,
};

const FACE_MARKS = {
  freckles: (k) => [[90, 68], [96, 64], [101, 69]].map(([x, y]) => k.circle(x, y, 1.6, "#a85a34", ".7")).join(""),
  stripes: (k, a) => k.stroke("M84 66h14", a.acC, 3.5) + k.stroke("M86 73h14", a.acC, 3.5),
  star: (k) => k.star(90, 72, 0.9, "#ffe36b"),
  bandaid: () =>
    `<g transform="rotate(-20 92 70)"><rect x="82" y="65" width="20" height="9" rx="4" fill="#f3c9a0" stroke="rgba(0,0,0,.2)"/><rect x="89" y="65" width="6" height="9" fill="#e8b184"/></g>`,
};

const GLASSES = {
  round: (k) => k.stroke("M98 45a10 10 0 1 0 .1 0Z", INK, 3) + k.stroke("M88 54H62", INK, 3),
  square: (k) => `<rect x="87" y="45" width="22" height="17" rx="4" fill="none" stroke="${INK}" stroke-width="3"/>` + k.stroke("M87 53H62", INK, 3),
  sun: (k) => k.path("M86 46H112Q112 64 98 64Q86 62 86 46Z", "#1c1a22") + k.path("M92 49h8", "none", 'stroke="#fff" stroke-width="2" opacity=".5"') + k.stroke("M86 50H62", "#1c1a22", 3),
  shutter: (k, a) =>
    `<rect x="86" y="45" width="26" height="18" rx="4" fill="none" stroke="${a.acC}" stroke-width="3"/>` +
    [50, 55, 60].map((y) => k.stroke(`M88 ${y}h22`, a.acC, 2.5)).join("") + k.stroke("M86 52H62", a.acC, 3),
  pixel: (k) => k.path("M86 46h26v8h-4v6h-8v-6h-4v6h-6v-6h-4Z", "#1c1a22") + k.path("M90 48h4v3h-4z", "#fff", 'opacity=".6"') + k.stroke("M86 49H62", "#1c1a22", 3),
  hearts: (k) => k.path("M99 64C86 56 84 46 92 44C96 44 98 47 99 49C100 47 102 44 106 44C114 46 112 56 99 64Z", "#ff4f8b") + k.stroke("M86 50H62", "#ff4f8b", 3),
};

const DOME = "M32 54Q30 10 76 10Q114 12 118 50Q76 38 32 54Z";

const HATS = {
  cap: (k, a) => k.clay(DOME, a.hatC) + k.clay("M110 42Q132 40 140 50Q128 54 112 52Z", shade(a.hatC, -0.12)),
  backcap: (k, a) => k.clay(DOME, a.hatC) + k.clay("M38 46Q16 44 6 54Q20 58 38 56Z", shade(a.hatC, -0.12)),
  beanie: (k, a) =>
    k.clay("M34 52Q30 4 76 4Q116 6 118 48Q76 34 34 52Z", a.hatC) +
    k.clay("M30 46Q76 28 120 44L120 56Q76 42 30 60Z", shade(a.hatC, -0.15)) + k.clay("M76 -10a9 9 0 1 0 .1 0Z", "#fff"),
  bucket: (k, a) =>
    k.clay("M38 46Q38 8 76 8Q112 10 112 46Z", a.hatC) + k.clay("M22 48Q76 34 128 48Q130 58 120 58Q76 46 30 60Q20 58 22 48Z", shade(a.hatC, -0.12)),
  bandana: (k, a) =>
    k.clay("M32 46Q76 22 116 36L118 46Q76 34 34 58Z", a.hatC) +
    k.clay("M34 48L18 44L22 60Z", a.hatC) + k.clay("M34 52L22 66L32 66Z", shade(a.hatC, -0.12)),
};

const EXTRAS_UNDER_HAT = {
  flower: (k) => [0, 72, 144, 216, 288].map((d) =>
    `<circle cx="${50 + 6 * Math.cos((d * Math.PI) / 180)}" cy="${30 + 6 * Math.sin((d * Math.PI) / 180)}" r="5" fill="#ff7ab0"/>`).join("") + k.circle(50, 30, 3.5, "#ffe36b"),
  bow: (k, a) => k.clay("M44 22L30 12L30 32Z", a.acC) + k.clay("M44 22L58 12L58 32Z", a.acC) + k.circle(44, 22, 4.5, shade(a.acC, -0.15)),
  stars: (k) => k.star(56, 28, 0.9, "#ffe36b") + k.star(70, 22, 0.7, "#ff7ab0"),
};

const EXTRAS_OVER_HAT = {
  cat: (k, a) => k.clay("M46 24L44 -6L68 14Z", a.hairC) + k.clay("M80 12L96 -10L102 22Z", a.hairC) + k.path("M84 12L94 -2L97 16Z", "#ff9fc0"),
};

const HEADPHONES = (k, a) =>
  k.stroke("M40 50Q42 6 80 6Q112 8 112 34", "#2a2b3d", 6) + k.clay("M48 52h22v24H48Z", a.acC) + k.circle(59, 64, 5, "#2a2b3d", ".5");

const TOP_BACK = {
  hoodie: (k, a) => k.clay("M44 96Q38 82 56 82Q68 84 70 96Z", shade(a.topC, -0.1)),
};

const TOP_FRONT = {
  hoodie: (k) => k.stroke("M84 100v16", "#fff", 2.5) + k.path("M54 128Q72 122 94 128L96 140H50Z", "#000", 'opacity=".12"'),
  stripes: (k, a) => [106, 118, 130].map((y) => `<rect x="40" y="${y}" width="70" height="6" fill="${a.acC}"/>`).join(""),
  band: (k, a) => k.star(80, 116, 1.4, a.acC),
  jersey: (k, a) =>
    `<rect x="40" y="96" width="60" height="8" fill="${a.acC}"/>` +
    `<text x="76" y="134" text-anchor="middle" font-size="22" font-weight="800" font-family="Arial Black,Arial,sans-serif" fill="${a.acC}">10</text>`,
  overalls: (k, a) => k.clay("M56 116H96V150H50Z", a.acC) + k.path("M84 98L90 116H82L78 98Z", a.acC) + k.circle(86, 118, 2.5, "#ffe36b"),
};

const BODY_ACCESSORIES = {
  chain: (k) => k.stroke("M70 98Q82 114 94 100", GOLD, 3),
  pearls: (k) => [[72, 102], [77, 107], [83, 109], [89, 106], [93, 101]].map(([x, y]) => k.circle(x, y, 2.6, "#fff")).join(""),
  scarf: (k, a) => k.clay("M54 96Q74 106 96 96L96 106Q74 114 54 106Z", a.acC) + k.clay("M56 104L46 128L58 126L62 106Z", shade(a.acC, -0.12)),
  cassette: (k) => `<rect x="76" y="110" width="18" height="12" rx="2" fill="#2a2b3d"/><circle cx="81" cy="116" r="2" fill="#fff"/><circle cx="89" cy="116" r="2" fill="#fff"/>` + k.stroke("M74 98L80 110M96 98L90 110", "#2a2b3d", 1.5),
  camera: (k) => k.stroke("M66 98L84 116", "#2a2b3d", 2) + `<rect x="78" y="112" width="20" height="15" rx="3" fill="#f4f4f6"/><circle cx="88" cy="120" r="4" fill="#2a2b3d"/><rect x="80" y="113" width="5" height="3" fill="#ff5a3c"/>`,
  bag: (k, a) => k.stroke("M88 98L54 136", "#2a2b3d", 3) + k.clay("M40 128h22v16H40Z", a.acC),
};
