import { defineLevel } from "../../engine/define-level.js";
import { pick, shuffle } from "../../engine/random.js";
import { randomFriends } from "../../data/friends.js";
import { escapeHtml } from "../../ui/html.js";
import { CHAT_NAMES, roomBackdrop, seatSvg } from "./art.js";

/**
 * Level 9 · The Room
 * Design notes, progress and decisions: README.md in this folder.
 *
 * Helena (01/11/2026), option A "corners by topic": the room is the group
 * chat, and like a chat it has its places. The sofa by the TV is for memes,
 * the beanbags for making plans, the cushions at the front for deep talks.
 * Friends come in through the door with a message; drag each one to the
 * corner of what they're talking about before they lose patience. The
 * twist: someone writes to you in private, and a quiet corner under the
 * window opens for them. Place 8 friends to win; 3 wrong corners or people
 * leaving and you lose.
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
    placedToWin: 8, // friends in the right corner to win
    mistakesToLose: 3, // wrong corners plus friends who leave
    arriveEverySeconds: 2.8, // how often someone comes in
    patienceSeconds: 8, // how long a friend waits at the door
    privateAfterPlaced: 3, // the private message comes once this many are placed
  },

  play(game) {
    const s = game.settings;
    const chatName = pick(CHAT_NAMES);
    // Every attempt is a different run: other friends, messages, room colours and chat name.
    const friends = randomFriends(10);
    const lines = Object.fromEntries(Object.entries(TOPICS).map(([key, t]) => [key, shuffle(t.lines)]));

    game.root.innerHTML = `
      <div class="room">
        ${roomBackdrop(escapeHtml(chatName))}
        <div class="zones">${Object.entries(TOPICS).map(([key, t]) => zoneHtml(key, t)).join("")}</div>
        <div class="me">${game.avatar(undefined, { label: "You", backdrop: false })}<span>${escapeHtml(game.player.nickname)}</span></div>
        <div class="people"></div>
        <div class="toast"></div>
        <div class="start">
          <b>Every chat has its corners</b>
          <span>Friends come in with a message. <b>Drag</b> each one to the corner of what they're talking about: <b>memes</b> on the sofa, <b>plans</b> on the beanbags, <b>deep talk</b> on the cushions.</span>
          <span class="rules"><b>Win:</b> take ${s.placedToWin} friends to the right corner</span>
          <span class="rules"><b>Lose:</b> ${s.mistakesToLose} wrong corners or friends who get tired of waiting</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".room");
    const zonesBox = box.querySelector(".zones");
    const people = box.querySelector(".people");
    const toastBox = box.querySelector(".toast");
    let placed = 0;
    let mistakes = 0;
    let running = false;
    let privateDone = false;
    const queue = [...friends];
    const waiting = new Set();

    const toast = (text) => {
      toastBox.textContent = text;
      toastBox.classList.remove("show");
      void toastBox.offsetWidth;
      toastBox.classList.add("show");
    };
    const showScore = () => game.showInfo(`In place ${placed} / ${s.placedToWin} · Mistakes ${mistakes} / ${s.mistakesToLose}`);
    showScore();

    const zoneEl = (key) => zonesBox.querySelector(`.zone[data-topic="${key}"]`);
    const freeSlots = (key) => TOPICS[key].seats.length - zoneEl(key).querySelectorAll(".sitter").length;

    /** Someone comes in and waits by the door with a message, and a ring of patience. */
    const arrive = () => {
      if (!running) return;
      const spot = DOOR_SPOTS.find((d) => ![...waiting].some((p) => p.spot === d));
      if (!spot) return;
      let topic;
      // The twist: once a few are in, someone writes to you in private.
      if (!privateDone && placed >= s.privateAfterPlaced) {
        topic = "private";
      } else {
        // Only topics whose corner still has room for everyone waiting for it.
        const options = ["memes", "plans", "deep"].filter((key) => freeSlots(key) - [...waiting].filter((w) => w.topic === key).length > 0);
        if (!options.length) return;
        topic = pick(options);
      }
      const person = queue.shift() ?? pick(friends);
      if (topic === "private") {
        privateDone = true;
        zoneEl("private").classList.add("open");
        toast(`${person.name} sent you a private message`);
      }
      const text = lines[topic].shift() ?? pick(TOPICS[topic].lines);
      const el = document.createElement("div");
      el.className = `person${topic === "private" ? " private" : ""}`;
      el.innerHTML = `${game.avatar(person.avatar, { label: person.name, backdrop: false })}` +
        `<i class="ring" style="--t:${s.patienceSeconds}s"></i>${bubble(person, text, topic === "private" ? "dm" : "")}` +
        `<span style="background:${person.colour}">${person.name}</span>`;
      el.style.left = `${spot.x}%`;
      el.style.top = `${spot.y}%`;
      people.append(el);
      const entry = { person, el, spot, topic };
      waiting.add(entry);
      entry.cancel = game.after(s.patienceSeconds * 1000, () => leave(entry));
    };

    const mistake = (text) => {
      mistakes += 1;
      toast(text);
      showScore();
      game.vibrate(60);
      if (mistakes >= s.mistakesToLose) {
        running = false;
        waiting.forEach((w) => w.cancel?.());
        game.after(900, () => game.lose("The chat got all mixed up… Try again!"));
      }
    };

    const leave = (entry) => {
      if (!waiting.has(entry) || !running) return;
      waiting.delete(entry);
      entry.el.classList.add("leaving");
      game.after(500, () => entry.el.remove());
      queue.push(entry.person);
      if (entry.topic === "private") privateDone = false; // they'll try again later
      mistake(`${entry.person.name} got tired of waiting`);
    };

    /** Dropped on a corner: the right one seats them, a wrong one sends them back. */
    const drop = (entry, key) => {
      if (key !== entry.topic) {
        entry.el.style.translate = "";
        entry.el.classList.remove("wrong");
        void entry.el.offsetWidth;
        entry.el.classList.add("wrong");
        return mistake(`Wrong corner! ${entry.person.name} wants ${TOPICS[entry.topic].about}`);
      }
      if (freeSlots(key) <= 0) {
        entry.el.style.translate = "";
        return toast("That corner is full");
      }
      waiting.delete(entry);
      entry.cancel?.();
      entry.el.remove();
      const zone = zoneEl(key);
      const seatEl = zone.querySelectorAll(".seat")[zone.querySelectorAll(".sitter").length];
      seatEl.insertAdjacentHTML("beforeend", `<div class="sitter" data-name="${entry.person.name}" data-colour="${entry.person.colour}">${game.avatar(entry.person.avatar, { label: entry.person.name, crop: "bust", backdrop: false })}</div>`);
      placed += 1;
      showScore();
      game.vibrate(20);
      if (key === "private") toast("Just the two of you. Thanks for listening");
      if (placed >= s.placedToWin) win();
    };

    /** Chat bubbles over some seated heads. */
    const speak = (sitters, chatter, count = sitters.length) => {
      shuffle([...sitters]).slice(0, count).forEach((sitter, i) => game.after(i * 250, () => {
        sitter.insertAdjacentHTML("beforeend", bubble({ name: sitter.dataset.name, colour: sitter.dataset.colour }, pick(chatter), "said"));
      }));
    };

    // Win: every corner talks at once: the room is the chat.
    const win = () => {
      running = false;
      waiting.forEach((entry) => entry.cancel?.());
      box.classList.add("chatting");
      speak(zonesBox.querySelectorAll(".sitter"), CHATTER, 5);
      game.after(2600, () => game.win());
    };

    // Dragging someone from the door to a corner.
    let drag = null;
    game.listen(box, "pointerdown", (event) => {
      const startCard = box.querySelector(".start");
      if (startCard) {
        startCard.remove();
        running = true;
        arrive();
        game.every(s.arriveEverySeconds * 1000, arrive);
        return;
      }
      const el = event.target.closest(".person");
      const entry = [...waiting].find((w) => w.el === el);
      if (!entry || !running) return;
      try {
        el.setPointerCapture?.(event.pointerId);
      } catch {
        // Not a real pointer (some browsers): dragging still works without capture.
      }
      el.classList.add("dragging");
      drag = { entry, startX: event.clientX, startY: event.clientY };
    });
    game.listen(window, "pointermove", (event) => {
      if (!drag) return;
      drag.entry.el.style.translate = `calc(-50% + ${event.clientX - drag.startX}px) calc(-100% + ${event.clientY - drag.startY}px)`;
      const key = zoneAt(event.clientX, event.clientY);
      zonesBox.querySelectorAll(".zone").forEach((z) => z.classList.toggle("hover", z.dataset.topic === key));
    });
    game.listen(window, "pointerup", (event) => {
      if (!drag) return;
      const { entry } = drag;
      drag = null;
      entry.el.classList.remove("dragging");
      zonesBox.querySelectorAll(".zone.hover").forEach((z) => z.classList.remove("hover"));
      const key = zoneAt(event.clientX, event.clientY);
      if (key && running && waiting.has(entry)) return drop(entry, key);
      entry.el.style.translate = ""; // back to the door
    });

    /** The (open) corner under a point of the screen, if any. */
    const zoneAt = (x, y) => [...zonesBox.querySelectorAll(".zone")].find((z) => {
      if (z.dataset.topic === "private" && !z.classList.contains("open")) return false;
      const r = z.getBoundingClientRect();
      return x > r.left && x < r.right && y > r.top && y < r.bottom;
    })?.dataset.topic;
  },
});

