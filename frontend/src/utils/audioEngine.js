// Procedural Web Audio API Cosmic Sound Engine
let audioCtx = null;
let isPlaying = false;
let ambientNodes = [];

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Hans Zimmer Interstellar Soundtrack & Cosmic Audio Engine
const THEME_AUDIO_URL = '/audio/interstellar-theme.mp3';
const TARGET_VOLUME = 0.55;

let bgMusicAudio = null;
let isThemePlaying = false;
let fadeInterval = null;
const audioSubscribers = new Set();

function notifySubscribers(state) {
  audioSubscribers.forEach((cb) => {
    try { cb(state); } catch (e) { }
  });
}

export function subscribeAudioState(cb) {
  audioSubscribers.add(cb);
  cb(isThemePlaying);
  return () => audioSubscribers.delete(cb);
}

export function isAmbientAudioPlaying() {
  return isThemePlaying;
}

function getBgMusic() {
  if (!bgMusicAudio && typeof window !== 'undefined') {
    bgMusicAudio = new Audio(THEME_AUDIO_URL);
    bgMusicAudio.loop = true;
    bgMusicAudio.volume = 0;
    bgMusicAudio.preload = 'auto';
    bgMusicAudio.addEventListener('ended', () => {
      bgMusicAudio.currentTime = 0;
      bgMusicAudio.play().catch(() => {});
    });
  }
  return bgMusicAudio;
}

export function startAmbientAudio(onStateChange) {
  const audio = getBgMusic();
  if (!audio) return;

  clearInterval(fadeInterval);
  audio.play().then(() => {
    isThemePlaying = true;
    notifySubscribers(true);
    if (onStateChange) onStateChange(true);

    // Smoothly fade in to TARGET_VOLUME
    let currentVol = audio.volume;
    const step = 0.04;
    fadeInterval = setInterval(() => {
      currentVol = Math.min(TARGET_VOLUME, currentVol + step);
      audio.volume = Number(currentVol.toFixed(3));
      if (currentVol >= TARGET_VOLUME) {
        clearInterval(fadeInterval);
      }
    }, 45);
  }).catch((err) => {
    console.warn('Audio playback requires user interaction:', err);
    isThemePlaying = false;
    notifySubscribers(false);
    if (onStateChange) onStateChange(false);
  });
}

export function stopAmbientAudio(onStateChange) {
  const audio = getBgMusic();
  if (!audio) return;

  clearInterval(fadeInterval);
  let currentVol = audio.volume;
  const step = 0.05;
  fadeInterval = setInterval(() => {
    currentVol = Math.max(0, currentVol - step);
    audio.volume = Number(currentVol.toFixed(3));
    if (currentVol <= 0) {
      clearInterval(fadeInterval);
      audio.pause();
      isThemePlaying = false;
      notifySubscribers(false);
      if (onStateChange) onStateChange(false);
    }
  }, 35);
}

export function toggleAmbientAudio(onStateChange) {
  if (isThemePlaying) {
    stopAmbientAudio(onStateChange);
    return false;
  } else {
    startAmbientAudio(onStateChange);
    return true;
  }
}


export function playWarpSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.6);
    osc.frequency.exponentialRampToValueAtTime(120, now + 1.6);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.7);
  } catch (e) { }
}

