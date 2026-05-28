// ============================================================
// main.js
// ============================================================

let currentScreen = "camera";

// ============================================================
// FILTERS
// ============================================================

let selectedFilter = 0;

let filterEmoji = [
"🎀",
"💕",
"🐱",
"👓",
"🐸"
];

// ============================================================
// FRAMES
// ============================================================

let selectedFrame = 0;

let frameDark = [
"#ff4d6d",
"#7b2cbf",
"#3a86ff",
"#2a9d8f"
];

// ============================================================

function setup() {

createCanvas(windowWidth, windowHeight);

textAlign(CENTER, CENTER);

rectMode(CORNER);

imageMode(CORNER);

setupCamera();

setTimeout(() => {

if (video) {
initFaceMesh(video);
}

}, 1000);

}

// ============================================================

function draw() {

background("#fff0f5");

// CAMERA

if (currentScreen === "camera") {

drawCamera();

if (video) {

drawARFilter(
_boxX + _boxW/2,
_boxY + _boxH/2,
selectedFilter,
_boxW,
_boxH
);

drawFaceStatus(width,height);

}

}

// SELECT

else if (currentScreen === "select") {

drawSelectScreen();

}

// RESULT

else if (currentScreen === "result") {

drawResultScreen();

}

// SAVED

else if (currentScreen === "saved") {

drawSavedScreen();

}

// ENDING

else if (currentScreen === "ending") {

drawEndingScreen();

}

}

// ============================================================

function mousePressed() {

if (currentScreen === "camera") {

handleCameraButtons();

}

else if (currentScreen === "select") {

handleSelectButtons();

}

else if (currentScreen === "result") {

handleResultButtons();

}

else if (currentScreen === "saved") {

handleSavedButtons();

}

else if (currentScreen === "ending") {

handleEndingButtons();

}

}

// ============================================================

function windowResized() {

resizeCanvas(windowWidth, windowHeight);

}
