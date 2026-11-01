/**
 * Level 10's drawings: the five objects you can customise and the stickers,
 * painted like the avatar (flat colours, a hard shadow, the paint grain).
 *
 * Objects are drawn in a 400 × 300 box. `shape` is the part you decorate
 * (its base colour, and the outline stickers and drawings stay inside);
 * `behind` and `over` are details drawn under and above the decorations.
 */

const INK = "#2b2630";
const CEL = (d) => `<path d="${d}" fill="url(#level-10-cel)"/>`;

export const OBJECTS = [
  {
    id: "skateboard", name: "Skateboard",
    shape: "M80 95H320A55 55 0 0 1 320 205H80A55 55 0 0 1 80 95Z",
    behind: [[96, 84], [96, 216], [304, 84], [304, 216]].map(([x, y]) => `<rect x="${x - 22}" y="${y - 10}" width="44" height="20" rx="8" fill="#5c6270"/><circle cx="${x - 14}" cy="${y}" r="9" fill="#f1ece4"/><circle cx="${x + 14}" cy="${y}" r="9" fill="#f1ece4"/>`).join(""),
    over: "",
  },
  {
    id: "phone", name: "Phone case",
    shape: "M168 20H232A28 28 0 0 1 260 48V252A28 28 0 0 1 232 280H168A28 28 0 0 1 140 252V48A28 28 0 0 1 168 20Z",
    behind: "",
    over: `<rect x="152" y="32" width="46" height="60" rx="14" fill="${INK}" opacity=".85"/><circle cx="168" cy="50" r="9" fill="#5c6270"/><circle cx="168" cy="76" r="9" fill="#5c6270"/><circle cx="188" cy="62" r="4" fill="#f1ece4"/>`,
  },
  {
    id: "bottle", name: "Water bottle",
    shape: "M180 50Q150 60 148 90V260Q148 284 172 284H228Q252 284 252 260V90Q250 60 220 50Z",
    behind: "",
    over: `<rect x="172" y="14" width="56" height="40" rx="10" fill="#5c6270"/><rect x="172" y="14" width="56" height="10" rx="5" fill="${INK}" opacity=".3"/>`,
  },
  {
    id: "laptop", name: "Laptop",
    shape: "M70 40H330A20 20 0 0 1 350 60V240A20 20 0 0 1 330 260H70A20 20 0 0 1 50 240V60A20 20 0 0 1 70 40Z",
    behind: `<rect x="40" y="250" width="320" height="18" rx="9" fill="#5c6270"/>`,
    over: "",
  },
  {
    id: "backpack", name: "Backpack",
    shape: "M140 60Q200 30 260 60Q290 80 290 120V260Q290 284 266 284H134Q110 284 110 260V120Q110 80 140 60Z",
    behind: `<path d="M120 110Q84 160 108 250M280 110Q316 160 292 250" fill="none" stroke="#5c6270" stroke-width="14" stroke-linecap="round"/>`,
    over: `<path d="M172 46Q200 14 228 46" fill="none" stroke="#5c6270" stroke-width="10" stroke-linecap="round"/><path d="M134 196H266V262Q266 272 256 272H144Q134 272 134 262Z" fill="none" stroke="${INK}" stroke-width="3" opacity=".35"/>`,
  },
];

/** The plain colour every object comes in (the one everybody has). */
export const PLAIN = "#cfd3dc";

/** Paint pots and markers. */
export const PAINTS = ["#d9573f", "#e2a04a", "#e9c24a", "#6fbf8c", "#6f9fd8", "#9c8ad0", "#e07aa6", "#2b2630"];
export const MARKERS = ["#2b2630", "#f1ece4", "#d9573f", "#6f9fd8"];

