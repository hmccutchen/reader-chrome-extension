(() => {
  let topOffset = 50;
  const bottomOffset = 2;
  let lastY = window.innerHeight / 2;

  const topShade = document.getElementsByClassName("top-shade")[0];
  const bottomShade = document.getElementsByClassName("bottom-shade")[0];

  let updateShadesPosition = (event, forceUpdate = false) => {
    if (event && event.type === "mousemove") {
      lastY = event.clientY;
    }

    const topY = lastY - topOffset + window.scrollY;
    const bottomY = lastY + bottomOffset + window.scrollY;

    topShade.style.height = `${topY}px`;
    topShade.style.width = "100vw";
    topShade.style.position = "absolute";
    topShade.style.opacity = ".8";
    topShade.style.backgroundColor = "black";
    topShade.style.zIndex = "2147483647";
    topShade.style.pointerEvents = "none";

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
  };

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "increase") {
      topOffset += 10;

      updateShades();
    } else if (message.action === "decrease") {
      topOffset = Math.max(0, topOffset - 10);
      updateShades();
    }
  });

  const updateShades = () => {
    updateShadesPosition(null, true);
  };

  const initializeShades = () => {
    window.addEventListener("scroll", (event) => {
      updateShadesPosition(event);
    });
    document.getElementById("body").addEventListener("mousemove", (event) => {
      updateShadesPosition(event);
    });
    const initialMouseMoveEvent = new MouseEvent("mousemove", {
      clientY: lastY,
    });
    updateShadesPosition(initialMouseMoveEvent);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeShades);
  } else {
    initializeShades();
  }
})();
