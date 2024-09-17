import PoseDetection from "./pose-detection";
import SoundGeneration from "./sound-generation";
import AppState from "./state";

class Main {
  private appState: AppState;
  private poseDetection: PoseDetection;
  private soundGeneration: SoundGeneration;

  constructor() {
    this.appState = new AppState({ rightArm: { x: 0, y: 0 } });
    this.poseDetection = new PoseDetection(this.appState);
    this.soundGeneration = new SoundGeneration(this.appState);
  }

  init() {
    const startBtn = document.getElementById("start") as HTMLButtonElement;
    const startContainer = document.getElementById(
      "start-container"
    ) as HTMLDivElement;

    startBtn.addEventListener("click", async () => {
      await this.poseDetection.start();
      await this.soundGeneration.play();
      startContainer.remove();
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const main = new Main();

  main.init();
});
