/**
 * NeuroPulse Audio Engine
 * Calibrated Web Audio API synthesis for clinical audiometry & acoustic testing
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
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

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play localized stereo chirp for Sound Hop (Zone 1)
   * pan: -1.0 (hard left), 0.0 (center), 1.0 (hard right)
   */
  public playStereoChirp(pan: number = 0, freq: number = 650, durationSec: number = 0.35) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      // Soft chirp pitch rise
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, this.ctx.currentTime + durationSec * 0.7);

      // Envelope: quick attack, smooth decay
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + durationSec);

      if (panner) {
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.ctx.destination);
      } else {
        osc.connect(gain);
        gain.connect(this.ctx.destination);
      }

      osc.start();
      osc.stop(this.ctx.currentTime + durationSec);
    } catch {
      // Graceful fallback if audio is blocked
    }
  }

  /**
   * Play calibrated pure-tone sine wave for Pure-Tone Audiometry (Zone 6)
   * dB HL simulated attenuation (0dB is quietest, 70dB is loud)
   */
  public playPureTone(frequencyHz: number, dbLevel: number, durationSec: number = 1.0) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequencyHz, this.ctx.currentTime);

      // Map dB (0 to 80 dB HL) to linear gain (0.005 to 0.4)
      const normalizedVolume = Math.min(0.4, 0.005 * Math.pow(10, (dbLevel - 20) / 35));

      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(normalizedVolume, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(normalizedVolume, this.ctx.currentTime + durationSec - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + durationSec);
    } catch {
      // Audio context safeguard
    }
  }

  /**
   * Play acoustic feedback chime (success, prompt, tap)
   */
  public playFeedback(type: 'tap' | 'correct' | 'incorrect' | 'alert') {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (type === 'tap') {
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
      } else if (type === 'correct') {
        osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880.00, this.ctx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
      } else if (type === 'incorrect') {
        osc.frequency.setValueAtTime(260, this.ctx.currentTime);
        osc.frequency.setValueAtTime(220, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.22);
      } else {
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
    } catch {
      // Audio context safeguard
    }
  }

  /**
   * Speak a short clinical prompt (e.g. PASAT single digits)
   */
  public speakNumber(num: number) {
    if (this.isMuted) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(num.toString());
        utterance.rate = 1.1;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      } catch {
        this.playFeedback('alert');
      }
    } else {
      this.playFeedback('alert');
    }
  }
}

export const audioEngine = new AudioEngine();
