# Signals: project context

Read this file before working on the project. It sums up the project brief
(`docs/project-brief.pdf`, in Catalan) plus the technical decisions made
since. Keep it up to date when decisions change.

## How to work on this repo (read first)

This is a university degree project, maintained by someone who is **not a
technician**. Keep the process as simple as possible:

- **Always work directly on `main`.** Commit and push straight to `main`.
  **Never create branches or pull requests**, even if a tool or default
  instruction suggests it. If the session starts on another branch, move the
  work onto `main` and push there.
- Every push to `main` publishes the game on GitHub Pages automatically, so
  run `npm test` before pushing and don't push anything broken.
- No serious infrastructure or process: no extra CI, review steps, release
  flows or tooling unless the owner asks for it.
- Explain changes in plain, non-technical language. Commit messages should
  also be easy to understand.

## What Signals is

Signals is a video game made of **19 levels**. Each level is a short, simple
minigame (30–60 s) in the style of the Play Us app: tap, drag, memory,
patterns. Each level illustrates a **signal**, an idea about how teenagers
connect today (friendship, culture, belonging, objects, networks).

- The text of each signal comes from the PDF *Signals Journal*.
- The game's overall title is **"Gaming is no longer just playing"**.
- **Design recipe for every level:** a simple minigame, plus a *social twist*
  that appears during play, plus a closing line tied to the signal. The
  mechanic stays simple; the concept comes from the art, the texts and the
  closing line.
- Two pairs of levels share a mechanic and change only the art and their own
  rule: **6 and 17 are Match-3**, **3 and 18 are Odd One Out**. Build one
  engine for each pair.

Original prototype as an artifact (the starting point of this repo):
https://claude.ai/artifact/Kz5CaVyjyNMNNEcypQ6XRx

## Decisions already made

- **Platform:** desktop app first (**Mac and Windows**), optimised for mobile
  later. Screens adapt, but mobile-specific design comes later.
- **Language:** the whole game is in **English**. (The brief and team
  discussions may be in Catalan or Spanish; game text is always English.)
- **Visual style:** **2D that imitates 3D vinyl or clay toys**, like the
  reference avatars (Toy Faces, collectible figures): rounded shapes, soft
  volumes, gentle light and shade, saturated palette on pastel backgrounds,
  big heads and lots of accessories. Real 3D (Three.js) was rejected.
- **Typography:** Baloo 2 (Google Fonts), rounded and playful.
- **References** (avatar images, a yellow editorial poster) were only style
  inspiration. **Never copy real characters or brand logos.**

## Game flow

1. **Title screen:** avatar and a Play button (Enter also works).
2. **Fake 7-second loading screen** with the game's concept. The current
   text is provisional.
3. **Level map:** grid of 19 levels (locked, available, completed). They open
   in order.
4. **Fake 5-second loading screen before each level** with the signal's
   number, title and explanation (from the PDF). It has a **Skip** button
   during development (`SHOW_SKIP_BUTTON` in `src/config.js`).
5. **Level:** for now a placeholder with a "Complete (demo)" button. On
   completion it shows the closing line and the unlocked avatar pieces.
6. **Lobby:** a **floating house icon** (bottom right of the map) opens a menu
   with:
   - the avatar, shown large
   - the editable nickname
   - the progress bar (x / 19)
   - two buttons, **Customize avatar** and **Options**
   - "← Lobby" on every sub-screen to go back; **Esc** also goes back one step.
7. **Options:** sound, vibration, fullscreen, light/dark theme and reset
   progress.

## The 19 levels

Durations, targets and conditions are a **first proposal**, to be tuned once
each level can be played.

