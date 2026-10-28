import { test } from "node:test";
import assert from "node:assert/strict";
import { AVATAR_CATEGORIES, DEFAULT_AVATAR } from "../src/data/avatar-catalog.js";
import { DRAWERS, renderAvatar } from "../src/avatar/render-avatar.js";

/** Throws if the markup's tags don't nest properly. */
function assertWellFormed(svg) {
  const stack = [];
  for (const [, closing, name, selfClosing] of svg.matchAll(/<(\/?)([a-zA-Z]+)[^>]*?(\/?)>/g)) {
    if (selfClosing) continue;
    if (closing) assert.equal(stack.pop(), name, `unexpected </${name}>`);
    else stack.push(name);
  }
  assert.deepEqual(stack, [], "unclosed tags");
}

/** Removes the per-instance id prefix so two renders can be compared. */
const withoutIds = (svg) => svg.replace(/avatar-\d+-/g, "");

test("every option of every category renders valid SVG", () => {
  for (const category of AVATAR_CATEGORIES) {
    for (const option of category.options) {
      const svg = renderAvatar({ ...DEFAULT_AVATAR, [category.key]: option.id });
      const where = `${category.key} = ${option.id}`;
      assert.ok(svg.startsWith("<svg") && svg.endsWith("</svg>"), where);
      assert.doesNotMatch(svg, /undefined|NaN|\[object/, where);
      assertWellFormed(svg);
    }
  }
});

test("every style option has a drawer, except the ones without one", () => {
  // "none" and the plain tee draw nothing extra; "blush" enlarges the cheeks instead.
  const withoutDrawer = new Set(["none", "tee", "blush"]);
  for (const [key, tables] of Object.entries(DRAWERS)) {
    const category = AVATAR_CATEGORIES.find((c) => c.key === key);
    for (const option of category.options) {
      const drawn = tables.some((table) => option.id in table);
      assert.equal(drawn, !withoutDrawer.has(option.id), `${key} = ${option.id}`);
    }
  }
});

test("each option in a category looks different", () => {
  // Striped top so the accent colour is visible too.
  const base = { ...DEFAULT_AVATAR, top: "stripes" };
  for (const category of AVATAR_CATEGORIES) {
    const renders = category.options.map((option) => withoutIds(renderAvatar({ ...base, [category.key]: option.id })));
    assert.equal(new Set(renders).size, renders.length, category.key);
  }
});

test("each render uses its own gradient ids", () => {
  const ids = (svg) => [...svg.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]);
  const first = ids(renderAvatar(DEFAULT_AVATAR));
  const second = ids(renderAvatar(DEFAULT_AVATAR));
  assert.equal(first.length, 3);
  assert.equal(first.filter((id) => second.includes(id)).length, 0);
});

test("an avatar can be drawn without its backdrop card", () => {
  assert.match(renderAvatar(DEFAULT_AVATAR), /<rect width="200" height="220"/);
  assert.doesNotMatch(renderAvatar(DEFAULT_AVATAR, { backdrop: false }), /<rect width="200" height="220"/);
});
