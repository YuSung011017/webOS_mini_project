var btn_start_mirror = document.getElementById("btn-start-mirror");
var btn_stop_mirror = document.getElementById("btn-stop-mirror");
var btn_back_main = document.getElementById("btn-to-main");
var btn_go_game = document.getElementById("btn-to-game");
var displayIdFrom = 0;
var displayIdTo = 1;

btn_start_mirror.addEventListener("click", function () {
  console.log("Start Mirror");
  setMirrorAPP(true);
});

btn_stop_mirror.addEventListener("click", function () {
  console.log("Stop Mirror");
  setMirrorAPP(false);
});

btn_back_main.addEventListener("click", function () {
  console.log("Back to Main");
  switchApp("com.automotive.infotainment");
});

btn_go_game.addEventListener("click", function () {
  console.log("Go to Game");
  switchApp("com.automotive.game");
});

document.addEventListener("DomContentLoaded", function () {
  displayIdFrom = getForegroundAppInfo();
});

/**
 * 애플리케이션의 미러 모드를 설정합니다.
 * @param {boolean} isMirror - 미러링을 활성화 또는 비활성화할지 여부를 나타냅니다.
 *
 * API 사용: luna://com.webos.surfacemanager/setAppMirroring
 */
async function setMirrorAPP(isMirror) {
  var setAppMirrorApi = "luna://com.webos.surfacemanager/setAppMirroring";
  console.log(`setAppMirror URI: ${setAppMirrorApi}`);

  displayIdTo = displayIdFrom == 1 ? 0 : 1;

  console.log(
    `Display Id From: ${displayIdFrom}, Display Id To: ${displayIdTo}`
  );

  var params = JSON.stringify({
    mirror: isMirror,
    from: displayIdFrom,
    to: displayIdTo,
  });

  console.log(
    `Display Id From: ${displayIdFrom}, Display Id To: ${displayIdTo}`
  );

  callService(setAppMirrorApi, params)
    .then((response) => {
      console.log(
        `Display Id: ${response.displayId}, App Id: ${response.appId}`
      );
    })
    .catch((error) => {
      console.error("Failed to mirror display", error);
      if (error.errorCode === 3) {
        notifyPossibleMirror();
      }
    });
}

/**
 * 현재 화면에 표시되는 애플리케이션의 정보를 가져옵니다.
 * @returns {number} 현재 화면에 표시되는 애플리케이션의 디스플레이 ID를 반환합니다.
 *
 * API 사용: luna://com.webos.surfacemanager/getForegroundAppInfo
 */
function getForegroundAppInfo() {
  var getInfo = "luna://com.webos.surfacemanager/getForegroundAppInfo";

  console.log(`getForegroundAppInfo URI: ${getInfo}`);
  var params = JSON.stringify({});

  callService(getInfo, params)
    .then((response) => {
      var foregroundAppInfo = response.foregroundAppInfo;
      console.log("appInfo requested:", response);
      console.log(`Foreground App Info: ${foregroundAppInfo}`);

      for (const appInfo of foregroundAppInfo) {
        console.log(
          `Display Id: ${appInfo.displayId}, App Id: ${appInfo.appId}`
        );
        if (appInfo.appId === "com.automotive.media") {
          return appInfo.displayId;
        }
      }
    })
    .catch((error) => {
      console.error("Failed to getForegroundAppInfo", error);
    });
}

/**
 * 두 번째 디스플레이 없이 디스플레이 미러링이 불가능한 경우 사용자에게 알립니다.
 *
 * API 사용: luna://com.webos.notification/createToast
 */
function notifyPossibleMirror() {
  var createToast = "luna://com.webos.notification/createToast";
  console.log(`createToast URI: ${createToast}`);
  var params = JSON.stringify({
    sourceId: "com.automotive.media",
    message: `두 번째 디스플레이 없이 디스플레이 미러링이 불가능합니다.`,
  });

  callService(createToast, params)
    .then((response) => {
      console.log("알림", response.toastId);
    })
    .catch((error) => console.error("토스트 생성 실패", error));
}

/**
 * 지정된 appId로 애플리케이션을 전환합니다.
 *
 * @param {string} appId - 전환할 앱의 ID입니다.
 *
 * API 사용: luna://com.webos.service.applicationmanager/launch
 */
function switchApp(appId) {
  var launchApp = "luna://com.webos.service.applicationmanager/launch";
  console.log(`createToast URI: ${launchApp}`);
  console.log(`appId: ${appId}`);
  var params = JSON.stringify({
    id: appId,
  });

  callService(launchApp, params)
    .then((response) => {
      console.log(
        `Display Id: ${response.displayId}, App Id: ${response.appId}`
      );
    })
    .catch((error) => {
      console.error("failed to switch app", error);
    });
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
