import PoseDetection from "./pose-detection";
import SoundGeneration from "./sound-generation";

window.addEventListener("DOMContentLoaded", () => {
  const poseDetection = new PoseDetection();
  const soundGeneration = new SoundGeneration();
  const startBtn = document.getElementById("start") as HTMLButtonElement;

  startBtn.addEventListener("click", () => {
    // navigator.requestMIDIAccess().then((access) => {
    //   // Get lists of available MIDI controllers
    //   const inputs = access.inputs.values();
    //   const outputs = access.outputs.values();

    //   console.log(access);

    //   // console.log(inputs.next());
    //   // console.log(outputs.next());

    //   // …
    // });

    poseDetection.start();
    // soundGeneration.play();
    startBtn.remove();
  });
});