export function playSpaceBreachSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;

    // 1. Deep Sub-Bass Acceleration Rumble (40Hz -> 180Hz)
    const rumbleOsc = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    rumbleOsc.type = 'sawtooth';
    rumbleOsc.frequency.setValueAtTime(45, now);
    rumbleOsc.frequency.exponentialRampToValueAtTime(190, now + 1.8);
    rumbleOsc.frequency.exponentialRampToValueAtTime(35, now + 2.5);

    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(140, now);
    rumbleFilter.frequency.linearRampToValueAtTime(600, now + 1.8);
    rumbleFilter.frequency.exponentialRampToValueAtTime(100, now + 2.6);

    rumbleGain.gain.setValueAtTime(0.01, now);
    rumbleGain.gain.linearRampToValueAtTime(0.4, now + 1.5);
    rumbleGain.gain.linearRampToValueAtTime(0.6, now + 1.9); // peak crash boom
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.7);

    rumbleOsc.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(ctx.destination);
    rumbleOsc.start(now);
    rumbleOsc.stop(now + 2.8);

    // 2. High-speed warp whistle / hyper-drive spool
    const warpOsc = ctx.createOscillator();
    const warpGain = ctx.createGain();
    warpOsc.type = 'sine';
    warpOsc.frequency.setValueAtTime(180, now);
    warpOsc.frequency.exponentialRampToValueAtTime(1400, now + 1.9);

    warpGain.gain.setValueAtTime(0.01, now);
    warpGain.gain.linearRampToValueAtTime(0.25, now + 1.7);
    warpGain.gain.exponentialRampToValueAtTime(0.001, now + 2.1);

    warpOsc.connect(warpGain);
    warpGain.connect(ctx.destination);
    warpOsc.start(now);
    warpOsc.stop(now + 2.2);

    // 3. Cockpit Warning Klaxon (2 rapid pulses)
    for (let i = 0; i < 3; i++) {
      const klaxonOsc = ctx.createOscillator();
      const klaxonGain = ctx.createGain();
      const startTime = now + (i * 0.45);
      klaxonOsc.type = 'square';
      klaxonOsc.frequency.setValueAtTime(740, startTime);
      klaxonOsc.frequency.setValueAtTime(520, startTime + 0.15);

      klaxonGain.gain.setValueAtTime(0.08, startTime);
      klaxonGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      klaxonOsc.connect(klaxonGain);
      klaxonGain.connect(ctx.destination);
      klaxonOsc.start(startTime);
      klaxonOsc.stop(startTime + 0.35);
    }

    // 4. Sonic Crash Boom at t = 1.9s (Singularity breach into deep space coordinates)
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(150, now + 1.9);
    boomOsc.frequency.exponentialRampToValueAtTime(28, now + 2.8);

    boomGain.gain.setValueAtTime(0.001, now + 1.85);
    boomGain.gain.linearRampToValueAtTime(0.5, now + 1.92);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

    boomOsc.connect(boomGain);
    boomGain.connect(ctx.destination);
    boomOsc.start(now + 1.88);
    boomOsc.stop(now + 3.1);

  } catch (e) { }
}

export function playUiBeep(freq = 880, duration = 0.06) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch (e) { }
}

export function playHydraulicDockSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;

    // 1. Pneumatic Steam / Thruster Hiss (Synthesized filtered noise)
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(300, now + 0.7);
    noiseFilter.Q.setValueAtTime(3.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.8);

    // 2. Heavy Hydraulic Clamps Lock Thud (Mechanical thump)
    const clampOsc = ctx.createOscillator();
    const clampGain = ctx.createGain();
    clampOsc.type = 'sine';
    clampOsc.frequency.setValueAtTime(80, now + 0.35);
    clampOsc.frequency.exponentialRampToValueAtTime(28, now + 0.75);

    clampGain.gain.setValueAtTime(0.001, now + 0.35);
    clampGain.gain.linearRampToValueAtTime(0.35, now + 0.4);
    clampGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    clampOsc.connect(clampGain);
    clampGain.connect(ctx.destination);
    clampOsc.start(now + 0.35);
    clampOsc.stop(now + 0.85);

    // 3. Futuristic Gateway Authorization Chime
    [587.33, 880, 1174.66].forEach((freq, idx) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      const startTime = now + 0.6 + idx * 0.12;

      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq, startTime);

      chimeGain.gain.setValueAtTime(0.05, startTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(startTime);
      chimeOsc.stop(startTime + 0.65);
    });

  } catch (e) { }
}

export function playRcsThrusterPulse() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.22);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.frequency.exponentialRampToValueAtTime(320, now + 0.2);
    filter.Q.setValueAtTime(4.0, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.21);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.22);
  } catch (e) { }
}

export function playRotationSyncTone(step = 1) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const freqs = [440, 554.37, 659.25, 880];
    const freq = freqs[Math.min(step, freqs.length - 1)] || 659.25;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  } catch (e) { }
}
