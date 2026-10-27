/** Thin wrappers around browser features used by the options screen. */

export const systemPrefersDark = () => matchMedia("(prefers-color-scheme: dark)").matches;

/** "system" follows the OS; "light"/"dark" force a theme (see the tokens in styles/tokens.css). */
export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "system") delete root.dataset.theme;
  else root.dataset.theme = theme;
}

/** The Switch button flips whatever is currently on screen. */
export function nextTheme(theme, systemDark = systemPrefersDark()) {
  const dark = theme === "dark" || (theme === "system" && systemDark);
  return dark ? "light" : "dark";
}

/** Fullscreen can be refused (iOS Safari, embedded iframes); there is nothing to do then. */
export function toggleFullscreen() {
  const request = document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen?.();
  request?.catch(() => {});
}
