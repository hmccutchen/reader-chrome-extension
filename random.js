chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message);
  if (message.action === "closeShades") {
    document.getElementsByClassName("top-shade")[0].style.display = "none";
    document.getElementsByClassName("bottom-shade")[0].style.display = "none";
    document.body.setAttribute("id", "false-body");
  }
});
