# Level 06 · Club Crest Match-3

**Signal:** Fandoms turn interests into communities
**Closing line:** “A shared interest, and we’re a community.”
**Unlocks for the avatar:** face: Star sticker, top: Jersey

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

01/11/2026: idea agreed with Helena (step 1). First playable version built straight away in the painted look: a 7×7 board of six invented club crests (Lions, Waves, Comets, Roses, Pines, Bolts), your club marked with a yellow dot, a fan bar of 70 fans, the stand filling with painted fans in the colours of the crests you match, and the whole stand chanting your club's name when it's full. 40 seconds. The Match-3 engine is shared (src/mechanics/match-3.js) for level 17. Helena played it and liked it (step 2 done, 01/11/2026). Next: tune difficulty if needed (step 3).

## The idea

### From the brief

Match-3 with football club crests. Each combo fills a fan bar; when it's full, the crests form a stand with chants. 40 s.

### What we agreed

- **What the player sees:** a board of invented club crests in front, and a stadium behind it with an empty stand. Every match brings fans (painted avatars) into the stand, with scarves and flags in the colour of the crest matched.
- **What the player does:** swap two neighbouring crests (drag, or click one then the other); 3 or more equal in a line disappear and new ones fall. Matching 4–5 at once or chaining falls brings more fans into the stand.
- **The social twist:** you have your own club (one of the invented crests, different each attempt) and you are in the stand wearing its shirt. Matches of your crest fill the fan bar more. When the bar is full, the whole stand stands up and chants with you, scarves up and the club's name.
- **How you win:** fill the fan bar before the clock runs out; the stand chants with you.
- **How you lose:** the 40 seconds run out before the bar is full ("The stand stayed half empty…").
- **How long it lasts:** 40 seconds.

## Shares its mechanic

Same engine as **level 17 (Collectibles Match-3)**: build the Match-3 engine in `src/mechanics/` and change only the art and this level's own rule.

## Decisions

- 01/11/2026: the board in front and the stand filling up behind it (rejected: only the board, with the stand as a reward at the end). Crests are invented, never real clubs.
- 01/11/2026: classic swap-two-neighbours match-3 (rejected: clicking groups of touching crests).
- 01/11/2026: social twist: your club, and the whole stand ends up chanting with you (rejected: a rival fan taunting you).
- 01/11/2026: against the clock, 40 seconds to fill the fan bar (rejected: a limited number of moves).

## Open questions

_None yet._

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=6
- Files: `level.js` (texts, settings and the minigame), `art.js` (the clubs and their crests), `level.css` (its look); the board itself is `src/mechanics/match-3.js`
