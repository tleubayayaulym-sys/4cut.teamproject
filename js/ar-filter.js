// ============================================================
// ar-filter.js — 담당: 응웬 바오 담 (Tamy)
// 4 filter cute/kawaii style:
// 0: 🎀 Ribbon — nơ hồng lớn + tia sáng
// 1: 💕 Pastel Love — tim nhỏ bay quanh mặt
// 2: 🐱 Cute Cat — tai mèo outline + mũi tim + râu
// 3: 👓 Round Glasses — kính tròn + nơ nhỏ
// ============================================================

let faceMesh      = null;
let faceLandmarks = null;
let faceReady     = false;

let handDetector  = null;
let handLandmarks = null;

let gesTouchedPrev = false;
let gesIconTimer   = 0;

let _camW = 400;
let _camH = 300;

// Mảng lưu vị trí tim bay (배열 사용)
let danhSachTim = [];

// ============================================================
// initFaceMesh()
// ============================================================
function initFaceMesh(camera) {
  let videoEl = camera.elt;

  faceMesh = new FaceMesh({
    locateFile: (file) =>
      "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/" + file
  });
  faceMesh.setOptions({
    maxNumFaces:            1,
    refineLandmarks:        true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence:  0.5
  });
  faceMesh.onResults((r) => {
    faceLandmarks = (r.multiFaceLandmarks && r.multiFaceLandmarks.length > 0)
      ? r.multiFaceLandmarks[0] : null;
  });

  handDetector = new Hands({
    locateFile: (file) =>
      "https://cdn.jsdelivr.net/npm/@mediapipe/hands/" + file
  });
  handDetector.setOptions({
    maxNumHands:            1,
    modelComplexity:        0,
    minDetectionConfidence: 0.7,
    minTrackingConfidence:  0.5
  });
  handDetector.onResults((r) => {
    handLandmarks = (r.multiHandLandmarks && r.multiHandLandmarks.length > 0)
      ? r.multiHandLandmarks[0] : null;
  });

  faceReady = true;

  // Khởi tạo mảng tim cho filter 1
  for (let i = 0; i < 12; i++) {
    danhSachTim.push({
      ox: random(-120, 120),  // vị trí x ban đầu (offset từ tâm mặt)
      oy: random(-140, 60),   // vị trí y ban đầu
      toc: random(0.4, 1.2),  // tốc độ bay lên
      kich: random(8, 20),    // kích thước tim
      mau: floor(random(5)),  // index màu
      pha: random(TWO_PI)     // phase để nhấp nháy lệch nhau
    });
  }

  let dangXuLy = false;
  setInterval(async () => {
    if (!dangXuLy && videoEl.readyState >= 2) {
      dangXuLy = true;
      try {
        await faceMesh.send({ image: videoEl });
        await handDetector.send({ image: videoEl });
      } catch (e) {}
      dangXuLy = false;
    }
  }, 67);
}

// ============================================================
// lm() — tọa độ FaceMesh → canvas
// ============================================================
function lm(index, camX, camY) {
  if (!faceLandmarks || index >= faceLandmarks.length) {
    return { x: camX, y: camY };
  }
  let d = faceLandmarks[index];
  return {
    x: camX + (d.x - 0.5) * _camW,
    y: camY + (d.y - 0.5) * _camH
  };
}

function getFaceWidth(camX, camY) {
  let trai = lm(234, camX, camY);
  let phai = lm(454, camX, camY);
  return dist(trai.x, trai.y, phai.x, phai.y);
}

