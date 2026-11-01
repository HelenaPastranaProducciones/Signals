import { pick, shuffle } from "../../engine/random.js";

/**
 * Level 19's art: the group-chat screenshot that becomes the puzzle, and
 * the memories pinned on the wall at the end (one per level of the game).
 */

const CHATS = [
  ["who's up", "me. obviously", "same lol", "ok but who's bringing snacks", "not me", "I'll bring the snacks"],
  ["guys look at this", "NO WAY", "I'm crying", "screenshotting this forever", "print it and frame it", "deal"],
  ["the bus is SO late", "again??", "walk with me", "be there in 5", "save me a seat", "always"],
  ["did you see the finale", "don't talk to me", "I'm still not ok", "rewatch on friday?", "yes yes yes", "my place"],
];

/** The chat screenshot (300 × 400), flat like a real screen. Names are already escaped. */
export function screenshotSvg(nickname, friends) {
  const lines = pick(CHATS);
  const speakers = shuffle([...friends.map((f) => ({ name: f.name, colour: f.colour, me: false })), { name: nickname, colour: "#d9573f", me: true }]);
  let y = 66;
  const bubbles = lines.map((text, i) => {
    const who = speakers[i % speakers.length];
    const w = Math.min(200, 26 + text.length * 7.4);
    const x = who.me ? 286 - w : 14;
    const fill = who.me ? "#dcf3c8" : "#ffffff";
    const out = `<rect x="${x}" y="${y}" width="${w}" height="42" rx="12" fill="${fill}"/>` +
      `<text x="${x + 10}" y="${y + 15}" font-size="11" fill="${who.colour}">${who.name}</text>` +
      `<text x="${x + 10}" y="${y + 33}" font-size="15" fill="#2b2630">${text}</text>`;
    y += 50;
    return out;
  }).join("");
  return `<svg viewBox="0 0 300 400" preserveAspectRatio="none" font-family="inherit">
    <rect width="300" height="400" fill="#e9dccb"/>
    <path d="M0 0h300v48H0Z" fill="#2f7f7a"/>
    <circle cx="28" cy="24" r="14" fill="#e9c24a"/><text x="50" y="22" font-size="16" fill="#fff">the group</text>
    <text x="50" y="38" font-size="11" fill="#d6efe9">${friends.map((f) => f.name).join(", ")}, you</text>
    ${bubbles}
    <path d="M0 370h300v30H0Z" fill="#fbf6ee"/><rect x="12" y="376" width="240" height="18" rx="9" fill="#e9dccb"/><circle cx="276" cy="385" r="10" fill="#2f7f7a"/>
  </svg>`;
}

const ink = "#2b2630";

