export class SoundManager {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.musicInterval = null;
  }

  playTone(freq, type, duration) {
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playEat() {
    this.playTone(400, 'sine', 0.1);
  }

  playPower() {
    this.playTone(200, 'square', 0.3);
    setTimeout(() => this.playTone(300, 'square', 0.3), 100);
  }

  playStart() {
    this.playTone(440, 'square', 0.2);
    setTimeout(() => this.playTone(554, 'square', 0.2), 200);
    setTimeout(() => this.playTone(659, 'square', 0.4), 400);
  }

  playDie() {
    this.playTone(200, 'sawtooth', 0.5);
    setTimeout(() => this.playTone(100, 'sawtooth', 0.5), 200);
  }

  playLevelUp() {
    this.playTone(523.25, 'square', 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'square', 0.1), 100); // E5
    setTimeout(() => this.playTone(783.99, 'square', 0.1), 200); // G5
    setTimeout(() => this.playTone(1046.50, 'square', 0.3), 300); // C6
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  playLobbyMusic() {
    this.stopMusic();
    const notes = [
      { f: 261.63, d: 0.2 }, { f: 329.63, d: 0.2 }, { f: 392.00, d: 0.2 }, { f: 523.25, d: 0.4 }, // C Major Arp
      { f: 392.00, d: 0.2 }, { f: 329.63, d: 0.2 }, { f: 261.63, d: 0.4 },
      { f: 293.66, d: 0.2 }, { f: 349.23, d: 0.2 }, { f: 440.00, d: 0.2 }, { f: 587.33, d: 0.4 }, // D Minor Arp
      { f: 440.00, d: 0.2 }, { f: 349.23, d: 0.2 }, { f: 293.66, d: 0.4 }
    ];
    let noteIndex = 0;

    const playNextNote = () => {
      const note = notes[noteIndex];
      this.playTone(note.f, 'triangle', 0.1);
      noteIndex = (noteIndex + 1) % notes.length;
    };

    this.musicInterval = setInterval(playNextNote, 300);
  }

  playGameMusic() {
    this.stopMusic();
    // Slow Tense Rhythmic Loop
    const notes = [
      { f: 80, d: 0.25 }, { f: 0, d: 0.1 }, { f: 80, d: 0.25 }, { f: 0, d: 0.1 },
      { f: 95, d: 0.25 }, { f: 0, d: 0.1 }, { f: 75, d: 0.25 }, { f: 0, d: 0.1 }
    ];
    let noteIndex = 0;

    const playNextNote = () => {
      const note = notes[noteIndex];
      if (note.f > 0) this.playTone(note.f, 'sawtooth', 0.2);
      noteIndex = (noteIndex + 1) % notes.length;
    };

    this.musicInterval = setInterval(playNextNote, 350);
  }

  playGameOverMusic() {
    this.stopMusic();
    // Sad/Descending "Loss" melody
    const notes = [
      { f: 440, d: 0.3 }, { f: 415, d: 0.3 }, { f: 392, d: 0.3 }, { f: 370, d: 0.6 }
    ];
    let noteIndex = 0;

    const playNextNote = () => {
      if (noteIndex >= notes.length) {
        clearInterval(this.musicInterval);
        return;
      }
      const note = notes[noteIndex];
      this.playTone(note.f, 'sawtooth', 0.3);
      noteIndex++;
    };

    this.musicInterval = setInterval(playNextNote, 400);
  }
}
