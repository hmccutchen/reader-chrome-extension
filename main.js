


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

   y = event.clientY + window.scrollY;
   x = event.clientY  + (window.scrollY - 750);
   // console.log(x)
   // console.log(y)
   // console.log(window.scrollY)


  // x = event.clientX;
  mousebox();

});


// Find the css element called 'box' to use in future
var boxTop = document.getElementById('box-top');
var boxBottom = document.getElementById('box-bottom');

//Function for a box that follows the mouse around
var mousebox = function() {
  //Calls the css code to push the box away from the left & top
  //the same x & y values that the mouse has

  boxTop.style.width = "100vw";


  boxTop.style.top = y + 10 + 'px';

  boxBottom.style.bottom = -x  +"px";

}

