// ============================================================
// main.js — 담당: 틀레우바이 아야으름
// Quản lý trạng thái app + chuyển màn hình
// Màn hình: start → settings → camera → result → saved
// ============================================================

// --- Trạng thái toàn cục ---
let currentScreen  = "start";
let selectedFrame  = 0; // 0=Pink 1=Mint 2=Yellow 3=Lavender
let selectedFilter = 0; // 0=Cat 1=Rabbit 2=Glasses 3=Crown

// --- Dữ liệu frame (배열 사용) ---
let frameNames  = ["Pink", "Mint", "Yellow", "Lavender"];
let frameColors = ["#ffb6c1", "#b2f0e8", "#fff59d", "#e1bee7"];
let frameDark   = ["#f48fb1", "#80cbc4", "#f9a825", "#ce93d8"];

// --- Dữ liệu filter (배열 사용) ---
let filterEmoji = ["🐱", "🐰", "👓", "👑"];
let filterLabel = ["Cat", "Rabbit", "Glasses", "Crown"];

// ============================================================
// setup() + draw()
// ============================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  setupCamera(); // camera.js
}

function draw() {
  background("#f6f1ff");
  if      (currentScreen === "start")    drawStartScreen();
  else if (currentScreen === "settings") drawSettingsScreen();
  else if (currentScreen === "camera")   drawCameraScreen();
  else if (currentScreen === "result")   drawResultScreen();
  else if (currentScreen === "saved")    drawSavedScreen();
}

// ============================================================
// SCREEN 1: START
// ============================================================
function drawStartScreen() {
  push();
  rectMode(CORNER); noStroke();

  // Trang trí background
  for (let i = 0; i < frameColors.length; i++) {
    push();
    fill(frameColors[i] + "66");
    circle(
      (i % 2 === 0 ? width * 0.1 : width * 0.9),
      (i < 2 ? height * 0.15 : height * 0.85),
      200
    );
    pop();
  }

  // Logo
  fill("#ff4d6d");
  textSize(min(width * 0.1, 68));
  text("📸 4CUT BOOTH", width / 2, height * 0.28);

  // Subtitle
  fill("#888");
  textSize(min(width * 0.03, 20));
  text("인생네컷 스타일 웹 포토부스", width / 2, height * 0.37);

  // Preview strip hình minh họa
  push();
  fill("#fff");
  stroke("#eee"); strokeWeight(2);
  rect(width/2 - 42, height * 0.43, 84, 110, 8);
  for (let i = 0; i < 4; i++) {
    fill(frameColors[i]);
    noStroke();
    rect(width/2 - 34, height * 0.43 + 6 + i * 26, 68, 22, 4);
  }
  pop();

  // START button
  fill("#ff4d6d"); noStroke();
  rect(width/2 - min(width*0.22, 130), height*0.72 - 30,
       min(width*0.44, 260), 60, 30);
  fill(255);
  textSize(min(width * 0.05, 32));
  text("▶  START", width / 2, height * 0.72);

  // Hint
  fill("#bbb"); textSize(13);
  text("Space 또는 화면 터치", width / 2, height * 0.72 + 50);

  pop();
}

// ============================================================
// SCREEN 2: SETTINGS
// ============================================================
function drawSettingsScreen() {
  push();
  rectMode(CORNER); noStroke();

  // Tiêu đề
  fill("#ff4d6d");
  textSize(min(width * 0.05, 34));
  text("⚙️  Settings", width / 2, 55);

  // --- Chọn Frame ---
  fill("#444"); textSize(18);
  textAlign(LEFT, CENTER);
  text("▶  프레임 선택", width * 0.08, 105);

  let fBoxSize = min(width * 0.15, 80);
  let fGap     = min(width * 0.04, 20);
  let fTotal   = fBoxSize * frameNames.length + fGap * (frameNames.length - 1);
  let fStartX  = width / 2 - fTotal / 2;

  for (let i = 0; i < frameNames.length; i++) {
    push();
    let bx = fStartX + i * (fBoxSize + fGap);
    let by = 125;
    if (selectedFrame === i) {
      stroke(frameDark[i]); strokeWeight(4);
    } else {
      stroke("#ddd"); strokeWeight(2);
    }
    fill(frameColors[i]);
    rect(bx, by, fBoxSize, fBoxSize, 12);
    noStroke(); fill(selectedFrame === i ? frameDark[i] : "#666");
    textAlign(CENTER, CENTER); textSize(12);
    text(frameNames[i], bx + fBoxSize/2, by + fBoxSize + 12);
    pop();
  }

  // --- Chọn Filter ---
  fill("#444"); noStroke(); textSize(18);
  textAlign(LEFT, CENTER);
  text("▶  AR 필터 선택", width * 0.08, 255);

  let filtBoxSize = min(width * 0.15, 80);
  let filtGap     = min(width * 0.04, 20);
  let filtTotal   = filtBoxSize * filterEmoji.length + filtGap * (filterEmoji.length - 1);
  let filtStartX  = width / 2 - filtTotal / 2;

  for (let i = 0; i < filterEmoji.length; i++) {
    push();
    let bx = filtStartX + i * (filtBoxSize + filtGap);
    let by = 275;
    if (selectedFilter === i) {
      stroke("#ff4d6d"); strokeWeight(4);
    } else {
      stroke("#ddd"); strokeWeight(2);
    }
    fill("#fff");
    rect(bx, by, filtBoxSize, filtBoxSize, 12);
    noStroke(); fill("#333");
    textAlign(CENTER, CENTER); textSize(32);
    text(filterEmoji[i], bx + filtBoxSize/2, by + filtBoxSize/2);
    textSize(11); fill("#666");
    text(filterLabel[i], bx + filtBoxSize/2, by + filtBoxSize + 12);
    pop();
  }

  // --- Nút 촬영 시작 ---
  fill("#ff4d6d"); noStroke();
  rect(width/2 - min(width*0.3, 160), height - 90,
       min(width*0.6, 320), 62, 31);
  fill(255); textAlign(CENTER, CENTER);
  textSize(min(width * 0.045, 28));
  text("촬영 시작  📷", width / 2, height - 59);

  // --- Back ---
  fill("#eee"); noStroke();
  rect(20, 15, 80, 36, 18);
  fill("#777"); textSize(14);
  text("← Back", 60, 33);

  pop();
}

