import { defineLevel } from "../../engine/define-level.js";
import { randomAvatar } from "../../data/avatar-catalog.js";
import { randomFriends } from "../../data/friends.js";
import { chance, pick, randomBetween } from "../../engine/random.js";
import { escapeHtml } from "../../ui/html.js";
import { drummer, fan, guitarist, keyboardist, singer } from "./band.js";
import { buildSong, startBand } from "./music.js";

/**
 * Level 2 · Rhythm Tap
 * Design notes, progress and decisions: README.md in this folder.
 *
 * Piano Tiles on top: notes fall in 4 columns and you hit them with the arrow
 * keys as they reach the line; each hit plays your guitar. Below, your band
 * (you on guitar, friends on vocals, keyboard and drums) plays an original
 * song, and the party livens up or fades with how well you play (only
 * visual). 3 mistakes allowed; the 4th ends the song.
 */
export default defineLevel({
  number: 2,
  signal: "Music creates connection",
  minigame: "Rhythm Tap",
  explanation: "Music is a way to connect. Sharing a song or going to a concert says what’s hard to put into words and strengthens friendships.",
  closingLine: "Alone, a note. Together, a song.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    bpm: 112, // song speed (beats per minute)
    introBars: 1, // bars the band plays before the first note
    bars: 12, // bars with notes (with the intro and ending, about 30 s)
    travelSeconds: 1.7, // time a note takes to fall to the line
    hitWindow: 0.17, // seconds before or after the line that still count as a hit
    perfectWindow: 0.06, // seconds around the line that count as "Perfect!"
    mistakesAllowed: 3, // mistakes you can make; one more ends the song
    graceSeconds: 1, // after a mistake, more misses during this time don't cost another heart
    moodPerHit: 0.06, // how much each hit livens up the party (0 to 1)
    moodPerMistake: 0.2, // how much each mistake dampens it
  },

  play(game) {
    const s = game.settings;
    const song = buildSong(s);
    const keys = { ArrowLeft: 0, ArrowDown: 1, ArrowUp: 2, ArrowRight: 3 };
    const arrows = ["←", "↓", "↑", "→"];

    let band = null;
    let mistakes = 0;
    let combo = 0;
    let hits = 0;
    let mood = 0.55;
    let finished = false;
    const notes = song.notes.map((note) => ({ ...note, el: null, done: false }));

    // Every attempt is a different show: another song (music.js), other friends in the band and another crowd.
    const friends = randomFriends(3);
    const nickname = escapeHtml(game.player.nickname);
    /** A row of fans seen from behind, spread across the stage with a little disorder. */
    const crowdRow = (count) => Array.from({ length: count }, (_, i) => {
      const hands = chance(0.3) ? pick(["phone", "stick"]) : "wave";
      const left = ((i + randomBetween(-0.3, 0.3)) / count) * 104 - 4;
      const style = `--d:${randomBetween(0, 1).toFixed(2)}s;--s:${randomBetween(0.9, 1.1).toFixed(2)};left:${left.toFixed(1)}%`;
      // Mostly everyday skin tones in the crowd; now and then a fun one.
      const look = { ...randomAvatar(), ...(chance(0.85) ? { skin: pick(CROWD_SKINS) } : {}) };
      return `<div class="fan" style="${style}">${fan(look, hands, pick(GLOW_COLOURS))}</div>`;
    }).join("");
    const fans = `<div class="crowd-row back">${crowdRow(17)}</div><div class="crowd-row front">${crowdRow(12)}</div>`;

    game.root.innerHTML = `
      <div class="rhythm" style="--beat:${song.beat}s;--mood:${mood}">
        <div class="tiles-area">
          <div class="song-progress"><i></i></div>
          <div class="lives" aria-label="Mistakes left">${"<b>♥</b>".repeat(s.mistakesAllowed)}</div>
          <div class="combo"></div>
          <div class="lanes">
            ${arrows.map((arrow, lane) => `<div class="lane lane-${lane}"><div class="receptor"><span>${arrow}</span></div></div>`).join("")}
          </div>
        </div>
        <div class="band-area">
          <div class="wall"></div>
          <div class="lights">${[0, 1, 2, 3, 4].map((i) => `<i style="--i:${i}"></i>`).join("")}</div>
          <div class="bulbs">${Array.from({ length: 18 }, (_, i) => `<i style="--i:${i}"></i>`).join("")}</div>
          <div class="speaker speaker-left"><i></i><i></i></div>
          <div class="speaker speaker-right"><i></i><i></i></div>
          <div class="floor"></div>
          <div class="member member-drums">${drummer(friends[2].avatar, friends[2].name)}<span>${friends[2].name}</span></div>
          <div class="member member-keys">${keyboardist(friends[1].avatar, friends[1].name)}<span>${friends[1].name}</span></div>
          <div class="member member-vocals">${singer(friends[0].avatar, friends[0].name)}<span>${friends[0].name}</span></div>
          <div class="member member-guitar">${guitarist(game.player.avatar, "You")}<span class="you">${nickname}</span></div>
          <div class="notes-fly"></div>
          <div class="crowd">${fans}</div>
        </div>
        <div class="start">
          <b>Press Space to start</b>
          <span>Hit the notes with the arrow keys <kbd>←</kbd> <kbd>↓</kbd> <kbd>↑</kbd> <kbd>→</kbd> when they reach the line</span>
          <span>3 mistakes allowed</span>
        </div>
      </div>`;
    const rhythm = game.root.querySelector(".rhythm");
    const lanes = [...rhythm.querySelectorAll(".lane")];
    const lanesBox = rhythm.querySelector(".lanes");
    const progress = rhythm.querySelector(".song-progress i");
    const lives = [...rhythm.querySelectorAll(".lives b")];
    const livesBox = rhythm.querySelector(".lives");
    const comboBox = rhythm.querySelector(".combo");
    const flying = rhythm.querySelector(".notes-fly");

    const setMood = (value) => {
      mood = Math.max(0, Math.min(1, value));
      rhythm.style.setProperty("--mood", mood.toFixed(3));
      rhythm.classList.toggle("mood-low", mood < 0.35);
      rhythm.classList.toggle("mood-high", mood > 0.75);
    };
    setMood(mood);

    const showInfo = () => game.showInfo(`Notes ${hits} / ${notes.length}`);
    showInfo();

    /** A short word over a lane: "Perfect!", "Great!" or "Miss". */
    const popup = (lane, text, cls) => {
      const el = document.createElement("div");
      el.className = `popup ${cls}`;
      el.textContent = text;
      lanes[lane].append(el);
      game.after(600, () => el.remove());
    };

    /** A little music note floats up from the band when the party is lively. */
    const flyNote = () => {
      if (mood < 0.5) return;
      const el = document.createElement("i");
      el.textContent = Math.random() < 0.5 ? "♪" : "♫";
      el.style.left = `${55 + Math.random() * 35}%`;
      flying.append(el);
      game.after(1600, () => el.remove());
    };

    const hit = (note, lane, offset) => {
      note.done = true;
      note.el?.remove();
      note.el = null;
      const receptor = lanes[lane].querySelector(".receptor");
      receptor.classList.remove("burst");
      void receptor.offsetWidth;
      receptor.classList.add("burst");
      hits += 1;
      combo += 1;
      band.playGuitar(lane, note.time);
      const perfect = Math.abs(offset) <= s.perfectWindow;
      popup(lane, perfect ? "Perfect!" : "Great!", perfect ? "perfect" : "great");
      lanes[lane].classList.remove("flash");
      void lanes[lane].offsetWidth;
      lanes[lane].classList.add("flash");
      setMood(mood + s.moodPerHit + (combo >= 8 ? 0.02 : 0));
      comboBox.textContent = combo >= 4 ? `${combo} combo!` : "";
      flyNote();
      showInfo();
    };

    // After losing a heart you get a moment to find the beat again: misses then don't cost another heart.
    let safeUntil = -Infinity;
    const mistake = (lane) => {
      combo = 0;
      comboBox.textContent = "";
      band.playMiss();
      popup(lane, "Miss", "miss");
      const now = band.now();
      if (now < safeUntil) return;
      safeUntil = now + s.graceSeconds;
      livesBox.classList.remove("recovering");
      void livesBox.offsetWidth;
      livesBox.classList.add("recovering");
      mistakes += 1;
      game.vibrate(80);
      setMood(mood - s.moodPerMistake);
      const heart = lives[s.mistakesAllowed - mistakes];
      heart?.classList.add("lost");
      rhythm.classList.remove("shake");
      void rhythm.offsetWidth;
      rhythm.classList.add("shake");
      if (mistakes > s.mistakesAllowed) game.lose("The song fell apart… Try again!");
    };

    const start = () => {
      rhythm.querySelector(".start")?.remove();
      document.activeElement?.blur?.();
      rhythm.classList.add("playing");
      band = startBand({ enabled: game.sound, song });
    };

    game.listen(window, "keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (!band) start();
        return;
      }
      if (!(event.code in keys)) return;
      event.preventDefault();
      if (!band || finished || event.repeat) return;
      const lane = keys[event.code];
      const now = band.now();
      lanes[lane].querySelector(".receptor").classList.add("pressed");
      // The closest note in that lane that hasn't been played yet.
      const note = notes.find((n) => !n.done && n.lane === lane && n.time - now < s.travelSeconds && now - n.time <= s.hitWindow);
      if (note && Math.abs(note.time - now) <= s.hitWindow) {
        hit(note, lane, note.time - now);
      } else {
        if (note && note.time - now < 0.4) {
          // Too early for a note that is about to arrive: it counts as that note's mistake.
          note.done = true;
          note.el?.classList.add("missed");
        }
        mistake(lane);
      }
    });
    game.listen(window, "keyup", (event) => {
      if (event.code in keys) lanes[keys[event.code]].querySelector(".receptor").classList.remove("pressed");
    });

    // Every frame: move the notes, count the ones that went past, end the song.
    game.onFrame(() => {
      if (!band || finished) return;
      const now = band.now();
      const height = lanesBox.clientHeight;
      const hitY = height * HIT_LINE;
      progress.style.width = `${Math.max(0, Math.min(100, (now / song.length) * 100))}%`;
      rhythm.classList.toggle("on-beat", now > 0 && (now / song.beat) % 1 < 0.18);

      for (const note of notes) {
        if (note.done && !note.el) continue;
        const ahead = note.time - now;
        if (!note.done && now - note.time > s.hitWindow) {
          note.done = true;
          note.el?.classList.add("missed");
          mistake(note.lane);
          if (game.ended) return;
        }
        if (ahead > s.travelSeconds) continue;
        if (!note.el) {
          note.el = document.createElement("div");
          note.el.className = "note";
          note.el.innerHTML = `<span>${arrows[note.lane]}</span>`;
          lanes[note.lane].append(note.el);
        }
        note.el.style.transform = `translateY(${hitY - (ahead / s.travelSeconds) * hitY}px)`;
        if (ahead < -0.4) {
          note.el.remove();
          note.el = null;
        }
      }

      if (now >= song.length - 4 * song.beat + song.beat) {
        finished = true;
        rhythm.classList.add("celebrating");
        setMood(1);
        game.after(1400, () => game.win());
      }
    });

    return () => band?.stop();
  },
});

/** Where the hit line is, as a share of the lanes' height. */
const HIT_LINE = 0.86;

const CROWD_SKINS = ["#f6c7a0", "#f0b48a", "#d49565", "#9a6240", "#5e3a2a"];

/** Colours of the light sticks in the crowd. */
const GLOW_COLOURS = ["#ff5fa8", "#5fd8ff", "#b6ff5f", "#ffe35f", "#c48bff"];
