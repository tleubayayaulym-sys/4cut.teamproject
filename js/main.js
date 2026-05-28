// ============================================================
// main.js — FINAL UPDATED VERSION
// ============================================================

// ============================================================
// GLOBAL VARIABLES
// ============================================================

let currentScreen = "start";

let selectedFrame = 0;
let selectedFilter = 0;

let selectedFormat = 0;
let selectedBorder = 0;

// photos
let allPhotos = [];
let selectedPhotos = [];
let capturedPhotos = [];

// camera
let countdown = 0;
let isCapturing = false;

// ============================================================
// FRAME OPTIONS
// ============================================================

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

// ============================================================
// FILTER OPTIONS
// ============================================================

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

// ============================================================
// FORMAT OPTIONS
// ============================================================

let formatNames = [
  "Square",
  "Long"
];

// ============================================================
// BORDER OPTIONS
// ============================================================

let borderNames = [
  "Basic",
  "Film",
  "Glow",
  "Sticker"
];

// ============================================================
// SETUP
// ============================================================

function setup() {

  createCanvas(windowWidth, windowHeight);

  textAlign(CENTER, CENTER);

  setupCamera();

}

// ============================================================
// DRAW
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
// DECORATIONS
// ============================================================

function drawDecorations() {

  push();

  noStroke();

  let shapes = ["★", "♡", "✦", "✿"];

  let cols = [
    "#ffb6c1",
    "#b2f0e8",
    "#fff59d",
    "#e1bee7"
  ];

  for (let i=0; i<14; i++) {

    let x =
      (sin(frameCount * 0.008 + i * 37) * 0.5 + 0.5)
      * width;

    let y =
      (cos(frameCount * 0.006 + i * 53) * 0.5 + 0.5)
      * height;

    fill(cols[i % cols.length] + "88");

    textSize(14 + sin(frameCount * 0.02 + i) * 4);

    text(
      shapes[i % shapes.length],
      x,
      y
    );

  }

  pop();

}

// ============================================================
// START SCREEN
// ============================================================

function drawStartScreen() {

  drawDecorations();

  push();

  fill(255);

  noStroke();

  rect(
    width/2 - 230,
    height*0.12,
    460,
    height*0.72,
    32
  );

  fill("#ff4d6d");

  textSize(52);

  text(
    "📸 4CUT BOOTH",
    width/2,
    height*0.24
  );

  fill("#ffb6c1");

  textSize(18);

  text(
    "✨ Web Photo Booth ✨",
    width/2,
    height*0.32
  );

  // creator card

  fill("#fff0f5");

  rect(
    width/2 - 170,
    height*0.42,
    340,
    80,
    18
  );

  fill("#ff4d6d");

  textSize(14);

  text(
    "💝 제작자",
    width/2,
    height*0.45
  );

  fill("#555");

  textSize(16);

  text(
    "아야울름 · 응웬 바오 담 · 마이티투짱",
    width/2,
    height*0.49
  );

  // button

  fill("#ff4d6d");

  rect(
    width/2 - 130,
    height*0.68,
    260,
    62,
    31
  );

  fill(255);

  textSize(28);

  text(
    "▶ START",
    width/2,
    height*0.68 + 31
  );

  fill("#bbb");

  textSize(13);

  text(
    "Press SPACE or TOUCH",
    width/2,
    height*0.78
  );

  pop();

}

// ============================================================
// SETTINGS SCREEN
// ============================================================

function drawSettingsScreen() {

  drawDecorations();

  push();

  fill(255);

  noStroke();

  rect(
    width/2 - 280,
    20,
    560,
    height - 40,
    30
  );

  fill("#ff4d6d");

  textSize(34);

  text(
    "⚙️ Settings",
    width/2,
    70
  );

  // ============================================================
  // FRAME
  // ============================================================

  fill("#555");

  textSize(18);

  textAlign(LEFT,CENTER);

  text(
    "▶ Frame",
    width*0.12,
    130
  );

  let frameBox = 78;

  for (let i=0; i<frameNames.length; i++) {

    let bx = width/2 - 190 + i*100;

    let by = 160;

    if (selectedFrame === i) {

      stroke(frameDark[i]);

      strokeWeight(4);

    }
    else {

      stroke("#ddd");

      strokeWeight(2);

    }

    fill(frameColors[i]);

    rect(
      bx,
      by,
      frameBox,
      frameBox,
      18
    );

    noStroke();

    fill("#555");

    textSize(12);

    textAlign(CENTER,CENTER);

    text(
      frameNames[i],
      bx + frameBox/2,
      by + frameBox + 18
    );

  }

  // ============================================================
  // FILTER
  // ============================================================

  fill("#555");

  textSize(18);

  textAlign(LEFT,CENTER);

  text(
    "▶ AR Filter",
    width*0.12,
    300
  );

  for (let i=0; i<filterEmoji.length; i++) {

    let bx = width/2 - 240 + i*95;

    let by = 330;

    if (selectedFilter === i) {

      stroke("#ff4d6d");

      strokeWeight(4);

    }
    else {

      stroke("#ddd");

      strokeWeight(2);

    }

    fill("#fff");

    rect(
      bx,
      by,
      75,
      75,
      18
    );

    noStroke();

    fill("#333");

    textSize(30);

    text(
      filterEmoji[i],
      bx + 37,
      by + 37
    );

  }

  // ============================================================
  // FORMAT
  // ============================================================

  fill("#555");

  textSize(18);

  textAlign(LEFT,CENTER);

  text(
    "▶ Photo Format",
    width*0.12,
    470
  );

  for (let i=0; i<formatNames.length; i++) {

    let bx = width/2 - 130 + i*150;

    let by = 500;

    if (selectedFormat === i) {

      fill("#ff4d6d");

    }
    else {

      fill("#fff");

      stroke("#ddd");

      strokeWeight(2);

    }

    rect(
      bx,
      by,
      120,
      56,
      24
    );

    noStroke();

    fill(
      selectedFormat === i
      ? 255
      : "#555"
    );

    textSize(18);

    text(
      formatNames[i],
      bx + 60,
      by + 28
    );

  }

  // ============================================================
  // BORDER
  // ============================================================

  fill("#555");

  textSize(18);

  textAlign(LEFT,CENTER);

  text(
    "▶ Border Style",
    width*0.12,
    620
  );

  for (let i=0; i<borderNames.length; i++) {

    let bx = width/2 - 240 + i*120;

    let by = 650;

    if (selectedBorder === i) {

      fill("#ff4d6d");

    }
    else {

      fill("#fff");

      stroke("#ddd");

      strokeWeight(2);

    }

    rect(
      bx,
      by,
      100,
      52,
      22
    );

    noStroke();

    fill(
      selectedBorder === i
      ? 255
      : "#555"
    );

    textSize(15);

    text(
      borderNames[i],
      bx + 50,
      by + 26
    );

  }

  // ============================================================
  // START BUTTON
  // ============================================================

  fill("#ff4d6d");

  noStroke();

  rect(
    width/2 - 160,
    height - 100,
    320,
    62,
    31
  );

  fill(255);

  textSize(28);

  text(
    "📷 START CAMERA",
    width/2,
    height - 69
  );

  pop();

}

