// import { ScatterGL } from "scatter-gl";
import { Keypoint, Pose, util } from "@tensorflow-models/pose-detection";
import WebcamHelper from "./helpers/WebcamHelper";
import { MODEL } from "./params";

// #ffffff - White
// #800000 - Maroon
// #469990 - Malachite
// #e6194b - Crimson
// #42d4f4 - Picton Blue
// #fabed4 - Cupid
// #aaffc3 - Mint Green
// #9a6324 - Kumera
// #000075 - Navy Blue
// #f58231 - Jaffa
// #4363d8 - Royal Blue
// #ffd8b1 - Caramel
// #dcbeff - Mauve
// #808000 - Olive
// #ffe119 - Candlelight
// #911eb4 - Seance
// #bfef45 - Inchworm
// #f032e6 - Razzle Dazzle Rose
// #3cb44b - Chateau Green
// #a9a9a9 - Silver Chalice
const COLOR_PALETTE = [
  "#ffffff",
  "#800000",
  "#469990",
  "#e6194b",
  "#42d4f4",
  "#fabed4",
  "#aaffc3",
  "#9a6324",
  "#000075",
  "#f58231",
  "#4363d8",
  "#ffd8b1",
  "#dcbeff",
  "#808000",
  "#ffe119",
  "#911eb4",
  "#bfef45",
  "#f032e6",
  "#3cb44b",
  "#a9a9a9",
];

type DrawParameters = {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
};

export class RendererCanvas2d {
  private ctx: CanvasRenderingContext2D | null;
  // private scatterGLEl: HTMLDivElement;
  // private scatterGL: ScatterGL;

  private webcamHelper: WebcamHelper;

  private canvasWidth: number;
  private canvasHeight: number;

  // image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
  private drawParameters?: DrawParameters;
  private scale = 1;

  constructor(canvas: HTMLCanvasElement, webcamHelper: WebcamHelper) {
    this.ctx = canvas.getContext("2d");
    if (!this.ctx) throw new Error("ctx not initialized");

    // this.scatterGLEl = document.getElementById(
    //   "scatter-gl-container"
    // ) as HTMLDivElement;
    // this.scatterGL = new ScatterGL(this.scatterGLEl, {
    //   rotateOnStart: true,
    //   selectEnabled: false,
    //   styles: { polyline: { defaultOpacity: 1, deselectedOpacity: 1 } },
    // });

    this.webcamHelper = webcamHelper;

    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
  }

  async init() {
    // this.calculateVideoDimensions();
    // await sleep(250);
    this.resizeCanvas();
    this.calculateVideoDimensions();
    this.flip();
  }

  private resizeCanvas() {
    if (!this.ctx) throw new Error("ctx not initialized");

    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;

    this.ctx.canvas.width = this.canvasWidth;
    this.ctx.canvas.height = this.canvasHeight;
  }

  private flip() {
    if (!this.ctx) throw new Error("ctx not initialized");

    // Because the image from camera is mirrored, need to flip horizontally.
    this.ctx.translate(this.canvasWidth, 0);
    this.ctx.scale(-1, 1);

    // this.scatterGLEl.style.width = `${this.canvasWidth}px`;
    // this.scatterGLEl.style.height = `${this.canvasHeight}px`;
    // this.scatterGL.resize();
  }

  draw(poses: Pose[]) {
    // this.videoAspectRatio =
    //   (webcamSettings?.width || 16) / (webcamSettings?.height || 9);
    // this.videoDimensionsMap = getVideoDrawDimenstionsMap(this.videoAspectRatio);

    this.drawCtx();

    // The null check makes sure the UI is not in the middle of changing to a
    // different model. If during model change, the result is from an old model,
    // which shouldn't be rendered.
    if (poses && poses.length > 0) {
      this.drawResults(poses);
    }
  }

  private drawCtx() {
    if (!this.ctx) throw new Error("ctx not initialized");
    if (!this.drawParameters) throw new Error("draw parameters not calculated");

    this.ctx.drawImage(
      this.webcamHelper.video,
      this.drawParameters.sx,
      this.drawParameters.sy,
      this.drawParameters.sWidth,
      this.drawParameters.sHeight,
      this.drawParameters.dx,
      this.drawParameters.dy,
      this.drawParameters.dWidth,
      this.drawParameters.dHeight
    );
  }

  // private clearCtx() {
  //   if (!this.ctx) throw new Error("ctx not initialized");

  //   this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  // }

  /**
   * Draw the keypoints and skeleton on the video.
   * @param poses A list of poses to render.
   */
  private drawResults(poses: Pose[]) {
    for (const pose of poses) {
      this.drawResult(pose);
    }
  }

