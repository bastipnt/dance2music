import "@tensorflow/tfjs-backend-webgl";

import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";
import * as mediapipePose from "@mediapipe/pose";
import * as tf from "@tensorflow/tfjs-core";

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`
);

import {
  Pose,
  PoseDetector,
  createDetector,
} from "@tensorflow-models/pose-detection";
import WebcamHelper from "./helpers/WebcamHelper";
import { asyncRequestAnimationFrameMs } from "./helpers/helpers";
import { RendererCanvas2d } from "./RendererCanvas2d";
import { MODEL, MODEL_TYPE } from "./params";

export type RendererParams = [HTMLVideoElement, Pose[]];

class PoseDetection {
  private detector?: PoseDetector;
  private webcamHelper: WebcamHelper;
  private started = false;
  private renderer: RendererCanvas2d;
  private canvas: HTMLCanvasElement;

  constructor() {
    this.webcamHelper = new WebcamHelper();
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.renderer = new RendererCanvas2d(this.canvas, this.webcamHelper);
  }

  start = async () => {
    await this.webcamHelper.start();
    await tf.ready();
    this.detector = await createDetector(MODEL, {
      modelType: MODEL_TYPE,
      runtime: "mediapipe",
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mediapipePose.VERSION}`,
    });
    this.started = true;
    this.renderer.init();

    this.addResizeEventListener();

    this.loop();
  };

  private addResizeEventListener() {
    window.addEventListener("resize", () => this.renderer.init());
  }

  private async detect(): Promise<Pose[]> {
    if (!this.detector) throw new Error("Detector not initialized!");

    const poses = await this.detector.estimatePoses(this.webcamHelper.video, {
      maxPoses: 1,
      flipHorizontal: false,
    });
    // console.log(poses);

    return poses;
  }

  private async draw(poses: Pose[]) {
    this.renderer.draw(poses);
  }

  private async loop() {
    do {
      const rendererParams = await this.detect();
      await this.draw(rendererParams);

      await asyncRequestAnimationFrameMs(100);
    } while (this.started);
  }
}

export default PoseDetection;