/**
 * The corners of the room, in % of the stage, with their seats (in % of the
 * corner) and what people say there. "private" opens with the twist.
 */
const TOPICS = {
  memes: {
    label: "Memes", about: "to share a meme", kind: "sofa", box: { x: 38, y: 46, w: 36, h: 22 },
    seats: [{ x: 22, y: 64 }, { x: 50, y: 64 }, { x: 78, y: 64 }],
    lines: ["LMAOOO look at this", "this video is SO us", "new meme just dropped", "I can't stop watching this cat", "sending you the funniest video", "this filter is cursed", "who made this meme I'm crying"],
  },
  plans: {
    label: "Plans", about: "to make plans", kind: "beanbag", box: { x: 74, y: 62, w: 25, h: 36 },
    seats: [{ x: 50, y: 34 }, { x: 28, y: 80 }, { x: 74, y: 80 }],
    lines: ["cinema on friday?", "who's free saturday?", "beach this weekend??", "let's book the bowling", "picnic tomorrow at 5?", "birthday plans, who's in?", "study group at the library?"],
  },
  deep: {
    label: "Deep talk", about: "a deep talk", kind: "cushion", box: { x: 22, y: 74, w: 48, h: 25 },
    seats: [{ x: 18, y: 66 }, { x: 50, y: 74 }, { x: 82, y: 66 }],
    lines: ["can I tell you something?", "I'm kind of sad today", "do you ever feel left out?", "I need advice…", "things at home are hard rn", "I don't know what to study next year", "I miss how things were"],
  },
  private: {
    label: "Private", about: "to talk in private", kind: "cushion", box: { x: 22, y: 44, w: 16, h: 18 },
    seats: [{ x: 50, y: 70 }],
    lines: ["psst… can we talk, just us?", "can I tell only you?", "dm, it's private"],
  },
};

