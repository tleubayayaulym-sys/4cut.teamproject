// ============================================================
// camera.js
// ============================================================

let video;
let capturedPhotos = [];
let countdown = 0;
let isCapturing = false;

let _boxX = 0;
let _boxY = 0;
let _boxW = 400;
let _boxH = 300;

function setupCamera() {
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  initFaceMesh(video);
}

function drawCamera() {
  if (!video || video.width === 0) return;

  push();
  rectMode(CORNER);
  textAlign(CENTER, CENTER);

  let camW = min(width * 0.72, 520);
  let camH = camW * 0.72;
  let camX = width / 2 - camW / 2;
  let camY = height * 0.1;

  _boxX = camX;
  _boxY = camY;
  _boxW = camW;
  _boxH = camH;

  // рамка
  push();
  stroke(frameDark[selectedFrame]);
  strokeWeight(5);
  noFill();
  rect(camX - 3, camY - 3, camW + 6, camH + 6, 12);
  pop();

  // видео
  imageMode(CORNER);
  image(video, camX, camY, camW, camH);

  // LIVE badge
  push();
  fill("#ff4d6d"); noStroke();
  rect(camX + 10, camY + 10, 55, 24, 12);
  fill(255); textSize(13);
  text("LIVE", camX + 37, camY + 22);
  pop();

  // фильтр
  drawARFilter(camX + camW / 2, camY + camH / 2, selectedFilter, camW, camH);
  drawFaceStatus(width, height);

  // кнопки фильтров
  let fBtnSize = min(width * 0.07, 44);
  let fBtnX = camX + camW + 14;
  for (let i = 0; i < filterEmoji.length; i++) {
    let by = camY + i * (fBtnSize + 10);
    push();
    if (selectedFilter === i) { fill("#ff4d6d"); stroke("#ff4d6d"); }
    else { fill("#ffffff"); stroke("#ddd"); }
    strokeWeight(2);
    rect(fBtnX, by, fBtnSize, fBtnSize, 10);
    noStroke();
    fill(selectedFilter === i ? "#ffffff" : "#333");
    textSize(fBtnSize * 0.5);
    text(filterEmoji[i], fBtnX + fBtnSize / 2, by + fBtnSize / 2);
    pop();
  }

  // прогресс
  let progY = camY + camH + 22;
  let bSize = min(width * 0.1, 56);
  let bGap = 10;
  let bTotal = bSize * 4 + bGap * 3;
  let bStart = width / 2 - bTotal / 2;
  for (let i = 0; i < 4; i++) {
    let bx = bStart + i * (bSize + bGap);
    push();
    if (i < capturedPhotos.length) {
      fill("#4caf50"); noStroke();
      rect(bx, progY, bSize, bSize, 10);
      fill(255); textSize(22);
      text("✓" + (i + 1), bx + bSize / 2, progY + bSize / 2);
    } else if (i === capturedPhotos.length && isCapturing) {
      fill("#ff4d6d"); noStroke();
      rect(bx, progY, bSize, bSize, 10);
      fill(255); textSize(18);
      text("→" + (i + 1), bx + bSize / 2, progY + bSize / 2);
    } else {
      fill("#eee"); stroke("#ddd"); strokeWeight(2);
      rect(bx, progY, bSize, bSize, 10);
      fill("#aaa"); noStroke(); textSize(20);
      text(str(i + 1), bx + bSize / 2, progY + bSize / 2);
    }
    pop();
  }

  // счётчик
  push();
  fill("#666"); noStroke(); textSize(14);
  text("촬영: " + capturedPhotos.length + " / 4", width / 2, progY + bSize + 18);
  pop();

  // кнопка съёмки
  push();
  fill(isCapturing ? "#ccc" : "#ff4d6d"); noStroke();
  rect(width / 2 - min(width * 0.22, 120), height - 78, min(width * 0.44, 240), 52, 26);
  fill(255); textSize(min(width * 0.04, 26));
  text("촬영하기", width / 2, height - 52);
  pop();

  // обратный отсчёт
  if (countdown > 0) {
    push();
    fill(0, 0, 0, 120); noStroke();
    rect(camX, camY, camW, camH);
    fill(255); stroke("#ff4d6d"); strokeWeight(6);
    textSize(min(camW * 0.35, 160));
    text(countdown, camX + camW / 2, camY + camH / 2);
    pop();
  }

  pop();
}

function handleCameraButtons() {
  let camW = min(width * 0.72, 520);
  let camX = width / 2 - camW / 2;
  let camY = height * 0.1;
  let fBtnSize = min(width * 0.07, 44);
  let fBtnX = camX + camW + 14;

  for (let i = 0; i < filterEmoji.length; i++) {
    let by = camY + i * (fBtnSize + 10);
    if (mouseX > fBtnX && mouseX < fBtnX + fBtnSize &&
        mouseY > by && mouseY < by + fBtnSize) {
      selectedFilter = i;
      return;
    }
  }

  let bw = min(width * 0.44, 240);
  let bx = width / 2 - bw / 2;
  if (!isCapturing && mouseX > bx && mouseX < bx + bw &&
      mouseY > height - 78 && mouseY < height - 26) {
    startPhotoSequence();
  }
}

function startPhotoSequence() {
  if (isCapturing) return;
  capturedPhotos = [];
  isCapturing = true;
  takePhoto(0);
}

function takePhoto(index) {
  if (index >= 4) {
    isCapturing = false;
    currentScreen = "result";
    return;
  }

  countdown = 3;

  let timer = setInterval(() => {
    countdown--;

    if (countdown <= 0) {
      clearInterval(timer);
      countdown = 0;
      flashEffect();

      // захватываем область камеры вместе с фильтром
      let img = get(_boxX, _boxY, _boxW, _boxH);
      capturedPhotos.push(img);

      setTimeout(() => {
        takePhoto(index + 1);
      }, 900);
    }
  }, 1000);
}

function flashEffect() {
  push();
  rectMode(CORNER);
  fill(255); noStroke();
  rect(0, 0, width, height);
  pop();
}
