// ============================================================
// sketch.js — Main p5.js entry point
// 틀레우바이 아야у름 담당 (UI flow, camera, state control)
// ar-filter.js (Tamy) 함수를 호출하여 AR 필터 적용
// ============================================================

let cam;
let state         = "start";    // "start" | "settings" | "camera" | "result"
let selectedFrame = 0;
let selectedFilter= 0;

// Photo capture
let photos        = [];
let flashAlpha    = 0;
let counting      = false;
let countdownStart= 0;
let photoJustTaken= false;

// Frame / Filter data arrays (배열 사용 — 인덱스로 접근)
let frameNames    = ["Pink", "Mint", "Yellow", "Lavender"];
let frameColors   = ["#ffb6c1", "#b2f0e8", "#fff59d", "#e1bee7"];
let frameDark     = ["#f48fb1", "#80cbc4", "#f9a825", "#ce93d8"];
let filterNames   = ["🐱 Cat", "🐰 Rabbit", "👓 Glasses", "👑 Crown"];

// ============================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();

  // Initialize MediaPipe FaceMesh (ar-filter.js)
  initFaceMesh(cam);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ============================================================
function draw() {
  background("#f6f1ff");

  if      (state === "start")    drawStart();
  else if (state === "settings") drawSettings();
  else if (state === "camera")   drawCamera();
  else if (state === "result")   drawResult();
}

// ============================================================
// SCREEN 1: START
// ============================================================
function drawStart() {
  push();
  textAlign(CENTER, CENTER);
  noStroke();

  // Decorative circles (배열 .length 사용)
  for (let i = 0; i < frameColors.length; i++) {
    push();
    fill(frameColors[i] + "88");
    noStroke();
    let cx = (i % 3) * (width / 2.5) + width / 8;
    let cy = i < 2 ? height * 0.12 : height * 0.88;
    ellipse(cx, cy, 160, 160);
    pop();
  }

  fill("#ff4d6d");
  textSize(68);
  text("📸 4CUT BOOTH", width / 2, height / 2 - 110);

  fill("#999");
  textSize(20);
  text("나만의 인생네컷을 만들어보세요 ✨", width / 2, height / 2 - 55);

  fill("#ff4d6d");
  noStroke();
  rect(width/2 - 130, height/2 - 8, 260, 65, 33);
  fill(255);
  textSize(30);
  text("START  ▶", width / 2, height / 2 + 25);

  pop();
}

// ============================================================
// SCREEN 2: SETTINGS
// ============================================================
function drawSettings() {
  push();
  textAlign(CENTER, CENTER);
  noStroke();

  fill("#333");
  textSize(38);
  text("⚙️  SETTINGS", width / 2, 72);

  // Frame selection
  fill("#666");
  textSize(20);
  text("프레임 선택 (Frame)", width / 2, 138);

  for (let i = 0; i < frameNames.length; i++) {
    push();
    let bx = width/2 - 240 + i * 160;
    let by = 175;
    if (selectedFrame === i) {
      fill(frameDark[i]); stroke(frameDark[i]);
    } else {
      fill("#fff"); stroke("#ddd");
    }
    strokeWeight(2);
    rect(bx - 60, by, 120, 62, 12);
    fill(frameColors[i]); noStroke();
    circle(bx - 22, by + 31, 26);
    fill(selectedFrame === i ? "#fff" : "#333");
    textSize(15);
    text(frameNames[i], bx + 20, by + 32);
    pop();
  }

  // Filter selection
  fill("#666"); noStroke();
  textSize(20);
  text("AR 필터 선택 (Filter)", width / 2, 288);

  for (let i = 0; i < filterNames.length; i++) {
    push();
    let bx = width/2 - 240 + i * 160;
    let by = 318;
    if (selectedFilter === i) {
      fill("#ff4d6d"); stroke("#ff4d6d");
    } else {
      fill("#fff"); stroke("#ddd");
    }
    strokeWeight(2);
    rect(bx - 60, by, 120, 62, 12);
    fill(selectedFilter === i ? "#fff" : "#333"); noStroke();
    textSize(22);
    text(filterNames[i], bx, by + 31);
    pop();
  }

  // Photo count
  push();
  fill("#aaa"); noStroke();
  textSize(15);
  text("이미 촬영된 사진: " + photos.length + " / 4", width / 2, 425);
  pop();

  // Start button
  push();
  fill("#ff4d6d"); noStroke();
  rect(width/2 - 140, height - 132, 280, 62, 31);
  fill(255); textSize(26);
  text("촬영 시작  📷", width / 2, height - 101);
  pop();

  // Back button
  push();
  fill("#eee"); noStroke();
  rectMode(CORNER);
  rect(25, 20, 90, 38, 19);
  fill("#777"); textSize(15);
  text("← BACK", 70, 39);
  pop();

  pop();
}

