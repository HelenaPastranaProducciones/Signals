import { randomAvatar } from "../../data/avatar-catalog.js";
import { chance, pick, shuffle } from "../../engine/random.js";

/**
 * The urban tribes of level 3: how each one dresses (options from the avatar
 * catalog), what they carry, and where they hang out (places.js draws it).
 * Fields a tribe doesn't list are left plain, so only the tribe's own style
 * shows and the impostor stands out by style, not by noise.
 */

const C = {
  black: "#2a2b3d", white: "#f4f4f6", navy: "#1f2a5a", red: "#e8503a", blue: "#3d6fe0", yellow: "#f2c12e",
  green: "#3f9e4a", pink: "#ff7ab0", orange: "#ff8a3c", purple: "#8a5cf5", teal: "#2fc4b2", lime: "#c9f23a",
};
const HAIR = { brown: "#3a2a22", black: "#1c1a22", blonde: "#f2d12e", ginger: "#c8602a", pink: "#f06aa8", lilac: "#8fa3d8", blue: "#3d6fe0", green: "#27c27a", white: "#eeeeee" };
const ACCENT = { yellow: "#ffe36b", white: "#ffffff", red: "#e8503a", blue: "#3d6fe0", pink: "#ff7ab0", black: "#2a2b3d", mint: "#7fe3c0", orange: "#ff8a3c" };
const NATURAL_HAIR = [HAIR.brown, HAIR.black, HAIR.blonde, HAIR.ginger];

/** @typedef {{ id: string, name: string, place: string, prop: string, look: Record<string, string[]> }} Tribe */

/** @type {Tribe[]} */
export const TRIBES = [
  {
    id: "skaters", name: "Skaters", place: "Skatepark", prop: "skateboard",
    look: {
      hair: ["short", "long", "buzz", "curls"], hairC: NATURAL_HAIR, hat: ["beanie", "backcap", "beanie", "none"],
      hatC: [C.black, C.orange, C.red, C.teal], gl: ["none", "none", "sun"], acc: ["none", "chain"],
      top: ["hoodie", "tee", "stripes"], topC: [C.black, C.orange, C.teal, C.white, C.navy], acC: [ACCENT.yellow, ACCENT.white, ACCENT.orange],
    },
  },
  {
    id: "gamers", name: "Gamers", place: "Gaming café", prop: "controller",
    look: {
      hair: ["short", "buzz", "bob", "curls"], hairC: NATURAL_HAIR, hat: ["none", "none", "cap"], hatC: [C.black, C.purple],
      gl: ["square", "pixel", "round"], acc: ["phones"], top: ["hoodie", "band"],
      topC: [C.purple, C.black, C.navy, C.lime], acC: [ACCENT.mint, ACCENT.blue, ACCENT.pink],
    },
  },
  {
    id: "otakus", name: "Otakus", place: "Anime shop", prop: "plushie",
    look: {
      hair: ["buns", "bob", "long", "bun"], hairC: [HAIR.pink, HAIR.lilac, HAIR.blue, HAIR.black, HAIR.white],
      hat: ["none"], pin: ["cat", "bow", "stars"], gl: ["none", "round", "hearts"], acc: ["none", "bag"],
      top: ["band", "tee", "overalls"], topC: [C.pink, C.white, C.purple, C.teal], acC: [ACCENT.pink, ACCENT.white, ACCENT.mint],
    },
  },
  {
    id: "punks", name: "Punks", place: "Back-alley gig", prop: "fist",
    look: {
      hair: ["mohawk", "mohawk", "short", "long"], hairC: [HAIR.black, HAIR.pink, HAIR.green, HAIR.blue],
      hat: ["none"], gl: ["none", "sun"], ear: ["hoops", "studs"], acc: ["chain"],
      top: ["band", "tee"], topC: [C.black, C.black, C.red], acC: [ACCENT.red, ACCENT.white],
    },
  },
  {
    id: "posh", name: "Posh kids", place: "Café terrace", prop: "coffee",
    look: {
      hair: ["bob", "long", "bun", "short"], hairC: [HAIR.blonde, HAIR.brown, HAIR.black], hat: ["none"],
      gl: ["sun", "none"], ear: ["studs", "none"], acc: ["pearls", "scarf"],
      top: ["stripes", "tee"], topC: [C.white, C.navy, C.pink, C.yellow], acC: [ACCENT.white, ACCENT.blue],
    },
  },
  {
    id: "sporty", name: "Sporty kids", place: "Sports court", prop: "ball",
    look: {
      hair: ["short", "buzz", "bun", "curls"], hairC: NATURAL_HAIR, hat: ["cap", "bandana", "none"],
      hatC: [C.red, C.blue, C.white], gl: ["none"], acc: ["none"],
      top: ["jersey"], topC: [C.red, C.blue, C.yellow, C.green], acC: [ACCENT.white, ACCENT.yellow],
    },
  },
];

/** Fields that are left plain unless a tribe lists them. */
const PLAIN = { hat: "none", gl: "none", pin: "none", acc: "none", ear: "none", face: "none" };
const SKINS = ["#f6c7a0", "#f0b48a", "#d49565", "#9a6240", "#5e3a2a"];

/**
 * One member of a tribe: their own face and skin, dressed in the tribe's style.
 * @param {Tribe} tribe
 */
export function member(tribe) {
  const base = randomAvatar();
  const look = Object.fromEntries(Object.entries(tribe.look).map(([key, options]) => [key, pick(options)]));
  return { avatar: { ...base, ...PLAIN, skin: chance(0.9) ? pick(SKINS) : base.skin, ...look }, prop: tribe.prop, tribe: tribe.id };
}

/**
 * Someone who doesn't belong to `tribe`. `subtlety` 0 is someone from
 * another tribe altogether; higher values dress them more and more like the
 * group, until only one thing gives them away (their prop or one piece).
 *
 * @param {Tribe} tribe
 * @param {number} subtlety  0 (obvious) to 2 (hard).
 */
export function impostor(tribe, subtlety) {
  const other = pick(TRIBES.filter((t) => t.id !== tribe.id));
  const outsider = member(other);
  if (subtlety === 0) return outsider;
  const insider = member(tribe);
  // Pieces that give them away, taken from the other tribe.
  const giveaways = subtlety === 1 ? ["hair", "hat", "top", "topC", "pin", "acc"] : shuffle(["top", "acc", "hat", "pin"]).slice(0, 1);
  const avatar = { ...insider.avatar };
  for (const key of giveaways) avatar[key] = outsider.avatar[key];
  // At the hardest, half the time it's only the prop that's wrong.
  let prop = subtlety === 1 || chance(0.5) ? other.prop : tribe.prop;
  // If the borrowed piece happens to look the same, the prop gives them away instead.
  if (prop === tribe.prop && giveaways.every((key) => avatar[key] === insider.avatar[key])) prop = other.prop;
  return { avatar, prop, tribe: other.id };
}

/**
 * The tribes that suit the player best, by how many of their style choices
 * match each tribe's look. Used in the last round to offer "your people".
 *
 * @param {Record<string, string>} avatar
 * @returns {Tribe[]} Best match first.
 */
export function tribesFor(avatar) {
  const score = (tribe) => Object.entries(tribe.look).filter(([key, options]) => options.includes(avatar[key])).length;
  return shuffle(TRIBES).sort((a, b) => score(b) - score(a));
}
