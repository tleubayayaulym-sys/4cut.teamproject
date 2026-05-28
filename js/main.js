```javascript id="3myt3v"
// ============================================================
// main.js
// ============================================================

// current screen
let currentScreen = "camera";

// ============================================================
// setup()
// ============================================================

function setup() {

createCanvas(
windowWidth,
windowHeight
);

// center text
textAlign(CENTER, CENTER);

// smooth edges
smooth();

// start camera
setupCamera();

}

// ============================================================
// draw()
// ============================================================

function draw() {

background("#fff0f5");

// ============================================================
// CAMERA SCREEN
// ============================================================

if (currentScreen === "camera") {

drawCamera();

}

}

// ============================================================
// mousePressed()
// ============================================================

function mousePressed() {

if (currentScreen === "camera") {

handleCameraButtons();

}

}

// ============================================================
// touchStarted()
// ============================================================

function touchStarted() {

mousePressed();

return false;

}

// ============================================================
// windowResized()
// ============================================================

function windowResized() {

resizeCanvas(
windowWidth,
windowHeight
);

}

// ============================================================
// keyPressed()
// ============================================================

function keyPressed() {

// SPACE = photo

if (key === " ") {

if (currentScreen === "camera") {

takeSinglePhoto();

}

}

}

// ============================================================
// prevent mobile scroll
// ============================================================

document.addEventListener(
"touchmove",
function(e){

e.preventDefault();

},
{ passive:false }
);
```
