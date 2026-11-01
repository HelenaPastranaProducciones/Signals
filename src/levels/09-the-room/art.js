import { createPaintKit } from "../../avatar/svg-kit.js";
import { pick } from "../../engine/random.js";

/**
 * Level 9's room, seen diagonally from above and painted like the avatar:
 * the walls and floor as one backdrop, and each seat as its own drawing so
 * friends can be dropped on it. Every attempt picks other colours.
 */

const WALLS = [["#e8cfe0", "#d9b8cc"], ["#c9d9e8", "#b2c6d9"], ["#f3dfa2", "#e2c985"], ["#d3e6c5", "#bcd3ac"]];
const FLOORS = ["#c08a5a", "#b3926e", "#a98c7a"];
const RUGS = ["#d9576f", "#6f9fd8", "#e2a04a", "#9c8ad0", "#6fbf8c"];

/** The walls and floor: in % of the stage (the drawing stretches to fill it). */
export function roomBackdrop(chatName) {
  const k = createPaintKit("level-09-room", { grain: 2.2, wobble: 2 });
  const [wall, side] = pick(WALLS);
  const floor = pick(FLOORS);
  const rug = pick(RUGS);
  return `<svg class="room-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${k.defs()}<g filter="url(#${k.ids.paint})">` +
    // Back wall, left wall (seen at an angle), floor.
    k.path("M18 0H100V45H18Z", wall) +
    k.path("M0 0H18V45L0 62Z", side) +
    k.path("M18 45H100V100H0V62Z", floor) +
    k.path("M18 45H100V47H18Z", "#2b2630", 'opacity=".15"') +
    // Floorboards.
    [55, 66, 78, 90].map((y) => k.path(`M${18 - (y - 45) * 0.42} ${y}H100`, "none", 'stroke="#2b2630" stroke-width=".3" opacity=".18"')).join("") +
    // A big rug in the middle.
    k.clay("M30 62H86L92 92H22Z", rug) + k.path("M34 66H84L88 88H27Z", "none", 'stroke="#fff8ee" stroke-width=".6" opacity=".6"') +
    // The door on the left wall.
    k.clay("M4 20L13 16V52L4 58Z", "#7a5238") + k.circle(11, 36, 0.8, "#e9c24a") +
    // A window and a poster on the back wall.
    k.clay("M24 8H38V30H24Z", "#a9cbd8") + k.path("M31 8V30M24 19H38", "none", 'stroke="#fff8ee" stroke-width=".8"') +
    k.clay("M86 10H96V30H86Z", pick(RUGS)) + k.circle(91, 18, 3, "#fff8ee") +
    // The TV.
    k.clay("M64 22H80V36H64Z", "#2b2630") + k.path("M65 23H79V35H65Z", "#6f9fd8", 'opacity=".55"') + k.clay("M68 36H76V44H68Z", "#5c6270") +
    `</g></svg>` +
    // The chat's name on a sign (text outside the filter, so it stays crisp).
    `<div class="sign"><small>group chat</small>${chatName}</div>`;
}

/** One seat, as its own little drawing. */
export function seatSvg(kind) {
  const k = createPaintKit(`level-09-seat-${kind}`, { grain: 1.6, wobble: 1.5 });
  const colour = { sofa: "#6f9fd8", beanbag: pick(["#e2a04a", "#d9576f", "#6fbf8c"]), cushion: pick(["#9c8ad0", "#e9c24a", "#e07aa6"]) }[kind];
  const body = {
    sofa: k.clay("M6 20H94V60H6Z", colour) + k.clay("M2 40H98V86H2Z", colour) + k.path("M10 46H90V56H10Z", "#fff8ee", 'opacity=".25"'),
    beanbag: k.clay("M50 18C80 18 96 50 92 72C88 92 12 92 8 72C4 50 20 18 50 18Z", colour),
    cushion: k.clay("M10 56Q50 36 90 56Q96 74 50 86Q4 74 10 56Z", colour),
  }[kind];
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${k.defs()}<g filter="url(#${k.ids.paint})">${body}</g></svg>`;
}

/** Names for the group chat, on the wall. */
export const CHAT_NAMES = ["the besties", "group project lol", "the squad", "no homework zone", "the den", "snack club", "night owls", "the usual"];
