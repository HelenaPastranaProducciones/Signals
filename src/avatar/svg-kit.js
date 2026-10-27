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
