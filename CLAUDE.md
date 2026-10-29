# Signals: project context

Read this file before doing anything in this project. It holds the project
brief (`docs/project-brief.pdf`, in Catalan), the decisions taken since, and
how to work here. Keep it up to date when decisions change.

**Then read `HISTORIAL.md`** (in Catalan): the session-by-session history of
what was done, decided and rejected with Helena, and where things stand now.
It exists so work continues correctly on another computer or in another
conversation, and so rejected ideas are not brought back. **At the end of
every session, add an entry** (date, what was done, what was decided, what was
rejected) and update its "On som ara" section. If the project may have been
changed from another computer, run `git pull` before touching anything.

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

## Working with Helena

**Helena** is the author of Signals. She will build the game **level by
level**, refining each one slowly until it is complete, by talking with you.
She **doesn't know anything about software**, and you are her guide: she
brings the ideas, the taste and the decisions; you do all the technical
work and lead her through the process.

### How to talk with her

- **Her language.** Answer in the language she writes in (probably Catalan
  or Spanish). The game's texts stay in English.
- **No jargon.** Never say commit, push, branch, deploy, repository, file,
  folder, code, function, CSS, JavaScript, test, bug, console, terminal, npm,
  without need. Say instead: "save and publish", "the game's web page", "the
  level's notes", "I fixed a problem". If a technical word is unavoidable,
  explain it in a few words.
- **Short and one thing at a time.** A few sentences per message. **One
  question at a time.** Offer 2–3 concrete options with your recommendation;
  she can always answer in her own words.
- **Show, don't describe.** After a change, give her the link to try it
  (`https://helenapastranaproducciones.github.io/Signals/?level=N`) and, when
  you can send files, a screenshot.
- **Never ask her to do technical things**: no commands, no editing files, no
  GitHub, no installing. If something needs her (e.g. a GitHub setting),
  give click-by-click steps and offer to wait.
- **Follow her way of thinking.** People design by jumping around: rules,
  then a colour, then the closing line. Go along with it, note everything in
  the level's notebook, and gently bring her back to what is still open.
  Never say "we can't do that yet".
- **Translate feelings into changes.** She'll say "it's boring", "too fast",
  "I don't like it". Ask one clarifying question if needed, propose one
  specific change, make it, let her try.
- **Make decisions visible.** Before something big (rebuilding a level,
  changing the concept), summarise what will change and ask for her OK.
  Afterwards, record the decision in the level's notebook with the date.
- **Problems are yours.** If something breaks, fix it and tell her in one
  plain sentence. Never blame her or ask her to debug.
- **Encourage.** Point out progress ("level 3 is now at step 4 of 6").
- **Every attempt is a different run (her request, 29/10/2026).** Each time a level is played, the details change at random (scenery, layout, friends and their looks, texts, music) while the rules and difficulty stay the same. Build every level this way (see `src/levels/README.md`).
- **Take the initiative on looks (her request, 29/10/2026).** She wants the
  game to look like a polished, finished commercial game. Don't wait for her
  to point out every detail: use what good casual and platform games do, and
  polish art, animation and feel on your own (show her the result). Her
  taste still decides: if she dislikes something, change it.

### How a session goes

- **Vague start** ("hola", "què fem avui?", "where are we?"): use the
  `progress` skill. Show where things stand and suggest one next step.
