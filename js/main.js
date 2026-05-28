// ============================================================
// main.js — FULL WORKING VERSION
// ============================================================

let currentScreen = "start";

let selectedFrame = 0;
let selectedFilter = 0;
let selectedFormat = "long";

let frameNames = [
  "Pink",
  "Mint",
  "Yellow",
  "Lavender"
];

let frameColors = [
  "#ffb6c1",
  "#b2f0e8",
  "#fff59d",
  "#e1bee7"
];

let frameDark = [
  "#f48fb1",
  "#80cbc4",
  "#f9a825",
  "#ce93d8"
];

let filterEmoji = [
  "🎀",
  "💕",
  "🐱",
  "👓",
  "🐸"
];

let filterLabel = [
  "Ribbon",
  "Love",
  "Cat",
  "Glasses",
  "Frog"
];

let formatOptions = [
  "long",
  "square"
];

// ============================================================

function setup() {

  createCanvas(windowWidth, windowHeight);

  textAlign(CENTER, CENTER);

  setupCamera();

}

// ============================================================

function draw() {

  background("#fff0f5");

  if (currentScreen === "start") {
    drawStartScreen();
  }

  else if (currentScreen === "settings") {
    drawSettingsScreen();
  }

  else if (currentScreen === "camera") {
    drawCamera();
  }

  else if (currentScreen === "select") {
    drawSelectScreen();
  }

  else if (currentScreen === "result") {
    drawResultScreen();
  }

  else if (currentScreen === "saved") {
    drawSavedScreen();
  }

  else if (currentScreen === "ending") {
    drawEndingScreen();
  }

}

// ============================================================
// START SCREEN
// ============================================================

function drawStartScreen() {

  background("#fff0f5");

  push();

  fill("#ff4d6d");

  textSize(52);

  text(
    "📸 4CUT BOOTH",
    width / 2,
    height * 0.25
  );

  fill("#555");

  textSize(18);

  text(
    "Web Photo Booth Project",
    width / 2,
    height * 0.33
  );

  fill("#ff4d6d");

  rect(
    width / 2 - 120,
    height * 0.65,
    240,
    60,
    30
  );

  fill(255);

  textSize(28);

  text(
    "▶ START",
    width / 2,
    height * 0.65 + 30
  );

  pop();

}

// ============================================================
// SETTINGS SCREEN
// ============================================================

function drawSettingsScreen() {

  background("#fff0f5");

  push();

  fill("#ff4d6d");

  textSize(32);

  text(
    "⚙ SETTINGS",
    width / 2,
    60
  );

  // ========================================================
  // FRAME
  // ========================================================

  fill("#333");

  textSize(18);

  text(
    "Frame",
    width / 2,
    120
  );

  for (let i = 0; i < frameNames.length; i++) {

    let bx = 100 + i * 90;

    let by = 150;

    fill(frameColors[i]);

    stroke(
      selectedFrame === i
        ? frameDark[i]
        : "#ddd"
    );

    strokeWeight(4);

    rect(
      bx,
      by,
      70,
      70,
      12
    );

    noStroke();

    fill("#333");

    textSize(12);

    text(
      frameNames[i],
      bx + 35,
      by + 90
    );

  }

  // ========================================================
  // FILTER
  // ========================================================

  fill("#333");

  textSize(18);

  text(
    "AR Filter",
    width / 2,
    290
  );

  for (let i = 0; i < filterEmoji.length; i++) {

    let bx = 70 + i * 80;

    let by = 320;

    fill("#fff");

    stroke(
      selectedFilter === i
        ? "#ff4d6d"
        : "#ddd"
    );

    strokeWeight(4);

    rect(
      bx,
      by,
      60,
      60,
      12
    );

    noStroke();

    fill("#333");

    textSize(28);

    text(
      filterEmoji[i],
      bx + 30,
      by + 30
    );

  }

  // ========================================================
  // FORMAT
  // ========================================================

  fill("#333");

  textSize(18);

  text(
    "Photo Format",
    width / 2,
    450
  );

  // LONG

  fill(
    selectedFormat === "long"
      ? "#ff4d6d"
      : "#fff"
  );

  stroke("#ff4d6d");

  rect(
    width / 2 - 140,
    490,
    100,
    50,
    20
  );

  fill(
    selectedFormat === "long"
      ? "#fff"
      : "#ff4d6d"
  );

  noStroke();

  textSize(18);

  text(
    "LONG",
    width / 2 - 90,
    515
  );

  // SQUARE

  fill(
    selectedFormat === "square"
      ? "#ff4d6d"
      : "#fff"
  );

  stroke("#ff4d6d");

  rect(
    width / 2 + 40,
    490,
    100,
    50,
    20
  );

  fill(
    selectedFormat === "square"
      ? "#fff"
      : "#ff4d6d"
  );

  noStroke();

  text(
    "SQUARE",
    width / 2 + 90,
    515
  );

  // ========================================================
  // START BUTTON
  // ========================================================

  fill("#ff4d6d");

  rect(
    width / 2 - 140,
    height - 100,
    280,
    60,
    30
  );

  fill(255);

  textSize(24);

  text(
    "📷 START CAMERA",
    width / 2,
    height - 70
  );

  pop();

}