// ============================================================
// drawARFilter() — hàm chính
// ============================================================
function drawARFilter(camX, camY, loaiFilter, camW, camH) {
  if (camW) _camW = camW;
  if (camH) _camH = camH;

  if (faceLandmarks) {
    if      (loaiFilter === 0) veFilterNo(camX, camY);
    else if (loaiFilter === 1) veFilterTim(camX, camY);
    else if (loaiFilter === 2) veFilterMeoKawaii(camX, camY);
    else if (loaiFilter === 3) veFilterKinhTron(camX, camY);
    else if (loaiFilter === 4) veFilterEch(camX, camY);
  } else {
    veFilterCoDinh(camX, camY - _camH * 0.06, loaiFilter);
  }

  // Cử chỉ tay
  let dangCham = ktraCuChi();
  if (gesTouchedPrev && !dangCham) {
    gesIconTimer = 60;
    if (typeof startPhotoSequence === "function" &&
        typeof isCapturing !== "undefined" && !isCapturing) {
      startPhotoSequence();
    }
  }
  gesTouchedPrev = dangCham;
  veHuongDanTay(dangCham, camX, camY);
}

// ============================================================
// 🎀 Filter 0: Ribbon
// Nơ hồng lớn trên đầu + tia sáng kim cương xung quanh
// Kỹ thuật: beginShape/vertex (cánh nơ), bezierVertex, for loop, sin/cos
// ============================================================
function veFilterNo(camX, camY) {
  push();
  let dinh = lm(10, camX, camY);
  let tl   = getFaceWidth(camX, camY) / 180;
  let cx   = dinh.x;
  let cy   = dinh.y - 18*tl;

  // --- Cánh nơ trái (dùng beginShape + bezierVertex) ---
  push();
  fill("#ffb6c1"); stroke("#f48fb1"); strokeWeight(3*tl);
  beginShape();
  vertex(cx, cy);
  bezierVertex(cx - 20*tl, cy - 30*tl, cx - 80*tl, cy - 40*tl, cx - 90*tl, cy - 10*tl);
  bezierVertex(cx - 80*tl, cy + 20*tl, cx - 20*tl, cy + 10*tl, cx, cy);
  endShape(CLOSE);
  // Bóng trong cánh trái
  fill("#f48fb1"); noStroke();
  beginShape();
  vertex(cx - 8*tl, cy - 2*tl);
  bezierVertex(cx - 20*tl, cy - 15*tl, cx - 55*tl, cy - 22*tl, cx - 65*tl, cy - 5*tl);
  bezierVertex(cx - 55*tl, cy + 8*tl, cx - 20*tl, cy + 4*tl, cx - 8*tl, cy - 2*tl);
  endShape(CLOSE);
  pop();

  // --- Cánh nơ phải ---
  push();
  fill("#ffb6c1"); stroke("#f48fb1"); strokeWeight(3*tl);
  beginShape();
  vertex(cx, cy);
  bezierVertex(cx + 20*tl, cy - 30*tl, cx + 80*tl, cy - 40*tl, cx + 90*tl, cy - 10*tl);
  bezierVertex(cx + 80*tl, cy + 20*tl, cx + 20*tl, cy + 10*tl, cx, cy);
  endShape(CLOSE);
  fill("#f48fb1"); noStroke();
  beginShape();
  vertex(cx + 8*tl, cy - 2*tl);
  bezierVertex(cx + 20*tl, cy - 15*tl, cx + 55*tl, cy - 22*tl, cx + 65*tl, cy - 5*tl);
  bezierVertex(cx + 55*tl, cy + 8*tl, cx + 20*tl, cy + 4*tl, cx + 8*tl, cy - 2*tl);
  endShape(CLOSE);
  pop();

  // --- Nút nơ giữa ---
  push();
  fill("#f48fb1"); stroke("#e91e8c"); strokeWeight(2*tl);
  ellipse(cx, cy, 22*tl, 18*tl);
  fill("#ffcdd2"); noStroke();
  ellipse(cx - 3*tl, cy - 3*tl, 8*tl, 6*tl);
  pop();

  // --- Tia sáng kim cương xung quanh (for loop + sin/cos) ---
  // Hình kim cương 4 cánh: dùng beginShape/vertex
  let viTriTia = [
    {x: cx - 105*tl, y: cy - 5*tl},
    {x: cx + 105*tl, y: cy - 5*tl},
    {x: cx - 55*tl,  y: cy - 55*tl},
    {x: cx + 55*tl,  y: cy - 55*tl},
    {x: cx,          y: cy - 60*tl},
    {x: cx - 80*tl,  y: cy + 25*tl},
    {x: cx + 80*tl,  y: cy + 25*tl}
  ];
  for (let i = 0; i < viTriTia.length; i++) {
    let do_sang = map(sin(frameCount * 0.07 + i * 0.9), -1, 1, 100, 255);
    let sz = (4 + sin(frameCount * 0.05 + i) * 1.5) * tl;
    push();
    fill(255, 255, 255, do_sang); noStroke();
    translate(viTriTia[i].x, viTriTia[i].y);
    // Kim cương 4 cánh
    beginShape();
    vertex(0, -sz*3);  vertex(sz, 0);
    vertex(0,  sz*3);  vertex(-sz, 0);
    endShape(CLOSE);
    pop();
  }

  pop();
}

