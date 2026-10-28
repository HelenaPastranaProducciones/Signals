import { defineLevel } from "../../engine/define-level.js";
import { pick, randomBetween } from "../../engine/random.js";
import { escapeHtml } from "../../ui/html.js";

/**
 * Level 1 · Game & Chat
 * Design notes, progress and decisions: README.md in this folder.
 *
 * A runner: the player's avatar runs by itself towards a finish line where
 * the friends wait. Tap (or Space) to jump over obstacles. Group chat
 * messages pop up over the game: reply in time and that friend helps you
 * (warns about the next obstacle or gives an extra jump); ignore it and the
 * friend gets sad. Crash, or ignore too many messages, and you lose.
 */
export default defineLevel({
  number: 1,
  signal: "Gaming is no longer just playing",
  minigame: "Game & Chat",
  explanation: "Games like Roblox and Fortnite aren’t only about winning. They’re places where teens spend time together, share experiences and feel part of a community.",
  closingLine: "You were playing, but you were with them.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    trackSeconds: 50, // seconds of running until the finish line (at most 60)
    runSpeed: 0.45, // how fast the track moves, in screen widths per second
    jumpHeight: 130, // how high a jump goes, in pixels
    jumpSeconds: 0.75, // how long a jump lasts in the air
    minGapSeconds: 1.2, // shortest time between two obstacles
    maxGapSeconds: 2.4, // longest time between two obstacles
    firstMessageSeconds: 3, // when the first chat message arrives
    secondsBetweenMessages: 6, // how often a new chat message arrives
    secondsToReply: 4.5, // how long a message waits for your reply
    unansweredToLose: 3, // unanswered messages that make you lose
  },

  play(game) {
    const s = game.settings;
    const gravity = (8 * s.jumpHeight) / s.jumpSeconds ** 2;
    const jumpSpeed = (4 * s.jumpHeight) / s.jumpSeconds;

    let elapsed = 0;
    let height = 0; // the avatar's height above the ground, in pixels
    let speedUp = 0; // the avatar's vertical speed
    let extraJumps = 0;
    let unanswered = 0;
    let replied = 0;

    game.root.innerHTML = `
      <div class="world">
        <div class="track-progress"><div class="track-progress-fill"></div><span>🏁</span></div>
        <div class="ground"></div>
        <div class="finish">
          <div class="finish-flag">🏁</div>
          <div class="finish-friends">${FRIENDS.map((f) => `<span style="background:${f.colour}">${f.name[0]}</span>`).join("")}</div>
        </div>
        <div class="runner">${game.avatar()}<span>${escapeHtml(game.player.nickname)}</span></div>
        <div class="chat"></div>
        <div class="hint">Tap or press Space to jump · tap messages to reply</div>
      </div>`;
    const world = game.root.querySelector(".world");
    const runner = world.querySelector(".runner");
    const finish = world.querySelector(".finish");
    const chat = world.querySelector(".chat");
    const progressFill = world.querySelector(".track-progress-fill");
    game.after(4000, () => world.querySelector(".hint")?.remove());

    const showScore = () => {
      const extra = extraJumps ? ` · Extra jumps ${extraJumps}` : "";
      game.showInfo(`Replies ${replied} · Ignored ${unanswered} / ${s.unansweredToLose}${extra}`);
    };
    showScore();

    // Obstacles: each one is the moment (in seconds) it reaches the avatar.
    const obstacles = [];
    for (let t = 2.5; t < s.trackSeconds - 2; t += randomBetween(s.minGapSeconds, s.maxGapSeconds)) {
      const el = document.createElement("div");
      el.className = "obstacle";
      world.append(el);
      obstacles.push({ t, el, warned: false });
    }

    // Jumping: on the ground, or in the air if a friend gave you an extra jump.
    const jump = () => {
      if (height <= 0) {
        speedUp = jumpSpeed;
      } else if (extraJumps > 0) {
        extraJumps -= 1;
        speedUp = jumpSpeed;
        showScore();
      }
    };
    game.listen(world, "pointerdown", (event) => {
      if (event.target.closest(".bubble")) return;
      jump();
    });
    game.listen(window, "keydown", (event) => {
      if (event.code !== "Space" && event.code !== "ArrowUp") return;
      event.preventDefault();
      jump();
    });

    // A friend you replied to helps: a warning about the next obstacle, or an extra jump.
    const help = (friend) => {
      const next = obstacles.find((o) => o.t > elapsed + 0.3 && !o.warned);
      if (next && Math.random() < 0.5) {
        next.warned = true;
        next.el.classList.add("warned");
        next.el.dataset.from = `${friend.name}: jump!`;
        return "watch out for the next one!";
      }
      extraJumps += 1;
      showScore();
      return "here's an extra jump 🦘";
    };

    // Chat messages from friends, over the game.
    const sendMessage = () => {
      if (elapsed > s.trackSeconds - s.secondsToReply) return;
      const friend = pick(FRIENDS);
      const bubble = document.createElement("button");
      bubble.className = "bubble";
      bubble.style.setProperty("--friend", friend.colour);
      bubble.innerHTML = `<b>${friend.name}</b> ${pick(friend.messages)}<small>Tap to reply</small>`;
      chat.prepend(bubble);

      const ignore = game.after(s.secondsToReply * 1000, () => {
        bubble.classList.add("ignored");
        bubble.innerHTML = `<b>${friend.name} 😢</b> ...ok<small>No reply</small>`;
        bubble.disabled = true;
        unanswered += 1;
        showScore();
        game.after(2500, () => bubble.remove());
        if (unanswered >= s.unansweredToLose) game.lose("Your friends felt ignored. Try again!");
      });

      game.listen(bubble, "pointerdown", () => {
        if (bubble.disabled) return;
        ignore();
        bubble.disabled = true;
        bubble.classList.add("replied");
        replied += 1;
        bubble.innerHTML = `<b>You</b> ${pick(REPLIES)}<small>${friend.name}: ${help(friend)}</small>`;
        showScore();
        game.vibrate();
        game.after(2500, () => bubble.remove());
      });
    };
    game.after(s.firstMessageSeconds * 1000, () => {
      sendMessage();
      game.every(s.secondsBetweenMessages * 1000, sendMessage);
    });

    // Every frame: move the avatar and the track, check crashes and the finish.
    game.onFrame((dt) => {
      const width = game.root.clientWidth;
      const pixelsPerSecond = width * s.runSpeed;
      const runnerX = width * 0.15;
      elapsed += dt;

      speedUp -= gravity * dt;
      height = Math.max(0, height + speedUp * dt);
      if (height === 0) speedUp = 0;
      runner.style.transform = `translate(${runnerX}px, ${-height}px)`;
      runner.classList.toggle("in-air", height > 0);

      for (const o of obstacles) {
        const x = runnerX + (o.t - elapsed) * pixelsPerSecond;
        o.el.style.transform = `translateX(${x}px)`;
        o.el.hidden = x < -60 || x > width + 60;
        const overlaps = x < runnerX + RUNNER_HIT_WIDTH && x + OBSTACLE_WIDTH > runnerX + 12;
        if (overlaps && height < OBSTACLE_HEIGHT - 6) {
          game.vibrate([60, 40, 60]);
          game.lose("Ouch! You crashed. Try again!");
          return;
        }
      }

      finish.style.transform = `translateX(${runnerX + (s.trackSeconds - elapsed) * pixelsPerSecond}px)`;
      progressFill.style.width = `${Math.min(100, (elapsed / s.trackSeconds) * 100)}%`;
      if (elapsed >= s.trackSeconds) game.win();
    });
  },
});

// Sizes used to detect a crash; they match level.css.
const RUNNER_HIT_WIDTH = 60;
const OBSTACLE_WIDTH = 34;
const OBSTACLE_HEIGHT = 46;

// Fictional friends in the group chat.
const FRIENDS = [
  { name: "Mia", colour: "#ff7ab0", messages: ["are you coming tonight?", "look at this 😂", "did you see my story?"] },
  { name: "Leo", colour: "#5aa9ff", messages: ["who's online?", "this level is impossible", "gg yesterday 🔥"] },
  { name: "Nora", colour: "#7bd389", messages: ["help me pick a song", "I miss you guys", "wait for me!!"] },
  { name: "Kai", colour: "#ffb347", messages: ["lol", "new skin dropped 👀", "brb, dinner"] },
];

const REPLIES = ["haha yes!", "omw 🏃", "lol 😂", "same!", "❤️", "for real?"];