/** One memory per level, as a tiny drawing on a polaroid. */
export const MEMORIES = [
  { caption: "the race", colour: "#a8d3ea", art: `<svg viewBox="0 0 40 40"><path d="M0 30Q20 22 40 30V40H0Z" fill="#6fbf8c"/><circle cx="20" cy="16" r="6" fill="#f6c7a0"/></svg>` },
  { caption: "the gig", colour: "#2c2350", art: `<svg viewBox="0 0 40 40"><circle cx="12" cy="28" r="5" fill="#e9c24a"/><circle cx="28" cy="22" r="5" fill="#e07aa6"/><path d="M17 28V10l12-3v15" stroke="#fbf6ee" stroke-width="2" fill="none"/></svg>` },
  { caption: "my tribe", colour: "#f3dfa2", art: `<svg viewBox="0 0 40 40">${[10, 20, 30].map((x) => `<circle cx="${x}" cy="18" r="5" fill="#9c8ad0"/><path d="M${x - 5} 34Q${x} 22 ${x + 5} 34Z" fill="#9c8ad0"/>`).join("")}</svg>` },
  { caption: "claw prize", colour: "#f2a1b8", art: `<svg viewBox="0 0 40 40"><circle cx="20" cy="22" r="10" fill="#c08a5a"/><circle cx="12" cy="14" r="4" fill="#c08a5a"/><circle cx="28" cy="14" r="4" fill="#c08a5a"/></svg>` },
  { caption: "my pixel art", colour: "#fbf6ee", art: `<svg viewBox="0 0 40 40" shape-rendering="crispEdges"><path d="M12 12h6v6h-6ZM22 12h6v6h-6ZM10 24h20v4H10Z" fill="${ink}"/></svg>` },
  { caption: "match day", colour: "#5f9a5c", art: `<svg viewBox="0 0 40 40"><path d="M20 6C26 9 31 9 34 8C35 22 30 31 20 36C10 31 5 22 6 8C9 9 14 9 20 6Z" fill="#e2a04a"/></svg>` },
  { caption: "our ritual", colour: "#e8cfe0", art: `<svg viewBox="0 0 40 40"><path d="M8 26l8-12 4 6 4-6 8 12Z" fill="#d9573f"/></svg>` },
  { caption: "lazy sunday", colour: "#c9d9e8", art: `<svg viewBox="0 0 40 40"><rect x="13" y="8" width="14" height="24" rx="3" fill="${ink}"/><rect x="15" y="11" width="10" height="16" fill="#7cf0b0"/></svg>` },
  { caption: "the room", colour: "#f0c7a8", art: `<svg viewBox="0 0 40 40"><path d="M6 32V16h28v16Z" fill="#a9764e"/><path d="M12 32V22h6v10Z" fill="#6f9fd8"/></svg>` },
  { caption: "my stuff", colour: "#e9c24a", art: `<svg viewBox="0 0 40 40"><rect x="10" y="12" width="20" height="16" rx="4" fill="#6f9fd8"/><circle cx="16" cy="18" r="3" fill="#e07aa6"/><path d="M22 22l3-6 3 6Z" fill="#fbf6ee"/></svg>` },
  { caption: "plants", colour: "#dcf3c8", art: `<svg viewBox="0 0 40 40"><path d="M14 26h12l-2 8h-8Z" fill="#c0577a"/><path d="M20 26Q12 18 12 10Q20 14 20 24ZM20 26Q28 18 28 10Q20 14 20 24Z" fill="#5f9a5c"/></svg>` },
  { caption: "spot it", colour: "#fbf6ee", art: `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="11" fill="none" stroke="#d9573f" stroke-width="3"/></svg>` },
  { caption: "watch party", colour: "#3b3a5c", art: `<svg viewBox="0 0 40 40"><rect x="6" y="10" width="28" height="18" rx="2" fill="#f2a1b8"/><path d="M14 34h12" stroke="#fbf6ee" stroke-width="2"/></svg>` },
  { caption: "my shelf", colour: "#c9d9e8", art: `<svg viewBox="0 0 40 40"><path d="M4 28h32v4H4Z" fill="#a9764e"/><circle cx="12" cy="22" r="6" fill="#26252f"/><rect x="22" y="12" width="8" height="16" fill="#2f7f7a"/></svg>` },
  { caption: "a letter", colour: "#fbf6ee", art: `<svg viewBox="0 0 40 40"><path d="M6 12h28v18H6Z" fill="#f3dfa2"/><path d="M6 12l14 10 14-10" stroke="${ink}" stroke-width="1.5" fill="none"/></svg>` },
  { caption: "the votes", colour: "#9c8ad0", art: `<svg viewBox="0 0 40 40">${[10, 20, 30].map((x) => `<circle cx="${x}" cy="20" r="5" fill="#fbf6ee"/>`).join("")}</svg>` },
  { caption: "swap night", colour: "#f3dfa2", art: `<svg viewBox="0 0 40 40"><circle cx="14" cy="20" r="8" fill="#e2a04a"/><rect x="22" y="10" width="12" height="20" rx="2" fill="#6f9fd8"/></svg>` },
  { caption: "our code", colour: "#e07aa6", art: `<svg viewBox="0 0 40 40"><text x="20" y="25" text-anchor="middle" font-size="11" fill="#fbf6ee" font-family="inherit">SNAP</text></svg>` },
];
