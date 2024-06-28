function initPage() {
  console.log("home");
  document.body.innerHTML = `
  <div class="p-5 bg-[#1a1a2e] p-[300px] h-dvh items-center">
    <div class="m-auto max-w-[960px] flex flex-wrap" id="menu-select">
      <div class="flex flex-wrap">
        <button class="bg-white w-1/3 border-solid border-black border rounded-md m-[10px] p-[20px] w-[300px] h-[300px] text-center cursor-pointer text-3xl font-semibold" id="Othello">
          Othello Game
        </button>
        <button class="bg-white w-1/3 border-solid border-black border rounded-md m-[10px] p-[20px] w-[300px] h-[300px] text-center cursor-pointer text-3xl font-semibold" id="MP">
          Music Play
        </button>
        <button class="bg-white w-1/3 border-solid border-black border rounded-md m-[10px] p-[20px] w-[300px] h-[300px] text-center cursor-pointer text-3xl font-semibold" id="BT">
          Bluetooth Setting
        </button>
      </div>
    </div>
  </div>
  `;
}

const router = [
  {
    buttonid: "Othello",
    scriptUrl: "./js/ .js",
    functionName: "loadOthelloGame",
  },
  {
    buttonid: "MP",
    scriptUrl: "./js/musicplay.js",
    functionName: "loadMusicPlay",
  },
  {
    buttonid: "BT",
    scriptUrl: "./js/bluetoothsetting.js",
    functionName: "loadBTSetting",
  },
];

function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

function navigate(page) {
  const stateObj = page;
  history.pushState(stateObj, null, `?page=${page}`);
  console.log(`page: ${page}`);
  updateContent(page);
}

function updateContent(page) {
  console.log(`updateContent: ${page}`);
  switch (page) {
    case "home":
      loadScript("./js/menu.js", function () {
        console.log(`updateContent: ${page}`);
        window.initPage();
        window.setupCardButton();
      });
      break;
    case "loadOthelloGame":
      console.log(`loadOthelloGame`);
      loadScript("./js/othellogame.js", function () {
        window.loadOthelloGame();
      });
      break;
    case "loadMusicPlay":
      console.log(`loadMusicPlay`);
      loadScript("./js/musicplay.js", function () {
        window.loadMusicPlay();
      });
      break;
    case "loadBTSetting":
      console.log(`loadBTSetting`);
      loadScript("./js/bluetoothsetting.js", function () {
        window.loadBTSetting();
      });
      break;
  }

  window.onpopstate = function (event) {
    console.log(`onpopstate ${event.stste}, ${event.state.page}`);
    if (event.state) {
      updateContent(event.state.page);
    }
  };
}

function setupCardButton() {
  router.forEach((route) => {
    document
      .getElementById(route.buttonid)
      .addEventListener("click", function () {
        console.log(`route.buttonid: ${route.buttonid}`);
        navigate(route.functionName);
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initPage();
  if (window.location.search) {
    console.log(`if: ${window.location.search}`);
    navigate(window.location.search.split("=")[1]);
  } else {
    console.log(`else: ${window.location.search}`);
    history.pushState({ page: "home" }, null, "?page=home");
  }
  setupCardButton();
});
