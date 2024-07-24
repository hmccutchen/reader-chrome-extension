chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "closeShades") {
    removeShades();
  } else if (message.action === "openShades") {
    initShadeSetup();
  }
});

const initShadeSetup = () => {
  document.body.setAttribute("id", "body");
  const pageBody = document.body;

  if (!document.querySelector(".top-shade")) {
    const pageDiv = document.createElement("div");
    pageDiv.setAttribute("class", "top-shade");
    pageBody.insertBefore(pageDiv, pageBody.firstChild);
  }

  if (!document.querySelector(".bottom-shade")) {
    const secondDiv = document.createElement("div");
    secondDiv.setAttribute("class", "bottom-shade");
    pageBody.insertBefore(secondDiv, pageBody.children[1]);
  }
};

const removeShades = () => {
  document.body.removeAttribute("id", "body");
  const topShade = document.getElementsByClassName("top-shade")[0];
  const bottomShade = document.getElementsByClassName("bottom-shade")[0];

  topShade.remove();
  bottomShade.remove();
};
