var mouseOut = false;
var mouseEnable = false;
var lastMouseCoordinates =  [0,0];
var mouseCoordinates =  [0,0];

var actualWidth, actualHeight;
var body;

var threeScene;

var numParticles = 160000;//perfect sq
var particlesTextureDim = 400;//sqrt(numParticles)
var particleData = new Float32Array(numParticles*4);//[position.x, position.y, velocity.x, velocity.y]
var particles;
var particlesVertices;
var vectorLength = 2;//num floats to parse

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
    
    var geo = new THREE.BufferGeometry();
    geo.dynamic = true;
    particlesVertices = new Float32Array(numParticles*3);
    geo.addAttribute('position', new THREE.BufferAttribute(particlesVertices, 3));
    particles = new THREE.Points(geo, new THREE.PointsMaterial(
        {size:0.04, opacity: 0.5, transparent: false, depthTest: false, color:0x000033}));
    threeScene.scene.add(particles);

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
    mouseEnable = true;
}

function onMouseUp(){
    mouseEnable = false;
}

function onResize(){

}