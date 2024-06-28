// Control audio
var audio = new Audio("./resource/media/chopin.mp3");
const audio_play_btn = document.getElementById("audio-play-btn");
const audio_pause_btn = document.getElementById("audio-pause-btn");
const audio_stop_btn = document.getElementById("audio-stop-btn");
const progress = document.getElementById("progress");

// Control audio with JS service
var btn_play_service = document.getElementById("btn-play-service");
var btn_stop_service = document.getElementById("btn-stop-service");
var btn_pause_service = document.getElementById("btn-pause-service");

audio.addEventListener("timeupdate", updateProgress);

function updateProgress() {
  const percentage = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${percentage}%`;
}

document
  .getElementById("progress-container")
  .addEventListener("click", setProgress);

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// JavaScript Audio control - event listener
audio_play_btn.addEventListener("click", function (e) {
  audio.play();
  audio_play_btn.classList.add("hidden");
  audio_pause_btn.classList.remove("hidden");
  audio_stop_btn.removeAttribute("disabled");
});

audio_pause_btn.addEventListener("click", function (e) {
  audio.pause();
  audio_pause_btn.classList.add("hidden");
  audio_play_btn.classList.remove("hidden");
});

audio_stop_btn.addEventListener("click", function (e) {
  audio.pause();
  audio.currentTime = 0;
  audio_pause_btn.classList.add("hidden");
  audio_play_btn.classList.remove("hidden");
  audio_stop_btn.setAttribute("disabled", true);
});

// JavaScript Service Audio control - event listener
btn_play_service.addEventListener("click", function (e) {
  console.log("Play audio with JS Service");
  playAudioService();
});

btn_stop_service.addEventListener("click", function (e) {
  console.log("Stop audio with JS Service");
  stopAudioService();
});

btn_pause_service.addEventListener("click", function (e) {
  console.log("Pause audio with JS Service");
  pauseAudioService();
});

/**
 * 오디오 서비스를 사용하여 오디오를 재생합니다.
 * @function playAudioService
 * @returns {void}
 *
 * API 사용: luna://com.automotive.media.service/playAudioService
 */
function playAudioService() {
  var stopAudioApi = "luna://com.automotive.media.service/playAudioService";
  console.log(`stop current Audio file`);
  var params = JSON.stringify({});

  callAudioService(stopAudioApi, params, function (response) {
    console.log("Audio play successfully:", response);
    if (!response.returnValue) {
      alert("Failed to play audio: " + response.message);
    }
    audio_pause_service.classList.add("hidden");
    audio_play_service.classList.remove("hidden");
    audio_stop_service.setAttribute("disabled", true);
  });
}

/**
 * Pauses audio using the audio service.
 * @function pauseAudioService
 * @returns {void}
 *
 * API 사용: luna://com.automotive.media.service/pauseAudioService
 */
function pauseAudioService() {
  var pauseAudioApi = "luna://com.automotive.media.service/pauseAudioService";
  console.log(`pause current Audio file`);
  var params = JSON.stringify({});
  callAudioService(pauseAudioApi, params, function (response) {
    console.log("Audio status:", response);
    alert("Audio status: " + response.message);
    btn_pause_service.classList.add("hidden");
    btn_play_service.classList.remove("hidden");
  });
}

/**
 * 오디오 서비스를 중지합니다.
 * @function stopAudioService
 * @memberof module:audio-player
 * @returns {void}
 */
function stopAudioService() {
  var stopAudioApi = "luna://com.automotive.media.service/stopAudioService";
  console.log(`stop current Audio file`);
  var params = JSON.stringify({});

  callAudioService(stopAudioApi, params, function (response) {
    console.log("Audio stopped successfully:", response);
    if (!response.returnValue) {
      alert("Failed to stop audio: " + response.message);
    }
    audio_pause_service.classList.add("hidden");
    audio_play_service.classList.remove("hidden");
    audio_stop_service.setAttribute("disabled", true);
  });
}

/**
 * 지정된 URL과 매개변수로 오디오 서비스를 호출하고 응답으로 콜백 함수를 호출합니다.
 *
 * @param {string} url - 오디오 서비스의 URL입니다.
 * @param {Object} params - 오디오 서비스로 전송할 매개변수입니다.
 * @param {Function} callback - 오디오 서비스의 응답과 함께 호출될 콜백 함수입니다.
 */
function callAudioService(url, params, callback) {
  var bridge = new WebOSServiceBridge();
  bridge.onservicecallback = function (msg) {
    callback(JSON.parse(msg));
  };
  bridge.call(url, JSON.stringify(params));
}
