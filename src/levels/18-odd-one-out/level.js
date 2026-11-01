import { defineLevel } from "../../engine/define-level.js";
import { pick, shuffle } from "../../engine/random.js";
import { randomAvatar } from "../../data/avatar-catalog.js";
import { createLives, spreadOut } from "../../mechanics/odd-one-out.js";

/**
 * Level 18 · Odd One Out
 * Design notes, progress and decisions: README.md in this folder.
 *
 * Helena (01/11/2026), option A "the group photo": your friend group has its
 * own code, shown on a card at the start and kept in a corner: a pose, a hat
 * and something round the neck, each in the group's colour. Then come group
 * photos of 8 to 11 people: everybody follows the code except one, who gets
 * a single small detail wrong (another pose, the hat or the neck piece in
 * another colour). Click them. Shares the hearts and the way people are
 * spread out with level 3 (src/mechanics/odd-one-out.js). Every attempt
 * invents a new group with a new code.
 */

const GROUP_NAMES = ["The Pigeons", "Night Owls", "The Noodles", "Bus Stop Club", "The Gremlins", "Team Toast", "The Frogs", "Lunch Table 4"];

const POSES = [
  { id: "down", name: "arms down" },
  { id: "hips", name: "hands on hips" },
  { id: "wave", name: "one hand up" },
];

const HATS = [
  { id: "beanie", name: "beanie" },
  { id: "bucket", name: "bucket hat" },
  { id: "cap", name: "cap" },
  { id: "backcap", name: "backwards cap" },
];

const HAT_COLOURS = [
  { id: "#e8503a", name: "red" },
  { id: "#3d6fe0", name: "blue" },
  { id: "#f2c12e", name: "yellow" },
  { id: "#2a2b3d", name: "black" },
  { id: "#3f9e4a", name: "green" },
  { id: "#ff7ab0", name: "pink" },
  { id: "#ff8a3c", name: "orange" },
];

const NECKS = [
  { id: "scarf", name: "scarf" },
  { id: "phones", name: "headphones" },
  { id: "bag", name: "crossbody bag" },
];

const NECK_COLOURS = [
  { id: "#ffe36b", name: "yellow" },
  { id: "#e8503a", name: "red" },
  { id: "#3d6fe0", name: "blue" },
  { id: "#ff7ab0", name: "pink" },
  { id: "#7fe3c0", name: "mint" },
  { id: "#ff8a3c", name: "orange" },
];

const FLOOR = { top: 50, bottom: 94, left: 8, right: 92 };

