var btn_to_home = document.getElementById("btn-to-home");
var btn_to_music = document.getElementById("btn-to-music");

btn_to_home.addEventListener("click", function () {
  console.log("Go to Home");
  switchApp("com.automotive.infotainment");
});
btn_to_music.addEventListener("click", function () {
  console.log("Go to Music");
  switchApp("com.automotive.media");
});

/**
 * 지정된 appId로 애플리케이션을 전환합니다.
 *
 * @param {string} appId - 전환할 앱의 ID입니다.
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
