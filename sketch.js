let cam;
let state = "start"; // "start" | "settings" | "camera" | "result"
let selectedFrame = 0;
let selectedFilter = 0;

// ---------- Photo Capture ----------
let photos = [];           // array of captured images (max 4)
let flashAlpha = 0;
let counting = false;
let countdownStart = 0;
let photoJustTaken = false;

// ---------- Particles ----------
let particles = [];

// ---------- Frame & Filter Data (배열 사용) ----------
let frameNames  = ["Pink", "Mint", "Yellow", "Lavender"];
let frameColors = ["#ffb6c1", "#b2f0e8", "#fff59d", "#e1bee7"];
let frameDark   = ["#f48fb1", "#80cbc4", "#f9a825", "#ce93d8"];
let filterNames = ["🐱 Cat", "🐰 Rabbit", "👓 Glasses", "👑 Crown"];

// ============================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();
  imageMode(CENTER);
  textFont("sans-serif");
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

  // Background decoration circles
  for (let i = 0; i < 6; i++) {
    push();
    noStroke();
    fill(frameColors[i % frameColors.length] + "88");
    let cx = (i % 3) * (width / 2) + width / 6;
    let cy = i < 3 ? height * 0.15 : height * 0.85;
    ellipse(cx, cy, 180, 180);
    pop();
  }

  // Title
  fill("#ff4d6d");
  textSize(72);
  text("📸 4CUT BOOTH", width / 2, height / 2 - 110);

  // Subtitle
  fill("#999");
  textSize(20);
  text("나만의 인생네컷을 만들어보세요 ✨", width / 2, height / 2 - 55);

  // START button
  fill("#ff4d6d");
  rect(width / 2 - 130, height / 2 - 5, 260, 65, 33);
  fill(255);
  textSize(30);
  text("START  ▶", width / 2, height / 2 + 28);

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
  text("⚙️  SETTINGS", width / 2, 75);

  // --- Frame selection ---
  fill("#666");
  textSize(20);
  text("프레임 선택 (Frame)", width / 2, 140);

  for (let i = 0; i < frameNames.length; i++) {
    push();
    let bx = width / 2 - 240 + i * 160;
    let by = 175;
    // Button background
    if (selectedFrame === i) {
      fill(frameDark[i]);
      stroke(frameDark[i]);
    } else {
      fill("#fff");
      stroke("#ddd");
    }
    strokeWeight(2);
    rect(bx - 60, by, 120, 65, 12);
    // Color dot
    fill(frameColors[i]);
    noStroke();
    circle(bx - 22, by + 32, 26);
    // Label
    fill(selectedFrame === i ? "#fff" : "#333");
    textSize(15);
    text(frameNames[i], bx + 20, by + 33);
    pop();
  }

  // --- Filter selection ---
  fill("#666");
  noStroke();
  textSize(20);
  text("AR 필터 선택 (Filter)", width / 2, 290);

  for (let i = 0; i < filterNames.length; i++) {
    push();
    let bx = width / 2 - 240 + i * 160;
    let by = 320;
    if (selectedFilter === i) {
      fill("#ff4d6d");
      stroke("#ff4d6d");
    } else {
      fill("#fff");
      stroke("#ddd");
    }
    strokeWeight(2);
    rect(bx - 60, by, 120, 65, 12);
    fill(selectedFilter === i ? "#fff" : "#333");
    noStroke();
    textSize(22);
    text(filterNames[i], bx, by + 33);
    pop();
  }

  // --- Photo count info ---
  push();
  fill("#aaa");
  noStroke();
  textSize(15);
  text("이미 촬영된 사진: " + photos.length + " / 4", width / 2, 430);
  pop();

  // --- START SHOOTING button ---
  push();
  fill("#ff4d6d");
  noStroke();
  rect(width / 2 - 140, height - 135, 280, 65, 33);
  fill(255);
  textSize(26);
  text("촬영 시작  📷", width / 2, height - 102);
  pop();

  // --- BACK to reset ---
  push();
  fill("#eee");
  noStroke();
  rect(30, 20, 90, 38, 19);
  fill("#777");
  textSize(15);
  text("← BACK", 75, 39);
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
  let camX = width / 2;
  let camY = height / 2 - 20;

  // Camera frame border
  push();
  stroke(frameDark[selectedFrame]);
  strokeWeight(6);
  noFill();
  rectMode(CENTER);
  rect(camX, camY, camW + 10, camH + 10, 10);
  pop();

  // Camera feed
  push();
  imageMode(CENTER);
  image(cam, camX, camY, camW, camH);
  pop();

  // AR filter overlay (위치: 카메라 중심 기준)
  drawARFilter(camX, camY - 30, selectedFilter);

  // Particles
  updateParticles();

  // --- Top bar ---
  push();
  noStroke();
  fill("#ff4d6d");
  textAlign(CENTER, CENTER);
  textSize(26);
  text("📷  4CUT BOOTH", width / 2, 38);
  pop();

  // --- Photo progress dots ---
  push();
  noStroke();
  for (let i = 0; i < 4; i++) {
    if (i < photos.length) fill(frameDark[selectedFrame]);
    else fill("#ddd");
    circle(width / 2 - 45 + i * 30, 72, 16);
  }
  fill("#888");
  textAlign(CENTER, CENTER);
  textSize(13);
  text(photos.length + " / 4 장", width / 2, 90);
  pop();

  // --- Capture button ---
  push();
  noStroke();
  if (!counting) fill("#ff4d6d");
  else fill("#ccc");
  circle(width / 2, height - 65, 76);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(13);
  text("CAPTURE", width / 2, height - 65);
  pop();

  // --- Back button ---
  push();
  fill("#eee");
  noStroke();
  rectMode(CORNER);
  rect(25, 20, 90, 38, 19);
  fill("#777");
  textAlign(CENTER, CENTER);
  textSize(15);
  text("← BACK", 70, 39);
  pop();

  // --- Keyboard hint ---
  push();
  fill("#bbb");
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  text("키보드: 1=Cat  2=Rabbit  3=Glasses  4=Crown", width / 2, height - 22);
  pop();

  // --- Countdown overlay ---
  if (counting) {
    let elapsed = (millis() - countdownStart) / 1000;
    let current = 3 - floor(elapsed);

    if (current <= 0 && !photoJustTaken) {
      photoJustTaken = true;
      counting = false;
      capturePhoto();
    } else if (current > 0) {
      push();
      noStroke();
      fill(255, 50, 100, 190);
      circle(width / 2, camY, 170);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(100);
      text(str(current), width / 2, camY + 12);
      pop();
    }
  }

  // --- Flash effect ---
  if (flashAlpha > 0) {
    push();
    noStroke();
    fill(255, 255, 255, flashAlpha);
    rectMode(CORNER);
    rect(0, 0, width, height);
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
  textAlign(CENTER, CENTER);
  noStroke();

  fill("#333");
  textSize(34);
  text("✨  나의 인생네컷", width / 2, 50);

  // 4-cut strip
  let stripW = 200;
  let photoH = 120;
  let gap    = 8;
  let stripH = photoH * 4 + gap * 5;
  let stripX = width / 2 - stripW / 2;
  let stripY = 80;

  // Frame background
  fill(frameColors[selectedFrame]);
  stroke(frameDark[selectedFrame]);
  strokeWeight(3);
  rectMode(CORNER);
  rect(stripX - 14, stripY - 14, stripW + 28, stripH + 28, 12);

  // Photos
  for (let i = 0; i < photos.length; i++) {
    push();
    imageMode(CORNER);
    image(photos[i], stripX, stripY + gap + i * (photoH + gap), stripW, photoH);
    pop();
  }

  // Empty slots
  for (let i = photos.length; i < 4; i++) {
    push();
    fill("#e0e0e0");
    noStroke();
    rectMode(CORNER);
    rect(stripX, stripY + gap + i * (photoH + gap), stripW, photoH, 4);
    fill("#aaa");
    textAlign(CENTER, CENTER);
    textSize(13);
    text("사진 없음", stripX + stripW / 2, stripY + gap + i * (photoH + gap) + photoH / 2);
    pop();
  }

  // Date stamp
  push();
  noStroke();
  fill("#888");
  textSize(12);
  let d = new Date();
  let dateStr = d.getFullYear() + "." + nf(d.getMonth() + 1, 2) + "." + nf(d.getDate(), 2);
  text(dateStr, width / 2, stripY + stripH + 5);
  pop();

  // --- Save button ---
  push();
  noStroke();
  fill("#ff4d6d");
  rect(width / 2 - 120, height - 145, 240, 55, 28);
  fill(255);
  textSize(22);
  text("💾  저장하기", width / 2, height - 117);
  pop();

  // --- Retake button ---
  push();
  noStroke();
  fill("#eee");
  rect(width / 2 - 120, height - 80, 240, 48, 24);
  fill("#555");
  textSize(20);
  text("🔄  다시 찍기", width / 2, height - 56);
  pop();

  pop();
}

