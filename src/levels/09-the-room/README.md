# Level 09 · The Room

**Signal:** The group chat is a place
**Closing line:** “The chat is where we meet.”
**Unlocks for the avatar:** head extra: Star clips, backdrop: Room

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

01/11/2026: idea agreed with Helena (step 1). First playable version built straight away in the painted look: a painted room (door, window, poster, TV, rug, random colours) with the group chat's name on a sign, a sofa of three, two beanbags and two floor cushions, you standing in the middle, friends arriving every 2.6 s with a "hi?" and a patience timer (7 s), dragging them onto a seat, the shy newcomer (4.5 s) once 3 are seated, an extra cushion when they're welcomed, and chat bubbles over everyone at the end. Helena played it and asked for chat-style bubbles (done; step 2 done, 01/11/2026). Next: tune difficulty if needed (step 3).

## The idea

### From the brief

A room seen from above, Habbo style. Friends come in through the door; tap to greet them and they sit down. You need 6 seated; you lose if 3 leave.

### What we agreed

- **What the player sees:** a room seen diagonally from above (two walls and the floor) with a sofa, beanbags, a rug and a TV; you in the middle; friends come in through the door, seen whole with their editor faces. A sign on the wall shows the name of your group chat, as if the room were the chat.
- **What the player does:** friends appear at the door, one or two at a time, each with a "hi?" bubble and a ring that empties (their patience). You drag each one to a free seat (sofa, beanbag, floor cushion…) and they sit down. If you take too long they leave ("Leo left the chat").
- **The social twist:** halfway, someone new comes in: not from the group (a friend's cousin, someone new from class). They're shy and have less patience. If you seat them, the group welcomes them and a new seat appears. The chat is also a place where new people come in.
- **How you win:** 6 people seated (the newcomer counts too); then chat bubbles fill the room over everyone's heads: the room is the chat.
- **How you lose:** 3 people leave ("Everyone left the chat…").
- **How long it lasts:** no clock; about 40–50 seconds depending on how you play.

## Decisions

- 01/11/2026: Helena: what people say should look like a messaging-app group chat. Speech is now chat bubbles (white, with a little tail, the sender's name in their colour, the time and two blue ticks) with chat-like lines ("heyyy can I come in?", "who's bringing snacks??"); the notices at the bottom look like the chat's system messages ("Leo left", "Zoe joined via invite link").
- 01/11/2026: the room seen diagonally from above, with the chat's name on the wall (rejected: straight from above, like a floor plan).
- 01/11/2026: you drag each friend to a seat you choose (rejected: one click to greet and they sit by themselves).
- 01/11/2026: social twist: someone new comes in halfway, shy and less patient; seat them and the group welcomes them and a seat is added (rejected: friends asking to sit next to someone).
- 01/11/2026: 6 seated to win, 3 leaving to lose, no clock (rejected: a 45-second clock as well).

## Open questions

_None yet._

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=9
- Files: `level.js` (texts, settings, seats and the minigame), `art.js` (the room, the seats and the chat names), `level.css` (its look)
