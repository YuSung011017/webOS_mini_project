const mediaindexer_uri = "luna://com.webos.service.mediaindexer";
const media_scan = "/requestMediaScan";
const media_search = "/getAudioList";

var media_scan_btn = document.getElementById("media-scan");
var scanned_list = document.getElementById("scanned-list");

var played = false;

// call 'media scan' method
media_scan_btn.addEventListener("click", function () {
  mediaScan();
});

/**
 * 미디어 스캔을 요청하는 함수입니다.
 *
 * API 사용: luna://com.webos.service.mediaindexer/requestMediaScan
 */
function mediaScan() {
  var uri = "luna://com.webos.service.mediaindexer/requestMediaScan";
  var params = JSON.stringify({
    path: "/media",
  });
  callService(uri, params)
    .then((response) => {
      console.log("미디어 스캔이 요청되었습니다.", response);
      getAudioList();
    })
    .catch((error) => console.error("미디어 스캔 요청에 실패했습니다:", error));
}

/**
 * 오디오 파일 목록을 가져오는 함수입니다.
 *
 * API 사용: luna://com.webos.service.mediaindexer/getAudioList
 */
function getAudioList() {
  var uri = "luna://com.webos.service.mediaindexer/getAudioList";
  var params = JSON.stringify({
    uri: "storage:///media/multimedia",
  });
  console.log("오디오 목록을 가져옵니다.");
  callService(uri, params)
    .then((response) => {
      const audioList = response.audioList;
      console.log("미디어 스캔이 요청되었습니다:", response);
      console.log("오디오 목록:", audioList);
      displayAudioFiles(audioList);
    })
    .catch((error) =>
      console.error("오디오 목록을 가져오는데 실패했습니다:", error)
    );
}

/**
 * WebApp에 오디오 파일 목록을 표시합니다.
 *
 * @param {Object} audioList - 표시할 오디오 파일 목록입니다.
 */
function displayAudioFiles(audioList) {
  scanned_list.innerHTML = "";
  for (const file of audioList.results) {
    const audioFileDiv = document.createElement("div");
    audioFileDiv.className =
      "flex justify-between items-center p-2 border-b border-gray-200";

    const audioFileInfo = document.createElement("span");
    audioFileInfo.textContent = `${file.title || "Unknown"} : (${
      file.duration
    } sec)`;
    audioFileInfo.className = "text-2xl min-w-[380px]";

    const audioPlayButton = createAudioButton(
      "재생",
      "fas fa-play",
      file.file_path,
      playAudio
    );
    const audioPauseButton = createAudioButton(
      "일시정지",
      "fas fa-pause",
      file.file_path,
      pauseAudio
    );
    audioPauseButton.classList.add("hidden");

    audioFileDiv.appendChild(audioFileInfo);
    audioFileDiv.appendChild(audioPlayButton);
    audioFileDiv.appendChild(audioPauseButton);
    scanned_list.appendChild(audioFileDiv);
  }
}

/**
 * 오디오 버튼 엘리먼트를 생성합니다.
 *
 * @param {string} text - 버튼의 텍스트 내용입니다.
 * @param {string} iconClass - 버튼 아이콘의 CSS 클래스입니다.
 * @param {string} filePath - 오디오 파일의 경로입니다.
 * @param {Function} clickHandler - 클릭 이벤트 핸들러 함수입니다.
 * @returns {HTMLButtonElement} 생성된 버튼 엘리먼트입니다.
 */
