import { defineLevel } from "../../engine/define-level.js";
import { pick, shuffle } from "../../engine/random.js";
import { randomFriends } from "../../data/friends.js";
import { createMatch3 } from "../../mechanics/match-3.js";
import { COLLECTIBLES, collectibleSvg } from "./art.js";

/**
 * Level 17 · Collectibles Match-3
 * Design notes, progress and decisions: README.md in this folder.
 *
 * The same Match-3 board as level 6 (src/mechanics/match-3.js), with
 * collectibles from two generations: three from your older sibling's
 * childhood (warm tiles) and three from today (cool tiles). A combo across
 * generations is a line of one generation right after a line of the other:
 * alternate them. The twist: your older sibling is in the chat, recognises
 * the old ones and starts swapping stories (and stuff) with you.
 */
export default defineLevel({
  number: 17,
  signal: "The object is an excuse to connect",
  minigame: "Collectibles Match-3",
  explanation: "Cards, board games and swappable accessories give people a reason to approach each other. The value lies in the connections they make possible.",
  closingLine: "An object, and suddenly there’s something to talk about.",
  stylesheet: new URL("./level.css", import.meta.url).href,

  // Numbers that tune the level. First proposal: adjust while playing.
  settings: {
    crossGenerationCombosToWin: 5, // lines that switch generation needed to win
    duration: 45, // seconds to play
    boardSize: 7,
  },

  play(game) {
    const s = game.settings;
    const [sibling] = randomFriends(1);
    const siblingName = pick(["Big sis", "Big bro", "Your cousin"]);
    // Every attempt is a different run: the pieces sit in other places on the board.
    const kinds = shuffle(COLLECTIBLES.map((_, i) => i));
    const me = game.player.nickname;

    game.root.innerHTML = `
      <div class="collect">
        <div class="eras"><span class="old">Back then</span><span class="new">Now</span></div>
        <div class="board"></div>
        <div class="chat"></div>
        <div class="start">
          <b>Mix the generations</b>
          <span>Swap two pieces side by side (<b>drag</b>, or <b>click</b> one and then the other) to make lines of 3 or more.</span>
          <span><b class="old-tag">Warm</b> pieces are from your ${siblingName.toLowerCase().replace("your ", "")}'s childhood, <b class="new-tag">cool</b> ones are from today. A line of one kind right after a line of the other is a <b>combo</b>.</span>
          <span class="rules"><b>Win:</b> make ${s.crossGenerationCombosToWin} combos in ${s.duration} seconds</span>
          <span class="rules"><b>Lose:</b> the time runs out first</span>
          <span><b>Click to start</b></span>
        </div>
      </div>`;

    const box = game.root.querySelector(".collect");
    const chat = box.querySelector(".chat");
    let combos = 0;
    let lastOld = null; // generation of the last line cleared
    let playing = false;
    let clock = null;
    let siblingSpoke = false;

    const info = () => game.showInfo(`Combos ${combos} / ${s.crossGenerationCombosToWin}`);
    info();

    const say = (fromSibling, text) => {
      chat.insertAdjacentHTML("beforeend", fromSibling
        ? `<p class="them"><span class="face">${game.avatar(sibling.avatar, { label: siblingName, crop: "head" })}</span><span><b style="color:${sibling.colour}">${siblingName}</b>${text}</span></p>`
        : `<p class="me"><span><b>${me}</b>${text}</span></p>`);
      while (chat.children.length > 4) chat.firstElementChild.remove();
    };

    // The twist: your older sibling recognises the old stuff.
    const OLD_LINES = {
      "Tazo": ["omg TAZOS. I had a whole tin of them", "I won all my tazos at break time"],
      "Trading card": ["I traded cards every single day at school", "I still have my shiny ones somewhere"],
      "Pocket pet": ["mine died like 40 times", "I fed mine under the desk in class lol"],
    };
    const NEW_LINES = {
      "Blind-box figure": ["wait what's inside those boxes?", "ok explain the box thing to me"],
      "Enamel pin": ["your pins are so cute", "where do you even get those"],
      "Photocard": ["you collect photocards??", "show me your photocards"],
    };
    const ME_LINES = ["swap you my figure for one?", "come to my room, I'll show you", "we should start a collection together", "you never told me that!!"];

    createMatch3({
      root: box.querySelector(".board"),
      size: s.boardSize,
      kinds: kinds.length,
      drawPiece: (kind) => collectibleSvg(kinds[kind]),
      canPlay: () => playing,
      after: game.after,
      listen: game.listen,
      onClear: (lines) => {
        if (!playing) return;
        for (const line of lines) {
          const item = COLLECTIBLES[kinds[line.kind]];
          if (lastOld !== null && item.old !== lastOld) {
            combos++;
            box.classList.add("combo");
            game.after(400, () => box.classList.remove("combo"));
            game.vibrate([20, 30, 20]);
            if (combos === 1 || combos % 2 === 0) game.after(600, () => say(false, pick(ME_LINES)));
          }
          lastOld = item.old;
          box.dataset.next = item.old ? "new" : "old";
          if (!siblingSpoke || Math.random() < 0.35) {
            siblingSpoke = true;
            say(true, pick((item.old ? OLD_LINES : NEW_LINES)[item.name]));
          }
        }
        info();
        if (combos >= s.crossGenerationCombosToWin) win();
      },
    });

    const win = () => {
      playing = false;
      clock?.stop();
      game.after(500, () => say(true, "ok we're doing a swap night. bring your stuff"));
      game.after(2600, () => game.win());
    };

    game.listen(box, "pointerdown", () => {
      const start = box.querySelector(".start");
      if (!start) return;
      start.remove();
      playing = true;
      say(true, pick(["what are you playing?", "is that a match game? let me see", "oh I know those!"]));
      clock = game.countdown(s.duration, () => {
        playing = false;
        game.lose("The generations didn't mix this time… Try again!");
      });
    });
  },
});
