import { createPaintKit } from "../../avatar/svg-kit.js";

/**
 * Level 13's art: two painted rooms and the show on their screens. The
 * shows are made up (never real series or brands). Each has the big
 * moments that appear on screen and the chat reactions when you sync.
 */

export const SHOWS = [
  { title: "Moon Academy", sky: "#2c2350", ground: "#6a4fa0", shape: "#f7d36a", moments: ["THE TWIST!", "SHE'S HIS SISTER?!", "POWER UP!", "THE KISS!", "HE'S BACK!"], reactions: ["NOOO WAY", "I KNEW IT", "I'm screaming", "the drama!!"] },
  { title: "the Cup final", sky: "#8fc9e8", ground: "#5f9a5c", shape: "#fbf6ee", moments: ["GOAL!", "RED CARD!", "PENALTY!", "WHAT A SAVE!", "OFFSIDE?!"], reactions: ["GOOOAL", "unbelievable", "did you SEE that", "my heart"] },
  { title: "Love Villa", sky: "#f2a1b8", ground: "#e9c24a", shape: "#d9573f", moments: ["SHE SAID WHAT?!", "NEW GIRL!", "THE DUMPING!", "RECOUPLING!", "THE TEXT!"], reactions: ["the audacity", "I'm deceased", "iconic", "NOT HIM"] },
  { title: "The Basement", sky: "#1f2a2a", ground: "#3a4a40", shape: "#c9d9e8", moments: ["BEHIND YOU!", "THE DOOR!", "DON'T GO IN!", "THE LIGHTS!", "IT MOVED!"], reactions: ["I can't watch", "AAAAA", "why would she go in", "nope nope"] },
];

export const CITIES = [
  { name: "Tokyo", time: "02:14", wall: "#3b3a5c" },
  { name: "Seoul", time: "01:40", wall: "#3d4a63" },
  { name: "São Paulo", time: "14:20", wall: "#f3dfa2" },
  { name: "Sydney", time: "04:05", wall: "#344a5a" },
  { name: "Mexico City", time: "11:30", wall: "#e8b4a0" },
  { name: "Lagos", time: "18:15", wall: "#d9a679" },
];

let count = 0;

/** A painted room: wall, floor, a window (night if it's late there) and a lamp. */
export function roomSvg(wall, night) {
  const k = createPaintKit(`level-13-room-${++count}`, { grain: 0.9, wobble: 2 });
  const sky = night ? "#1d1b33" : "#a8d3ea";
  return `<svg class="room" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">${k.defs()}<g filter="url(#${k.ids.paint})">
    ${k.path("M0 0h200v150H0Z", wall)}
    ${k.path("M0 150h200v50H0Z", "#a9764e")}
    ${k.clay("M14 30h40v46H14Z", "#fbf6ee")}${k.path("M18 34h32v38H18Z", sky)}
    ${night ? k.circle(40, 44, 5, "#f7e7a6") + k.circle(26, 60, 1.2, "#fbf6ee") + k.circle(34, 52, 1, "#fbf6ee") : k.circle(28, 46, 6, "#fbf6ee")}
    ${k.stroke("M34 34v38M18 53h32", "#fbf6ee", 2)}
    ${k.stroke("M178 150V96", "#2b2630", 2)}${k.clay("M166 96h24l-5-16h-14Z", night ? "#f7d36a" : "#e8cfe0")}
    ${night ? `<circle cx="178" cy="100" r="34" fill="#f7d36a" opacity=".14"/>` : ""}
  </g></svg>`;
}

/** The show on screen: a simple painted scene in the show's colours. */
export function tvSvg(show) {
  const k = createPaintKit(`level-13-tv-${++count}`, { grain: 1.2, wobble: 1.4 });
  return `<svg viewBox="0 0 160 90">${k.defs()}<g filter="url(#${k.ids.paint})">
    ${k.path("M0 0h160v90H0Z", show.sky)}
    ${k.path("M0 62Q40 52 80 60T160 56V90H0Z", show.ground)}
    ${k.clay("M62 34a16 16 0 1 0 .1 0Z", show.shape)}
    ${k.clay("M104 42h12v24h-12Z", "#2b2630")}${k.circle(110, 38, 6, "#2b2630")}
  </g></svg>`;
}