/** Stickers, drawn around (0, 0), about 60 across. */
export const STICKERS = [
  { id: "star", body: `<path d="M0-28L8-9 28-8 13 6 18 27 0 16-18 27-13 6-28-8-8-9Z" fill="#e9c24a"/>` },
  { id: "heart", body: `<path d="M0 24L-22 2Q-30-10-20-20Q-10-28 0-16Q10-28 20-20Q30-10 22 2Z" fill="#e07aa6"/>` },
  { id: "bolt", body: `<path d="M6-28L-18 4H-2L-8 28L18-6H2Z" fill="#e2a04a"/>` },
  { id: "flower", body: [0, 72, 144, 216, 288].map((a) => `<circle cx="${(Math.cos((a * Math.PI) / 180) * 14).toFixed(1)}" cy="${(Math.sin((a * Math.PI) / 180) * 14).toFixed(1)}" r="11" fill="#9c8ad0"/>`).join("") + `<circle r="9" fill="#e9c24a"/>` },
  { id: "smiley", body: `<circle r="26" fill="#e9c24a"/><circle cx="-9" cy="-6" r="4" fill="${INK}"/><circle cx="9" cy="-6" r="4" fill="${INK}"/><path d="M-12 8Q0 20 12 8" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` },
  { id: "mine", body: `<rect x="-34" y="-15" width="68" height="30" rx="15" fill="#d9573f"/><text y="7" text-anchor="middle" font-family="Schoolbell, sans-serif" font-size="20" fill="#fff8ee">MINE</text>` },
  { id: "rainbow", body: ["#d9573f", "#e9c24a", "#6fbf8c", "#6f9fd8"].map((c, i) => `<path d="M${-28 + i * 6} 14A${28 - i * 6} ${28 - i * 6} 0 0 1 ${28 - i * 6} 14" fill="none" stroke="${c}" stroke-width="6"/>`).join("") },
  { id: "cherry", body: `<path d="M-10 4Q-4-20 10-26M10 6Q8-14 10-26" fill="none" stroke="#5f9a5c" stroke-width="3"/><circle cx="-12" cy="12" r="11" fill="#d9573f"/><circle cx="12" cy="14" r="11" fill="#d9573f"/>` },
  { id: "moon", body: `<path d="M8-26A26 26 0 1 0 22 14A20 20 0 1 1 8-26Z" fill="#f3dfa2"/>` },
  { id: "eye", body: `<path d="M-30 0Q0-26 30 0Q0 26-30 0Z" fill="#f1ece4"/><circle r="11" fill="#6f9fd8"/><circle r="5" fill="${INK}"/>` },
  { id: "planet", body: `<circle r="16" fill="#e07aa6"/><ellipse rx="30" ry="9" fill="none" stroke="#e9c24a" stroke-width="5" transform="rotate(-18)"/>` },
  { id: "peace", body: `<circle r="24" fill="none" stroke="#6fbf8c" stroke-width="6"/><path d="M0-24V24M0 2L-17 17M0 2L17 17" fill="none" stroke="#6fbf8c" stroke-width="6"/>` },
];

/** The shared painted defs (hard shadow and paint grain), put once in each drawing. */
export const PAINT_DEFS =
  `<defs><linearGradient id="level-10-cel" x1="0" x2="1"><stop offset=".62" stop-color="#3a1e2a" stop-opacity="0"/><stop offset=".62" stop-color="#3a1e2a" stop-opacity=".16"/></linearGradient>` +
  `<filter id="level-10-paint" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="6" result="warp"/>` +
  `<feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" result="rough"/>` +
  `<feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="13" result="noise"/>` +
  `<feColorMatrix in="noise" type="matrix" values="0 0 0 0 .16  0 0 0 0 .1  0 0 0 0 .14  1 0 0 0 -.5" result="specks"/>` +
  `<feComposite in="specks" in2="rough" operator="in" result="grain"/><feMerge><feMergeNode in="rough"/><feMergeNode in="grain"/></feMerge></filter></defs>`;

/**
 * An object, plain or decorated. `deco` is the decorations' markup, `colour`
 * its base colour, `id` a unique id for its clip path.
 */
export function objectSvg(object, { colour = PLAIN, deco = "", id, cls = "" } = {}) {
  return `<svg class="object-svg ${cls}" viewBox="0 0 400 300" aria-label="${object.name}">${PAINT_DEFS}` +
    `<clipPath id="${id}"><path d="${object.shape}"/></clipPath>` +
    `<g filter="url(#level-10-paint)">${object.behind}` +
    `<path class="base" d="${object.shape}" fill="${colour}"/>` +
    `<g class="deco" clip-path="url(#${id})">${deco}</g>` +
    CEL(object.shape) + object.over +
    `<path d="${object.shape}" fill="none" stroke="${INK}" stroke-width="3" opacity=".5"/></g></svg>`;
}

/** A sticker on its own (for the sheet). */
export const stickerSvg = (sticker) => `<svg viewBox="-34 -34 68 68" aria-hidden="true">${sticker.body}</svg>`;