// ============================================================
// 💕 Filter 1: Pastel Love
// Tim nhỏ nhiều màu bay xung quanh mặt + blush má
// Kỹ thuật: mảng 2D dữ liệu, vẽ tim bằng arc+triangle, frameCount
// ============================================================

// Màu tim pastel (배열 사용)
let mauTimList = ["#ffb6c1", "#b2f0e8", "#fff59d", "#c8e6c9", "#e1bee7"];

// Hàm vẽ hình tim tại (x,y) kích thước s
function veTim(x, y, s) {
  push();
  translate(x, y);
  rotate(PI);
  // Tim = 2 arc bán nguyệt + 1 tam giác
  beginShape();
  vertex(0, 0);
  bezierVertex(-s*0.1, -s*0.4, -s*0.6, -s*0.4, -s*0.5, 0);
  bezierVertex(-s*0.4, s*0.3, 0, s*0.6, 0, s*0.7);
  bezierVertex(0, s*0.6, s*0.4, s*0.3, s*0.5, 0);
  bezierVertex(s*0.6, -s*0.4, s*0.1, -s*0.4, 0, 0);
  endShape(CLOSE);
  pop();
}

function veFilterTim(camX, camY) {
  push();
  let mui    = lm(1,   camX, camY);
  let maTrai = lm(234, camX, camY);
  let maPhai = lm(454, camX, camY);
  let tl     = getFaceWidth(camX, camY) / 180;

  // --- Tim bay xung quanh mặt (dùng mảng + frameCount) ---
  for (let i = 0; i < danhSachTim.length; i++) {
    let t = danhSachTim[i];
    // Y bay lên theo thời gian, reset khi ra ngoài
    let dy = (frameCount * t.toc * 0.5) % (_camH * 0.9);
    let tx = mui.x + t.ox * tl;
    let ty = mui.y + t.oy * tl - dy;

    let do_mo = map(sin(frameCount * 0.04 + t.pha), -1, 1, 120, 220);
    fill(mauTimList[t.mau % mauTimList.length], do_mo);
    noStroke();
    veTim(tx, ty, t.kich * tl);
  }

  // --- Blush má hồng pastel ---
  push();
  noStroke();
  fill(255, 182, 193, 120);
  ellipse(maTrai.x + 8*tl, maTrai.y + 8*tl, 40*tl, 22*tl);
  ellipse(maPhai.x - 8*tl, maPhai.y + 8*tl, 40*tl, 22*tl);
  pop();

  // --- Tim nhỏ trên má ---
  push();
  fill("#ffb6c1", 200); noStroke();
  veTim(maTrai.x + 5*tl, maTrai.y + 2*tl, 12*tl);
  fill("#b2f0e8", 200);
  veTim(maTrai.x + 22*tl, maTrai.y - 8*tl, 9*tl);
  fill("#fff59d", 200);
  veTim(maPhai.x - 5*tl, maPhai.y + 2*tl, 12*tl);
  fill("#c8e6c9", 200);
  veTim(maPhai.x - 22*tl, maPhai.y - 8*tl, 9*tl);
  pop();

  pop();
}

