import { defineLevel } from "../../engine/define-level.js";
import { pick, randomBetween, shuffle } from "../../engine/random.js";
import { randomFriends } from "../../data/friends.js";
import { LABELS, THINGS, thingSvg } from "./art.js";

/**
 * Level 14 · Tidy Up
 * Design notes, progress and decisions: README.md in this folder.
 *
 * Twelve things are scattered on the floor and only five fit on your shelf.
 * Drag (or click) the ones that say who you are onto the shelf; click one
 * on the shelf to take it off again. Fill the shelf in 30 seconds. The
 * twist: a friend drops by, looks at it and says "this is SO you", and the
 * shelf gets a style label from what you chose. Run out of time and you lose.
 */
export default defineLevel({
  number: 14,
  signal: "Curation is a form of self-expression",
  minigame: "Tidy Up",
  explanation: "Teens express identity through what they collect and save: boards, playlists, moodboards. Choosing references builds a visual language of who they are.",
  closingLine: "What you leave out says who you are, too.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    objects: 12, // things on the floor
    shelfSlots: 5, // things that fit on the shelf
    duration: 30, // seconds to fill the shelf
  },

  play(game) {
    const s = game.settings;
    const [friend] = randomFriends(1);
    // Every attempt is a different run: other things, in other places.
    const things = shuffle(THINGS).slice(0, s.objects);

    game.root.innerHTML = `
      <div class="tidy">
        <div class="shelf">${Array.from({ length: s.shelfSlots }, () => `<div class="slot"></div>`).join("")}</div>
        <div class="floor">${things.map((t, i) => `<button class="thing" data-i="${i}" style="left:${(4 + (i % 6) * 15.5 + randomBetween(-2, 2)).toFixed(1)}%;top:${(8 + Math.floor(i / 6) * 46 + randomBetween(-4, 4)).toFixed(1)}%;rotate:${randomBetween(-14, 14).toFixed(0)}deg">${thingSvg(t)}<span>${t.name}</span></button>`).join("")}</div>
        <div class="visit" hidden></div>
        <div class="start">
          <b>Only five fit</b>
          <span>Pick the things that say who you are: <b>drag or click</b> them onto the shelf. Click one on the shelf to take it off.</span>
          <span class="rules"><b>Win:</b> fill the shelf (${s.shelfSlots} things) in ${s.duration} seconds</span>
          <span class="rules"><b>Lose:</b> the time runs out before the shelf is full</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".tidy");
    const slots = [...box.querySelectorAll(".slot")];
    let running = false;
    let clock = null;

    const onShelf = () => slots.filter((slot) => slot.firstElementChild);
    const count = () => game.showInfo(`On the shelf ${onShelf().length} / ${s.shelfSlots}`);
    count();

    const putOnShelf = (el) => {
      const slot = slots.find((sl) => !sl.firstElementChild);
      if (!slot) return;
      el.dataset.home = JSON.stringify([el.style.left, el.style.top, el.style.rotate]);
      el.style.left = el.style.top = el.style.rotate = "";
      slot.append(el);
      el.classList.add("placed");
      game.vibrate(15);
      count();
      if (onShelf().length >= s.shelfSlots) finish();
    };

    const backToFloor = (el) => {
      const [left, top, rotate] = JSON.parse(el.dataset.home);
      Object.assign(el.style, { left, top, rotate });
      el.classList.remove("placed");
      box.querySelector(".floor").append(el);
      count();
    };

    // The twist: a friend drops by and reads your shelf.
    const finish = () => {
      running = false;
      clock?.stop();
      const styles = onShelf().map((slot) => things[Number(slot.firstElementChild.dataset.i)].style);
      const top = Object.entries(styles.reduce((acc, st) => ({ ...acc, [st]: (acc[st] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1])[0][0];
      box.classList.add("finished");
      const visit = box.querySelector(".visit");
      visit.hidden = false;
      visit.innerHTML = `<span class="face">${game.avatar(friend.avatar, { label: friend.name, crop: "head" })}</span>` +
        `<p><b style="color:${friend.colour}">${friend.name}</b>${pick(["ok this is SO you", "omg your shelf is literally you", "I'd know this shelf anywhere"])}</p>` +
        `<div class="label">${LABELS[top]}</div>`;
      game.after(2800, () => game.win());
    };

    // Dragging (or clicking) things.
    let drag = null;
    game.listen(box, "pointerdown", (event) => {
      const start = box.querySelector(".start");
      if (start) {
        start.remove();
        running = true;
        clock = game.countdown(s.duration, () => {
          running = false;
          game.lose("Your shelf is still half empty… Try again!");
        });
        return;
      }
      if (!running) return;
      const el = event.target.closest(".thing");
      if (!el) return;
      if (el.classList.contains("placed")) return backToFloor(el);
      drag = { el, x: event.clientX, y: event.clientY, moved: false };
      el.classList.add("dragging");
    });
    game.listen(window, "pointermove", (event) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (Math.hypot(dx, dy) > 6) drag.moved = true;
      drag.el.style.translate = `${dx}px ${dy}px`;
    });
    game.listen(window, "pointerup", (event) => {
      if (!drag) return;
      const { el, moved } = drag;
      drag = null;
      el.classList.remove("dragging");
      el.style.translate = "";
      const shelf = box.querySelector(".shelf").getBoundingClientRect();
      const overShelf = event.clientY < shelf.bottom + 30 && event.clientY > shelf.top - 30;
      // A click, or a drop on the shelf, puts it there.
      if (!moved || overShelf) putOnShelf(el);
    });
  },
});
