import MidiController from "./midi";
import PoseDetection from "./pose-detection";
import SoundGeneration from "./sound-generation";
import AppState from "./state";

class Main {
  private appState: AppState;
  private poseDetection: PoseDetection;
  private soundGeneration: SoundGeneration;
  private midiController: MidiController;

  constructor() {
    this.appState = new AppState();
    this.poseDetection = new PoseDetection(this.appState);
    this.soundGeneration = new SoundGeneration(this.appState);
    this.midiController = new MidiController(this.appState);
  }

  init() {
    const startBtn = document.getElementById("start") as HTMLButtonElement;
    const startContainer = document.getElementById(
      "start-container"
    ) as HTMLDivElement;

    startBtn.addEventListener("click", async () => {
      startContainer.remove();
      await this.poseDetection.start();
      // await this.soundGeneration.play();
      await this.midiController.init();
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const main = new Main();

  main.init();
});
