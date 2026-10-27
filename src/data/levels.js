/**
 * The 19 signals. Text comes from the "Signals Journal" PDF; see CLAUDE.md
 * for the mechanic and twist planned for each minigame.
 *
 * @typedef {object} Level
 * @property {number} number       1-based position on the level map.
 * @property {string} signal       Title of the signal (shown on the loading screen).
 * @property {string} minigame     Name of the minigame (shown on the map tile).
 * @property {string} explanation  Signal explanation (shown while the level loads).
 * @property {string} closingLine  Line shown when the level is completed.
 */

/** @type {Level[]} */
export const LEVELS = [
  {
    number: 1,
    signal: "Gaming is no longer just playing",
    minigame: "Game & Chat",
    explanation: "Games like Roblox and Fortnite aren’t only about winning. They’re places where teens spend time together, share experiences and feel part of a community.",
    closingLine: "You were playing, but you were with them.",
  },
  {
    number: 2,
    signal: "Music creates connection",
    minigame: "Rhythm Tap",
    explanation: "Music is a way to connect. Sharing a song or going to a concert says what’s hard to put into words and strengthens friendships.",
    closingLine: "Alone, a note. Together, a song.",
  },
  {
    number: 3,
    signal: "We don’t need everyone. We need our people",
    minigame: "Spot the Impostor",
    explanation: "Teens don’t need to fit in everywhere. They look for people who share their interests and values, and a group where they can be themselves.",
    closingLine: "You spot your people at a glance.",
  },
  {
    number: 4,
    signal: "Digital generation. Physical objects. Physical comeback",
    minigame: "Claw Machine",
    explanation: "Surrounded by screens, teens give new value to CDs, cameras, fanzines, stickers and cards: things you can keep, swap and personalise.",
    closingLine: "You can touch them. That’s why they matter.",
  },
  {
    number: 5,
    signal: "From consumer to creator",
    minigame: "Feed to Canvas",
    explanation: "Teens don’t just consume content, they create, remix and share it. Creativity is a way to express identity and connect.",
    closingLine: "One day you went from watching to making.",
  },
  {
    number: 6,
    signal: "Fandoms turn interests into communities",
    minigame: "Club Crest Match-3",
    explanation: "Being a fan means connecting with people who share your passion, through inside jokes, theories and fan art, even without ever meeting.",
    closingLine: "A shared interest, and we’re a community.",
  },
  {
    number: 7,
    signal: "Belonging comes from rituals",
    minigame: "Ritual Simon",
    explanation: "Small repeated actions become rituals: a song every morning, playing at the same time, the same photo. They build shared memories and identity.",
    closingLine: "We do it this way because we always have.",
  },
  {
    number: 8,
    signal: "Socialising doesn’t always require energy",
    minigame: "Idle Chat",
    explanation: "Staying connected doesn’t need big plans. A meme, a quick game or a video together is enough to feel close without pressure.",
    closingLine: "You don’t need to say much to be there.",
  },
  {
    number: 9,
    signal: "The group chat is a place",
    minigame: "The Room",
    explanation: "Group chats are shared digital spaces where everyday life unfolds. Like a meeting place, they bring continuity and belonging even when apart.",
    closingLine: "The chat is where we meet.",
  },
  {
    number: 10,
    signal: "Personalisation makes things ours",
    minigame: "Customizer",
    explanation: "Stickers, charms and patches turn everyday objects into reflections of who you are and which communities you belong to.",
    closingLine: "It’s not just any object. It’s mine.",
  },
  {
    number: 11,
    signal: "Friendship happens in the background",
    minigame: "Streaks",
    explanation: "You can feel close just by sharing a space, like staying on a Discord call while studying. Knowing someone is there is enough.",
    closingLine: "You don’t need to meet daily to be friends.",
  },
  {
    number: 12,
    signal: "Small things carry big meanings",
    minigame: "Spot the Difference",
    explanation: "A friendship bracelet or a handwritten note holds more meaning than it seems. Little details keep memories and affection alive.",
    closingLine: "A tiny detail can mean a lot.",
  },
  {
    number: 13,
    signal: "Shared experiences don’t need shared locations",
    minigame: "Watch Party",
    explanation: "Watching a film online or playing the same game creates togetherness across distance. What matters is who you share it with, not where you are.",
    closingLine: "Each at home, yet together.",
  },
  {
    number: 14,
    signal: "Curation is a form of self-expression",
    minigame: "Tidy Up",
    explanation: "Teens express identity through what they collect and save: boards, playlists, moodboards. Choosing references builds a visual language of who they are.",
    closingLine: "What you leave out says who you are, too.",
  },
  {
    number: 15,
    signal: "Analog gestures feel more personal",
    minigame: "Phone Off",
    explanation: "In a world of instant screens, a letter, a printed photo or a handmade gift shows time and intention. They become keepsakes.",
    closingLine: "Paper carries your pulse.",
  },
  {
    number: 16,
    signal: "There are different levels of being social",
    minigame: "Most Likely To",
    explanation: "Being social is a spectrum, from viewing a story or sending an emoji to a deep talk or meeting in person. Everyone connects at their own pace.",
    closingLine: "We don’t all speak alike. We all mean the same.",
  },
  {
    number: 17,
    signal: "The object is an excuse to connect",
    minigame: "Collectibles Match-3",
    explanation: "Cards, board games and swappable accessories give people a reason to approach each other. The value lies in the connections they make possible.",
    closingLine: "An object, and suddenly there’s something to talk about.",
  },
  {
    number: 18,
    // Not in the Signals Journal PDF: the explanation is provisional.
    signal: "Friend groups have their own culture",
    minigame: "Odd One Out",
    explanation: "Every friend group builds its own references, inside jokes and codes that only its members understand.",
    closingLine: "Only we know this code.",
  },
  {
    number: 19,
    // The PDF cuts the title off at "...leaves physical"; "traces" was added.
    signal: "Digital culture leaves physical traces",
    minigame: "Jigsaw",
    explanation: "Online moments, memes and conversations can become physical objects: printed screenshots, meme stickers, photos. They give digital life a lasting presence.",
    closingLine: "Digital leaves a trace too.",
  },
];

export const TOTAL_LEVELS = LEVELS.length;

/** @param {number} number 1-based level number. */
export const getLevel = (number) => LEVELS[number - 1];
