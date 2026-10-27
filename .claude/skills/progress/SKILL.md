---
name: progress
description: Show Helena how far the Signals game is, level by level, and suggest what to do next. Use when she asks where things stand or what to do, e.g. "/progress", "com anem?", "què toca fer?", "where are we?", "what's left?", or when a conversation starts with a vague greeting.
---

# Where the project stands

1. Run `npm run status`. It reads each level's notebook
   (`src/levels/NN-name/README.md`) and lists the six-step progress and where
   each started level was left.
2. Tell Helena, in her language and in plain words:
   - how many levels are finished, in progress and not started (one line);
   - the levels in progress, each with its step and the next thing to do;
   - **one** recommendation for what to do now, with the reason. Usually:
     continue the level that is furthest along. If none is started, start
     with level 1 (it is the first one players see, and the brief marks it as
     the first to build). Otherwise suggest a level that shares a mechanic
     with a finished one (3 and 18, 6 and 17), since part of the work is
     already done.
3. Ask whether she wants to go with your suggestion or choose another level.
   When she picks one, follow the `level` skill.

Keep it short: a few lines, no tables unless she asks for the full list.
Mention any open question from CLAUDE.md ("Open questions") that blocks the
recommended work, if there is one.