// ============================================================
// BUTTON HANDLER
// ============================================================

function mousePressed() {

  handleButtons();

}

function touchStarted() {

  handleButtons();

  return false;

}

function handleButtons() {

  // ============================================================
  // START
  // ============================================================

  if (currentScreen === "start") {

    if (
      mouseX > width/2 - 130 &&
      mouseX < width/2 + 130 &&
      mouseY > height*0.68 &&
      mouseY < height*0.68 + 62
    ) {

      currentScreen = "settings";

    }

  }

  // ============================================================
  // SETTINGS
  // ============================================================

  else if (currentScreen === "settings") {

    // frame

    for (let i=0; i<frameNames.length; i++) {

      let bx = width/2 - 190 + i*100;

      let by = 160;

      if (
        mouseX > bx &&
        mouseX < bx + 78 &&
        mouseY > by &&
        mouseY < by + 78
      ) {

        selectedFrame = i;

        return;

      }

    }

    // filter

    for (let i=0; i<filterEmoji.length; i++) {

      let bx = width/2 - 240 + i*95;

      let by = 330;

      if (
        mouseX > bx &&
        mouseX < bx + 75 &&
        mouseY > by &&
        mouseY < by + 75
      ) {

        selectedFilter = i;

        return;

      }

    }

    // format

    for (let i=0; i<formatNames.length; i++) {

      let bx = width/2 - 130 + i*150;

      let by = 500;

      if (
        mouseX > bx &&
        mouseX < bx + 120 &&
        mouseY > by &&
        mouseY < by + 56
      ) {

        selectedFormat = i;

        return;

      }

    }

    // border

    for (let i=0; i<borderNames.length; i++) {

      let bx = width/2 - 240 + i*120;

      let by = 650;

      if (
        mouseX > bx &&
        mouseX < bx + 100 &&
        mouseY > by &&
        mouseY < by + 52
      ) {

        selectedBorder = i;

        return;

      }

    }

    // start camera

    if (
      mouseX > width/2 - 160 &&
      mouseX < width/2 + 160 &&
      mouseY > height - 100 &&
      mouseY < height - 38
    ) {

      currentScreen = "camera";

    }

  }

  // ============================================================
  // CAMERA
  // ============================================================

  else if (currentScreen === "camera") {

    handleCameraButtons();

  }

  // ============================================================
  // SELECT
  // ============================================================

  else if (currentScreen === "select") {

    handleSelectButtons();

  }

  // ============================================================
  // RESULT
  // ============================================================

  else if (currentScreen === "result") {

    handleResultButtons();

  }

  // ============================================================
  // SAVED
  // ============================================================

  else if (currentScreen === "saved") {

    handleSavedButtons();

  }

  // ============================================================
  // ENDING
  // ============================================================

  else if (currentScreen === "ending") {

    handleEndingButtons();

  }

}

// ============================================================
// KEYBOARD
// ============================================================

function keyPressed() {

  // SPACE

  if (key === ' ') {

    if (currentScreen === "start") {

      currentScreen = "settings";

    }

    else if (currentScreen === "camera") {

      takeSinglePhoto();

    }

  }

  // SAVE

  if (
    (key === 's' || key === 'S')
    && currentScreen === "result"
  ) {

    saveResultCanvas();

  }

  // RESET

  if (
    (key === 'r' || key === 'R')
    && (
      currentScreen === "result"
      || currentScreen === "saved"
    )
  ) {

    allPhotos = [];

    selectedPhotos = [];

    capturedPhotos = [];

    currentScreen = "camera";

  }

}

// ============================================================
// RESIZE
// ============================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

}
