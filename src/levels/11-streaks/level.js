import { defineLevel } from "../../engine/define-level.js";
import { createPaintKit } from "../../avatar/svg-kit.js";
import { pick, randomBetween, shuffle } from "../../engine/random.js";
import { randomFriends } from "../../data/friends.js";

/**
 * Level 11 · Streaks
 * Design notes, progress and decisions: README.md in this folder.
 *
 * Four friends are four plants on a windowsill. Each plant dries slowly;
 * now and then a friend posts something (a story, a photo, a meme) over
 * their plant, and reacting to it (a heart or a "haha") waters it. Posts
 * vanish quickly, so you keep an eye on all four. The twist: halfway, one
 * friend goes quiet and posts nothing; a "hey, you ok?" button appears on
 * their pot, and writing to them brings their plant back. Keep every plant
 * alive for 45 seconds; if one dries out, you lose.
 */
export default defineLevel({
  number: 11,
  signal: "Friendship happens in the background",
  minigame: "Streaks",
  explanation: "You can feel close just by sharing a space, like staying on a Discord call while studying. Knowing someone is there is enough.",
  closingLine: "You don’t need to meet daily to be friends.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal (Helena: a bit hard): adjust while playing.
  settings: {
    friends: 4, // plants to look after
    duration: 45, // seconds no plant may dry out
    drySeconds: 11, // seconds a fully watered plant takes to dry out
    postEverySeconds: 1.1, // how often a friend posts something
    postSeconds: 2.4, // how long a post stays before it disappears
    waterPerReaction: 0.5, // how much a reaction waters (1 = a full plant)
    quietAfterSeconds: 14, // when one friend goes quiet
  },

  play(game) {
    const s = game.settings;
    // Every attempt is a different run: other friends, posts and quiet friend.
    const friends = randomFriends(s.friends).map((f) => ({ ...f, water: randomBetween(0.75, 1), post: null, quiet: false }));

    game.root.innerHTML = `
      <div class="sill-scene">
        <div class="window"><i class="cloud a"></i><i class="cloud b"></i></div>
        <div class="sill">${friends.map((f, i) => `
          <div class="pot-slot" data-i="${i}">
            <div class="post-area"></div>
            ${plantSvg(i)}
            <div class="pot-label"><span class="face">${game.avatar(f.avatar, { label: f.name, crop: "head" })}</span><b style="color:${f.colour}">${f.name}</b></div>
            <div class="water"><i></i></div>
          </div>`).join("")}
        </div>
        <div class="start">
          <b>Keep your friendships growing</b>
          <span>Your friends post things over their plants. <b>Tap a reaction</b> before the post disappears to water their plant.</span>
          <span class="rules"><b>Win:</b> keep all ${s.friends} plants alive for ${s.duration} seconds</span>
          <span class="rules"><b>Lose:</b> one plant dries out completely</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".sill-scene");
    const slots = [...box.querySelectorAll(".pot-slot")];
    let running = false;
    let elapsed = 0;
    let sincePost = 0;
    let quietOne = null;

    /** Draws a plant by how watered it is: drooping, losing leaves, or standing tall. */
    const showPlant = (i) => {
      const f = friends[i];
      const slot = slots[i];
      slot.style.setProperty("--w", f.water.toFixed(3));
      slot.querySelectorAll(".leaf").forEach((leaf, n, all) => leaf.classList.toggle("fallen", f.water < (n + 1) / (all.length + 1)));
      slot.querySelector(".water i").style.width = `${f.water * 100}%`;
      slot.classList.toggle("thirsty", f.water < 0.3);
    };
    friends.forEach((_, i) => showPlant(i));

    const post = () => {
      const free = friends.filter((f) => !f.post && !f.quiet);
      if (!free.length) return;
      // Hard but fair: the thirstiest friend posts more often, so every plant can be saved.
      const f = Math.random() < 0.6 ? free.reduce((a, b) => (b.water < a.water ? b : a)) : pick(free);
      const i = friends.indexOf(f);
      const kind = pick(POSTS);
      const el = document.createElement("div");
      el.className = "post";
      el.innerHTML = `<div class="pic" style="background:${kind.bg}">${kind.art}</div><small>${kind.text}</small>` +
        `<div class="react"><button data-r="heart" aria-label="Heart">${HEART}</button><button data-r="haha">haha</button></div>`;
      slots[i].querySelector(".post-area").append(el);
      f.post = { el, cancel: game.after(s.postSeconds * 1000, () => drop(f, false)) };
    };

    const drop = (f, reacted) => {
      if (!f.post) return;
      f.post.cancel?.();
      f.post.el.classList.add(reacted ? "liked" : "gone");
      const el = f.post.el;
      f.post = null;
      game.after(350, () => el.remove());
    };

    /** The twist: one friend goes quiet, and you're the one who has to reach out. */
    const goQuiet = () => {
      quietOne = pick(friends.filter((f) => !f.post) || friends);
      quietOne.quiet = true;
      const slot = slots[friends.indexOf(quietOne)];
      slot.classList.add("quiet");
      game.after(1500, () => {
        if (!running) return;
        slot.querySelector(".post-area").insertAdjacentHTML("beforeend", `<button class="reach">hey, you ok?</button>`);
      });
    };

    const reachOut = (slot) => {
      const i = Number(slot.dataset.i);
      const f = friends[i];
      slot.querySelector(".reach")?.remove();
      f.water = 1;
      showPlant(i);
      slot.classList.remove("quiet");
      slot.querySelector(".post-area").insertAdjacentHTML("beforeend", `<p class="reply"><b style="color:${f.colour}">${f.name}</b>${pick(["thanks for checking on me", "rough week… thanks for asking", "you're the best, I'm ok now"])}</p>`);
      game.vibrate([20, 40, 20]);
      game.after(2600, () => {
        slot.querySelector(".reply")?.remove();
        f.quiet = false;
      });
    };

    const frame = (dt) => {
      if (!running) return;
      elapsed += dt;
      sincePost += dt;
      if (sincePost >= s.postEverySeconds) {
        sincePost = 0;
        post();
      }
      if (!quietOne && elapsed >= s.quietAfterSeconds) goQuiet();
      for (const [i, f] of friends.entries()) {
        f.water = Math.max(0, f.water - dt / s.drySeconds);
        showPlant(i);
        if (f.water <= 0) {
          running = false;
          clock.stop();
          slots[i].classList.add("dead");
          return game.after(700, () => game.lose(`${f.name}'s plant dried out… Try again!`));
        }
      }
    };

    // Win: every plant flowers.
    const win = () => {
      running = false;
      friends.forEach((f) => drop(f, true));
      box.classList.add("blooming");
      game.after(2200, () => game.win());
    };

    let clock = null;
    game.listen(box, "pointerdown", (event) => {
      const start = box.querySelector(".start");
      if (start) {
        start.remove();
        running = true;
        clock = game.countdown(s.duration, win);
        game.onFrame(frame);
        return;
      }
      if (!running) return;
      const reach = event.target.closest(".reach");
      if (reach) return reachOut(reach.closest(".pot-slot"));
      const button = event.target.closest(".react button");
      if (!button) return;
      const slot = button.closest(".pot-slot");
      const i = Number(slot.dataset.i);
      const f = friends[i];
      f.water = Math.min(1, f.water + s.waterPerReaction);
      showPlant(i);
      drop(f, true);
      slot.classList.remove("watered");
      void slot.offsetWidth;
      slot.classList.add("watered");
      game.vibrate(15);
    });
  },
});

