/**
 * webOS 디바이스에 연결된 카메라 목록 가지고 온다.
 */
function getCameraList() {
  var cameraListApi = "luna://com.webos.service.camera2/getCameraList";
  console.log(`pair URI: ${cameraListApi}`);
  var params = JSON.stringify({});

  callService(cameraListApi, params)
    .then((response) => {
      console.log("BT connected", response);
      statusSpan.textContent = "Connected";
    })
    .catch((error) => console.error("Failed to discover BT devices:", error));
}

/**
 * webOS 디바이스에 연결된 카메라 목록 가지고 온다.
 *
 * @params {string} cameraId - Open할 Camera ID
 */
function openCamera(cameraId) {
  var cameraOpenApi = "luna://com.webos.service.camera2/open";
  console.log(`pair URI: ${cameraOpenApi}`);
  var params = JSON.stringify({
    id: cameraId,
  });

  callService(cameraOpenApi, params)
    .then((response) => {
      console.log("camera open", response);
    })
    .catch((error) => console.error("Failed to open camera device:", error));
}

/**
 * 카메라의 형식을 설정합니다.
 *
 * @param {string} handle - 카메라의 핸들.
 * @param {number} width - 카메라 형식의 너비.
 * @param {number} height - 카메라 형식의 높이.
 * @returns {Promise} 카메라 서비스의 응답을 해결하는 프로미스.
 */
function setFormatCamera(handle, width, height) {
  var setFormatApi = "luna://com.webos.service.camera2/setFormat";
  console.log(`pair URI: ${setFormatApi}`);
  var params = JSON.stringify({
    handle: handle,
    params: {
      width: width,
      height: height,
      type: "JPEG",
      fps: 30,
    },
  });

  callService(setFormatApi, params)
    .then((response) => {
      console.log("set camera format", response);
    })
    .catch((error) => console.error("Failed to set camera format:", error));
}

// LS2 API 공통 모듈
/**
 * 지정된 URI와 매개변수를 사용하여 서비스를 호출합니다.
 * @param {string} uri - 호출할 서비스의 URI입니다.
 * @param {Object} params - 서비스에 전달할 매개변수입니다.
 * @returns {Promise} 성공 시 서비스의 응답으로 해결되는 프로미스이며, 실패 시 응답으로 거부됩니다.
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

/**
 * 뒤로 가기 버튼 요소를 생성합니다.
 * @returns {HTMLDivElement} 생성된 버튼 요소입니다.
 */
export function createBackButton() {
  var buttonDiv = document.createElement("div");
  buttonDiv.id = "backbtn";
  var backButton = document.createElement("button");
  backButton.id = "backbutton";
  backButton.textContent = "뒤로 가기";
  backButton.addEventListener("click", function () {
    console.log("back button clicked");
    window.history.back();
  });

  buttonDiv.appendChild(backButton);

  return buttonDiv;
}
