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
