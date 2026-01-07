const OFFSET_STEP = 10;
const INITIAL_TOP_OFFSET = 50;
const bottomOffset = 2;

let topOffset = INITIAL_TOP_OFFSET;
let lastY = window.innerHeight / 2;
let spotlightState = false;
let lastX = window.innerWidth / 2;

const actionHandlers = {
  openShades: () => {
    initShadeSetup();
    initializeShades();
  },
  closeShades: () => {
    removeShades();
  },
  increase: () => {
    topOffset += OFFSET_STEP;
    updateShades();
  },
  decrease: () => {
    topOffset = Math.max(0, topOffset - OFFSET_STEP);
    updateShades();
  },
  spotlight: () => {
    if (spotlightState) {
      removeShades();
      spotlightState = false;
      return;
    }
    spotlightState = true;
    initSpotlightSetup();
    initializeShades();
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

const handleMouseMove = (event) => {
  lastY = event.clientY;
  if (spotlightState) updateSpotlightPosition(event);
  else updateShadesPosition(event);
};

const handleScroll = (event) => {
  if (spotlightState) updateSpotlightPosition(event);
  else updateShadesPosition(event);
};

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

const initializeShades = () => {
  window.addEventListener("scroll", handleScroll);
  document
    .getElementById("body")
    .addEventListener("mousemove", handleMouseMove);

  const initialMouseMoveEvent = new MouseEvent("mousemove", {
    clientY: lastY,
  });
  if (spotlightState) {
    updateSpotlightPosition(initialMouseMoveEvent);
  }
  updateShadesPosition(initialMouseMoveEvent);
};

const removeShades = () => {
  document.body.removeAttribute("id", "body");
  const topShade = document.getElementsByClassName("top-shade")[0];
  const bottomShade = document.getElementsByClassName("bottom-shade")[0];

  topShade.remove();
  bottomShade.remove();
  window.removeEventListener("scroll", handleScroll);
  document
    .getElementById("body")
    ?.removeEventListener("mousemove", handleMouseMove);
};

let updateShadesPosition = (event, forceUpdate = false) => {
  if (event && event.type === "mousemove") {
    lastY = event.clientY;
  }
  const topShade = document.getElementsByClassName("top-shade")[0];
  const bottomShade = document.getElementsByClassName("bottom-shade")[0];
  const topY = lastY - topOffset + window.scrollY;
  const bottomY = lastY + bottomOffset + window.scrollY;
  if (topShade) {
    topShade.style.height = `${topY}px`;
    topShade.style.width = "100vw";
    topShade.style.position = "absolute";
    topShade.style.opacity = ".8";
    topShade.style.backgroundColor = "black";
    topShade.style.zIndex = "2147483647";

    topShade.style.pointerEvents = "none";
  }
  if (bottomShade) {
    if (!forceUpdate) {
      bottomShade.style.height = `${100}%`;
      bottomShade.style.width = "100vw";
      bottomShade.style.position = "absolute";
      bottomShade.style.opacity = ".8";
      bottomShade.style.backgroundColor = "black";
      bottomShade.style.top = `${bottomY}px`;
      bottomShade.style.zIndex = "2147483647";
      topShade.style.pointerEvents = "none";
    }
  }
};

let updateSpotlightPosition = (event, forceUpdate = false) => {
  if (event && event.type === "mousemove") {
    lastY = event.clientY;
    lastX = event.clientX;
  }
  const overlay = document.getElementsByClassName("spotlight-overlay")[0];

  // const topY = lastY - topOffset + window.scrollY;

  if (overlay) {
    const centerX = lastX + window.scrollX;
    const centerY = lastY + window.scrollY;
    const radius = topOffset;

    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = `${document.documentElement.scrollWidth}px`;
    overlay.style.height = `${document.documentElement.scrollHeight}px`;
    overlay.style.background = `radial-gradient(circle ${radius}px at ${centerX}px ${centerY}px, transparent 0%, transparent ${radius}px, rgba(0, 0, 0, 0.8) ${radius}px)`;
    overlay.style.zIndex = "2147483647";
    overlay.style.pointerEvents = "none";
  }
};

const updateShades = () => {
  updateShadesPosition(null, true);
};
