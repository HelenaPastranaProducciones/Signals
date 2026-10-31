import { createPaintKit } from "../../avatar/svg-kit.js";
import { pick, randomBetween, randomInt } from "../../engine/random.js";

/**
 * Level 5's drawings: the pictures in the feed (painted like the avatar) and
 * the pixel templates you fill in on the canvas.
 */

/** The 8 colours of the palette (painted, a little muted), by letter. */
export const PALETTE = {
  r: "#d9573f",
  p: "#e07aa6",
  o: "#e2a04a",
  y: "#e9c24a",
  g: "#6fbf8c",
  b: "#6f9fd8",
  k: "#2b2630",
  w: "#f1ece4",
};

/**
 * Pixel drawings to copy, 16 × 16 (Helena, 31/10/2026: more pixels, more fun
 * and harder drawings): one letter of PALETTE per pixel, "." for empty. Each
 * attempt picks one.
 */
export const TEMPLATES = [
  { name: "strawberry", rows: [
    "......gggg......",
    "....gggggggg....",
    "...rrggggggrr...",
    "..rrrrggggrrrr..",
    "..rryrrrrrryrr..",
    ".rrrrrrryrrrrrr.",
    ".rryrrrrrrrrryr.",
    ".rrrrryrrrrrrrr.",
    ".rrrrrrrrryrrrr.",
    "..ryrrrrrrrrrr..",
    "..rrrrryrrrryr..",
    "...rrrrrrrrrr...",
    "....rryrrrrr....",
    ".....rrrrrr.....",
    "......rrrr......",
    "................",
  ] },
  { name: "cat", rows: [
    "..o..........o..",
    "..oo........oo..",
    "..opoooooooopo..",
    ".oooooooooooooo.",
    ".oooooooooooooo.",
    ".ookkooooookkoo.",
    ".okkkooooookkko.",
    ".oooooooooooooo.",
    ".ooowwwppwwwooo.",
    ".oowwwwkkwwwwoo.",
    "..owwwkwwkwwwo..",
    "..oowwwwwwwwoo..",
    "...oooooooooo...",
    "....oooooooo....",
    "................",
    "................",
  ] },
  { name: "ice cream", rows: [
    ".......r........",
    ".......rr.......",
    ".....pppppp.....",
    "....pppwpppp....",
    "...pppppppppp...",
    "...pppppppppp...",
    "..bbbbbbbbbbbb..",
    "..bbwbbbbbbbbb..",
    "..bbbbbbbbbbbb..",
    "...oyoyoyoyoyo..",
    "...yoyoyoyoyo...",
    "....oyoyoyoy....",
    ".....yoyoyo.....",
    "......oyoy......",
    ".......yo.......",
    "................",
  ] },
  { name: "mushroom", rows: [
    ".....rrrrrr.....",
    "...rrrrwwrrrr...",
    "..rrrrrwwrrrrr..",
    ".rwwrrrrrrrrwwr.",
    ".rwwrrrrrrrrwwr.",
    "rrrrrrwwwrrrrrrr",
    "rrrrrrwwwrrrrrrr",
    ".rrrrrrrrrrrrrr.",
    "....wwwwwwww....",
    "....wwkwwkww....",
    "....wwwwwwww....",
    "....wwwppwww....",
    "....wwwwwwww....",
    "..g.wwwwwwww.g..",
    ".gggggggggggggg.",
    "................",
  ] },
  { name: "rocket", rows: [
    ".......rr.......",
    "......rrrr......",
    ".....rrrrrr.....",
    ".....wwwwww.....",
    ".....wwbbww.....",
    ".....wbbbbw.....",
    ".....wwbbww.....",
    ".....wwwwww.....",
    ".....wwwwww.....",
    "....rwwwwwwr....",
    "...rrwwwwwwrr...",
    "..rrrwwwwwwrrr..",
    "..rr..oyyo..rr..",
    "......oyyo......",
    ".......oo.......",
    "................",
  ] },
  { name: "frog", rows: [
    "................",
    "...www....www...",
    "..wwkww..wwkww..",
    "..gwwwg..gwwwg..",
    ".gggggggggggggg.",
    "gggggggggggggggg",
    "gpggggggggggggpg",
    "gggkggggggggkggg",
    "ggggkkkkkkkkgggg",
    ".gggggggggggggg.",
    "..gggggggggggg..",
    ".gg.gggggggg.gg.",
    "gggg........gggg",
    "................",
    "................",
    "................",
  ] },
];

let count = 0;

/** A painted picture for a post in the feed: a little scene, different every time. */
export function feedPicture() {
  const k = createPaintKit(`level-05-post-${++count}`, { grain: 2.2, wobble: 2 });
  const sky = pick(["#bcd6dd", "#f2c9a8", "#d9a3b0", "#b8d4dc", "#c9b6f2"]);
  const scenes = [
    // A sunset over hills.
    () => k.circle(randomInt(60, 140), 70, randomInt(18, 28), "#f6e3a6") +
      k.clay(`M0 150Q60 ${randomInt(90, 120)} 110 130T200 ${randomInt(100, 130)}V200H0Z`, "#7fa877") +
      k.clay("M0 170Q80 140 200 165V200H0Z", "#5f8f5c"),
    // A cat.
    () => k.clay("M70 150Q70 100 100 100Q130 100 130 150Z", pick(["#e2a04a", "#5c6270", "#f1ece4"])) +
      k.clay("M78 108L84 84L96 102ZM122 108L116 84L104 102Z", "#e2a04a") +
      k.circle(90, 122, 3, "#2b2630") + k.circle(110, 122, 3, "#2b2630"),
    // A bowl of food.
    () => k.clay("M50 120H150Q146 170 100 172Q54 170 50 120Z", pick(["#6f9fd8", "#d9576f", "#6fbf8c"])) +
      [70, 90, 110, 130].map((x) => k.circle(x, 116, 12, pick(["#e2a04a", "#d9573f", "#e9c24a", "#7fa877"]))).join(""),
    // A sneaker.
    () => k.clay("M40 140Q40 110 70 112L110 120Q160 126 164 150V160H40Z", pick(["#f1ece4", "#d9573f", "#6f9fd8"])) +
      k.clay("M36 156H168V170H36Z", "#f1ece4") + k.stroke("M80 118L86 130M94 120L100 132", "#2b2630", 3),
    // A coffee.
    () => k.clay("M76 96H124L118 168H82Z", "#f1ece4") + k.clay("M80 96H120V112H80Z", "#8a5a3c") + k.clay("M74 90H126V100H74Z", "#5c6270"),
  ];
  return `<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${k.defs()}<g filter="url(#${k.ids.paint})">` +
    `<rect width="200" height="200" fill="${sky}"/>${pick(scenes)()}</g></svg>`;
}

/** Captions for the posts in the feed. */
export const CAPTIONS = [
  "no thoughts just vibes", "day 3 of this", "who else??", "pov: sunday", "obsessed", "ok but why is this so good",
  "new fit", "lunch", "this view tho", "can't stop watching this", "rate it", "mood", "again and again", "real",
];

/** Friends' comments on your drawing when it's good, and when it isn't. */
export const PRAISE = ["did YOU make this??", "omg I love it", "teach me!!", "this is so cute", "frame it", "you should do more of these", "obsessed"];
export const SHRUGS = ["what is it supposed to be?", "…ok", "hmm", "is it finished?"];

/** A number of likes for a good drawing. */
export const likesFor = (accuracy) => Math.round(randomBetween(18, 30) + accuracy * 40);
