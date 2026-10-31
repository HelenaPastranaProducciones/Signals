import { defineLevel } from "../../engine/define-level.js";
import { pick, randomInt, shuffle } from "../../engine/random.js";
import { randomFriends } from "../../data/friends.js";
import { escapeHtml } from "../../ui/html.js";
import { CAPTIONS, PALETTE, PRAISE, SHRUGS, TEMPLATES, feedPicture, likesFor } from "./art.js";

/**
 * Level 5 · Feed to Canvas
 * Design notes, progress and decisions: README.md in this folder.
 *
 * Everything happens in one big phone. (1) The feed scrolls by itself,
 * faster and faster, and the "Consumed" counter keeps climbing; a small
 * blinking Create button gets you out. Stay too long and you lose.
 * (2) The phone becomes a pixel canvas with a drawing marked faintly on it:
 * fill it with the right colours, then Publish when you're ready.
 * (3) Your drawing appears in the feed: if it follows the template, friends
 * like and comment on it (you win); if not, nobody likes it (you lose).
 */
export default defineLevel({
  number: 5,
  signal: "From consumer to creator",
  minigame: "Feed to Canvas",
  explanation: "Teens don’t just consume content, they create, remix and share it. Creativity is a way to express identity and connect.",
  closingLine: "One day you went from watching to making.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    feedSeconds: 15, // how long you can stay in the feed before you lose
    createAfterSeconds: 2.5, // when the Create button appears
    feedSpeed: 90, // how fast the feed scrolls at the start (pixels per second)
    feedSpeedUp: 45, // how much faster it gets every second
    gridSize: 16, // pixels per side of the canvas (the templates are drawn this size)
    paletteColours: 8, // colours on the palette
    accuracyToWin: 0.85, // share of the drawing that must be right for friends to like it
  },

  play(game) {
    const s = game.settings;
    const nickname = escapeHtml(game.player.nickname);
    // Every attempt is a different run: other friends, posts and drawing to copy.
    const friends = randomFriends(5);
    const template = pick(TEMPLATES);
    const colours = Object.keys(PALETTE).slice(0, s.paletteColours);

    game.root.innerHTML = `
      <div class="feed-level">
        <div class="phone">
          <div class="status"><b class="counter">Consumed: 0</b><i class="notch"></i><span class="clock">23:58</span></div>
          <div class="screen"></div>
        </div>
        <div class="start">
          <b>Stop scrolling, start making</b>
          <span>The feed scrolls by itself. <b>Click Create</b> when it appears to get out.</span>
          <span>Then copy the faint drawing: pick a colour and <b>click or drag</b> on the pixels. Grey squares stay empty. <b>Publish</b> when it's ready.</span>
          <span class="rules"><b>Win:</b> publish a drawing that follows the template, and your friends will love it</span>
          <span class="rules"><b>Lose:</b> stay in the feed for ${s.feedSeconds} seconds, or publish a drawing that doesn't follow the template</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".feed-level");
    const screen = box.querySelector(".screen");
    const counter = box.querySelector(".counter");
    let consumed = 0;
    let phase = "waiting"; // feed, canvas, published

    const avatarOf = (friend) => `<span class="face">${game.avatar(friend.avatar, { label: friend.name, crop: "head" })}</span>`;
    const postHtml = (friend) => `
      <article class="post">
        <header>${avatarOf(friend)}<b style="color:${friend.colour}">${friend.name}</b></header>
        <div class="picture">${feedPicture()}</div>
        <footer><span class="heart">♥ ${randomInt(40, 9000)}</span> ${pick(CAPTIONS)}</footer>
      </article>`;

    // ---- Phase 1: the feed scrolls by itself, faster and faster ----
    const startFeed = () => {
      phase = "feed";
      screen.innerHTML = `<div class="feed"></div><button class="create" hidden>+ Create</button>`;
      const feed = screen.querySelector(".feed");
      const create = screen.querySelector(".create");
      const addPost = () => feed.insertAdjacentHTML("beforeend", postHtml(pick(friends)));
      for (let i = 0; i < 4; i += 1) addPost();
      let offset = 0;
      let elapsed = 0;
      game.onFrame((dt) => {
        if (phase !== "feed") return;
        elapsed += dt;
        const speed = s.feedSpeed + s.feedSpeedUp * elapsed;
        offset += speed * dt;
        // The counter climbs with every bit you scroll, faster and faster.
        consumed += speed * dt / 25;
        counter.textContent = `Consumed: ${Math.floor(consumed)}`;
        const first = feed.firstElementChild;
        // A post that has left the top was "consumed": recycle it at the bottom.
        if (first && offset > first.offsetHeight + 12) {
          offset -= first.offsetHeight + 12;
          first.remove();
          addPost();
        }
        feed.style.transform = `translateY(${-offset}px)`;
      });
      game.after(s.createAfterSeconds * 1000, () => (create.hidden = false));
      game.after(s.feedSeconds * 1000, () => {
        if (phase !== "feed") return;
        phase = "over";
        game.lose("You scrolled the whole night away… Try again!");
      });
      game.listen(create, "pointerdown", (event) => {
        event.stopPropagation();
        startCanvas();
      });
    };

    // ---- Phase 2: copy the faint drawing on the pixel canvas ----
    const cells = [];
    let colour = colours[0];
    const startCanvas = () => {
      phase = "canvas";
      const n = s.gridSize;
      screen.innerHTML = `
        <div class="canvas-view">
          <p class="prompt">Copy the ${template.name}!</p>
          <p class="tip">Grey squares stay empty</p>
          <div class="grid" style="--n:${n}">${Array.from({ length: n * n }, (_, i) => {
            const want = template.rows[Math.floor(i / n)]?.[i % n] ?? ".";
            return `<i data-i="${i}" ${want !== "." ? `style="--hint:${PALETTE[want]}" class="hint"` : ""}></i>`;
          }).join("")}</div>
          <div class="palette">${colours.map((c) => `<button data-c="${c}" style="--c:${PALETTE[c]}" aria-label="Colour"></button>`).join("")}<button data-c="." class="eraser" aria-label="Eraser">✕</button></div>
          <button class="publish">Publish</button>
        </div>`;
      cells.push(...screen.querySelectorAll(".grid i"));
      const painted = new Array(n * n).fill(".");
      const palette = screen.querySelector(".palette");
      const pickColour = (c) => {
        colour = c;
        palette.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.c === c));
      };
      pickColour(colour);
      const paint = (cell) => {
        const i = Number(cell.dataset.i);
        painted[i] = colour;
        cell.style.background = colour === "." ? "" : PALETTE[colour];
        cell.classList.toggle("filled", colour !== ".");
      };
      let drawing = false;
      const grid = screen.querySelector(".grid");
      game.listen(palette, "pointerdown", (event) => {
        const button = event.target.closest("button");
        if (button) pickColour(button.dataset.c);
      });
      game.listen(grid, "pointerdown", (event) => {
        const cell = event.target.closest("i");
        if (!cell) return;
        drawing = true;
        paint(cell);
      });
      game.listen(window, "pointermove", (event) => {
        if (!drawing) return;
        const cell = document.elementFromPoint(event.clientX, event.clientY)?.closest?.(".grid i");
        if (cell) paint(cell);
      });
      game.listen(window, "pointerup", () => (drawing = false));
      game.listen(screen.querySelector(".publish"), "pointerdown", () => publish(painted));
    };

    /** Share of the template that is right, counting stray pixels outside it as mistakes. */
    const accuracy = (painted) => {
      const wanted = template.rows.join("");
      const needed = [...wanted].filter((c) => c !== ".").length;
      let mistakes = 0;
      [...wanted].forEach((want, i) => {
        if (want !== painted[i]) mistakes += 1;
      });
      return Math.max(0, (needed - mistakes) / needed);
    };

    // ---- Phase 3: your drawing in the feed ----
    const publish = (painted) => {
      if (phase !== "canvas") return;
      phase = "published";
      const score = accuracy(painted);
      const good = score >= s.accuracyToWin;
      const n = s.gridSize;
      const art = painted.map((c) => `<i style="background:${c === "." ? "transparent" : PALETTE[c]}"></i>`).join("");
      screen.innerHTML = `
        <div class="feed published">
          <article class="post mine">
            <header><span class="face">${game.avatar(undefined, { label: "You", crop: "head" })}</span><b>${nickname}</b><small>just now</small></header>
            <div class="picture pixel-art" style="--n:${n}">${art}</div>
            <footer><span class="heart">♥ <b class="likes">0</b></span> made this myself</footer>
            <div class="comments"></div>
          </article>
          ${postHtml(pick(friends))}
        </div>`;
      counter.textContent = `Created: 1`;
      counter.classList.add("created");
      const likes = screen.querySelector(".likes");
      const comments = screen.querySelector(".comments");
      const comment = (friend, text) => {
        comments.insertAdjacentHTML("beforeend", `<p>${avatarOf(friend)}<span><b style="color:${friend.colour}">${friend.name}</b> ${text}</span></p>`);
        game.vibrate(20);
      };
      if (good) {
        const total = likesFor(score);
        let shown = 0;
        const tick = game.every(60, () => {
          shown = Math.min(total, shown + randomInt(1, 3));
          likes.textContent = shown;
          if (shown >= total) tick();
        });
        shuffle(friends).slice(0, 3).forEach((friend, i) => game.after(500 + i * 650, () => comment(friend, pick(PRAISE))));
        game.after(3200, () => game.win());
      } else {
        game.after(900, () => comment(pick(friends), pick(SHRUGS)));
        game.after(2600, () => game.lose("Nobody liked it… the drawing didn't follow the template. Try again!"));
      }
    };

    game.listen(box, "pointerdown", () => {
      const start = box.querySelector(".start");
      if (!start) return;
      start.remove();
      startFeed();
    });
  },
});
