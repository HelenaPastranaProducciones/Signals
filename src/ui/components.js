import { renderAvatar } from "../avatar/render-avatar.js";
import { TOTAL_LEVELS } from "../levels/index.js";

/**
 * Markup pieces shared by several screens. Buttons declare what they do with
 * `data-action` (plus `data-key`, `data-value` or `data-level`); the handlers
 * live in src/ui/actions.js.
 */

/** The avatar on its backdrop colour. */
export const avatarStage = (avatar) => `<div class="avatar-stage" style="background:${avatar.bg}">${renderAvatar(avatar)}</div>`;

/** Bar that fills up during the fake loading screens (animated by navigation.js). */
export const loader = () => `<div class="loader"><i></i></div>`;

export const progressBar = (completed) =>
  `<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${TOTAL_LEVELS}" aria-valuenow="${completed}"><i style="width:${(completed / TOTAL_LEVELS) * 100}%"></i></div>`;

/** Screen title with an optional button on the right. */
export const screenHeader = (title, aside = "") => `<div class="screen-header"><h2>${title}</h2>${aside}</div>`;

/** Secondary button that takes the player one step back. */
export const backButton = (label, action, attrs = "") =>
  `<button class="btn btn-secondary" data-action="${action}" ${attrs}>← ${label}</button>`;

/*
 * Small hand-drawn icons (Helena, 31/10/2026: no emojis anywhere in the game).
 * Ink lines in the current text colour, so they work in both themes.
 */
const icon = (body, label = "") =>
  `<svg class="icon" viewBox="0 0 24 24" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const ICONS = {
  house: icon('<path d="M3.5 11.5L12 4l8.5 7.5"/><path d="M6 10v9.5h4.5v-5h3v5H18V10"/>'),
  map: icon('<path d="M3 6.5l5.5-2.5 7 2.5 5.5-2.5v13.5L15.5 20l-7-2.5L3 20Z"/><path d="M8.5 4v13.5M15.5 6.5V20"/>'),
  lock: icon('<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>', "Locked"),
  person: icon('<circle cx="12" cy="7.5" r="3.6"/><path d="M4.5 20.5c.8-4.4 3.8-6.5 7.5-6.5s6.7 2.1 7.5 6.5"/>'),
  gear: icon('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M5.5 18.5l2.1-2.1M16.4 7.6l2.1-2.1"/>'),
  play: icon('<path d="M8 5.5v13l10.5-6.5Z"/>'),
  dice: icon('<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r=".8" fill="currentColor"/><circle cx="15" cy="15" r=".8" fill="currentColor"/><circle cx="15" cy="9" r=".8" fill="currentColor"/><circle cx="9" cy="15" r=".8" fill="currentColor"/>'),
};
