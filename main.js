var el = document.querySelector("body");
var topValue = 10;
var bottomValue = 50;

var existingBody = document.getElementById("body");

if (existingBody) {
} else {
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
}
