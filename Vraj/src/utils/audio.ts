// src/utils/audio.ts
// Crisp, whisper-quiet micro-interaction audio using Web Audio API

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function playPillClickSound() {
  if (!soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Soft editorial wooden keyclick chime (sine wave with fast decaying attack)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5 note
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.04); // subtle harmonic sweep

    gain.gain.setValueAtTime(0.04, now); // whisper quiet
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Gracefully handle any browser audio autoplay policy restrictions
  }
}

export function playSynthesisSuccessSound() {
  if (!soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Harmonic two-tone chord
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const offset = idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + offset);

      gain.gain.setValueAtTime(0.03, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.35);
    });
  } catch {
    // Ignore audio errors
  }
}
