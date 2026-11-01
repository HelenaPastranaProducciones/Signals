import { defineLevel } from "../../engine/define-level.js";
import { pick, randomBetween, shuffle } from "../../engine/random.js";
import { randomFriends } from "../../data/friends.js";
import { escapeHtml } from "../../ui/html.js";
import { MEMORIES, screenshotSvg } from "./art.js";

/**
 * Level 19 · Jigsaw (the finale)
 * Design notes, progress and decisions: README.md in this folder.
 *
 * A screenshot of your group chat is cut into pieces and scattered on the
 * desk. Drag every piece to its place before the time runs out. The twist:
 * when it's done, the screenshot is printed as a polaroid and pinned on a
 * wall full of memories from every level of the game.
 */
export default defineLevel({
  number: 19,
  signal: "Digital culture leaves physical traces",
  minigame: "Jigsaw",
  // The PDF cuts the title off at "...leaves physical"; "traces" was added.
  explanation: "Online moments, memes and conversations can become physical objects: printed screenshots, meme stickers, photos. They give digital life a lasting presence.",
  closingLine: "Digital leaves a trace too.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    duration: 45, // seconds to finish the puzzle
    columns: 3,
    rows: 4,
  },

  play(game) {
    const s = game.settings;
    const friends = randomFriends(3);
    // Every attempt is a different run: another chat, cut and scattered differently.
    const image = screenshotSvg(escapeHtml(game.player.nickname), friends);
    const cells = [];
    for (let r = 0; r < s.rows; r++) for (let c = 0; c < s.columns; c++) cells.push({ r, c });

    game.root.innerHTML = `
      <div class="jigsaw">
        <div class="board" style="--cols:${s.columns};--rows:${s.rows}">${cells.map(() => `<i></i>`).join("")}</div>
        <div class="pieces"></div>
        <div class="wall" hidden></div>
        <div class="start">
          <b>Put the chat back together</b>
          <span>A screenshot of your group chat fell to pieces. <b>Drag</b> every piece to its place on the frame.</span>
          <span class="rules"><b>Win:</b> finish the screenshot in ${s.duration} seconds</span>
          <span class="rules"><b>Lose:</b> the time runs out first</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".jigsaw");
    const board = box.querySelector(".board");
    const tray = box.querySelector(".pieces");
    let placed = 0;
    let playing = false;
    let clock = null;

    const info = () => game.showInfo(`Pieces ${placed} / ${cells.length}`);
    info();

    // Pieces: each shows its part of the full image.
    tray.innerHTML = shuffle(cells).map(({ r, c }) =>
      `<div class="piece" data-r="${r}" data-c="${c}" style="--r:${r};--c:${c};rotate:${randomBetween(-8, 8).toFixed(0)}deg"><div class="image">${image}</div></div>`).join("");

    // Scatter them around the free part of the desk.
    const scatter = () => {
      const area = box.getBoundingClientRect();
      const frame = board.getBoundingClientRect();
      const wide = area.width > area.height;
      for (const piece of tray.querySelectorAll(".piece:not(.done)")) {
        const w = frame.width / s.columns;
        const h = frame.height / s.rows;
        let x, y;
        if (wide) {
          x = randomBetween(frame.right - area.left + 20, area.width - w - 10);
          y = randomBetween(10, area.height - h - 10);
        } else {
          x = randomBetween(10, area.width - w - 10);
          y = randomBetween(frame.bottom - area.top + 10, area.height - h - 10);
        }
        piece.style.left = `${x}px`;
        piece.style.top = `${y}px`;
      }
    };

    const sizePieces = () => {
      const frame = board.getBoundingClientRect();
      box.style.setProperty("--pw", `${frame.width / s.columns}px`);
      box.style.setProperty("--ph", `${frame.height / s.rows}px`);
      box.style.setProperty("--bw", `${frame.width}px`);
      box.style.setProperty("--bh", `${frame.height}px`);
    };
    // Measured when the game starts, once the level's look has loaded.
    const layOut = () => {
      sizePieces();
      scatter();
    };

    // Dragging.
    let drag = null;
    game.listen(box, "pointerdown", (event) => {
      const start = box.querySelector(".start");
      if (start) {
        start.remove();
        layOut();
        playing = true;
        clock = game.countdown(s.duration, () => {
          playing = false;
          game.lose("The chat is still in pieces… Try again!");
        });
        return;
      }
      const piece = event.target.closest(".piece:not(.done)");
      if (!piece || !playing) return;
      drag = { piece, x: event.clientX, y: event.clientY, left: parseFloat(piece.style.left), top: parseFloat(piece.style.top) };
      piece.classList.add("dragging");
      tray.append(piece); // on top of the others
    });
    game.listen(window, "pointermove", (event) => {
      if (!drag) return;
      drag.piece.style.left = `${drag.left + event.clientX - drag.x}px`;
      drag.piece.style.top = `${drag.top + event.clientY - drag.y}px`;
    });
    game.listen(window, "pointerup", () => {
      if (!drag) return;
      const { piece } = drag;
      drag = null;
      piece.classList.remove("dragging");
      // Close enough to its own place? It snaps in.
      const area = box.getBoundingClientRect();
      const frame = board.getBoundingClientRect();
      const w = frame.width / s.columns;
      const h = frame.height / s.rows;
      const targetX = frame.left - area.left + Number(piece.dataset.c) * w;
      const targetY = frame.top - area.top + Number(piece.dataset.r) * h;
      const dx = parseFloat(piece.style.left) - targetX;
      const dy = parseFloat(piece.style.top) - targetY;
      if (Math.hypot(dx, dy) < Math.min(w, h) * 0.45) {
        piece.style.left = `${targetX}px`;
        piece.style.top = `${targetY}px`;
        piece.style.rotate = "0deg";
        piece.classList.add("done");
        placed++;
        game.vibrate(20);
        info();
        if (placed === cells.length) finish();
      }
    });

    // The twist: it's printed as a polaroid and pinned on the memories wall.
    const finish = () => {
      playing = false;
      clock?.stop();
      box.classList.add("complete");
      const wall = box.querySelector(".wall");
      const memories = shuffle(MEMORIES);
      wall.innerHTML = memories.map((m, i) =>
        `<figure class="memory" style="--x:${(i % 6) * 16.5 + randomBetween(1, 4)}%;--y:${Math.floor(i / 6) * 31 + randomBetween(2, 6)}%;--t:${randomBetween(-9, 9).toFixed(0)}deg;--d:${(i * 0.05).toFixed(2)}s"><div style="background:${m.colour}">${m.art}</div><figcaption>${m.caption}</figcaption></figure>`).join("") +
        `<figure class="memory printed"><div class="image">${image}</div><figcaption>${pick(["us, forever", "the group chat", "never deleting this"])}</figcaption></figure>`;
      game.after(900, () => (wall.hidden = false));
      game.after(5200, () => game.win());
    };
  },
});
