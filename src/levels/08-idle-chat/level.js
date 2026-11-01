import { defineLevel } from "../../engine/define-level.js";
import { pick, shuffle } from "../../engine/random.js";
import { randomFriends } from "../../data/friends.js";
import { escapeHtml } from "../../ui/html.js";
import { NAMELESS } from "../../config.js";

/**
 * Level 8 · Idle Chat
 * Design notes, progress and decisions: README.md in this folder.
 *
 * You're lying in bed at night, half asleep, phone in hand; the group chat
 * runs by itself beside you. Its glow fades slowly: tap one of three quick
 * reactions under the latest message (a heart, a "lol", a sticker) to keep
 * it alive. If it goes dark, you lose. After 45 seconds your eyes close,
 * and your friends keep the chat going for you and say goodnight.
 */
export default defineLevel({
  number: 8,
  signal: "Socialising doesn’t always require energy",
  minigame: "Idle Chat",
  explanation: "Staying connected doesn’t need big plans. A meme, a quick game or a video together is enough to feel close without pressure.",
  closingLine: "You don’t need to say much to be there.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    duration: 45, // seconds the chat must stay alive
    glowSeconds: 8, // seconds a full glow takes to fade out if you don't react
    messageEverySeconds: 1.8, // how often a friend writes while the chat is lively
  },

  play(game) {
    const s = game.settings;
    const name = escapeHtml(game.player.nickname);
    // Every attempt is a different run: other friends and other things to talk about.
    const friends = randomFriends(4);
    const lines = shuffle(LINES);
    let next = 0;

    const sleepy = game.avatar({ ...game.player.avatar, eyes: "sleepy" }, { label: "You", crop: "bust", backdrop: false });
    const asleep = game.avatar({ ...game.player.avatar, eyes: "happy", mouth: "oh" }, { label: "You, asleep", crop: "bust", backdrop: false });

    game.root.innerHTML = `
      <div class="bedroom">
        <div class="window"><i class="moon"></i>${"<b></b>".repeat(6)}</div>
        <div class="bed">
          <div class="pillow"></div>
          <div class="me">${sleepy}</div>
          <div class="blanket"></div>
          <div class="zzz" hidden>z<span>z</span><span>Z</span></div>
        </div>
        <div class="phone">
          <div class="chat-head"><b>the group</b><small>${friends.length + 1} online</small><i class="glow"><i></i></i></div>
          <div class="messages"></div>
        </div>
        <div class="start">
          <b>Stay in the chat… barely</b>
          <span>The chat goes on by itself. When its light starts to fade, <b>tap a reaction</b> under the last message.</span>
          <span class="rules"><b>Win:</b> keep the chat alive for ${s.duration} seconds, until you fall asleep</span>
          <span class="rules"><b>Lose:</b> the chat's light goes out because nobody (you) reacted</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".bedroom");
    const messages = box.querySelector(".messages");
    const glowFill = box.querySelector(".glow i");
    let glow = 1;
    let running = false;
    let sinceMessage = 0;

    const scrollDown = () => (messages.scrollTop = messages.scrollHeight);

    /** A friend's message, with the three quick reactions under it (only the latest one keeps them). */
    const say = (friend, text, { reactions = true } = {}) => {
      messages.querySelectorAll(".reactions").forEach((r) => r.remove());
      const face = `<span class="face">${game.avatar(friend.avatar, { label: friend.name, crop: "head" })}</span>`;
      messages.insertAdjacentHTML("beforeend", `
        <div class="msg">${face}<p><b style="color:${friend.colour}">${friend.name}</b>${text}</p></div>
        ${reactions ? `<div class="reactions">${REACTIONS.map((r) => `<button data-r="${r.id}" aria-label="${r.label}">${r.art}</button>`).join("")}</div>` : ""}`);
      scrollDown();
    };

    const react = (button) => {
      if (!running) return;
      const reaction = REACTIONS.find((r) => r.id === button.dataset.r);
      const bar = button.closest(".reactions");
      bar.outerHTML = `<div class="reacted">${reaction.art}<small>${name}</small></div>`;
      glow = 1;
      sinceMessage = s.messageEverySeconds; // someone answers soon
      game.vibrate(15);
    };

    const tick = (dt) => {
      if (!running) return;
      glow = Math.max(0, glow - dt / s.glowSeconds);
      glowFill.style.width = `${glow * 100}%`;
      box.style.setProperty("--glow", glow.toFixed(3));
      // A livelier chat has more messages; a fading one goes quiet.
      sinceMessage += dt * (0.35 + glow);
      if (sinceMessage >= s.messageEverySeconds) {
        sinceMessage = 0;
        say(pick(friends), lines[next++ % lines.length]);
      }
      if (glow <= 0) {
        running = false;
        clock.stop();
        game.lose("The chat went quiet… Try again!");
      }
    };

    // The twist: your eyes close, and your friends keep the chat going and say goodnight.
    const fallAsleep = () => {
      running = false;
      box.classList.add("asleep");
      box.querySelector(".me").innerHTML = asleep;
      box.querySelector(".zzz").hidden = false;
      messages.querySelectorAll(".reactions").forEach((r) => r.remove());
      const [a, b, c] = shuffle(friends);
      // With no name written, friends talk to you directly.
      const named = game.player.nickname !== NAMELESS;
      game.after(700, () => say(a, named ? `is ${name} asleep? lol` : "are you asleep? lol", { reactions: false }));
      game.after(1600, () => say(b, named ? `goodnight ${name}` : "goodnight!!", { reactions: false }));
      game.after(2400, () => say(c, pick(["night night", "sleep well!", "gn, see you tomorrow"]), { reactions: false }));
      game.after(3600, () => game.win());
    };

    let clock = null;
    game.listen(box, "pointerdown", (event) => {
      const start = box.querySelector(".start");
      if (start) {
        start.remove();
        running = true;
        say(friends[0], pick(["anyone up?", "can't sleep", "u guys awake?"]));
        clock = game.countdown(s.duration, fallAsleep);
        game.onFrame(tick);
        return;
      }
      const button = event.target.closest(".reactions button");
      if (button) react(button);
    });
  },
});

/** What friends write late at night. Each attempt shuffles them. */
const LINES = [
  "lol", "same", "I'm so tired", "did you see that video", "tomorrow at 10?", "brb snacks", "this song on repeat",
  "who's still online", "omg", "send the pic", "haha", "5 more minutes", "ok one more episode", "I can't stop laughing",
  "wait what", "no way", "my cat is judging me", "homework can wait", "look at this meme", "goodnight… jk",
];

/** The three quick reactions, drawn (no emojis). */
const REACTIONS = [
  { id: "heart", label: "Heart", art: `<svg viewBox="0 0 24 24"><path d="M12 21L4 13Q0 8 4 5Q8 2 12 7Q16 2 20 5Q24 8 20 13Z" fill="#d9576f" stroke="#2b2630" stroke-width="1.6"/></svg>` },
  { id: "lol", label: "lol", art: `<svg viewBox="0 0 34 24"><rect x="1" y="3" width="32" height="18" rx="9" fill="#e9c24a" stroke="#2b2630" stroke-width="1.6"/><text x="17" y="16.5" text-anchor="middle" font-family="Schoolbell, sans-serif" font-size="12" fill="#2b2630">lol</text></svg>` },
  { id: "star", label: "Sticker", art: `<svg viewBox="0 0 24 24"><path d="M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5l-5-5 7-1Z" fill="#6f9fd8" stroke="#2b2630" stroke-width="1.6" stroke-linejoin="round"/></svg>` },
];