// ============================================================
// 🐱 Filter 2: Cute Cat Kawaii
// Tai mèo outline mỏng + mũi tim + râu thẳng
// Style như ảnh tham khảo (đường nét mảnh, tối giản)
// ============================================================
function veFilterMeoKawaii(camX, camY) {
  push();
  let dinh   = lm(10,  camX, camY);
  let mui    = lm(1,   camX, camY);
  let maTrai = lm(234, camX, camY);
  let maPhai = lm(454, camX, camY);
  let tl     = getFaceWidth(camX, camY) / 180;
  let cx     = dinh.x;
  let cy     = dinh.y;

  // --- Tai mèo outline mỏng (dùng beginShape/vertex) ---
  // Tai trái
  push();
  fill("#fff0f5"); stroke("#ffb6c1"); strokeWeight(3*tl);
  beginShape();
  vertex(cx - 75*tl, cy + 10*tl);  // chân trái
  vertex(cx - 95*tl, cy - 65*tl);  // đỉnh tai
  vertex(cx - 35*tl, cy - 15*tl);  // chân phải
  endShape(CLOSE);
  // Màu hồng bên trong tai
  fill("#ffb6c1"); noStroke();
  beginShape();
  vertex(cx - 75*tl, cy + 3*tl);
  vertex(cx - 90*tl, cy - 52*tl);
  vertex(cx - 42*tl, cy - 12*tl);
  endShape(CLOSE);
  pop();

  // Tai phải
  push();
  fill("#fff0f5"); stroke("#ffb6c1"); strokeWeight(3*tl);
  beginShape();
  vertex(cx + 35*tl, cy - 15*tl);
  vertex(cx + 95*tl, cy - 65*tl);
  vertex(cx + 75*tl, cy + 10*tl);
  endShape(CLOSE);
  fill("#ffb6c1"); noStroke();
  beginShape();
  vertex(cx + 42*tl, cy - 12*tl);
  vertex(cx + 90*tl, cy - 52*tl);
  vertex(cx + 75*tl, cy + 3*tl);
  endShape(CLOSE);
  pop();

  // --- Mũi tim hồng ---
  push();
  fill("#ff8fab"); noStroke();
  veTim(mui.x, mui.y + 5*tl, 13*tl);
  pop();

  // --- Râu mèo thẳng (stroke mỏng) ---
  push();
  stroke("#888"); strokeWeight(1.5*tl); noFill();
  // Râu trái: 2 đường thẳng song song
  line(maTrai.x, maTrai.y,       maTrai.x - 65*tl, maTrai.y - 8*tl);
  line(maTrai.x, maTrai.y + 12*tl, maTrai.x - 65*tl, maTrai.y + 8*tl);
  // Râu phải
  line(maPhai.x, maPhai.y,         maPhai.x + 65*tl, maPhai.y - 8*tl);
  line(maPhai.x, maPhai.y + 12*tl, maPhai.x + 65*tl, maPhai.y + 8*tl);
  pop();

  // --- Blush nhẹ ---
  push();
  noStroke(); fill(255, 182, 193, 100);
  ellipse(maTrai.x + 6*tl, maTrai.y + 10*tl, 32*tl, 16*tl);
  ellipse(maPhai.x - 6*tl, maPhai.y + 10*tl, 32*tl, 16*tl);
  pop();

  pop();
}

