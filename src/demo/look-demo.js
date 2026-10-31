import { DEFAULT_AVATAR, randomAvatar } from "../data/avatar-catalog.js";
import { randomFriends } from "../data/friends.js";
import { pick } from "../engine/random.js";
import { paintedAvatar as paintedTeen } from "../avatar/painted-avatar.js";

/**
 * Style demo (Helena, 31/10/2026), opened with ?look=demo. Shows how the game
 * would look less childish, for teens: characters painted like a 2D animated
 * series, lettering that looks hand-made but reads easily, warm paper
 * colours. It doesn't touch the real game.
 */

const POSES = ["down", "hips", "wave"];
const BOTTOMS = ["jeans", "cargo", "shorts", "skirt"];

// Mostly real skin tones, so the demo reads as teens rather than cartoon creatures.
const SKINS = ["#f6c7a0", "#f0b48a", "#d49565", "#9a6240", "#5e3a2a"];
const real = (avatar) => (Math.random() < 0.85 ? { ...avatar, skin: pick(SKINS) } : avatar);

const teen = (avatar, label) => paintedTeen(real(avatar), { pose: pick(POSES), bottoms: pick(BOTTOMS), label });

/** @param {HTMLElement} app */
export function showLookDemo(app) {
  document.head.insertAdjacentHTML("beforeend",
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Shantell+Sans:wght,INFM@300..800,0..100&display=swap">` +
    `<link rel="stylesheet" href="${new URL("./look-demo.css", import.meta.url).href}">`);
  document.body.classList.add("look-demo");

  const draw = () => {
    const crew = randomFriends(4);
    crew.forEach((f) => (f.avatar = real(f.avatar)));
    const friend = crew[0];
    app.innerHTML = `
      <div class="ld">
        <p class="ld-note">Style demo · not the real game yet</p>

        <section class="ld-title">
          <h1>Signals<svg class="ld-underline" viewBox="0 0 300 20" aria-hidden="true"><path d="M4 12C60 4 140 18 200 8S280 10 296 6"/></svg></h1>
          <p>Gaming is no longer just playing</p>
          <div class="ld-me">${paintedTeen(DEFAULT_AVATAR, { pose: "hips", bottoms: "jeans", label: "You" })}</div>
          <button class="ld-btn">Play</button>
          <small>Press Enter</small>
        </section>

        <section class="ld-crew">
          <h2>Your crew</h2>
          <div class="ld-row">
            ${crew.map((f) => `<figure>${paintedTeen(f.avatar, { pose: pick(POSES), bottoms: pick(BOTTOMS), label: f.name })}<figcaption style="--c:${f.colour}">${f.name}</figcaption></figure>`).join("")}
          </div>
          <button class="ld-btn ld-btn-light" data-shuffle>Shuffle the crew</button>
        </section>

        <section class="ld-level">
          <h2>Inside a level</h2>
          <div class="ld-frame">
            <div class="ld-bar">
              <span class="ld-tag">04 · Claw Machine</span>
              <span class="ld-hud">Coins 3 · Prizes 1 / 3</span>
              <span class="ld-controls"><button class="ld-btn ld-btn-light ld-small">↺ Restart</button><button class="ld-btn ld-btn-light ld-small">✕ Exit</button></span>
            </div>
            <div class="ld-stage">
              <div class="ld-bubble" style="--c:${friend.colour}">
                <span class="ld-face">${paintedTeen(friend.avatar, { crop: "head", label: friend.name })}</span>
                <span><b>${friend.name}</b> Wait, is that a polaroid?? Can you get it for me? 🥺</span>
              </div>
              <div class="ld-bubble ld-mine">
                <span class="ld-face">${paintedTeen(DEFAULT_AVATAR, { crop: "head", label: "You" })}</span>
                <span><b>You</b> On it! 💪</span>
              </div>
              <div class="ld-over">
                <div class="ld-over-title">Game over</div>
                <div class="ld-card">
                  <p>Out of coins… and ${friend.name} is still waiting for that polaroid. Try again!</p>
                  <div class="ld-buttons"><button class="ld-btn">Try again</button><button class="ld-btn ld-btn-light">Back to map</button></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="ld-random">
          <h2>Random teens</h2>
          <div class="ld-row ld-row-small">
            ${Array.from({ length: 6 }, () => `<figure>${teen(randomAvatar(), "Someone")}</figure>`).join("")}
          </div>
        </section>
      </div>`;
    app.querySelector("[data-shuffle]").addEventListener("click", draw);
  };
  draw();
}
