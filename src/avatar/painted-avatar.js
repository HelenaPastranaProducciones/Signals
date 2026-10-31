/**
 * The avatar (Helena, 31/10/2026): a hand-painted teen, like a 2D animated
 * series, instead of the clay toy, which looked too childish for teens. Same
 * choices as the editor (skin, hair, clothes…). renderAvatar() in
 * render-avatar.js draws with this everywhere (title, lobby, editor, chats).
 *
 * The painted look comes from an SVG filter: edges slightly wobbly (a small
 * displacement) and a grain on top, plus flat "cel" shading on one side of
 * every piece instead of soft clay gradients. Proportions are older than the
 * toy: smaller head, long thin arms and legs.
 */

let count = 0;

/** Mixes a colour towards a warm grey, so the palette feels painted, not plastic. */
function mute(hex, amount = 0.16) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const grey = [176, 160, 146];
  return `rgb(${[r, g, b].map((c, i) => Math.round(c + (grey[i] - c) * amount)).join(",")})`;
}

/** A darker version of a colour, for lines and shadows. */
function dark(hex, amount = 0.35) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgb(${[r, g, b].map((c) => Math.round(c * (1 - amount))).join(",")})`;
}

/**
 * @param {Record<string, string>} a  Avatar choices (same keys as the editor).
 * @param {{ pose?: "down" | "hips" | "wave", bottoms?: "jeans" | "shorts" | "skirt" | "cargo", crop?: "full" | "bust" | "head", backdrop?: boolean, label?: string }} [options]
 *   `backdrop: true` adds the coloured card behind the avatar (its `bg`).
 */
export function paintedAvatar(a, options = {}) {
  const p = paintedPieces(a, options);
  const viewBox = VIEW[options.crop] || VIEW.full;
  const backdrop = options.backdrop ? `<rect class="backdrop" x="-11" y="-27" width="222" height="444" rx="40" fill="${a.bg}"/><circle cx="100" cy="190" r="110" fill="#fff" opacity=".3"/>` : "";
  return `<svg class="avatar painted" viewBox="${viewBox}" role="img" aria-label="${options.label || "Avatar"}">${p.defs}${backdrop}${p.clip}<g filter="url(#${p.id}-paint)">` +
    p.shadow + p.backHair + p.lower + p.neck + p.top + p.arms + p.acc + p.head + `</g></svg>`;
}

/**
 * The painted avatar in separate pieces, so a level can pose it its own way
 * (level 2's band draws its own arms and instruments around these). Drawing
 * units: 200 wide, head centred on (100, 88), shoulders at y 160, feet at y 410.
 * Wrap the pieces in `<g filter="url(#${id}-paint)">` with `defs` and `clip` in the svg.
 *
 * @param {Record<string, string>} a
 * @param {{ pose?: "down" | "hips" | "wave", bottoms?: "jeans" | "shorts" | "skirt" | "cargo", trousers?: string, shoes?: string }} [options]
 *   `trousers` and `shoes` are colours, for levels that dress people their own way.
 */
export function paintedPieces(a, options = {}) {
  const id = `avatar-${++count}`;
  // The paint texture depends on the look, not on the drawing order, so the same avatar always looks the same.
  const seed = [...Object.values(a).join("")].reduce((sum, c) => (sum * 31 + c.charCodeAt(0)) % 997, 7);
  const pose = options.pose || "down";
  const bottoms = a.top === "overalls" ? "overalls" : options.bottoms || "jeans";
  const skin = mute(a.skin, 0.1);
  const skinDark = dark(a.skin, 0.22);
  const hair = mute(a.hairC, 0.12);
  const hairDark = dark(a.hairC, 0.35);
  const top = mute(a.topC);
  const accent = mute(a.acC);
  const ink = "#2b2630";

  // Every piece: flat colour plus a hard-edged shadow on its right side.
  const piece = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" ${extra}/><path d="${d}" fill="url(#${id}-cel)" ${extra}/>`;
  const line = (d, colour, width) => `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const limb = (d, colour, width) => line(d, colour, width) + `<path d="${d}" fill="none" stroke="#3a1e2a" stroke-opacity=".12" stroke-width="${width}" stroke-linecap="round" transform="translate(2 0)" />`;

  const defs = `<defs>
    <linearGradient id="${id}-cel" x1="0" x2="1"><stop offset=".6" stop-color="#3a1e2a" stop-opacity="0"/><stop offset=".6" stop-color="#3a1e2a" stop-opacity=".16"/></linearGradient>
    <filter id="${id}-paint" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="${seed}" result="warp"/>
      <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="rough"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${seed + 7}" result="noise"/>
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 .16  0 0 0 0 .1  0 0 0 0 .14  1.1 0 0 0 -.52" result="specks"/>
      <feComposite in="specks" in2="rough" operator="in" result="grain"/>
      <feMerge><feMergeNode in="rough"/><feMergeNode in="grain"/></feMerge>
    </filter>
  </defs>`;

  // ---- Arms (shoulders at y 160, hands down at y ~262) ----
  const arms = {
    down: ["M66 164Q54 210 58 258", "M134 164Q146 210 142 258"],
    hips: ["M66 164Q36 200 72 236", "M134 164Q164 200 128 236"],
    wave: ["M66 164Q54 210 58 258", "M134 164Q170 140 164 96"],
  }[pose];
  const hands = { down: [[58, 262], [142, 262]], hips: [[74, 238], [126, 238]], wave: [[58, 262], [164, 90]] }[pose];
  const armsSvg = arms.map((d) => limb(d, skin, 11)).join("");
  const handsSvg = hands.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7.5" fill="${skin}"/>`).join("");
  const sleeveLen = a.top === "hoodie" ? 1 : 0.38;
  const sleeves = arms.map((d) => `<path d="${d}" fill="none" stroke="${top}" stroke-width="17" stroke-linecap="round" pathLength="1" stroke-dasharray="${sleeveLen} 2"/>`).join("");

  // ---- Legs and bottoms (hips at y 250, feet at y 398) ----
  const legs = limb("M88 250L86 392", skin, 12) + limb("M112 250L114 392", skin, 12);
  const denim = options.trousers ? mute(options.trousers, 0.08) : mute(pick(a.acC === "#2a2b3d" ? ["#2a2b3d"] : ["#4b6c9e", "#2e3a52", "#6d7f99"], a.skin), 0.05);
  const BOTTOMS = {
    jeans: piece("M70 244L130 244L136 380L108 382L101 292L93 382L64 380Z", denim) + line("M101 252V290", dark("#4b6c9e", 0.5), 1.5),
    cargo: piece("M68 244L132 244L138 380L108 382L101 292L93 382L62 380Z", options.trousers ? denim : mute("#8a8a5c")) + piece("M66 300h16v22h-16Z", mute("#77774c")) + piece("M118 300h16v22h-16Z", mute("#77774c")),
    shorts: piece("M70 244L130 244L134 304L104 306L100 278L96 306L66 304Z", denim),
    skirt: piece("M74 244L126 244L142 314Q100 324 58 314Z", options.trousers ? denim : mute(a.acC === "#ffffff" ? "#2a2b3d" : a.acC)),
    overalls: piece("M70 244L130 244L136 380L108 382L101 292L93 382L64 380Z", top),
  };
  const socks = bottoms === "shorts" || bottoms === "skirt" ? piece("M80 360h12v30h-12Z", "#f1ece4") + piece("M108 360h12v30h-12Z", "#f1ece4") : "";
  const shoeColour = mute(options.shoes || a.hatC || "#e8503a");
  const shoes = piece("M64 400Q62 386 78 386L90 386Q98 390 98 400Q98 408 80 408Q64 408 64 400Z", shoeColour) +
    piece("M102 400Q102 390 110 386L122 386Q138 386 136 400Q136 408 120 408Q102 408 102 400Z", shoeColour) +
    line("M64 404Q80 410 98 404", "#f1ece4", 3) + line("M102 404Q120 410 136 404", "#f1ece4", 3);

  // ---- Torso and top ----
  const body = "M76 150Q100 144 124 150Q136 154 136 168L130 252L70 252L64 168Q64 154 76 150Z";
  let topSvg = piece(body, a.top === "overalls" ? "#f1ece4" : top);
  if (a.top === "stripes") topSvg += `<g clip-path="url(#${id}-body)">${[170, 190, 210, 230, 250].map((y) => `<rect x="60" y="${y}" width="80" height="8" fill="${accent}" opacity=".9"/>`).join("")}</g>`;
  if (a.top === "band") topSvg += `<circle cx="100" cy="196" r="17" fill="${accent}" opacity=".9"/>` + line("M92 196l6 6l10-12", ink, 3);
  if (a.top === "jersey") topSvg += `<text x="100" y="214" text-anchor="middle" font-family="Shantell Sans, sans-serif" font-weight="800" font-size="34" fill="${accent}">${7 + (a.skin.charCodeAt(2) % 20)}</text>`;
  if (a.top === "hoodie") topSvg += piece("M80 150Q100 168 120 150Q112 142 100 142Q88 142 80 150Z", dark(a.topC, 0.2)) + line("M94 156V182M106 156V182", "#f1ece4", 2) + piece("M80 218h40v22h-40Z", dark(a.topC, 0.12));
  if (a.top === "overalls") topSvg += piece("M78 196h44v58h-44Z", top) + line("M80 198L74 152M120 198L126 152", top, 6) + `<circle cx="82" cy="202" r="3" fill="${accent}"/><circle cx="118" cy="202" r="3" fill="${accent}"/>`;
  if (a.top === "tee") topSvg += line("M88 152Q100 160 112 152", dark(a.topC, 0.3), 2);
  const neck = piece("M92 124h16v30h-16Z", skinDark);

  const ACC = {
    chain: line("M84 154Q100 182 116 154", "#e2b545", 3),
    pearls: line("M84 154Q100 178 116 154", "#f4efe6", 5),
    scarf: piece("M78 146Q100 164 122 146L124 160Q100 176 76 160Z", accent) + piece("M106 160h12v40h-12Z", accent),
    phones: line("M72 156Q100 176 128 156", ink, 5) + piece("M64 146h14v20h-14Z", ink) + piece("M122 146h14v20h-14Z", ink),
    bag: line("M74 152L126 236", dark(a.acC, 0.4), 4) + piece("M114 226h26v22h-26Z", accent),
    cassette: line("M80 152L100 196L120 152", ink, 2) + piece("M88 196h24v16h-24Z", accent),
    camera: line("M80 152L100 196L120 152", ink, 2) + piece("M86 194h28v20h-28Z", "#f1ece4") + `<circle cx="100" cy="204" r="5" fill="${ink}"/>`,
  };

  // ---- Head (centre 100,88) ----
  const headD = "M60 86C60 52 78 38 100 38C122 38 140 52 140 86C140 116 124 136 100 136C76 136 60 116 60 86Z";
  const ears = `<circle cx="60" cy="94" r="9" fill="${skin}"/><circle cx="140" cy="94" r="9" fill="${skinDark}"/>`;
  const earrings = { hoops: line("M58 104a5 5 0 1 0 0.1 0", "#e2b545", 2.5) + line("M142 104a5 5 0 1 0 0.1 0", "#e2b545", 2.5), studs: `<circle cx="59" cy="103" r="2.6" fill="#f4efe6"/><circle cx="141" cy="103" r="2.6" fill="#f4efe6"/>`, gems: `<circle cx="59" cy="103" r="3" fill="#7fe3c0"/><circle cx="141" cy="103" r="3" fill="#7fe3c0"/>` }[a.ear] || "";

  const look = (a.skin.charCodeAt(3) % 3) - 1; // where the pupils look
  const EYES = {
    dots: eyePair((x) => `<ellipse cx="${x}" cy="92" rx="10" ry="12" fill="#fbf8f2"/><ellipse cx="${x + 2 + look * 2}" cy="94" rx="5.5" ry="7" fill="${ink}"/><circle cx="${x + 4 + look * 2}" cy="90" r="1.8" fill="#fff"/>`),
    sparkle: eyePair((x) => `<ellipse cx="${x}" cy="92" rx="10" ry="12" fill="#fbf8f2"/><ellipse cx="${x + 1}" cy="94" rx="6.5" ry="8" fill="${ink}"/><circle cx="${x + 3}" cy="90" r="2.4" fill="#fff"/><circle cx="${x - 1}" cy="97" r="1.2" fill="#fff"/>`),
    sleepy: eyePair((x) => `<ellipse cx="${x}" cy="94" rx="10" ry="9" fill="#fbf8f2"/><ellipse cx="${x + 1}" cy="96" rx="5" ry="5.5" fill="${ink}"/>` + piece(`M${x - 12} 94Q${x} 80 ${x + 12} 94Z`, skin)),
    happy: eyePair((x) => line(`M${x - 8} 96Q${x} 84 ${x + 8} 96`, ink, 3.5)),
  };
  const brows = line(`M74 ${pose === "wave" ? 72 : 76}Q82 70 90 74`, hairDark, 4) + line("M110 74Q118 70 126 75", hairDark, 4);
  const nose = line("M100 100Q95 108 101 110", skinDark, 2.5);
  const MOUTHS_DRAWN = {
    smile: line("M88 118Q100 127 112 118", "#7a2e34", 3),
    grin: piece("M86 116Q100 116 114 116Q112 132 100 132Q88 132 86 116Z", "#6b2430") + piece("M90 117h20v5h-20Z", "#fbf8f2"),
    smirk: line("M90 120Q102 124 112 114", "#7a2e34", 3),
    tongue: piece("M86 116Q100 116 114 116Q112 132 100 132Q88 132 86 116Z", "#6b2430") + `<ellipse cx="100" cy="128" rx="7" ry="4" fill="#e8768a"/>`,
    oh: `<ellipse cx="100" cy="122" rx="5" ry="6.5" fill="#6b2430"/>`,
  };
  const FACE = {
    freckles: [[78, 108], [84, 112], [74, 113], [120, 108], [126, 112], [116, 113]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="${skinDark}"/>`).join(""),
    stripes: line("M70 104l10 2M70 110l10 2", accent, 2.5) + line("M130 104l-10 2M130 110l-10 2", accent, 2.5),
    star: piece("M122 100l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8Z", "#e9b03b"),
    bandaid: piece("M68 102l14-4l3 8l-14 4Z", "#f1d7b6"),
  };
  const blush = `<ellipse cx="74" cy="110" rx="8" ry="5" fill="#e8768a" opacity="${a.face === "blush" ? 0.55 : 0.28}"/><ellipse cx="126" cy="110" rx="8" ry="5" fill="#e8768a" opacity="${a.face === "blush" ? 0.55 : 0.28}"/>`;

  // ---- Hair: one shape behind the head and one in front ----
  const BACK = {
    long: "M56 86C50 38 80 26 100 26C122 26 152 38 144 86L150 196Q126 206 100 200Q74 206 50 196Z",
    bob: "M54 88C50 40 80 26 100 26C122 26 150 40 146 88L148 140Q124 148 100 144Q76 148 52 140Z",
    afro: bumps(100, 78, 64, 14),
    curls: bumps(100, 80, 54, 12),
    bun: "M84 24a16 16 0 1 0 32 0a16 16 0 1 0-32 0Z",
    buns: "M44 44a18 18 0 1 0 36 0a18 18 0 1 0-36 0ZM120 44a18 18 0 1 0 36 0a18 18 0 1 0-36 0Z",
  };
  const FRONT = {
    short: "M56 92C50 44 78 28 102 28C130 28 152 46 144 94C138 74 128 64 114 58C104 70 86 72 72 66C64 74 60 82 56 92Z",
    buzz: "M60 82C60 48 80 38 100 38C122 38 140 48 140 82C130 62 116 56 100 56C84 56 70 62 60 82Z",
    bob: "M54 104C48 46 78 26 102 26C128 26 152 46 146 104C140 82 134 70 124 62C110 72 92 68 80 60C70 72 60 86 54 104Z",
    long: "M54 104C48 46 78 26 102 26C128 26 152 46 146 104C140 82 134 70 124 62C110 72 92 68 80 60C70 72 60 86 54 104Z",
    bun: "M58 86C56 48 80 34 100 34C122 34 144 48 142 86C134 66 120 54 100 54C82 54 66 64 58 86Z",
    buns: "M58 86C56 48 80 34 100 34C122 34 144 48 142 86C134 66 120 54 100 54C82 54 66 64 58 86Z",
    curls: bumps(100, 52, 34, 10, Math.PI, 2 * Math.PI),
    afro: bumps(100, 50, 38, 11, Math.PI, 2 * Math.PI),
    mohawk: "M88 44Q90 6 100 -6Q110 6 112 44Q100 40 88 44Z",
  };
  const strands = a.hair === "long" || a.hair === "bob" ? line("M70 70Q62 110 66 150M130 70Q138 110 134 150M84 62Q76 90 74 110", hairDark, 2) : a.hair === "short" ? line("M84 40Q100 50 112 60M100 34Q118 44 128 62", hairDark, 2) : "";
  const backHair = BACK[a.hair] ? piece(BACK[a.hair], hair) : "";
  let frontHair = FRONT[a.hair] ? piece(FRONT[a.hair], hair) + strands : "";
  if (a.hair === "mohawk") frontHair = piece(FRONT.buzz, hairDark, 'opacity=".35"') + piece(FRONT.mohawk, hair);

  const HATS = {
    cap: piece("M58 72C58 36 80 26 100 26C120 26 142 36 142 72Z", mute(a.hatC)) + piece("M52 74Q100 60 150 74Q150 86 100 82Q52 86 52 74Z", dark(a.hatC, 0.15)),
    backcap: piece("M58 72C58 36 80 26 100 26C120 26 142 36 142 72Z", mute(a.hatC)) + piece("M84 68h32v8h-32Z", dark(a.hatC, 0.2)),
    beanie: piece("M56 78C56 30 80 18 100 18C120 18 144 30 144 78Z", mute(a.hatC)) + piece("M54 64h92v16h-92Z", dark(a.hatC, 0.15)) + `<circle cx="100" cy="16" r="8" fill="${mute(a.hatC)}"/>`,
    bucket: piece("M62 66C62 34 82 26 100 26C118 26 138 34 138 66Z", mute(a.hatC)) + piece("M44 72Q100 52 156 72L150 82Q100 70 50 82Z", dark(a.hatC, 0.12)),
    bandana: piece("M58 64Q100 44 142 64L142 76Q100 60 58 76Z", mute(a.hatC)),
  };
  const PINS = {
    cat: piece("M62 54L66 18L90 40Z", hair) + piece("M138 54L134 18L110 40Z", hair),
    bow: piece("M118 40l14-10v20Z M118 40l-14-10v20Z", accent),
    flower: `<circle cx="126" cy="44" r="8" fill="${accent}"/><circle cx="126" cy="44" r="3" fill="#f1ece4"/>`,
    stars: piece("M124 38l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z", accent),
  };
  const GLASSES = {
    round: line("M70 92a12 12 0 1 0 24 0a12 12 0 1 0-24 0ZM106 92a12 12 0 1 0 24 0a12 12 0 1 0-24 0ZM94 90Q100 86 106 90", ink, 2.6),
    square: line("M68 82h26v20h-26ZM106 82h26v20h-26ZM94 90h12", ink, 2.6),
    sun: piece("M68 82h26v18q-13 6-26 0ZM106 82h26v18q-13 6-26 0Z", "#2b2630", 'opacity=".9"') + line("M94 88h12", ink, 2.6),
    shutter: line("M68 84h26M68 90h26M68 96h26M106 84h26M106 90h26M106 96h26", accent, 2.5),
    pixel: piece("M68 84h26v14h-26ZM106 84h26v14h-26Z", ink),
    hearts: piece("M81 100l-11-11a6 6 0 0 1 11-6a6 6 0 0 1 11 6ZM119 100l-11-11a6 6 0 0 1 11-6a6 6 0 0 1 11 6Z", "#e8506e"),
  };

  const head = ears + earrings + piece(headD, skin) + blush + (FACE[a.face] || "") + (EYES[a.eyes] || EYES.dots) + brows + nose + `<g class="mouth" style="transform-origin:100px 120px">${MOUTHS_DRAWN[a.mouth] || MOUTHS_DRAWN.smile}</g>` +
    frontHair + (HATS[a.hat] || "") + (PINS[a.pin] || "") + (GLASSES[a.gl] || "");

  return {
    id, defs,
    clip: `<clipPath id="${id}-body"><path d="${body}"/></clipPath>`,
    shadow: `<ellipse cx="100" cy="410" rx="56" ry="8" fill="#3a1e2a" opacity=".12"/>`,
    backHair,
    lower: legs + (BOTTOMS[bottoms] || BOTTOMS.jeans) + socks + shoes,
    neck,
    top: topSvg,
    arms: armsSvg + sleeves + handsSvg,
    acc: ACC[a.acc] || "",
    head,
    colours: { skin, top },
  };
}

/** How much of the figure each crop shows. */
const VIEW = { full: "-14 -30 228 450", bust: "20 -12 160 250", head: "36 0 128 150" };

/** Draws something at both eyes. */
function eyePair(draw) {
  return draw(82) + draw(118);
}

/** A cloud of round bumps around a centre: curly hair and afros. */
function bumps(cx, cy, r, n, from = 0, to = 2 * Math.PI) {
  const points = [];
  for (let i = 0; i <= n; i += 1) {
    const t = from + ((to - from) * i) / n;
    points.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
  }
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i += 1) {
    const [x, y] = points[i];
    d += `A${(r * 0.32).toFixed(1)} ${(r * 0.32).toFixed(1)} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d}Z`;
}

function pick(list, seed) {
  return list[(seed.charCodeAt(1) + seed.charCodeAt(4)) % list.length];
}
