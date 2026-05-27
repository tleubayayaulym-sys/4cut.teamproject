// ============================================================
// result.js — 담당: 마이티투짱 
// + 보완: Tamy
// Photo strip, frame selection, date, save
// ============================================================

// ============================================================
// drawResultScreen() — gọi từ draw() trong main.js
// ============================================================
function drawResultScreen() {
  push();
  rectMode(CORNER); noStroke();
  textAlign(CENTER, CENTER);

  // Tiêu đề
  fill("#ff4d6d");
  textSize(min(width * 0.045, 30));
  text("✨ 나의 인생네컷", width / 2, 45);

  // --- Kích thước photo strip ---
  let stripW = min(width * 0.38, 220);
  let photoH = stripW * 0.72;
  let gap    = 8;
  let padTop = 16;
  let padBot = 48;
  let stripH = padTop + photoH * 4 + gap * 3 + padBot;
  let stripX = width / 2 - stripW / 2;
  let stripY = 70;

  // Nền frame
  fill(frameColors[selectedFrame]);
  stroke(frameDark[selectedFrame]); strokeWeight(4);
  rect(stripX, stripY, stripW, stripH, 14);

  // 4 ảnh (배열 .length 사용)
  for (let i = 0; i < 4; i++) {
    let px = stripX + 10;
    let py = stripY + padTop + i * (photoH + gap);
    let pw = stripW - 20;
    if (capturedPhotos[i]) {
      push();
      imageMode(CORNER);
      image(capturedPhotos[i], px, py, pw, photoH);
      pop();
    } else {
      push();
      fill(220); noStroke();
      rect(px, py, pw, photoH, 6);
      fill(160); textSize(13);
      text("사진 없음", px + pw/2, py + photoH/2);
      pop();
    }
  }

  // Ngày tháng
  push();
  noStroke(); fill(80); textSize(12);
  let d = new Date();
  let dateStr = d.getFullYear() + "." +
    String(d.getMonth()+1).padStart(2,"0") + "." +
    String(d.getDate()).padStart(2,"0");
  text(dateStr, stripX + stripW/2, stripY + stripH - 26);
  pop();

  // --- Chọn frame (circles) ---
  let fSize  = min(width * 0.06, 34);
  let fGap   = 10;
  let fY     = stripY + stripH + 22;
  let fTotal = fSize * frameColors.length + fGap * (frameColors.length - 1);
  let fStart = width/2 - fTotal/2;

  for (let i = 0; i < frameColors.length; i++) {
    push();
    let cx = fStart + i * (fSize + fGap) + fSize/2;
    if (selectedFrame === i) {
      stroke(frameDark[i]); strokeWeight(3);
    } else {
      noStroke();
    }
    fill(frameColors[i]);
    circle(cx, fY + fSize/2, fSize);
    pop();
  }

  push();
  noStroke(); fill("#888"); textSize(12);
  text("프레임 선택", width/2, fY + fSize + 16);
  pop();

  // --- Hướng dẫn phím ---
  push();
  noStroke(); fill("#aaa"); textSize(13);
  text("S키 저장  |  R키 재촬영", width/2, fY + fSize + 36);
  pop();

  // --- Nút Save ---
  let btnY = height - 128;
  push();
  fill("#ff4d6d"); noStroke();
  rect(width/2 - min(width*0.26, 130), btnY, min(width*0.52, 260), 50, 25);
  fill(255); textSize(min(width*0.038, 22));
  text("💾  저장하기", width/2, btnY + 25);
  pop();

  // --- Nút Retake ---
  let btn2Y = height - 68;
  push();
  fill("#eee"); noStroke();
  rect(width/2 - min(width*0.26, 130), btn2Y, min(width*0.52, 260), 44, 22);
  fill("#555"); textSize(min(width*0.033, 19));
  text("🔄  다시 찍기", width/2, btn2Y + 22);
  pop();

  pop();
}

// ============================================================
// handleResultButtons() — gọi từ handleButtons() trong main.js
// ============================================================
function handleResultButtons() {
  // Chọn frame
  let fSize  = min(width * 0.06, 34);
  let fGap   = 10;
  let stripW = min(width * 0.38, 220);
  let photoH = stripW * 0.72;
  let stripH = 16 + photoH * 4 + 8 * 3 + 48;
  let fY     = 70 + stripH + 22;
  let fTotal = fSize * frameColors.length + fGap * (frameColors.length-1);
  let fStart = width/2 - fTotal/2;

  for (let i = 0; i < frameColors.length; i++) {
    let cx = fStart + i * (fSize + fGap) + fSize/2;
    if (dist(mouseX, mouseY, cx, fY + fSize/2) < fSize/2) {
      selectedFrame = i;
      return;
    }
  }

  // Save
  let btnY = height - 128;
  let bw   = min(width*0.52, 260);
  if (mouseX > width/2-bw/2 && mouseX < width/2+bw/2 &&
      mouseY > btnY && mouseY < btnY + 50) {
    saveResultCanvas();
    return;
  }

  // Retake
  let btn2Y = height - 68;
  if (mouseX > width/2-bw/2 && mouseX < width/2+bw/2 &&
      mouseY > btn2Y && mouseY < btn2Y + 44) {
    capturedPhotos = [];
    currentScreen  = "camera";
  }
}

// ============================================================
// saveResultCanvas() — tạo graphics buffer rồi lưu PNG
// ============================================================
function saveResultCanvas() {
  let stripW = min(width * 0.38, 220);
  let photoH = stripW * 0.72;
  let gap    = 8;
  let padTop = 16;
  let padBot = 48;
  let stripH = padTop + photoH * 4 + gap * 3 + padBot;

  let g = createGraphics(stripW, stripH);
  g.rectMode(CORNER); g.textAlign(CENTER, CENTER);

  // nền
  g.fill(frameColors[selectedFrame]);
  g.stroke(frameDark[selectedFrame]); g.strokeWeight(4);
  g.rect(0, 0, stripW, stripH, 14);

  // ảnh
  for (let i = 0; i < 4; i++) {
    let px = 10;
    let py = padTop + i * (photoH + gap);
    let pw = stripW - 20;
    if (capturedPhotos[i]) {
      g.image(capturedPhotos[i], px, py, pw, photoH);
    } else {
      g.fill(220); g.noStroke();
      g.rect(px, py, pw, photoH, 6);
    }
  }

  // ngày
  g.noStroke(); g.fill(80); g.textSize(12);
  let d = new Date();
  let dateStr = d.getFullYear() + "." +
    String(d.getMonth()+1).padStart(2,"0") + "." +
    String(d.getDate()).padStart(2,"0");
  g.text(dateStr, stripW/2, stripH - 26);

  save(g, "my_4cut_" + frameNames[selectedFrame] + ".png");
  g.remove();

  currentScreen = "saved";
}