export default defineLevel({
  number: 18,
  signal: "Friend groups have their own culture",
  minigame: "Odd One Out",
  // Not in the Signals Journal PDF: the explanation text is provisional.
  explanation: "Every friend group builds its own references, inside jokes and codes that only its members understand.",
  closingLine: "Only we know this code.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    patterns: 4, // group photos to get right
    duration: 40, // seconds for all of them
    mistakesAllowed: 3, // hearts
    graceSeconds: 0.4, // a double click counts as one mistake
    peopleFirst: 8, // people in the first photo
    peopleLast: 11, // people in the last photo
  },

  play(game) {
    const s = game.settings;
    // Every attempt invents another group with another code.
    const groupName = pick(GROUP_NAMES);
    const code = {
      pose: pick(POSES),
      hat: pick(HATS),
      hatC: pick(HAT_COLOURS),
      neck: pick(NECKS),
      neckC: pick(NECK_COLOURS),
    };
    const dressed = (look, c = code) => ({ ...look, hat: c.hat.id, hatC: c.hatC.id, acc: c.neck.id, acC: c.neckC.id });
    const model = dressed(randomAvatar());
    const rules = `<li><b>Pose:</b> ${code.pose.name}</li><li><b>Hat:</b> ${code.hatC.name} ${code.hat.name}</li><li><b>Neck:</b> ${code.neckC.name} ${code.neck.name}</li>`;

    game.root.innerHTML = `
      <div class="codes">
        <div class="photo"><div class="scene"></div></div>
        <div class="code-card">
          <b>Our code</b>
          <span class="model">${game.avatar(model, { label: groupName, pose: code.pose.id, backdrop: false })}</span>
          <ul>${rules}</ul>
        </div>
        <div class="lives"></div>
        <div class="start">
          <b>${groupName}</b>
          <span>Every friend group has its own code. This is yours:</span>
          <div class="start-code"><span class="model">${game.avatar(model, { label: groupName, pose: code.pose.id, backdrop: false })}</span><ul>${rules}</ul></div>
          <span>In every group photo, everyone follows the code except one person, who gets <b>one small detail wrong</b>. <b>Click them.</b></span>
          <span class="rules"><b>Win:</b> find the outsider in ${s.patterns} photos in ${s.duration} seconds</span>
          <span class="rules"><b>Lose:</b> ${s.mistakesAllowed} wrong clicks, or the time runs out</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".codes");
    const scene = box.querySelector(".scene");
    const lives = createLives(box.querySelector(".lives"), s);
    let done = 0;
    let playing = false;
    let clock = null;

    const info = () => game.showInfo(`Photos ${done} / ${s.patterns}`);
    info();

    /** The same code with one detail changed, for the outsider. */
    const almost = () => {
      const other = (list, current) => pick(list.filter((item) => item !== current));
      const slip = pick(["pose", "hat", "neck"]);
      if (slip === "pose") return { ...code, pose: other(POSES, code.pose) };
      if (slip === "hat") return { ...code, hatC: other(HAT_COLOURS, code.hatC) };
      return { ...code, neckC: other(NECK_COLOURS, code.neckC) };
    };

    const photo = () => {
      const count = Math.round(s.peopleFirst + ((s.peopleLast - s.peopleFirst) * done) / Math.max(1, s.patterns - 1));
      const odd = Math.floor(Math.random() * count);
      const spots = spreadOut(count, FLOOR);
      scene.innerHTML = spots.map((spot, i) => {
        const c = i === odd ? almost() : code;
        const look = dressed(randomAvatar(), c);
        return `<button class="person${i === odd ? " odd" : ""}" style="left:${spot.x.toFixed(1)}%;top:${spot.y.toFixed(1)}%;--depth:${spot.depth.toFixed(2)};z-index:${Math.round(spot.y)}">` +
          `${game.avatar(look, { label: "Friend", pose: c.pose.id, backdrop: false })}</button>`;
      }).join("");
      scene.classList.remove("flash");
      void scene.offsetWidth;
      scene.classList.add("flash");
    };

    const choose = (el) => {
      if (el.classList.contains("odd")) {
        playing = false;
        done++;
        el.classList.add("found");
        game.vibrate(25);
        info();
        if (done >= s.patterns) {
          clock?.stop();
          box.insertAdjacentHTML("beforeend", `<p class="cheer">${groupName.toUpperCase()} FOREVER</p>`);
          return game.after(1600, () => game.win());
        }
        game.after(800, () => {
          playing = true;
          photo();
        });
      } else {
        el.classList.add("no");
        game.vibrate(80);
        lives.lose();
        if (lives.mistakes >= s.mistakesAllowed) {
          playing = false;
          clock?.stop();
          scene.querySelector(".odd")?.classList.add("found");
          game.after(900, () => game.lose(`That one follows the code… Try again!`));
        }
      }
    };

    game.listen(box, "pointerdown", (event) => {
      const start = box.querySelector(".start");
      if (start) {
        start.remove();
        playing = true;
        photo();
        clock = game.countdown(s.duration, () => {
          playing = false;
          scene.querySelector(".odd")?.classList.add("found");
          game.lose("Time's up! The outsider blended in… Try again!");
        });
        return;
      }
      const el = event.target.closest(".person");
      if (el && playing && !el.classList.contains("no")) choose(el);
    });
  },
});
