(async () => {
  if (window.__readerFocusInitialized) return;
  window.__readerFocusInitialized = true;
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
    toggleToolbar: () => {
      const toolbar = document.getElementById("reader-focus-toolbar");
      if (toolbar) {
        toolbar.remove();
        removeToolbarStyles();
      } else {
        createToolbar();
      }
    },
    toggleToolbarVisibility: () => {
      const toolbar = document.getElementById("reader-focus-toolbar");
      if (!toolbar) return;
      const hidden = isToolbarHidden();
      setToolbarHidden(!hidden);
    },
    hideToolbar: () => {
      const toolbar = document.getElementById("reader-focus-toolbar");
      if (!toolbar) return;
      setToolbarHidden(true);
    },
    toolbarState: () => ({
      toolbarVisible: !!document.getElementById("reader-focus-toolbar"),
      toolbarHidden: isToolbarHidden(),
    }),
  };

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const handler = actionHandlers[message.action];
    if (handler) {
      const result = handler();
      if (result !== undefined) {
        sendResponse(result);
      }
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
    document.querySelector(".spotlight-overlay")?.remove();
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
    document.querySelector(".top-shade")?.remove();
    document.querySelector(".bottom-shade")?.remove();
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

  const isToolbarHidden = () =>
    document.documentElement.dataset.readerFocusToolbarHidden === "true";

  const setToolbarHidden = (hidden) => {
    document.documentElement.dataset.readerFocusToolbarHidden = hidden
      ? "true"
      : "false";
    const toolbar = document.getElementById("reader-focus-toolbar");
    if (!toolbar) return;
    toolbar.style.display = hidden ? "none" : "flex";
  };

  const createToolbar = () => {
    if (document.getElementById("reader-focus-toolbar")) return;
    addToolbarStyles();

    const toolbar = document.createElement("div");
    toolbar.id = "reader-focus-toolbar";

    const title = document.createElement("div");
    title.className = "rf-toolbar-title";
    title.textContent = "Reader Focus";

    const spotlightBtn = document.createElement("button");
    spotlightBtn.type = "button";
    spotlightBtn.textContent = "Spotlight";
    spotlightBtn.addEventListener("click", () => {
      controller.switchMode(
        createSpotlightMode({
          initSpotlightSetup,
          updateSpotlightPosition,
        }),
      );
    });

    const shadesBtn = document.createElement("button");
    shadesBtn.type = "button";
    shadesBtn.textContent = "Shades";
    shadesBtn.addEventListener("click", () => {
      controller.switchMode(
        createShadesMode({ initShadeSetup, updateShadesPosition }),
      );
    });

    const increaseBtn = document.createElement("button");
    increaseBtn.type = "button";
    increaseBtn.className = "rf-size";
    increaseBtn.textContent = "Size +";
    increaseBtn.addEventListener("click", () => {
      controller.increaseOffset();
    });

    const decreaseBtn = document.createElement("button");
    decreaseBtn.type = "button";
    decreaseBtn.className = "rf-size";
    decreaseBtn.textContent = "Size -";
    decreaseBtn.addEventListener("click", () => {
      controller.decreaseOffset();
    });

    const offBtn = document.createElement("button");
    offBtn.type = "button";
    offBtn.className = "rf-off";
    offBtn.textContent = "Off";
    offBtn.addEventListener("click", () => {
      controller.switchMode(null);
    });

    const hideBtn = document.createElement("button");
    hideBtn.type = "button";
    hideBtn.className = "rf-hide";
    hideBtn.textContent = "Hide";
    hideBtn.addEventListener("click", () => {
      setToolbarHidden(true);
    });

    toolbar.appendChild(title);
    toolbar.appendChild(spotlightBtn);
    toolbar.appendChild(shadesBtn);
    toolbar.appendChild(decreaseBtn);
    toolbar.appendChild(increaseBtn);
    toolbar.appendChild(hideBtn);
    toolbar.appendChild(offBtn);

    document.body.appendChild(toolbar);
    setToolbarHidden(isToolbarHidden());
  };

  const addToolbarStyles = () => {
    if (document.getElementById("reader-focus-toolbar-styles")) return;
    const style = document.createElement("style");
    style.id = "reader-focus-toolbar-styles";
    style.textContent = `
      #reader-focus-toolbar {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 2147483647;
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 10px 12px;
        background: rgba(20, 20, 20, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        font-family: system-ui, -apple-system, sans-serif;
      }

      #reader-focus-toolbar .rf-toolbar-title {
        color: #eaeaea;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        margin-right: 4px;
      }

      #reader-focus-toolbar button {
        background: #2b2b2b;
        color: #f5f5f5;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 12px;
        cursor: pointer;
      }

      #reader-focus-toolbar button:hover {
        background: #3a3a3a;
      }

      #reader-focus-toolbar button.rf-off {
        background: #b83a3a;
        border-color: #c84545;
      }

      #reader-focus-toolbar button.rf-off:hover {
        background: #d04a4a;
      }
    `;
    document.head.appendChild(style);
  };

  const removeToolbarStyles = () => {
    const style = document.getElementById("reader-focus-toolbar-styles");
    if (style) style.remove();
  };
})();
