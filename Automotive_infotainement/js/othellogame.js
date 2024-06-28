/**
 * Othello 게임 애플리케이션을 로드합니다.
 */
function loadOthelloGame() {
  var loadGameApp = "luna://com.webos.service.applicationmanager/launch";
  console.log(`launch Automotive Game App`);
  var params = JSON.stringify({
    id: "com.automotive.game",
  });

  callService(loadGameApp, params)
    .then((response) => {
      console.log("Launch game application requested:", response);
    })
    .catch((error) => console.error("Failed to launch game app:", error));
}

/**
 * 지정된 URI와 매개변수를 사용하여 서비스를 호출합니다.
 * @param {string} uri - 호출할 서비스의 URI입니다.
 * @param {Object} params - 서비스에 전달할 매개변수입니다.
 * @returns {Promise} 성공 시 서비스로부터의 응답을 resolve하는 프로미스이며, 실패 시 응답을 reject합니다.
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
