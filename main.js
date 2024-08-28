if (!window.shadesInitialized) {
  window.shadesInitialized = true;
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openShades") {
      console.log("content script received");
      initShadeSetup();
      initializeShades();
    } else if (message.action === "closeShades") {
      removeShades();
    } else if (message.action === "increase") {
      topOffset += 10;
      updateShades();
    } else if (message.action === "decrease") {
      topOffset = Math.max(0, topOffset - 10);
      updateShades();
    }
  });

  let topOffset = 50;
  const bottomOffset = 2;
  let lastY = window.innerHeight / 2;

  const handleMouseMove = (event) => {
    lastY = event.clientY;
    updateShadesPosition(event);
  };
  const handleScroll = (event) => {
    updateShadesPosition(event);
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

  const initializeShades = () => {
    window.addEventListener("scroll", handleScroll);
    document
      .getElementById("body")
      .addEventListener("mousemove", handleMouseMove);

    const initialMouseMoveEvent = new MouseEvent("mousemove", {
      clientY: lastY,
    });
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

  const updateShades = () => {
    updateShadesPosition(null, true);
  };
}
