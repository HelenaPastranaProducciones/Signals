# Level 04 · Claw Machine

**Signal:** Digital generation. Physical objects. Physical comeback
**Closing line:** “You can touch them. That’s why they matter.”
**Unlocks for the avatar:** neck & body: Cassette

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

29/10/2026: idea agreed with Helena (step 1). First playable version built straight away with full art (as with levels 2 and 3): a front-facing claw machine with a random colour, 9 objects in a pile (6 physical: polaroid, vinyl, cassette, film camera, zine; 3 digital: phone, tablet, smartwatch), 5 coins, the claw swinging faster each try, a tray with your prizes on the front panel. Then, at Helena's request, the machine fills the whole screen and the friend's messages pop up like in level 1. After the first try the friend asks for one object, marked with a heart. Helena played it (step 2 done) and asked for it a bit harder: faster claw and you have to aim more precisely. Next: she tries it again (step 3).

## The idea

### From the brief

Move the claw and grab polaroids, vinyls and cassettes, avoiding digital objects. 3 physical objects in 5 tries. Each one shows a dedication.

### What we agreed

- **What the player sees:** a claw machine seen from the front, like a real fairground one: the glass, the pile of objects inside and the claw at the top.
- **What the player does:** the claw moves by itself from side to side; you press (click or space) to drop it at the right moment. If it lands on an object it grabs it and carries it to the prize chute.
- **The social twist:** halfway through, a friend sends you a message asking for one specific physical object in the machine ("Can you get me that polaroid?"). If you win it, you give it to them and they reply happily.
- **How you win:** get 3 physical objects (polaroids, vinyls, cassettes) in 5 tries, and one of them must be the one your friend asked for (marked with a heart inside the machine).
- **How you lose:** running out of tries before that ("Out of coins…"). Grabbing a digital object (phone, tablet…) or missing wastes a try.
- **How long it lasts:** no clock: the limit is the 5 tries (coins). Each try takes about 6–8 seconds, so about 40 seconds in all. The claw moves a little faster on each try.

## Decisions

- 29/10/2026: the machine is seen from the front (rejected: seen from above, harder to read at a glance).
- 29/10/2026: the claw moves by itself and you press to drop it, so timing is the skill and it works the same on phone (rejected: moving it yourself with arrows or the mouse).
- 29/10/2026: social twist: a friend asks you for a specific object and you win it for them (rejected: every object carries a handwritten dedication from a friend).
- 29/10/2026: to win you need 3 physical objects in 5 tries, one of them your friend's (rejected: the friend's object as an optional extra).
- 29/10/2026: no clock, only the 5 tries; the claw speeds up a little each try (rejected: a 45-second clock as well).
- 29/10/2026: Helena: the machine fills the whole screen (the coins and your prizes are now on its front panel; the side column with the chat and your avatar is gone), and the friend's messages pop up over the machine like the chat bubbles in level 1.
- 29/10/2026: Helena: a bit harder. The claw swings faster (34 instead of 28, and 9 faster each try instead of 7) and you have to drop it more precisely over an object (3 instead of 4.5).## Open questions

_None yet._

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=4
- Files: `level.js` (texts, settings and the minigame), `objects.js` (the objects inside the machine), `level.css` (its look and animations)
