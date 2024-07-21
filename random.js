chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "closeShades") {
    document.getElementsByClassName("top-shade")[0].style.display = "none";
    document.getElementsByClassName("bottom-shade")[0].style.display = "none";
    document.body.setAttribute("id", "false-body");
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "openShades") {
    document.getElementsByClassName("top-shade")[0].style.display = "block";
    document.getElementsByClassName("bottom-shade")[0].style.display = "block";
    document.body.setAttribute("id", "body");
  }
});
