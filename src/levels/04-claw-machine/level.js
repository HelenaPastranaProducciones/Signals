import { defineLevel } from "../../engine/define-level.js";
import { pick, randomBetween, randomInt, shuffle } from "../../engine/random.js";
import { randomFriends } from "../../data/friends.js";
import { escapeHtml } from "../../ui/html.js";
import { DIGITAL, PHYSICAL, drawPrize } from "./objects.js";

/**
 * Level 4 · Claw Machine
 * Design notes, progress and decisions: README.md in this folder.
 *
 * A fairground claw machine seen from the front, full of physical objects
 * (polaroids, vinyls, cassettes…) mixed with digital ones (phones, tablets…).
 * The claw swings by itself; press to drop it. Win 3 physical objects with 5
 * coins. The twist: after the first try a friend asks you for one specific
 * object (marked with a heart), and it has to be one of your 3.
 */
export default defineLevel({
  number: 4,
  signal: "Digital generation. Physical objects. Physical comeback",
  minigame: "Claw Machine",
  explanation: "Surrounded by screens, teens give new value to CDs, cameras, fanzines, stickers and cards: things you can keep, swap and personalise.",
  closingLine: "You can touch them. That’s why they matter.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    objectsToCatch: 3, // physical objects you must win (one of them your friend's)
    attempts: 5, // coins: tries with the claw
    prizesInMachine: 9, // objects in the machine at the start
    digitalPrizes: 3, // how many of them are digital (they waste a try)
    clawSpeed: 28, // how fast the claw swings on the first try (% of the machine per second)
    clawSpeedUp: 7, // how much faster it swings on each following try
    grabWindow: 4.5, // how close (in % of the machine) the claw must be to an object to grab it
    friendAsksAfterTry: 1, // after this many tries your friend asks for an object
  },

  play(game) {
    const s = game.settings;
    const nickname = escapeHtml(game.player.nickname);
    const [friend] = randomFriends(1);
    // Every attempt is a different run: other objects, colours, places and machine.
    const machineColour = pick(["#ff7ab0", "#5fa8ff", "#7ad08f", "#ffb347", "#b49cff"]);
    const types = shuffle([
      ...Array.from({ length: s.prizesInMachine - s.digitalPrizes }, (_, i) => PHYSICAL[i % PHYSICAL.length]),
      ...Array.from({ length: s.digitalPrizes }, (_, i) => DIGITAL[i % DIGITAL.length]),
    ]);
    const span = (RIGHT - LEFT) / types.length;
    const prizes = types.map((kind, i) => ({
      ...kind,
      digital: DIGITAL.includes(kind),
      x: LEFT + span * (i + 0.5) + randomBetween(-span * 0.2, span * 0.2),
      lift: i % 2 ? randomBetween(9, 15) : randomBetween(0, 4),
    }));

    game.root.innerHTML = `
      <div class="arcade">
        <div class="machine" style="--body:${machineColour}">
          <div class="sign"><b>GRAB</b><i>A</i><b>MEMORY</b></div>
          <div class="glass">
            <div class="rail"></div>
            <div class="chute"></div>
            ${prizes.map((p, i) => `<div class="prize" data-i="${i}" style="left:${p.x.toFixed(1)}%;bottom:${(4 + p.lift).toFixed(1)}%;z-index:${i % 2 ? 1 : randomInt(2, 4)}">${drawPrize(p.type)}</div>`).join("")}
            <div class="claw" style="left:${LEFT}%">
              <div class="cable"></div>
              <div class="head">${CLAW}</div>
            </div>
            <div class="shine"></div>
          </div>
          <div class="panel">
            <div class="door"></div>
            <div class="coins"></div>
            <div class="button"></div>
          </div>
        </div>
        <div class="side">
          <div class="chat"></div>
          <div class="tray"><small>Your prizes</small><div class="slots">${"<span></span>".repeat(s.objectsToCatch)}</div></div>
          <div class="me">${game.avatar(undefined, { backdrop: false })}<span>${nickname}</span></div>
        </div>
        <div class="toast"></div>
        <div class="start">
          <b>Grab the real stuff!</b>
          <span>The claw moves by itself. <b>Click</b> or press <b>Space</b> to drop it.</span>
          <span>Win ${s.objectsToCatch} physical things with ${s.attempts} coins. Screens don't count!</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".arcade");
    const glass = box.querySelector(".glass");
    const claw = box.querySelector(".claw");
    const head = claw.querySelector(".head");
    const cable = claw.querySelector(".cable");
    const coinsBox = box.querySelector(".coins");
    const chat = box.querySelector(".chat");
    const slots = [...box.querySelectorAll(".tray .slots span")];
    const toastBox = box.querySelector(".toast");
    const prizeEls = [...glass.querySelectorAll(".prize")];

    let coins = s.attempts;
    let tries = 0;
    let won = 0;
    let wish = null; // the prize your friend asked for
    let gotWish = false;

    // The claw: where it is and what it is doing.
    let x = LEFT;
    let dir = 1;
    let y = 0; // how far the claw has come down, in px
    let target = 0;
    let state = "waiting"; // swinging, down, up, home, done
    let held = null;

    const speed = () => s.clawSpeed + s.clawSpeedUp * tries;
    const showCoins = () => {
      coinsBox.innerHTML = Array.from({ length: s.attempts }, (_, i) => `<i class="${i < coins ? "" : "spent"}"></i>`).join("");
      game.showInfo(`Coins ${coins} · Prizes ${won} / ${s.objectsToCatch}`);
    };
    showCoins();

    const toast = (html, kind = "") => {
      toastBox.className = `toast ${kind}`;
      toastBox.innerHTML = html;
      void toastBox.offsetWidth;
      toastBox.classList.add("show");
    };

    const message = (from, html, mine = false) => {
      const face = mine ? "" : `<span class="face">${game.avatar(friend.avatar, { label: friend.name, crop: "head" })}</span>`;
      chat.insertAdjacentHTML("beforeend", `<div class="msg${mine ? " mine" : ""}">${face}<p><b style="color:${mine ? "#ff5a3c" : friend.colour}">${from}</b>${html}</p></div>`);
      game.vibrate(30);
    };

    const place = () => {
      claw.style.left = `${x}%`;
      cable.style.height = `${y}px`;
      if (held && !held.pending && state !== "releasing") {
        held.el.style.left = `${x}%`;
        held.el.style.bottom = "auto";
        held.el.style.top = `${y + head.offsetHeight * 0.55}px`;
      }
    };

    const startTry = () => {
      x = chance50() ? LEFT : RIGHT;
      dir = x === LEFT ? 1 : -1;
      y = 0;
      head.classList.remove("closed");
      state = "swinging";
    };

    const drop = () => {
      if (state !== "swinging") return;
      coins -= 1;
      showCoins();
      state = "down";
      // Which prize, if any, sits under the claw.
      const under = prizes
        .map((p, i) => ({ p, i, gap: Math.abs(p.x - x) }))
        .filter(({ p, gap }) => !p.gone && gap <= s.grabWindow)
        .sort((a, b) => a.gap - b.gap)[0];
      const floor = glass.clientHeight - head.offsetHeight * 0.7;
      if (under) {
        const el = prizeEls[under.i];
        held = { ...under, el, pending: true };
        target = Math.min(floor, el.offsetTop - head.offsetHeight * 0.45);
      } else {
        held = null;
        target = floor;
      }
    };

    const finishTry = () => {
      tries += 1;
      const prize = held?.p;
      held = null;
      if (!prize) toast("So close! Nothing this time.");
      else if (prize.digital) toast(`📱 ${prize.name}… <b>3 notifications</b>, and they're gone.`, "digital");
      else {
        slots[won]?.insertAdjacentHTML("beforeend", drawPrize(prize.type));
        slots[won]?.classList.add("filled");
        won += 1;
        if (prize === wish) {
          gotWish = true;
          toast(`You got ${friend.name}'s ${prize.name.toLowerCase()}! 💛`, "good");
          game.after(500, () => message(friend.name, pick(["OMG you got it!! 💛 It's going straight on my wall", "NO WAY 😭 thank youuu, I'll keep it forever", "You're the best!! Come over and we'll play it 🎶"])));
        } else toast(`${prize.name}! You can keep this one 🙌`, "good");
      }
      showCoins();

      if (won >= s.objectsToCatch && gotWish) {
        state = "done";
        return game.after(1800, () => game.win());
      }
      if (coins === 0) {
        state = "done";
        const why = gotWish ? "Out of coins… so close!" : `Out of coins… and ${friend.name} is still waiting for that ${wish ? wish.name.toLowerCase() : "gift"}.`;
        return game.after(1400, () => game.lose(`${why} Try again!`));
      }
      if (tries === s.friendAsksAfterTry && !wish) ask();
      game.after(wish && tries === s.friendAsksAfterTry ? 1600 : 700, startTry);
    };

    // The twist: a friend asks for one of the physical objects still inside.
    const ask = () => {
      const left = prizes.filter((p) => !p.digital && !p.gone);
      wish = pick(left.length ? left : prizes.filter((p) => !p.gone));
      prizeEls[prizes.indexOf(wish)].classList.add("wish");
      message(friend.name, pick([
        `Wait, is that a ${wish.name.toLowerCase()}?? Can you get it for me? 🥺`,
        `Pleeease grab me the ${wish.name.toLowerCase()} with the heart! 💛`,
        `I NEED that ${wish.name.toLowerCase()} for my room 😍 get it for me?`,
      ]));
      game.after(900, () => message(nickname, "On it! 💪", true));
    };

    game.onFrame((dt) => {
      if (state === "swinging") {
        x += dir * speed() * dt;
        if (x > RIGHT) { x = RIGHT; dir = -1; }
        if (x < LEFT) { x = LEFT; dir = 1; }
      } else if (state === "down") {
        y = Math.min(target, y + glass.clientHeight * 1.1 * dt);
        if (y >= target) {
          state = "closing";
          head.classList.add("closed");
          game.after(350, () => {
            if (held) {
              held.p.gone = true;
              held.el.classList.add("held");
              held.pending = false;
            }
            state = "up";
          });
        }
      } else if (state === "up") {
        y = Math.max(0, y - glass.clientHeight * 0.8 * dt);
        if (y === 0) state = "home";
      } else if (state === "home") {
        x = Math.max(CHUTE, x - 45 * dt);
        if (x === CHUTE) {
          state = "releasing";
          head.classList.remove("closed");
          if (held) {
            held.el.classList.add("falling");
            held.el.style.top = `${glass.clientHeight}px`;
          }
          game.after(700, finishTry);
        }
      }
      place();
    });

    game.listen(box, "pointerdown", () => press());
    game.listen(window, "keydown", (event) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      press();
    });

    const press = () => {
      const start = box.querySelector(".start");
      if (start) {
        start.remove();
        message(friend.name, pick(["You're at the arcade?? Get something cool! ✨", "Ooh the claw machine, good luck!! 🍀"]));
        return game.after(400, startTry);
      }
      drop();
    };
  },
});