  /**
   * Draw the keypoints and skeleton on the video.
   * @param pose A pose with keypoints to render.
   */
  private drawResult(pose: Pose) {
    // console.log("Draw", pose);

    if (pose.keypoints != null) {
      this.drawKeypoints(pose.keypoints);
      this.drawSkeleton(pose.keypoints, pose.id);
    }
  }

  /**
   * Draw the keypoints on the video.
   * @param keypoints A list of keypoints.
   */
  private drawKeypoints(keypoints: Keypoint[]) {
    if (!this.ctx) throw new Error("ctx not initialized");

    const keypointInd = util.getKeypointIndexBySide(MODEL);

    this.ctx.fillStyle = "Red";
    this.ctx.strokeStyle = "White";
    this.ctx.lineWidth = 2;

    for (const i of keypointInd.middle) {
      this.drawKeypoint(keypoints[i]);
    }

    this.ctx.fillStyle = "Green";
    for (const i of keypointInd.left) {
      this.drawKeypoint(keypoints[i]);
    }

    this.ctx.fillStyle = "Orange";
    for (const i of keypointInd.right) {
      this.drawKeypoint(keypoints[i]);
    }
  }

  private drawKeypoint(keypoint: Keypoint) {
    if (!this.ctx) throw new Error("ctx not initialized");
    if (!this.drawParameters) throw new Error("draw parameters not calculated");

    // If score is null, just show the keypoint.
    const score = keypoint.score != null ? keypoint.score : 1;
    const scoreThreshold = 0.5;

    if (score >= scoreThreshold) {
      const circle = new Path2D();
      circle.arc(
        (keypoint.x - this.drawParameters.sx) * this.scale,
        (keypoint.y - this.drawParameters.sy) * this.scale,
        4,
        0,
        2 * Math.PI
      );
      this.ctx.fill(circle);
      this.ctx.stroke(circle);
    }
  }

  /**
   * Draw the skeleton of a body on the video.
   * @param keypoints A list of keypoints.
   */
  private drawSkeleton(keypoints: Keypoint[], poseId?: number) {
    if (!this.ctx) throw new Error("ctx not initialized");

    // Each poseId is mapped to a color in the color palette.
    const color = poseId != null ? COLOR_PALETTE[poseId % 20] : "White";
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;

    util.getAdjacentPairs(MODEL).forEach(([i, j]) => {
      if (!this.drawParameters)
        throw new Error("draw parameters not calculated");

      const kp1 = keypoints[i];
      const kp2 = keypoints[j];

      // If score is null, just show the keypoint.
      const score1 = kp1.score != null ? kp1.score : 1;
      const score2 = kp2.score != null ? kp2.score : 1;
      const scoreThreshold = 0.5;

      if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
        if (!this.ctx) throw new Error("ctx not initialized");

        this.ctx.beginPath();
        this.ctx.moveTo(
          (kp1.x - this.drawParameters.sx) * this.scale,
          (kp1.y - this.drawParameters.sy) * this.scale
        );
        this.ctx.lineTo(
          (kp2.x - this.drawParameters.sx) * this.scale,
          (kp2.y - this.drawParameters.sy) * this.scale
        );
        this.ctx.stroke();
      }
    });
  }

  private calculateVideoDimensions() {
    if (!this.webcamHelper.webcamSettings)
      throw new Error("No webcam settings, can not calculate");
    if (!this.webcamHelper.webcamSettings.width)
      throw new Error("No width in webcam settings, can not calculate");
    if (!this.webcamHelper.webcamSettings.height)
      throw new Error("No height in webcam settings, can not calculate");

    const videoWidth = this.webcamHelper.webcamSettings.width;
    const videoHeight = this.webcamHelper.webcamSettings.height;

    const videoAspectRatio = videoWidth / videoHeight;
    const windowAspectRatio = this.canvasWidth / this.canvasHeight;

    if (videoAspectRatio >= windowAspectRatio) {
      // window with smaller than video

      this.scale = this.canvasHeight / videoHeight;
      const sWidth = this.canvasWidth / this.scale;
      const sx = (videoWidth - sWidth) / 2;

      this.drawParameters = {
        sx,
        sy: 0,
        sWidth,
        sHeight: videoHeight,
        dx: 0,
        dy: 0,
        dWidth: this.canvasWidth,
        dHeight: this.canvasHeight,
      };
    } else {
      // window height smaller than video

      this.scale = this.canvasWidth / videoWidth;
      const sHeight = this.canvasHeight / this.scale;
      const sy = (videoHeight - sHeight) / 2;

      this.drawParameters = {
        sx: 0,
        sy,
        sWidth: videoWidth,
        sHeight,
        dx: 0,
        dy: 0,
        dWidth: this.canvasWidth,
        dHeight: this.canvasHeight,
      };
    }
  }
}
