import { renderAvatar } from "../avatar/render-avatar.js";

/**
 * Runs one attempt of a level: calls the level's `play(game)` and gives it
 * the `game` toolbox below. Everything a level starts through the toolbox
 * (timers, frame loops, event listeners, countdowns) is stopped
 * automatically when the attempt ends, so levels don't need cleanup code.
 *
 * An attempt ends when the level calls `game.win()` / `game.lose()`, or when
 * the player restarts or leaves (src/ui/level-session.js calls `stopLevel`).
 *
 * @typedef {object} Game
 * @property {import("./define-level.js").LevelDefinition} level
 * @property {Record<string, any>} settings  The level's `settings`.
 * @property {HTMLElement} root  Empty box where the minigame draws itself.
 * @property {{ nickname: string, avatar: Record<string, string> }} player
 * @property {boolean} ended  True once the attempt is over.
 * @property {() => void} win  Ends the attempt as won: closing line and unlocks.
 * @property {(message?: string) => void} lose  Ends the attempt as lost, with an optional message.
 * @property {(ms: number, fn: () => void) => () => void} after  Runs fn once after ms. Returns a cancel function.
 * @property {(ms: number, fn: () => void) => () => void} every  Runs fn every ms. Returns a cancel function.
 * @property {(fn: (dt: number, now: number) => void) => () => void} onFrame
 *   Runs fn on every screen frame; dt is seconds since the last frame (max 0.1).
 * @property {(target: EventTarget, type: string, fn: Function, options?: object) => void} listen
 *   addEventListener that is removed automatically.
 * @property {(seconds: number, onTimeUp?: () => void) => { secondsLeft: number, stop: () => void }} countdown
 *   Shows a clock in the level bar and calls onTimeUp when it reaches 0.
 * @property {(text: string) => void} showInfo  Text in the level bar, e.g. "Replies 2 / 3".
 * @property {(avatar?: Record<string, string>, options?: { label?: string, backdrop?: boolean }) => string} avatar
 *   SVG markup of an avatar (the player's by default).
 * @property {(pattern?: number | number[]) => void} vibrate  Vibrates on phones if the player allows it.
 */

let current = null;

/**
 * Starts an attempt of `level`, stopping any attempt still running.
 * Errors thrown by the level's `play` are passed on to the caller.
 *
 * @param {import("./define-level.js").LevelDefinition} level
 * @param {object} options
 * @param {HTMLElement} options.root
 * @param {{ nickname: string, avatar: Record<string, string> }} options.player
 * @param {boolean} [options.vibration]
 * @param {{ setInfo?: (text: string) => void, setTime?: (secondsLeft: number | null) => void }} [options.hud]
 * @param {(result: "won" | "lost", message: string) => void} [options.onEnd]
 * @returns {Game}
 */
export function startLevel(level, { root, player, vibration = true, hud = {}, onEnd }) {
  stopLevel();
  const session = { cleanups: new Set(), ended: false };
  current = session;
  const game = createGame(level, session, { root, player, vibration, hud, onEnd });
  try {
    const cleanup = level.play(game);
    if (typeof cleanup === "function") session.cleanups.add(cleanup);
  } catch (error) {
    stopLevel();
    throw error;
  }
  return game;
}

/** Stops the running attempt, if any. Safe to call at any time. */
export function stopLevel() {
  if (current) endSession(current);
  current = null;
}

function endSession(session) {
  if (session.ended) return;
  session.ended = true;
  for (const cleanup of [...session.cleanups].reverse()) {
    try {
      cleanup();
    } catch (error) {
      console.error(error);
    }
  }
  session.cleanups.clear();
}

function createGame(level, session, { root, player, vibration, hud, onEnd }) {
  /** Remembers how to undo something; returns a function that undoes it now. */
  const track = (cleanup) => {
    if (session.ended) {
      cleanup();
      return () => {};
    }
    session.cleanups.add(cleanup);
    return () => {
      session.cleanups.delete(cleanup);
      cleanup();
    };
  };

  const end = (result, message = "") => {
    if (session.ended) return;
    endSession(session);
    if (current === session) current = null;
    onEnd?.(result, message);
  };

  return {
    level,
    settings: level.settings,
    root,
    player,
    get ended() {
      return session.ended;
    },
    win: () => end("won"),
    lose: (message) => end("lost", message),

    after(ms, fn) {
      const clear = () => clearTimeout(id);
      const id = setTimeout(() => {
        session.cleanups.delete(clear); // already fired: nothing left to clean up
        if (!session.ended) fn();
      }, ms);
      return track(clear);
    },

    every(ms, fn) {
      const id = setInterval(() => {
        if (!session.ended) fn();
      }, ms);
      return track(() => clearInterval(id));
    },

    onFrame(fn) {
      let last = performance.now();
      let id;
      const loop = (now) => {
        if (session.ended) return;
        fn(Math.min((now - last) / 1000, 0.1), now);
        last = now;
        if (!session.ended) id = requestAnimationFrame(loop);
      };
      id = requestAnimationFrame(loop);
      return track(() => cancelAnimationFrame(id));
    },

    listen(target, type, fn, options) {
      target.addEventListener(type, fn, options);
      track(() => target.removeEventListener(type, fn, options));
    },

    countdown(seconds, onTimeUp) {
      const endsAt = performance.now() + seconds * 1000;
      const left = () => Math.max(0, (endsAt - performance.now()) / 1000);
      let finished = false;
      let id;
      const finish = () => {
        finished = true;
        clearInterval(id);
      };
      const tick = () => {
        if (finished || session.ended) return;
        const secondsLeft = left();
        hud.setTime?.(secondsLeft);
        if (secondsLeft <= 0) {
          finish();
          onTimeUp?.();
        }
      };
      id = setInterval(tick, 100);
      track(() => {
        finish();
        hud.setTime?.(null);
      });
      tick();
      return {
        get secondsLeft() {
          return left();
        },
        stop: finish,
      };
    },

    showInfo: (text) => hud.setInfo?.(text),
    avatar: (avatar = player.avatar, options) => renderAvatar(avatar, options),
    vibrate(pattern = 30) {
      if (vibration) globalThis.navigator?.vibrate?.(pattern);
    },
  };
}