/** Where the claw can swing and where the prizes sit (in % of the glass width). */
const LEFT = 26;
const RIGHT = 90;
/** Where the claw drops what it caught: the hole on the left. */
const CHUTE = 10;
const chance50 = () => Math.random() < 0.5;

/** The claw head: a cap and three prongs that close around a prize. */
const CLAW = `<svg viewBox="0 0 100 90" aria-hidden="true">
  <defs><linearGradient id="claw-metal" x1="0" x2="1"><stop offset="0" stop-color="#e9edf5"/><stop offset=".5" stop-color="#b9c1d1"/><stop offset="1" stop-color="#8b93a6"/></linearGradient></defs>
  <g class="prong left"><path d="M40 30L18 52Q12 62 22 78" fill="none" stroke="url(#claw-metal)" stroke-width="8" stroke-linecap="round"/></g>
  <g class="prong right"><path d="M60 30L82 52Q88 62 78 78" fill="none" stroke="url(#claw-metal)" stroke-width="8" stroke-linecap="round"/></g>
  <g class="prong middle"><path d="M50 32V70" fill="none" stroke="#9aa2b4" stroke-width="7" stroke-linecap="round"/></g>
  <rect x="28" y="6" width="44" height="30" rx="12" fill="url(#claw-metal)"/>
  <rect x="34" y="11" width="18" height="7" rx="3.5" fill="#fff" opacity=".7"/>
  <circle cx="50" cy="28" r="5" fill="#ff5a3c"/>
</svg>`;
