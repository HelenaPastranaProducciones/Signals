import { AVATAR_CATEGORIES, DEFAULT_AVATAR, findOption, getCategory } from "../data/avatar-catalog.js";
import { TOTAL_LEVELS } from "../data/levels.js";
import { DEFAULT_NICKNAME, NICKNAME_MAX_LENGTH } from "../config.js";

/**
 * What the player has earned and chosen. This is the part of the state that
 * should be saved between sessions (not implemented yet); UI state lives in
 * src/ui/ui-state.js.
 *
 * Levels unlock in order, so `completed` is both how many signals are done
 * and the highest level completed.
 *
 * @typedef {object} Progress
 * @property {number} completed
 * @property {string} nickname
 * @property {Record<string, string>} avatar
 * @property {{ sound: boolean, vibration: boolean, theme: "system" | "light" | "dark" }} settings
 */

/** @returns {Progress} */
export function createProgress() {
  return {
    completed: 0,
    nickname: DEFAULT_NICKNAME,
    avatar: { ...DEFAULT_AVATAR },
    settings: { sound: true, vibration: true, theme: "system" },
  };
}

/** Whether a piece with this unlock level can be used. */
export const isUnlocked = (progress, unlockLevel) => unlockLevel <= progress.completed;

/** Whether a level can be opened from the map. */
export const isLevelAvailable = (progress, level) => level <= progress.completed + 1;

export function completeLevel(progress, level) {
  progress.completed = Math.min(TOTAL_LEVELS, Math.max(progress.completed, level));
}

/** Selects an avatar piece if it exists and is unlocked. Returns whether it changed. */
export function setAvatarPart(progress, key, id) {
  const option = findOption(key, id);
  if (!option || !isUnlocked(progress, option.unlockLevel)) return false;
  progress.avatar[key] = id;
  return true;
}

/** Picks a random unlocked piece in every category. */
export function randomizeAvatar(progress, random = Math.random) {
  for (const category of AVATAR_CATEGORIES) {
    const available = category.options.filter((option) => isUnlocked(progress, option.unlockLevel));
    progress.avatar[category.key] = available[Math.floor(random() * available.length)].id;
  }
}

/** Clears completed levels and swaps any piece that is now locked for its category's first option. */
export function resetProgress(progress) {
  progress.completed = 0;
  for (const [key, id] of Object.entries(progress.avatar)) {
    const option = findOption(key, id);
    if (option && !isUnlocked(progress, option.unlockLevel)) progress.avatar[key] = getCategory(key).options[0].id;
  }
}

export function setNickname(progress, value) {
  progress.nickname = value.slice(0, NICKNAME_MAX_LENGTH);
}

/** Falls back to the default nickname if the player left it blank. */
export function normalizeNickname(progress) {
  progress.nickname = progress.nickname.trim() || DEFAULT_NICKNAME;
}
