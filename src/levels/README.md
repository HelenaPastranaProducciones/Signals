# How levels are built

Technical guide for building a level. (How to *work with Helena* on a level
is in `.claude/skills/level/SKILL.md`; read both.)

## One folder per level

```
src/levels/
  index.js                  The 19 levels in map order (imports each level.js)
  07-ritual-simon/
    README.md               The level's notebook: brief, agreed idea, progress (6 steps), decisions
    level.js                Texts, settings and the minigame (play function)
    level.css               The minigame's look (added in step 2)
    assets/                 Images or sounds for this level, if any
  _template/                Working example to copy from (not in the game)
src/mechanics/              Code shared by several levels (Match-3 for 6 & 17, odd one out for 3 & 18)
src/engine/                 The level engine: defineLevel, level runner, random helpers
```

Everything about a level stays in its folder, so a level can be refined on
its own without touching the others.

## What a level file looks like

```js
import { defineLevel } from "../../engine/define-level.js";

export default defineLevel({
  number: 7,
  signal: "Belonging comes from rituals",
  minigame: "Ritual Simon",
  explanation: "…shown on the loading screen…",
  closingLine: "We do it this way because we always have.",
  stylesheet: new URL("./level.css", import.meta.url).href,   // from step 2

  settings: {
    maxSequence: 6, // plain-language comment: what this number changes
  },

  play(game) {
    // draw into game.root, react to the player, call game.win() or game.lose("…")
  },
});
```

- **Without `play`**, the level shows the "Mini-game coming soon" card with a
  demo button, so the game stays playable while levels are built.
- **`settings`** hold every number that changes how the level feels (time,
  targets, speed, sizes). Read them in `play` through `game.settings`. Never
  bury such numbers in the code: when Helena says "it's too hard", the fix
  should be changing a setting.
- Texts the player reads are in English.

## The game toolbox

`play(game)` receives `game` (full types in `src/engine/level-runner.js`):

| Tool | What it does |
|------|--------------|
| `game.root` | The empty box (the stage) where the minigame draws itself. |
| `game.settings` | The level's settings. |
| `game.player` | `{ nickname, avatar }` of the player. |
| `game.avatar(avatar?, { label, backdrop, crop })` | SVG markup of an avatar (the player's by default): a full-body figure whose arms and legs can be animated; `backdrop: false` without its card, `crop: "head"` just the head. |
| `game.win()` | Ends the attempt as won: closing line, unlocked pieces, next level opens. |
| `game.lose(message)` | Ends the attempt as lost, showing `message` with "Try again". |
| `game.after(ms, fn)` / `game.every(ms, fn)` | Timers. Return a cancel function. |
| `game.onFrame((dt, now) => …)` | Runs every screen frame; `dt` is seconds since the last frame. For movement. |
| `game.listen(target, type, fn)` | Event listener (pointer, keyboard…). |
| `game.countdown(seconds, onTimeUp)` | Clock in the level bar; returns `{ secondsLeft, stop() }`. |
| `game.showInfo(text)` | Short text in the level bar, e.g. "Replies 2 / 3". |
| `game.vibrate(pattern)` | Phone vibration, if the player allows it. |
| `game.ended` | True once the attempt is over. |

**Always use these tools for timers, frames and listeners.** They are stopped
automatically when the attempt ends (win, lose, Restart, Exit, Esc), so
nothing keeps running in the background. Use plain `setTimeout`,
`addEventListener` on `window`, etc. only if you clean them up by returning a
function from `play`.

Other helpers:
- `src/engine/random.js`: `randomInt`, `randomBetween`, `pick`, `shuffle`, `chance`.
- `src/avatar/svg-kit.js`: `createSvgKit()` draws shapes with the same
  vinyl/clay shading as the avatar (`kit.defs()` + `kit.clay(path, colour)`).
  Use it so the levels' art matches the avatar.

## How a level is drawn

- Draw with **HTML elements and SVG** inside `game.root`, styled in
  `level.css`. That suits the Signals look (soft rounded shapes, pastel
  colours) and taps/drags. Use `<canvas>` only for levels with many fast
  moving things.
- `game.root` fills the space under the level bar (at least 420 px high) and
  changes size with the window. Lay things out with CSS (flex, grid,
  percentages), not fixed pixel positions, so it adapts to other screens and
  later to mobile.
- Listen to `pointerdown`/`pointermove`/`pointerup` (works for mouse and
  touch), not `click`/`touchstart` separately.
- **In `level.css`, start every rule with the level's class**
  (`.level-07 .card { … }`) so styles never leak to other screens. Name
  animations with the level too (`@keyframes level-07-wiggle`).
- Don't use `data-action` attributes inside a minigame: those are the game
  menus' buttons and redraw the screen.
- Colours from the Signals palette: pastel backgrounds
  (`#ffd9c7 #d8e6ff #dff5d6 #f6d8f0 #fff0b8 #d6f1f1`), accents `#ff5a3c`
  (orange-red) and `#ffe36b` (yellow), ink `#23243a`. Font: Baloo 2
  (inherited). Rounded corners, soft shadows (`0 5px 0 rgba(0,0,0,.15)`).
- Never draw real characters, brands or club logos: invent them.

## The six steps (technical side)

The level's `README.md` tracks these. What each means for the code:

1. **Idea agreed.** No code. The "What we agreed" section is complete.
2. **First playable version.** Copy `play`, `stylesheet` and `level.css` from
   `_template` (rename `.level-00`), then build the agreed rules with simple
   shapes. It must be playable from start to end, with both a win and a loss
   (if the level can be lost). Settings for every tunable number.
3. **Rules and difficulty tuned.** Mostly changes to `settings`; small rule changes.
4. **Look and feel.** Final art (SVG with the clay kit, or images in
   `assets/`), animations, the player's avatar where it makes sense.
5. **Texts and details.** Final texts in `level.js`, sound/vibration if decided.
6. **Finished.** Helena approves. Check desktop and phone width, win and lose.

## Checking a level

```bash
npm test                      # must pass before every save
npm run check -- 7            # opens ?level=7 in a browser, reports errors, saves screenshots/level-07.png
npm run check -- 7 --mobile   # same at phone size
npm run check -- 7 --wait 5   # screenshot after 5 seconds of play
```

Look at the screenshot yourself before showing it to Helena. To test
interaction (winning, losing), write a short throwaway Playwright script
(outside the repo) that opens `?level=7`, taps or clicks, and checks that the
"Level complete" or "Not this time" card appears. `page.clock.install()`
lets you fast-forward timers instead of waiting.

Online, `https://helenapastranaproducciones.github.io/Signals/?level=7`
opens level 7 directly and `?test` opens every level on the map.
