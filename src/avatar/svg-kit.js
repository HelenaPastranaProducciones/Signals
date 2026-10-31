/**
 * Small SVG string builders for the vinyl/clay look, used by the avatar and
 * available to levels for their own art.
 *
 * The clay look comes from two radial gradients painted over a shape:
 * `light` (white highlight at the top left) and `shade` (dark rim). Put
 * `kit.defs()` inside every <svg> that uses `clay`, `light` or `shade`. Ids
 * are unique per kit, so several drawings can share a page.
 *
 * @example
 * const k = createSvgKit();
 * const svg = `<svg viewBox="0 0 100 100">${k.defs()}${k.clay("M10 50a40 40 0 1 0 80 0a40 40 0 1 0-80 0", "#ff7ab0")}</svg>`;
 *
 * @param {string} [id] Prefix for the gradient and clip-path ids (generated if omitted).
 */
export function createSvgKit(id = `svg-${++kitCount}`) {
  const ids = { light: `${id}-light`, shade: `${id}-shade`, bodyClip: `${id}-body` };

  /** Gradient definitions; `extra` is more markup to put inside <defs>. */
  const defs = (extra = "") =>
    `<defs><radialGradient id="${ids.light}" cx=".3" cy=".22" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${ids.shade}" cx=".5" cy=".45" r=".6"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>${extra}</defs>`;
  /** Plain filled path. `extra` is raw attributes, e.g. 'opacity=".2"'. */
  const path = (d, fill, extra) => `<path d="${d}" fill="${fill}" ${extra || ""}/>`;
  const light = (d) => `<path d="${d}" fill="url(#${ids.light})"/>`;
  const shade = (d) => `<path d="${d}" fill="url(#${ids.shade})"/>`;
  /** Filled path with the vinyl/clay shading on top. */
  const clay = (d, fill) => path(d, fill) + shade(d) + light(d);
  const stroke = (d, colour, width, extra) =>
    `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra || ""}/>`;
  /** `opacity` is passed as a string (".3") so the markup stays compact. */
  const circle = (x, y, r, fill, opacity) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${opacity ? ` opacity="${opacity}"` : ""}/>`;
  const star = (x, y, scale, fill) =>
    `<path transform="translate(${x} ${y}) scale(${scale})" d="M0-9L2.6-3 9-2.5 4 1.5 5.5 8 0 4.5-5.5 8-4 1.5-9-2.5-2.6-3Z" fill="${fill}" stroke="#fff" stroke-width="1.6"/>`;

  return { ids, defs, path, light, shade, clay, stroke, circle, star };
}

let kitCount = 0;

/**
 * The same helpers as `createSvgKit`, for the hand-painted look (Helena,
 * 31/10/2026): colours pulled a little towards a warm grey, and `clay` paints
 * a flat colour with a hard-edged shadow on its right side ("cel" shading)
 * instead of soft clay gradients. Wrap a drawing in
 * `<g filter="url(#${ids.paint})">` for wobbly edges and a paint grain (keep
 * that for small drawings: on big moving ones it costs too much).
 *
 * @param {string} [id]
 */
export function createPaintKit(id = `paint-${++kitCount}`) {
  const ids = { light: `${id}-light`, shade: `${id}-cel`, bodyClip: `${id}-body`, paint: `${id}-paint` };
  const seed = [...id].reduce((sum, c) => sum + c.charCodeAt(0), 0) % 97;

  const defs = (extra = "") =>
    `<defs><linearGradient id="${ids.shade}" x1="0" x2="1"><stop offset=".62" stop-color="#3a1e2a" stop-opacity="0"/><stop offset=".62" stop-color="#3a1e2a" stop-opacity=".16"/></linearGradient>` +
    `<filter id="${ids.paint}" x="-10%" y="-10%" width="120%" height="120%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="${seed}" result="warp"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="warp" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="rough"/>` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${seed + 7}" result="noise"/>` +
    `<feColorMatrix in="noise" type="matrix" values="0 0 0 0 .16  0 0 0 0 .1  0 0 0 0 .14  1.1 0 0 0 -.52" result="specks"/>` +
    `<feComposite in="specks" in2="rough" operator="in" result="grain"/>` +
    `<feMerge><feMergeNode in="rough"/><feMergeNode in="grain"/></feMerge></filter>${extra}</defs>`;
  const path = (d, fill, extra) => `<path d="${d}" fill="${paint(fill)}" ${extra || ""}/>`;
  // No glossy highlight in the painted look.
  const light = () => "";
  const shade = (d) => `<path d="${d}" fill="url(#${ids.shade})"/>`;
  const clay = (d, fill) => path(d, fill) + shade(d);
  const stroke = (d, colour, width, extra) =>
    `<path d="${d}" fill="none" stroke="${paint(colour)}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra || ""}/>`;
  const circle = (x, y, r, fill, opacity) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${paint(fill)}"${opacity ? ` opacity="${opacity}"` : ""}/>`;
  const star = (x, y, scale, fill) =>
    `<path transform="translate(${x} ${y}) scale(${scale})" d="M0-9L2.6-3 9-2.5 4 1.5 5.5 8 0 4.5-5.5 8-4 1.5-9-2.5-2.6-3Z" fill="${paint(fill)}"/>`;

  return { ids, defs, path, light, shade, clay, stroke, circle, star };
}

/** Pulls a #rrggbb colour a little towards a warm grey; anything else is kept. */
export function paint(colour, amount = 0.14) {
  if (!/^#[0-9a-f]{6}$/i.test(colour)) return colour;
  const grey = [176, 160, 146];
  return `#${[1, 3, 5].map((i, n) => {
    const c = parseInt(colour.slice(i, i + 2), 16);
    return Math.round(c + (grey[n] - c) * amount).toString(16).padStart(2, "0");
  }).join("")}`;
}