// ============================================================
// SCREEN 3: CAMERA — gọi camera.js
// ============================================================
function drawCameraScreen() {
  drawCamera(); // camera.js
}

// ============================================================
// SCREEN 5: SAVED
// ============================================================
function drawSavedScreen() {
  push();
  rectMode(CORNER); noStroke();

  // Check xanh
  fill("#4caf50");
  circle(width / 2, height * 0.3, 100);
  fill(255); textSize(48);
  text("✓", width / 2, height * 0.3 + 6);

  fill("#333"); textSize(min(width * 0.07, 44));
  text("저장 완료!", width / 2, height * 0.48);

  fill("#888"); textSize(16);
  text("PNG 파일이 자동 다운로드됩니다!", width / 2, height * 0.56);

  // Nút 새로 촬영
  fill("#ff4d6d"); noStroke();
  rect(width/2 - min(width*0.22, 120), height * 0.66,
       min(width*0.44, 240), 52, 26);
  fill(255); textSize(22);
  text("📷  새로 촬영", width / 2, height * 0.66 + 26);

  // Nút 처음으로
  fill("#eee"); noStroke();
  rect(width/2 - min(width*0.22, 120), height * 0.66 + 66,
       min(width*0.44, 240), 46, 23);
  fill("#555"); textSize(18);
  text("🏠  처음으로", width / 2, height * 0.66 + 89);

  pop();
}

// ============================================================
// MOUSE + TOUCH
// ============================================================
function mousePressed() {
  handleButtons();
}

function touchStarted() {
  handleButtons();
  return false;
}

function handleButtons() {
  // START screen
  if (currentScreen === "start") {
    let bw = min(width*0.44, 260);
    let bx = width/2 - bw/2;
    let by = height*0.72 - 30;
    if (mouseX > bx && mouseX < bx + bw &&
        mouseY > by && mouseY < by + 60) {
      currentScreen = "settings";
    }
  }

  // SETTINGS screen
  else if (currentScreen === "settings") {
    // Back
    if (mouseX > 20 && mouseX < 100 && mouseY > 15 && mouseY < 51) {
      currentScreen = "start";
      return;
    }
    // Chọn frame
    let fBoxSize = min(width * 0.15, 80);
    let fGap     = min(width * 0.04, 20);
    let fTotal   = fBoxSize * frameNames.length + fGap * (frameNames.length - 1);
    let fStartX  = width / 2 - fTotal / 2;
    for (let i = 0; i < frameNames.length; i++) {
      let bx = fStartX + i * (fBoxSize + fGap);
      if (mouseX > bx && mouseX < bx + fBoxSize &&
          mouseY > 125 && mouseY < 125 + fBoxSize) {
        selectedFrame = i;
        return;
      }
    }
    // Chọn filter
    let filtBoxSize = min(width * 0.15, 80);
    let filtGap     = min(width * 0.04, 20);
    let filtTotal   = filtBoxSize * filterEmoji.length + filtGap * (filterEmoji.length - 1);
    let filtStartX  = width / 2 - filtTotal / 2;
    for (let i = 0; i < filterEmoji.length; i++) {
      let bx = filtStartX + i * (filtBoxSize + filtGap);
      if (mouseX > bx && mouseX < bx + filtBoxSize &&
          mouseY > 275 && mouseY < 275 + filtBoxSize) {
        selectedFilter = i;
        return;
      }
    }
    // 촬영 시작
    let bw = min(width*0.6, 320);
    let bx = width/2 - bw/2;
    if (mouseX > bx && mouseX < bx + bw &&
        mouseY > height - 90 && mouseY < height - 28) {
      currentScreen = "camera";
    }
  }

  // CAMERA screen
  else if (currentScreen === "camera") {
    handleCameraButtons(); // camera.js
  }

  // RESULT screen
  else if (currentScreen === "result") {
    handleResultButtons(); // result.js
  }

  // SAVED screen
  else if (currentScreen === "saved") {
    let bw = min(width*0.44, 240);
    let bx = width/2 - bw/2;
    // 새로 촬영
    if (mouseX > bx && mouseX < bx + bw &&
        mouseY > height*0.66 && mouseY < height*0.66 + 52) {
      capturedPhotos = [];
      currentScreen  = "camera";
    }
    // 처음으로
    if (mouseX > bx && mouseX < bx + bw &&
        mouseY > height*0.66 + 66 && mouseY < height*0.66 + 112) {
      capturedPhotos = [];
      currentScreen  = "start";
    }
  }
}

// KEYBOARD
function keyPressed() {
  // Space: start / chụp
  if (key === ' ') {
    if      (currentScreen === "start")    currentScreen = "settings";
    else if (currentScreen === "camera")   startPhotoSequence();
  }
  // S: save
  if (key === 's' || key === 'S') {
    if (currentScreen === "result") saveResultCanvas();
  }
  // R: retake
  if (key === 'r' || key === 'R') {
    if (currentScreen === "result") {
      capturedPhotos = [];
      currentScreen  = "camera";
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (video) video.size(windowWidth, windowHeight);
}
