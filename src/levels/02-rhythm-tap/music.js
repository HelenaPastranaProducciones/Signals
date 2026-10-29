/**
 * Level 2's song: an original, cheerful pop loop played live with the Web
 * Audio API (no sound files). The friends' instruments (drums, bass, piano,
 * vocals) play by themselves; the guitar notes are the player's, and only
 * sound when hit.
 *
 * Times are in seconds from the start of the song.
 */

/** C, G, Am, F: one chord per bar. Each chord lists the 4 guitar notes (one per lane, low to high) as MIDI numbers. */
const CHORDS = [
  { root: 48, lanes: [60, 64, 67, 72] }, // C
  { root: 43, lanes: [59, 62, 67, 71] }, // G
  { root: 45, lanes: [60, 64, 69, 72] }, // Am
  { root: 41, lanes: [60, 65, 69, 72] }, // F
];

/**
 * The guitar part, as lanes on the 8 eighth-note steps of a bar (null = rest).
 * Each section repeats its two patterns; it gets busier towards the end.
 */
const SECTIONS = [
  [[0, null, 2, null, 1, null, 3, null], [3, null, 1, null, 2, null, 0, null]],
  [[0, null, 2, 1, null, 3, null, null], [3, null, 2, null, 0, 1, null, null]],
  [[0, 2, null, 1, 3, null, 2, null], [3, null, 1, 0, null, 2, 3, null]],
];

/** The vocal line: one long note per bar (MIDI), sung by the friend at the mic. */
const VOCALS = [76, 74, 72, 72];

/**
 * @param {{ bpm: number, introBars: number, bars: number }} options
 * @returns {{ beat: number, length: number, notes: { time: number, lane: number, bar: number }[] }}
 */
export function buildSong({ bpm, introBars, bars }) {
  const beat = 60 / bpm;
  const notes = [];
  for (let bar = 0; bar < bars; bar += 1) {
    const section = SECTIONS[Math.min(SECTIONS.length - 1, Math.floor((bar / bars) * SECTIONS.length))];
    const pattern = section[bar % 2];
    pattern.forEach((lane, step) => {
      if (lane !== null) notes.push({ time: (introBars + bar) * 4 * beat + step * (beat / 2), lane, bar: introBars + bar });
    });
  }
  return { beat, length: (introBars + bars + 1) * 4 * beat, notes };
}

const frequency = (midi) => 440 * 2 ** ((midi - 69) / 12);

/**
 * Starts the band. When `enabled` is false (sound off in Options, or no
 * audio in the browser) nothing plays, but the clock still runs.
 *
 * @param {{ enabled: boolean, beat: number, length: number }} options
 */
export function startBand({ enabled, beat, length }) {
  const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
  const ctx = enabled && Context ? new Context() : null;
  const startedAt = performance.now();
  const t0 = ctx ? ctx.currentTime + 0.12 : 0;
  /** Seconds since the song started (negative during the short lead-in). */
  const now = () => (ctx ? ctx.currentTime - t0 : (performance.now() - startedAt) / 1000 - 0.12);

  let master;
  let noiseBuffer;
  if (ctx) {
    master = ctx.createGain();
    master.gain.value = 0.55;
    const compressor = ctx.createDynamicsCompressor();
    master.connect(compressor).connect(ctx.destination);
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    scheduleBackingTrack();
  }

  /** A tone with an attack/decay envelope. */
  function tone({ at, midi, type = "triangle", duration = 0.3, volume = 0.2, attack = 0.005, filter, vibrato }) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency(midi);
    if (vibrato) {
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      lfo.frequency.value = 5.5;
      depth.gain.value = vibrato;
      lfo.connect(depth).connect(osc.frequency);
      lfo.start(at);
      lfo.stop(at + duration + 0.1);
    }
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(volume, at + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    let node = osc.connect(gain);
    if (filter) {
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = filter;
      node = node.connect(lowpass);
    }
    node.connect(master);
    osc.start(at);
    osc.stop(at + duration + 0.05);
  }

  /** A burst of noise (snare, hi-hat). */
  function noise({ at, duration, volume, highpass }) {
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = highpass;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    source.connect(filter).connect(gain).connect(master);
    source.start(at);
    source.stop(at + duration + 0.02);
  }

  function kick(at) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(140, at);
    osc.frequency.exponentialRampToValueAtTime(45, at + 0.18);
    gain.gain.setValueAtTime(0.9, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.3);
    osc.connect(gain).connect(master);
    osc.start(at);
    osc.stop(at + 0.32);
  }

  function scheduleBackingTrack() {
    const bars = Math.round(length / (4 * beat));
    for (let bar = 0; bar < bars; bar += 1) {
      const chord = CHORDS[bar % CHORDS.length];
      const barStart = t0 + bar * 4 * beat;
      const last = bar === bars - 1;
      // Drums: kick on 1 and 3, snare on 2 and 4, hi-hat on every eighth.
      for (let step = 0; step < 8; step += 1) {
        const at = barStart + step * (beat / 2);
        if (last && step > 0) break;
        if (step % 4 === 0) kick(at);
        if (step % 4 === 2) noise({ at, duration: 0.18, volume: 0.35, highpass: 1500 });
        noise({ at, duration: 0.05, volume: step % 2 ? 0.06 : 0.1, highpass: 7000 });
      }
      // Bass: the root on every beat.
      for (let b = 0; b < (last ? 1 : 4); b += 1) {
        tone({ at: barStart + b * beat, midi: chord.root, type: "triangle", duration: beat * 0.9, volume: 0.32, filter: 900 });
      }
      // Piano: the chord on beats 1 and 3.
      for (const b of last ? [0] : [0, 2]) {
        for (const midi of chord.lanes.slice(0, 3)) {
          tone({ at: barStart + b * beat, midi, type: "sine", duration: beat * (last ? 4 : 1.8), volume: 0.07, attack: 0.01 });
          tone({ at: barStart + b * beat, midi: midi + 12, type: "sine", duration: beat * 0.6, volume: 0.025 });
        }
      }
      // Vocals: a soft "ooh" from the second bar on.
      if (bar > 0) {
        tone({ at: barStart, midi: VOCALS[bar % VOCALS.length], type: "sine", duration: beat * (last ? 4 : 3.6), volume: 0.06, attack: 0.15, vibrato: 4 });
      }
    }
  }

  return {
    now,
    /** The player's guitar note: lane 0–3 of the chord playing at `time`. */
    playGuitar(lane, time) {
      if (!ctx) return;
      const bar = Math.max(0, Math.floor(time / (4 * beat)));
      const midi = CHORDS[bar % CHORDS.length].lanes[lane];
      const at = ctx.currentTime;
      tone({ at, midi, type: "sawtooth", duration: 0.45, volume: 0.13, filter: 2400 });
      tone({ at, midi: midi + 12, type: "triangle", duration: 0.25, volume: 0.05 });
    },
    /** A dull, muted strum for a mistake. */
    playMiss() {
      if (!ctx) return;
      const at = ctx.currentTime;
      noise({ at, duration: 0.12, volume: 0.25, highpass: 300 });
      tone({ at, midi: 40, type: "square", duration: 0.15, volume: 0.06, filter: 500 });
    },
    stop() {
      ctx?.close().catch(() => {});
    },
  };
}
