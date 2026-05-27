// ============================================================
// ar-filter.js — 담당: 응웬 바오 담 (Tamy)
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

let danhSachTim = [];

function initFaceMesh(camera) {
  let videoEl = camera.elt;

  faceMesh = new FaceMesh({
    locateFile: (file) =>
      "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/" + file
  });
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
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
    maxNumHands: 1,
    modelComplexity: 0,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.5
  });
  handDetector.onResults((r) => {
    handLandmarks = (r.multiHandLandmarks && r.multiHandLandmarks.length > 0)
      ? r.multiHandLandmarks[0] : null;
  });

  faceReady = true;

  for (let i = 0; i < 12; i++) {
    danhSachTim.push({
      ox: random(-120, 120),
      oy: random(-140, 60),
      toc: random(0.4, 1.2),
      kich: random(8, 20),
      mau: floor(random(5)),
      pha: random(TWO_PI)
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

function drawARFilter(camX, camY, loaiFilter, camW, camH) {
  if (camW) _camW = camW;
  if (camH) _camH = camH;

  if (faceLandmarks) {
    if      (loaiFilter === 0) veFilterNo(camX, camY);
    else if (loaiFilter === 1) veFilterTim(camX, camY);
    else if (loaiFilter === 2) veFilterMeoKawaii(camX, camY);
    else if (loaiFilter === 3) veFilterKinhTron(camX, camY);
  } else {
    veFilterCoDinh(camX, camY - _camH * 0.06, loaiFilter);
  }

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

// 🎀 Ribbon
function veFilterNo(camX, camY) {
  push();
  let dinh = lm(10, camX, camY);
  let tl   = getFaceWidth(camX, camY) / 180;
  let cx   = dinh.x;
  let cy   = dinh.y - 18*tl;

  push();
  fill("#ffb6c1"); stroke("#f48fb1"); strokeWeight(3*tl);
  beginShape();
  vertex(cx, cy);
  bezierVertex(cx-20*tl, cy-30*tl, cx-80*tl, cy-40*tl, cx-90*tl, cy-10*tl);
  bezierVertex(cx-80*tl, cy+20*tl, cx-20*tl, cy+10*tl, cx, cy);
  endShape(CLOSE);
  fill("#f48fb1"); noStroke();
  beginShape();
  vertex(cx-8*tl, cy-2*tl);
  bezierVertex(cx-20*tl, cy-15*tl, cx-55*tl, cy-22*tl, cx-65*tl, cy-5*tl);
  bezierVertex(cx-55*tl, cy+8*tl, cx-20*tl, cy+4*tl, cx-8*tl, cy-2*tl);
  endShape(CLOSE);
  pop();

  push();
  fill("#ffb6c1"); stroke("#f48fb1"); strokeWeight(3*tl);
  beginShape();
  vertex(cx, cy);
  bezierVertex(cx+20*tl, cy-30*tl, cx+80*tl, cy-40*tl, cx+90*tl, cy-10*tl);
  bezierVertex(cx+80*tl, cy+20*tl, cx+20*tl, cy+10*tl, cx, cy);
  endShape(CLOSE);
  fill("#f48fb1"); noStroke();
  beginShape();
  vertex(cx+8*tl, cy-2*tl);
  bezierVertex(cx+20*tl, cy-15*tl, cx+55*tl, cy-22*tl, cx+65*tl, cy-5*tl);
  bezierVertex(cx+55*tl, cy+8*tl, cx+20*tl, cy+4*tl, cx+8*tl, cy-2*tl);
  endShape(CLOSE);
  pop();

  push();
  fill("#f48fb1"); stroke("#e91e8c"); strokeWeight(2*tl);
  ellipse(cx, cy, 22*tl, 18*tl);
  fill("#ffcdd2"); noStroke();
  ellipse(cx-3*tl, cy-3*tl, 8*tl, 6*tl);
  pop();

  let viTriTia = [
    {x: cx-105*tl, y: cy-5*tl},  {x: cx+105*tl, y: cy-5*tl},
    {x: cx-55*tl,  y: cy-55*tl}, {x: cx+55*tl,  y: cy-55*tl},
    {x: cx,        y: cy-60*tl}, {x: cx-80*tl,  y: cy+25*tl},
    {x: cx+80*tl,  y: cy+25*tl}
  ];
  for (let i = 0; i < viTriTia.length; i++) {
    let doSang = map(sin(frameCount * 0.07 + i * 0.9), -1, 1, 100, 255);
    let sz = (4 + sin(frameCount * 0.05 + i) * 1.5) * tl;
    push();
    fill(255, 255, 255, doSang); noStroke();
    translate(viTriTia[i].x, viTriTia[i].y);
    beginShape();
    vertex(0, -sz*3); vertex(sz, 0); vertex(0, sz*3); vertex(-sz, 0);
    endShape(CLOSE);
    pop();
  }
  pop();
}
//ve filter con ech
function setup() {
  createCanvas(400, 400);
}

function draw() {
  if (mouseIsPressed) {
    drawEch(mouseX, mouseY);
  }
}

function drawEch(x, y) {
  push();

  // 2 mắt
  veMat(x - 40, y - 60);
  veMat(x + 40, y - 60);

  // đầu
  fill("#4CAF50");
  noStroke();
  ellipse(x, y, 150, 120);

  // miệng
  noFill();
  stroke("#2E7D32");
  strokeWeight(3);
  arc(x, y + 10, 80, 40, 0.2, PI - 0.2);

  // mũi
  fill("#2E7D32");
  noStroke();
  ellipse(x - 15, y - 10, 8, 6);
  ellipse(x + 15, y - 10, 8, 6);

  pop();
}

function veMat(x, y) {
  fill("white");
  stroke("#2E7D32");
  strokeWeight(3);
  circle(x, y, 50);

  fill("black");
  noStroke();
  circle(x, y, 22);

  fill(255);
  circle(x - 5, y - 5, 8);
}

// 💕 Pastel Love
let mauTimList = ["#ffb6c1", "#b2f0e8", "#fff59d", "#c8e6c9", "#e1bee7"];

function veTim(x, y, s) {
  push();
  translate(x, y);
  rotate(PI);
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

  for (let i = 0; i < danhSachTim.length; i++) {
    let t  = danhSachTim[i];
    let dy = (frameCount * t.toc * 0.5) % (_camH * 0.9);
    let tx = mui.x + t.ox * tl;
    let ty = mui.y + t.oy * tl - dy;
    let doMo = map(sin(frameCount * 0.04 + t.pha), -1, 1, 120, 220);
    fill(mauTimList[t.mau % mauTimList.length], doMo);
    noStroke();
    veTim(tx, ty, t.kich * tl);
  }

  push();
  noStroke(); fill(255, 182, 193, 120);
  ellipse(maTrai.x+8*tl, maTrai.y+8*tl, 40*tl, 22*tl);
  ellipse(maPhai.x-8*tl, maPhai.y+8*tl, 40*tl, 22*tl);
  pop();

  push();
  fill("#ffb6c1", 200); noStroke(); veTim(maTrai.x+5*tl,  maTrai.y+2*tl,  12*tl);
  fill("#b2f0e8", 200);             veTim(maTrai.x+22*tl, maTrai.y-8*tl,  9*tl);
  fill("#fff59d", 200);             veTim(maPhai.x-5*tl,  maPhai.y+2*tl,  12*tl);
  fill("#c8e6c9", 200);             veTim(maPhai.x-22*tl, maPhai.y-8*tl,  9*tl);
  pop();
  pop();
}

// 🐱 Cute Cat
function veFilterMeoKawaii(camX, camY) {
  push();
  let dinh   = lm(10,  camX, camY);
  let mui    = lm(1,   camX, camY);
  let maTrai = lm(234, camX, camY);
  let maPhai = lm(454, camX, camY);
  let tl     = getFaceWidth(camX, camY) / 180;
  let cx     = dinh.x;
  let cy     = dinh.y;

  push();
  fill("#fff0f5"); stroke("#ffb6c1"); strokeWeight(3*tl);
  beginShape(); vertex(cx-75*tl, cy+10*tl); vertex(cx-95*tl, cy-65*tl); vertex(cx-35*tl, cy-15*tl); endShape(CLOSE);
  fill("#ffb6c1"); noStroke();
  beginShape(); vertex(cx-75*tl, cy+3*tl); vertex(cx-90*tl, cy-52*tl); vertex(cx-42*tl, cy-12*tl); endShape(CLOSE);
  pop();

  push();
  fill("#fff0f5"); stroke("#ffb6c1"); strokeWeight(3*tl);
  beginShape(); vertex(cx+35*tl, cy-15*tl); vertex(cx+95*tl, cy-65*tl); vertex(cx+75*tl, cy+10*tl); endShape(CLOSE);
  fill("#ffb6c1"); noStroke();
  beginShape(); vertex(cx+42*tl, cy-12*tl); vertex(cx+90*tl, cy-52*tl); vertex(cx+75*tl, cy+3*tl); endShape(CLOSE);
  pop();

  push(); fill("#ff8fab"); noStroke(); veTim(mui.x, mui.y+5*tl, 13*tl); pop();

  push();
  stroke("#888"); strokeWeight(1.5*tl); noFill();
  line(maTrai.x, maTrai.y,       maTrai.x-65*tl, maTrai.y-8*tl);
  line(maTrai.x, maTrai.y+12*tl, maTrai.x-65*tl, maTrai.y+8*tl);
  line(maPhai.x, maPhai.y,       maPhai.x+65*tl, maPhai.y-8*tl);
  line(maPhai.x, maPhai.y+12*tl, maPhai.x+65*tl, maPhai.y+8*tl);
  pop();

  push(); noStroke(); fill(255, 182, 193, 100);
  ellipse(maTrai.x+6*tl, maTrai.y+10*tl, 32*tl, 16*tl);
  ellipse(maPhai.x-6*tl, maPhai.y+10*tl, 32*tl, 16*tl);
  pop();
  pop();
}

// 👓 Round Glasses
function veFilterKinhTron(camX, camY) {
  push();
  let mTO    = lm(33,  camX, camY);
  let mTT    = lm(133, camX, camY);
  let mPT    = lm(362, camX, camY);
  let mPO    = lm(263, camX, camY);
  let dinh   = lm(10,  camX, camY);
  let tl     = getFaceWidth(camX, camY) / 180;
  let r      = dist(mTO.x, mTO.y, mTT.x, mTT.y) * 0.65;
  let tamTrai = { x: (mTO.x+mTT.x)/2, y: (mTO.y+mTT.y)/2 };
  let tamPhai = { x: (mPO.x+mPT.x)/2, y: (mPO.y+mPT.y)/2 };

  push();
  noFill(); stroke("#555"); strokeWeight(3*tl);
  ellipse(tamTrai.x, tamTrai.y, r*2, r*2);
  ellipse(tamPhai.x, tamPhai.y, r*2, r*2);
  stroke("#555"); strokeWeight(2*tl);
  line(tamTrai.x+r, tamTrai.y, tamPhai.x-r, tamPhai.y);
  line(tamTrai.x-r, tamTrai.y, tamTrai.x-r-20*tl, tamTrai.y-5*tl);
  line(tamPhai.x+r, tamPhai.y, tamPhai.x+r+20*tl, tamPhai.y-5*tl);
  stroke(255, 255, 255, 120); strokeWeight(2*tl);
  arc(tamTrai.x-r*0.3, tamTrai.y-r*0.3, r*0.7, r*0.6, PI, TWO_PI);
  arc(tamPhai.x-r*0.3, tamPhai.y-r*0.3, r*0.7, r*0.6, PI, TWO_PI);
  pop();

  let noMau  = "#90caf9";
  let noBien = "#42a5f5";
  let noViTri = [
    { x: dinh.x-42*tl, y: dinh.y-5*tl },
    { x: dinh.x+42*tl, y: dinh.y-5*tl }
  ];
  for (let i = 0; i < noViTri.length; i++) {
    let nx = noViTri[i].x;
    let ny = noViTri[i].y;
    let ns = 14*tl;
    push();
    fill(noMau); stroke(noBien); strokeWeight(1.5*tl);
    beginShape(); vertex(nx,ny); bezierVertex(nx-ns,ny-ns*1.5,nx-ns*2.5,ny-ns,nx-ns*2.2,ny+ns*0.3); bezierVertex(nx-ns*1.5,ny+ns,nx-ns*0.3,ny+ns*0.3,nx,ny); endShape(CLOSE);
    beginShape(); vertex(nx,ny); bezierVertex(nx+ns,ny-ns*1.5,nx+ns*2.5,ny-ns,nx+ns*2.2,ny+ns*0.3); bezierVertex(nx+ns*1.5,ny+ns,nx+ns*0.3,ny+ns*0.3,nx,ny); endShape(CLOSE);
    fill(noBien); noStroke(); ellipse(nx, ny, ns*0.9, ns*0.7);
    pop();
  }
  pop();
}

// Фиксированные фильтры (без распознавания лица)
function veFilterCoDinh(x, y, loai) {
  push();
  if (loai === 0) {
    fill("#ffb6c1"); stroke("#f48fb1"); strokeWeight(3);
    beginShape(); vertex(x,y); bezierVertex(x-20,y-30,x-80,y-40,x-90,y-10); bezierVertex(x-80,y+20,x-20,y+10,x,y); endShape(CLOSE);
    beginShape(); vertex(x,y); bezierVertex(x+20,y-30,x+80,y-40,x+90,y-10); bezierVertex(x+80,y+20,x+20,y+10,x,y); endShape(CLOSE);
    fill("#f48fb1"); noStroke(); ellipse(x,y,22,18);
  } else if (loai === 1) {
    for (let i = 0; i < 6; i++) {
      let goc = i * PI/3;
      fill(mauTimList[i % mauTimList.length], 180); noStroke();
      veTim(x + cos(goc)*70, y + sin(goc)*35 - 30, 14);
    }
    fill(255, 182, 193, 130); noStroke();
    ellipse(x-50, y+20, 40, 20); ellipse(x+50, y+20, 40, 20);
  } else if (loai === 2) {
    fill("#fff0f5"); stroke("#ffb6c1"); strokeWeight(3);
    triangle(x-75,y+10, x-95,y-65, x-35,y-15);
    triangle(x+35,y-15, x+95,y-65, x+75,y+10);
    fill("#ffb6c1"); noStroke();
    triangle(x-75,y+3, x-90,y-52, x-42,y-12);
    triangle(x+42,y-12, x+90,y-52, x+75,y+3);
    fill("#ff8fab"); veTim(x, y+25, 13);
    stroke("#888"); strokeWeight(1.5); noFill();
    line(x-30,y+30,x-95,y+22); line(x-30,y+42,x-95,y+40);
    line(x+30,y+30,x+95,y+22); line(x+30,y+42,x+95,y+40);
  } else if (loai === 3) {
    noFill(); stroke("#555"); strokeWeight(3);
    ellipse(x-42,y+10,56,56); ellipse(x+42,y+10,56,56);
    line(x-14,y+10,x+14,y+10);
    line(x-70,y+10,x-90,y+5); line(x+70,y+10,x+90,y+5);
    let noMau="#90caf9", noBien="#42a5f5";
    for (let nx of [x-42, x+42]) {
      let ny = y-42;
      fill(noMau); stroke(noBien); strokeWeight(2);
      beginShape(); vertex(nx,ny); bezierVertex(nx-14,ny-21,nx-35,ny-14,nx-30.8,ny+4.2); bezierVertex(nx-21,ny+14,nx-4.2,ny+4.2,nx,ny); endShape(CLOSE);
      beginShape(); vertex(nx,ny); bezierVertex(nx+14,ny-21,nx+35,ny-14,nx+30.8,ny+4.2); bezierVertex(nx+21,ny+14,nx+4.2,ny+4.2,nx,ny); endShape(CLOSE);
      fill(noBien); noStroke(); ellipse(nx,ny,12.6,9.8);
    }
  }
  pop();
}

// Жест рукой
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
    let caiX = (1 - handLandmarks[4].x) * width;
    let caiY = handLandmarks[4].y * height;
    let troX = (1 - handLandmarks[8].x) * width;
    let troY = handLandmarks[8].y * height;
    if (dangCham) { stroke("#ff4d6d"); strokeWeight(4); line(caiX,caiY,troX,troY); }
    noStroke();
    fill(dangCham ? "#ff4d6d" : 255);
    circle(caiX,caiY,20); circle(troX,troY,20);
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
// drawARFilterToGraphics — заглушка (не нужна, get() используем)
// ============================================================
function drawARFilterToGraphics(g, loaiFilter, camW, camH) {
  // get() в camera.js захватывает canvas вместе с фильтром
  // эта функция оставлена для совместимости
}
