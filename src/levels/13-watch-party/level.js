import { defineLevel } from "../../engine/define-level.js";
import { pick, randomBetween, shuffle } from "../../engine/random.js";
import { randomFriends } from "../../data/friends.js";
import { SHOWS, CITIES, roomSvg, tvSvg } from "./art.js";

/**
 * Level 13 · Watch Party
 * Design notes, progress and decisions: README.md in this folder.
 *
 * A split screen: your room and a friend's room in another city, both
 * watching the same show. When something big happens on a screen, tap that
 * side; tap both sides for every moment to react together. The twist:
 * halfway through, the friend's connection lags, so their screen shows
 * each moment a bit later. Tap their side too early and it's a spoiler:
 * you have to wait for them. Sync enough moments to win.
 */
export default defineLevel({
  number: 13,
  signal: "Shared experiences don’t need shared locations",
  minigame: "Watch Party",
  explanation: "Watching a film online or playing the same game creates togetherness across distance. What matters is who you share it with, not where you are.",
  closingLine: "Each at home, yet together.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    events: 10, // moments to sync on
    syncsToWin: 8, // syncs needed to win
    syncWindowSeconds: 1.4, // time to tap both sides once the moment is on both screens
    gapSeconds: [3, 4], // time between moments
    lagSeconds: [0.9, 1.7], // how late the friend's screen is after the twist
  },

  play(game) {
    const s = game.settings;
    const [friend] = randomFriends(1);
    // Every attempt is a different run: another show, city, friend and moments.
    const show = pick(SHOWS);
    const city = pick(CITIES);
    const moments = Array.from({ length: s.events }, (_, i) => show.moments[i % show.moments.length]);
    const order = shuffle(moments);
    const me = game.player.nickname;
    const side = (who, name, place) => `
      <div class="side ${who}">
        ${roomSvg(who === "mine" ? "#f0c7a8" : city.wall, who !== "mine")}
        <div class="place">${place}</div>
        <div class="tv">${tvSvg(show)}<div class="moment"></div><div class="buffer">buffering…</div></div>
        <div class="viewer">${game.avatar(who === "mine" ? game.player.avatar : friend.avatar, { label: name, crop: "bust", backdrop: false })}<span>${name}</span></div>
        <button class="react"><span class="label">React</span><small class="keys-only">${who === "mine" ? "A" : "L"}</small></button>
      </div>`;

    game.root.innerHTML = `
      <div class="watch">
        ${side("mine", me, "Your room")}
        ${side("theirs", friend.name, `${city.name}, ${city.time}`)}
        <div class="chat"></div>
        <div class="start">
          <b>Watch it together</b>
          <span>You and ${friend.name} watch <b>${show.title}</b> from home. When something big happens, <b>tap React on both screens</b><span class="keys-only"> (or press <b>A</b> and <b>L</b>)</span> to react together.</span>
          <span>If ${friend.name}'s screen is late, wait for it: reacting before they see it is a spoiler.</span>
          <span class="rules"><b>Win:</b> react together to ${s.syncsToWin} of the ${s.events} moments</span>
          <span class="rules"><b>Lose:</b> miss ${s.events - s.syncsToWin + 1} moments (or spoil them)</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".watch");
    const sides = { mine: box.querySelector(".side.mine"), theirs: box.querySelector(".side.theirs") };
    const chat = box.querySelector(".chat");
    let synced = 0;
    let missed = 0;
    let index = 0;
    let lagging = false;
    let current = null; // { at: {mine, theirs}, tapped: {mine, theirs}, text, done }
    let clockStart = 0;
    const now = () => performance.now() - clockStart;

    const info = () => game.showInfo(`Together ${synced} / ${s.syncsToWin}`);
    info();

    const say = (who, text) => {
      const name = who === "theirs" ? friend.name : me;
      chat.insertAdjacentHTML("beforeend", `<p class="${who}"><b style="color:${who === "theirs" ? friend.colour : "#d9573f"}">${name}</b>${text}</p>`);
      while (chat.children.length > 3) chat.firstElementChild.remove();
    };

    const showMoment = (who, text) => {
      const el = sides[who].querySelector(".moment");
      el.textContent = text;
      sides[who].classList.add("happening");
    };

    // Each side's React button says how that tap went (Helena, 01/11/2026).
    const feedback = (who, text) => (sides[who].querySelector(".react .label").textContent = text);

    const clear = () => {
      for (const el of Object.values(sides)) el.classList.remove("happening", "tapped", "spoiled");
      feedback("mine", "React");
      feedback("theirs", "React");
    };

    const resolve = (ok, why) => {
      if (!current || current.done) return;
      current.done = true;
      if (ok) {
        synced++;
        box.classList.add("sync");
        say(pick(["mine", "theirs"]), pick(show.reactions));
        game.vibrate(25);
        game.after(500, () => box.classList.remove("sync"));
      } else {
        missed++;
        say("theirs", why);
        game.vibrate(80);
      }
      info();
      if (synced >= s.syncsToWin) return game.after(900, () => game.win());
      if (missed > s.events - s.syncsToWin) return game.after(700, () => game.lose(`You and ${friend.name} weren't watching together… Try again!`));
      game.after(700, clear);
    };

    const nextMoment = () => {
      if (index >= s.events) return;
      // The twist, halfway: the friend's wifi starts to struggle.
      if (index === Math.floor(s.events / 2) && !lagging) {
        lagging = true;
        sides.theirs.classList.add("lagging");
        say("theirs", pick(["wait my wifi is dying", "ugh my screen is lagging", "it keeps freezing here!!"]));
        say("theirs", "don't spoil it, wait for me");
        game.after(2200, nextMoment);
        return;
      }
      const text = order[index++];
      const lag = lagging ? randomBetween(...s.lagSeconds) * 1000 : randomBetween(0, 120);
      const t = now();
      current = { at: { mine: t, theirs: t + lag }, tapped: { mine: false, theirs: false }, done: false };
      const moment = current;
      showMoment("mine", text);
      game.after(lag, () => showMoment("theirs", text));
      game.after(lag + s.syncWindowSeconds * 1000, () => {
        if (current === moment) resolve(false, pick(["you missed it!", "did you see that??", "hello?? react!"]));
      });
      game.after(lag + randomBetween(...s.gapSeconds) * 1000, nextMoment);
    };

    const tap = (who) => {
      const el = sides[who];
      if (!current || current.done) {
        if (!el.classList.contains("tapped")) {
          feedback(who, "Wait…");
          game.after(500, () => !el.classList.contains("tapped") && feedback(who, "React"));
        }
        return;
      }
      if (now() < current.at[who]) {
        // Too early: on their side, that's a spoiler.
        el.classList.add("spoiled");
        feedback(who, "Too soon!");
        return resolve(false, pick(["NO SPOILERS!!", "wait for me!", "I haven't seen it yet!"]));
      }
      current.tapped[who] = true;
      el.classList.add("tapped");
      feedback(who, "Nice!");
      if (current.tapped.mine && current.tapped.theirs) {
        feedback("mine", "Together!");
        feedback("theirs", "Together!");
        resolve(true);
      }
    };

    const begin = () => {
      box.querySelector(".start").remove();
      clockStart = performance.now();
      box.classList.add("playing");
      say("theirs", pick(["ok pressing play on 3", "ready? 3, 2, 1…", "go go go, press play"]));
      game.after(2000, nextMoment);
    };

    game.listen(box, "pointerdown", (event) => {
      if (box.querySelector(".start")) return begin();
      const el = event.target.closest(".side");
      if (el) tap(el.classList.contains("mine") ? "mine" : "theirs");
    });
    game.listen(window, "keydown", (event) => {
      if (event.repeat) return;
      const key = event.key.toLowerCase();
      if (box.querySelector(".start")) {
        if (key === " " || key === "enter") begin();
        return;
      }
      if (key === "a" || key === "arrowleft") tap("mine");
      if (key === "l" || key === "arrowright") tap("theirs");
    });
  },
});
