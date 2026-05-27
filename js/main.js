// ============================================================
// main.js — 담당: 틀레우바이 아야으름
// FIXED VERSION
// ============================================================

// ============================================================
// GLOBAL STATE
// ============================================================

let currentScreen = "start";

let selectedFrame = 0;
let selectedFilter = 0;

// ============================================================
// FRAME DATA
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
// FILTER DATA
// ============================================================

let filterEmoji = [
  "🐱",
  "🐰",
  "👓",
  "👑"
];

let filterLabel = [
  "Cat",
  "Rabbit",
  "Glasses",
  "Crown"
];

// ============================================================
// SETUP
// ============================================================

function setup() {

  createCanvas(
    windowWidth,
    windowHeight
  );

  textAlign(CENTER, CENTER);

  setupCamera();
}

// ============================================================
// DRAW
// ============================================================

function draw() {

  background("#f6f1ff");

  if (currentScreen === "start") {

    drawStartScreen();
  }

  else if (currentScreen === "settings") {

    drawSettingsScreen();
  }

  else if (currentScreen === "camera") {

    drawCameraScreen();
  }

  else if (currentScreen === "result") {

    drawResultScreen();
  }

  else if (currentScreen === "saved") {

    drawSavedScreen();
  }
}

// ============================================================
// START SCREEN
// ============================================================

function drawStartScreen() {

  push();

  rectMode(CORNER);

  noStroke();

  // background circles
  for (let i = 0; i < frameColors.length; i++) {

    fill(frameColors[i] + "66");

    circle(
      i % 2 === 0
        ? width * 0.12
        : width * 0.88,

      i < 2
        ? height * 0.15
        : height * 0.85,

      200
    );
  }

  // title
  fill("#ff4d6d");

  textSize(
    min(width * 0.1, 68)
  );

  text(
    "📸 4CUT BOOTH",
    width / 2,
    height * 0.28
  );

  // subtitle
  fill("#888");

  textSize(
    min(width * 0.03, 20)
  );

  text(
    "인생네컷 스타일 웹 포토부스",
    width / 2,
    height * 0.37
  );

  // preview strip
  fill("#fff");

  stroke("#eee");

  strokeWeight(2);

  rect(
    width / 2 - 42,
    height * 0.43,
    84,
    110,
    8
  );

  for (let i = 0; i < 4; i++) {

    fill(frameColors[i]);

    noStroke();

    rect(
      width / 2 - 34,
      height * 0.43 + 6 + i * 26,
      68,
      22,
      4
    );
  }

  // start button
  fill("#ff4d6d");

  noStroke();

  let bw = min(width * 0.44, 260);

  rect(
    width / 2 - bw / 2,
    height * 0.72 - 30,
    bw,
    60,
    30
  );

  fill(255);

  textSize(
    min(width * 0.05, 32)
  );

  text(
    "▶ START",
    width / 2,
    height * 0.72
  );

  // hint
  fill("#bbb");

  textSize(13);

  text(
    "Space 또는 화면 터치",
    width / 2,
    height * 0.72 + 50
  );

  pop();
}

// ============================================================
// SETTINGS SCREEN
// ============================================================

