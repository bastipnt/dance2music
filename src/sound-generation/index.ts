import { FMSynth, Loop, getTransport, now as toneNow } from "tone";
import AppState from "../state";
import KeyboardSound from "./KeyboardSound";

class SoundGeneration {
  private appState: AppState;
  private loop: Loop;
  private synthA: FMSynth;
  private keyboardSound: KeyboardSound;

  constructor(appState: AppState) {
    this.appState = appState;
    this.addEventListeners();

    this.loop = new Loop();
    this.synthA = new FMSynth().toDestination();

    this.keyboardSound = new KeyboardSound(this.appState);
    this.keyboardSound.init();
  }

  private addEventListeners() {
    this.appState.poseState.subscribe((newState) => {
      // console.log(newState.rightArm);
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
