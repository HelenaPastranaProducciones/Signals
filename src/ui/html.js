const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escapes text before putting it in markup (player input, saved data). */
export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ENTITIES[char]);

/** Two-digit level number, e.g. 7 → "07". */
export const pad = (number) => String(number).padStart(2, "0");
