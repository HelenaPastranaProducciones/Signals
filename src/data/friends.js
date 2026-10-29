import { randomAvatar } from "./avatar-catalog.js";
import { shuffle } from "../engine/random.js";

/**
 * Fictional friends who appear in the levels (the group chat, the band, the
 * finish line…). Every attempt picks a few of them at random and gives each a
 * random look, so no two runs have the same group.
 */
export const FRIEND_POOL = [
  { name: "Mia", colour: "#ff5f9e" },
  { name: "Leo", colour: "#3f8fff" },
  { name: "Nora", colour: "#3cb371" },
  { name: "Kai", colour: "#ff9a1f" },
  { name: "Zoe", colour: "#a26bff" },
  { name: "Sam", colour: "#18b6c9" },
  { name: "Lua", colour: "#e8503a" },
  { name: "Max", colour: "#5b6cff" },
  { name: "Ivy", colour: "#2fae6b" },
  { name: "Noa", colour: "#ff7a45" },
  { name: "Eli", colour: "#d14fb8" },
  { name: "Rui", colour: "#c99a00" },
];

/**
 * `count` different friends, in random order, each with a random avatar.
 * @param {number} count
 * @returns {{ name: string, colour: string, avatar: Record<string, string> }[]}
 */
export const randomFriends = (count) => shuffle(FRIEND_POOL).slice(0, count).map((friend) => ({ ...friend, avatar: randomAvatar() }));