// ============================================================
// AR FILTERS (push/pop 필수 적용)
// ============================================================
function drawARFilter(x, y, filterType) {
  if      (filterType === 0) drawCatFilter(x, y);
  else if (filterType === 1) drawRabbitFilter(x, y);
  else if (filterType === 2) drawGlassesFilter(x, y);
  else if (filterType === 3) drawCrownFilter(x, y);
}

// 🐱 Cat Filter
function drawCatFilter(x, y) {
  push();
  // Ears
  fill("#ffb6c1");
  stroke("#cc7788");
  strokeWeight(2);
  triangle(x - 115, y - 115, x - 80, y - 205, x - 40, y - 115);
  triangle(x + 40,  y - 115, x + 80, y - 205, x + 115, y - 115);
  // Inner ears
  fill("#ff9ab0");
  noStroke();
  triangle(x - 104, y - 122, x - 80, y - 190, x - 52, y - 122);
  triangle(x + 52,  y - 122, x + 80, y - 190, x + 104, y - 122);
  // Whiskers
  stroke("#888");
  strokeWeight(1.5);
  line(x - 90, y + 18, x - 185, y + 5);
  line(x - 90, y + 33, x - 185, y + 33);
  line(x - 90, y + 48, x - 185, y + 58);
  line(x + 90, y + 18, x + 185, y + 5);
  line(x + 90, y + 33, x + 185, y + 33);
  line(x + 90, y + 48, x + 185, y + 58);
  // Nose
  fill("#ff8fab");
  noStroke();
  ellipse(x, y + 22, 16, 12);
  addParticle(x, y, "#ff4d6d");
  pop();
}

