import { defineLevel } from "../../engine/define-level.js";
import { chance, pick, randomBetween, shuffle } from "../../engine/random.js";
import { escapeHtml } from "../../ui/html.js";
import { FLYING_OBSTACLES, GROUND_OBSTACLES, obstacleSvg, randomLandscape, sharedDefs } from "./art.js";
import { randomFriends } from "../../data/friends.js";
import { runnerAvatar } from "./runner.js";

/**
 * Level 1 · Game & Chat
 * Design notes, progress and decisions: README.md in this folder.
 *
 * A runner: the player's avatar, drawn side-on for this level (runner.js), runs by itself
 * towards a finish line where the friends wait. Keyboard: jump over things on
 * the ground, duck under things that fly. The mouse only replies to group
 * chat messages that pop up over the game: reply in time and that friend
 * helps you (warns about the next obstacle or gives a double jump to keep);
 * ignore it and the friend gets sad. Crash, or ignore too many messages,
 * and you lose.
 */
export default defineLevel({
  number: 1,
  signal: "Gaming is no longer just playing",
  minigame: "Game & Chat",
  explanation: "Games like Roblox and Fortnite aren’t only about winning. They’re places where teens spend time together, share experiences and feel part of a community.",
  closingLine: "You were playing, but you were with them.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. Adjust while playing.
  settings: {
    trackSeconds: 45, // seconds of running until the finish line
    runSpeed: 0.45, // how fast the track moves, in screen widths per second
    jumpHeight: 170, // how high a jump goes, in pixels
    jumpSeconds: 0.8, // how long a jump lasts in the air
    obstacleSize: 1.5, // how big obstacles are (1 = their drawn size)
    obstacleSizeVariation: 0.15, // ground obstacles are up to this much bigger or smaller, at random
    minGapSeconds: 1.2, // shortest time between two obstacles
    maxGapSeconds: 2.3, // longest time between two obstacles
    flyingShare: 0.3, // share of obstacles that fly (duck under them)
    firstMessageSeconds: 3, // when the first chat message arrives
    secondsBetweenMessages: 6, // how often a new chat message arrives
    secondsToReply: 4.5, // how long a message waits for your reply
    unansweredToLose: 3, // unanswered messages that make you lose
    flipChance: 0.15, // chance that a normal jump becomes a somersault
    doubleFlipChance: 0.5, // chance that a double jump becomes a somersault
  },

  play(game) {
    const s = game.settings;
    const gravity = (8 * s.jumpHeight) / s.jumpSeconds ** 2;
    const jumpSpeed = (4 * s.jumpHeight) / s.jumpSeconds;

    let elapsed = 0;
    let height = 0; // the runner's height above the ground, in pixels
    let speedUp = 0; // the runner's vertical speed
    let ducking = false;
    let doubleJumps = 0;
    let unanswered = 0;
    let replied = 0;
    let started = false;
    let finished = false;

    // Every attempt is a different run: other friends, places, sky and obstacles.
    const friends = randomFriends(4);
    const land = randomLandscape();
    let messages = [];
    const nextMessage = () => (messages.length ? messages : (messages = shuffle(MESSAGES))).pop();

    game.root.innerHTML = `
      <div class="world">
        ${sharedDefs()}
        <div class="layer clouds"></div>
        <div class="layer hills"></div>
        ${land.scenes.map(() => `<div class="layer scene"></div>`).join("")}
        <div class="ground"></div>
        <div class="finish">
          <div class="finish-arch"><span>FINISH</span></div>
          <div class="finish-spot"></div>
          <div class="finish-friends">
            ${friends.map((f) => `<div class="friend">${runnerAvatar(f.avatar, { label: f.name })}<span style="background:${f.colour}">${f.name}</span></div>`).join("")}
          </div>
        </div>
        <div class="runner">${runnerAvatar(game.player.avatar, { label: "You" })}<span>${escapeHtml(game.player.nickname)}</span></div>
        <div class="track-progress"><div class="track-progress-fill"></div><span>🏁</span></div>
        <div class="double-jumps" title="Double jumps to spend: press Space again in the air">
          <span class="double-jumps-icon">⇈</span><span class="double-jumps-label">Double jumps</span><b>0</b>
        </div>
        <div class="start">
          <b>Press Space to start</b>
          <span><kbd>Space</kbd> or <kbd>↑</kbd> jump · again in the air: double jump</span>
          <span><kbd>↓</kbd> duck · <b>Click</b> the messages to reply</span>
        </div>
      </div>`;
    const world = game.root.querySelector(".world");
    const runner = world.querySelector(".runner");
    const finish = world.querySelector(".finish");
    const progressFill = world.querySelector(".track-progress-fill");
    const doubleJumpsBox = world.querySelector(".double-jumps");
    const ground = world.querySelector(".ground");
    const clouds = world.querySelector(".clouds");
    const hills = world.querySelector(".hills");
    const scenes = [...world.querySelectorAll(".scene")];
    clouds.style.backgroundImage = land.clouds.image;
    hills.style.backgroundImage = land.hills.image;
    scenes.forEach((el, i) => (el.style.backgroundImage = land.scenes[i].image));

    const showScore = () => {
      game.showInfo(`Replies ${replied} · Ignored ${unanswered} / ${s.unansweredToLose}`);
      doubleJumpsBox.querySelector("b").textContent = doubleJumps;
      doubleJumpsBox.classList.toggle("empty", doubleJumps === 0);
    };
    /** Makes the double-jump counter pop when it changes. */
    const bumpCounter = () => {
      doubleJumpsBox.classList.remove("bump");
      void doubleJumpsBox.offsetWidth;
      doubleJumpsBox.classList.add("bump");
    };
    showScore();

    // Obstacles: each one is the moment (in seconds) it reaches the runner.
    const obstacles = [];
    let count = 0;
    for (let t = 2.5; t < s.trackSeconds - 2.5; t += randomBetween(s.minGapSeconds, s.maxGapSeconds)) {
      const flying = count >= 3 && chance(s.flyingShare);
      const kind = pick(flying ? FLYING_OBSTACLES : GROUND_OBSTACLES);
      // Ground obstacles come in slightly different sizes; flying ones keep theirs so ducking always works.
      const size = s.obstacleSize * (flying ? 1 : randomBetween(1 - s.obstacleSizeVariation, 1 + s.obstacleSizeVariation));
      const el = document.createElement("div");
      el.className = `obstacle${flying ? " flying" : ""}`;
      el.innerHTML = obstacleSvg(kind, size);
      world.insertBefore(el, runner);
      obstacles.push({ t, el, flying, width: kind.width * size, height: kind.height * size, warned: false });
      count += 1;
    }

    // Nothing moves until the player taps or presses Space for the first time.
    const start = () => {
      started = true;
      document.activeElement?.blur?.();
      world.querySelector(".start").remove();
      game.after(s.firstMessageSeconds * 1000, () => {
        sendMessage();
        game.every(s.secondsBetweenMessages * 1000, sendMessage);
      });
    };

    /** Now and then a jump becomes a somersault, just for fun. */
    const somersault = () => {
      runner.classList.remove("flip");
      void runner.offsetWidth;
      runner.classList.add("flip");
    };

    // Jumping: on the ground, or in the air by spending a double jump.
    const jump = () => {
      if (!started) {
        start();
      } else if (finished) {
        return;
      } else if (height <= 0) {
        speedUp = jumpSpeed;
        if (chance(s.flipChance)) somersault();
      } else if (doubleJumps > 0) {
        doubleJumps -= 1;
        speedUp = jumpSpeed;
        if (chance(s.doubleFlipChance)) somersault();
        showScore();
        bumpCounter();
      }
    };
    // Ducking: in the air it also makes you fall faster.
    const duck = (on) => {
      if (!started || finished) return;
      ducking = on;
      if (on && height > 0) speedUp = Math.min(speedUp, -jumpSpeed);
    };

    // The keyboard plays; the mouse only replies to messages.
    game.listen(window, "keydown", (event) => {
      if (["Space", "ArrowUp", "KeyW"].includes(event.code)) {
        event.preventDefault();
        if (!event.repeat) jump();
      } else if (["ArrowDown", "KeyS"].includes(event.code)) {
        event.preventDefault();
        duck(true);
      }
    });
    game.listen(window, "keyup", (event) => {
      if (["ArrowDown", "KeyS"].includes(event.code)) duck(false);
    });

    // A friend you replied to helps: a warning about the next obstacle, or an extra jump.
    const help = (friend) => {
      const next = obstacles.find((o) => o.t > elapsed + 0.3 && !o.warned);
      if (next && chance(0.5)) {
        next.warned = true;
        next.el.classList.add("warned");
        next.el.dataset.from = `${friend.name}: ${next.flying ? "duck!" : "jump!"}`;
        return "watch out for the next one!";
      }
      doubleJumps += 1;
      showScore();
      bumpCounter();
      return "here's a double jump for you ⇈";
    };

    // Chat messages from friends, in random places over the sky, never over the path.
    const sendMessage = () => {
      if (finished || elapsed > s.trackSeconds - s.secondsToReply) return;
      const friend = pick(friends);
      const bubble = document.createElement("button");
      bubble.className = "bubble";
      bubble.style.setProperty("--friend", friend.colour);
      const face = `<span class="bubble-face">${game.avatar(friend.avatar, { label: friend.name, crop: "head" })}</span>`;
      bubble.innerHTML = `${face}<span class="bubble-text"><b>${friend.name}</b> ${nextMessage()}<small>Tap to reply</small></span>`;
      world.append(bubble);
      placeBubble(bubble);

      const ignore = game.after(s.secondsToReply * 1000, () => {
        if (finished) return;
        bubble.classList.add("ignored");
        bubble.innerHTML = `${face}<span class="bubble-text"><b>${friend.name} 😢</b> ...ok<small>No reply</small></span>`;
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
        bubble.innerHTML = `${face}<span class="bubble-text"><b>You</b> ${pick(REPLIES)}<small>${friend.name}: ${help(friend)}</small></span>`;
        showScore();
        game.vibrate();
        game.after(2500, () => bubble.remove());
      });
    };

    /** Puts a bubble somewhere above the path, trying not to cover the other bubbles. */
    const placeBubble = (bubble) => {
      const area = world.getBoundingClientRect();
      const pathTop = ground.getBoundingClientRect().top - area.top - PATH_CLEARANCE;
      const others = [...world.querySelectorAll(".bubble")].filter((b) => b !== bubble).map((b) => b.getBoundingClientRect());
      const w = bubble.offsetWidth;
      const h = bubble.offsetHeight;
      const maxTop = Math.max(TOP_MARGIN, pathTop - h);
      let best = null;
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const left = randomBetween(8, Math.max(8, area.width - w - 8));
        const top = randomBetween(TOP_MARGIN, maxTop);
        const overlaps = others.some((r) =>
          left < r.right - area.left && left + w > r.left - area.left && top < r.bottom - area.top && top + h > r.top - area.top);
        best = { left, top };
        if (!overlaps) break;
      }
      bubble.style.left = `${best.left}px`;
      bubble.style.top = `${best.top}px`;
    };

    // Reaching the finish: the friends cheer, then the level is won.
    const reachFinish = () => {
      finished = true;
      ducking = false;
      world.classList.add("celebrating");
      world.querySelectorAll(".bubble").forEach((b) => b.remove());
      game.vibrate([40, 40, 40]);
      game.after(1600, () => game.win());
    };

    // Every frame: move the runner, the track and the landscape; check crashes and the finish.
    game.onFrame((dt) => {
      const width = game.root.clientWidth;
      const pixelsPerSecond = width * s.runSpeed;
      const runnerX = width * 0.15;
      if (started && !finished) elapsed = Math.min(s.trackSeconds, elapsed + dt);

      speedUp -= gravity * dt;
      height = Math.max(0, height + speedUp * dt);
      if (height === 0) speedUp = 0;
      runner.style.transform = `translate(${runnerX}px, ${-height}px)`;
      runner.classList.toggle("in-air", height > 0);
      runner.classList.toggle("ducking", ducking && height === 0);
      runner.classList.toggle("waiting", !started);

      const distance = elapsed * pixelsPerSecond;
      ground.style.backgroundPositionX = `${-distance}px`;
      clouds.style.backgroundPositionX = `${-distance * land.clouds.speed}px`;
      hills.style.backgroundPositionX = `${-distance * land.hills.speed}px`;
      scenes.forEach((el, i) => (el.style.backgroundPositionX = `${-distance * land.scenes[i].speed}px`));
      paintLandscape(world, scenes, land.palettes, elapsed / s.trackSeconds);

      const runnerScale = runner.offsetWidth / 140;
      const runnerTop = height + (ducking && height === 0 ? DUCKING_TOP : STANDING_TOP) * runnerScale;
      for (const o of obstacles) {
        const x = runnerX + (o.t - elapsed) * pixelsPerSecond;
        o.el.style.transform = `translateX(${x}px)`;
        o.el.hidden = x < -80 || x > width + 80;
        if (finished) continue;
        const bottom = o.flying ? FLYING_BOTTOM : 0;
        const overlapsX = x + 4 < runnerX + runner.offsetWidth * 0.75 && x + o.width - 4 > runnerX + runner.offsetWidth * 0.3;
        const overlapsY = height < bottom + o.height - 6 && runnerTop > bottom + 4;
        if (overlapsX && overlapsY) {
          runner.classList.add("crashed");
          game.vibrate([60, 40, 60]);
          game.lose("Ouch! You crashed. Try again!");
          return;
        }
      }

      // At the end the runner stands past the arch, next to the friends.
      finish.style.transform = `translateX(${runnerX - FINISH_ARCH_ROOM + (s.trackSeconds - elapsed) * pixelsPerSecond}px)`;
      progressFill.style.width = `${(elapsed / s.trackSeconds) * 100}%`;
      if (!finished && elapsed >= s.trackSeconds) reachFinish();
    });
  },
});