// ============================================================
// SCREEN 3: CAMERA
// ============================================================
function drawCamera() {
  push();

  let camW = 480;
  let camH = 360;
  let camX = width  / 2;
  let camY = height / 2 - 20;

  // Camera border
  push();
  stroke(frameDark[selectedFrame]);
  strokeWeight(6); noFill();
  rectMode(CENTER);
  rect(camX, camY, camW + 10, camH + 10, 10);
  pop();

  // Camera feed
  push();
  imageMode(CENTER);
  image(cam, camX, camY, camW, camH);
  pop();

  // AR filter (ar-filter.js 의 함수 호출)
  drawARFilter(camX, camY, selectedFilter);

  // Particles (ar-filter.js 의 함수 호출)
  updateParticles();

  // Face status indicator (ar-filter.js)
  drawFaceStatus(width, height);

  // Top title
  push();
  noStroke(); fill("#ff4d6d");
  textAlign(CENTER, CENTER); textSize(26);
  text("📷  4CUT BOOTH", width / 2, 38);
  pop();

  // Progress dots (배열 .length 사용)
  push();
  noStroke();
  for (let i = 0; i < 4; i++) {
    fill(i < photos.length ? frameDark[selectedFrame] : "#ddd");
    circle(width/2 - 45 + i * 30, 70, 16);
  }
  fill("#888"); textAlign(CENTER, CENTER); textSize(13);
  text(photos.length + " / 4 장", width / 2, 88);
  pop();

  // Capture button
  push();
  noStroke();
  fill(counting ? "#ccc" : "#ff4d6d");
  circle(width / 2, height - 65, 76);
  fill(255); textAlign(CENTER, CENTER); textSize(13);
  text("CAPTURE", width / 2, height - 65);
  pop();

  // Back button
  push();
  fill("#eee"); noStroke(); rectMode(CORNER);
  rect(25, 20, 90, 38, 19);
  fill("#777"); textAlign(CENTER, CENTER); textSize(15);
  text("← BACK", 70, 39);
  pop();

  // Keyboard hint
  push();
  fill("#bbb"); noStroke(); textAlign(CENTER, CENTER); textSize(12);
  text("키보드: 1=Cat  2=Rabbit  3=Glasses  4=Crown", width / 2, height - 22);
  pop();

  // Countdown overlay
  if (counting) {
    let elapsed = (millis() - countdownStart) / 1000;
    let current = 3 - floor(elapsed);
    if (current <= 0 && !photoJustTaken) {
      photoJustTaken = true;
      counting = false;
      capturePhoto(camX, camY, camW, camH);
    } else if (current > 0) {
      push();
      noStroke(); fill(255, 50, 100, 190);
      circle(width / 2, camY, 160);
      fill(255); textAlign(CENTER, CENTER); textSize(95);
      text(str(current), width / 2, camY + 10);
      pop();
    }
  }

  // Flash effect
  if (flashAlpha > 0) {
    push();
    noStroke(); fill(255, 255, 255, flashAlpha);
    rectMode(CORNER); rect(0, 0, width, height);
    flashAlpha -= 18;
    if (flashAlpha < 0) flashAlpha = 0;
    pop();
  }

  pop();
}

