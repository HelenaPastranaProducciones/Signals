# Level 08 · Idle Chat

**Signal:** Socialising doesn’t always require energy
**Closing line:** “You don’t need to say much to be there.”
**Unlocks for the avatar:** glasses: Shutter

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

01/11/2026: idea agreed with Helena (step 1). First playable version built straight away in the painted look: a dark bedroom with you in bed (sleepy eyes, then closed), the group chat on a big phone with messages from four random friends, three drawn reactions (heart, "lol", star) under the latest message, a glow bar that empties in 8 s and darkens the room, and the goodnight messages at the end. Next: Helena plays it (to tick step 2), then we tune difficulty (step 3).

## The idea

### From the brief

One tap starts a group conversation that runs by itself. Every 5 s, one tap keeps it alive. 45 s with minimal effort.

### What we agreed

- **What the player sees:** you lying on your bed at night, half asleep, phone in hand; next to you, big, the group chat with friends' messages coming in by themselves.
- **What the player does:** nothing much: the conversation goes on by itself. If you stay quiet for a while the chat fades (the phone dims, friends write less). To keep it alive you tap one of three small drawn reactions under the latest message (a heart, a "lol", a sticker): any of them, no typing.
- **The social twist:** at the end your eyes close and the screen darkens, but your friends keep the chat going for you and say "goodnight!". The group carries you when you have no energy left.
- **How you win:** keep the chat alive for the 45 seconds; then you fall asleep and your friends say goodnight.
- **How you lose:** the chat's glow fades slowly (about 8 seconds from full to dark) and every reaction fills it again; if it reaches zero you lose ("The chat went quiet…").
- **How long it lasts:** 45 seconds.

## Decisions

- 01/11/2026: you on your bed at night with the group chat big beside you (rejected: only the chat screen).
- 01/11/2026: you keep it alive by tapping one of three quick reactions (rejected: one single button).
- 01/11/2026: social twist: you fall asleep and your friends keep the chat going and say goodnight (rejected: a friend sharing a rough day).
- 01/11/2026: you lose if the chat's glow goes out completely (about 8 s without reacting) (rejected: no losing at all).

## Open questions

_None yet._

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=8
- Files: `level.js` (texts, settings, the chat lines and reactions, and the minigame), `level.css` (its look)
