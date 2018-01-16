var mouseOut = false;
var mouseEnable = false;
var lastMouseCoordinates =  [0,0];
var mouseCoordinates =  [0,0];

var actualWidth, actualHeight;
var body;

var threeScene;

window.onload = init;

function init(){
    canvas = document.getElementById("glcanvas");
    body = document.getElementsByTagName("body")[0];

    actualWidth = Math.round(body.clientWidth);
    actualHeight = Math.round(body.clientHeight);

    window.onmousemove = onMouseMove;
    window.onmousedown = onMouseDown;
    window.onmouseup = onMouseUp;
    window.onresize = onResize;
    canvas.onmouseout = function (){
        mouseOut = true;
    }

    canvas.onmouseenter = function (){
        mouseOut = false;
    }

    threeScene = initThreeScene();

}

function onMouseMove(e){
    lastMouseCoordinates = mouseCoordinates;
    // clip the mouse co-ordinates to window for computation
    var padding = 10;
    var x = e.clientX;
    if (x < padding){
        x = padding;
    }

    if (x > actualWidth - padding)
    {
        x = actualWidth - padding 
    }

    var y = e.clientY;
    if (y < padding){
        y = padding;
    }

    if (y > actualHeight - padding)
    {
        y = actualHeight - padding 
    }

    // changing the y co-ordinate is from bottom to up
    mouseCoordinates = [x, actualHeight-y];
}

function onMouseDown(){

}

function onMouseUp(){

}

function onResize(){

}