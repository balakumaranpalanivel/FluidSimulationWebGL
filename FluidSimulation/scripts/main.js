var mouseOut = false;
var mouseEnable = false;

window.onload = init;

function init(){
    canvas = document.getElementById("glcanvas");

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
}

function onMouseMove(e){

}

function onMouseDown(){

}

function onMouseUp(){

}

function onResize(){
    
}