//registers div as canvas - for IE?
var canvasDiv = document.getElementById('canvasDiv');
canvas = document.createElement('canvas');
canvas.setAttribute('width', 600);
canvas.setAttribute('height', 400);
canvas.setAttribute('id', 'canvas');
canvas.setAttribute("styles", 'position:relative, z-index:0');
canvasDiv.appendChild(canvas);
$(document).ready(function(){
  $('#canvas').css( 'cursor', 'crosshair' );
});

var text = $('#colorPicker').val();

if (typeof G_vmlCanvasManager != 'undefined') {
  canvas = G_vmlCanvasManager.initElement(canvas);
}
context = canvas.getContext("2d");

//drawing functions
var paint = false;
var isDrawMode = true;
var isErasing = false;
//Code for clear button by Kalvin

$("#clearButton").click(function() {
  clickX = [];
  clickY = [];
  clickDrag = [];
  clickColor = [];
  redraw(); // Clears the canvas
  $(".TextBox").remove();
  $(".MoveBox").remove();
  $(".Contain").remove();
});


$('#canvas').mousedown(function(e) {
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
  if (isDrawMode) {
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
  }
  if (!isDrawMode) {
    var locationContainer = $("<div></div>");
    locationContainer.addClass("Contain");
    locationContainer.css("left", mouseX);
    locationContainer.css("top", mouseY);
    var motionContainer = $("<div></div>");
    motionContainer.addClass("MoveBox");
    var textBox = $("<textarea>Enter Text</textarea>");
    textBox.addClass("TextBox")
    motionContainer.append(textBox);
    motionContainer.draggable().resizable();
    locationContainer.append(motionContainer);
    $("#canvasDiv").append(locationContainer);

    //turns back to drawing
    changeMode();
  }
});

$('#canvas').mousemove(function(e) {
  if (isDrawMode) {
    if (paint) {
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redraw();
    }
  }
});

$('#canvas').mouseup(function(e) {
  if (isDrawMode) {
    paint = false;
  }
});

$('#canvas').mouseleave(function(e) {
  if (isDrawMode) {
    paint = false;
  }
});

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;
var clickColor = new Array();


function addClick(x, y, dragging) {
  text = $('#colorPicker').val();
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickColor.push(text);

}


function redraw() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.lineJoin = "round";
  //context.lineWidth = 5;

  for (var i = 0; i < clickX.length; i++) {
    context.beginPath();
    if (clickDrag[i] && i) {
      context.moveTo(clickX[i - 1], clickY[i - 1]);
    } else {
      context.moveTo(clickX[i] - 1, clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    var currColor = clickColor[i];
    if (currColor == "white") {
      context.lineWidth = 20;
    } else {
      context.lineWidth = 2;
    }
    context.strokeStyle = currColor;
    context.stroke();
  }
}


//save button
$('#saveButton').click(function() {
  html2canvas(canvasDiv, {
    onrendered: function(canvas) {
      var imageData = canvas.toDataURL('image/png', 1.0);

      document.getElementById('canvasImg').src = imageData;
    }
  });
})

//switches between draw and text
function changeMode() {
  isDrawMode = !isDrawMode;
  if (isDrawMode) {
    $('#switchButton').text("Add Text Box");
    $('#canvas').css( 'cursor', 'crosshair' );
  } else {
    $('#switchButton').text("Click To Place");
    $('#canvas').css( 'cursor', 'pointer' );
  }
}

$('#switchButton').click(changeMode);

//Change color when hover over buttons (kalvin)
$(".Button").hover(function(){

  $(this).css("background-color", "black");

},

function(){

  $(this).css("background-color", "blue");


}

);