function drawSettingsScreen() {

  push();

  rectMode(CORNER);

  noStroke();

  // title
  fill("#ff4d6d");

  textSize(
    min(width * 0.05, 34)
  );

  text(
    "⚙️ Settings",
    width / 2,
    55
  );

  // =========================================================
  // FRAME SELECT
  // =========================================================

  fill("#444");

  textSize(18);

  textAlign(LEFT, CENTER);

  text(
    "▶ 프레임 선택",
    width * 0.08,
    105
  );

  let frameSize = min(width * 0.15, 80);

  let frameGap = min(width * 0.04, 20);

  let frameTotal =
    frameSize * frameNames.length +
    frameGap * (frameNames.length - 1);

  let frameStart =
    width / 2 - frameTotal / 2;

  for (let i = 0; i < frameNames.length; i++) {

    let bx =
      frameStart + i * (frameSize + frameGap);

    let by = 125;

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
      frameSize,
      frameSize,
      12
    );

    noStroke();

    fill(
      selectedFrame === i
        ? frameDark[i]
        : "#666"
    );

    textAlign(CENTER, CENTER);

    textSize(12);

    text(
      frameNames[i],
      bx + frameSize / 2,
      by + frameSize + 12
    );
  }

  // =========================================================
  // FILTER SELECT
  // =========================================================

  fill("#444");

  noStroke();

  textSize(18);

  textAlign(LEFT, CENTER);

  text(
    "▶ AR 필터 선택",
    width * 0.08,
    255
  );

  let filterSize = min(width * 0.15, 80);

  let filterGap = min(width * 0.04, 20);

  let filterTotal =
    filterSize * filterEmoji.length +
    filterGap * (filterEmoji.length - 1);

  let filterStart =
    width / 2 - filterTotal / 2;

  for (let i = 0; i < filterEmoji.length; i++) {

    let bx =
      filterStart + i * (filterSize + filterGap);

    let by = 275;

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
      filterSize,
      filterSize,
      12
    );

    noStroke();

    fill("#333");

    textAlign(CENTER, CENTER);

    textSize(32);

    text(
      filterEmoji[i],
      bx + filterSize / 2,
      by + filterSize / 2
    );

    fill("#666");

    textSize(11);

    text(
      filterLabel[i],
      bx + filterSize / 2,
      by + filterSize + 12
    );
  }

  // =========================================================
  // START CAMERA BUTTON
  // =========================================================

  fill("#ff4d6d");

  noStroke();

  let startW = min(width * 0.6, 320);

  rect(
    width / 2 - startW / 2,
    height - 90,
    startW,
    62,
    31
  );

  fill(255);

  textAlign(CENTER, CENTER);

  textSize(
    min(width * 0.045, 28)
  );

  text(
    "촬영 시작 📷",
    width / 2,
    height - 59
  );

  // back button
  fill("#eee");

  noStroke();

  rect(
    20,
    15,
    80,
    36,
    18
  );

  fill("#777");

  textSize(14);

  text(
    "← Back",
    60,
    33
  );

  pop();
}

// ============================================================
// CAMERA SCREEN
// ============================================================

function drawCameraScreen() {

  drawCamera();
}

// ============================================================
// SAVED SCREEN
// ============================================================

function drawSavedScreen() {

  push();

  rectMode(CORNER);

  noStroke();

  // check icon
  fill("#4caf50");

  circle(
    width / 2,
    height * 0.3,
    100
  );

  fill(255);

  textSize(48);

  text(
    "✓",
    width / 2,
    height * 0.3 + 6
  );

  fill("#333");

  textSize(
    min(width * 0.07, 44)
  );

  text(
    "저장 완료!",
    width / 2,
    height * 0.48
  );

  fill("#888");

  textSize(16);

  text(
    "PNG 파일이 다운로드됩니다!",
    width / 2,
    height * 0.56
  );

  // new photo button
  fill("#ff4d6d");

  let bw = min(width * 0.44, 240);

  rect(
    width / 2 - bw / 2,
    height * 0.66,
    bw,
    52,
    26
  );

  fill(255);

  textSize(22);

  text(
    "📷 새로 촬영",
    width / 2,
    height * 0.66 + 26
  );

  // home button
  fill("#eee");

  rect(
    width / 2 - bw / 2,
    height * 0.66 + 66,
    bw,
    46,
    23
  );

  fill("#555");

  textSize(18);

  text(
    "🏠 처음으로",
    width / 2,
    height * 0.66 + 89
  );

  pop();
}

// ============================================================
// CAMERA SCREEN WRAPPER
// ============================================================

function drawCameraScreen() {

  drawCamera();
}

// ============================================================
// MOUSE / TOUCH
// ============================================================

function mousePressed() {

  handleButtons();
}

function touchStarted() {

  handleButtons();

  return false;
}

// ============================================================
// BUTTON HANDLER
// ============================================================

