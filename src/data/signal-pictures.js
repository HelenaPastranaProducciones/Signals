import { createPaintKit } from "../avatar/svg-kit.js";

/**
 * One painted picture per signal, for the loading screen before its level
 * (Helena, 01/11/2026: "a picture of something that makes the signal
 * clear"). Drawn in a 240 × 180 box with the painted kit, like the avatar.
 * Everything is invented: no real brands, logos or characters.
 */

const INK = "#2b2630";
const PAPER = "#fbf6ee";
const SKIN = ["#f6c7a0", "#d49565", "#9a6240", "#f0b48a"];

/** A simple painted person seen from the front: head and shoulders. */
const bust = (k, x, y, s, top, skin = SKIN[0], hair = "#3a2a22") =>
  k.clay(`M${x - 22 * s} ${y + 40 * s}Q${x - 22 * s} ${y + 14 * s} ${x} ${y + 14 * s}Q${x + 22 * s} ${y + 14 * s} ${x + 22 * s} ${y + 40 * s}Z`, top) +
  k.clay(`M${x - 13 * s} ${y - 2 * s}a${13 * s} ${14 * s} 0 1 0 ${26 * s} 0a${13 * s} ${14 * s} 0 1 0 ${-26 * s} 0Z`, skin) +
  k.path(`M${x - 14 * s} ${y - 2 * s}Q${x - 14 * s} ${y - 18 * s} ${x} ${y - 18 * s}Q${x + 14 * s} ${y - 18 * s} ${x + 14 * s} ${y - 4 * s}Q${x + 2 * s} ${y - 10 * s} ${x - 14 * s} ${y - 2 * s}Z`, hair) +
  k.circle(x - 5 * s, y, 1.8 * s, INK) + k.circle(x + 5 * s, y, 1.8 * s, INK);

const bubble = (k, x, y, w, fill = PAPER) => k.clay(`M${x} ${y}h${w}q8 0 8 8v14q0 8-8 8H${x + 14}l-8 8v-8h-${6}q-8 0-8-8V${y + 8}q0-8 8-8Z`, fill);
const note = (k, x, y, c) => k.circle(x, y + 16, 6, c) + k.stroke(`M${x + 5} ${y + 16}V${y}l10 4`, c, 3);
const heart = (k, x, y, s, c) => k.path(`M${x} ${y + 9 * s}L${x - 9 * s} ${y}C${x - 13 * s} ${y - 5 * s} ${x - 6 * s} ${y - 10 * s} ${x} ${y - 4 * s}C${x + 6 * s} ${y - 10 * s} ${x + 13 * s} ${y - 5 * s} ${x + 9 * s} ${y}Z`, c);

