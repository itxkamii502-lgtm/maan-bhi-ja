/**
 * Romantic ambient audio engine using Web Audio API.
 * Generates an ethereal, calming, romantic music box / Rhodes chord progression.
 * Fully self-contained with no external mp3 assets that could break or fail to load.
 */

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;
  private gainNode: GainNode | null = null;
  private currentStep: number = 0;

  // Romantic progression in C Major / A Minor:
  // Cmaj9 -> Am9 -> Fmaj7 -> Gadd9
  private chords = [
    // Cmaj9 (C4, E4, G4, B4, D5)
    [261.63, 329.63, 392.00, 493.88, 587.33],
    // Am9 (A3, C4, E4, G4, B4)
    [220.00, 261.63, 329.63, 392.00, 493.88],
    // Fmaj7 (F3, A3, C4, E4, A4)
    [174.61, 220.00, 261.63, 329.63, 440.00],
    // G6/9 (G3, B3, D4, E4, G4)
    [196.00, 246.94, 293.66, 329.63, 392.00],
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, startTime: number, duration: number, volume: number = 0.15) {
    if (!this.ctx || !this.gainNode) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Warm soft bell / electric piano tone using sine with subtle triangle blend
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Envelope: quick attack, long warm exponential decay
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(volume, startTime + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(volume * 0.4, startTime + 0.3);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  private step() {
    if (!this.isPlaying || !this.ctx) return;

    const chordIndex = Math.floor(this.currentStep / 4) % this.chords.length;
    const noteIndex = this.currentStep % 4;
    const currentChord = this.chords[chordIndex];

    const now = this.ctx.currentTime;
    // Play root on 1st beat of chord
    if (noteIndex === 0) {
      this.playTone(currentChord[0], now, 3.2, 0.18);
    }

    // Play sparkling arpeggio notes
    const noteFreq = currentChord[(noteIndex + 1) % currentChord.length];
    this.playTone(noteFreq, now + 0.05, 1.8, 0.12);

    // Occasional high shimmer note
    if (this.currentStep % 2 === 0) {
      const highFreq = currentChord[currentChord.length - 1] * 1.5;
      this.playTone(highFreq, now + 0.28, 1.2, 0.04);
    }

    this.currentStep++;
  }

  public start() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Tick every 680ms for a gentle, romantic tempo
    this.step();
    this.timer = window.setInterval(() => {
      this.step();
    }, 680);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Play cute playful dodge sound for when "No" runs away
  public playCuteDodge() {
    try {
      this.initContext();
      if (!this.ctx || !this.gainNode) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.22);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // Play romantic victory chime for when "Yes" is clicked
  public playRomanticVictory() {
    try {
      this.initContext();
      if (!this.ctx || !this.gainNode) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

      notes.forEach((freq, idx) => {
        const startTime = now + idx * 0.1;
        this.playTone(freq, startTime, 1.4, 0.22);
      });
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // Play envelope opening chime
  public playEnvelopeOpen() {
    try {
      this.initContext();
      if (!this.ctx || !this.gainNode) return;
      const now = this.ctx.currentTime;
      const notes = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5

      notes.forEach((freq, idx) => {
        const startTime = now + idx * 0.12;
        this.playTone(freq, startTime, 1.6, 0.18);
      });
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }
}

export const romanticAudio = new RomanticAudioEngine();
