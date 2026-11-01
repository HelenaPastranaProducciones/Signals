import { defineLevel } from "../../engine/define-level.js";
import { pick, shuffle } from "../../engine/random.js";
import { randomFriends } from "../../data/friends.js";
import { DETAILS, roomColours, roomPhoto } from "./art.js";

/**
 * Level 12 · Spot the Difference
 * Design notes, progress and decisions: README.md in this folder.
 *
 * Two photos of your room side by side: a corkboard with photos and notes,
 * string lights, a poster, a shelf, a desk. Five small details are
 * different (Helena: hard). Click one on either photo and it's circled on
 * both; a click where there's nothing costs a heart. The twist: each detail
 * belongs to a friend, who texts you about what it means when you find it.
 * Find all five in 45 seconds; run out of time or hearts and you lose.
 */
export default defineLevel({
  number: 12,
  signal: "Small things carry big meanings",
  minigame: "Spot the Difference",
  explanation: "A friendship bracelet or a handwritten note holds more meaning than it seems. Little details keep memories and affection alive.",
  closingLine: "A tiny detail can mean a lot.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal (Helena: hard): adjust while playing.
  settings: {
    differences: 7, // differences to find
    duration: 40, // seconds to find them
    hearts: 3, // wrong clicks you can make; the last one ends the game
    clickSlack: 14, // how forgiving a click is around a difference (drawing units; the photo is 400 wide)
  },

  play(game) {
    const s = game.settings;
    // Every attempt is a different run: other details, other side, other colours, other friends.
    const details = shuffle(DETAILS).slice(0, s.differences);
    const friends = randomFriends(s.differences);
    const colours = roomColours();
    const leftChanges = new Set(details.filter(() => Math.random() < 0.5).map((d) => d.id));
    const rightChanges = new Set(details.map((d) => d.id).filter((id) => !leftChanges.has(id)));

    game.root.innerHTML = `
      <div class="spot">
        <div class="photos">
          <div class="photo">${roomPhoto(colours, leftChanges)}<div class="marks"></div></div>
          <div class="photo">${roomPhoto(colours, rightChanges)}<div class="marks"></div></div>
        </div>
        <div class="bottom">
          <div class="hearts">${"<b>♥</b>".repeat(s.hearts)}</div>
          <div class="found">${details.map(() => "<i></i>").join("")}</div>
        </div>
        <div class="texts"></div>
        <div class="start">
          <b>Spot the difference</b>
          <span>Two photos of your room. <b>${s.differences} tiny details</b> are different: click them on either photo.</span>
          <span class="rules"><b>Win:</b> find all ${s.differences} before the time runs out</span>
          <span class="rules"><b>Lose:</b> the ${s.duration} seconds run out, or you click ${s.hearts} times where there's no difference</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".spot");
    const photos = [...box.querySelectorAll(".photo")];
    const hearts = [...box.querySelectorAll(".hearts b")];
    const dots = [...box.querySelectorAll(".found i")];
    const texts = box.querySelector(".texts");
    const found = new Set();
    let lives = s.hearts;
    let running = false;
    let clock = null;

    const showFound = () => game.showInfo(`Found ${found.size} / ${s.differences}`);
    showFound();

    /** A circle on both photos where the detail is. */
    const circle = (d) => photos.forEach((p) => p.querySelector(".marks").insertAdjacentHTML("beforeend",
      `<i style="left:${(d.x / 4).toFixed(1)}%;top:${(d.y / 3).toFixed(1)}%;width:${((d.r * 2.6) / 4).toFixed(1)}%"></i>`));

    /** The friend this detail is about texts you. */
    const text = (d, friend) => {
      texts.insertAdjacentHTML("beforeend", `<p><span class="face">${game.avatar(friend.avatar, { label: friend.name, crop: "head" })}</span><span><b style="color:${friend.colour}">${friend.name}</b>${d.says}</span></p>`);
      game.vibrate(20);
      const all = texts.querySelectorAll("p");
      if (all.length > 3) all[0].remove();
    };

    const click = (event, photo) => {
      const r = photo.querySelector(".photo-svg").getBoundingClientRect();
      const x = ((event.clientX - r.left) / r.width) * 400;
      const y = ((event.clientY - r.top) / r.height) * 300;
      const hit = details.find((d) => !found.has(d.id) && Math.hypot(d.x - x, d.y - y) <= d.r + s.clickSlack);
      if (hit) {
        found.add(hit.id);
        circle(hit);
        dots[found.size - 1]?.classList.add("on");
        text(hit, friends[details.indexOf(hit)]);
        showFound();
        if (found.size >= s.differences) {
          running = false;
          clock?.stop();
          box.classList.add("done");
          game.after(2200, () => game.win());
        }
        return;
      }
      // Already found, or nothing there.
      if (details.some((d) => found.has(d.id) && Math.hypot(d.x - x, d.y - y) <= d.r + s.clickSlack)) return;
      photo.querySelector(".marks").insertAdjacentHTML("beforeend", `<em class="miss" style="left:${((x / 400) * 100).toFixed(1)}%;top:${((y / 300) * 100).toFixed(1)}%">✕</em>`);
      game.after(600, () => photo.querySelector(".miss")?.remove());
      lives -= 1;
      hearts[lives]?.classList.add("lost");
      game.vibrate(80);
      if (lives <= 0) {
        running = false;
        clock?.stop();
        game.after(700, () => game.lose("Too many wrong guesses… Try again!"));
      }
    };

    game.listen(box, "pointerdown", (event) => {
      const start = box.querySelector(".start");
      if (start) {
        start.remove();
        running = true;
        clock = game.countdown(s.duration, () => {
          running = false;
          // Show what was missed.
          details.filter((d) => !found.has(d.id)).forEach(circle);
          box.classList.add("missed");
          game.after(1600, () => game.lose(`Time's up! ${pick(["Some details slipped by…", "The little things are easy to miss…"])} Try again!`));
        });
        return;
      }
      if (!running) return;
      const photo = event.target.closest(".photo");
      if (photo) click(event, photo);
    });
  },
});
