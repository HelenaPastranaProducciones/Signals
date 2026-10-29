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

29/10/2026: own side-view runner (runner.js) in the cute style; random somersaults; game over / level complete shown over the frozen game. Later the same day: every hair style, hat, earring, glasses and neck piece redrawn for the side view (ear always visible, glasses and headphones reach the ear, hair with a clean hairline), and every attempt is now a different run (places, their order, sky, friends, chat messages, obstacle sizes). Next: Helena plays it (to tick step 2), then we tune difficulty (step 3).

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
- 28/10/2026 (after playing the first version):
  - The avatar must look like a character: with arms and legs, and smooth running and jumping animations.
  - The landscape changes little by little and is more developed; the obstacles are varied, not always the same.
  - Mechanics inspired by the offline runner game in Chrome: you can also duck (for things flying at head height).
  - Chat bubbles are bigger and appear in random places on the screen, never covering the path.
  - The run lasts 45 seconds.
  - The friends waiting at the finish are avatars like yours, with random looks.
- 29/10/2026 (after playing the second version):
  - The mouse only replies to messages (clicking a message made you jump by accident). Jump and duck with the keyboard.
  - The runner is its own character, drawn side-on like in 2D platform games, with better proportions; it keeps the avatar's choices (skin, hair, hat, glasses, clothes…) but isn't the lobby picture with arms and legs.
  - Bigger, easier-to-see obstacles, with a higher jump to match.
  - Double jumps add up: you collect them by replying and spend them whenever you want, with a counter showing how many you have.
- 29/10/2026: the side-on runner looked ugly (giant head, bad hair). Decision: redo the avatar itself so it's cute, and use that same avatar to play (no separate runner drawing). The avatar editor was improved too.
- 29/10/2026 (later): Helena clarified that the editor avatar and the one you play with are different drawings of the same choices. This level has its own side-view runner (`runner.js`) in the cute style; the editor avatar faces front. Somersaults are now random (sometimes on a jump, more often on a double jump). Crashing shows a dizzy pose, then the game over appears over the frozen game.
- 29/10/2026: many avatar pieces looked wrong from the side. Redrawn for the side view: hair with a clean hairline that leaves the ear visible, a proper afro and mohawk, earrings hanging from the ear, glasses and headphones reaching the ear, chunkier caps and bucket hat, neck pieces in front of the chest, the bag on the hip.
- 29/10/2026: every attempt is a different run (Helena: "more random, different runs"). Random each time: which 3 places you run through (park, city, neighbourhood, shops) and in what order, where every tree, house or shop stands, the sky along the run (sunny day, morning, evening to night, cloudy), the clouds and hills, which 4 friends are in the chat (from a pool of 12) and their looks, the order of the chat messages (from a bigger list), and slightly different sizes for ground obstacles.

## Open questions

- On phones there is no keyboard: how will you jump and duck there? (To decide when we adapt the game to mobile.)

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=1
- Files: `level.js` (texts, settings and the minigame), `runner.js` (this level's side-view avatar, also used for the friends), `art.js` (obstacles, landscape), `level.css` (its look and animations)
