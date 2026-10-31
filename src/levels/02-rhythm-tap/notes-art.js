/**
 * The falling notes and the targets they land on, painted like the avatar
 * (Helena, 31/10/2026): a slightly wobbly shape, flat colour with a hard
 * shadow on its right, a paint grain and a hand-drawn arrow. Each one is a
 * picture made once per lane (a CSS background), so hundreds of falling
 * notes cost nothing extra.
 */

const PAINT = '<filter id="p" x="-10%" y="-10%" width="120%" height="120%">' +
  '<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="5" result="warp"/>' +
  '<feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" result="rough"/>' +
  '<feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="9" result="noise"/>' +
  '<feColorMatrix in="noise" type="matrix" values="0 0 0 0 .16  0 0 0 0 .1  0 0 0 0 .14  1 0 0 0 -.5" result="specks"/>' +
  '<feComposite in="specks" in2="rough" operator="in" result="grain"/><feMerge><feMergeNode in="rough"/><feMergeNode in="grain"/></feMerge></filter>' +
  '<linearGradient id="c" x1="0" x2="1"><stop offset=".62" stop-color="#3a1e2a" stop-opacity="0"/><stop offset=".62" stop-color="#3a1e2a" stop-opacity=".18"/></linearGradient>';

/** A chunky hand-drawn arrow pointing up, turned for each lane. */
const ARROW = "M32 15L46 31H37V48H27V31H18Z";
const TURN = [-90, 180, 0, 90]; // ←, ↓, ↑, →

const picture = (body) => `url('data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><defs>${PAINT}</defs><g filter="url(#p)">${body}</g></svg>`)}')`;

/** A rounded, slightly uneven blob. */
const BLOB = "M14 6C26 3 40 4 52 7C59 10 60 20 59 32C60 44 58 54 50 58C38 61 24 60 13 57C5 53 4 42 5 31C4 20 6 9 14 6Z";

/** The falling note for one lane. @param {string} colour @param {number} lane */
export const notePicture = (colour, lane) => picture(
  `<path d="M14 10C26 7 40 8 52 11C59 14 60 24 59 36C60 48 58 58 50 62C38 64 24 64 13 61C5 57 4 46 5 35Z" fill="#3a1e2a" opacity=".3"/>` +
  `<path d="${BLOB}" fill="${colour}"/><path d="${BLOB}" fill="url(#c)"/>` +
  `<path d="${ARROW}" fill="#fbf6ee" transform="rotate(${TURN[lane]} 32 32)"/>`);

/** The ring where the notes of one lane must be hit. */
export const targetPicture = (colour, lane) => picture(
  `<path d="M32 5C48 4 59 16 59 32C60 47 47 59 32 59C16 60 5 48 5 32C4 17 16 5 32 5Z" fill="#fbf6ee" fill-opacity=".1" stroke="${colour}" stroke-width="5"/>` +
  `<path d="${ARROW}" fill="${colour}" transform="rotate(${TURN[lane]} 32 32)"/>`);