function createAudioButton(text, iconClass, filePath, clickHandler) {
  const button = document.createElement("button");
  const icon = document.createElement("i");
  button.setAttribute("data-path", filePath);
  button.className =
    "flex items-center justify-center w-20 h-10 bg-[#5a8dee] rounded-lg p-2 cursor-pointer text-base";
  button.addEventListener("click", function () {
    clickHandler(button.getAttribute("data-path"));
    button.classList.add("hidden");
    const parentDiv = button.parentElement;
    if (parentDiv) {
      const nextSibling = button.nextElementSibling;
      const previousSibling = button.previousElementSibling;
      if (nextSibling) {
        nextSibling.classList.remove("hidden");
      } else if (previousSibling) {
        previousSibling.classList.remove("hidden");
      }
    }
    console.log(`played ${button.getAttribute("data-path")}`);
  });
  icon.className = `${iconClass} mr-3`;
  button.appendChild(icon);
  button.appendChild(document.createTextNode(text)); // Add text content after the icon
  return button;
}

/**
 * 지정된 파일 경로를 사용하여 오디오 파일을 로드합니다.
 * @param {string} filepath - 로드할 오디오 파일의 경로입니다.
 * @returns {Promise<string|undefined>} - 로드된 오디오 파일의 mediaId를 해결하는 프로미스입니다. 오류가 발생한 경우 undefined를 반환합니다.
 *
 * API 사용: luna://com.webos.media/load
 */
async function loadAudio(filepath) {
  var loadAudioApi = "luna://com.webos.media/load";
  var params = JSON.stringify({
    uri: filepath,
    type: "media",
  });

  console.log(`오디오 파일 로드 중: ${filepath}`);
  try {
    const response = await callService(loadAudioApi, params); // await for the response
    console.log("로드된 오디오 파일:", response);
    return response.mediaId; // return mediaId if success
  } catch (error) {
    console.error("Failed to load audio lists:", error);
    return undefined; // return undefined if error occurs
  }
}

/**
 * 지정된 파일 경로를 사용하여 오디오 파일을 재생합니다.
 * @param {string} filepath - 재생할 오디오 파일의 경로입니다.
 * @returns {Promise<void>} - 재생 요청이 성공한 경우 해결되는 프로미스입니다. 오류가 발생한 경우 거부됩니다.
 *
 * API 사용: luna://com.webos.media/play
 */
async function playAudio(filepath) {
  var playAudioApi = "luna://com.webos.media/play";

  var mediaId = await loadAudio(filepath);

  console.log(`mediaId: ${mediaId}`);
  var params = JSON.stringify({
    mediaId: mediaId,
  });

  console.log("Audio played flag", played);

  callService(playAudioApi, params)
    .then((response) => {
      console.log("media play requested:", response);
      console.log("Audio Played", response.mediaId);
      played = true;
    })
    .catch((error) => console.error("Failed to fetch audio list:", error));
}

/**
 * 지정된 파일 경로를 사용하여 오디오 파일을 일시정지합니다.
 * @param {string} filepath - 일시정지할 오디오 파일의 경로입니다.
 * @returns {Promise<void>} - 일시정지 요청이 성공한 경우 해결되는 프로미스입니다. 오류가 발생한 경우 거부됩니다.
 *
 * API 사용: luna://com.webos.media/pause
 */
async function pauseAudio(filepath) {
  var mediaId = await loadAudio(filepath);

  var pauseAudioApi = "luna://com.webos.media/pause";
  console.log(`mediaId: ${mediaId}`);
  var params = JSON.stringify({
    mediaId: mediaId,
  });

  console.log("Audio played flag", played);
  callService(pauseAudioApi, params)
    .then((response) => {
      console.log("media play requested:", response);
      console.log("Audio Played", response.mediaId);
      played = false;
    })
    .catch((error) => console.error("Failed to pause audio:", error));
}

/**
 * 주어진 URI와 매개변수를 사용하여 LS2API를 호출하는 함수입니다.
 *
 * @param {string} uri - 호출할 서비스의 URI입니다.
 * @param {string} params - 서비스에 전달할 매개변수입니다.
 * @returns {Promise<Object>} - 서비스 호출 결과를 해결하는 프로미스입니다.
 */
function callService(uri, params) {
  return new Promise((resolve, reject) => {
    var bridge = new WebOSServiceBridge();

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
