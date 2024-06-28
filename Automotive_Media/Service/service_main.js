const pkgInfo = require("./package.json");
const Service = require("webos-service");
const player = require("play-sound")((opts = {}));

const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = "[" + pkgInfo.name + "]";

let audioProcess = null;

// Play Audio using url
service.register("playAudioService", function (message) {
  console.log(logHeader, "Service Method call://playAudio");
  let url = "./resource/chopin.mp3";
  if (url) {
    if (audioProcess) {
      audioProcess.kill;
    }

    audioProcess = player.play(url, function (err) {
      if (err) {
        message.response({
          returnValue: false,
          errorText: "Error playing audio",
          errorCode: 101,
        });
      } else {
        message.response({
          returnValue: false,
          Response: "Audio plaing started",
        });
      }
    });
  } else {
    message.respond({
      returnValue: false,
      errorText: "URL is required",
      errorCode: 100,
    });
  }
});

// Stop current audio path
service.register("stopAudioService", function (message) {
  console.log(logHeader, "Service Method call://stopAudio");
  if (audioProcess) {
    audioProcess.kill();
    audioProcess = null;
    message.respond({
      returnValue: true,
      Response: "Audio stopped",
    });
  } else {
    message.respond({
      returnValue: false,
      errorText: "No audio is playing",
      errorCode: 102,
    });
  }
});

// Pause current audio path
service.register("pauseAudioService", function (message) {
  console.log(logHeader, "Service Method call://pauseAudio");
  if (audioProcess) {
    audioProcess.kill("SIGSTOP"); // Send SIGSTOP to pause the process
    message.respond({
      returnValue: true,
      Response: "Audio paused",
    });
  } else {
    message.respond({
      returnValue: false,
      errorText: "No audio is playing",
      errorCode: 103,
    });
  }
});