// 🐰 Rabbit Filter
function drawRabbitFilter(x, y) {
  push();
  // Outer ears
  fill("#f5e6f5");
  stroke("#d0b0d0");
  strokeWeight(2);
  ellipse(x - 72, y - 195, 58, 175);
  ellipse(x + 72, y - 195, 58, 175);
  // Inner ears
  fill("#ffb6c1");
  noStroke();
  ellipse(x - 72, y - 195, 30, 115);
  ellipse(x + 72, y - 195, 30, 115);
  // Nose
  fill("#ffaabb");
  noStroke();
  ellipse(x, y + 24, 18, 13);
  addParticle(x, y, "#ffd6e8");
  pop();
}

// 👓 Glasses Filter
function drawGlassesFilter(x, y) {
  push();
  noFill();
  stroke("#222");
  strokeWeight(5);
  // Left lens
  rectMode(CORNER);
  rect(x - 103, y - 47, 88, 60, 14);
  // Right lens
  rect(x + 15,  y - 47, 88, 60, 14);
  // Bridge
  line(x - 15, y - 22, x + 15, y - 22);
  // Arms
  line(x - 103, y - 22, x - 135, y - 16);
  line(x + 103, y - 22, x + 135, y - 16);
  addParticle(x, y, "#4cc9f0");
  pop();
}

// 👑 Crown Filter
function drawCrownFilter(x, y) {
  push();
  // Crown body
  fill("#ffd700");
  stroke("#cc9900");
  strokeWeight(2);
  beginShape();
  vertex(x - 115, y - 105);
  vertex(x - 85,  y - 195);
  vertex(x - 42,  y - 128);
  vertex(x,       y - 215);
  vertex(x + 42,  y - 128);
  vertex(x + 85,  y - 195);
  vertex(x + 115, y - 105);
  vertex(x + 115, y - 68);
  vertex(x - 115, y - 68);
  endShape(CLOSE);
  // Gems on crown
  noStroke();
  fill("#ff4d6d");
  circle(x - 68, y - 112, 20);
  fill("#a78bfa");
  circle(x,      y - 148, 20);
  fill("#ff4d6d");
  circle(x + 68, y - 112, 20);
  addParticle(x, y, "#ffd700");
  pop();
}

