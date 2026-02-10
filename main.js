(async () => {
  const { createShadesMode, createSpotlightMode } = await import(
    chrome.runtime.getURL("shadeModes/index.js")
  );

  const OFFSET_STEP = 10;
  const INITIAL_TOP_OFFSET = 50;
  const bottomOffset = 2;

  const actionHandlers = {
    openShades: () => {
      controller.switchMode(
        createShadesMode({ initShadeSetup, updateShadesPosition }),
      );
    },
    closeShades: () => {
      controller.switchMode(null);
    },
    increase: () => controller.increaseOffset(),
    decrease: () => controller.decreaseOffset(),
    spotlight: () => {
      const isSpotlight = controller.getModeName() === "spotlight";
      controller.switchMode(
        isSpotlight
          ? null
          : createSpotlightMode({
              initSpotlightSetup,
              updateSpotlightPosition,
            }),
      );
    },
  };

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const handler = actionHandlers[message.action];
    if (handler) {
      handler();
    } else {
      console.warn(`No handler found for action: ${message.action}`);
    }
  });

  const initShadeSetup = () => {
    if (
      document.querySelector(".top-shade") &&
      document.querySelector(".bottom-shade")
    ) {
      return;
    }
    document.body.setAttribute("id", "body");

    const pageBody = document.getElementById("body");
    const pageDiv = document.createElement("div");
    pageDiv.setAttribute("class", "top-shade");
    pageBody.insertBefore(pageDiv, pageBody.firstChild);

    const secondDiv = document.createElement("div");
    secondDiv.setAttribute("class", "bottom-shade");
    pageBody.insertBefore(secondDiv, pageBody.children[1]);
  };

  const initSpotlightSetup = () => {
    if (document.querySelector(".spotlight-overlay")) {
      return;
    }
    document.body.setAttribute("id", "body");

    const pageBody = document.getElementById("body");
    const overlay = document.createElement("div");
    overlay.setAttribute("class", "spotlight-overlay");
    pageBody.insertBefore(overlay, pageBody.firstChild);
  };

  let updateShadesPosition = (event, shared) => {
    if (!shared) return;

    if (event && event.type === "mousemove") {
      shared.lastY = event.clientY;
    }
    const topShade = document.getElementsByClassName("top-shade")[0];
    const bottomShade = document.getElementsByClassName("bottom-shade")[0];
    if (!topShade || !bottomShade) return;
    const topY = shared.lastY - shared.topOffset + window.scrollY;
    const bottomY = shared.lastY + shared.bottomOffset + window.scrollY;

    topShade.style.height = `${topY}px`;
    topShade.style.width = "100vw";
    topShade.style.position = "absolute";
    topShade.style.opacity = ".8";
    topShade.style.backgroundColor = "black";
    topShade.style.zIndex = "2147483647";

    topShade.style.pointerEvents = "none";

    bottomShade.style.height = `${100}%`;
    bottomShade.style.width = "100vw";
    bottomShade.style.position = "absolute";
    bottomShade.style.opacity = ".8";
    bottomShade.style.backgroundColor = "black";
    bottomShade.style.top = `${bottomY}px`;
    bottomShade.style.zIndex = "2147483647";
    topShade.style.pointerEvents = "none";
  };

  let updateSpotlightPosition = (event, shared) => {
    if (event && event.type === "mousemove") {
      shared.lastY = event.clientY;
      shared.lastX = event.clientX;
    }
    const overlay = document.getElementsByClassName("spotlight-overlay")[0];
    if (!overlay) return;

    const centerX = shared.lastX + window.scrollX;
    const centerY = shared.lastY + window.scrollY;
    const radius = shared.topOffset;

    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = `${document.documentElement.scrollWidth}px`;
    overlay.style.height = `${document.documentElement.scrollHeight}px`;
    overlay.style.background = `radial-gradient(circle ${radius}px at ${centerX}px ${centerY}px, transparent 0%, transparent ${radius}px, rgba(0, 0, 0, 0.8) ${radius}px)`;
    overlay.style.zIndex = "2147483647";
    overlay.style.pointerEvents = "none";
  };

  function createController() {
    let currentMode = null;
    let listenersAttached = false;

    const shared = {
      topOffset: INITIAL_TOP_OFFSET,
      bottomOffset: bottomOffset,
      lastY: window.innerHeight / 2,
      lastX: window.innerWidth / 2,
    };

    const handleMove = (event) => {
      shared.lastY = event.clientY;
      shared.lastX = event.clientX;
      currentMode?.update(event, shared);
    };

    const handleScroll = (event) => {
      currentMode?.update(event, shared);
    };

    const increaseOffset = () => {
      shared.topOffset += OFFSET_STEP;

      currentMode?.onOffsetChange?.(shared);
    };

    const decreaseOffset = () => {
      shared.topOffset = Math.max(0, shared.topOffset - OFFSET_STEP);

      currentMode?.onOffsetChange?.(shared);
    };

    const switchMode = (mode) => {
      currentMode?.teardown?.(shared);
      currentMode = mode;

      if (currentMode) {
        currentMode.init?.(shared);
        attach();
        currentMode.update?.(null, shared);
      } else {
        detach();
      }
    };

    const attach = () => {
      if (listenersAttached) return;
      listenersAttached = true;
      window.addEventListener("scroll", handleScroll);
      document.addEventListener("mousemove", handleMove);
    };

    const detach = () => {
      if (!listenersAttached) return;
      listenersAttached = false;
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMove);
    };
    const getModeName = () => currentMode?.name || null;
    return {
      shared,
      attach,
      detach,
      switchMode,
      increaseOffset,
      decreaseOffset,
      getModeName,
    };
  }

  const controller = createController();
})();
