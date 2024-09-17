class WebcamHelper {
  video: HTMLVideoElement;
  cameraSelect: HTMLSelectElement;
  webcamSettings?: MediaTrackSettings;

  constructor() {
    this.video = document.getElementById("video") as HTMLVideoElement;
    this.cameraSelect = document.getElementById(
      "camera-select"
    ) as HTMLSelectElement;

    this.init();
  }

  async init() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    devices
      .filter(({ kind }) => kind === "videoinput")
      .forEach((device) => {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.text = device.label;
        this.cameraSelect.appendChild(option);
      });
  }

  start = () =>
    new Promise(async (resolve) => {
      this.video.addEventListener("canplay", resolve, false);

      const selectedDeviceId = this.cameraSelect.selectedOptions[0].value;

      console.log(selectedDeviceId);

      if (!selectedDeviceId) return;

      navigator.mediaDevices
        .getUserMedia({
          video: {
            frameRate: { ideal: 60 },
            facingMode: "user",
            deviceId: {
              exact: selectedDeviceId,
            },
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
