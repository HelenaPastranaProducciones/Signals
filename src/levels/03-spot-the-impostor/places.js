import { createSvgKit } from "../../avatar/svg-kit.js";
import { pick, randomBetween, randomInt } from "../../engine/random.js";

/**
 * Where each tribe hangs out, drawn as one backdrop that fills the stage:
 * a wall or sky at the back and a floor in perspective (from about 45% of
 * the height down). Each call draws a slightly different version.
 *
 * Drawing units: 1000 × 600, the floor starts at y = 270.
 */

const kit = createSvgKit("level-03-places");
const FLOOR = 270;

const wrap = (body) =>
  `<svg class="place-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${kit.defs()}${body}</svg>`;

/** Floor with a soft gradient towards the back. */
const floor = (near, far) =>
  `<defs><linearGradient id="level-03-floor-${near.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${far}"/><stop offset="1" stop-color="${near}"/></linearGradient></defs>` +
  `<rect y="${FLOOR}" width="1000" height="${600 - FLOOR}" fill="url(#level-03-floor-${near.slice(1)})"/>`;

const PLACES = {
  skaters: () => {
    const ramps = [randomInt(60, 160), randomInt(760, 860)];
    return wrap(
      `<rect width="1000" height="${FLOOR}" fill="#bcd8ff"/><rect y="${FLOOR - 120}" width="1000" height="120" fill="#d7e3f5"/>` +
      [80, 300, 520, 740].map((x) => `<ellipse cx="${x + randomInt(-30, 30)}" cy="${randomInt(50, 110)}" rx="70" ry="20" fill="#fff" opacity=".8"/>`).join("") +
      floor("#c9c3d6", "#b4aec4") +
      kit.clay(`M${ramps[0] - 90} ${FLOOR + 10}Q${ramps[0] + 40} ${FLOOR + 10} ${ramps[0] + 70} ${FLOOR - 110}H${ramps[0] + 100}V${FLOOR + 10}Z`, "#a9a3c2") +
      kit.clay(`M${ramps[1] + 90} ${FLOOR + 10}Q${ramps[1] - 40} ${FLOOR + 10} ${ramps[1] - 70} ${FLOOR - 110}H${ramps[1] - 100}V${FLOOR + 10}Z`, "#a9a3c2") +
      `<rect x="360" y="${FLOOR - 40}" width="280" height="8" rx="4" fill="#ff8a3c"/><rect x="380" y="${FLOOR - 32}" width="6" height="40" fill="#5b5f7a"/><rect x="614" y="${FLOOR - 32}" width="6" height="40" fill="#5b5f7a"/>` +
      [0, 1, 2, 3].map((i) => `<circle cx="${180 + i * 210 + randomInt(-20, 20)}" cy="${FLOOR - 70 + randomInt(-10, 10)}" r="${randomInt(14, 22)}" fill="${pick(["#ff7ab0", "#7fe3c0", "#ffe36b", "#9fc4ff"])}" opacity=".7"/>`).join(""),
    );
  },
  gamers: () => wrap(
    `<rect width="1000" height="${FLOOR}" fill="#2d2350"/>` +
    `<rect y="34" width="1000" height="6" fill="#ff5fa8" opacity=".8"/><rect y="44" width="1000" height="3" fill="#5fd8ff" opacity=".6"/>` +
    Array.from({ length: 5 }, (_, i) => {
      const x = 40 + i * 195 + randomInt(-10, 10);
      const glow = pick(["#5fd8ff", "#b6ff5f", "#ff5fa8", "#c48bff"]);
      return `<rect x="${x}" y="${FLOOR - 150}" width="150" height="92" rx="10" fill="#14102a"/>` +
        `<rect x="${x + 8}" y="${FLOOR - 142}" width="134" height="76" rx="6" fill="${glow}" opacity=".85"/>` +
        `<rect x="${x + 20}" y="${FLOOR - 130}" width="${randomInt(40, 90)}" height="10" rx="5" fill="#fff" opacity=".6"/>` +
        `<rect x="${x + 66}" y="${FLOOR - 58}" width="18" height="30" fill="#14102a"/><rect x="${x - 10}" y="${FLOOR - 30}" width="170" height="16" rx="6" fill="#4a3d7a"/>`;
    }).join("") +
    floor("#4a3d7a", "#3a2f62"),
  ),
  otakus: () => wrap(
    `<rect width="1000" height="${FLOOR}" fill="#ffe3ef"/>` +
    [0, 1, 2].map((row) => `<rect x="20" y="${60 + row * 70}" width="960" height="10" rx="4" fill="#e8a8c8"/>` +
      Array.from({ length: 14 }, (_, i) => `<rect x="${40 + i * 68 + randomInt(-4, 4)}" y="${60 + row * 70 - randomInt(30, 48)}" width="${randomInt(22, 40)}" height="${randomInt(30, 48)}" rx="5" fill="${pick(["#ff7ab0", "#9fc4ff", "#ffe36b", "#a8e6a1", "#c9b6f2", "#ffb38a"])}"/>`).join("")).join("") +
    [150, 500, 850].map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="20" stroke="#c97ad9" stroke-width="2"/>` + kit.clay(`M${x} 20a22 26 0 1 0 .1 0Z`, "#ff6f91")).join("") +
    floor("#f6d8ea", "#eec2da"),
  ),
  punks: () => wrap(
    `<rect width="1000" height="${FLOOR}" fill="#7a3f4a"/>` +
    Array.from({ length: 9 }, (_, row) => Array.from({ length: 21 }, (_, i) =>
      `<rect x="${i * 50 - (row % 2) * 25}" y="${row * 30}" width="46" height="26" rx="3" fill="#8e4a56"/>`).join("")).join("") +
    Array.from({ length: 4 }, (_, i) => `<rect x="${90 + i * 230 + randomInt(-20, 20)}" y="${randomInt(60, 110)}" width="${randomInt(70, 100)}" height="${randomInt(90, 120)}" rx="4" fill="${pick(["#ffe36b", "#ff5fa8", "#f4f4f6", "#5fd8ff"])}" transform="rotate(${randomBetween(-6, 6).toFixed(1)} ${140 + i * 230} 120)"/>`).join("") +
    `<path d="M0 30Q250 70 500 30T1000 30" fill="none" stroke="#2b2233" stroke-width="2"/>` +
    Array.from({ length: 12 }, (_, i) => `<circle cx="${40 + i * 84}" cy="${44 + Math.sin(i * 1.3) * 10}" r="7" fill="${pick(["#ffe36b", "#ff5fa8", "#b6ff5f"])}"/>`).join("") +
    floor("#5b5266", "#4a4256"),
  ),
  posh: () => wrap(
    `<rect width="1000" height="${FLOOR}" fill="#fff4e0"/>` +
    Array.from({ length: 20 }, (_, i) => `<path d="M${i * 50} 40h50v40q-25 20-50 0Z" fill="${i % 2 ? "#ffffff" : pick(["#5aa9ff", "#ff7ab0", "#4fbf8f"])}"/>`).join("") +
    `<rect y="34" width="1000" height="10" fill="#e6d2b0"/>` +
    [120, 880].map((x) => kit.clay(`M${x - 30} ${FLOOR - 70}h60l-8 70h-44Z`, "#f2b8c6") + kit.clay(`M${x} ${FLOOR - 160}a50 50 0 1 0 .1 0Z`, "#7bd389")).join("") +
    [330, 670].map((x) => kit.clay(`M${x - 60} ${FLOOR - 50}h120v10h-120Z`, "#fff") + `<rect x="${x - 4}" y="${FLOOR - 40}" width="8" height="50" fill="#c9b6a0"/>`).join("") +
    floor("#f2e2c8", "#e8d4b4"),
  ),
  sporty: () => wrap(
    `<rect width="1000" height="${FLOOR}" fill="#cfe4ff"/>` +
    `<rect y="${FLOOR - 60}" width="1000" height="60" fill="#9fc4ff"/>` +
    Array.from({ length: 30 }, (_, i) => `<circle cx="${i * 34 + 10}" cy="${FLOOR - 40 + (i % 2) * 14}" r="9" fill="${pick(["#ff7ab0", "#ffe36b", "#7fe3c0", "#ff8a3c", "#c9b6f2"])}" opacity=".85"/>`).join("") +
    `<rect x="${randomInt(780, 860)}" y="40" width="12" height="${FLOOR - 40}" fill="#5b5f7a"/>` +
    floor("#4f8fe8", "#3d74c8") +
    `<path d="M0 ${FLOOR + 120}H1000M500 ${FLOOR}V600" stroke="#fff" stroke-width="5" opacity=".75"/><ellipse cx="500" cy="${FLOOR + 120}" rx="110" ry="36" fill="none" stroke="#fff" stroke-width="5" opacity=".75"/>`,
  ),
};

/** The backdrop for a tribe's place. @param {string} tribeId */
export const place = (tribeId) => (PLACES[tribeId] || PLACES.skaters)();
