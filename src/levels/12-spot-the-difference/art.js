import { createPaintKit } from "../../avatar/svg-kit.js";
import { pick } from "../../engine/random.js";

/**
 * Level 12's room photo, painted like the avatar: a wall with a corkboard of
 * photos and notes, string lights, a poster, a shelf and a desk. The same
 * drawing makes both photos; `changed` lists the details that are different
 * in this one. Drawing units: 400 × 300.
 */

/**
 * The details that can differ: where they are (to check a click) and what
 * the friend it's about says when you find it. Small on purpose (Helena:
 * hard). `who` is filled with a friend's name.
 */
export const DETAILS = [
  { id: "bracelet", x: 152, y: 58, r: 15, says: "you still have the bracelet?? I made that in 6th grade" },
  { id: "photo", x: 64, y: 70, r: 16, says: "that's from the beach day!! I'm in that one" },
  { id: "tilt", x: 114, y: 76, r: 16, says: "lol why is my photo crooked now" },
  { id: "ticket", x: 152, y: 104, r: 13, says: "the concert ticket!! best night ever" },
  { id: "heart", x: 72, y: 118, r: 14, says: "aww you kept my note" },
  { id: "sticker", x: 222, y: 62, r: 13, says: "that's the sticker from my birthday party" },
  { id: "bulb", x: 200, y: 20, r: 10, says: "I gave you those lights!!" },
  { id: "book", x: 232, y: 152, r: 13, says: "you STILL haven't given my book back lol" },
  { id: "flower", x: 306, y: 132, r: 14, says: "the plant I gave you has a flower!!" },
  { id: "mug", x: 352, y: 158, r: 12, says: "my mug!! so that's where it went" },
  { id: "keys", x: 118, y: 262, r: 14, says: "matching keychains forever" },
  { id: "pin", x: 300, y: 70, r: 12, says: "you put my band's pin on the poster!" },
];

const WALLS = ["#e8cfe0", "#c9d9e8", "#f3dfa2", "#d3e6c5"];
const BULBS = ["#e9c24a", "#e07aa6", "#6f9fd8", "#6fbf8c"];

/** The colours of the room for one attempt (both photos share them). */
export const roomColours = () => ({ wall: pick(WALLS), poster: pick(["#9c8ad0", "#d9573f", "#2f7f7a"]), bookColours: [pick(["#d9573f", "#6f9fd8"]), pick(["#e2a04a", "#6fbf8c"]), pick(["#9c8ad0", "#e07aa6"])] });