// ============================================================
// PARTICLES
// ============================================================
function addParticle(x, y, col) {
  if (particles.length < 55) {
    particles.push({
      x:     x + random(-210, 210),
      y:     y + random(-210, 210),
      size:  random(6, 15),
      speed: random(0.5, 2.5),
      col:   col,
      alpha: 210
    });
  }
}

function updateParticles() {
  noStroke();
  for (let i = particles.length - 1; i >= 0; i--) {
    push();
    let p = particles[i];
    fill(p.col);
    circle(p.x, p.y, p.size);
    p.y     -= p.speed;
    p.alpha -= 4;
    pop();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

// ============================================================
// CAPTURE LOGIC
// ============================================================
function startCountdown() {
  if (!counting && photos.length < 4) {
    counting       = true;
    photoJustTaken = false;
    countdownStart = millis();
  }
}

function capturePhoto() {
  flashAlpha = 255;

  // Capture camera area only (카메라 영역만 캡처)
  let camW  = 480;
  let camH  = 360;
  let camX  = width / 2 - camW / 2;
  let camY  = height / 2 - 20 - camH / 2;
  let shot  = get(camX, camY, camW, camH);
  photos.push(shot);

  if (photos.length >= 4) {
    // All 4 taken → result screen after flash
    setTimeout(() => {
      state = "result";
    }, 700);
  }
}

// ============================================================
// MOUSE INTERACTION
// ============================================================
function mousePressed() {

  // --- START screen ---
  if (state === "start") {
    let bx = width / 2 - 130;
    let by = height / 2 - 5;
    if (mouseX > bx && mouseX < bx + 260 && mouseY > by && mouseY < by + 65) {
      state = "settings";
    }
  }

  // --- SETTINGS screen ---
  else if (state === "settings") {
    // Back button
    if (mouseX > 25 && mouseX < 115 && mouseY > 20 && mouseY < 58) {
      state = "start";
      return;
    }
    // Frame buttons
    for (let i = 0; i < frameNames.length; i++) {
      let bx = width / 2 - 240 + i * 160 - 60;
      if (mouseX > bx && mouseX < bx + 120 && mouseY > 175 && mouseY < 240) {
        selectedFrame = i;
      }
    }
    // Filter buttons
    for (let i = 0; i < filterNames.length; i++) {
      let bx = width / 2 - 240 + i * 160 - 60;
      if (mouseX > bx && mouseX < bx + 120 && mouseY > 320 && mouseY < 385) {
        selectedFilter = i;
      }
    }
    // Start shooting button
    if (mouseX > width / 2 - 140 && mouseX < width / 2 + 140 &&
        mouseY > height - 135   && mouseY < height - 70) {
      state = "camera";
    }
  }

  // --- CAMERA screen ---
  else if (state === "camera") {
    // Back button
    if (mouseX > 25 && mouseX < 115 && mouseY > 20 && mouseY < 58) {
      state = "settings";
      return;
    }
    // Capture button (circle, radius=38)
    let d = dist(mouseX, mouseY, width / 2, height - 65);
    if (d < 38 && !counting) {
      startCountdown();
    }
  }

  // --- RESULT screen ---
  else if (state === "result") {
    // Save button
    if (mouseX > width / 2 - 120 && mouseX < width / 2 + 120 &&
        mouseY > height - 145   && mouseY < height - 90) {
      saveCanvas("my_4cut", "png");
    }
    // Retake button
    if (mouseX > width / 2 - 120 && mouseX < width / 2 + 120 &&
        mouseY > height - 80    && mouseY < height - 32) {
      photos    = [];
      particles = [];
      state     = "camera";
    }
  }
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
function keyPressed() {
  if (key === "1") selectedFilter = 0; // Cat
  if (key === "2") selectedFilter = 1; // Rabbit
  if (key === "3") selectedFilter = 2; // Glasses
  if (key === "4") selectedFilter = 3; // Crown
}
