# Level 01 · Game & Chat

**Signal:** Gaming is no longer just playing
**Closing line:** “You were playing, but you were with them.”
**Unlocks for the avatar:** neck & body: Headphones

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

28/10/2026: idea agreed (step 1). First playable version built with simple shapes: runner with the player's avatar, red blocks as obstacles, chat bubbles top right, finish line with the friends after 50 s. Next: Helena plays it and says how it feels (to tick step 2), then tune it (step 3).

## The idea

### From the brief

Split screen: Flappy/tap runner and a group chat. You tap to jump and also tap friends' chat bubbles to reply. If you only play, your friends leave. Win by surviving 45 s with at least 3 replies.

### What we agreed

- **What the player sees:** the game fills the screen, and the group chat messages pop up as bubbles on top of the game, like an online game with a built-in chat.
- **What the player does:** a runner. The player's own customised avatar runs by itself; tap to jump over obstacles, and tap the chat bubbles to reply to friends.
- **The social twist:** friends don't leave. If you ignore a message, the bubble changes colour and the friend's emoji gets sad. If you reply, that friend helps you in the game (e.g. warns you about the next obstacle or gives you an extra jump). Too many unanswered messages makes you lose.
- **How you win:** reach the finish line at the end of the track, where your friends are waiting for you.
- **How you lose:** two ways: you crash into an obstacle, or you leave too many messages unanswered (first proposal: 3).
- **How long it lasts:** the finish line is reached in 1 minute at most.

## Decisions

- 28/10/2026: the chat goes on top of the game (bubbles over the game), not on a split screen.
- 28/10/2026: the game is a runner with the player's own avatar (so the avatar they customised is the one playing).
- 28/10/2026: social twist is a mix: ignored friends get upset (they don't leave), and friends you reply to help you in the game.
- 28/10/2026: you lose by crashing into an obstacle or by leaving 3 messages unanswered.
- 28/10/2026: no clock: you win by reaching a finish line where your friends wait for you, at most 1 minute away.

## Open questions

_None yet._

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=1
- Files: `level.js` (texts, settings and the minigame), `level.css` (its look, from step 2), `assets/` (images, if any)
