import { defineLevel } from "../../engine/define-level.js";
import { pick, randomInt, shuffle } from "../../engine/random.js";
import { randomFriends } from "../../data/friends.js";

/**
 * Level 16 · Most Likely To
 * Design notes, progress and decisions: README.md in this folder.
 *
 * Quick questions, five seconds each: something happens with a friend and
 * you choose how you'd answer, from a quiet like to showing up at their
 * door. There is no wrong answer: your friends' votes appear next to yours,
 * and every way of connecting counts. At the end you get your social level.
 * The twist: the last question is "Most likely to be there when it
 * matters?" and everyone votes for you. Let the time run out twice and you
 * lose.
 */

// Each answer has an energy: 1 quiet, 4 in person.
const SITUATIONS = [
  { q: "Your friend passed their driving test.", a: ["Like their story", "\"omg congrats!!\"", "Voice note, screaming", "Call them right now"] },
  { q: "Your friend had a terrible day.", a: ["Send a heart", "\"want to talk?\"", "Send a long voice note", "Go to their place with snacks"] },
  { q: "It's your best friend's birthday.", a: ["Repost their story", "A message at midnight", "Sing on a voice note", "A handwritten card"] },
  { q: "The group chat is planning Friday.", a: ["Read and react", "\"I'm in\"", "Send a voice note with ideas", "Call everyone to organise it"] },
  { q: "You found a meme that is SO your friend.", a: ["Just send it", "Send it with \"this is you\"", "Voice note laughing", "Show it to them tomorrow in person"] },
  { q: "A friend moved to another city.", a: ["Watch their stories", "Text now and then", "Weekly voice notes", "Video call every Sunday"] },
  { q: "Your friend's song is out.", a: ["Stream it quietly", "Share it with a fire", "Send them a review voice note", "Go to their first gig"] },
  { q: "You haven't talked to a friend in months.", a: ["Like an old photo", "\"hey, miss you\"", "Voice note: \"so much to tell you\"", "Ask them to meet for a coffee"] },
  { q: "Your friend is nervous before an exam.", a: ["Send a four-leaf clover", "\"you've got this\"", "A pep-talk voice note", "Walk them to school"] },
  { q: "Your friend posted a new haircut.", a: ["Double tap", "Comment \"ICONIC\"", "DM: \"tell me everything\"", "Ask to see it in person"] },
];

const LEVELS = [
  { upTo: 1.75, name: "The Quiet Watcher", line: "You're there, even when you don't post." },
  { upTo: 2.5, name: "The Low-Key Texter", line: "Short messages, big meaning." },
  { upTo: 3.25, name: "The Voice Note Person", line: "Your friends always hear from you." },
  { upTo: 5, name: "The Shows-Up Friend", line: "If it matters, you're there in person." },
];

