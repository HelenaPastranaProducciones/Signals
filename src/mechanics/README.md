# Shared mechanics

Game mechanics used by more than one level live here, so they are built once
and reused. Each level keeps its own art, texts, settings and special rule.

Planned (from the brief):

| Mechanic | Levels | Notes |
|----------|--------|-------|
| Match-3 board | 6 Club Crest Match-3, 17 Collectibles Match-3 | Swap neighbours to line up 3+. Level 6 fills a fan bar per combo; level 17 gives a bonus for combos joining two generations. |
| Odd one out / patterns | 3 Spot the Impostor, 18 Odd One Out | **Built** in `odd-one-out.js` with level 3: `spreadOut(count, floor)` places a group over a scene, `createLives(box, settings)` draws the hearts (mistakes allowed, with a short grace after each lost heart). Level 18 reuses them for its own rounds. |

Build a mechanic here when the first level that needs it reaches step 2
(first playable version), as a module that takes the level's `game` toolbox
and its settings, e.g. `createMatch3(game, { pieces, onCombo })`.