// ============================================================
// 👓 Filter 3: Round Glasses + nơ nhỏ
// Kính tròn vintage + nơ xanh hai bên
// Kỹ thuật: ellipse (kính tròn), bezierVertex (nơ nhỏ)
// ============================================================
function veFilterKinhTron(camX, camY) {
  push();
  let mTO    = lm(33,  camX, camY); // mắt trái ngoài
  let mTT    = lm(133, camX, camY); // mắt trái trong
  let mPT    = lm(362, camX, camY); // mắt phải trong
  let mPO    = lm(263, camX, camY); // mắt phải ngoài
  let dinh   = lm(10,  camX, camY);
  let tl     = getFaceWidth(camX, camY) / 180;

  let r      = dist(mTO.x, mTO.y, mTT.x, mTT.y) * 0.65;
  let tamTrai = { x: (mTO.x+mTT.x)/2, y: (mTO.y+mTT.y)/2 };
  let tamPhai = { x: (mPO.x+mPT.x)/2, y: (mPO.y+mPT.y)/2 };

  // --- Kính tròn (ellipse) ---
  push();
  noFill(); stroke("#555"); strokeWeight(3*tl);
  ellipse(tamTrai.x, tamTrai.y, r*2, r*2);
  ellipse(tamPhai.x, tamPhai.y, r*2, r*2);
  // Cầu nối giữa
  stroke("#555"); strokeWeight(2*tl);
  line(tamTrai.x + r, tamTrai.y, tamPhai.x - r, tamPhai.y);
  // Gọng
  line(tamTrai.x - r, tamTrai.y, tamTrai.x - r - 20*tl, tamTrai.y - 5*tl);
  line(tamPhai.x + r, tamPhai.y, tamPhai.x + r + 20*tl, tamPhai.y - 5*tl);
  // Phản chiếu sáng bên trong kính
  stroke(255, 255, 255, 120); strokeWeight(2*tl);
  arc(tamTrai.x - r*0.3, tamTrai.y - r*0.3, r*0.7, r*0.6, PI, TWO_PI);
  arc(tamPhai.x - r*0.3, tamPhai.y - r*0.3, r*0.7, r*0.6, PI, TWO_PI);
  pop();

  // --- Nơ nhỏ xanh hai bên đỉnh đầu (dùng bezierVertex) ---
  let noMau  = "#90caf9"; // xanh nhạt
  let noBien = "#42a5f5";
  let noViTri = [
    { x: dinh.x - 42*tl, y: dinh.y - 5*tl },
    { x: dinh.x + 42*tl, y: dinh.y - 5*tl }
  ];

  for (let i = 0; i < noViTri.length; i++) {
    let nx = noViTri[i].x;
    let ny = noViTri[i].y;
    let ns = 14 * tl;

    push();
    // Cánh nơ trái
    fill(noMau); stroke(noBien); strokeWeight(1.5*tl);
    beginShape();
    vertex(nx, ny);
    bezierVertex(nx-ns, ny-ns*1.5, nx-ns*2.5, ny-ns, nx-ns*2.2, ny+ns*0.3);
    bezierVertex(nx-ns*1.5, ny+ns, nx-ns*0.3, ny+ns*0.3, nx, ny);
    endShape(CLOSE);
    // Cánh nơ phải
    beginShape();
    vertex(nx, ny);
    bezierVertex(nx+ns, ny-ns*1.5, nx+ns*2.5, ny-ns, nx+ns*2.2, ny+ns*0.3);
    bezierVertex(nx+ns*1.5, ny+ns, nx+ns*0.3, ny+ns*0.3, nx, ny);
    endShape(CLOSE);
    // Nút giữa
    fill(noBien); noStroke();
    ellipse(nx, ny, ns*0.9, ns*0.7);
    pop();
  }

  pop();
}

