/* ============================================================
   result.js — 담당: 마이티투짱 (Thu Trang)
   + 보완: 응웬 바오 담 (Tamy)
   기능: 포토 스트립 렌더링, 프레임 선택, 날짜 표시, 저장
   ============================================================ */

// --- Danh sách frame (배열 사용) ---
let frameList = ["pink", "mint", "yellow", "lavender"];
let frameColors = ["#ffb6c1", "#b2f0e8", "#fff59d", "#e1bee7"];
let frameBorder = ["#f48fb1", "#80cbc4", "#f9a825", "#ce93d8"];
let selectedFrame = 0; // index vào frameList

// ============================================================
// drawResultScreen() — vẽ màn hình kết quả
// Được gọi từ draw() trong main.js
// ============================================================
function drawResultScreen() {
  push();
  background("#f6f1ff");
  rectMode(CORNER);
  textAlign(CENTER, CENTER);

  // --- Tiêu đề ---
  fill("#ff4d6d");
  noStroke();
  textSize(min(width * 0.045, 32));
  text("✨ 나의 인생네컷", width / 2, 45);

  // --- Kích thước photo strip ---
  let stripW = min(width * 0.38, 220);
  let photoH = stripW * 0.72;
  let gap    = 8;
  let padTop = 16;
  let padBot = 48;
  let stripH = padTop + photoH * 4 + gap * 3 + padBot;
  let stripX = width / 2 - stripW / 2;
  let stripY = 75;

  // --- Nền frame ---
  fill(frameColors[selectedFrame]);
  stroke(frameBorder[selectedFrame]);
  strokeWeight(4);
  rect(stripX, stripY, stripW, stripH, 14);

  // --- 4 ảnh (배열 .length 사용) ---
  for (let i = 0; i < 4; i++) {
    let px = stripX + 10;
    let py = stripY + padTop + i * (photoH + gap);
    let pw = stripW - 20;

    if (capturedPhotos[i]) {
      // vẽ ảnh đã chụp
      push();
      imageMode(CORNER);
      image(capturedPhotos[i], px, py, pw, photoH);
      pop();
    } else {
      // ô trống
      push();
      fill(220);
      noStroke();
      rect(px, py, pw, photoH, 6);
      fill(160);
      textSize(14);
      text("사진 없음", px + pw / 2, py + photoH / 2);
      pop();
    }
  }

  // --- Ngày tháng ---
  push();
  noStroke();
  fill(100);
  textSize(12);
  textAlign(CENTER, CENTER);
  let d = new Date();
  let dateStr = d.getFullYear() + "." +
    String(d.getMonth() + 1).padStart(2, "0") + "." +
    String(d.getDate()).padStart(2, "0");
  text(dateStr, stripX + stripW / 2, stripY + stripH - 26);
  pop();

  // --- Chọn frame ---
  let fBtnSize = min(width * 0.07, 38);
  let fBtnY    = stripY + stripH + 18;
  let fTotalW  = fBtnSize * frameList.length + 8 * (frameList.length - 1);
  let fStartX  = width / 2 - fTotalW / 2;

  for (let i = 0; i < frameList.length; i++) {
    push();
    let bx = fStartX + i * (fBtnSize + 8);
    if (selectedFrame === i) {
      stroke(frameBorder[i]); strokeWeight(3);
    } else {
      noStroke();
    }
    fill(frameColors[i]);
    circle(bx + fBtnSize / 2, fBtnY + fBtnSize / 2, fBtnSize);
    pop();
  }

  // label frame
  push();
  noStroke(); fill("#888"); textSize(12); textAlign(CENTER, CENTER);
  text("프레임 선택", width / 2, fBtnY + fBtnSize + 14);
  pop();

  // --- Nút Save ---
  let btnY = height - 130;
  push();
  fill("#ff4d6d"); noStroke();
  rect(width / 2 - min(width * 0.28, 140), btnY, min(width * 0.56, 280), 52, 26);
  fill(255); textSize(min(width * 0.04, 24));
  text("💾  저장하기", width / 2, btnY + 26);
  pop();

  // --- Nút Retake ---
  let btn2Y = height - 68;
  push();
  fill("#eee"); noStroke();
  rect(width / 2 - min(width * 0.28, 140), btn2Y, min(width * 0.56, 280), 46, 23);
  fill("#555"); textSize(min(width * 0.035, 20));
  text("🔄  다시 찍기", width / 2, btn2Y + 23);
  pop();

  pop();
}

// ============================================================
// handleResultButtons() — xử lý click trong màn hình result
// Gọi từ handleButtons() trong main.js
// ============================================================
function handleResultButtons() {
  let stripW   = min(width * 0.38, 220);
  let stripH   = 16 + min(width * 0.38, 220) * 0.72 * 4 + 8 * 3 + 48;
  let stripY   = 75;
  let fBtnSize = min(width * 0.07, 38);
  let fBtnY    = stripY + stripH + 18;
  let fTotalW  = fBtnSize * frameList.length + 8 * (frameList.length - 1);
  let fStartX  = width / 2 - fTotalW / 2;

  // Click chọn frame
  for (let i = 0; i < frameList.length; i++) {
    let bx = fStartX + i * (fBtnSize + 8) + fBtnSize / 2;
    let by = fBtnY + fBtnSize / 2;
    if (dist(mouseX, mouseY, bx, by) < fBtnSize / 2) {
      selectedFrame = i;
      return;
    }
  }

  // Click Save
  let btnY = height - 130;
  if (mouseX > width / 2 - min(width * 0.28, 140) &&
      mouseX < width / 2 + min(width * 0.28, 140) &&
      mouseY > btnY && mouseY < btnY + 52) {
    saveResultCanvas();
    return;
  }

  // Click Retake
  let btn2Y = height - 68;
  if (mouseX > width / 2 - min(width * 0.28, 140) &&
      mouseX < width / 2 + min(width * 0.28, 140) &&
      mouseY > btn2Y && mouseY < btn2Y + 46) {
    capturedPhotos = [];
    currentScreen  = "camera";
  }
}

// ============================================================
// saveResultCanvas() — lưu ảnh strip bằng p5.js saveCanvas()
// ============================================================
function saveResultCanvas() {
  // vẽ strip vào graphics buffer rồi lưu
  let stripW = min(width * 0.38, 220);
  let photoH = stripW * 0.72;
  let gap    = 8;
  let padTop = 16;
  let padBot = 48;
  let stripH = padTop + photoH * 4 + gap * 3 + padBot;

  let g = createGraphics(stripW, stripH);
  g.rectMode(CORNER);
  g.textAlign(CENTER, CENTER);

  // nền frame
  g.fill(frameColors[selectedFrame]);
  g.stroke(frameBorder[selectedFrame]);
  g.strokeWeight(4);
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

  // ngày tháng
  g.noStroke(); g.fill(100); g.textSize(12);
  let d = new Date();
  let dateStr = d.getFullYear() + "." +
    String(d.getMonth() + 1).padStart(2, "0") + "." +
    String(d.getDate()).padStart(2, "0");
  g.text(dateStr, stripW / 2, stripH - 26);

  // lưu file
  save(g, "my_4cut_" + frameList[selectedFrame] + ".png");
  g.remove();
}