function handleButtons() {

  // =========================================================
  // START
  // =========================================================

  if (currentScreen === "start") {

    let bw = min(width * 0.44, 260);

    let bx = width / 2 - bw / 2;

    let by = height * 0.72 - 30;

    if (
      mouseX > bx &&
      mouseX < bx + bw &&
      mouseY > by &&
      mouseY < by + 60
    ) {

      currentScreen = "settings";
    }
  }

  // =========================================================
  // SETTINGS
  // =========================================================

  else if (currentScreen === "settings") {

    // back
    if (
      mouseX > 20 &&
      mouseX < 100 &&
      mouseY > 15 &&
      mouseY < 51
    ) {

      currentScreen = "start";

      return;
    }

    // frame select
    let frameSize = min(width * 0.15, 80);

    let frameGap = min(width * 0.04, 20);

    let frameTotal =
      frameSize * frameNames.length +
      frameGap * (frameNames.length - 1);

    let frameStart =
      width / 2 - frameTotal / 2;

    for (let i = 0; i < frameNames.length; i++) {

      let bx =
        frameStart + i * (frameSize + frameGap);

      if (
        mouseX > bx &&
        mouseX < bx + frameSize &&
        mouseY > 125 &&
        mouseY < 125 + frameSize
      ) {

        selectedFrame = i;

        return;
      }
    }

    // filter select
    let filterSize = min(width * 0.15, 80);

    let filterGap = min(width * 0.04, 20);

    let filterTotal =
      filterSize * filterEmoji.length +
      filterGap * (filterEmoji.length - 1);

    let filterStart =
      width / 2 - filterTotal / 2;

    for (let i = 0; i < filterEmoji.length; i++) {

      let bx =
        filterStart + i * (filterSize + filterGap);

      if (
        mouseX > bx &&
        mouseX < bx + filterSize &&
        mouseY > 275 &&
        mouseY < 275 + filterSize
      ) {

        selectedFilter = i;

        return;
      }
    }

    // start camera
    let bw = min(width * 0.6, 320);

    let bx = width / 2 - bw / 2;

    if (
      mouseX > bx &&
      mouseX < bx + bw &&
      mouseY > height - 90 &&
      mouseY < height - 28
    ) {

      currentScreen = "camera";
    }
  }

  // =========================================================
  // CAMERA
  // =========================================================

  else if (currentScreen === "camera") {

    handleCameraButtons();
  }

  // =========================================================
  // RESULT
  // =========================================================

  else if (currentScreen === "result") {

    handleResultButtons();
  }

  // =========================================================
  // SAVED
  // =========================================================

  else if (currentScreen === "saved") {

    let bw = min(width * 0.44, 240);

    let bx = width / 2 - bw / 2;

    // new photo
    if (
      mouseX > bx &&
      mouseX < bx + bw &&
      mouseY > height * 0.66 &&
      mouseY < height * 0.66 + 52
    ) {

      capturedPhotos = [];

      currentScreen = "camera";
    }

    // home
    if (
      mouseX > bx &&
      mouseX < bx + bw &&
      mouseY > height * 0.66 + 66 &&
      mouseY < height * 0.66 + 112
    ) {

      capturedPhotos = [];

      currentScreen = "start";
    }
  }
}

// ============================================================
// KEYBOARD
// ============================================================

function keyPressed() {

  // space
  if (key === " ") {

    if (currentScreen === "start") {

      currentScreen = "settings";
    }

    else if (
      currentScreen === "camera" &&
      !isCapturing
    ) {

      startPhotoSequence();
    }
  }

  // save
  if (
    key === "s" ||
    key === "S"
  ) {

    if (currentScreen === "result") {

      saveResultCanvas();
    }
  }

  // retake
  if (
    key === "r" ||
    key === "R"
  ) {

    if (currentScreen === "result") {

      capturedPhotos = [];

      currentScreen = "camera";
    }
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

  if (video) {

    video.size(
      windowWidth,
      windowHeight
    );
  }
}
