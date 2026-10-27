import { test } from "node:test";
import assert from "node:assert/strict";
import { startLevel, stopLevel } from "../src/engine/level-runner.js";
import { DEFAULT_AVATAR } from "../src/data/avatar-catalog.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const player = { nickname: "Helena", avatar: DEFAULT_AVATAR };

/** Starts a throwaway level whose play function is `play`. */
function run(play, options = {}) {
  const level = { number: 99, settings: { speed: 2 }, play };
  const ends = [];
  const game = startLevel(level, { root: {}, player, onEnd: (...args) => ends.push(args), ...options });
  return { game, ends };
}

test("the level receives its settings, player and an avatar drawer", () => {
  let seen;
  run((game) => (seen = game));
  assert.equal(seen.settings.speed, 2);
  assert.equal(seen.player.nickname, "Helena");
  assert.match(seen.avatar(), /^<svg/);
  stopLevel();
});

test("winning reports once and stops the level's timers", async () => {
  let ticks = 0;
  const { ends } = run((game) => {
    game.every(5, () => (ticks += 1));
    game.after(20, () => game.win());
    game.after(25, () => game.lose("too late"));
  });
  await sleep(60);
  const ticksAtEnd = ticks;
  await sleep(30);
  assert.deepEqual(ends, [["won", ""]]);
  assert.equal(ticks, ticksAtEnd, "every() kept running after the win");
});

test("losing passes the level's message", () => {
  const { ends } = run((game) => game.lose("Time's up!"));
  assert.deepEqual(ends, [["lost", "Time's up!"]]);
});

test("stopping the level (exit or restart) runs cleanups and removes listeners", () => {
  const target = new EventTarget();
  let clicks = 0;
  let cleaned = false;
  const { ends } = run((game) => {
    game.listen(target, "click", () => (clicks += 1));
    return () => (cleaned = true);
  });
  target.dispatchEvent(new Event("click"));
  stopLevel();
  target.dispatchEvent(new Event("click"));
  assert.equal(clicks, 1);
  assert.ok(cleaned);
  assert.deepEqual(ends, [], "leaving is not a win or a loss");
});

test("starting a level stops the previous one", async () => {
  let oldTicks = 0;
  run((game) => game.every(5, () => (oldTicks += 1)));
  run(() => {});
  const before = oldTicks;
  await sleep(30);
  assert.equal(oldTicks, before);
  stopLevel();
});

test("the countdown shows the time and calls back at zero", async () => {
  const times = [];
  let timeUp = 0;
  run((game) => game.countdown(0.05, () => (timeUp += 1)), { hud: { setTime: (s) => times.push(s) } });
  await sleep(250);
  assert.equal(timeUp, 1);
  assert.ok(times[0] > 0 && times.includes(0));
  stopLevel();
});

test("showInfo writes to the level bar", () => {
  const infos = [];
  run((game) => game.showInfo("Replies 2 / 3"), { hud: { setInfo: (text) => infos.push(text) } });
  assert.deepEqual(infos, ["Replies 2 / 3"]);
  stopLevel();
});

test("an error while starting is passed on and leaves nothing running", async () => {
  let ticks = 0;
  assert.throws(() => run((game) => {
    game.every(5, () => (ticks += 1));
    throw new Error("broken level");
  }), /broken level/);
  await sleep(20);
  assert.equal(ticks, 0);
});
