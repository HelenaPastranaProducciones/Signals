# Level 17 · Collectibles Match-3

**Signal:** The object is an excuse to connect
**Closing line:** “An object, and suddenly there’s something to talk about.”
**Unlocks for the avatar:** neck & body: Crossbody bag

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

Same engine as 6, with tazos, trading cards, Labubus and Tamagotchis. Combos that join two generations give a bonus. 5 cross-generation combos.

### What we agreed

- **What the player sees:** The same Match-3 board as level 6, on a painted desk, with collectibles from two generations: three from an older sibling's childhood on warm tiles (tazo, trading card, pocket pet) and three from today on cool tiles (blind-box figure, enamel pin, photocard). All invented. A small chat beside the board.
- **What the player does:** Swaps two pieces side by side to make lines of 3 or more. A line of one generation right after a line of the other is a combo; a label on top shows which generation to match next.
- **The social twist:** An older sibling (or cousin) is in the chat: they recognise the old ones ("omg TAZOS, I had a whole tin of them"), ask about the new ones, and you end up planning a swap night together.
- **How you win:** Make 5 combos across generations.
- **How you lose:** The time runs out first.
- **How long it lasts:** 45 seconds.

## Shares its mechanic

Same engine as **level 6 (Club Crest Match-3)**: reuse the Match-3 engine in `src/mechanics/` and change only the art and this level's own rule.

## Decisions

- 01/11/2026: Helena approved the idea proposed by Claude (collectibles from different generations, an older sibling comments in the chat) and asked to build it straight away. A combo = a line of one generation right after a line of the other.

## Open questions

_None yet._

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=17
- Files: `level.js` (rules and chat), `art.js` (the six painted collectibles), `level.css`; the board is shared with level 6 (`src/mechanics/match-3.js`)
