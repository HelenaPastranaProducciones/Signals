/**
 * Everything the player can pick for their avatar, grouped in categories.
 * Pieces with `unlockLevel` 0 are available from the start; the rest unlock
 * when that level is completed. How each piece is drawn lives in
 * src/avatar/render-avatar.js.
 *
 * @typedef {object} AvatarOption
 * @property {string} id           Value stored in the avatar (hex colour for colour categories).
 * @property {string} label        Name shown in the editor.
 * @property {number} unlockLevel  Level that unlocks it (0 = always available).
 * @property {string} [swatch]     Colour shown in the editor for colour categories.
 *
 * @typedef {object} AvatarCategory
 * @property {string} key    Property of the avatar object it controls.
 * @property {string} label  Tab label in the editor.
 * @property {AvatarOption[]} options
 */

/** Colour options: the hex value is both the id and the swatch. */
const colours = (list, unlocks = {}) =>
  list.map(([label, hex]) => ({ id: hex, label, unlockLevel: unlocks[label] ?? 0, swatch: hex }));

/** Style options drawn by the avatar renderer. */
const styles = (list) => list.map(([id, label, unlockLevel = 0]) => ({ id, label, unlockLevel }));

/** @type {AvatarCategory[]} */
export const AVATAR_CATEGORIES = [
  {
    key: "skin",
    label: "Skin",
    options: colours(
      [["Peach", "#f6c7a0"], ["Light", "#f0b48a"], ["Tan", "#d49565"], ["Brown", "#9a6240"], ["Deep", "#5e3a2a"],
        ["Lime", "#c9f23a"], ["Blue", "#4a5cf5"], ["Pink", "#ff6fa5"], ["Lilac", "#a98bff"]],
      { Lime: 5, Blue: 5, Pink: 5, Lilac: 5 },
    ),
  },
  {
    key: "eyes",
    label: "Eyes",
    options: styles([["dots", "Classic"], ["happy", "Happy"], ["sleepy", "Sleepy"], ["sparkle", "Sparkle"]]),
  },
  {
    key: "mouth",
    label: "Mouth",
    options: styles([["smile", "Smile"], ["grin", "Grin"], ["smirk", "Smirk"], ["tongue", "Tongue"], ["oh", "Oh!"]]),
  },
  {
    key: "face",
    label: "Face",
    options: styles([["none", "None"], ["freckles", "Freckles"], ["blush", "Blush"], ["stripes", "Stripes"],
      ["star", "Star sticker", 6], ["bandaid", "Band-aid", 11]]),
  },
  {
    key: "ear",
    label: "Earrings",
    options: styles([["none", "None"], ["hoops", "Hoops"], ["studs", "Studs"], ["gems", "Gems", 13]]),
  },
  {
    key: "hair",
    label: "Hair",
    options: styles([["none", "None"], ["short", "Short"], ["buzz", "Buzz"], ["bob", "Bob"], ["long", "Long"],
      ["bun", "Bun"], ["curls", "Curls"], ["afro", "Afro", 2], ["mohawk", "Mohawk", 3], ["buns", "Space buns", 7]]),
  },
  {
    key: "hairC",
    label: "Hair colour",
    options: colours(
      [["Brown", "#3a2a22"], ["Black", "#1c1a22"], ["Blonde", "#f2d12e"], ["Ginger", "#c8602a"], ["Pink", "#f06aa8"],
        ["Lilac", "#8fa3d8"], ["Blue", "#3d6fe0"], ["White", "#eeeeee"], ["Green", "#27c27a"]],
      { Blue: 11, Green: 18 },
    ),
  },
  {
    key: "hat",
    label: "Hat",
    options: styles([["none", "None"], ["cap", "Cap"], ["backcap", "Backwards cap"], ["bandana", "Bandana"],
      ["beanie", "Beanie", 3], ["bucket", "Bucket hat", 10]]),
  },
  {
    key: "hatC",
    label: "Hat colour",
    options: colours([["Red", "#e8503a"], ["Blue", "#3d6fe0"], ["Yellow", "#f2c12e"], ["Black", "#2a2b3d"],
      ["White", "#f4f4f6"], ["Green", "#3f9e4a"], ["Pink", "#ff7ab0"], ["Orange", "#ff8a3c"]]),
  },
  {
    key: "gl",
    label: "Glasses",
    options: styles([["none", "None"], ["round", "Round"], ["square", "Square"], ["sun", "Shades"],
      ["shutter", "Shutter", 8], ["pixel", "Pixel", 12], ["hearts", "Hearts", 16]]),
  },
  {
    key: "pin",
    label: "Head extra",
    options: styles([["none", "None"], ["flower", "Flower clip"], ["bow", "Bow"], ["stars", "Star clips", 9],
      ["cat", "Cat ears", 14]]),
  },
  {
    key: "acc",
    label: "Neck & body",
    options: styles([["none", "None"], ["chain", "Gold chain"], ["pearls", "Pearls"], ["scarf", "Scarf"],
      ["phones", "Headphones", 1], ["cassette", "Cassette", 4], ["camera", "Polaroid", 15], ["bag", "Crossbody bag", 17]]),
  },
  {
    key: "top",
    label: "Top",
    options: styles([["tee", "T-shirt"], ["hoodie", "Hoodie"], ["stripes", "Striped"], ["band", "Band tee", 2],
      ["jersey", "Jersey", 6], ["overalls", "Overalls", 10]]),
  },
  {
    key: "topC",
    label: "Top colour",
    options: colours([["Green", "#3f9e4a"], ["Red", "#e8503a"], ["Blue", "#3d6fe0"], ["Yellow", "#f2c12e"],
      ["Black", "#2a2b3d"], ["White", "#f4f4f6"], ["Pink", "#ff7ab0"], ["Orange", "#ff8a3c"], ["Purple", "#8a5cf5"],
      ["Teal", "#2fc4b2"], ["Navy", "#1f2a5a"], ["Lime", "#c9f23a"]]),
  },
  {
    key: "acC",
    label: "Accent colour",
    options: colours([["Yellow", "#ffe36b"], ["White", "#ffffff"], ["Red", "#e8503a"], ["Blue", "#3d6fe0"],
      ["Pink", "#ff7ab0"], ["Black", "#2a2b3d"], ["Mint", "#7fe3c0"], ["Orange", "#ff8a3c"]]),
  },
  {
    key: "bg",
    label: "Backdrop",
    options: colours(
      [["Ice", "#dfe6ee"], ["Rose", "#f3e3ea"], ["Mint", "#e4efe2"], ["Sky", "#d6e6ff"], ["Peach", "#ffdcc8"],
        ["Room", "#cdbdf2"], ["Aquarium", "#bfe6e6"], ["Tokyo", "#f6c9d8"], ["Paper", "#efe3c6"], ["Finale", "#ffe36b"]],
      { Room: 9, Aquarium: 11, Tokyo: 13, Paper: 15, Finale: 19 },
    ),
  },
];

/** Avatar a new player starts with. Every piece must have unlockLevel 0. */
export const DEFAULT_AVATAR = Object.freeze({
  skin: "#f0b48a",
  eyes: "dots",
  mouth: "smile",
  face: "none",
  ear: "none",
  hair: "short",
  hairC: "#3a2a22",
  hat: "backcap",
  hatC: "#e8503a",
  gl: "round",
  pin: "none",
  acc: "none",
  top: "hoodie",
  topC: "#3d6fe0",
  acC: "#ffe36b",
  bg: "#dfe6ee",
});

/** @param {string} key */
export const getCategory = (key) => AVATAR_CATEGORIES.find((category) => category.key === key);

/** @param {string} key  @param {string} id */
export const findOption = (key, id) => getCategory(key)?.options.find((option) => option.id === id);

/**
 * Pieces unlocked by completing a level, e.g. ["neck & body: headphones"].
 * @param {number} level
 */
export function unlocksForLevel(level) {
  return AVATAR_CATEGORIES.flatMap((category) =>
    category.options
      .filter((option) => option.unlockLevel === level)
      .map((option) => `${category.label.toLowerCase()}: ${option.label}`),
  );
}