// ============================================================
// SELECT SCREEN
// ============================================================

function drawSelectScreen() {

  background("#fff0f5");

  fill("#ff4d6d");

  textSize(30);

  text(
    "SELECT 4 PHOTOS",
    width / 2,
    50
  );

}

// ============================================================
// RESULT SCREEN
// ============================================================

function drawResultScreen() {

  background("#fff0f5");

  fill("#ff4d6d");

  textSize(32);

  text(
    "✨ RESULT ✨",
    width / 2,
    60
  );

}

// ============================================================
// SAVED SCREEN
// ============================================================

function drawSavedScreen() {

  background("#fff0f5");

  fill("#ff4d6d");

  textSize(40);

  text(
    "✅ SAVED",
    width / 2,
    height / 2
  );

}

// ============================================================
// ENDING SCREEN
// ============================================================

function drawEndingScreen() {

  background("#fff0f5");

  fill("#ff4d6d");

  textSize(32);

  text(
    "THANK YOU 💕",
    width / 2,
    height / 2
  );

}

// ============================================================
// BUTTONS
// ============================================================

function mousePressed() {

  // START SCREEN

  if (currentScreen === "start") {

    if (
      mouseX > width / 2 - 120 &&
      mouseX < width / 2 + 120 &&
      mouseY > height * 0.65 &&
      mouseY < height * 0.65 + 60
    ) {

      currentScreen = "settings";

    }

  }

  // SETTINGS

  else if (currentScreen === "settings") {

    // FRAME

    for (let i = 0; i < frameNames.length; i++) {

      let bx = 100 + i * 90;

      let by = 150;

      if (
        mouseX > bx &&
        mouseX < bx + 70 &&
        mouseY > by &&
        mouseY < by + 70
      ) {

        selectedFrame = i;

      }

    }

    // FILTER

    for (let i = 0; i < filterEmoji.length; i++) {

      let bx = 70 + i * 80;

      let by = 320;

      if (
        mouseX > bx &&
        mouseX < bx + 60 &&
        mouseY > by &&
        mouseY < by + 60
      ) {

        selectedFilter = i;

      }

    }

    // FORMAT

    if (
      mouseX > width / 2 - 140 &&
      mouseX < width / 2 - 40 &&
      mouseY > 490 &&
      mouseY < 540
    ) {

      selectedFormat = "long";

    }

    if (
      mouseX > width / 2 + 40 &&
      mouseX < width / 2 + 140 &&
      mouseY > 490 &&
      mouseY < 540
    ) {

      selectedFormat = "square";

    }

    // CAMERA START

    if (
      mouseX > width / 2 - 140 &&
      mouseX < width / 2 + 140 &&
      mouseY > height - 100 &&
      mouseY < height - 40
    ) {

      currentScreen = "camera";

    }

  }

  // CAMERA

  else if (currentScreen === "camera") {

    handleCameraButtons();

  }

}

// ============================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

}