/** Where people wait just inside the door. */
const DOOR_SPOTS = [{ x: 14, y: 70 }, { x: 22, y: 64 }, { x: 8, y: 86 }];

const zoneHtml = (key, t) =>
  `<div class="zone ${key}" data-topic="${key}" style="left:${t.box.x}%;top:${t.box.y}%;width:${t.box.w}%;height:${t.box.h}%;--w:${t.box.w}">` +
  t.seats.map((seat) => `<div class="seat ${t.kind}" style="left:${seat.x}%;top:${seat.y}%">${seatSvg(t.kind)}</div>`).join("") +
  `<b class="zone-label">${t.label}</b></div>`;

/**
 * A message bubble like in a messaging app: the sender's name in their
 * colour, the text, and the time with two ticks, with a little tail.
 */
let minutes = 21 * 60 + 2;
function bubble(person, text, cls = "") {
  minutes += 1;
  const time = `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  return `<em class="bubble ${cls}"><b style="color:${person.colour}">${person.name}</b>${text}<small>${time} <i>✓✓</i></small></em>`;
}

/** What friends say when everyone's in. */
const CHATTER = ["lmaooo", "who's bringing snacks??", "ok what are we watching", "brb", "same time tomorrow?", "this is the best", "send the pics later", "wait who has the charger", "can't stop laughing", "everyone's here!!"];