let count = 0;
/** One photo of the room. @param {Set<string>} changed  Details drawn differently in this photo. */
export function roomPhoto(colours, changed) {
  const k = createPaintKit(`level-12-photo-${++count}`, { grain: 1.6, wobble: 1.6 });
  const c = (id) => changed.has(id);
  const ink = "#2b2630";
  const face = (x, y, skin, hair) => k.circle(x, y + 3, 6, skin) + k.path(`M${x - 6} ${y + 2}Q${x} ${y - 7} ${x + 6} ${y + 2}Z`, hair);
  return `<svg class="photo-svg" viewBox="0 0 400 300" aria-hidden="true">${k.defs()}<g filter="url(#${k.ids.paint})">` +
    // Wall, desk.
    k.path("M0 0H400V250H0Z", colours.wall) +
    k.path("M0 0H400V250H0Z", "url(#" + k.ids.shade + ")") +
    k.clay("M0 248H400V300H0Z", "#c08a5a") +
    // String lights across the top (one bulb can change colour).
    k.stroke("M8 14Q100 30 200 16T392 16", "#5c6270", 1.6) +
    [20, 60, 100, 140, 180, 200, 240, 280, 320, 360].map((x, i) =>
      k.circle(x, 18 + Math.sin(i) * 3, 4.5, x === 200 && c("bulb") ? "#d9573f" : BULBS[i % BULBS.length])).join("") +
    // Corkboard with photos, a note, a ticket and a bracelet.
    k.clay("M28 38H176V146H28Z", "#c99a6a") +
    // Photo 1: the beach day, two friends (three when it changed).
    `<g transform="rotate(-6 64 70)">${k.clay("M44 48H84V94H44Z", "#fbf6ee")}${k.path("M48 52H80V82H48Z", "#a9cbd8")}${k.path("M48 74H80V82H48Z", "#f3dfa2")}` +
    face(57, 66, "#e0a77a", "#3a2a22") + face(71, 66, "#9a6240", "#1c1a22") + (c("photo") ? face(64, 61, "#f0b48a", "#c8602a") : "") + `</g>` +
    // Photo 2: can be crooked.
    `<g transform="rotate(${c("tilt") ? -14 : 5} 114 76)">${k.clay("M94 52H134V98H94Z", "#fbf6ee")}${k.path("M98 56H130V86H98Z", "#e8cfe0")}${face(114, 66, "#d49565", "#e9c24a")}</g>` +
    // The note, with or without a little heart.
    `<g transform="rotate(3 72 118)">${k.clay("M54 104H92V132H54Z", "#f6e3a6")}${k.stroke("M60 112H84M60 118H80", "#8a8090", 1.4)}` +
    (c("heart") ? "" : `<path d="M74 129L70 125Q68 122 71 121Q73 120 74 122Q75 120 77 121Q80 122 78 125Z" fill="#d9576f"/>`) + `</g>` +
    // The concert ticket.
    (c("ticket") ? "" : `<g transform="rotate(-8 152 104)">${k.clay("M138 98H166V110H138Z", "#e07aa6")}${k.stroke("M158 98V110", "#fbf6ee", 1, 'stroke-dasharray="2 2"')}</g>`) +
    // Pins, and the friendship bracelet hanging from one.
    k.circle(64, 46, 2.5, "#d9573f") + k.circle(114, 52, 2.5, "#6f9fd8") + k.circle(152, 48, 2.5, "#e9c24a") +
    (c("bracelet") ? "" : [0, 1, 2, 3, 4, 5, 6, 7].map((i) => k.circle(152 + Math.sin(i * 0.8) * 7, 56 + i * 1.6, 2.4, BULBS[i % 4])).join("")) +
    // A sticker on the wall: a star, or a moon when it changed.
    (c("sticker") ? k.path("M226 54A9 9 0 1 0 230 68A7 7 0 1 1 226 54Z", "#f3dfa2") : k.star(222, 62, 0.9, "#e9c24a")) +
    // The poster, with a little pin on it.
    k.clay("M262 30H340V128H262Z", colours.poster) + k.circle(301, 66, 18, "#fbf6ee", ".25") + k.stroke("M272 110H330M276 118H320", "#fbf6ee", 2) +
    (c("pin") ? k.circle(300, 70, 5, "#e9c24a") + k.circle(300, 70, 2, "#2b2630") : "") +
    // The shelf: books, a plant (with a flower or not), a mug (with an initial or not).
    k.clay("M196 166H388V174H196Z", "#a9764e") +
    `${k.clay("M210 128H222V166H210Z", colours.bookColours[0])}${k.clay("M224 134H238V166H224Z", c("book") ? "#5f9a5c" : colours.bookColours[1])}${k.clay("M240 124H250V166H240Z", colours.bookColours[2])}` +
    k.clay("M292 146H320L316 166H296Z", "#c0577a") + k.stroke("M306 146V126M306 136Q296 130 294 122M306 134Q316 128 318 120", "#5f9a5c", 2.5) +
    (c("flower") ? k.circle(306, 124, 4, "#e9c24a") + [0, 1, 2, 3, 4].map((i) => k.circle(306 + Math.cos(i * 1.26) * 4.5, 124 + Math.sin(i * 1.26) * 4.5, 3, "#e07aa6")).join("") : "") +
    k.clay("M342 150H362V166H342Z", "#fbf6ee") + k.stroke("M362 154Q370 158 362 162", "#fbf6ee", 2.5) +
    (c("mug") ? "" : `<text x="352" y="162" text-anchor="middle" font-family="Schoolbell, sans-serif" font-size="11" fill="${ink}">M</text>`) +
    // On the desk: a laptop and keychains (two matching ones, or just one).
    k.clay("M180 236H300L310 250H170Z", "#5c6270") + k.clay("M190 196H290V236H190Z", "#3a3d48") +
    k.stroke("M106 258a6 6 0 1 0 .1 0", "#e2a04a", 2.2) + (c("keys") ? "" : k.stroke("M126 260a6 6 0 1 0 .1 0", "#e2a04a", 2.2)) +
    `</g></svg>`;
}
