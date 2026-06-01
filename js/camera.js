// ============================================================
// camera.js — 담당: 틀레우바이 아야으름
// Fullscreen camera (thầy yêu cầu) + countdown + 4컷 촬영
// ============================================================

let video;
let capturedPhotos = [];
let countdown      = 0;
let isCapturing    = false;

// vị trí chụp (fullscreen = toàn canvas)
let _boxX = 0;
let _boxY = 0;
let _boxW = 400;
let _boxH = 400;

// ============================================================
// setupCamera()
// ============================================================
function setupCamera() {
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();
  initFaceMesh(video); // ar-filter.js
}

// ============================================================
// drawCamera() — FULLSCREEN
// ============================================================
function drawCamera() {
  push();
  rectMode(CORNER); textAlign(CENTER, CENTER);

  // --- Camera FULLSCREEN ---
  imageMode(CORNER);
  image(video, 0, 0, width, height);

  // Lưu lại toàn màn hình để chụp
  _boxX = 0; _boxY = 0; _boxW = width; _boxH = height;

  // --- AR filter (ar-filter.js) ---
  drawARFilter(width/2, height/2, selectedFilter, width, height);
  drawFaceStatus(width, height);

  // --- LIVE badge ---
  push();
  fill("#ff4d6d"); noStroke();
  rect(14, 14, 52, 24, 12);
  fill(255); textSize(13);
  text("LIVE", 40, 26);
  pop();

  // --- Filter selector (góc phải) ---
  let fBtnSize = min(width * 0.07, 44);
  let fBtnX    = width - fBtnSize - 12;
  for (let i = 0; i < filterEmoji.length; i++) {
    push();
    let by = 14 + i * (fBtnSize + 8);
    if (selectedFilter === i) {
      fill("#ff4d6d"); stroke("#ff4d6d");
    } else {
      fill(255, 255, 255, 180); stroke("#ddd");
    }
    strokeWeight(2); rect(fBtnX, by, fBtnSize, fBtnSize, 10);
    noStroke(); fill(selectedFilter === i ? "#fff" : "#333");
    textSize(fBtnSize * 0.5);
    text(filterEmoji[i], fBtnX + fBtnSize/2, by + fBtnSize/2);
    pop();
  }

  // --- Progress dots ---
  let dotY = height - 90;
  let dotSize = min(width * 0.045, 28);
  let dotGap  = 10;
  let dotTot  = dotSize * 4 + dotGap * 3;
  let dotSX   = width/2 - dotTot/2;

  for (let i = 0; i < 4; i++) {
    push();
    let dx = dotSX + i * (dotSize + dotGap);
    if (i < capturedPhotos.length) {
      fill("#4caf50"); noStroke();
    } else if (i === capturedPhotos.length && isCapturing) {
      fill("#ff4d6d"); noStroke();
    } else {
      fill(255, 255, 255, 150); stroke("#ddd"); strokeWeight(2);
    }
    circle(dx + dotSize/2, dotY, dotSize);
    fill(255); noStroke(); textSize(dotSize * 0.5);
    if (i < capturedPhotos.length) text("✓", dx + dotSize/2, dotY);
    else text(str(i+1), dx + dotSize/2, dotY);
    pop();
  }

  // --- 촬영 버튼 ---
  push();
  fill(isCapturing ? 200 : "#ff4d6d"); noStroke();
  circle(width/2, height - 42, 58);
  fill(255); noStroke(); textSize(13);
  text("촬영", width/2, height - 42);
  pop();

  // --- Back ---
  push();
  fill(255, 255, 255, 180); noStroke(); rectMode(CORNER);
  rect(14, height - 58, 72, 32, 16);
  fill("#555"); textSize(13);
  text("← Back", 50, height - 42);
  pop();

  // --- Hand gesture hint ---
  push();
  fill(0, 0, 0, 100); noStroke();
  rect(0, height - 28, width, 28);
  fill(255); textSize(12);
  text("👌  엄지+검지 터치 = 촬영", width/2, height - 14);
  pop();

  // --- Countdown overlay ---
  if (countdown > 0) {
    push();
    fill(0, 0, 0, 140); noStroke(); rect(0, 0, width, height);
    fill(255); stroke("#ff4d6d"); strokeWeight(8);
    textSize(min(width*0.35, 200));
    text(str(countdown), width/2, height/2);
    pop();
  }

  pop();
}

// ============================================================
// handleCameraButtons()
// ============================================================
function handleCameraButtons() {
  // Back
  if (mouseX>14 && mouseX<86 && mouseY>height-58 && mouseY<height-26) {
    currentScreen = "settings"; return;
  }
  // Filter buttons
  let fBtnSize = min(width*0.07, 44);
  let fBtnX    = width - fBtnSize - 12;
  for (let i = 0; i < filterEmoji.length; i++) {
    let by = 14 + i * (fBtnSize + 8);
    if (mouseX>fBtnX && mouseX<fBtnX+fBtnSize && mouseY>by && mouseY<by+fBtnSize) {
      selectedFilter = i; return;
    }
  }
  // 촬영 버튼
  if (!isCapturing && dist(mouseX, mouseY, width/2, height-42) < 29)
    startPhotoSequence();
}

// ============================================================
// startPhotoSequence() + takePhoto()
// ============================================================
function startPhotoSequence() {
  if (isCapturing) return;
  capturedPhotos = [];
  isCapturing    = true;
  takePhoto(0);
}

function takePhoto(index) {
  if (index >= 4) {
    isCapturing = false; currentScreen = "result"; return;
  }
  countdown = 3;
  let timer = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(timer);
      countdown = 0;
      // Đợi 1 frame để countdown biến mất rồi mới chụp
      setTimeout(() => {
        let img = get(_boxX, _boxY, _boxW, _boxH);
        capturedPhotos.push(img);
        flashEffect();
        setTimeout(() => { takePhoto(index + 1); }, 600);
      }, 50);
    }
  }, 1000);
}

function flashEffect() {
  push(); fill(255); noStroke(); rectMode(CORNER);
  rect(0, 0, width, height); pop();
}