// ============================================================
// Filter cố định (khi chưa nhận diện mặt)
// ============================================================
function veFilterCoDinh(x, y, loai) {
  push();
  if (loai === 0) {
    // Ribbon cố định
    fill("#ffb6c1"); stroke("#f48fb1"); strokeWeight(3);
    beginShape();
    vertex(x, y);
    bezierVertex(x-20, y-30, x-80, y-40, x-90, y-10);
    bezierVertex(x-80, y+20, x-20, y+10, x, y);
    endShape(CLOSE);
    beginShape();
    vertex(x, y);
    bezierVertex(x+20, y-30, x+80, y-40, x+90, y-10);
    bezierVertex(x+80, y+20, x+20, y+10, x, y);
    endShape(CLOSE);
    fill("#f48fb1"); noStroke(); ellipse(x, y, 22, 18);
  } else if (loai === 1) {
    // Tim bay cố định
    for (let i = 0; i < 6; i++) {
      let goc = i * PI/3;
      let r   = 70;
      let tx  = x + cos(goc) * r;
      let ty  = y + sin(goc) * r * 0.5 - 30;
      fill(mauTimList[i % mauTimList.length], 180); noStroke();
      veTim(tx, ty, 14);
    }
    fill(255, 182, 193, 130); noStroke();
    ellipse(x - 50, y + 20, 40, 20);
    ellipse(x + 50, y + 20, 40, 20);
  } else if (loai === 2) {
    // Cat kawaii cố định
    fill("#fff0f5"); stroke("#ffb6c1"); strokeWeight(3);
    triangle(x-75, y+10, x-95, y-65, x-35, y-15);
    triangle(x+35, y-15, x+95, y-65, x+75, y+10);
    fill("#ffb6c1"); noStroke();
    triangle(x-75, y+3, x-90, y-52, x-42, y-12);
    triangle(x+42, y-12, x+90, y-52, x+75, y+3);
    fill("#ff8fab"); veTim(x, y + 25, 13);
    stroke("#888"); strokeWeight(1.5); noFill();
    line(x-30, y+30, x-95, y+22); line(x-30, y+42, x-95, y+40);
    line(x+30, y+30, x+95, y+22); line(x+30, y+42, x+95, y+40);
  } else if (loai === 3) {
    // Round glasses cố định
    noFill(); stroke("#555"); strokeWeight(3);
    ellipse(x-42, y+10, 56, 56);
    ellipse(x+42, y+10, 56, 56);
    line(x-14, y+10, x+14, y+10);
    line(x-70, y+10, x-90, y+5);
    line(x+70, y+10, x+90, y+5);
    // Nơ xanh
    fill("#90caf9"); stroke("#42a5f5"); strokeWeight(2);
    let nx1 = x - 42, ny1 = y - 42;
    beginShape();
    vertex(nx1,ny1); bezierVertex(nx1-14,ny1-21,nx1-35,ny1-14,nx1-30.8,ny1+4.2);
    bezierVertex(nx1-21,ny1+14,nx1-4.2,ny1+4.2,nx1,ny1);
    endShape(CLOSE);
    beginShape();
    vertex(nx1,ny1); bezierVertex(nx1+14,ny1-21,nx1+35,ny1-14,nx1+30.8,ny1+4.2);
    bezierVertex(nx1+21,ny1+14,nx1+4.2,ny1+4.2,nx1,ny1);
    endShape(CLOSE);
    fill("#42a5f5"); noStroke(); ellipse(nx1,ny1,12.6,9.8);
    let nx2 = x + 42;
    fill("#90caf9"); stroke("#42a5f5"); strokeWeight(2);
    beginShape();
    vertex(nx2,ny1); bezierVertex(nx2-14,ny1-21,nx2-35,ny1-14,nx2-30.8,ny1+4.2);
    bezierVertex(nx2-21,ny1+14,nx2-4.2,ny1+4.2,nx2,ny1);
    endShape(CLOSE);
    beginShape();
    vertex(nx2,ny1); bezierVertex(nx2+14,ny1-21,nx2+35,ny1-14,nx2+30.8,ny1+4.2);
    bezierVertex(nx2+21,ny1+14,nx2+4.2,ny1+4.2,nx2,ny1);
    endShape(CLOSE);
    fill("#42a5f5"); noStroke(); ellipse(nx2,ny1,12.6,9.8);
  }
  pop();
}

// ============================================================
// Cử chỉ tay
// ============================================================
function ktraCuChi() {
  if (!handLandmarks) return false;
  let ngonCai = handLandmarks[4];
  let ngonTro = handLandmarks[8];
  return dist(ngonCai.x, ngonCai.y, ngonTro.x, ngonTro.y) < 0.06;
}