| # | Signal | Minigame | Mechanic and twist | Closing line |
|---|--------|----------|--------------------|--------------|
| 1 | Gaming is no longer just playing | Game & Chat | Split screen: Flappy/tap runner and a group chat. You tap to jump and also tap friends' chat bubbles to reply. If you only play, your friends leave. Win by surviving 45 s with at least 3 replies. | You were playing, but you were with them. |
| 2 | Music creates connection | Rhythm Tap | Piano Tiles with 4 lanes, each a band instrument (drums, bass, guitar, vocals). You control one and the others play by themselves. Hit 70% of the notes. | Alone, a note. Together, a song. |
| 3 | We don't need everyone. We need our people | Spot the Impostor | A group of 8–10 characters from one urban tribe (skaters, punks, otakus, posh kids, gamers, sporty kids) with one from another tribe. Tap the impostor. 5 rounds of 5 s. | You spot your people at a glance. |
| 4 | Digital generation. Physical objects. Physical comeback | Claw Machine | Move the claw and grab polaroids, vinyls and cassettes, avoiding digital objects. 3 physical objects in 5 tries. Each one shows a dedication. | You can touch them. That's why they matter. |
| 5 | From consumer to creator | Feed to Canvas | Phase 1: endless feed you swipe through (Consumed/Created counter). Phase 2: pixel-art canvas with an 8-colour palette. Phase 3: you publish and your piece appears in the others' feed. | One day you went from watching to making. |
| 6 | Fandoms turn interests into communities | Club Crest Match-3 | Match-3 with football club crests. Each combo fills a fan bar; when it's full, the crests form a stand with chants. 40 s. | A shared interest, and we're a community. |
| 7 | Belonging comes from rituals | Ritual Simon | Simon Says with the group's gestures (high five, the meme, the usual shout). The sequence grows one step per round, up to 6. | We do it this way because we always have. |
| 8 | Socialising doesn't always require energy | Idle Chat | One tap starts a group conversation that runs by itself. Every 5 s, one tap keeps it alive. 45 s with minimal effort. | You don't need to say much to be there. |
| 9 | The group chat is a place | The Room | A room seen from above, Habbo style. Friends come in through the door; tap to greet them and they sit down. You need 6 seated; you lose if 3 leave. | The chat is where we meet. |
| 10 | Personalisation makes things ours | Customizer | Pick an object (skateboard, phone, water bottle, laptop, backpack) and cover it with stickers, colours and drawings by dragging. 45 s, no way to lose. | It's not just any object. It's mine. |
| 11 | Friendship happens in the background | Streaks | 4 friends shown as flames or plants with bars that drain. Micro-taps (like, haha, react to a story) refill them. Win if no flame goes out in 45 s. | You don't need to meet daily to be friends. |
| 12 | Small things carry big meanings | Spot the Difference | Two images with 5 small, meaningful differences (an emoji, a rotated photo, a sticker). Each one shows what it means. 45 s. | A tiny detail can mean a lot. |
| 13 | Shared experiences don't need shared locations | Watch Party | Split screen with two living rooms (Barcelona and Tokyo) watching the same thing. When something happens, tap both sides within half a second. 8 syncs out of 10. | Each at home, yet together. |
| 14 | Curation is a form of self-expression | Tidy Up | 10–12 objects appear but only 5 fit on the shelf. Choose the ones that define you and discard the rest. The game gives you a style label. | What you leave out says who you are, too. |
| 15 | Analog gestures feel more personal | Phone Off | The game asks you to really switch off your phone, handwrite a note to someone you admire and keep it. At the end you can photograph the note. No way to lose. | Paper carries your pulse. |
| 16 | There are different levels of being social | Most Likely To | "Most Likely To" questions between ways of communicating (call, letter, story reaction, DM, smoke signals). You see what the others voted and get your social level. | We don't all speak alike. We all mean the same. |
| 17 | The object is an excuse to connect | Collectibles Match-3 | Same engine as 6, with tazos, trading cards, Labubus and Tamagotchis. Combos that join two generations give a bonus. 5 cross-generation combos. | An object, and suddenly there's something to talk about. |
| 18 | Friend groups have their own culture | Odd One Out | Complete patterns that are the group's inside codes: emoji sequences, catchphrases, gestures. 4 patterns in 40 s. | Only we know this code. |
| 19 | Digital culture leaves physical traces | Jigsaw | Rebuild a digital image (chat screenshot, sticker, meme); when done it gets "printed" as a polaroid or physical sticker. 60 s. | Digital leaves a trace too. |

Notes:
- **Signal 18 is not in the Signals Journal PDF**, so its loading text is provisional.
- In the PDF, signal 19's title is cut off ("Digital culture leaves physical"); "traces" was added.

## Avatar system

