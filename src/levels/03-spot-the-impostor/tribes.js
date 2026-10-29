import { randomAvatar } from "../../data/avatar-catalog.js";
import { chance, pick, shuffle } from "../../engine/random.js";

/**
 * The urban tribes of level 3: how each one dresses (options from the avatar
 * catalog), what they carry, and where they hang out (places.js draws it).
 * Fields a tribe doesn't list are left plain, so only the tribe's own style
 * shows and the impostor stands out by style, not by noise.
 */

const HAIR = { brown: "#3a2a22", black: "#1c1a22", blonde: "#f2d12e", ginger: "#c8602a", pink: "#f06aa8", lilac: "#8fa3d8", blue: "#3d6fe0", green: "#27c27a", white: "#eeeeee" };

/** @typedef {{ id: string, name: string, place: string, prop: string, look: Record<string, string[]> }} Tribe */
/** @typedef {{ avatar: Record<string, string>, prop: string, outfit: string, tribe: string }} Person */

/*
 * Each tribe has its own colours and pieces, and no two tribes share them,
 * so a tribe reads at a glance. On top of these choices, people.js draws
 * each tribe's own outfit (the `outfit` of a person), which the avatar
 * editor doesn't have: baggy trousers and knee pads, a studded jacket and
 * boots, a skirt and striped socks, a jumper over the shoulders, shorts and
 * sports socks, a neon jacket.
 */

/** @type {Tribe[]} */
export const TRIBES = [
  {
    // Earthy colours, beanies and backwards caps, long or curly hair, a skateboard.
    id: "skaters", name: "Skaters", place: "Skatepark", prop: "skateboard",
    look: {
      hair: ["long", "curls", "short"], hairC: [HAIR.brown, HAIR.ginger, HAIR.blonde], hat: ["beanie", "backcap"],
      hatC: ["#5f8f6a", "#e07b39", "#2f2a26"], top: ["hoodie", "stripes"], topC: ["#e07b39", "#5f8f6a", "#efe2c4"],
      acC: ["#f4f4f6", "#2f2a26"],
    },
  },
  {
    // Dark purple and navy with neon details, headphones and gaming glasses.
    id: "gamers", name: "Gamers", place: "Gaming café", prop: "controller",
    look: {
      hair: ["buzz", "short", "bob"], hairC: [HAIR.black, HAIR.brown, "#3a6fd8"], gl: ["square", "pixel"],
      acc: ["phones"], top: ["band", "tee"], topC: ["#2d2350", "#1f2a5a", "#3b2f6b"], acC: ["#5fd8ff", "#b6ff5f", "#ff5fa8"],
    },
  },
  {
    // Pastels, pastel hair in buns, cat ears or bows, a plushie.
    id: "otakus", name: "Otakus", place: "Anime shop", prop: "plushie",
    look: {
      hair: ["buns", "bun", "bob"], hairC: [HAIR.pink, HAIR.lilac, HAIR.white, "#8fd3ff"], pin: ["cat", "bow", "stars"],
      gl: ["round", "hearts", "none"], acc: ["bag"], top: ["overalls", "tee"], topC: ["#ffb3d1", "#c9b6f2", "#a8e6e0"],
      acC: ["#ff7ab0", "#a174ff"],
    },
  },
  {
    // Black and dark red, mohawks in loud colours, chains and hoops.
    id: "punks", name: "Punks", place: "Back-alley gig", prop: "fist",
    look: {
      hair: ["mohawk", "mohawk", "long"], hairC: [HAIR.green, "#e8203a", HAIR.black, "#c84ff0"], ear: ["hoops", "studs"],
      acc: ["chain"], top: ["band"], topC: ["#1c1a22", "#b3202e"], acC: ["#e8203a", "#f4f4f6"],
    },
  },
  {
    // White, butter and baby blue, neat hair, sunglasses, pearls or a scarf, a coffee.
    id: "posh", name: "Posh kids", place: "Café terrace", prop: "coffee",
    look: {
      hair: ["bob", "long", "bun"], hairC: [HAIR.blonde, "#b07a4a", "#e8c46a"], gl: ["sun"], acc: ["pearls", "scarf"],
      top: ["stripes", "tee"], topC: ["#f4f4f6", "#f7e1a8", "#cfe3ff"], acC: ["#1f2a5a", "#f4f4f6"],
    },
  },
  {
    // Bright team colours, jerseys, caps or bandanas, a ball.
    id: "sporty", name: "Sporty kids", place: "Sports court", prop: "ball",
    look: {
      hair: ["short", "buzz", "bun"], hairC: [HAIR.brown, HAIR.black, HAIR.blonde], hat: ["cap", "bandana"],
      hatC: ["#e8503a", "#3d6fe0", "#3f9e4a"], top: ["jersey"], topC: ["#e8503a", "#3d6fe0", "#3f9e4a", "#f2c12e"],
      acC: ["#f4f4f6", "#ffe36b"],
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
  return { avatar: { ...base, ...PLAIN, skin: chance(0.9) ? pick(SKINS) : base.skin, ...look }, prop: tribe.prop, outfit: tribe.id, tribe: tribe.id };
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
  // Half dressed like the group: they still wear their own tribe's outfit. Hardest: the group's outfit.
  return { avatar, prop, outfit: subtlety === 1 ? other.id : tribe.id, tribe: other.id };
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
