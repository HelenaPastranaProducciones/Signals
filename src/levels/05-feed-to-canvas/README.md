# Level 05 · Feed to Canvas

**Signal:** From consumer to creator
**Closing line:** “One day you went from watching to making.”
**Unlocks for the avatar:** skin: Lime, skin: Blue, skin: Pink, skin: Lilac

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

31/10/2026: idea agreed with Helena (step 1). First playable version built straight away in the painted look: the phone, the feed scrolling faster and faster with painted posts from random friends, the Create button after 2.5 s, a 10×10 canvas with 8 colours and an eraser, six templates (heart, star, cat, smiley, mushroom, flower), and the published post with likes and comments. Helena played it (step 2 done) and asked for grey empty pixels and a 16×16 canvas with harder drawings (done). Next: tune difficulty if needed (step 3).

## The idea

### From the brief

Phase 1: endless feed you swipe through (Consumed/Created counter). Phase 2: pixel-art canvas with an 8-colour palette. Phase 3: you publish and your piece appears in the others' feed.

### What we agreed

- **What the player sees:** a big phone in the middle of the screen. First it shows a feed of posts; then it turns into a canvas to draw on; at the end the drawing is published and appears in the friends' feed.
- **What the player does:** (1) the feed scrolls by itself, faster and faster, and the "Consumed" counter keeps going up; a small blinking **Create** button on the phone takes you out of the loop. (2) Then the phone becomes a pixel grid (about 12×12) with 8 colours below: a drawing is marked faintly on it (a heart, a star, a cat face… a different one each time) and you fill it with the right colours, clicking or dragging.
- **The social twist:** when you finish you press **Publish** and the phone goes back to the feed, but now your drawing is in it, with hearts and comments from friends ("did YOU make this??"), and the counter changes from "Consumed: 248" to "Created: 1".
- **How you win:** you press Create in time, fill the template well and publish: friends like and comment on it.
- **How you lose:** (1) you ignore Create and stay hooked on the feed too long ("You scrolled the whole night away…"); (2) you publish a drawing that doesn't follow the template (too many pixels wrong or empty): nobody likes it and you lose.
- **How long it lasts:** the feed is short (about 15 seconds at most before you lose); drawing has no time limit, you press Publish when you're ready. About 40–60 seconds in all.

## Decisions

- 31/10/2026: Helena: the empty pixels looked white, so it seemed you had to paint them white. Empty pixels are now a grey chequer ("nothing here"), with a hint "Grey squares stay empty". And a bigger canvas with harder, more fun drawings: 16 × 16 with six new templates (strawberry, cat, ice cream, mushroom, rocket, frog), each using 3–6 colours.
- 31/10/2026: everything happens inside one big phone (feed, then canvas, then published) (rejected: a split screen with the feed and the canvas side by side).
- 31/10/2026: the feed scrolls by itself and hooks you; you have to press Create to break out (rejected: scrolling it yourself until a friend says "your turn").
- 31/10/2026: drawing = filling a faint pixel template with the right colours, so there is a clear goal (rejected: free drawing with a minimum of pixels).
- 31/10/2026: social twist: you publish and your drawing appears in the friends' feed with hearts and comments (rejected: a friend joining to help you draw).
- 31/10/2026: Helena: you lose if you ignore Create, and also if the drawing is bad and doesn't follow the template: then nobody likes it (rejected: no losing, only stars).
- 31/10/2026: no time limit for drawing; the challenge is doing it well, not fast (rejected: 30 seconds to draw).

## Open questions

_None yet._

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=5
- Files: `level.js` (texts, settings and the minigame), `art.js` (feed pictures, colours, templates, comments), `level.css` (its look)