function veHuongDanTay(dangCham, camX, camY) {
  push(); noStroke();
  if (gesIconTimer > 0) {
    textAlign(CENTER, CENTER);
    textSize(min(_camW * 0.18, 80));
    fill(255, 255, 255, map(gesIconTimer, 0, 60, 0, 255));
    text("📸", camX, camY);
    gesIconTimer--;
  }
  if (handLandmarks) {
    let ngonCai = handLandmarks[4];
    let ngonTro = handLandmarks[8];
    let caiX = (1 - ngonCai.x) * width;
    let caiY = ngonCai.y * height;
    let troX = (1 - ngonTro.x) * width;
    let troY = ngonTro.y * height;
    if (dangCham) { stroke("#ff4d6d"); strokeWeight(4); line(caiX,caiY,troX,troY); }
    noStroke();
    fill(dangCham ? "#ff4d6d" : 255);
    circle(caiX, caiY, 20); circle(troX, troY, 20);
  }
  pop();
}

function updateParticles() {}

function drawFaceStatus(w, h) {
  push();
  noStroke(); textAlign(LEFT, CENTER); textSize(14);
  if (!faceReady) {
    fill(255, 200, 0, 200);
    text("⏳ 모델 로딩 중...", 20, h - 55);
  } else if (!faceLandmarks) {
    fill(255, 100, 100, 200);
    text("😶 얼굴을 카메라에 맞춰주세요", 20, h - 55);
  } else {
    fill(100, 220, 100, 200);
    text("✅ 얼굴 인식 중", 20, h - 55);
  }
  pop();
}

// ============================================================
// 🐸 Filter 4: Ếch — code tự làm, adapt sang AR filter
// Kỹ thuật: ellipse, arc, circle (vẽ ếch lên đỉnh đầu)
// ============================================================
function veFilterEch(camX, camY) {
  push();
  let dinh   = lm(10,  camX, camY); // đỉnh đầu
  let mui    = lm(1,   camX, camY); // mũi
  let maTrai = lm(234, camX, camY);
  let maPhai = lm(454, camX, camY);
  let tl     = getFaceWidth(camX, camY) / 180;

  // Vị trí đầu ếch: ngồi trên đỉnh đầu người
  let ex = dinh.x;
  let ey = dinh.y - 55*tl;

  // --- Đầu ếch (ellipse xanh lá) ---
  push();
  fill("#4CAF50"); noStroke();
  ellipse(ex, ey, 150*tl, 120*tl);
  pop();

  // --- 2 mắt ếch lồi (dùng hàm veMat) ---
  veMat_Ech(ex - 40*tl, ey - 60*tl, tl);
  veMat_Ech(ex + 40*tl, ey - 60*tl, tl);

  // --- Mũi ếch (2 lỗ mũi) ---
  push();
  fill("#2E7D32"); noStroke();
  ellipse(ex - 15*tl, ey - 10*tl, 8*tl, 6*tl);
  ellipse(ex + 15*tl, ey - 10*tl, 8*tl, 6*tl);
  pop();

  // --- Miệng ếch (arc) ---
  push();
  noFill();
  stroke("#2E7D32"); strokeWeight(3*tl);
  arc(ex, ey + 10*tl, 80*tl, 40*tl, 0.2, PI - 0.2);
  pop();

  // --- Blush má ếch ---
  push();
  noStroke(); fill(255, 182, 193, 130);
  ellipse(maTrai.x + 8*tl, maTrai.y + 5*tl, 28*tl, 14*tl);
  ellipse(maPhai.x - 8*tl, maPhai.y + 5*tl, 28*tl, 14*tl);
  pop();

  pop();
}

// Hàm vẽ mắt ếch (giữ đúng code gốc của bạn, chỉ thêm tl scale)
function veMat_Ech(x, y, tl) {
  push();
  fill("white");
  stroke("#2E7D32"); strokeWeight(3*tl);
  circle(x, y, 50*tl);
  fill("black"); noStroke();
  circle(x, y, 22*tl);
  fill(255); noStroke();
  circle(x - 5*tl, y - 5*tl, 8*tl);
  pop();
}
