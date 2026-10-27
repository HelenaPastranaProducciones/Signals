import { backButton, screenHeader } from "../components.js";

const settingRow = (label, button) => `<div class="setting-row">${label}${button}</div>`;

const toggle = (action, on) =>
  `<button class="btn btn-secondary" data-action="${action}" aria-pressed="${on}">${on ? "On" : "Off"}</button>`;

/**
 * Sound and vibration are stored but nothing plays or vibrates yet.
 * @param {import("../../state.js").state} state
 */
export function optionsScreen({ progress, ui }) {
  const { sound, vibration } = progress.settings;
  return screenHeader("Options", backButton("Lobby", "lobby-view", 'data-key="main"')) +
    `<div class="card settings">
      ${settingRow("Sound and music", toggle("toggle-sound", sound))}
      ${settingRow("Vibration (mobile)", toggle("toggle-vibration", vibration))}
      ${settingRow("Fullscreen", `<button class="btn btn-secondary" data-action="toggle-fullscreen">Toggle</button>`)}
      ${settingRow("Theme", `<button class="btn btn-secondary" data-action="toggle-theme">Switch</button>`)}
      ${settingRow("Progress", `<button class="btn btn-secondary${ui.confirmingReset ? " is-danger" : ""}" data-action="reset-progress">${ui.confirmingReset ? "Click again to reset" : "Reset"}</button>`)}
    </div>`;
}
