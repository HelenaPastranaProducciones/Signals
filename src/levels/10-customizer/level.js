import { defineLevel } from "../../engine/define-level.js";
import { pick, randomBetween, shuffle } from "../../engine/random.js";
import { randomFriends } from "../../data/friends.js";
import { MARKERS, OBJECTS, PAINTS, PLAIN, STICKERS, objectSvg, stickerSvg } from "./art.js";
import { randomInt } from "../../engine/random.js";

/**
 * Level 10 · Customizer
 * Design notes, progress and decisions: README.md in this folder.
 *
 * A worktable seen from above. Choose an object (skateboard, phone case,
 * water bottle, laptop, backpack), then make it yours for 45 seconds: drag
 * stickers onto it, click a paint pot to change its colour, pick a marker
 * and draw on it. The twist: when time is up it drops into a pile of
 * identical ones that other people decorated too, and a friend spots yours at
 * once if you decorated it enough (at least 5 things). If not, they can't tell
 * which one is yours.
 */
export default defineLevel({
  number: 10,
  signal: "Personalisation makes things ours",
  minigame: "Customizer",
  explanation: "Stickers, charms and patches turn everyday objects into reflections of who you are and which communities you belong to.",
  closingLine: "It’s not just any object. It’s mine.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    duration: 30, // seconds to decorate
    decorationsToWin: 5, // things you must add (stickers, a new colour, drawings) for friends to recognise it
    stickersOnSheet: 12, // stickers to choose from (a different set each time)
    pileSize: 8, // objects in the pile at the end (yours included); the others are decorated too
  },

  play(game) {
    const s = game.settings;
    const [friend] = randomFriends(1);
    // Every attempt is a different run: another sticker sheet, another table.
    const sheet = shuffle(STICKERS).slice(0, s.stickersOnSheet);

    game.root.innerHTML = `
      <div class="workshop">
        <div class="choose">
          <b>Pick your thing</b>
          <div class="choices">${OBJECTS.map((o, i) => `<button data-i="${i}">${objectSvg(o, { id: `level-10-pick-${i}` })}<span>${o.name}</span></button>`).join("")}</div>
          <span>Then make it <b>yours</b>: stickers, paint and drawings. ${s.duration} seconds, or <b>Done!</b> when it is ready.</span>
          <span class="rules"><b>Win:</b> decorate it enough (at least ${s.decorationsToWin} things) so your friends know it's yours</span>
          <span class="rules"><b>Lose:</b> leave it almost plain, and nobody can tell it apart</span>
        </div>
      </div>`;

    const box = game.root.querySelector(".workshop");
    let object = null;
    let colour = PLAIN;
    let decorations = 0;
    let colourChanged = false;
    let tool = "sticker"; // or a marker colour
    let running = false;

    const count = () => game.showInfo(`Decorations: ${decorations + (colourChanged ? 1 : 0)}`);

    // ---- Choosing the object ----
    game.listen(box.querySelector(".choices"), "pointerdown", (event) => {
      const button = event.target.closest("button");
      if (!button || object) return;
      object = OBJECTS[Number(button.dataset.i)];
      startTable();
    });

    // ---- The worktable ----
    let svg;
    let deco;
    let base;
    const startTable = () => {
      box.innerHTML = `
        <div class="pots">
          <small>Paint</small>
          ${PAINTS.map((c) => `<button class="pot" data-c="${c}" style="--c:${c}" aria-label="Paint"></button>`).join("")}
          <small>Markers</small>
          ${MARKERS.map((c) => `<button class="marker" data-c="${c}" style="--c:${c}" aria-label="Marker"></button>`).join("")}
        </div>
        <div class="mat">${objectSvg(object, { id: "level-10-mine", cls: "mine" })}</div>
        <div class="sheet">
          <small>Stickers</small>
          <div class="stickers">${sheet.map((st) => `<button class="sticker" data-id="${st.id}">${stickerSvg(st)}</button>`).join("")}</div>
          <button class="done">Done!</button>
        </div>`;
      svg = box.querySelector(".mat svg");
      deco = svg.querySelector(".deco");
      base = svg.querySelector(".base");
      running = true;
      count();
      const clock = game.countdown(s.duration, toThePile);
      // Finished early? "Done!" goes straight to the pile (Helena, 01/11/2026).
      game.listen(box.querySelector(".done"), "pointerdown", (event) => {
        event.stopPropagation();
        if (!running) return;
        clock.stop();
        toThePile();
      });
    };

    /** A point of the screen in the object's drawing units, and whether it's on the object. */
    const toObject = (x, y) => {
      const point = new DOMPoint(x, y).matrixTransform(svg.getScreenCTM().inverse());
      return { x: point.x, y: point.y, inside: base.isPointInFill(new DOMPoint(point.x, point.y)) };
    };

    const choose = (button) => {
      box.querySelectorAll(".marker.on").forEach((b) => b.classList.remove("on"));
      if (button?.classList.contains("marker")) {
        tool = button.dataset.c;
        button.classList.add("on");
        box.classList.add("drawing");
      } else {
        tool = "sticker";
        box.classList.remove("drawing");
      }
    };

    // Dragging stickers, painting, drawing.
    let ghost = null;
    let stroke = null;
    game.listen(box, "pointerdown", (event) => {
      if (!running) return;
      const pot = event.target.closest(".pot");
      if (pot) {
        colour = pot.dataset.c;
        base.setAttribute("fill", colour);
        if (colour !== PLAIN && !colourChanged) colourChanged = true;
        choose(null);
        game.vibrate(15);
        return count();
      }
      const marker = event.target.closest(".marker");
      if (marker) return choose(marker.classList.contains("on") ? null : marker);
      const sticker = event.target.closest(".sticker");
      if (sticker) {
        choose(null);
        ghost = document.createElement("div");
        ghost.className = "ghost";
        ghost.innerHTML = sticker.innerHTML;
        ghost.dataset.id = sticker.dataset.id;
        box.append(ghost);
        moveGhost(event);
        return;
      }
      if (tool !== "sticker" && event.target.closest(".mat svg")) {
        const p = toObject(event.clientX, event.clientY);
        if (!p.inside) return;
        stroke = { el: document.createElementNS("http://www.w3.org/2000/svg", "path"), d: `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`, points: 1 };
        stroke.el.setAttribute("fill", "none");
        stroke.el.setAttribute("stroke", tool);
        stroke.el.setAttribute("stroke-width", "7");
        stroke.el.setAttribute("stroke-linecap", "round");
        stroke.el.setAttribute("stroke-linejoin", "round");
        stroke.el.setAttribute("d", stroke.d);
        deco.append(stroke.el);
      }
    });

    const moveGhost = (event) => {
      const area = box.getBoundingClientRect();
      ghost.style.left = `${event.clientX - area.left}px`;
      ghost.style.top = `${event.clientY - area.top}px`;
    };

    game.listen(window, "pointermove", (event) => {
      if (ghost) moveGhost(event);
      if (stroke) {
        const p = toObject(event.clientX, event.clientY);
        stroke.d += ` L${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
        stroke.points += 1;
        stroke.el.setAttribute("d", stroke.d);
      }
    });

    game.listen(window, "pointerup", (event) => {
      if (ghost) {
        const p = svg ? toObject(event.clientX, event.clientY) : { inside: false };
        if (p.inside && running) {
          const st = STICKERS.find((x) => x.id === ghost.dataset.id);
          deco.insertAdjacentHTML("beforeend",
            `<g class="placed" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${randomBetween(-25, 25).toFixed(0)}) scale(${randomBetween(1.3, 1.7).toFixed(2)})">${st.body}</g>`);
          decorations += 1;
          game.vibrate(15);
          count();
        }
        ghost.remove();
        ghost = null;
      }
      if (stroke) {
        if (stroke.points > 4) {
          decorations += 1;
          count();
        } else stroke.el.remove();
        stroke = null;
      }
    });

    // ---- The twist: into a pile of identical plain ones ----
    const toThePile = () => {
      running = false;
      choose(null);
      const total = decorations + (colourChanged ? 1 : 0);
      const recognised = total >= s.decorationsToWin;
      const mine = svg.outerHTML.replace(/level-10-mine/g, "level-10-pile-mine");
      // Everyone else decorated theirs too (Helena): yours must stand out among them.
      const plain = Array.from({ length: s.pileSize - 1 }, (_, i) => objectSvg(object, { id: `level-10-pile-${i}`, ...someoneElses(object) }));
      const pile = shuffle([...plain.map((p) => ({ html: p, mine: false })), { html: mine, mine: true }]);
      box.innerHTML = `
        <div class="pile">${pile.map((p, i) => `<div class="heap${p.mine ? " yours" : ""}" style="--r:${randomBetween(-14, 14).toFixed(0)}deg;--d:${(i * 0.06).toFixed(2)}s">${p.html}</div>`).join("")}</div>
        <div class="friend">
          <span class="face">${game.avatar(friend.avatar, { label: friend.name, crop: "head" })}</span>
          <p><b style="color:${friend.colour}">${friend.name}</b><span class="says">…</span></p>
        </div>`;
      const says = box.querySelector(".says");
      game.after(1400, () => {
        if (recognised) {
          box.querySelector(".heap.yours")?.classList.add("found");
          says.textContent = pick(["that one's yours, obviously", "lol I'd know that one anywhere", "found it! so you", "that's 100% yours"]);
          game.after(2200, () => game.win());
        } else {
          box.classList.add("lost");
          says.textContent = "wait… which one is yours?";
          game.after(2200, () => game.lose("Nobody could tell which one was yours… Make it more yours!"));
        }
      });
    };
  },
});

/** Someone else's object in the pile: a colour (or still plain) and a few stickers. */
function someoneElses(object) {
  const [x0, y0, x1, y1] = object.area;
  const deco = Array.from({ length: randomInt(1, 3) }, () => {
    const st = pick(STICKERS);
    return `<g transform="translate(${randomBetween(x0, x1).toFixed(0)} ${randomBetween(y0, y1).toFixed(0)}) rotate(${randomBetween(-25, 25).toFixed(0)}) scale(${randomBetween(1.2, 1.6).toFixed(2)})">${st.body}</g>`;
  }).join("");
  return { colour: Math.random() < 0.7 ? pick(PAINTS) : PLAIN, deco };
}