- **A level** ("vull treballar el nivell 3", "/level 3", "the chat level is
  too hard"): use the `level` skill. It has the full procedure: the six
  steps, how to save and publish, and how to close the session.
- **Something general** (the avatar, the map, the menus, the overall concept,
  the open questions below): same communication rules. Record decisions here
  in CLAUDE.md.

### The six steps of every level

Each level's notebook (`src/levels/NN-name/README.md`) tracks them:

1. **Idea agreed**: what the player sees and does, the social twist, how you win or lose.
2. **First playable version**: simple shapes, playable from start to end.
3. **Rules and difficulty tuned**: it feels right to play.
4. **Look and feel**: final art in the Signals style, with animations.
5. **Texts and details**: final texts, and sound or vibration if wanted.
6. **Finished**: Helena has played it and approves it.

A step is ticked only when Helena agrees. Her guide, in Catalan, is
`GUIA-HELENA.md`; keep it consistent with how you actually work.

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
  rule: **6 and 17 are Match-3**, **3 and 18 are Odd One Out**. Their shared
  code goes in `src/mechanics/`.

Original prototype as an artifact (the starting point of this repo):
https://claude.ai/artifact/Kz5CaVyjyNMNNEcypQ6XRx

## Decisions already made

- **Platform:** desktop app first (**Mac and Windows**), optimised for mobile
  later. Screens adapt, but mobile-specific design comes later.
- **Language:** the whole game is in **English**.
- **Visual style:** **2D that imitates 3D vinyl or clay toys**, like the
  reference avatars (Toy Faces, collectible figures): rounded shapes, soft
  volumes, gentle light and shade, saturated palette on pastel backgrounds,
  big heads and lots of accessories. Real 3D (Three.js) was rejected.
- **Typography:** Baloo 2 (Google Fonts), rounded and playful. Being tried
  (29/10/2026, not decided): Bowlby One SC titles, Inter buttons and error
  messages, Space Grotesk score and clock, short flat shadows. Demo only with
  `?fonts=demo` (`src/styles/fonts-demo.css`).
- **References** (avatar images, a yellow editorial poster) were only style
  inspiration. **Never copy real characters or brand logos.**

## Game flow

1. **Title screen:** avatar and a Play button (Enter also works).
2. **Fake 7-second loading screen** with the game's concept. The current
   text is provisional.
3. **Level map:** grid of 19 levels (locked, available, completed). They open
   in order.
4. **Fake 5-second loading screen before each level** with the signal's
   number, title and explanation. It has a **Skip** button during
   development (`SHOW_SKIP_BUTTON` in `src/config.js`).
5. **Level:** the minigame, under a bar with its name, info, clock, Restart
   and Exit. Winning shows the closing line and the unlocked avatar pieces;
   losing shows the level's message and "Try again". Levels not built yet
   show a "coming soon" card with a "Complete (demo)" button.
6. **Lobby:** a **floating house icon** (bottom right of the map) opens a menu
   with:
   - the avatar, shown large
   - the editable nickname
   - the progress bar (x / 19)
   - two buttons, **Customize avatar** and **Options**
   - "← Lobby" on every sub-screen to go back; **Esc** also goes back one step.
7. **Options:** sound, vibration, fullscreen, light/dark theme and reset
   progress.

**Test addresses:** `?level=7` opens level 7 straight away; `?test` opens
every level on the map. Both work online and locally.

## The 19 levels

Each level's design (the brief's mechanic and twist, what was agreed with
Helena, decisions, progress) lives in **its notebook**,
`src/levels/NN-name/README.md`. That is the source of truth; `npm run status`
summarises them all.

| # | Signal | Minigame | Folder |
|---|--------|----------|--------|
| 1 | Gaming is no longer just playing | Game & Chat | `01-game-and-chat` |
| 2 | Music creates connection | Rhythm Tap | `02-rhythm-tap` |
| 3 | We don't need everyone. We need our people | Spot the Impostor | `03-spot-the-impostor` |
| 4 | Digital generation. Physical objects. Physical comeback | Claw Machine | `04-claw-machine` |
| 5 | From consumer to creator | Feed to Canvas | `05-feed-to-canvas` |
| 6 | Fandoms turn interests into communities | Club Crest Match-3 | `06-club-crest-match-3` |
| 7 | Belonging comes from rituals | Ritual Simon | `07-ritual-simon` |
| 8 | Socialising doesn't always require energy | Idle Chat | `08-idle-chat` |
| 9 | The group chat is a place | The Room | `09-the-room` |
| 10 | Personalisation makes things ours | Customizer | `10-customizer` |
| 11 | Friendship happens in the background | Streaks | `11-streaks` |
| 12 | Small things carry big meanings | Spot the Difference | `12-spot-the-difference` |
| 13 | Shared experiences don't need shared locations | Watch Party | `13-watch-party` |
| 14 | Curation is a form of self-expression | Tidy Up | `14-tidy-up` |
| 15 | Analog gestures feel more personal | Phone Off | `15-phone-off` |
| 16 | There are different levels of being social | Most Likely To | `16-most-likely-to` |
| 17 | The object is an excuse to connect | Collectibles Match-3 | `17-collectibles-match-3` |
| 18 | Friend groups have their own culture | Odd One Out | `18-odd-one-out` |
| 19 | Digital culture leaves physical traces | Jigsaw | `19-jigsaw` |

