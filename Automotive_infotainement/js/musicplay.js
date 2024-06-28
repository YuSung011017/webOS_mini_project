function loadMusicPlay() {
  // Application Manager를 이용해 Music Play 앱 호출
  var loadMusicApp = "luna://com.webos.service.applicationmanager/launch";
  console.log(`launch Multimedia App`);
  var params = JSON.stringify({
    id: "com.automotive.media",
  });

  callService(loadMusicApp, params)
    .then((response) => {
      console.log("Launch media player requested:", response);
    })
    .catch((error) => console.error("Failed to launch Multimedia App:", error));
}

// LS2 API Common Module
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

function createBackButton() {
  var buttonDiv = document.createElement("div");
  buttonDiv.id = "backbtn";
  var backButton = document.createElement("button");
  backButton.id = "backbutton";
  backButton.textContent = "뒤로 가기";
  backButton.className = "font-black p-[10px] text-white bg-[#a50034] rounded";
  backButton.addEventListener("click", function () {
    console.log("back button clicked");
    window.history.back();
  });

  buttonDiv.appendChild(backButton);

  return buttonDiv;
}
