import { TOTAL_LEVELS } from "./levels/index.js";
import { state } from "./state.js";
import { bindEvents } from "./ui/actions.js";
import { levelSession } from "./ui/level-session.js";
import { goTo } from "./ui/navigation.js";
import { addRenderHook, render } from "./ui/render.js";

addRenderHook(levelSession);
bindEvents();

// Test mode, for trying levels while building them:
//   ?level=7  opens level 7 straight away (no title, no loading screens)
//   ?test     starts normally, with every level open on the map
const params = new URLSearchParams(location.search);
const testLevel = Number(params.get("level"));
if (params.has("test") || params.has("level")) state.ui.testMode = true;
if (Number.isInteger(testLevel) && testLevel >= 1 && testLevel <= TOTAL_LEVELS) goTo("level", testLevel);

// ?fonts=demo shows the typography Helena is trying out (src/styles/fonts-demo.css).
if (params.get("fonts") === "demo") {
  for (const href of [
    "https://fonts.googleapis.com/css2?family=Doto:ROND,wght@0..100,100..900&family=Hanken+Grotesk:wght@300..700&display=swap",
    new URL("./styles/fonts-demo.css", import.meta.url).href,
  ]) document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="${href}">`);
}

render();