const HEART = `<svg viewBox="0 0 24 24"><path d="M12 21L4 13Q0 8 4 5Q8 2 12 7Q16 2 20 5Q24 8 20 13Z" fill="#d9576f" stroke="#2b2630" stroke-width="1.6"/></svg>`;

/** Things friends post: a little picture and a caption. */
const POSTS = [
  { text: "new story", bg: "#f2c9a8", art: `<i class="sun"></i><i class="hill"></i>` },
  { text: "look at my cat", bg: "#c9d9e8", art: `<i class="blob" style="background:#e2a04a"></i>` },
  { text: "this meme lol", bg: "#f1ece4", art: `<b>WHEN THE<br>WIFI DIES</b>` },
  { text: "lunch", bg: "#d3e6c5", art: `<i class="bowl"></i>` },
  { text: "new fit", bg: "#e8cfe0", art: `<i class="shirt"></i>` },
  { text: "concert!!", bg: "#3f3d63", art: `<i class="lights"></i>` },
  { text: "sunset", bg: "#d9a3b0", art: `<i class="sun"></i>` },
];

let plants = 0;
/** One pot with a plant, painted; leaves fall and the stem droops as it dries (see level.css). */
function plantSvg(i) {
  const k = createPaintKit(`level-11-plant-${++plants}`, { grain: 1.4, wobble: 1.6 });
  const pot = ["#c0577a", "#e2a04a", "#6f9fd8", "#9c8ad0", "#6fbf8c"][i % 5];
  const leaves = shuffle([
    "M50 70Q30 62 24 48Q40 48 50 62Z", "M50 62Q70 54 76 40Q60 40 50 54Z", "M50 52Q34 40 34 26Q46 30 50 46Z",
    "M50 44Q66 32 68 20Q56 22 50 38Z", "M50 36Q42 22 50 10Q58 22 50 36Z",
  ]);
  return `<svg class="plant" viewBox="0 0 100 140" aria-hidden="true">${k.defs()}<g filter="url(#${k.ids.paint})">` +
    `<g class="stem">${k.stroke("M50 100V14", "#5f9a5c", 4)}` +
    leaves.map((d) => `<g class="leaf">${k.clay(d, "#6fbf8c")}</g>`).join("") +
    `<g class="flower">${[0, 72, 144, 216, 288].map((a) => k.circle(50 + Math.cos((a * Math.PI) / 180) * 7, 12 + Math.sin((a * Math.PI) / 180) * 7, 6, "#e07aa6")).join("")}${k.circle(50, 12, 4.5, "#e9c24a")}</g>` +
    `</g>` +
    k.clay("M26 96H74L68 136H32Z", pot) + k.clay("M22 92H78V102H22Z", pot) +
    `</g></svg>`;
}
