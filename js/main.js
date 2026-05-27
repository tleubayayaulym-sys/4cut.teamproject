// ============================================================
// main.js — 담당: 틀레우바이 아야으름
// 글로벌 앱 상태 제어 및 화면 전환 로직
// ============================================================

let currentScreen = "start";

// setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  setupCamera();
  textAlign(CENTER, CENTER);
}

// draw
function draw() {
  background("#f6f1ff");

  if (currentScreen === "start") {
    drawStartScreen();
  }
  else if (currentScreen === "camera") {
    drawCamera();
    drawCameraButton();
  }
  else if (currentScreen === "result") {
    drawResultScreen();
  }
}

// 시작 화면
function drawStartScreen() {
  background("#f6f1ff");
  rectMode(CORNER);

  fill("#ff4d6d");
  noStroke();
  textSize(min(width * 0.1, 70));
  text("4CUT BOOTH", width / 2, height * 0.22);

  fill("#666");
  textSize(min(width * 0.03, 24));
  text("포토부스 촬영", width / 2, height * 0.32);

  fill("#ff4d6d");
  rect(width/2 - width*0.21, height*0.62 - 40, width*0.42, 80, 25);
  fill(255);
  textSize(min(width * 0.05, 36));
  text("시작하기", width / 2, height * 0.62);
}

// 촬영 버튼
function drawCameraButton() {
  rectMode(CORNER);
  fill("#ff4d6d");
  noStroke();
  rect(width/2 - width*0.2, height - 75, width*0.4, 55, 20);
  fill(255);
  textSize(min(width * 0.045, 30));
  text("촬영하기", width / 2, height - 48);
}

// mouse
function mousePressed() {
  handleButtons();
}

// touch
function touchStarted() {
  handleButtons();
  return false;
}

// button logic
function handleButtons() {
  // 시작하기
  if (currentScreen === "start" &&
      mouseX > width/2 - width*0.21 &&
      mouseX < width/2 + width*0.21 &&
      mouseY > height*0.62 - 40 &&
      mouseY < height*0.62 + 40) {
    currentScreen = "camera";
  }

  // 촬영하기
  else if (currentScreen === "camera" &&
      mouseX > width/2 - width*0.2 &&
      mouseX < width/2 + width*0.2 &&
      mouseY > height - 75 &&
      mouseY < height - 20) {
    startPhotoSequence();
  }

  // result 화면 버튼 (result.js 에서 처리)
  else if (currentScreen === "result") {
    handleResultButtons();
  }
}

// resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (video) {
    video.size(windowWidth, windowHeight);
  }
}
