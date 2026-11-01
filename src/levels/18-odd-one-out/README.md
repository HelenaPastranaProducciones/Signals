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

01/11/2026: rebuilt as "the group photo" (option A) and published. Next: Helena plays it and says how it feels (step 2).

## The idea

### From the brief

Complete patterns that are the group's inside codes: emoji sequences, catchphrases, gestures. 4 patterns in 40 s.

_Note: Not in the Signals Journal PDF: the explanation text is provisional._

### What we agreed

- **What the player sees:** A group photo in a park, in a white print border, with 8 to 11 friends. On the side, the card with your group's code: its name (Team Toast, The Frogs, Lunch Table 4…), a little figure and three details: a pose, a hat and something round the neck, each in the group's colour. Every attempt invents a new group and code.
- **What the player does:** Before starting, reads the group's code. In every photo, everyone follows it except one person, who gets one small detail wrong (another pose, the hat or the neck piece in another colour): click them.
- **The social twist:** The code only makes sense inside the group: an outsider gives themselves away by one tiny detail. When you find all of them: "TEAM TOAST FOREVER".
- **How you win:** Find the outsider in 4 photos in 40 seconds.
- **How you lose:** 3 wrong clicks, or the time runs out.
- **How long it lasts:** 40 seconds.

## Shares its mechanic

Same mechanic family as **level 3 (Spot the Impostor)**. Reuse the shared part in `src/mechanics/` if level 3 is built first.

## Decisions

- 01/11/2026: Helena approved the idea proposed by Claude (the group's inside codes: complete the pattern or find who doesn't fit; 4 rounds in 40 seconds, 3 hearts) and asked to build it straight away. It uses the hearts shared with level 3.
- 01/11/2026: Helena played the first version (handshake sequences and catchphrases): hard to understand and too easy to find the outsider. Rebuilt with her option A, "the group photo": the code is shown first and stays in sight, and the outsider differs in one small detail. Rejected: B "in or out" (sorting people by the rules) and C "the group chat" (spotting who uses the inside jokes wrong).

## Open questions

_None yet._

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=18
- Files: `level.js` (the group code and the photos), `level.css`; hearts and the way people are spread out shared with level 3 (`src/mechanics/odd-one-out.js`)
