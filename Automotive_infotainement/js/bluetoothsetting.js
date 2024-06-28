let bt_start_btn;
let bt_search_btn;
let bt_paried_btn;
let device_list_container;

/**
 * BT 설정 메뉴를 로드합니다.
 */
function loadBTSetting() {
  document.body.innerHTML = `
      <div id="container" class="p-5 text-white bg-[#1a1a2e] p-[100px] text-center h-dvh items-center">
        <h1 class="text-[45px] ">BT Setting</h1>
        <h2>이곳은 BT Setting 메뉴입니다.</h2>
      
      
        <!-- BT device search and start -->
        <div class ="m-auto max-w-7xl my-[80px]">
          
          <div id="search-container" class=" flex-col bg-[#16213e] border-[#0f3460] border-[2px] rounded p-[20px] mb-5">
            <h2 class="text-[25px] text-center mb-5">Bluetooth Controller</h2>

            <!-- Seached Button --!>
            <div class="flex flex-wrap">
              <div id="bt-adapter" class="bg-zinc-600 rounded p-5 w-[33%] mr-[10px]">
                <fieldset>
                  <div class="field items-center flex flex-wrap flex-col text-2xl">
                      <button id="bt-Start" class="min-w-[250px] mt-[30px] bg-[#5A8DEE] font-bold text-[#ffffff] p-2 rounded px-5 cursor-pointer" data-target="modal-js-example">
                          Start BT Adapter 
                      </button>
                      <button id="bt-search" class="min-w-[250px] mt-[30px] bg-[#5A8DEE] font-bold text-[#ffffff] p-2 rounded px-5 cursor-pointer" data-target="modal-js-example">
                          Search BT Devices 
                      </button>
                      <button id="bt-paired" class="min-w-[250px] my-[30px] bg-[#5A8DEE] font-bold text-[#ffffff] p-2 rounded px-5 cursor-pointer" data-target="modal-js-example">
                          Paired BT Devices 
                      </button>
                  </div>
                </fieldset>
              </div>
 
              <!-- Seached Lists --!>
              <div id="bt-devices" class="bg-zinc-600 rounded p-5 w-[65%]">
                <h2 class="text-2xl">Device List</h2>
                <div id="device-list" class="bg-black rounded overflow-auto h-[500px]" style="overflow:auto; height:500px;">
                </div>                
              </div>
            </div>              
          </div>         
        </div>        
        
        <script src="./js/bluetoothsetting.js"></script>
      </div>`;

  // init button variables
  bt_start_btn = document.getElementById("bt-Start");
  bt_search_btn = document.getElementById("bt-search");
  bt_paried_btn = document.getElementById("bt-paired");
  device_list_container = document.getElementById("device-list");

  // event listener
  bt_start_btn.addEventListener("click", setBTAdapterStart);
  bt_search_btn.addEventListener("click", discoverBTDevice);
  bt_paried_btn.addEventListener("click", getPairedDevice);

  var backbutton = createBackButton();
  document.getElementById("container").appendChild(backbutton);
}

/**
 * Bluetooth 어댑터의 상태를 가져옵니다.
 */
function getBTAdapterStatus() {
  var discoveryBTApi = "luna://com.webos.service.bluetooth2/adapter/getStatus";
  console.log(`discover URI: ${discoveryBTApi}`);
  var params = JSON.stringify({
    subscribe: true,
  });

  callService(discoveryBTApi, params)
    .then((response) => {
      console.log("BT Address", response.adapterAddress);
    })
    .catch((error) => console.error("Failed to discover BT devices:", error));
}

/**
 * Bluetooth 어댑터를 시작하고 Bluetooth 기능을 초기화합니다.
 */
function setBTAdapterStart() {
  device_list_container.innerHTML = "";
  var setBTStartApi = "luna://com.webos.service.bluetooth2/adapter/setState";
  console.log(`setState uri: ${setBTStartApi}`);
  var params = JSON.stringify({
    powered: true,
  });

  callService(setBTStartApi, params)
    .then((response) => {
      console.log("Prepared to use BT", response);
      console.log("BT Address", response.adapterAddress);
      device_list_container.className = "text-2xl";
      device_list_container.innerHTML = "Success start Bluetooth Adapter";
    })
    .catch((error) => console.error("Failed to set BT devices:", error));
}