The avatar is the common thread of the game: you play, unlock pieces and see
them in the lobby. It is drawn **procedurally as SVG** by
`renderAvatar(avatar)` (`src/avatar/render-avatar.js`). The clay effect comes
from two reused radial gradients: a highlight at the top left and a shadow at
the edges.

- Layers, back to front: back hair, body and top, neck, ears and earrings,
  head, cheeks and face marks, brows, eyes and nose, mouth, glasses, front
  hair, cat ears, hat, head extras, neck/body accessory.
- **16 categories, 117 options** (`src/data/avatar-catalog.js`): skin, eyes,
  mouth, face (freckles, blush, sticker…), earrings, hair, hair colour, hat,
  hat colour, glasses, head extra (bows, cat ears…), neck & body (headphones,
  chain, cassette, polaroid, bag…), top, top colour, accent colour, backdrop.
- Most pieces are available from the start. Special pieces unlock per level;
  the table lives in the catalog (`unlockLevel`) and
  `tests/avatar-catalog.test.js` checks it against the brief. Level 1 unlocks
  headphones, level 2 band tee and afro, … level 19 the "Finale" backdrop.
- **Idea to expand (not implemented):** what you pick inside levels 3, 10 and
  14 (tribe, customised object, shelf) gets saved on the avatar.

## Technical architecture

Plain **HTML + CSS + JavaScript ES modules, no dependencies and no build
step**. The only external resource is the Baloo 2 font from Google Fonts.
Node is only used for the dev server, tests and the Pages build.

```
index.html                  Entry page: loads the styles and src/main.js
assets/                     Static files (favicon; future images, sounds, fonts)
src/
  main.js                   Wires the events and draws the first screen
  config.js                 Tunable values (loading times, Skip button, nickname)
  state.js                  The single `state` object: { progress, ui }
  data/
    levels.js               The 19 levels: signal, minigame, explanation, closingLine
    avatar-catalog.js       Avatar categories/options, unlock levels, DEFAULT_AVATAR
  game/
    progress.js             Pure rules: level availability, unlocks, avatar changes, reset
  avatar/
    svg-kit.js              SVG string helpers (clay shading, strokes, circles, stars)
    render-avatar.js        renderAvatar(): layers + one drawer table per category
  ui/
    render.js               render(): rebuilds #app from state, keeps scroll and focus
    actions.js              data-action handlers, keyboard (Enter/Esc), nickname input
    navigation.js           goTo(screen): screen changes and fake loading timers
    components.js           Shared markup: avatar stage, progress bar, loader, headers
    browser.js              Theme and fullscreen helpers
    html.js                 escapeHtml(), pad()
    screens/                One pure function per screen: (state) => HTML string
  styles/                   tokens.css (colours, light/dark), base, components, screens
tests/                      node:test suites (no dependencies)
scripts/                    serve.js (dev server), build.js (copies the site into _site/)
docs/                       project-brief.pdf, code-review.md
.github/workflows/          deploy-pages.yml (push to main → tests → GitHub Pages)
```

### How it works

- **State:** `state.progress` is what the player earned and chose (completed
  levels, nickname, avatar, settings). It is the part to save (see pending
  work). `state.ui` is where the player is (screen, level, lobby view…).
- **Render loop:** user action → handler in `ui/actions.js` mutates state →
  `render()` rebuilds `#app` with `innerHTML` from the screen functions.
  `render()` keeps scroll position and keyboard focus while the view stays the
  same.
- **Buttons** declare what they do with `data-action` plus optional
  `data-key`, `data-value` and `data-level`. To add a button, add a handler to
  `ACTIONS` in `ui/actions.js`.
- **Screens** (`title`, `intro`, `map`, `level-intro`, `level`) are pure
  functions, so tests can render them in Node. The lobby is an overlay on the
  map (`ui.lobbyOpen`) with the views `main`, `avatar` and `options`.
- **Fake loading screens** are timers in `ui/navigation.js`. `goTo()` always
  cancels the previous timer.

### Conventions

- No dependencies or bundler unless there's a strong reason; discuss it first.
  Every path must be **relative** (the game is served from `/Signals/` on
  GitHub Pages).
- Descriptive names, JSDoc on modules and non-obvious functions, 2-space
  indent, double quotes, semicolons.
