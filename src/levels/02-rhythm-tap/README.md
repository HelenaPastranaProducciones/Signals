# Level 02 · Rhythm Tap

**Signal:** Music creates connection
**Closing line:** “Alone, a note. Together, a song.”
**Unlocks for the avatar:** hair: Afro, top: Band tee

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

29/10/2026: idea agreed (step 1). First playable version built directly with full art (Helena asked to keep the same look and detail as level 1): Piano Tiles with the arrow keys on top; below, the band on a stage with lights, speakers and a crowd; an original song played live by the game (drums, bass, keyboard and vocals by themselves, your guitar when you hit); the party's colour, lights, crowd and band movement follow how well you play. Later the same day: every attempt is a different show (song, band, crowd), and a bigger, more detailed crowd seen from behind. Next: Helena plays it (to tick step 2), then we tune difficulty (step 3).

## The idea

### From the brief

Piano Tiles with 4 lanes, each a band instrument (drums, bass, guitar, vocals). You control one and the others play by themselves. Hit 70% of the notes.

### What we agreed

- **What the player sees:** split screen: the Piano Tiles game on top, and below it the band playing: you on guitar, your friends singing, on piano and on drums (only an animation).
- **What the player does:** Piano Tiles with 4 columns: hit the notes as they reach the line. Keyboard: the 4 arrow keys, one per column (← ↓ ↑ →). On phones (later): tap the notes.
- **The social twist:** the band shows how you're playing, only visually: when you hit notes the party gets livelier; when you miss, it loses energy a little (and the other way round).
- **How you win:** reach the end of the song (about 30 s) without running out of lives.
- **How you lose:** you have 3 mistakes allowed; the 4th mistake ends the song.
- **How long it lasts:** about 30 seconds.

## Decisions

- 29/10/2026: Piano Tiles of about 30 s on top; below, the band (you on guitar, friends on vocals, piano and drums), whose mood follows how well you play. Purely visual.
- 29/10/2026: lives instead of a percentage: 3 mistakes allowed, the 4th loses.
- 29/10/2026: played with the arrow keys on computers; tapping on phones (when we adapt the game to mobile).
- 29/10/2026: keep the same look and level of detail as level 1 in everything: instruments, setting, music. The song is original and made by the game itself (no sound files).
- 29/10/2026: every attempt is a different show (Helena: "more random, different runs"). Random each time: the chords, the key, the speed (a little faster or slower), the drum groove, the vocal melody and the notes to hit (still getting busier towards the end), which 3 friends are in the band and their looks, and the whole crowd.
- 29/10/2026: the crowd looked cheap. Now two rows of fans seen from behind, drawn from random avatars (hair, hats, headphones, cat ears, clothes with numbers or stripes), in the same clay style; the back row smaller and in shadow. Some film with their phones or wave light sticks, and lower them when the party fades.

## Open questions

_None yet._

## Try it

- Online: https://helenapastranaproducciones.github.io/Signals/?level=2
- Files: `level.js` (texts, settings and the minigame), `band.js` (the band members and the crowd), `music.js` (the song and the sounds), `level.css` (its look and animations)
