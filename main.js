var el = document.querySelector("body");
var topValue = 10;
var bottomValue = 50;

try {
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    senderResponse
  ) {
    if (message.message == "up") {
      console.log("i;m here");
      return (topValue += 10);
    }

    return true;
  });
} catch (e) {
  console.log("error", e);
}

try {
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    senderResponse
  ) {
    if (message.message == "down") {
      return (topValue -= 10);
    }

    return true;
  });
} catch (e) {
  console.log("error", e);
}

// I have to figure out how to acitve this feature without needing to press the on button
// the on button also activate the main.js but this file inserts a new body tag
// perhaps I'll add a seperate script file to active this new feature

var pageBody = document.body;

var pageDiv = document.createElement("div");
pageBody.setAttribute("id", "body");
pageDiv.setAttribute("class", "top-shade");
pageBody.insertBefore(pageDiv, pageBody.firstChild);

var secondDiv = document.createElement("div");
secondDiv.setAttribute("class", "bottom-shade");
pageBody.insertBefore(secondDiv, pageBody.children[1]);

var topShade = document.getElementsByClassName("top-shade")[0];
var bottomShade = document.getElementsByClassName("bottom-shade")[0];

window.addEventListener("scroll", (event) => {
  record(event);
});

topShade.style.display = "block";

var record = (event) => {
  var topShade = document.getElementsByClassName("top-shade")[0];
  var bottomShade = document.getElementsByClassName("bottom-shade")[0];
  var topY = event.clientY - topValue + this.scrollY;

  var bottomY = event.clientY + bottomValue + this.scrollY;

  topShade.style.height = `${topY}px`;
  topShade.style.width = "100vw";
  topShade.style.position = "absolute";
  topShade.style.opacity = ".8";
  topShade.style.backgroundColor = "black";
  topShade.style.zIndex = "2147483647";

  bottomShade.style.height = `${100}%`;
  bottomShade.style.width = "100vw";
  bottomShade.style.position = "absolute";
  bottomShade.style.opacity = ".8";
  bottomShade.style.backgroundColor = "black";
  bottomShade.style.top = `${bottomY}px`;
  bottomShade.style.zIndex = "2147483647";
  // bottomShade.style.bottom = "0";
};

var shadeCollection = document
  .getElementById("body")
  .addEventListener("mousemove", (event) => {
    record(event);
  });
