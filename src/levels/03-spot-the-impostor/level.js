import { defineLevel } from "../../engine/define-level.js";
import { randomInt, shuffle } from "../../engine/random.js";
import { createLives, spreadOut } from "../../mechanics/odd-one-out.js";
import { escapeHtml } from "../../ui/html.js";
import { person, waving } from "./people.js";
import { place } from "./places.js";
import { TRIBES, impostor, member, tribesFor } from "./tribes.js";

/**
 * Level 3 · Spot the Impostor
 * Design notes, progress and decisions: README.md in this folder.
 *
 * Each round shows one urban tribe hanging out in its place (skaters at the
 * skatepark, gamers in a gaming café…). One person doesn't belong: tap them
 * before the time runs out. Rounds get faster, busier and the impostor
 * subtler. A wrong tap costs a heart; running out of time ends the game.
 * The twist, in the last round: the impostor is you. Your avatar turns up
 * with a group that isn't yours, and you pick the group where you belong.
 * That round can't be lost.
 */
export default defineLevel({
  number: 3,
  signal: "We don’t need everyone. We need our people",
  minigame: "Spot the Impostor",
  explanation: "Teens don’t need to fit in everywhere. They look for people who share their interests and values, and a group where they can be themselves.",
  closingLine: "You spot your people at a glance.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    rounds: 5, // rounds before the last one (finding your people)
    firstRoundSeconds: 6, // time to find the impostor in the first round
    lastRoundSeconds: 4, // time in the fifth round (rounds in between go from one to the other)
    groupSizeMin: 6, // people in the first round
    groupSizeMax: 10, // people in the fifth round
    impostorSubtlety: [0, 0, 1, 1, 2], // per round: 0 someone from another tribe, 1 half dressed like the group, 2 only one thing gives them away
    mistakesAllowed: 3, // wrong taps you can make; one more ends the game (running out of time ends it straight away)
    graceSeconds: 1, // after a mistake, more mistakes during this time don't cost another heart
    groupsToChooseFrom: 6, // groups offered in the last round (6 = every tribe)
  },

  play(game) {
    const s = game.settings;
    const you = game.player.avatar;
    const nickname = escapeHtml(game.player.nickname);
    // Every attempt is a different run: other tribes in another order, other people.
    const tribes = shuffle(TRIBES).slice(0, s.rounds);
    let round = -1;
    let clock = null;
    let busy = true;

    game.root.innerHTML = `
      <div class="impostor">
        <div class="scene"></div>
        <div class="banner"></div>
        <div class="lives"></div>
        <div class="timer"><i></i></div>
        <div class="start">
          <b>Who doesn't belong?</b>
          <span>Each group has one impostor. <b>Click</b> them before the time runs out, or you're out!</span>
          <span>3 wrong clicks allowed · <b>Click to start</b></span>
        </div>
      </div>`;
    const box = game.root.querySelector(".impostor");
    const scene = box.querySelector(".scene");
    const banner = box.querySelector(".banner");
    const timer = box.querySelector(".timer i");
    const lives = createLives(box.querySelector(".lives"), s);

    const say = (html) => {
      banner.innerHTML = html;
      banner.classList.remove("pop");
      void banner.offsetWidth;
      banner.classList.add("pop");
    };

    /** Draws a group of people over a tribe's place. */
    const drawGroup = (tribeId, people, spots) =>
      place(tribeId) + people.map((p, i) => {
        const { x, y, depth } = spots[i];
        const style = `left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;--depth:${depth.toFixed(2)};--delay:${(-Math.random() * 2).toFixed(2)}s;z-index:${Math.round(y)}`;
        return `<button class="person${p.you ? " you" : ""}" data-i="${i}" style="${style}">${p.you ? waving(you) : person(p.avatar, p.prop, p.outfit, "Someone")}${p.you ? `<span>${nickname}</span>` : ""}</button>`;
      }).join("");

    const nextRound = () => {
      round += 1;
      if (round >= s.rounds) return lastRound();
      const tribe = tribes[round];
      const progress = s.rounds > 1 ? round / (s.rounds - 1) : 1;
      const seconds = s.firstRoundSeconds + (s.lastRoundSeconds - s.firstRoundSeconds) * progress;
      const size = Math.round(s.groupSizeMin + (s.groupSizeMax - s.groupSizeMin) * progress);
      const odd = randomInt(0, size - 1);
      const subtlety = s.impostorSubtlety[Math.min(round, s.impostorSubtlety.length - 1)];
      const people = Array.from({ length: size }, (_, i) => (i === odd ? { ...impostor(tribe, subtlety), odd: true } : member(tribe)));

      scene.innerHTML = drawGroup(tribe.id, people, spreadOut(size, FLOOR));
      scene.querySelectorAll(".person").forEach((el, i) => (el.dataset.odd = String(Boolean(people[i].odd))));
      say(`<small>Round ${round + 1} / ${s.rounds}</small>${tribe.name} at the ${tribe.place.toLowerCase()}`);
      game.showInfo(`Round ${round + 1} / ${s.rounds}`);
      busy = false;

      timer.style.transition = "none";
      timer.style.width = "100%";
      void timer.offsetWidth;
      timer.style.transition = `width ${seconds}s linear`;
      timer.style.width = "0%";
      clock = game.after(seconds * 1000, () => {
        if (busy) return;
        busy = true;
        reveal();
        say("Time's up!");
        game.after(1100, () => game.lose("Too slow! The impostor slipped by… Try again!"));
      });
    };

    /** Shows who the impostor was. */
    const reveal = () => scene.querySelector('[data-odd="true"]')?.classList.add("found");

    const tap = (el) => {
      if (busy || el.classList.contains("you")) return;
      if (el.dataset.odd === "true") {
        busy = true;
        clock?.();
        const left = getComputedStyle(timer).width;
        timer.style.transition = "none";
        timer.style.width = left;
        el.classList.add("found");
        scene.classList.add("spotted");
        say(["Spotted!", "Got them!", "Nice eye!", "That's the one!"][randomInt(0, 3)]);
        game.vibrate(40);
        game.after(1000, () => {
          scene.classList.remove("spotted");
          nextRound();
        });
      } else {
        el.classList.remove("nope");
        void el.offsetWidth;
        el.classList.add("nope");
        game.vibrate(80);
        if (lives.lose()) {
          busy = true;
          clock?.();
          reveal();
          game.after(900, () => game.lose("Those were their people, not the impostor… Try again!"));
        }
      }
    };

    // The twist: you turn up with a group that isn't yours, then you find your people.
    const lastRound = () => {
      busy = true;
      timer.parentElement.hidden = true;
      game.showInfo("Last round");
      const ranked = tribesFor(you);
      const wrong = ranked[ranked.length - 1];
      const people = [...Array.from({ length: 6 }, () => member(wrong)), { you: true }];
      scene.innerHTML = drawGroup(wrong.id, people, spreadOut(people.length, FLOOR));
      scene.classList.add("awkward");
      say(`<small>Last round</small>Wait… you're the impostor here!`);

      game.after(2400, () => {
        scene.classList.remove("awkward");
        const groups = shuffle([ranked[0], ...shuffle(ranked.slice(1)).slice(0, s.groupsToChooseFrom - 1)]);
        scene.innerHTML = `<div class="groups" style="--columns:${Math.ceil(groups.length / (groups.length > 3 ? 2 : 1))}">${groups.map((tribe) => `
          <button class="group" data-tribe="${tribe.id}">
            <div class="group-place">${place(tribe.id)}</div>
            <div class="group-people">${[0, 1, 2].map(() => {
              const m = member(tribe);
              return `<div class="mini">${person(m.avatar, m.prop, m.outfit, tribe.name)}</div>`;
            }).join("")}</div>
            <span>${tribe.name}</span>
          </button>`).join("")}
        </div>
        <div class="me">${waving(you)}<span>${nickname}</span></div>`;
        say(`<small>Last round</small>Find your people`);
        busy = false;
      });
    };

    const chooseGroup = (el) => {
      if (busy) return;
      busy = true;
      const groups = [...scene.querySelectorAll(".group")];
      const me = scene.querySelector(".me");
      const target = el.getBoundingClientRect();
      const from = me.getBoundingClientRect();
      // You land on their floor, between two of them.
      me.style.setProperty("--dx", `${target.left + target.width * 0.67 - (from.left + from.width / 2)}px`);
      me.style.setProperty("--dy", `${target.bottom - target.height * 0.05 - from.bottom}px`);
      me.classList.add("joining");
      groups.forEach((g) => g.classList.toggle("chosen", g === el));
      groups.forEach((g) => g.classList.toggle("faded", g !== el));
      say("Your people! 🎉");
      game.vibrate([40, 40, 40]);
      game.after(1800, () => game.win());
    };

    game.listen(box, "pointerdown", (event) => {
      if (box.querySelector(".start")) {
        box.querySelector(".start").remove();
        nextRound();
        return;
      }
      const group = event.target.closest(".group");
      if (group) return chooseGroup(group);
      const someone = event.target.closest(".person");
      if (someone) tap(someone);
    });
  },
});

/** Where people can stand, in % of the stage: from just below the back wall to near the bottom. */
const FLOOR = { top: 58, bottom: 97, left: 9, right: 91 };
