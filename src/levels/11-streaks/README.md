# Level 11 · Streaks

**Signal:** Friendship happens in the background
**Closing line:** “You don’t need to meet daily to be friends.”
**Unlocks for the avatar:** face: Band-aid, hair colour: Blue, backdrop: Aquarium

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

01/11/2026: idea agreed with Helena (step 1). First playable version built straight away in the painted look and a bit hard, as she asked: a window and a sill with four painted pots, plants that droop and lose leaves as they dry (11 s from full to dry), posts every 1.1 s that last 2.4 s (the thirstiest friend posts more often, so it's hard but fair), a heart or "haha" to water, the quiet friend at 14 s with "hey, you ok?", and every plant flowering at the end. Helena played it (step 2 done) and asked for bigger plants and posts all over the screen (done). Next: tune difficulty if needed (step 3).

## The idea

### From the brief

4 friends shown as flames or plants with bars that drain. Micro-taps (like, haha, react to a story) refill them. Win if no flame goes out in 45 s.

### What we agreed

- **What the player sees:** four pots on a windowsill, each with a friend's name and face. When their streak drops the plant droops and loses leaves; when you look after it, it straightens up and flowers.
- **What the player does:** now and then something a friend posts pops up over their plant (a story, a photo, a meme) with two little buttons: a heart or a "haha". Reacting waters their plant and it straightens up. Posts disappear after a while, so you keep an eye on all four.
- **The social twist:** halfway, one friend goes quiet (busy or sad): their plant dries up but there's nothing to react to. A "hey, you ok?" button appears on their pot; if you write to them, they answer "thanks for checking on me" and the plant flowers. Sometimes friendship means making the first move.
- **How you win:** keep all four plants alive for 45 seconds; at the end they all flower.
- **How you lose:** any plant dries out completely ("Mia's plant dried out…").
- **How long it lasts:** 45 seconds.

## Decisions

- 01/11/2026: Helena: bigger plants, and posts anywhere on the screen to make it harder. Posts now pop up at random spots (not over their plant) with the friend's face and name, so you have to see whose it is.
- 01/11/2026: friends as plants on a windowsill (rejected: streak flames).
- 01/11/2026: you water a plant by reacting to that friend's post (rejected: clicking the plant with a watering can).
- 01/11/2026: social twist: a friend goes quiet and you have to write to them first (rejected: a fifth pot, yours, that friends water at the end).
- 01/11/2026: one dried plant and you lose (rejected: allowing one).
- 01/11/2026: Helena: it should be a bit hard (plants dry fast, posts don't last long).

## Open questions

_None yet._

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=11
- Files: `level.js` (texts, settings, posts, plants and the minigame), `level.css` (its look)
