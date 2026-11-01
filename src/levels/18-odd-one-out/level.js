import { defineLevel } from "../../engine/define-level.js";
import { pick, shuffle } from "../../engine/random.js";
import { randomFriends } from "../../data/friends.js";
import { createLives } from "../../mechanics/odd-one-out.js";

/**
 * Level 18 · Odd One Out
 * Design notes, progress and decisions: README.md in this folder.
 *
 * Your friend group has its own codes: a secret handshake (a sequence of
 * moves), a catchphrase and a sticker. Two kinds of rounds take turns:
 * "Finish the code" (which move comes next in the handshake?) and "Who's
 * not one of us?" (everybody says the catchphrase, one of them gets it a
 * bit wrong: click them). Shares the hearts with level 3
 * (src/mechanics/odd-one-out.js). Every attempt invents a new group, with
 * new codes.
 */

// Moves of the secret handshake, each a painted sticker with a word.
const MOVES = [
  { word: "SNAP", colour: "#e9c24a" },
  { word: "CLAP", colour: "#6f9fd8" },
  { word: "FIST", colour: "#d9573f" },
  { word: "SPIN", colour: "#9c8ad0" },
  { word: "WAVE", colour: "#6fbf8c" },
  { word: "WIGGLE", colour: "#e07aa6" },
  { word: "BOW", colour: "#e2a04a" },
  { word: "POINT", colour: "#5c9aa0" },
];

// Shapes the handshake can follow: letters are moves, "?" is the missing one.
const PATTERNS = ["ABAB?", "AABAA?", "ABCABC?", "ABBABB?", "ABCAB?", "AABBAA?"];

// Each group and its catchphrase, with the near-misses an outsider would say.
const GROUPS = [
  { group: "Team Same", right: "no because SAME", wrong: ["no cause same", "no because SAME!!!", "yes because same", "no because SAEM"] },
  { group: "The Pigeons", right: "it's giving pigeon", wrong: ["it's giving pidgeon", "it gives pigeon", "it's giving pigeons", "its giving dove"] },
  { group: "Team Toast", right: "toast o'clock", wrong: ["toast time", "toast o'clok", "toast at o'clock", "toasty o'clock"] },
  { group: "The Noodles", right: "big noodle energy", wrong: ["big noodles energy", "huge noodle energy", "big noodle vibes", "big nodle energy"] },
  { group: "Bus Stop Club", right: "see you on the bus", wrong: ["see you on a bus", "see ya on the bus", "see you in the bus", "see you on the bud"] },
];

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
    patterns: 4, // rounds to complete
    duration: 40, // seconds to complete them
    mistakesAllowed: 3, // hearts
    graceSeconds: 0, // no grace: every slip counts
    people: 5, // friends in a "Who's not one of us?" round
  },

  play(game) {
    const s = game.settings;
    // Every attempt invents another group with other codes.
    const phrase = pick(GROUPS);
    const groupName = phrase.group;
    const friends = randomFriends(s.people);
    const sticker = (move, cls = "") => `<span class="sticker ${cls}" style="--c:${move.colour}">${move.word}</span>`;

    game.root.innerHTML = `
      <div class="codes">
        <div class="lives"></div>
        <div class="group">${groupName}</div>
        <div class="round"></div>
        <div class="start">
          <b>Do you know the code?</b>
          <span>You're in <b>${groupName}</b>. Every group has its own codes. Two kinds of rounds:</span>
          <span><b>Finish the code:</b> click the move that comes next in the secret handshake.</span>
          <span><b>Who's not one of us?</b> Everyone says the group's catchphrase. Click the one who gets it wrong.</span>
          <span class="rules"><b>Win:</b> get ${s.patterns} rounds right in ${s.duration} seconds</span>
          <span class="rules"><b>Lose:</b> make ${s.mistakesAllowed} mistakes, or the time runs out</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".codes");
    const roundEl = box.querySelector(".round");
    const lives = createLives(box.querySelector(".lives"), s);
    let done = 0;
    let current = null; // { answer: element that is right }
    let clock = null;

    const info = () => game.showInfo(`Codes ${done} / ${s.patterns}`);
    info();

    // Round type 1: what comes next in the handshake?
    const finishTheCode = () => {
      const pattern = pick(PATTERNS);
      const moves = shuffle(MOVES);
      const byLetter = { A: moves[0], B: moves[1], C: moves[2] };
      const seen = pattern.slice(0, -1).split("").map((l) => byLetter[l]);
      // The missing move continues the pattern: find how often it repeats.
      const n = pattern.length - 1;
      const period = [1, 2, 3, 4].find((p) => [...pattern.slice(p, n)].every((l, i) => l === pattern[i]));
      const right = byLetter[pattern[n - period]];
      const options = shuffle([right, ...shuffle(MOVES.filter((m) => m !== right)).slice(0, 2)]);
      roundEl.innerHTML = `<p class="title">Finish the code</p>` +
        `<div class="sequence">${seen.map((m) => sticker(m)).join("")}<span class="sticker missing">?</span></div>` +
        `<div class="options">${options.map((m, i) => `<button class="option" data-i="${i}">${sticker(m)}</button>`).join("")}</div>`;
      current = { answer: roundEl.querySelectorAll(".option")[options.indexOf(right)] };
    };

    // Round type 2: who says the catchphrase wrong?
    const notOneOfUs = () => {
      const odd = Math.floor(Math.random() * friends.length);
      const people = shuffle(friends);
      roundEl.innerHTML = `<p class="title">Who's not one of us?</p>` +
        `<div class="people">${people.map((f, i) => `<button class="person" data-i="${i}"><span class="said">${i === odd ? pick(phrase.wrong) : phrase.right}</span>${game.avatar(f.avatar, { label: f.name, crop: "bust", backdrop: false })}</button>`).join("")}</div>`;
      current = { answer: roundEl.querySelectorAll(".person")[odd] };
    };

    const nextRound = () => {
      info();
      roundEl.classList.remove("right");
      (done % 2 === 0 ? finishTheCode : notOneOfUs)();
    };

    const choose = (el) => {
      if (!current) return;
      if (el === current.answer) {
        current = null;
        done++;
        el.classList.add("yes");
        roundEl.classList.add("right");
        game.vibrate(25);
        info();
        if (done >= s.patterns) {
          clock?.stop();
          roundEl.insertAdjacentHTML("beforeend", `<p class="cheer">${groupName.toUpperCase()} FOREVER</p>`);
          return game.after(1600, () => game.win());
        }
        game.after(700, nextRound);
      } else {
        el.classList.add("no");
        game.vibrate(80);
        lives.lose();
        if (lives.mistakes >= s.mistakesAllowed) {
          current = null;
          clock?.stop();
          game.after(500, () => game.lose(`That's not how ${groupName} do it… Try again!`));
        }
      }
    };

    game.listen(box, "pointerdown", (event) => {
      const start = box.querySelector(".start");
      if (start) {
        start.remove();
        clock = game.countdown(s.duration, () => {
          current = null;
          game.lose("Time's up! The code is still a mystery… Try again!");
        });
        return nextRound();
      }
      const el = event.target.closest(".option, .person");
      if (el && !el.classList.contains("no")) choose(el);
    });
  },
});
