---
name: level
description: Work on one Signals level with Helena, step by step, guiding her as a complete beginner. Use whenever she wants to start, continue, change, tune, look at or finish a level, e.g. "/level 7", "let's work on level 3", "vull treballar el nivell 5", "continuem amb el 2", "el nivell 1 és massa difícil", "can we change how the chat level looks".
---

# Working on a level with Helena

Helena is the author of Signals and **does not know anything about
software**. You do all the technical work; she brings the ideas, taste and
decisions. Read the "Working with Helena" section of CLAUDE.md first: it has
the communication rules. This skill is the procedure.

The level's `README.md` (in `src/levels/NN-name/`) is its **notebook**: the
brief, what was agreed, the six-step progress checklist, where you left off,
decisions and open questions. Keep it current; it is how the next session
knows where things stand. The technical guide is `src/levels/README.md`.

## 1. Open the level

1. Work out which level she means. If unclear, run `npm run status` and ask
   with a short list ("Which one? 1 Game & Chat, 2 Rhythm Tap, …").
2. Read the level's `README.md` and `level.js`. If the level shares its
   mechanic with another (3 and 18, 6 and 17), read that one's notebook too.
3. Greet her with where the level stands, in two or three short sentences:
   which step it is on (e.g. "step 2 of 6"), what was decided last time, and
   **one** proposed next thing to do. Then ask if she wants to do that or
   something else.

## 2. Follow her, guided by the steps

The six steps are a guide, not a cage. If she wants to talk about colours
while the rules are still open, go with her: note it in the notebook, do it
if it's cheap, and say kindly what is still open. Never refuse because
"we're not at that step".

### Step 1: Idea agreed (no code)

Goal: fill "What we agreed" in the notebook. Walk through it one question at
a time, each with 2–3 concrete options and your recommendation:

- What does the player see? ("A split screen: a little runner on the left
  and a group chat on the right. Or the chat on top of the game?")
- What does the player do? (tap, drag, remember, choose…)
- What is the social twist, and when does it appear?
- How do you win? How do you lose (or can't you)?
- How long does it last?

Start from the brief's proposal (in the notebook) and her signal. When an
answer is settled, write it down immediately. At the end, read the whole
idea back to her in a few plain sentences and ask: "Is this it?" Only when
she says yes, tick step 1.

### Step 2: First playable version

1. Tell her what she will get: "a rough version with simple shapes, just to
   feel how it plays; the drawings come later".
2. Build it (technical guide: start from `src/levels/_template`). Every
   number that changes the feel goes in `settings`.
3. Check it yourself (see "Saving and publishing" below), then publish and
   give her the direct link `https://helenapastranaproducciones.github.io/Signals/?level=N`,
   plus a screenshot if you can send files.
4. Ask her to play it a few times and tell you how it felt, in her own words.
   Offer examples: "too fast? too easy? confusing? boring? fun?".

Tick step 2 when it is playable from start to end and she has tried it.

### Step 3: Rules and difficulty tuned

Turn her feelings into small changes, **one at a time**:
- "It's too hard" → propose one change: "I can give you 60 seconds instead
  of 45, or ask for 2 replies instead of 3. Which do you prefer?"
- Say what you changed in her terms ("now you have 60 seconds"), never
  "I changed `duration`".
- Publish, ask her to try again. Repeat until she says it feels right.

Write each tuning decision in the notebook (e.g. "27/10: 60 seconds instead
of 45, it felt rushed").

### Step 4: Look and feel

1. Before drawing, describe the plan in words, short: what will appear and
   how it moves. Ask if she has reference images. She can attach pictures to
   the chat, and they are only inspiration: never copy real characters or
   brands.
2. Keep the Signals style (CLAUDE.md, "Decisions already made"): 2D that
   looks like vinyl/clay toys, rounded shapes, soft light and shadow,
   saturated colours on pastel backgrounds. Use the clay SVG kit so it
   matches the avatar.
3. Show results with screenshots; adjust one thing at a time.

### Step 5: Texts and details

Review together: the loading explanation, any texts inside the minigame, the
closing line. Ask about sound and vibration (an open question in CLAUDE.md).
Sound isn't implemented yet; if she wants it, explain that it's a bigger
shared task and agree whether to do it now.

### Step 6: Finished

Go through this with her:
- She has played it from start to end and both winning and losing work.
- It looks right on a computer; check phone size too (`npm run check -- N --mobile`).
- The notebook is complete and every open question is resolved.
Ask: "Shall we mark level N as finished?" Tick step 6 only on her yes.

## 3. Saving and publishing (after every agreed change)

Do this yourself every time something visible changed. She never runs anything.

1. `npm test`: must pass.
2. `npm run check -- N` (and `--mobile` when layout changed): no errors. Look
   at the screenshot in `screenshots/`. For interaction changes, also try the
   win and the loss (see the technical guide).
3. Update the notebook: progress ticks, "Where we left off", decisions.
4. Commit to `main` with a plain message ("Level 7: the sequence now grows up
   to 5 gestures") and push to `main`.
5. `npm run wait-deploy` until it reports Live (about a minute).
6. Tell her: "Saved and published. Try it here: <link>". If she doesn't see
   the change, ask her to reload the page.

If anything fails, fix it before telling her it's ready. If you can't, tell
her plainly that this change isn't online yet and what you're doing about it.

## 4. Closing the session

When she says she's done, or the conversation winds down:
- Update "Where we left off" with one or two sentences: what was done today
  and the next step.
- Make sure everything is saved and published.
- Tell her in one line what you'll pick up next time.

## Undoing

If she says "go back", "I liked it before", "desfés això": restore the
previous version (revert the relevant commit), publish, and confirm in plain
words ("It's back to how it was this morning"). Nothing she made is ever lost:
the history keeps every version.