// ============================================================
// SCREEN 4: RESULT
// ============================================================
function drawResult() {
  push();
  textAlign(CENTER, CENTER); noStroke();

  fill("#333"); textSize(34);
  text("✨  나의 인생네컷", width / 2, 50);

  let stripW = 200;
  let photoH = 120;
  let gap    = 8;
  let stripH = photoH * 4 + gap * 5;
  let stripX = width / 2 - stripW / 2;
  let stripY = 80;

  // Frame
  fill(frameColors[selectedFrame]);
  stroke(frameDark[selectedFrame]); strokeWeight(3);
  rectMode(CORNER);
  rect(stripX - 14, stripY - 14, stripW + 28, stripH + 28, 12);

  // Photos (배열 .length 사용)
  for (let i = 0; i < photos.length; i++) {
    push();
    imageMode(CORNER);
    image(photos[i], stripX, stripY + gap + i * (photoH + gap), stripW, photoH);
    pop();
  }
  for (let i = photos.length; i < 4; i++) {
    push();
    fill("#e0e0e0"); noStroke(); rectMode(CORNER);
    rect(stripX, stripY + gap + i * (photoH + gap), stripW, photoH, 4);
    fill("#aaa"); textAlign(CENTER, CENTER); textSize(13);
    text("사진 없음", stripX + stripW/2, stripY + gap + i*(photoH+gap) + photoH/2);
    pop();
  }

  // Date
  push();
  noStroke(); fill("#888"); textSize(12);
  let d = new Date();
  text(d.getFullYear() + "." + nf(d.getMonth()+1,2) + "." + nf(d.getDate(),2),
       width/2, stripY + stripH + 6);
  pop();

  // Save button
  push();
  fill("#ff4d6d"); noStroke();
  rect(width/2 - 120, height - 145, 240, 55, 28);
  fill(255); textSize(22);
  text("💾  저장하기", width / 2, height - 117);
  pop();

  // Retake button
  push();
  fill("#eee"); noStroke();
  rect(width/2 - 120, height - 80, 240, 48, 24);
  fill("#555"); textSize(20);
  text("🔄  다시 찍기", width / 2, height - 56);
  pop();

  pop();
}

// ============================================================
// CAPTURE
// ============================================================
function startCountdown() {
  if (!counting && photos.length < 4) {
    counting        = true;
    photoJustTaken  = false;
    countdownStart  = millis();
  }
}

function capturePhoto(camX, camY, camW, camH) {
  flashAlpha = 255;
  let shot = get(camX - camW/2, camY - camH/2, camW, camH);
  photos.push(shot);
  if (photos.length >= 4) {
    setTimeout(() => { state = "result"; }, 700);
  }
}

// ============================================================
// MOUSE
// ============================================================
function mousePressed() {
  if (state === "start") {
    let bx = width/2 - 130, by = height/2 - 8;
    if (mouseX > bx && mouseX < bx+260 && mouseY > by && mouseY < by+65)
      state = "settings";
  }

  else if (state === "settings") {
    if (mouseX > 25 && mouseX < 115 && mouseY > 20 && mouseY < 58) {
      state = "start"; return;
    }
    for (let i = 0; i < frameNames.length; i++) {
      let bx = width/2 - 240 + i*160 - 60;
      if (mouseX > bx && mouseX < bx+120 && mouseY > 175 && mouseY < 237)
        selectedFrame = i;
    }
    for (let i = 0; i < filterNames.length; i++) {
      let bx = width/2 - 240 + i*160 - 60;
      if (mouseX > bx && mouseX < bx+120 && mouseY > 318 && mouseY < 380)
        selectedFilter = i;
    }
    if (mouseX > width/2-140 && mouseX < width/2+140 &&
        mouseY > height-132  && mouseY < height-70)
      state = "camera";
  }

  else if (state === "camera") {
    if (mouseX > 25 && mouseX < 115 && mouseY > 20 && mouseY < 58) {
      state = "settings"; return;
    }
    if (dist(mouseX, mouseY, width/2, height-65) < 38 && !counting)
      startCountdown();
  }

  else if (state === "result") {
    if (mouseX > width/2-120 && mouseX < width/2+120 &&
        mouseY > height-145  && mouseY < height-90)
      saveCanvas("my_4cut", "png");

    if (mouseX > width/2-120 && mouseX < width/2+120 &&
        mouseY > height-80   && mouseY < height-32) {
      photos    = [];
      particles = [];
      state     = "camera";
    }
  }
}

// ============================================================
// KEYBOARD
// ============================================================
function keyPressed() {
  if (key === "1") selectedFilter = 0;
  if (key === "2") selectedFilter = 1;
  if (key === "3") selectedFilter = 2;
  if (key === "4") selectedFilter = 3;
}
