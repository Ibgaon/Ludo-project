// Web Audio API Sound Synthesizer for Ludo Premier

class SoundManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private musicOscillators: OscillatorNode[] = [];
  private isMusicPlaying = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Tactile button click sound
  playClick(enabled = true) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // Audio autoplay restrictions or context error
    }
  }

  // Dice roll shaker sound
  playDiceRoll(enabled = true) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Create a rapid succession of wooden rattles
      const now = this.ctx.currentTime;
      for (let i = 0; i < 6; i++) {
        const time = now + i * 0.06 + Math.random() * 0.02;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const baseFreq = 220 + Math.random() * 200;
        osc.frequency.setValueAtTime(baseFreq, time);
        osc.frequency.exponentialRampToValueAtTime(80, time + 0.05);

        gain.gain.setValueAtTime(0.25 - i * 0.02, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.06);
      }
    } catch {
      // Ignored
    }
  }

  // Token move hop sound
  playTokenMove(enabled = true) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      // Ignored
    }
  }

  // Token unlock from home yard (rolling a 6)
  playTokenUnlock(enabled = true) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [440, 554, 659, 880];
      notes.forEach((note, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, now + idx * 0.06);
        gain.gain.setValueAtTime(0.2, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.12);
      });
    } catch {
      // Ignored
    }
  }

  // Capture opponent piece sound
  playCapture(enabled = true) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Ignored
    }
  }

  // Reaching the center home base
  playHomeChime(enabled = true) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C Major
      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.25, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.4);
      });
    } catch {
      // Ignored
    }
  }

  // Victory fanfare
  playWinFanfare(enabled = true) {
    if (!enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const melody = [
        { f: 523.25, t: 0.15 }, // C5
        { f: 523.25, t: 0.15 }, // C5
        { f: 523.25, t: 0.15 }, // C5
        { f: 659.25, t: 0.35 }, // E5
        { f: 783.99, t: 0.35 }, // G5
        { f: 1046.5, t: 0.6 },  // C6
      ];

      let elapsed = 0;
      melody.forEach(item => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, now + elapsed);
        gain.gain.setValueAtTime(0.3, now + elapsed);
        gain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + item.t);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + elapsed);
        osc.stop(now + elapsed + item.t + 0.05);
        elapsed += item.t;
      });
    } catch {
      // Ignored
    }
  }

  // Haptic feedback trigger
  vibrate(enabled = true, duration = 40) {
    if (!enabled) return;
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(duration);
      }
    } catch {
      // Ignored
    }
  }

  // Ambient Relaxing BGM loop using soft synthesis
  toggleBGM(enable: boolean) {
    if (!enable) {
      this.stopBGM();
      return;
    }
    if (this.isMusicPlaying) return;
    this.startBGM();
  }

  private startBGM() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.stopBGM();
      this.isMusicPlaying = true;

      // Soft ambient gentle pentatonic chords
      const notes = [261.63, 329.63, 392.00, 440.00, 523.25]; // C, E, G, A, C
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.connect(this.ctx.destination);
      this.musicGain = gain;

      // Schedule periodic soft tone sequence
      const playStep = () => {
        if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;
        const note = notes[Math.floor(Math.random() * notes.length)];
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, this.ctx.currentTime);
        noteGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.06, this.ctx.currentTime + 1.0);
        noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.0);

        osc.connect(noteGain);
        noteGain.connect(this.musicGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 3.2);

        setTimeout(playStep, 2000 + Math.random() * 1500);
      };

      playStep();
    } catch {
      // Ignored
    }
  }

  private stopBGM() {
    this.isMusicPlaying = false;
    if (this.musicGain && this.ctx) {
      try {
        this.musicGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      } catch {
        // Ignored
      }
    }
    this.musicOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignored
      }
    });
    this.musicOscillators = [];
  }
}

export const soundManager = new SoundManager();
