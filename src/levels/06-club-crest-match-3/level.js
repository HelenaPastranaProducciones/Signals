import { defineLevel } from "../../engine/define-level.js";
import { randomAvatar } from "../../data/avatar-catalog.js";
import { renderAvatar } from "../../avatar/render-avatar.js";
import { pick, randomBetween, shuffle } from "../../engine/random.js";
import { escapeHtml } from "../../ui/html.js";
import { createMatch3 } from "../../mechanics/match-3.js";
import { CLUBS, crest } from "./art.js";

/**
 * Level 6 · Club Crest Match-3
 * Design notes, progress and decisions: README.md in this folder.
 *
 * A board of invented club crests in front of a stadium stand. Swap two
 * neighbouring crests to line up 3 or more (shared engine:
 * src/mechanics/match-3.js). Every line brings fans into the stand, wearing
 * the colours of the crest matched. You support one club (a different one
 * each attempt) and sit in the stand in its shirt: its crests count double.
 * Fill the fan bar before the clock runs out and the whole stand chants
 * with you.
 */
export default defineLevel({
  number: 6,
  signal: "Fandoms turn interests into communities",
  minigame: "Club Crest Match-3",
  explanation: "Sport, a series, a game or a character can bring together people who wouldn’t otherwise have met. A fandom creates belonging, shared language and community.",
  closingLine: "A shared interest, and we’re a community.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    duration: 40, // seconds to fill the fan bar
    boardSize: 7, // crests per side of the board
    fansToWin: 70, // fans needed to fill the bar
    yourClubBonus: 2, // a line of your club's crests brings this many times more fans
  },

  play(game) {
    const s = game.settings;
    const nickname = escapeHtml(game.player.nickname);
    // Every attempt is a different run: another club, other fans in other seats.
    const clubs = shuffle(CLUBS);
    const mine = pick(clubs);
    const myIndex = clubs.indexOf(mine);
    const seats = seatsInStand();
    const you = { ...game.player.avatar, top: "jersey", topC: mine.main, acc: "scarf", acC: mine.second };

    game.root.innerHTML = `
      <div class="stadium">
        <div class="sky"></div>
        <div class="stand"></div>
        <div class="fanbar">
          <span class="crest-small">${crest(mine)}</span>
          <div class="bar"><i></i></div>
          <b class="count">0 / ${s.fansToWin}</b>
        </div>
        <div class="board"></div>
        <div class="chant" hidden>${mine.name.toUpperCase()}! ${mine.name.toUpperCase()}!</div>
        <div class="start">
          <b>Fill the stand!</b>
          <span>Swap two crests side by side (<b>drag</b>, or <b>click</b> one and then the other) to make lines of 3 or more.</span>
          <span>Your club today: <b>${mine.name}</b>. Lines of its crest bring twice the fans.</span>
          <span class="rules"><b>Win:</b> fill the fan bar (${s.fansToWin} fans) and the whole stand chants with you</span>
          <span class="rules"><b>Lose:</b> the ${s.duration} seconds run out first</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".stadium");
    const stand = box.querySelector(".stand");
    const barFill = box.querySelector(".bar i");
    const countEl = box.querySelector(".count");
    let fans = 0;
    let playing = false;
    let seated = 0;

    // You, already in the stand in your club's shirt and scarf.
    const youSeat = seats.splice(Math.floor(seats.length * 0.12), 1)[0];
    stand.insertAdjacentHTML("beforeend", fanHtml(you, youSeat, "you", nickname));

    /** Seats the next fans, in the colours of the club whose crest was matched. */
    const seatFans = (club, howMany) => {
      for (let i = 0; i < howMany && seated < seats.length; i += 1) {
        const base = randomAvatar();
        if (Math.random() < 0.85) base.skin = pick(SKINS);
        const look = { ...base, top: pick(["jersey", "tee", "hoodie"]), topC: club.main, acc: "scarf", acC: club.second, hat: "none" };
        stand.insertAdjacentHTML("beforeend", fanHtml(look, seats[seated], "arrive"));
        seated += 1;
      }
    };

    const showFans = () => {
      barFill.style.width = `${Math.min(100, (fans / s.fansToWin) * 100)}%`;
      countEl.textContent = `${Math.min(fans, s.fansToWin)} / ${s.fansToWin}`;
      game.showInfo(`Fans ${Math.min(fans, s.fansToWin)} / ${s.fansToWin}`);
    };
    showFans();

    createMatch3({
      root: box.querySelector(".board"),
      size: s.boardSize,
      kinds: clubs.length,
      drawPiece: (kind) => crest(clubs[kind]) + (kind === myIndex ? `<i class="mine"></i>` : ""),
      canPlay: () => playing,
      after: game.after,
      listen: game.listen,
      onClear: (lines, chain) => {
        if (!playing) return;
        for (const line of lines) {
          // Longer lines and chains bring more fans; your club's crest brings more again.
          const gained = Math.round(line.count * (1 + (line.count - 3) * 0.5) * chain * (line.kind === myIndex ? s.yourClubBonus : 1));
          fans += gained;
          const seatsShare = Math.round((gained / s.fansToWin) * seats.length);
          seatFans(clubs[line.kind], Math.max(1, seatsShare));
        }
        showFans();
        game.vibrate(chain > 1 ? [20, 30, 20] : 20);
        if (fans >= s.fansToWin) win();
      },
    });

    // The stand rises and chants your club's name with you.
    const win = () => {
      playing = false;
      clock?.stop();
      // Any empty seats fill up for the chant.
      seatFans(mine, seats.length);
      box.classList.add("chanting");
      box.querySelector(".chant").hidden = false;
      game.after(2600, () => game.win());
    };

    let clock = null;
    game.listen(box, "pointerdown", () => {
      const start = box.querySelector(".start");
      if (!start) return;
      start.remove();
      playing = true;
      clock = game.countdown(s.duration, () => {
        playing = false;
        game.lose("The stand stayed half empty… Try again!");
      });
    });
  },
});

// Mostly everyday skin tones in the stand; now and then a fun one.
const SKINS = ["#f6c7a0", "#f0b48a", "#d49565", "#9a6240", "#5e3a2a"];

/**
 * The seats around the board, in % of the stage: three long rows at the
 * top, and blocks on both sides of the board. Every attempt shuffles the
 * order in which they fill up a little, front rows first.
 */
function seatsInStand() {
  const seats = [];
  for (let row = 0; row < 3; row += 1) {
    for (let i = 0; i < 13; i += 1) seats.push({ x: 4 + i * 7.5 + (row % 2) * 3.5, y: 24 + row * 11, row });
  }
  for (let row = 0; row < 4; row += 1) {
    for (let i = 0; i < 3; i += 1) {
      seats.push({ x: 4 + i * 7.5 + (row % 2) * 3, y: 58 + row * 11, row: 3 + row });
      seats.push({ x: 79 + i * 7.5 - (row % 2) * 3, y: 58 + row * 11, row: 3 + row });
    }
  }
  return seats.map((seat) => ({ ...seat, order: seat.row + randomBetween(0, 2.5) })).sort((a, b) => a.order - b.order);
}

/** One fan in a seat. Uses the painted avatar (head and shoulders). */
function fanHtml(avatar, seat, cls, label = "") {
  return `<div class="fan ${cls}" style="left:${seat.x.toFixed(1)}%;top:${seat.y.toFixed(1)}%;z-index:${seat.row + 1};--d:${randomBetween(0, 0.4).toFixed(2)}s">` +
    `${fanAvatar(avatar)}${label ? `<span>${label}</span>` : ""}</div>`;
}

/** Draws the fan with the game's avatar drawing (head and shoulders). */
const fanAvatar = (avatar) => renderAvatar(avatar, { backdrop: false, crop: "bust", label: "Fan" });
