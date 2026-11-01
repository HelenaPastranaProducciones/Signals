import { createPaintKit } from "../../avatar/svg-kit.js";

/**
 * Level 6's clubs and their crests, painted like the avatar. All invented:
 * never draw a real club's crest, colours or name.
 */

export const CLUBS = [
  { name: "Lions", main: "#e2a04a", second: "#2b2630", symbol: "star" },
  { name: "Waves", main: "#6f9fd8", second: "#f1ece4", symbol: "wave" },
  { name: "Comets", main: "#9c8ad0", second: "#e9c24a", symbol: "comet" },
  { name: "Roses", main: "#d9573f", second: "#f1ece4", symbol: "rose" },
  { name: "Pines", main: "#5f9a5c", second: "#f1ece4", symbol: "pine" },
  { name: "Bolts", main: "#e9c24a", second: "#2b2630", symbol: "bolt" },
];

const SHIELD = "M50 6C64 12 78 12 90 10C92 44 84 74 50 94C16 74 8 44 10 10C22 12 36 12 50 6Z";
const STRIPE = "M50 6C64 12 78 12 90 10C92 44 84 74 50 94Z";

const SYMBOLS = {
  star: (k, c) => k.star(50, 46, 2.3, c),
  wave: (k, c) => k.stroke("M24 44Q32 34 40 44T56 44T72 44M24 60Q32 50 40 60T56 60T72 60", c, 6),
  comet: (k, c) => k.circle(58, 40, 11, c) + k.stroke("M50 48L28 68M54 54L36 74", c, 5),
  rose: (k, c) => k.circle(50, 42, 13, c) + k.stroke("M50 55V76M50 66L40 60", c, 4),
  pine: (k, c) => k.path("M50 22L70 52H58L72 72H28L42 52H30Z", c),
  bolt: (k, c) => k.path("M56 20L32 54H48L42 80L68 42H52Z", c),
};

let count = 0;
const cache = new Map();

/** A club's crest as an SVG (drawn once per club and reused). */
export function crest(club) {
  if (!cache.has(club.name)) {
    const k = createPaintKit(`level-06-crest-${++count}`, { grain: 1.3, wobble: 1.6 });
    cache.set(club.name, `<svg viewBox="0 0 100 100" aria-label="${club.name}">${k.defs()}<g filter="url(#${k.ids.paint})">` +
      k.path(SHIELD, "#2b2630", 'transform="translate(2 4)" opacity=".25"') +
      k.clay(SHIELD, club.main) + k.path(STRIPE, club.second, 'opacity=".22"') +
      k.path(SHIELD, "none", 'stroke="#2b2630" stroke-width="3"') +
      SYMBOLS[club.symbol](k, club.second) + `</g></svg>`);
  }
  return cache.get(club.name);
}