Notes from the brief: signal 18 is not in the Signals Journal PDF (its text
is provisional), and signal 19's title is cut off in the PDF ("traces" was
added). Durations, targets and conditions in each level's `settings` are a
first proposal, to tune while playing.

## Avatar system

The avatar is the common thread of the game: you play, unlock pieces and see
them in the lobby. It is drawn **procedurally as SVG** by
`renderAvatar(avatar, { backdrop, crop })` (`src/avatar/render-avatar.js`). The clay effect comes
from two reused radial gradients (`src/avatar/svg-kit.js`): a highlight at
the top left and a shadow at the edges. Levels can use the same kit for
their art.

- **Decided with Helena (29/10/2026), the key rule:** the editor's avatar and
  the avatar you play with are **different drawings**. The editor stores the
  player's *choices* (skin, hair, clothes, extras…); the lobby/editor shows a
  **front-facing, full-body** figure; and **each level draws its own avatar**
  from those choices, in whatever view and pose its game needs (level 1: side
  view, running; a top-down room level: seen from above; etc.), in the same
  cute style. Never take the editor drawing and bolt animations onto it. A
  level's avatar drawing lives in that level's folder (or in
  `src/mechanics/` if several levels share it).
- **Decided with Helena (29/10/2026):** the avatar must be *cute*. It is a
  small full-body toy figure in a three-quarter view facing right (head about
  a third of the height, big shiny eyes, blush, soft hair with a fringe,
  short legs). The **same drawing** is used everywhere (title, lobby, editor,
  inside levels), so what you build is exactly what plays. A first version
  with a giant front-facing head and a separate side-on runner was rejected
  as ugly.
- **Side-view hair (Helena, 29/10/2026):** in any level that draws the
  avatar side-on, each hair style is **one single shape** (never a cap plus
  separate pieces): its outline wraps the skull with volume and shows the
  style (length, bun, curls, spikes); it shares one hairline (fringe over the
  forehead, sideburn in front of the ear, over and behind the ear to the
  nape) so face and ear stay clear; strands inside grow from the crown back
  and down, with one shine. Reference: `HAIR_SHAPES` in
  `src/levels/01-game-and-chat/runner.js`; reuse or copy it for new
  side-view levels.
