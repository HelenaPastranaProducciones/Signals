import { defineLevel } from "../../engine/define-level.js";
import { pick, shuffle } from "../../engine/random.js";
import { escapeHtml } from "../../ui/html.js";
import { randomFriends } from "../../data/friends.js";
import { GESTURES, gestureSvg } from "./art.js";

/**
 * Level 7 · Ritual Simon
 * Design notes, progress and decisions: README.md in this folder.
 *
 * A Simon board with the group's gestures (high five, AYYY!, fist bump…).
 * The buttons light up in order; repeat the sequence by clicking them. It
 * starts with 2 gestures and grows by one each round up to 6, and the
 * buttons swap places every round: remember the gesture, not where it was.
 * The twist: halfway, a friend makes up a new gesture and a fifth button
 * appears. Three hearts: a mistake costs one and the sequence is shown again.
 */
export default defineLevel({
  number: 7,
  signal: "Belonging comes from rituals",
  minigame: "Ritual Simon",
  explanation: "Small repeated actions become rituals: a song every morning, playing at the same time, the same photo. They build shared memories and identity.",
  closingLine: "We do it this way because we always have.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    startLength: 2, // gestures in the first sequence
    maxSequence: 6, // the sequence grows one gesture per round up to this length
    newGestureAtLength: 4, // the round whose sequence has this many gestures brings the new gesture
    hearts: 3, // mistakes you can make; the last one ends the game
    showSeconds: 0.65, // how long each gesture lights up when the group shows the sequence
  },

  play(game) {
    const s = game.settings;
    // Every attempt is a different run: other gestures, friends and sequence.
    const chosen = shuffle(GESTURES).slice(0, 5);
    const newGesture = chosen[4];
    let gestures = chosen.slice(0, 4);
    const friends = randomFriends(3);
    const inventor = pick(friends);

    game.root.innerHTML = `
      <div class="ritual">
        <div class="crew">${friends.map((f) => `<div class="friend" data-name="${f.name}">${game.avatar(f.avatar, { label: f.name, crop: "bust", backdrop: false })}<span style="background:${f.colour}">${f.name}</span></div>`).join("")}
          <div class="friend you">${game.avatar(undefined, { label: "You", crop: "bust", backdrop: false })}<span>${escapeHtml(game.player.nickname)}</span></div>
        </div>
        <div class="table">
          <div class="banner"></div>
          <div class="pads"></div>
          <div class="hearts">${"<b>♥</b>".repeat(s.hearts)}</div>
        </div>
        <div class="start">
          <b>Do the ritual!</b>
          <span>Watch the gestures light up, then <b>click them in the same order</b>.</span>
          <span>Careful: the buttons swap places every round. Remember the gesture, not the spot.</span>
          <span class="rules"><b>Win:</b> repeat the whole ritual, ${s.maxSequence} gestures long</span>
          <span class="rules"><b>Lose:</b> make ${s.hearts} mistakes</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".ritual");
    const pads = box.querySelector(".pads");
    const banner = box.querySelector(".banner");
    const hearts = [...box.querySelectorAll(".hearts b")];
    let sequence = [];
    let step = 0;
    let turn = "waiting"; // showing, yours, done
    let lives = s.hearts;

    const say = (html) => {
      banner.innerHTML = html;
      banner.classList.remove("pop");
      void banner.offsetWidth;
      banner.classList.add("pop");
    };

    /** Draws the pads in a new random order, sliding each one from where it was. */
    const layOut = () => {
      const before = new Map([...pads.children].map((el) => [el.dataset.id, el.getBoundingClientRect()]));
      pads.innerHTML = shuffle(gestures).map((g) =>
        `<button class="pad" data-id="${g.id}" style="--c:${g.colour}">${gestureSvg(g)}<span>${g.word}</span></button>`).join("");
      pads.classList.toggle("five", gestures.length > 4);
      for (const el of pads.children) {
        const from = before.get(el.dataset.id);
        if (!from) {
          el.classList.add("new");
          continue;
        }
        const to = el.getBoundingClientRect();
        el.animate([{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` }, { transform: "none" }], { duration: 450, easing: "ease-in-out" });
      }
    };

    const flash = (id) => {
      const el = pads.querySelector(`[data-id="${id}"]`);
      if (!el) return;
      el.classList.remove("lit");
      void el.offsetWidth;
      el.classList.add("lit");
      game.after(s.showSeconds * 800, () => el.classList.remove("lit"));
    };

    /** The group shows the sequence, one gesture after another. */
    const show = () => {
      turn = "showing";
      step = 0;
      say(`<small>Round ${sequence.length - s.startLength + 1}</small>Watch the ritual…`);
      game.showInfo(`Ritual ${sequence.length} / ${s.maxSequence}`);
      sequence.forEach((id, i) => game.after(900 + i * s.showSeconds * 1000, () => flash(id)));
      game.after(900 + sequence.length * s.showSeconds * 1000, () => {
        turn = "yours";
        say(`Your turn!`);
      });
    };

    const nextRound = () => {
      const length = sequence.length ? sequence.length + 1 : s.startLength;
      // The twist: a friend makes up a new gesture, and it joins the ritual right away.
      if (length === s.newGestureAtLength && !gestures.includes(newGesture)) {
        gestures = [...gestures, newGesture];
        layOut();
        say(`<small>${inventor.name}</small>New one! “${newGesture.word}”`);
        box.querySelector(`.friend[data-name="${inventor.name}"]`)?.classList.add("inventing");
        sequence.push(newGesture.id);
        return game.after(2200, () => {
          box.querySelector(".friend.inventing")?.classList.remove("inventing");
          show();
        });
      }
      while (sequence.length < length) sequence.push(pick(gestures).id);
      layOut();
      game.after(500, show);
    };

    const tap = (pad) => {
      if (turn !== "yours") return;
      const id = pad.dataset.id;
      flash(id);
      if (id === sequence[step]) {
        step += 1;
        if (step < sequence.length) return;
        turn = "showing";
        box.classList.add("cheer");
        game.vibrate(30);
        game.after(900, () => box.classList.remove("cheer"));
        if (sequence.length >= s.maxSequence) {
          turn = "done";
          say("Ritual complete!");
          box.classList.add("cheer", "done");
          return game.after(1800, () => game.win());
        }
        say(pick(["That's it!", "Perfect!", "Yesss!", "Just like always!"]));
        return game.after(900, nextRound);
      }
      // A mistake: lose a heart, and the group shows the same sequence again.
      pad.classList.add("wrong");
      game.after(400, () => pad.classList.remove("wrong"));
      lives -= 1;
      hearts[lives]?.classList.add("lost");
      game.vibrate(80);
      if (lives <= 0) {
        turn = "done";
        return game.after(700, () => game.lose("You forgot the ritual… Try again!"));
      }
      turn = "showing";
      say("Oops! Again…");
      game.after(1000, show);
    };

    game.listen(box, "pointerdown", (event) => {
      const start = box.querySelector(".start");
      if (start) {
        start.remove();
        return nextRound();
      }
      const pad = event.target.closest(".pad");
      if (pad) tap(pad);
    });

    layOut();
  },
});
