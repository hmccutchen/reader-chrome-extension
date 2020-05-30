


// Applies the page element to the document(web page)
// document.body.appendChild(page);

//Creates variables for x & y for know where our mouse is
//x is for horizontal values, and y for vertical ones
var x = 0;
var y = 0;

// Add Event Listener for page. Listens for any mouse movement
// inside the page element. If found, run function below
document.addEventListener('mousemove', function(event) {
  //Takes the mouse movement we listened for and saves it into two variables

  y = event.clientY;

  mousebox();
  console.log(y);

  //Here we set the background color to the x & y value that the mouse has over the web page. See css part for rgb explaination
  // page.style.backgroundColor = "black";
  //By writing variable + ', ' we combine the value with text to make it write like rgb(x, y, 100); when sent to style part (css)
  //Adds a text element to the page. It writes out the x & y value
  // page.textContent = x + ', ' + y;
});

// Find the css element called 'box' to use in future
var boxTop = document.getElementById('box-top');

//Function for a box that follows the mouse around
var mousebox = function() {
  //Calls the css code to push the box away from the left & top
  //the same x & y values that the mouse has
  boxTop.style.backgroundColor = "white";
  // box.style.opacity = "0.5";
  // box.style.zIndex = "1";
  boxTop.style.width = "100vw";
  boxTop.style.height = "34px";
  boxTop.style.left = x + 'px';
  boxTop.style.top = y + 'px';

}