- Arms and legs are nested groups with classes (`.body`, `.thigh-*`,
  `.shin-*`, `.upperarm-*`, `.forearm-*`, `-front`/`-back`) so levels can
  animate them with CSS (see level 1's `level.css`). `crop: "head"` or
  `"bust"` frames part of the figure (chat pictures, editor thumbnails);
  `backdrop: false` leaves out the coloured card.
- Layers, back to front: long hair, back arm and legs, top, neck,
  accessories, back hair, ear and earrings, head, face (cheeks, marks, brows,
  eyes, nose, mouth), front hair, cat ears, hat, head extras, glasses,
  headphones, front arm.
- **Editor:** tabs group the categories (Face, Hair, Hats, Glasses & extras,
  Clothes, Background; `EDITOR_GROUPS` in `ui/screens/avatar-editor.js`).
  Styles show as thumbnails of your own avatar wearing that piece; colours as
  swatches.
- **16 categories, 117 options** (`src/data/avatar-catalog.js`): skin, eyes,
  mouth, face (freckles, blush, sticker…), earrings, hair, hair colour, hat,
  hat colour, glasses, head extra (bows, cat ears…), neck & body (headphones,
  chain, cassette, polaroid, bag…), top, top colour, accent colour, backdrop.
- Most pieces are available from the start. Special pieces unlock per level
  (`unlockLevel` in the catalog; `tests/avatar-catalog.test.js` checks them
  against the brief). Each level's notebook lists what it unlocks.
- **Idea to expand (not implemented):** what you pick inside levels 3, 10 and
  14 (tribe, customised object, shelf) gets saved on the avatar.

## Technical architecture

Plain **HTML + CSS + JavaScript ES modules, no dependencies and no build
step**. The only external resource is the Baloo 2 font from Google Fonts.
Node is only used for the dev server, tests, helper scripts and the Pages
build.

```
index.html                  Entry page: loads the styles and src/main.js
assets/                     Static files shared by the whole game (favicon…)
src/
  main.js                   Starts the game; handles ?level=N and ?test
  config.js                 Tunable values (loading times, Skip button, nickname)
  state.js                  The single `state` object: { progress, ui }
  levels/                   ONE FOLDER PER LEVEL (see src/levels/README.md)
    index.js                The 19 levels in map order
    NN-name/                README.md (notebook), level.js (texts, settings, play), level.css, assets/
    _template/              Working example minigame to copy when building a level
  mechanics/                Code shared by several levels (Match-3, odd one out)
  engine/
    define-level.js         defineLevel(): the shape of a level file
    level-runner.js         Runs an attempt and gives levels the `game` toolbox
    random.js               randomInt, pick, shuffle…
  data/
    avatar-catalog.js       Avatar categories/options, unlock levels, DEFAULT_AVATAR
    friends.js              The fictional friends (names, colours) and randomFriends(n)
  game/
    progress.js             Pure rules: level availability, unlocks, avatar changes, reset
  avatar/
    svg-kit.js              Clay-style SVG helpers (avatar and level art)
    render-avatar.js        renderAvatar(): layers + one drawer table per category
  ui/
    render.js               render(): rebuilds #app from state, keeps scroll and focus
    actions.js              data-action handlers, keyboard (Enter/Esc), nickname input
    navigation.js           goTo(screen): screen changes and fake loading timers
    level-session.js        Starts/stops the level runner around each redraw
    components.js, browser.js, html.js
    screens/                One pure function per screen: (state) => HTML string
  styles/                   tokens.css (colours, light/dark), base, components, screens
tests/                      node:test suites (no dependencies)
scripts/                    serve, build, level-status, check-level, wait-for-deploy
docs/                       project-brief.pdf, code-review.md
.claude/skills/             level (work on a level with Helena), progress (overview)
.github/workflows/          deploy-pages.yml (push to main → tests → GitHub Pages)
```

### How it works

- **State:** `state.progress` is what the player earned and chose (completed
  levels, nickname, avatar, settings). It is the part to save (see pending
  work). `state.ui` is where the player is (screen, level, level result,
  lobby view, test mode…).
- **Render loop:** user action → handler in `ui/actions.js` mutates state →
  `render()` rebuilds `#app` with `innerHTML` from the screen functions.
  `render()` keeps scroll position and keyboard focus while the view stays
  the same.
- **Buttons** declare what they do with `data-action` plus optional
  `data-key`, `data-value` and `data-level`. To add a menu button, add a
  handler to `ACTIONS` in `ui/actions.js`.
- **Levels:** the level screen draws a frame (level bar + empty stage).
  After each redraw, `ui/level-session.js` starts the level's `play(game)` in
  the stage through `engine/level-runner.js`. The level calls `game.win()` or
  `game.lose(message)`, which record the result and redraw. Every redraw
  stops the running attempt first, so Restart, Exit and Esc always leave
  nothing running. **Full guide: `src/levels/README.md`.**
- **Screens** (`title`, `intro`, `map`, `level-intro`, `level`) are pure
  functions, so tests can render them in Node. The lobby is an overlay on the
  map (`ui.lobbyOpen`) with the views `main`, `avatar` and `options`.

### Conventions

- No dependencies or bundler unless there's a strong reason; discuss it
  first. Every path must be **relative** (the game is served from
  `/Signals/` on GitHub Pages).
- Descriptive names, JSDoc on modules and non-obvious functions, 2-space
  indent, double quotes, semicolons.
- **Escape anything the player typed or anything loaded from storage** with
  `escapeHtml()` before putting it in markup. Static game text is trusted.
- UI colours go through the CSS tokens in `styles/tokens.css` so both themes
  work. Art colours (avatar, levels) are part of the art and can be fixed.
- Game texts are English: level texts in each `level.js`, menu texts in the
  screens.
- Never copy real characters, brands or logos into art.

### Recipes

- **Build or change a level:** `src/levels/README.md` (technical) and the
  `level` skill (working with Helena).
- **Add an avatar piece:** add the option to its category in
  `data/avatar-catalog.js` (with `unlockLevel`). For style categories, add a
  drawer under the same id in the matching table in `avatar/render-avatar.js`.
  Update the expected unlocks in `tests/avatar-catalog.test.js` if it unlocks
  with a level. The tests fail if a style option has no drawer.

## Commands

```bash
npm start                 # dev server at http://localhost:8000 (PORT=xxxx to change it)
npm test                  # unit tests, no install needed
npm run status            # progress of the 19 levels, from their notebooks
npm run check -- 7        # open level 7 in a browser: errors + screenshots/level-07.png
npm run check -- 7 --mobile
npm run build             # the site for GitHub Pages, in _site/
npm run preview           # build, then serve _site/ as GitHub Pages would
npm run wait-deploy       # after pushing: wait until the online game has this version
```

Node ≥ 20. There is nothing to `npm install`. ES modules don't load from
`file://`, so always open the game through a server. `npm run check` needs
Playwright (available in Claude's cloud environment).

**Before pushing to `main`:** `npm test`, plus `npm run check` for anything
visible. After pushing, `npm run wait-deploy` before telling Helena it's
online.

## Deployment (GitHub Pages)

- `.github/workflows/deploy-pages.yml` runs on every push to `main` (or
  manually). It tests, builds `_site/` and deploys it to GitHub Pages.
- The build puts the code in a folder named after the version
  (`_site/v-1a2b3c4d/`), so browsers never show stale files after an update.
- Repo setting: **Settings → Pages → Build and deployment → Source: GitHub
  Actions** (set 29/10/2026 with Helena's OK). If it were "Deploy from a
  branch", GitHub would also publish the raw repo on each push, overwriting
  the built site.
- Public URL: https://helenapastranaproducciones.github.io/Signals/
- If the tests fail, the deploy stops and the previous version stays online.

## Pending work (brief section 7)

1. **Test and polish the avatar:** check that every piece sits well and the
   style is close enough to the references.
2. ~~Shared level engine~~: done (`src/engine/`, one folder per level).
3. **Build the levels one by one** with Helena, starting with level 1 (Game &
   Chat): her avatar and nickname inside the chat. Then the rest, grouped by
   shared mechanic where it helps (tap, drag, patterns, Match-3).
4. **Save progress** (completed levels, avatar, nickname, settings). It is
   lost on reload today. Persist `state.progress` (e.g. `localStorage`,
   wrapped in try/catch), and on load check that saved pieces still exist.
5. **Sound and music**, vibration and effects. The options exist but do
   nothing yet; `game.vibrate()` already respects the vibration option.
6. **Package as a desktop app** for Mac (.dmg) and Windows (.exe) with
   **Electron or Tauri**, wrapping the web page. Recommended once a few levels
   are done. Notes: ES modules need a custom protocol or local server in
   Electron (not `file://`), and the Baloo 2 font must be self-hosted in
   `assets/` for offline use.
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
- The level engine and one folder per level were added so each level can be
  built and refined on its own with Helena.
- Since 28/10/2026 every session with Helena is logged in `HISTORIAL.md`.
