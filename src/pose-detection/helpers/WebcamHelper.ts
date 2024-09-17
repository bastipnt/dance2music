class WebcamHelper {
  video: HTMLVideoElement;
  webcamSettings?: MediaTrackSettings;

  constructor() {
    this.video = document.getElementById("video") as HTMLVideoElement;
  }

  start = () =>
    new Promise((resolve) => {
      this.video.addEventListener("canplay", resolve, false);

      navigator.mediaDevices
        .getUserMedia({
          video: {
            frameRate: { ideal: 60 },
            facingMode: "user",
          },
          audio: false,
        })
        .then((stream) => {
          this.video.srcObject = stream;
          this.video.play();
          this.webcamSettings = stream.getVideoTracks()[0].getSettings();
        })
        .catch((err) => {
          throw new Error(`An error with the webcam occurred: ${err}`);
        });
    });
}

export default WebcamHelper;