/**
 * Bluetooth 기기를 검색합니다.
 */
function discoverBTDevice() {
  var discoveryBTApi =
    "luna://com.webos.service.bluetooth2/adapter/startDiscovery";
  console.log(`discover URI: ${discoveryBTApi}`);
  var params = JSON.stringify({});

  callService(discoveryBTApi, params)
    .then((response) => {
      console.log("BT Address", response.adapterAddress);
      getBTStatus();
    })
    .catch((error) => console.error("Failed to discover BT devices:", error));
}

/**
 * Bluetooth 상태를 가져와서 기기 목록을 표시합니다.
 */
function getBTStatus() {
  device_list_container.innerHTML = "";

  var getBTDeviceApi = "luna://com.webos.service.bluetooth2/device/getStatus";
  console.log(`getStatust uri: ${getBTDeviceApi}`);
  var params = JSON.stringify({});

  callService(getBTDeviceApi, params)
    .then((response) => {
      console.log("Prepared to use BT", response);
      console.log("BT Address", response.devices);
      if (response.devices) {
        response.devices.forEach(function (device) {
          const deviceDiv = document.createElement("div");
          deviceDiv.className =
            "flex justify-between items-center p-2 border-b border-gray-200";

          const deviceInfo = document.createElement("span");
          deviceInfo.textContent = `${device.name || "Unknown"}`;
          deviceInfo.className = "text-2xl min-w-[380px]";

          // Pair button
          const pair_btn = document.createElement("button");
          pair_btn.textContent = "Pair";
          pair_btn.dataset.address = device.address;
          pair_btn.className =
            "p-[5px] m-[10px] bg-white text-base text-black font-bold rounded min-w-[100px] cursor-pointer";

          // 검색된 Device List 상태
          const statusSpan = document.createElement("span");
          statusSpan.textContent = device.paired ? "Paired" : "Not Paired";
          statusSpan.className = "pl-[15px]";

          pair_btn.addEventListener("click", function () {
            console.log("Device address:", device.address);
            pairBTDevice(device.address, statusSpan);
          });

          // 검색된 Device List 버튼
          deviceDiv.appendChild(deviceInfo);
          deviceDiv.appendChild(pair_btn);
          deviceDiv.appendChild(statusSpan);
          device_list_container.appendChild(deviceDiv);
        });
      }
    })
    .catch((error) => console.error("Failed to set BT devices:", error));
}

/**
 * 주어진 주소로 Bluetooth 기기를 페어링합니다.
 * @param {string} btAddress - 페어링할 Bluetooth 기기의 주소입니다.
 * @param {HTMLElement} statusSpan - 페어링 상태를 표시할 HTML 요소입니다.
 */
function pairBTDevice(btAddress, statusSpan) {
  var pairBTApi = "luna://com.webos.service.bluetooth2/adapter/pair";
  console.log(`pair URI: ${pairBTApi}`);
  var params = JSON.stringify({
    address: btAddress,
    subscribe: true,
  });

  callService(pairBTApi, params)
    .then((response) => {
      console.log("BT paierd", response);
      statusSpan.textContent = "Paired";
    })
    .catch((error) => console.error("Failed to discover BT devices:", error));
}

/**
 * 페어링된 BT 기기 정보를 가져와 화면에 표시합니다.
 */
