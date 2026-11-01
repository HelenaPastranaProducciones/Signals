import { defineLevel } from "../../engine/define-level.js";
import { pick, shuffle } from "../../engine/random.js";
import { FRIEND_POOL, randomFriends } from "../../data/friends.js";
import { randomAvatar } from "../../data/avatar-catalog.js";
import { escapeHtml } from "../../ui/html.js";
import { CHAT_NAMES, roomBackdrop, seatSvg } from "./art.js";

/**
 * Level 9 · The Room
 * Design notes, progress and decisions: README.md in this folder.
 *
 * A room seen diagonally from above, with your group chat's name on the
 * wall: the room is the chat. Friends come in through the door with a "hi?"
 * and a ring of patience; drag each one to a free seat before they leave.
 * Halfway, someone new comes in, shyer and less patient: seat them and the
 * group welcomes them and a seat is added. 6 seated wins (chat bubbles fill
 * the room); 3 leaving loses.
 */
export default defineLevel({
  number: 9,
  signal: "The group chat is a place",
  minigame: "The Room",
  explanation: "Group chats are shared digital spaces where everyday life unfolds. Like a meeting place, they bring continuity and belonging even when apart.",
  closingLine: "The chat is where we meet.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    seatedToWin: 6, // people seated to win
    leftToLose: 3, // people leaving that make you lose
    arriveEverySeconds: 2.6, // how often someone comes in
    patienceSeconds: 7, // how long a friend waits at the door
    newcomerPatienceSeconds: 4.5, // the shy newcomer waits less
    newcomerAfterSeated: 3, // the newcomer comes in once this many are seated
  },

  play(game) {
    const s = game.settings;
    const chatName = pick(CHAT_NAMES);
    // Every attempt is a different run: other friends, room colours and chat name.
    const friends = randomFriends(9);
    const outsiderName = pick(FRIEND_POOL.filter((f) => !friends.some((g) => g.name === f.name))) ?? { name: "Alex", colour: "#5c6270" };
    const cousinOf = pick(friends).name;
    const newcomer = { ...outsiderName, avatar: randomAvatar(), newcomer: true, tag: pick([`${cousinOf}'s cousin`, "new at school", `${cousinOf}'s neighbour`]) };

    game.root.innerHTML = `
      <div class="room">
        ${roomBackdrop(escapeHtml(chatName))}
        <div class="seats">${SEATS.map((seat, i) => seatHtml(seat, i)).join("")}</div>
        <div class="me">${game.avatar(undefined, { label: "You", backdrop: false })}<span>${escapeHtml(game.player.nickname)}</span></div>
        <div class="people"></div>
        <div class="toast"></div>
        <div class="start">
          <b>Welcome them in!</b>
          <span>Friends come in through the door. <b>Drag</b> each one to a free seat before they lose patience and leave.</span>
          <span class="rules"><b>Win:</b> get ${s.seatedToWin} people sitting in the room</span>
          <span class="rules"><b>Lose:</b> ${s.leftToLose} people leave the chat</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".room");
    const seatsBox = box.querySelector(".seats");
    const people = box.querySelector(".people");
    const toastBox = box.querySelector(".toast");
    let seated = 0;
    let left = 0;
    let running = false;
    let queue = shuffle(friends);
    let newcomerDone = false;
    const waiting = new Set();

    const toast = (text) => {
      toastBox.textContent = text;
      toastBox.classList.remove("show");
      void toastBox.offsetWidth;
      toastBox.classList.add("show");
    };
    const showScore = () => game.showInfo(`Seated ${seated} / ${s.seatedToWin} · Left ${left} / ${s.leftToLose}`);
    showScore();

    /** Someone comes in and waits by the door, with a ring of patience. */
    const arrive = () => {
      if (!running) return;
      const spot = DOOR_SPOTS.find((d) => ![...waiting].some((p) => p.spot === d));
      if (!spot) return;
      const person = !newcomerDone && seated >= s.newcomerAfterSeated ? newcomer : queue.shift();
      if (!person) return;
      if (person.newcomer) newcomerDone = true;
      const patience = person.newcomer ? s.newcomerPatienceSeconds : s.patienceSeconds;
      const el = document.createElement("div");
      el.className = `person${person.newcomer ? " new" : ""}`;
      el.innerHTML = `${game.avatar(person.avatar, { label: person.name, backdrop: false })}` +
        `<i class="ring" style="--t:${patience}s"></i><em>${person.newcomer ? "hi…?" : "hi?"}</em>` +
        `<span style="background:${person.colour}">${person.name}${person.newcomer ? `<small>${escapeHtml(person.tag)}</small>` : ""}</span>`;
      el.style.left = `${spot.x}%`;
      el.style.top = `${spot.y}%`;
      people.append(el);
      const entry = { person, el, spot };
      waiting.add(entry);
      entry.cancel = game.after(patience * 1000, () => leave(entry));
      if (person.newcomer) toast(`Someone new is at the door…`);
    };

    const leave = (entry) => {
      if (!waiting.has(entry) || !running) return;
      waiting.delete(entry);
      entry.el.classList.add("leaving");
      game.after(500, () => entry.el.remove());
      left += 1;
      toast(`${entry.person.name} left the chat`);
      queue.push(entry.person); // they might come back later
      showScore();
      game.vibrate(60);
      if (left >= s.leftToLose) {
        running = false;
        game.after(800, () => game.lose("Everyone left the chat… Try again!"));
      }
    };

    const sit = (entry, seatEl) => {
      waiting.delete(entry);
      entry.cancel?.();
      seatEl.classList.add("taken");
      entry.el.remove();
      seatEl.insertAdjacentHTML("beforeend", `<div class="sitter">${game.avatar(entry.person.avatar, { label: entry.person.name, crop: "bust", backdrop: false })}</div>`);
      seated += 1;
      showScore();
      game.vibrate(20);
      if (entry.person.newcomer) {
        // The twist: the group welcomes them, and makes room for one more.
        toast(`Welcome, ${entry.person.name}!`);
        const extra = EXTRA_SEAT;
        seatsBox.insertAdjacentHTML("beforeend", seatHtml(extra, SEATS.length, "pop"));
        speak(seatsBox.querySelectorAll(".seat.taken .sitter"), ["welcome!!", "hiii", "make room!"], 1);
      }
      if (seated >= s.seatedToWin) win();
    };

    /** Chat bubbles over some seated heads. */
    const speak = (sitters, lines, count = sitters.length) => {
      shuffle([...sitters]).slice(0, count).forEach((sitter, i) => game.after(i * 250, () => {
        sitter.insertAdjacentHTML("beforeend", `<em class="said">${pick(lines)}</em>`);
      }));
    };

    // Win: the room fills with chat bubbles: the room is the chat.
    const win = () => {
      running = false;
      waiting.forEach((entry) => entry.cancel?.());
      box.classList.add("chatting");
      speak(seatsBox.querySelectorAll(".seat.taken .sitter"), ["lol", "omg hi", "who brought snacks", "this is the best", "same time tomorrow?", "haha", "finally!!", "ok what are we watching"]);
      game.after(2600, () => game.win());
    };

    // Dragging someone from the door to a seat.
    let drag = null;
    game.listen(box, "pointerdown", (event) => {
      const start = box.querySelector(".start");
      if (start) {
        start.remove();
        running = true;
        arrive();
        game.every(s.arriveEverySeconds * 1000, arrive);
        return;
      }
      const el = event.target.closest(".person");
      const entry = [...waiting].find((w) => w.el === el);
      if (!entry || !running) return;
      el.setPointerCapture?.(event.pointerId);
      el.classList.add("dragging");
      drag = { entry, startX: event.clientX, startY: event.clientY };
    });
    game.listen(window, "pointermove", (event) => {
      if (!drag) return;
      drag.entry.el.style.translate = `calc(-50% + ${event.clientX - drag.startX}px) calc(-100% + ${event.clientY - drag.startY}px)`;
      const seatEl = seatAt(event.clientX, event.clientY);
      seatsBox.querySelectorAll(".seat").forEach((sEl) => sEl.classList.toggle("hover", sEl === seatEl));
    });
    game.listen(window, "pointerup", (event) => {
      if (!drag) return;
      const { entry } = drag;
      drag = null;
      entry.el.classList.remove("dragging");
      seatsBox.querySelectorAll(".seat.hover").forEach((sEl) => sEl.classList.remove("hover"));
      const seatEl = seatAt(event.clientX, event.clientY);
      if (seatEl && running && waiting.has(entry)) return sit(entry, seatEl);
      entry.el.style.translate = ""; // back to the door
    });

    /** The free seat under a point of the screen, if any. */
    const seatAt = (x, y) => [...seatsBox.querySelectorAll(".seat:not(.taken)")].find((sEl) => {
      const r = sEl.getBoundingClientRect();
      return x > r.left - 10 && x < r.right + 10 && y > r.top - 30 && y < r.bottom + 10;
    });
  },
});

/** The seats, in % of the stage: a sofa of three against the back wall, beanbags and floor cushions. */
const SEATS = [
  { kind: "sofa", x: 46, y: 60 }, { kind: "sofa", x: 56, y: 60 }, { kind: "sofa", x: 66, y: 60 },
  { kind: "beanbag", x: 84, y: 74 }, { kind: "beanbag", x: 30, y: 86 },
  { kind: "cushion", x: 60, y: 90 }, { kind: "cushion", x: 78, y: 92 },
];
/** The seat that appears when the newcomer is welcomed. */
const EXTRA_SEAT = { kind: "cushion", x: 44, y: 92 };
/** Where people wait just inside the door. */
const DOOR_SPOTS = [{ x: 15, y: 72 }, { x: 23, y: 66 }, { x: 9, y: 86 }];

const seatHtml = (seat, i, cls = "") =>
  `<div class="seat ${seat.kind} ${cls}" data-i="${i}" style="left:${seat.x}%;top:${seat.y}%">${seatSvg(seat.kind)}</div>`;