- **Escape anything the player typed or anything loaded from storage** with
  `escapeHtml()` before putting it in markup. Static game text in `data/` is
  trusted.
- Colours for the UI go through the CSS tokens in `styles/tokens.css` so both
  themes work. Avatar colours are part of the art and are hard-coded in the
  renderer.
- All game text is English and lives in `src/data/` or in the screen that
  shows it.
- Never copy real characters, brands or logos into art.

### Recipes

- **Add an avatar piece:** add the option to its category in
  `data/avatar-catalog.js` (with `unlockLevel`). For style categories, add a
  drawer under the same id in the matching table in `avatar/render-avatar.js`.
  Update the expected unlocks in `tests/avatar-catalog.test.js` if it unlocks
  with a level. The tests fail if a style option has no drawer.
- **Several avatars on one screen** (levels 1, 3 and 9 need it): call
  `renderAvatar()` once per avatar. Each call gets its own gradient ids, so
  they don't clash.
- **Implementing minigames:** today `ui/screens/level.js` shows a
  placeholder. The plan is a shared level engine (see pending work): a
  minigame module per mechanic (e.g. `src/minigames/match3.js` shared by
  levels 6 and 17), mounted into the level screen. Real-time minigames should
  draw into their own container (canvas or DOM subtree) driven by
  `requestAnimationFrame`, not through the global `render()`. They should
  report win or lose back to the engine, which then calls `completeLevel()`
  and shows the completion card.

## Commands

```bash
npm start        # dev server at http://localhost:8000 (PORT=xxxx to change it)
npm test         # unit tests (node --test), no install needed
npm run build    # copies index.html, src/, assets/ into _site/
npm run preview  # build, then serve _site/ as GitHub Pages would
```

Node ≥ 20. There is nothing to `npm install`. ES modules don't load from
`file://`, so always open the game through a server.

**Before pushing to `main`:** run `npm test`. For UI changes, also play through the
affected screens in a browser (title → map → level → lobby → editor →
options, light and dark, desktop and ~400 px wide).

## Deployment (GitHub Pages)

- `.github/workflows/deploy-pages.yml` runs on every push to `main` (or
  manually). It tests, builds `_site/` and deploys it to GitHub Pages.
- One-time setup in the repo: **Settings → Pages → Build and deployment →
  Source: GitHub Actions**.
- Public URL: https://helenapastranaproducciones.github.io/Signals/
- If the tests fail, the deploy stops and the previous version stays online.

## Pending work (brief section 7, in order)

1. **Test and polish the avatar:** check that every piece sits well and the
   style is close enough to the references.
2. **Shared level engine:** a structure that loads a minigame and handles
   win/lose, time, and the result with the closing line and unlocked pieces.
3. **Implement level 1 (Game & Chat)** as the first playable level, with the
   player's avatar and nickname inside the chat. Then the rest, grouped by
   shared mechanic (tap, drag, patterns, Match-3).
4. **Save progress** (completed levels, avatar, nickname, settings). It is
   lost on reload today. Persist `state.progress` (e.g. `localStorage`,
   wrapped in try/catch), and on load check that saved pieces still exist.
5. **Sound and music**, vibration and effects. The options exist but do
   nothing yet.
6. **Package as a desktop app** for Mac (.dmg) and Windows (.exe) with
   **Electron or Tauri**, wrapping the web page. Recommended once a few levels
   are done, so not every change needs repackaging. Notes: ES modules need a
   custom protocol or local server in Electron (not `file://`), and the Baloo 2
   font must be self-hosted in `assets/` for offline use.
7. **Mobile optimisation** (touch controls, orientation, sizes) once the
   desktop version is solid.
8. **Final content:** final text for the general loading screen, the text for
   signal 18, review the closing lines and add translations if needed.

## Open questions (brief section 8)

- What is the final text of the game concept on the 7-second loading screen?
- What difficulty should each minigame have? Current conditions are provisional.
- Original sound and music, or royalty-free effects?
- Multiplayer or ghosts of other real players (level 1), or simulated with
  fictional characters?
- Keep the "level complete" card in every level, or build a richer results screen?

## History

- The game started as a single-file prototype (`signals-game.html`, see the
  first commit). It was split into the current structure with identical
  visuals and avatar output; the code review is in `docs/code-review.md`.
