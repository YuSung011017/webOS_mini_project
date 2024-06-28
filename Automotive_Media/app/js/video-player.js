// Video Control
var video = document.getElementById("myVideo");
var btn_play_video = document.getElementById("btn-play-video");
var btn_stop_video = document.getElementById("btn-stop-video");
var btn_pause_video = document.getElementById("btn-pause-video");
var btn_full_video = document.getElementById("btn-full-video");

video.addEventListener("play", function () {
  btn_play_video.classList.add("hidden");
  btn_pause_video.classList.remove("hidden");
  btn_stop_video.removeAttribute("disabled");
});
video.addEventListener("pause", function () {
  btn_pause_video.classList.add("hidden");
  btn_play_video.classList.remove("hidden");
});

btn_play_video.addEventListener("click", function (e) {
  console.log("Play video");
  video.play();
});

btn_pause_video.addEventListener("click", function (e) {
  console.log("Pause video");
  video.pause();
});

btn_stop_video.addEventListener("click", function (e) {
  console.log("Stop video");
  video.pause();
  video.currentTime = 0;
  btn_stop_video.setAttribute("disabled", true);
});

btn_full_video.addEventListener("click", function (e) {
  console.log("Full screen video");
  video.requestFullscreen();
});

document.addEventListener("DOMContentLoaded", function () {
  video.addEventListener("timeupdate", checkPlayTime);
});

/**
 * 비디오의 현재 재생 시간을 확인하고 재생 시간이 제한을 초과하는 경우 동작을 수행합니다.
 */
function checkPlayTime() {
  var playTime = video.currentTime;
  var limitTime = 10 * 60; // 10 minutes
  console.log(`playTime: ${Math.floor(playTime / 60)} 분`);
  if (playTime >= limitTime) {
    nofityUserPlayTime(playTime);
    video.pause();
    setTimeout(function () {
      video.currentTime = 0;
    }, 5000);
  }
}

/**
 * 비디오의 재생 시간에 대해 사용자에게 알립니다.
 * @param {number} playTime - 비디오의 재생 시간(분).
 *
 * API 사용: luna://com.webos.notification/createToast
 */
function nofityUserPlayTime(playTime) {
  var createToast = "luna://com.webos.notification/createToast";
  console.log(`createToast URI: ${createToast}`);
  var params = JSON.stringify({
    sourceId: "com.automotive.media",
    message: `영상 본지 ${Math.floor(
      playTime / 60
    )}분이 지났습니다. 영상이 종료됩니다`,
  });

  callService(createToast, params)
    .then((response) => {
      console.log("Nofication", response.toastId);
    })
    .catch((error) => console.error("Failed to create Toast", error));
}

/**
 * 지정된 URI와 매개변수를 사용하여 서비스를 호출합니다.
 * @param {string} uri - 호출할 서비스의 URI입니다.
 * @param {Object} params - 서비스에 전달할 매개변수입니다.
 * @returns {Promise} 성공한 경우 서비스의 응답으로 해결되는 프로미스이며, 실패한 경우 응답으로 거부됩니다.
 */
function callService(uri, params) {
  return new Promise((resolve, reject) => {
    var bridge = new WebOSServiceBridge();

    console.log(`uri: ${uri}`);
    bridge.onservicecallback = function (msg) {
      var response = JSON.parse(msg);
      console.log(response.returnValue);

      if (response.returnValue) {
        resolve(response);
      } else {
        reject(response);
      }
    };

    bridge.call(uri, params);
  });
}
