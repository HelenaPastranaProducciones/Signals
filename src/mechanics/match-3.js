import { randomInt } from "../engine/random.js";

/**
 * Shared Match-3 board (levels 6 Club Crest Match-3 and 17 Collectibles
 * Match-3). Swap two neighbouring pieces (drag one onto the other, or click
 * one and then the other); 3 or more of the same kind in a line disappear,
 * the pieces above fall and new ones drop in. Chains keep going by
 * themselves. Each level brings its own pieces, art and rule through
 * `drawPiece` and `onClear`.
 *
 * The board is drawn with HTML: one absolutely placed tile per piece, moved
 * with CSS transitions (the level styles `.m3-board` and `.m3-tile`).
 *
 * @param {{
 *   root: HTMLElement,
 *   size: number,
 *   kinds: number,
 *   drawPiece: (kind: number) => string,
 *   onClear: (cleared: { kind: number, count: number }[], chain: number) => void,
 *   canPlay: () => boolean,
 *   after: (ms: number, fn: () => void) => unknown,
 *   listen: (target: EventTarget, type: string, fn: (event: any) => void) => unknown,
 * }} options
 *   `onClear` gets, for every line cleared, its kind and length; `chain` is 1
 *   for the swap itself and goes up with every fall that matches again.
 *   `after` and `listen` are the level's `game.after` and `game.listen`.
 */
