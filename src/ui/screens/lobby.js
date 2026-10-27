import { TOTAL_LEVELS } from "../../levels/index.js";
import { NICKNAME_MAX_LENGTH } from "../../config.js";
import { avatarStage, backButton, progressBar, screenHeader } from "../components.js";
import { escapeHtml } from "../html.js";
import { avatarEditorScreen } from "./avatar-editor.js";
import { optionsScreen } from "./options.js";

/** Lobby home: big avatar, editable nickname, progress and the two sub-screens. */
function lobbyHome({ progress }) {
  return screenHeader("Lobby", backButton("Back to map", "toggle-lobby")) +
    `<div class="lobby-layout">
      <div>${avatarStage(progress.avatar)}</div>
      <div>
        <input class="nickname-input" id="nickname" value="${escapeHtml(progress.nickname)}" maxlength="${NICKNAME_MAX_LENGTH}" aria-label="Nickname">
        <p class="muted nickname-hint">Click your name to change it</p>
        <b>${progress.completed} / ${TOTAL_LEVELS} signals completed</b>${progressBar(progress.completed)}
        <div class="lobby-menu">
          <button class="btn" data-action="lobby-view" data-key="avatar">🧑 Customize avatar</button>
          <button class="btn btn-secondary" data-action="lobby-view" data-key="options">⚙️ Options</button>
        </div>
      </div>
    </div>`;
}

/** The lobby opens over the map; each sub-screen has a "← Lobby" button and Esc goes back one step. */
export function lobbyScreen(state) {
  if (state.ui.lobbyView === "avatar") return avatarEditorScreen(state);
  if (state.ui.lobbyView === "options") return optionsScreen(state);
  return lobbyHome(state);
}
