# Level 10 · Customizer

**Signal:** Personalisation makes things ours
**Closing line:** “It’s not just any object. It’s mine.”
**Unlocks for the avatar:** hat: Bucket hat, top: Overalls

This file is the level's notebook: what we agreed, what is done and what comes next.
Claude keeps it up to date in plain words while working on the level with Helena.

## Progress

Tick a step only when Helena agrees it is done.

- [x] 1. Idea agreed: what the player sees and does, the social twist, how you win or lose
- [x] 2. First playable version: simple shapes, playable from start to end
- [ ] 3. Rules and difficulty tuned: it feels right to play
- [ ] 4. Look and feel: final art in the Signals style, with animations
- [ ] 5. Texts and details: final texts, and sound or vibration if wanted
- [ ] 6. Finished: Helena has played it and approves it

## Where we left off

01/11/2026: idea agreed with Helena (step 1). First playable version built straight away in the painted look: choosing one of five painted objects, a worktable with 8 paint pots, 4 markers and a sheet of 8 stickers (from twelve), drag-and-drop stickers, painting the base colour, freehand drawing that stays inside the object, a decorations counter, and the pile of 8 identical objects at the end where a friend finds yours (5 decorations or more) or can't. Helena played it (step 2 done) and asked for more stickers, less time and a decorated pile (done). Next: tune difficulty if needed (step 3).

## The idea

### From the brief

Pick an object (skateboard, phone, water bottle, laptop, backpack) and cover it with stickers, colours and drawings by dragging. 45 s, no way to lose.

### What we agreed

- **What the player sees:** a worktable seen from above with the object big in the middle; sticker sheets on one side, markers and paint pots on the other.
- **What the player does:** first you choose the object from five (skateboard, phone, water bottle, laptop, backpack). Then you decorate it with everything: drag stickers (stars, hearts, lightning, flowers, faces, words like "MINE") onto it; click a paint pot to change its base colour; pick a marker and draw on it by hand.
- **The social twist:** when time is up, your object drops into a pile of identical, plain ones (everyone at school has the same bottle or laptop). A friend spots yours straight away: "that one's yours, obviously". Personalising makes it yours, and others see it as yours.
- **How you win:** decorate it enough (at least 5 things: stickers, a paint colour, drawings) and your friend finds it in the pile.
- **How you lose:** if you barely decorated it when time is up, your friend can't find it ("wait… which one is yours?").
- **How long it lasts:** 45 seconds to decorate, plus choosing the object.

## Decisions

- 01/11/2026: Helena: more things to decorate with, less time, and the other objects in the pile decorated too. Now 12 stickers on the sheet from a pool of 22 (sun, cloud, music note, cat, crown, diamond, skateboard, WOW, pizza and gg added), 30 seconds instead of 45, and everyone else's object in the pile has a colour and a few stickers, so yours has to stand out.
- 01/11/2026: a worktable seen from above with the object in the middle (rejected: your avatar holding the object).
- 01/11/2026: choose the object, then stickers + base colour + freehand marker (rejected: stickers only).
- 01/11/2026: social twist: friends recognise your object in a pile of identical plain ones (rejected: a friend adding a gift sticker).
- 01/11/2026: Helena: you can lose if you barely decorate it (fewer than 5 things), because then nobody recognises it (rejected: no way to lose, as the brief said).
- 01/11/2026: Helena: a "Done!" button to finish before the time runs out.

## Open questions

_None yet._

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=10
- Files: `level.js` (texts, settings and the minigame), `art.js` (the objects, stickers, paints and markers), `level.css` (its look)
