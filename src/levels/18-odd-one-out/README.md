# Level 18 · Odd One Out

**Signal:** Friend groups have their own culture
**Closing line:** “Only we know this code.”
**Unlocks for the avatar:** hair colour: Green

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

01/11/2026: first playable version built and published. Next: Helena plays it and says how it feels (step 2).

## The idea

### From the brief

Complete patterns that are the group's inside codes: emoji sequences, catchphrases, gestures. 4 patterns in 40 s.

_Note: Not in the Signals Journal PDF: the explanation text is provisional._

### What we agreed

- **What the player sees:** Your friend group's name on top (Team Toast, The Pigeons, Bus Stop Club…) on a painted sticker wall, and three hearts. Every attempt invents another group, with its own secret handshake and catchphrase.
- **What the player does:** Two kinds of rounds take turns. "Finish the code": the group's secret handshake is a sequence of moves (SNAP, CLAP, FIST…); click the move that comes next. "Who's not one of us?": five people say the group's catchphrase, one gets it slightly wrong ("toast time" instead of "toast o'clock"); click them.
- **The social twist:** The codes only make sense inside the group: an outsider gives themselves away by a tiny detail. When you get all the rounds right: "TEAM TOAST FOREVER".
- **How you win:** Get 4 rounds right in 40 seconds.
- **How you lose:** Make 3 mistakes, or the time runs out.
- **How long it lasts:** 40 seconds.

## Shares its mechanic

Same mechanic family as **level 3 (Spot the Impostor)**. Reuse the shared part in `src/mechanics/` if level 3 is built first.

## Decisions

- 01/11/2026: Helena approved the idea proposed by Claude (the group's inside codes: complete the pattern or find who doesn't fit; 4 rounds in 40 seconds, 3 hearts) and asked to build it straight away. It uses the hearts shared with level 3.

## Open questions

_None yet._

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=18
- Files: `level.js` (groups, codes and rules), `level.css`; hearts shared with level 3 (`src/mechanics/odd-one-out.js`)
