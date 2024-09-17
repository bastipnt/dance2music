import { FMSynth, Loop, getTransport, now as toneNow } from "tone";
import AppState from "../state";

class SoundGeneration {
  private appState: AppState;
  private loop: Loop;
  synthA: FMSynth;

  constructor(appState: AppState) {
    this.appState = appState;
    this.addEventListeners();

    this.loop = new Loop();
    this.synthA = new FMSynth().toDestination();
  }

  private addEventListeners() {
    this.appState.subscribe((newState) => {
      console.log(newState.rightArm);
      this.synthA.set({ detune: Math.abs(newState.rightArm.x) });
    });
  }

  async play() {
    this.loop.start(0);
    this.loop.interval = "4n";
    this.loop.callback = (time) => {
      this.synthA.triggerAttackRelease("C2", "8n", time);
    };

    getTransport().start();
  }

  debugLogTime() {
    setInterval(() => console.log(toneNow()), 100);
  }
}

export default SoundGeneration;
