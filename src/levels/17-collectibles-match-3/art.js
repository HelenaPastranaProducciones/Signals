import { createPaintKit } from "../../avatar/svg-kit.js";

/**
 * Level 17's collectibles, painted like the avatar. Three from an older
 * sibling's childhood (warm tile) and three from today (cool tile). All
 * invented: never draw a real brand's toy, card or character.
 */

const INK = "#2b2630";

export const COLLECTIBLES = [
  // Back then.
  { name: "Tazo", old: true, draw: (k) => k.clay("M50 18a32 32 0 1 0 .1 0Z", "#e2a04a") + k.circle(50, 50, 22, "#f3dfa2") + k.star(50, 50, 1.6, "#d9573f") },
  { name: "Trading card", old: true, draw: (k) => k.clay("M26 14h48v72H26Z", "#6f9fd8") + k.path("M31 20h38v36H31Z", "#f3dfa2") + k.clay("M50 28c10 0 14 8 12 16c-2 8-22 8-24 0c-2-8 2-16 12-16Z", "#6fbf8c") + k.circle(46, 38, 2, INK) + k.circle(54, 38, 2, INK) + k.stroke("M32 66h36M32 74h24", "#fbf6ee", 3) },
  { name: "Pocket pet", old: true, draw: (k) => k.clay("M50 12C74 12 82 36 80 58C78 80 64 88 50 88C36 88 22 80 20 58C18 36 26 12 50 12Z", "#e07aa6") + k.path("M34 32h32v26H34Z", "#c8d8a8") + k.path("M44 40h4v4h-4ZM52 40h4v4h-4ZM46 48h8v3h-8Z", INK) + [36, 50, 64].map((x) => k.circle(x, 72, 4, "#fbf6ee")).join("") },
  // Now.
  { name: "Blind-box figure", old: false, draw: (k) => k.clay("M30 20l6-10l8 10Z", "#9c8ad0") + k.clay("M70 20l-6-10l-8 10Z", "#9c8ad0") + k.clay("M50 16C72 16 78 34 76 46C74 60 26 60 24 46C22 34 28 16 50 16Z", "#fbf6ee") + k.clay("M36 56h28v28H36Z", "#9c8ad0") + k.circle(41, 40, 3.5, INK) + k.circle(59, 40, 3.5, INK) + k.circle(36, 47, 3, "#f2a1b8", ".7") + k.circle(64, 47, 3, "#f2a1b8", ".7") },
  { name: "Enamel pin", old: false, draw: (k) => k.clay("M50 84L18 50C6 36 16 16 32 18C40 19 46 24 50 30C54 24 60 19 68 18C84 16 94 36 82 50Z", "#d9573f") + k.path("M50 84L18 50C6 36 16 16 32 18C40 19 46 24 50 30C54 24 60 19 68 18C84 16 94 36 82 50Z", "none", 'stroke="#e9c24a" stroke-width="4"') + k.stroke("M30 30Q34 26 40 28", "#fbf6ee", 4) },
  { name: "Photocard", old: false, draw: (k) => k.clay("M28 12h44v76H28Z", "#fbf6ee") + k.path("M32 16h36v52H32Z", "#f2a1b8") + k.circle(50, 36, 9, "#c08a5a") + k.clay("M36 68C36 52 64 52 64 68Z", "#5c6270") + k.star(62, 24, 0.7, "#fbf6ee") + k.stroke("M36 78h28", "#9c8ad0", 3) },
];

let count = 0;
const cache = new Map();

/** A collectible on its tile (warm for back then, cool for now), drawn once and reused. */
export function collectibleSvg(index) {
  if (!cache.has(index)) {
    const item = COLLECTIBLES[index];
    const k = createPaintKit(`level-17-item-${++count}`, { grain: 1.3, wobble: 1.5 });
    cache.set(index, `<svg viewBox="0 0 100 100" aria-label="${item.name}">${k.defs()}<g filter="url(#${k.ids.paint})">` +
      k.path("M8 10Q8 6 12 6H88Q92 6 92 10V90Q92 94 88 94H12Q8 94 8 90Z", item.old ? "#f3dfa2" : "#c9d9e8") +
      item.draw(k) + `</g></svg>`);
  }
  return cache.get(index);
}
