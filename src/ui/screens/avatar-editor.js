import { renderAvatar } from "../../avatar/render-avatar.js";
import { getCategory } from "../../data/avatar-catalog.js";
import { isUnlocked } from "../../game/progress.js";
import { avatarStage, backButton, screenHeader } from "../components.js";

/**
 * Avatar editor groups: each tab shows its categories together, styles as
 * thumbnails of the player's own avatar wearing that piece, colours as
 * swatches. `crop` frames the thumbnails ("head", "bust" or "full");
 * `preview` changes other pieces in the thumbnails only (no hat over the hair).
 */
export const EDITOR_GROUPS = [
  { id: "face", label: "Face", keys: ["skin", "eyes", "mouth", "face"], crop: "head" },
  { id: "hair", label: "Hair", keys: ["hair", "hairC"], crop: "head", preview: { hat: "none" } },
  { id: "hat", label: "Hats", keys: ["hat", "hatC"], crop: "head" },
  { id: "extras", label: "Glasses & extras", keys: ["gl", "pin", "ear"], crop: "head" },
  { id: "clothes", label: "Clothes", keys: ["top", "topC", "acc", "acC"], crop: "bust" },
  { id: "backdrop", label: "Background", keys: ["bg"], crop: "full" },
];

/** The group to show: by id, or the group holding a category key (older saved state). */
export const findGroup = (id) =>
  EDITOR_GROUPS.find((group) => group.id === id) ||
  EDITOR_GROUPS.find((group) => group.keys.includes(id)) ||
  EDITOR_GROUPS[0];

function groupTab(group, selected) {
  return `<button class="${selected ? "is-active" : ""}" data-action="avatar-category" data-key="${group.id}" aria-pressed="${selected}">${group.label}</button>`;
}

function lockAttributes(option, unlocked) {
  return unlocked ? "" : ` aria-label="${option.label}, unlocks at level ${option.unlockLevel}" aria-disabled="true"`;
}

/** A style option, shown as the player's avatar wearing it. */
function styleOption(category, option, progress, { crop, preview }) {
  const unlocked = isUnlocked(progress, option.unlockLevel);
  const selected = progress.avatar[category.key] === option.id;
  const preview = renderAvatar({ ...progress.avatar, ...preview, [category.key]: option.id }, { label: option.label, backdrop: false, crop });
  return `<button class="option option-thumb${selected ? " is-selected" : ""}${unlocked ? "" : " is-locked"}" data-action="avatar-part"
    data-key="${category.key}" data-value="${option.id}" aria-pressed="${selected}" title="${option.label}"${lockAttributes(option, unlocked)}>
    <span class="option-preview option-preview-${crop}">${preview}</span>
    <span class="option-label">${unlocked ? option.label : `🔒 Level ${option.unlockLevel}`}</span></button>`;
}

/** A colour option, shown as a round swatch. */
function colourOption(category, option, progress) {
  const unlocked = isUnlocked(progress, option.unlockLevel);
  const selected = progress.avatar[category.key] === option.id;
  return `<button class="swatch-option${selected ? " is-selected" : ""}${unlocked ? "" : " is-locked"}" data-action="avatar-part"
    data-key="${category.key}" data-value="${option.id}" aria-pressed="${selected}" title="${unlocked ? option.label : `${option.label} · level ${option.unlockLevel}`}"${lockAttributes(option, unlocked)}>
    <span class="swatch" style="background:${option.swatch}"></span>${unlocked ? "" : `<span class="swatch-lock">🔒</span>`}</button>`;
}

function categorySection(key, progress, group) {
  const category = getCategory(key);
  const colours = category.options.every((option) => option.swatch);
  const options = category.options
    .map((option) => (colours ? colourOption(category, option, progress) : styleOption(category, option, progress, group)))
    .join("");
  return `<section class="editor-section">
      <h3>${category.label}</h3>
      <div class="${colours ? "swatch-grid" : "option-grid"}">${options}</div>
    </section>`;
}

/** @param {import("../../state.js").state} state */
export function avatarEditorScreen({ progress, ui }) {
  const group = findGroup(ui.avatarCategory);
  return screenHeader("Customize avatar", backButton("Lobby", "lobby-view", 'data-key="main"')) +
    `<div class="editor-layout">
      <div class="editor-preview">
        ${avatarStage(progress.avatar)}
        <div class="button-row button-row-tight"><button class="btn btn-secondary" data-action="randomize-avatar">🎲 Random</button></div>
      </div>
      <div>
        <div class="chips" role="group" aria-label="Category">${EDITOR_GROUPS.map((g) => groupTab(g, g === group)).join("")}</div>
        ${group.keys.map((key) => categorySection(key, progress, group)).join("")}
      </div>
    </div>`;
}
