# Level 03 · Spot the Impostor

**Signal:** We don’t need everyone. We need our people
**Closing line:** “You spot your people at a glance.”
**Unlocks for the avatar:** hair: Mohawk, hat: Beanie

This file is the level's notebook: what we agreed, what is done and what comes next.
Claude keeps it up to date in plain words while working on the level with Helena.

## Progress

Tick a step only when Helena agrees it is done.

- [x] 1. Idea agreed: what the player sees and does, the social twist, how you win or lose
- [ ] 2. First playable version: simple shapes, playable from start to end
- [ ] 3. Rules and difficulty tuned: it feels right to play
- [ ] 4. Look and feel: final art in the Signals style, with animations
- [ ] 5. Texts and details: final texts, and sound or vibration if wanted
- [ ] 6. Finished: Helena has played it and approves it

## Where we left off

29/10/2026: idea agreed with Helena (step 1). First playable version built straight away with full art (as with level 2): six tribes (skaters, gamers, otakus, punks, posh kids, sporty kids), each in its own place and carrying its own thing (skateboard, controller, plushie, fist up, coffee, ball); 5 rounds from 6 to 10 people and 6 to 4 seconds; the last round where you're the impostor and pick your group. Every attempt has other tribes, order and people. Next: Helena plays it (to tick step 2), then we tune difficulty (step 3).

## The idea

### From the brief

A group of 8–10 characters from one urban tribe (skaters, punks, otakus, posh kids, gamers, sporty kids) with one from another tribe. Tap the impostor. 5 rounds of 5 s.

### What we agreed

- **What the player sees:** a group from one urban tribe in its own place (e.g. skaters at the skatepark, gamers in a gaming café), drawn as avatars dressed for the tribe and each doing their own thing (chatting, looking at the phone, doing tricks). One of them doesn't fit, by their clothes or what they're doing. Each round is a different tribe and place.
- **What the player does:** tap the one who doesn't belong.
- **The social twist:** in the last round the impostor is you: your own avatar appears in a group that isn't yours, and you have to find your people. Several groups appear and you choose the one you fit with, by how you're dressed. (Idea to explore: the tribe you choose gets saved on your avatar.)
- **How you win:** reach the end and, in the last round, find your own group. That last round can't be lost: it's the reward, not a test.
- **How you lose:** each round has a few seconds to find the impostor. Tapping someone who belongs, or running out of time, costs a heart. 3 mistakes allowed; the 4th ends the game (like level 2).
- **How long it lasts:** 5 rounds that get faster and harder (the first gives 6 seconds and few people; the last gives 4 seconds, more people and a better-hidden impostor), then the final round. About 35–40 seconds.

## Shares its mechanic

Same mechanic family as **level 18 (Odd One Out)**. The shared part is built in `src/mechanics/odd-one-out.js` (placing a group over a scene, the hearts with a short grace after each mistake); level 18 reuses it.

## Decisions

- 29/10/2026: the player sees a group of one tribe hanging out in its own place (not a grid of faces), a different tribe and place each round.
- 29/10/2026: social twist: in the last round you are the impostor and must find your own group (rejected: a sad reaction when you tap someone who does belong).
- 29/10/2026: 3 mistakes allowed (wrong tap or time up), the 4th loses, like level 2; the last round (finding your group) can't be lost (rejected: no losing, only points).
- 29/10/2026: 5 rounds that get faster and harder (6 s down to 4 s, more people, subtler impostor), then the final round (rejected: 5 equal rounds of 5 s).

## Open questions

_None yet._

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=3
- Files: `level.js` (texts, settings and the minigame), `tribes.js` (how each tribe dresses and how impostors are made), `people.js` (the people, front-on, with what they carry), `places.js` (where each tribe hangs out), `level.css` (its look and animations)
