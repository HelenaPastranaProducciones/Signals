/**
 * Phones and tablets (Helena, 01/11/2026: the mobile version). On a touch
 * screen the page gets the class `touch`, so styles can show touch controls
 * and hide keyboard hints (`.keys-only` / `.touch-only` in base.css), and the
 * texts inside a level say "tap" where they say "click".
 */

/** True on a phone or tablet (a finger, not a mouse). */
export const isTouch = () => typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;

/** Marks the page as touch or not; call once at start. */
export function markTouch() {
  document.documentElement.classList.toggle("touch", isTouch());
}

const WORDS = [
  [/\bClick\b/g, "Tap"],
  [/\bclick\b/g, "tap"],
  [/\bclicks\b/g, "taps"],
  [/\bclicking\b/g, "tapping"],
  [/\bClicking\b/g, "Tapping"],
];

/** Says "tap" instead of "click" in every text under `root`. */
export function touchWords(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!/[Cc]lick/.test(node.nodeValue)) continue;
    let text = node.nodeValue;
    for (const [from, to] of WORDS) text = text.replace(from, to);
    node.nodeValue = text;
  }
}

let watcher = null;

/** Keeps saying "tap" in a level's stage while it plays (levels add texts as they go). */
export function watchTouchWords(root) {
  watcher?.disconnect();
  if (!isTouch() || typeof MutationObserver !== "function") return;
  touchWords(root);
  watcher = new MutationObserver(() => touchWords(root));
  watcher.observe(root, { childList: true, subtree: true });
}
