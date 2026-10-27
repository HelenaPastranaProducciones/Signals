# Code review of the original prototype

This reviews `signals-game.html` (first commit): a single 216-line file with
all the HTML, CSS and JS. Each finding says what was wrong, how it showed up,
and what changed in the restructure.

## Bugs

| # | Finding | Impact | Resolution |
|---|---------|--------|------------|
| 1 | Every click rebuilt the page with `innerHTML`, which reset the scroll of `<main>`. | In the avatar editor on a narrow window, picking an option jumped back to the top (measured: scrollTop 416 → 0). | `render()` keeps the scroll position while the view stays the same. |
| 2 | The same full re-render destroyed the focused element. | Keyboard users lost their place after every action (focus fell back to `<body>`). | `render()` re-focuses the same `data-action` button after rebuilding. |
| 3 | The avatar SVG used fixed ids (`sh`, `sd`, `sc`) for its gradients and clip path. | With two avatars on screen, both point at the first one's gradients. Levels 1, 3 and 9 need several avatars. | Each `renderAvatar()` call gets unique ids. |
| 4 | The nickname field stripped `< > " &` while typing, without updating the input. | The field and the state disagreed. Saved or remote names would still be injected without escaping. | Keep what the player types; escape on output with `escapeHtml()`. A blank name falls back to "Player". |
| 5 | Fullscreen used `try/catch` around `requestFullscreen()`, which returns a promise. | Refusals became unhandled rejections; on iOS Safari the method doesn't exist and throws. | `toggleFullscreen()` uses optional chaining and `.catch()`. |
| 6 | "Reset progress" wiped everything in one click. | Easy to lose progress by accident (it matters more once progress is saved). | Needs a second click ("Click again to reset"); any other action cancels it. |
| 7 | Esc did nothing on the level loading screen. | Inconsistent with Esc leaving a level. | Esc on the level loading screen returns to the map and cancels the timer. |

## Maintainability

| # | Finding | Resolution |
|---|---------|------------|
| 8 | Everything in one file, written in a minified style: one-letter globals and helpers (`S`, `A`, `C`, `LV`, `K`, `L`, `P`, `PS`, `un`, `go`, `av`…). | Split into ES modules by responsibility (`data/`, `game/`, `avatar/`, `ui/`, `styles/`) with descriptive names. |
| 9 | Data stored as positional arrays (`l[3]`, `o[2]`, `c[2]`). | Objects with named fields (`level.closingLine`, `option.unlockLevel`). |
| 10 | `av()` was a 70-line chain of `if (x === "...")` per piece. | One drawer table per category in `render-avatar.js`. A test checks every catalog option has a drawer. |
| 11 | Dead code: `homeOld()`, unused CSS (`nav`, `.grid`, `.modal`, `.sheet`, `select`) and mobile rules overridden later in the same file (`#app`, `main`, `.lv`). | Removed, and the overrides merged into one rule each. |
| 12 | Layout set with inline `style` attributes in templates. | Moved into CSS classes. Only data-driven colours stay inline. |
| 13 | Player progress and UI state mixed in one object `S`; theme override kept only on the DOM. | `state.progress` (to be saved, includes the theme) and `state.ui` (never saved). |
| 14 | Cryptic action attributes (`data-a="sub"`, `data-k`, `data-v`, `data-n`). | `data-action="lobby-view"`, `data-key`, `data-value`, `data-level`. |
| 15 | No tests beyond a one-off check that avatar pieces draw. | 25 `node:test` tests: data integrity, unlock table vs the brief, avatar rendering, progress rules, screen rendering, escaping. |

## Accessibility

| # | Finding | Resolution |
|---|---------|------------|
| 16 | Level tiles, avatar options, category tabs and On/Off toggles didn't expose their state. | `aria-label` on tiles ("Signal 4: Claw Machine, locked"), `aria-pressed` on options, tabs and toggles, `aria-disabled` and a descriptive label on locked pieces, `role="progressbar"` on progress bars. |

## Left as is (tracked in CLAUDE.md, pending work)

- Sound and vibration toggles still do nothing.
- Progress is not saved between sessions. `state.progress` is ready to be persisted.
- The font comes from Google Fonts; a desktop build that must work offline needs it self-hosted.
- The global `innerHTML` render is fine for menus. Real-time minigames should
  manage their own container instead of going through `render()`.

## How the restructure was verified

- **Avatar output:** the new `renderAvatar()` was compared with the original
  `av()` on every single option plus 3,000 random combinations. All 3,117
  SVGs are byte-identical once ids are normalised. Catalog, default avatar
  and unlock texts are identical too.
- **Screens:** 12 screenshots of the full flow (title, intro, map, level
  loading, level, completion, lobby, avatar editor, options, dark theme) are
  pixel-identical to the original at 1200×800. At 400×800 they are also
  identical, except the avatar editor, which now keeps its scroll position
  (bug 1).
- **Behaviour:** a browser script checked navigation, the timers, Esc, locked
  pieces, nickname escaping, scroll/focus retention, reset confirmation, the
  theme switch, and that no console errors appear.