// Height of the top of the runner's head above the bottom of its drawing, standing and
// ducking, in runner.js drawing units (140 wide).
const STANDING_TOP = 196;
const DUCKING_TOP = 166;
// Pixels above the ground where flying obstacles pass: ducking fits under, standing doesn't.
const FLYING_BOTTOM = 116;
// Room kept free for the path above the ground, and above the progress bar.
const PATH_CLEARANCE = 200;
const TOP_MARGIN = 36;
// Pixels from the arch's left edge to where the runner stops (arch width plus a little).
const FINISH_ARCH_ROOM = 140;

/** Sky, ground and middle layer for a point of the run (0 = start, 1 = finish). */
function paintLandscape(world, scenes, palettes, progress) {
  const position = progress * (palettes.length - 1);
  const index = Math.min(Math.floor(position), palettes.length - 2);
  const [from, to] = [palettes[index], palettes[index + 1]];
  for (const key of Object.keys(from)) world.style.setProperty(`--${key}`, mix(from[key], to[key], position - index));

  const scenePosition = progress * (scenes.length - 1);
  scenes.forEach((el, i) => (el.style.opacity = Math.max(0, 1 - Math.abs(scenePosition - i) * 1.5).toFixed(3)));
}

/** Mixes two #rrggbb colours. */
function mix(a, b, t) {
  const channel = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  return `rgb(${[0, 1, 2].map((i) => Math.round(channel(a, i) + (channel(b, i) - channel(a, i)) * t)).join(",")})`;
}

// What the friends write in the group chat. Each attempt shuffles them, so the chat is never the same.
const MESSAGES = [
  "are you coming tonight?", "look at this 😂", "did you see my story?", "who's online?", "this level is impossible",
  "gg yesterday 🔥", "help me pick a song", "I miss you guys", "wait for me!!", "lol", "new skin dropped 👀",
  "brb, dinner", "voice chat later?", "I got the rare one!!", "send me the link", "same team next round?",
  "my mum says hi 😅", "who's got snacks", "plans for saturday?", "that video 💀", "rate my fit 1-10",
  "I can't stop laughing", "you're online?? 👀", "pls carry me", "pizza at mine?", "omg did you hear",
];

const REPLIES = ["haha yes!", "omw 🏃", "lol 😂", "same!", "❤️", "for real?", "count me in", "10/10 🔥", "noooo 😭", "wait what", "yesss", "on it!"];
