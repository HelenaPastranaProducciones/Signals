import { AVATAR_CATEGORIES, getCategory } from "../../data/avatar-catalog.js";
import { isUnlocked } from "../../game/progress.js";
import { avatarStage, backButton, screenHeader } from "../components.js";

function categoryTab(category, selectedKey) {
  const selected = category.key === selectedKey;
  return `<button class="${selected ? "is-active" : ""}" data-action="avatar-category" data-key="${category.key}" aria-pressed="${selected}">${category.label}</button>`;
}

function optionButton(category, option, progress) {
  const unlocked = isUnlocked(progress, option.unlockLevel);
  const selected = progress.avatar[category.key] === option.id;
  const swatch = option.swatch ? `<span class="swatch" style="background:${option.swatch}"></span>` : "";
  const lockedLabel = unlocked ? "" : ` aria-label="${option.label}, unlocks at level ${option.unlockLevel}" aria-disabled="true"`;
  return `<button class="option${selected ? " is-selected" : ""}${unlocked ? "" : " is-locked"}" data-action="avatar-part"
    data-key="${category.key}" data-value="${option.id}" aria-pressed="${selected}"${lockedLabel}>
    ${swatch}${unlocked ? option.label : `🔒 Lv ${option.unlockLevel}`}</button>`;
}

/** @param {import("../../state.js").state} state */
export function avatarEditorScreen({ progress, ui }) {
  const category = getCategory(ui.avatarCategory);
  return screenHeader("Customize avatar", backButton("Lobby", "lobby-view", 'data-key="main"')) +
    `<div class="editor-layout">
      <div>${avatarStage(progress.avatar)}</div>
      <div>
        <div class="chips" role="group" aria-label="Category">${AVATAR_CATEGORIES.map((c) => categoryTab(c, ui.avatarCategory)).join("")}</div>
        <div class="option-grid">${category.options.map((option) => optionButton(category, option, progress)).join("")}</div>
        <div class="button-row button-row-tight"><button class="btn btn-secondary" data-action="randomize-avatar">🎲 Random</button></div>
      </div>
    </div>`;
}