const SCENES = {
  // 1 · Gaming is no longer just playing: friends meeting inside a game.
  1: { bg: "#c9d9e8", draw: (k) => k.clay("M30 22h180v108H30Z", INK) + k.path("M38 30h164v92H38Z", "#8fc9e8") + k.path("M38 96Q90 80 140 94T202 90V122H38Z", "#6fbf8c") +
    bust(k, 82, 70, 0.8, "#d9573f", SKIN[1]) + bust(k, 150, 72, 0.8, "#9c8ad0", SKIN[0], "#e2a04a") + bubble(k, 92, 36, 34) + bubble(k, 160, 38, 26, "#dcf3c8") +
    k.clay("M86 140Q120 132 154 140Q164 166 150 168Q140 168 136 158H104Q100 168 90 168Q76 166 86 140Z", "#5c6270") },
  // 2 · Music creates connection: two friends sharing one pair of earphones.
  2: { bg: "#f2c4d4", draw: (k) => bust(k, 78, 82, 1.2, "#6f9fd8", SKIN[0]) + bust(k, 162, 82, 1.2, "#e9c24a", SKIN[2], "#26252f") +
    k.stroke("M64 84Q70 130 120 140Q170 130 176 84", PAPER, 3) + k.stroke("M120 140V164", PAPER, 3) + k.clay("M110 160h20v14h-20Z", INK) +
    note(k, 104, 20, "#d9573f") + note(k, 132, 30, "#9c8ad0") },
  // 3 · We need our people: three matching friends together, everyone else apart.
  3: { bg: "#e4efe2", draw: (k) => bust(k, 60, 96, 1, "#9c8ad0", SKIN[1]) + bust(k, 98, 92, 1.05, "#9c8ad0", SKIN[0], "#d9573f") + bust(k, 136, 96, 1, "#9c8ad0", SKIN[3], "#26252f") +
    k.circle(98, 48, 8, "#e9c24a") + heart(k, 98, 48, 0.6, "#d9573f") +
    `<g opacity=".45">${bust(k, 196, 104, 0.75, "#b0a89a", SKIN[0], "#7a6a5a")}${bust(k, 222, 100, 0.65, "#b0a89a", SKIN[2], "#7a6a5a")}</g>` },
  // 4 · Physical comeback: a compact camera, a CD and a zine on the desk.
  4: { bg: "#f3dfa2", draw: (k) => k.clay("M20 120h200v40H20Z", "#c08a5a") + k.clay("M34 60h84v58H34Z", "#5c6270") + k.clay("M44 52h24v10H44Z", INK) + k.circle(76, 89, 20, INK) + k.circle(76, 89, 12, "#6f9fd8") + k.circle(106, 70, 4, "#e9c24a") +
    k.clay("M168 70a34 34 0 1 0 .1 0Z", "#d8d4e0") + k.circle(168, 104, 10, "#f3dfa2") + k.circle(168, 104, 3, INK) + k.path("M146 82Q160 74 176 78", "#fbf6ee", 'opacity=".7"') +
    k.clay("M124 128l44-6 6 30-44 6Z", "#e07aa6") },
  // 5 · From consumer to creator: a phone feed turns into your own drawing.
  5: { bg: "#d6e6ff", draw: (k) => k.clay("M24 30h70v124H24Z", INK) + k.path("M30 40h58v104H30Z", PAPER) + [52, 78, 104].map((y) => k.path(`M36 ${y}h46v18H36Z`, "#c9c3d6")).join("") +
    k.stroke("M100 92h30", INK, 4) + k.path("M128 84l12 8-12 8Z", INK) +
    k.clay("M146 34h76v100h-76Z", PAPER) + heart(k, 184, 78, 2.6, "#d9573f") + k.stroke("M190 164L222 120", "#e9c24a", 8) + k.path("M186 170l2-10 6 4Z", INK) },
  // 6 · Fandoms: a stand of fans in the same colours, with a banner.
  6: { bg: "#bfe6e6", draw: (k) => [0, 1, 2, 3, 4].map((i) => bust(k, 28 + i * 46, 118 - (i % 2) * 6, 0.85, i % 2 ? "#e2a04a" : "#2f7f7a", SKIN[i % 4])).join("") +
    k.clay("M50 24h140v34H50Z", "#e2a04a") + k.star(78, 41, 1.2, PAPER) + k.star(162, 41, 1.2, PAPER) + k.stroke("M98 41h44", PAPER, 5) },
  // 7 · Rituals: the same song, every morning, on a week calendar.
  7: { bg: "#e8cfe0", draw: (k) => k.clay("M24 30h192v126H24Z", PAPER) + k.path("M24 30h192v24H24Z", "#d9573f") +
    [0, 1, 2, 3, 4, 5, 6].map((i) => k.path(`M${32 + i * 26} 62h22v84h-22Z`, i === 6 ? "#f3dfa2" : "#efe6da") + note(k, 38 + i * 26, 86, "#9c8ad0")).join("") },
  // 8 · Socialising without energy: in bed, sending one heart.
  8: { bg: "#3b3a5c", draw: (k) => k.circle(196, 36, 14, "#f7e7a6") + k.clay("M14 120h212v40H14Z", "#9c8ad0") + k.clay("M20 104h60v22H20Z", PAPER) + bust(k, 64, 96, 0.9, "#6f9fd8", SKIN[0]) +
    k.clay("M74 120Q140 96 220 120v12H74Z", "#c0577a") + k.clay("M118 60h34v56h-34Z", INK) + k.path("M122 66h26v44h-26Z", "#7cf0b0") + heart(k, 135, 86, 0.9, "#d9573f") },
  // 9 · The group chat is a place: a phone that is also a little house.
  9: { bg: "#ffdcc8", draw: (k) => k.clay("M70 66L120 22L170 66V160H70Z", "#2f7f7a") + k.path("M80 72h80v80H80Z", "#e9dccb") + bubble(k, 86, 78, 40) + bubble(k, 108, 108, 34, "#dcf3c8") +
    k.circle(120, 48, 7, "#e9c24a") + bust(k, 40, 126, 0.7, "#d9573f", SKIN[1]) + bust(k, 202, 126, 0.7, "#6f9fd8", SKIN[2], "#26252f") },
  // 10 · Personalisation: a laptop covered in stickers.
  10: { bg: "#f6c9d8", draw: (k) => k.clay("M40 34h160v104H40Z", "#c9d9e8") + k.clay("M24 138h192v14H24Z", "#9aa4b4") + k.star(76, 66, 2, "#e9c24a") + heart(k, 150, 62, 1.8, "#d9573f") +
    k.clay("M90 96a16 16 0 1 0 .1 0Z", "#6fbf8c") + k.clay("M150 96h30v22h-30Z", "#9c8ad0") + k.stroke("M56 112Q66 100 76 112T96 112", "#2f7f7a", 4) },
  // 11 · Friendship in the background: two friends on a call, each doing homework.
  11: { bg: "#e4efe2", draw: (k) => [[18, "#d9573f", SKIN[0]], [124, "#6f9fd8", SKIN[2]]].map(([x, top, skin]) =>
    k.clay(`M${x} 30h98v82H${x}Z`, INK) + k.path(`M${x + 6} 36h86v70H${x + 6}Z`, "#e9dccb") + bust(k, x + 49, 70, 0.75, top, skin) +
    k.clay(`M${x + 10} 132h78v20H${x + 10}Z`, PAPER) + k.stroke(`M${x + 18} 140h50M${x + 18} 146h36`, "#9aa4b4", 2)).join("") + k.stroke("M116 70h8", "#6fbf8c", 3) },
  // 12 · Small things, big meanings: a friendship bracelet.
  12: { bg: "#fbe3c6", draw: (k) => k.stroke("M50 96Q50 50 120 50Q190 50 190 96Q190 142 120 142Q50 142 50 96Z", "#e07aa6", 6) +
    ["#d9573f", "#e9c24a", "#6fbf8c", "#6f9fd8", "#9c8ad0", "#e9c24a", "#d9573f"].map((c, i) => { const a = (i / 7) * Math.PI * 2; return k.clay(`M${120 + Math.cos(a) * 70 - 9} ${96 + Math.sin(a) * 46 - 9}h18v18h-18Z`, c); }).join("") +
    k.clay("M108 132h24v20h-24Z", PAPER) + k.path("M114 138h12M114 144h8", INK) },
  // 13 · Shared experiences, no shared location: two screens, same show, far apart.
  13: { bg: "#d6e6ff", draw: (k) => [[16, "#f0c7a8"], [134, "#3b3a5c"]].map(([x, wall]) => k.clay(`M${x} 30h90v112H${x}Z`, wall) + k.clay(`M${x + 10} 46h70v42H${x + 10}Z`, INK) + k.path(`M${x + 14} 50h62v34H${x + 14}Z`, "#f2a1b8") + k.circle(x + 45, 66, 8, "#e9c24a") + bust(k, x + 45, 116, 0.6, x < 100 ? "#d9573f" : "#6fbf8c", SKIN[x < 100 ? 0 : 1])).join("") +
    k.stroke("M108 70h24", "#e9c24a", 3, 'stroke-dasharray="4 4"') },
  // 14 · Curation: a moodboard of pinned references.
  14: { bg: "#efe3c6", draw: (k) => k.clay("M24 20h192v140H24Z", "#c08a5a") + [[34, 30, "#f2a1b8"], [100, 30, "#6f9fd8"], [160, 34, "#e9c24a"], [40, 96, "#6fbf8c"], [104, 92, "#9c8ad0"], [164, 98, "#d9573f"]].map(([x, y, c], i) =>
    k.clay(`M${x} ${y}h${48 + (i % 2) * 6}v${52 - (i % 3) * 4}H${x}Z`, PAPER) + k.path(`M${x + 5} ${y + 5}h${38 + (i % 2) * 6}v${32 - (i % 3) * 4}H${x + 5}Z`, c) + k.circle(x + 24, y + 2, 4, "#d9573f")).join("") },
  // 15 · Analog gestures: a handwritten letter and a pen.
  15: { bg: "#e8d2b8", draw: (k) => k.clay("M30 40h130v110H30Z", PAPER) + k.stroke("M44 64h96M44 80h88M44 96h100M44 112h70", "#6f9fd8", 3) + heart(k, 130, 128, 1, "#d9573f") +
    k.clay("M150 70h76v52h-76Z", "#f3dfa2") + k.stroke("M150 70l38 30 38-30", INK, 2) + k.stroke("M200 162L232 128", INK, 6) + k.path("M196 168l2-8 6 4Z", INK) },
  // 16 · Levels of being social: from a quiet look to meeting up, step by step.
  16: { bg: "#e8cfe0", draw: (k) => [0, 1, 2, 3].map((i) => k.clay(`M${16 + i * 54} ${150 - i * 26}h54v${30 + i * 26}h-54Z`, ["#c9d9e8", "#9fc4ea", "#6f9fd8", "#3d6fe0"][i])).join("") +
    k.path("M30 136Q43 126 56 136Q43 146 30 136Z", PAPER) + k.circle(43, 136, 4, INK) + heart(k, 97, 108, 1.1, "#d9573f") + bubble(k, 136, 72, 26) + bust(k, 182, 36, 0.55, "#e9c24a", SKIN[1]) + bust(k, 206, 36, 0.55, "#d9573f", SKIN[0]) },
  // 17 · The object is an excuse to connect: two friends swapping cards.
  17: { bg: "#f3dfa2", draw: (k) => bust(k, 50, 90, 1.1, "#6fbf8c", SKIN[2], "#26252f") + bust(k, 190, 90, 1.1, "#e07aa6", SKIN[0], "#e2a04a") +
    `<g transform="rotate(-12 100 110)">${k.clay("M84 84h32v46H84Z", "#6f9fd8")}${k.circle(100, 100, 8, "#f3dfa2")}</g><g transform="rotate(10 140 110)">${k.clay("M124 84h32v46h-32Z", "#d9573f")}${k.star(140, 102, 0.9, "#f3dfa2")}</g>` +
    k.stroke("M98 60Q120 44 142 60", INK, 2.5) + k.path("M138 54l6 7-9 1Z", INK) },
  // 18 · Friend groups have their own culture: matching caps and a secret sign.
  18: { bg: "#ffe9b0", draw: (k) => [0, 1, 2].map((i) => bust(k, 64 + i * 56, 100, 1, ["#6f9fd8", "#d9573f", "#6fbf8c"][i], SKIN[i], "#3a2a22") + k.clay(`M${48 + i * 56} 82Q${64 + i * 56} 66 ${80 + i * 56} 82Z`, "#9c8ad0") + k.clay(`M${76 + i * 56} 80h12v4h-12Z`, "#9c8ad0")).join("") +
    k.star(120, 34, 1.6, "#9c8ad0") },
  // 19 · Digital culture leaves physical traces: a chat screenshot printed as a photo.
  19: { bg: "#c9b28f", draw: (k) => k.clay("M70 112h100v40H70Z", "#5c6270") + k.clay("M84 18h72v102H84Z", PAPER) + k.path("M90 24h60v74H90Z", "#e9dccb") + k.path("M90 24h60v12H90Z", "#2f7f7a") +
    k.path("M94 42h34v10H94Z", PAPER) + k.path("M112 58h34v10h-34Z", "#dcf3c8") + k.path("M94 74h28v10H94Z", PAPER) + k.circle(120, 14, 4, "#d9573f") + k.path("M76 130h88v6H76Z", INK, 'opacity=".4"') },
};

let count = 0;

/** The painted picture for a signal, or an empty string if there is none. */
export function signalPicture(number) {
  const scene = SCENES[number];
  if (!scene) return "";
  const k = createPaintKit(`signal-picture-${++count}`, { grain: 0.9, wobble: 2 });
  return `<svg class="signal-picture" viewBox="0 0 240 180" role="img" aria-label="Signal ${number}">${k.defs()}<g filter="url(#${k.ids.paint})">${k.path("M0 0h240v180H0Z", scene.bg)}${scene.draw(k)}</g></svg>`;
}