export default defineLevel({
  number: 16,
  signal: "There are different levels of being social",
  minigame: "Most Likely To",
  explanation: "Being social is a spectrum, from viewing a story or sending an emoji to a deep talk or meeting in person. Everyone connects at their own pace.",
  closingLine: "We don’t all speak alike. We all mean the same.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    questions: 6, // the last one is the twist
    secondsPerQuestion: 8, // Helena 01/11: 5 was too short
    misses: 2, // let the time run out this many times and you lose
    friends: 4,
  },

  play(game) {
    const s = game.settings;
    const friends = randomFriends(s.friends);
    const me = { name: game.player.nickname, avatar: game.player.avatar };
    // Every attempt is a different run: other situations, answers in another order.
    const rounds = shuffle(SITUATIONS).slice(0, s.questions - 1);
    const face = (who) => `<span class="face" title="${who.name}">${game.avatar(who.avatar, { label: who.name, crop: "head" })}</span>`;

    game.root.innerHTML = `
      <div class="likely">
        <div class="friends">${[me, ...friends].map((f) => `<div class="who">${face(f)}<span>${f.name}</span></div>`).join("")}</div>
        <div class="card"></div>
        <div class="start">
          <b>How would you answer?</b>
          <span>Something happens with a friend. <b>Click how you'd answer</b>, from a quiet like to showing up. There's no wrong answer.</span>
          <span class="rules"><b>Win:</b> answer all ${s.questions} questions (${s.secondsPerQuestion} seconds each)</span>
          <span class="rules"><b>Lose:</b> let the time run out ${s.misses} times</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".likely");
    const card = box.querySelector(".card");
    let round = 0;
    let missed = 0;
    let energies = [];
    let cancelTimer = null;
    let answering = false;

    const info = () => game.showInfo(`Question ${Math.min(round + 1, s.questions)} / ${s.questions}`);

    const ask = () => {
      info();
      if (round === s.questions - 1) return twist();
      const situation = rounds[round];
      const answers = shuffle(situation.a.map((text, i) => ({ text, energy: i + 1 })));
      card.innerHTML = `<p class="q">${situation.q}</p>` +
        `<div class="time"><i style="animation-duration:${s.secondsPerQuestion}s"></i></div>` +
        `<div class="answers">${answers.map((a) => `<button class="answer" data-energy="${a.energy}"><span>${a.text}</span><span class="votes"></span></button>`).join("")}</div>`;
      answering = true;
      cancelTimer = game.after(s.secondsPerQuestion * 1000, () => {
        answering = false;
        missed++;
        game.vibrate(60);
        if (missed >= s.misses) return game.lose("Too slow twice… Your friends are still waiting for an answer. Try again!");
        card.classList.add("missed");
        card.insertAdjacentHTML("beforeend", `<p class="note">Too slow! ${s.misses - missed} more and you're out.</p>`);
        game.after(1300, next);
      });
    };

    const next = () => {
      card.classList.remove("missed");
      round++;
      ask();
    };

    const answer = (button) => {
      answering = false;
      cancelTimer?.();
      energies.push(Number(button.dataset.energy));
      button.classList.add("mine");
      card.querySelector(".time").classList.add("stopped");
      const buttons = [...card.querySelectorAll(".answer")];
      button.querySelector(".votes").innerHTML = face(me);
      // Your friends vote too: everyone connects in their own way.
      friends.forEach((f, i) =>
        game.after(250 + i * 180, () => pick(buttons).querySelector(".votes").insertAdjacentHTML("beforeend", face(f))));
      game.vibrate(15);
      game.after(1900, next);
    };

    // The twist: the last question is about you, and everyone picks you.
    const twist = () => {
      box.classList.add("twist");
      const people = shuffle([me, ...friends]);
      card.innerHTML = `<p class="q">Most likely to be there when it matters?</p>` +
        `<div class="answers people">${people.map((p) => `<div class="answer person${p === me ? " you" : ""}">${face(p)}<span>${p.name}</span><span class="votes"></span></div>`).join("")}</div>`;
      const target = card.querySelector(".you .votes");
      friends.forEach((f, i) => game.after(700 + i * 450, () => {
        target.insertAdjacentHTML("beforeend", face(f));
        game.vibrate(20);
      }));
      const average = energies.length ? energies.reduce((a, b) => a + b, 0) / energies.length : randomInt(1, 4);
      const level = LEVELS.find((l) => average <= l.upTo);
      game.after(900 + friends.length * 450, () => {
        card.querySelector(".you").classList.add("chosen");
        card.insertAdjacentHTML("beforeend", `<p class="note">Everyone voted for you.</p><div class="level-name">${level.name}</div><p class="note">${level.line}</p>`);
      });
      game.after(4200 + friends.length * 450, () => game.win());
    };

    info();
    game.listen(box, "pointerdown", (event) => {
      const start = box.querySelector(".start");
      if (start) {
        start.remove();
        return ask();
      }
      const button = event.target.closest("button.answer");
      if (button && answering) answer(button);
    });
  },
});
