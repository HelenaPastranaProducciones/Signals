/**
 * Small SVG string builders used by the avatar layers.
 *
 * The clay look comes from two radial gradients painted over a shape:
 * `light` (white highlight at the top left) and `shade` (dark rim). Their ids
 * are prefixed per avatar so several avatars can share a page.
 *
 * @param {string} id Unique prefix for the gradient and clip-path ids.
 */
export function createSvgKit(id) {
  const ids = { light: `${id}-light`, shade: `${id}-shade`, bodyClip: `${id}-body` };

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

  return { ids, path, light, shade, clay, stroke, circle, star };
}