export function createMatch3({ root, size, kinds, drawPiece, onClear, canPlay, after, listen }) {
  const SWAP_MS = 170;
  const FALL_MS = 230;
  /** @type {({ kind: number, el: HTMLElement } | null)[][]} grid[row][col] */
  let grid = [];
  let busy = false;
  let selected = null;

  root.classList.add("m3-board");
  root.style.setProperty("--size", String(size));

  const place = (piece, row, col) => {
    piece.el.style.left = `${(col * 100) / size}%`;
    piece.el.style.top = `${(row * 100) / size}%`;
    piece.el.dataset.row = String(row);
    piece.el.dataset.col = String(col);
  };

  const makePiece = (kind, row, col, fromRow = row) => {
    const el = document.createElement("div");
    el.className = "m3-tile";
    el.innerHTML = drawPiece(kind);
    root.append(el);
    const piece = { kind, el };
    place(piece, fromRow, col);
    return piece;
  };

  // A first board without any line of 3 already made.
  for (let row = 0; row < size; row += 1) {
    grid.push([]);
    for (let col = 0; col < size; col += 1) {
      let kind;
      do kind = randomInt(0, kinds - 1);
      while ((col >= 2 && grid[row][col - 1].kind === kind && grid[row][col - 2].kind === kind) ||
        (row >= 2 && grid[row - 1][col].kind === kind && grid[row - 2][col].kind === kind));
      grid[row].push(makePiece(kind, row, col));
    }
  }

  /** Every line of 3+ on the board: { kind, cells: [[row, col]…] }. */
  function findLines() {
    const lines = [];
    const scan = (get, outer, inner) => {
      for (let a = 0; a < outer; a += 1) {
        let run = [];
        for (let b = 0; b <= inner; b += 1) {
          const cell = b < inner ? get(a, b) : null;
          if (cell && run.length && grid[run[0][0]][run[0][1]].kind === grid[cell[0]][cell[1]].kind) run.push(cell);
          else {
            if (run.length >= 3) lines.push({ kind: grid[run[0][0]][run[0][1]].kind, cells: run });
            run = cell ? [cell] : [];
          }
        }
      }
    };
    scan((row, col) => [row, col], size, size);
    scan((col, row) => [row, col], size, size);
    return lines;
  }

  /** True if some swap would make a line (so the player is never stuck). */
  function hasMove() {
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        for (const [dr, dc] of [[0, 1], [1, 0]]) {
          const r2 = row + dr;
          const c2 = col + dc;
          if (r2 >= size || c2 >= size) continue;
          swapCells(row, col, r2, c2);
          const ok = findLines().length > 0;
          swapCells(row, col, r2, c2);
          if (ok) return true;
        }
      }
    }
    return false;
  }

  function swapCells(r1, c1, r2, c2) {
    [grid[r1][c1], grid[r2][c2]] = [grid[r2][c2], grid[r1][c1]];
  }

  /** Clears the lines, lets pieces fall, drops new ones, and repeats while lines keep forming. */
  function resolve(chain) {
    const lines = findLines();
    if (!lines.length) {
      if (!hasMove()) reshuffle();
      busy = false;
      return;
    }
    onClear(lines.map((line) => ({ kind: line.kind, count: line.cells.length })), chain);
    const gone = new Set(lines.flatMap((line) => line.cells.map(([r, c]) => `${r},${c}`)));
    gone.forEach((key) => {
      const [r, c] = key.split(",").map(Number);
      grid[r][c].el.classList.add("m3-pop");
    });
    after(FALL_MS, () => {
      gone.forEach((key) => {
        const [r, c] = key.split(",").map(Number);
        grid[r][c].el.remove();
        grid[r][c] = null;
      });
      // Gravity, column by column; new pieces drop in from above the board.
      for (let col = 0; col < size; col += 1) {
        let write = size - 1;
        for (let row = size - 1; row >= 0; row -= 1) {
          if (grid[row][col]) {
            const piece = grid[row][col];
            grid[row][col] = null;
            grid[write][col] = piece;
            place(piece, write, col);
            write -= 1;
          }
        }
        for (let row = write, n = 1; row >= 0; row -= 1, n += 1) {
          grid[row][col] = makePiece(randomInt(0, kinds - 1), row, col, -n);
        }
      }
      // Let the new pieces appear above the board before falling into place.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        for (let row = 0; row < size; row += 1) for (let col = 0; col < size; col += 1) place(grid[row][col], row, col);
      }));
      after(FALL_MS + 60, () => resolve(chain + 1));
    });
  }

  function reshuffle() {
    do {
      const kindsNow = grid.flat().map((piece) => piece.kind).sort(() => Math.random() - 0.5);
      grid.flat().forEach((piece, i) => {
        piece.kind = kindsNow[i];
        piece.el.innerHTML = drawPiece(piece.kind);
      });
    } while (findLines().length || !hasMove());
  }

  function trySwap(r1, c1, r2, c2) {
    if (busy || !canPlay() || Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return;
    busy = true;
    swapCells(r1, c1, r2, c2);
    place(grid[r1][c1], r1, c1);
    place(grid[r2][c2], r2, c2);
    after(SWAP_MS, () => {
      if (findLines().length) return resolve(1);
      // No line: the two pieces go back.
      swapCells(r1, c1, r2, c2);
      place(grid[r1][c1], r1, c1);
      place(grid[r2][c2], r2, c2);
      grid[r1][c1].el.classList.add("m3-nope");
      grid[r2][c2].el.classList.add("m3-nope");
      after(SWAP_MS, () => {
        grid[r1][c1].el.classList.remove("m3-nope");
        grid[r2][c2].el.classList.remove("m3-nope");
        busy = false;
      });
    });
  }

  const select = (el) => {
    root.querySelector(".m3-selected")?.classList.remove("m3-selected");
    selected = el;
    el?.classList.add("m3-selected");
  };

  // Input: drag a piece onto a neighbour, or click one and then the other.
  let dragFrom = null;
  listen(root, "pointerdown", (event) => {
    const tile = event.target.closest(".m3-tile");
    if (!tile || busy || !canPlay()) return;
    const r = Number(tile.dataset.row);
    const c = Number(tile.dataset.col);
    if (selected && selected !== tile) {
      const r0 = Number(selected.dataset.row);
      const c0 = Number(selected.dataset.col);
      select(null);
      if (Math.abs(r0 - r) + Math.abs(c0 - c) === 1) return trySwap(r0, c0, r, c);
    }
    select(tile);
    dragFrom = { r, c, x: event.clientX, y: event.clientY };
  });
  listen(window, "pointermove", (event) => {
    if (!dragFrom) return;
    const dx = event.clientX - dragFrom.x;
    const dy = event.clientY - dragFrom.y;
    const cell = root.clientWidth / size;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < cell * 0.4) return;
    const [dr, dc] = Math.abs(dx) > Math.abs(dy) ? [0, Math.sign(dx)] : [Math.sign(dy), 0];
    const { r, c } = dragFrom;
    dragFrom = null;
    select(null);
    if (r + dr >= 0 && r + dr < size && c + dc >= 0 && c + dc < size) trySwap(r, c, r + dr, c + dc);
  });
  listen(window, "pointerup", () => (dragFrom = null));

  return {
    /** Where a cell is on screen (for effects that fly from the board). */
    rectOf: (row, col) => grid[row]?.[col]?.el.getBoundingClientRect(),
  };
}