function getPairedDevice() {
  device_list_container.innerHTML = "";

  var getPairedBTApi =
    "luna://com.webos.service.bluetooth2/device/getPairedDevices";
  console.log(`paired Device URI: ${getPairedBTApi}`);
  var params = JSON.stringify({
    subscribe: true,
  });
  callService(getPairedBTApi, params)
    .then((response) => {
      console.log("paired Device", response);
      if (response.devices) {
        response.devices.forEach(function (device) {
          const deviceDiv = document.createElement("div");
          deviceDiv.className =
            "flex justify-between items-center p-2 border-b border-gray-200";

          const deviceInfo = document.createElement("span");
          deviceInfo.textContent = `${device.name || "Unknown"}`;
          deviceInfo.className = "text-2xl min-w-[380px]";

          // Connect button
          const connect_btn = document.createElement("button");
          connect_btn.textContent = "Connect";
          connect_btn.dataset.address = device.address;
          connect_btn.className =
            "p-[5px] m-[10px] bg-white text-base text-black font-bold rounded min-w-[100px] cursor-pointer";

          // Unpair button
          const unpair_btn = document.createElement("button");
          unpair_btn.textContent = "Unpair";
          unpair_btn.dataset.address = device.address;
          unpair_btn.className =
            "p-[5px] m-[10px] bg-white text-black text-base font-bold rounded min-w-[100px] cursor-pointer";

          const statusSpan = document.createElement("span");
          statusSpan.textContent =
            device.connectedProfiles & (device.connectedProfiles.length > 0)
              ? "Connected"
              : "Paired";
          statusSpan.className = "pl-[15px]";

          if (
            !(device.connectedProfiles & (device.connectedProfiles.length > 0))
          ) {
            connect_btn.addEventListener("click", function () {
              console.log("Device address:", device.address);
              connectBTDevice(device.address, statusSpan);
            });
          }

          unpair_btn.addEventListener("click", function () {
            console.log("Device address:", device.address);
            unpairBTDevice(device.address, statusSpan);
          });

          deviceDiv.appendChild(deviceInfo);
          deviceDiv.appendChild(connect_btn);
          deviceDiv.appendChild(unpair_btn);
          deviceDiv.appendChild(statusSpan);
          device_list_container.appendChild(deviceDiv);
        });
      }
    })
    .catch((error) => console.error("Failed to discover BT devices:", error));
}

/**
 * 지정된 Bluetooth 주소를 사용하여 Bluetooth 기기에 연결합니다.
 * @param {string} btAddress - 연결할 Bluetooth 기기의 주소입니다.
 * @param {HTMLElement} statusSpan - 연결 상태를 표시할 HTML 요소입니다.
 */
function connectBTDevice(btAddress, statusSpan) {
  var connectBTApi = "luna://com.webos.service.bluetooth2/a2dp/connect";
  console.log(`pair URI: ${connectBTApi}`);
  var params = JSON.stringify({
    address: btAddress,
    subscribe: true,
  });

  callService(connectBTApi, params)
    .then((response) => {
      console.log("BT connected", response);
      statusSpan.textContent = "Connected";
    })
    .catch((error) => console.error("Failed to discover BT devices:", error));
}

/**
 * Bluetooth 기기의 페어링을 해제합니다.
 *
 * @param {string} btAddress - 페어링을 해제할 Bluetooth 기기의 주소입니다.
 * @param {HTMLElement} statusSpan - 페어링 상태를 표시할 HTML 요소입니다.
 */
function unpairBTDevice(btAddress, statusSpan) {
  var unpairBTApi = "luna://com.webos.service.bluetooth2/adapter/unpair";
  console.log(`pair URI: ${unpairBTApi}`);
  var params = JSON.stringify({
    address: btAddress,
  });

  callService(unpairBTApi, params)
    .then((response) => {
      console.log("BT unpaired", response);
      statusSpan.textContent = "Unpaired";
    })
    .catch((error) => console.error("Failed to discover BT devices:", error));
}

/**
 * 지정된 URI와 매개변수를 사용하여 서비스를 호출합니다.
 * @param {string} uri - 호출할 서비스의 URI입니다.
 * @param {Object} params - 서비스에 전달할 매개변수입니다.
 * @returns {Promise} 성공 시 서비스의 응답을 resolve하는 프로미스이며, 실패 시 응답을 reject합니다.
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
 * @returns {HTMLDivElement} 생성된 뒤로 가기 버튼 요소입니다.
 */
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
