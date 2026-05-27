// ============================================================
// ar-filter.js — 담당: 응웬 바오 담 (Tamy)
// Chức năng 1: AR filter bám khuôn mặt (MediaPipe FaceMesh)
// Chức năng 2: Cử chỉ tay chụp ảnh (MediaPipe Hands)
// ============================================================

let faceMesh      = null;
let faceLandmarks = null;
let faceReady     = false;

let handDetector  = null;
let handLandmarks = null;

let gesTouchedPrev = false;
let gesIconTimer   = 0;

// Lưu kích thước camera box — cập nhật mỗi lần drawARFilter được gọi
let _camW = 400;
let _camH = 300;

// ============================================================
// initFaceMesh() — gọi 1 lần trong setupCamera()
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
// lm() — chuyển tọa độ FaceMesh (0→1) sang pixel canvas
// Dùng _camW/_camH (kích thước khung camera thực tế)
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
// drawARFilter() — gọi từ drawCamera() trong camera.js
// camX, camY = tâm khung camera
// camW, camH = kích thước khung camera
// ============================================================
function drawARFilter(camX, camY, loaiFilter, camW, camH) {
  // Cập nhật kích thước camera box
  if (camW) _camW = camW;
  if (camH) _camH = camH;

  // Vẽ filter mặt
  if (faceLandmarks) {
    if      (loaiFilter === 0) veFilterMeo(camX, camY);
    else if (loaiFilter === 1) veFilterTho(camX, camY);
    else if (loaiFilter === 2) veFilterKinh(camX, camY);
    else if (loaiFilter === 3) veFilterVuong(camX, camY);
  } else {
    veFilterCoDinh(camX, camY - _camH * 0.08, loaiFilter);
  }

  // Xử lý cử chỉ tay
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
// Cử chỉ tay
// ============================================================
function ktraCuChi() {
  if (!handLandmarks) return false;
  let ngonCai = handLandmarks[4];
  let ngonTro = handLandmarks[8];
  return dist(ngonCai.x, ngonCai.y, ngonTro.x, ngonTro.y) < 0.06;
}

function veHuongDanTay(dangCham, camX, camY) {
  push();
  noStroke();

  // Icon 📸 khi vừa chụp
  if (gesIconTimer > 0) {
    textAlign(CENTER, CENTER);
    textSize(min(_camW * 0.18, 80));
    fill(255, 255, 255, map(gesIconTimer, 0, 60, 0, 255));
    text("📸", camX, camY);
    gesIconTimer--;
  }

  // Điểm 2 ngón tay
  if (handLandmarks) {
    let ngonCai = handLandmarks[4];
    let ngonTro = handLandmarks[8];
    // tọa độ tay dùng toàn màn hình (mirror)
    let caiX = (1 - ngonCai.x) * width;
    let caiY = ngonCai.y * height;
    let troX = (1 - ngonTro.x) * width;
    let troY = ngonTro.y * height;

    if (dangCham) {
      stroke("#ff4d6d"); strokeWeight(4);
      line(caiX, caiY, troX, troY);
    }
    noStroke();
    fill(dangCham ? "#ff4d6d" : 255);
    circle(caiX, caiY, 20);
    circle(troX, troY, 20);
  }

  pop();
}

// ============================================================
// 4 Filter theo mặt
// ============================================================
function veFilterMeo(camX, camY) {
  push();
  let mui    = lm(1,   camX, camY);
  let dinh   = lm(10,  camX, camY);
  let maTrai = lm(234, camX, camY);
  let maPhai = lm(454, camX, camY);
  let tl     = getFaceWidth(camX, camY) / 180;
  let cx = mui.x, cy = dinh.y;

  fill("#ffb6c1"); stroke("#cc7788"); strokeWeight(2 * tl);
  triangle(cx-110*tl, cy, cx-75*tl, cy-90*tl, cx-35*tl, cy);
  triangle(cx+35*tl,  cy, cx+75*tl, cy-90*tl, cx+110*tl, cy);
  fill("#ff9ab0"); noStroke();
  triangle(cx-100*tl, cy-5*tl, cx-75*tl, cy-78*tl, cx-48*tl, cy-5*tl);
  triangle(cx+48*tl,  cy-5*tl, cx+75*tl, cy-78*tl, cx+100*tl, cy-5*tl);

  stroke("#aaa"); strokeWeight(1.5 * tl);
  line(maTrai.x, maTrai.y-10*tl, maTrai.x-70*tl, maTrai.y-15*tl);
  line(maTrai.x, maTrai.y,       maTrai.x-70*tl, maTrai.y);
  line(maTrai.x, maTrai.y+10*tl, maTrai.x-70*tl, maTrai.y+12*tl);
  line(maPhai.x, maPhai.y-10*tl, maPhai.x+70*tl, maPhai.y-15*tl);
  line(maPhai.x, maPhai.y,       maPhai.x+70*tl, maPhai.y);
  line(maPhai.x, maPhai.y+10*tl, maPhai.x+70*tl, maPhai.y+12*tl);

  fill("#ff8fab"); noStroke();
  ellipse(mui.x, mui.y, 14*tl, 10*tl);
  pop();
}

function veFilterTho(camX, camY) {
  push();
  let mui  = lm(1,  camX, camY);
  let dinh = lm(10, camX, camY);
  let tl   = getFaceWidth(camX, camY) / 180;
  let cx = mui.x, cy = dinh.y;

  fill("#f5e6f5"); stroke("#d0b0d0"); strokeWeight(2 * tl);
  ellipse(cx-65*tl, cy-80*tl, 50*tl, 150*tl);
  ellipse(cx+65*tl, cy-80*tl, 50*tl, 150*tl);
  fill("#ffb6c1"); noStroke();
  ellipse(cx-65*tl, cy-80*tl, 26*tl, 100*tl);
  ellipse(cx+65*tl, cy-80*tl, 26*tl, 100*tl);
  fill("#ffaabb"); ellipse(mui.x, mui.y, 16*tl, 12*tl);
  pop();
}

function veFilterKinh(camX, camY) {
  push();
  let mTO = lm(33,  camX, camY);
  let mTT = lm(133, camX, camY);
  let mPT = lm(362, camX, camY);
  let mPO = lm(263, camX, camY);
  let tl  = getFaceWidth(camX, camY) / 180;

  let rong = dist(mTO.x, mTO.y, mTT.x, mTT.y) * 1.3;
  let cao  = rong * 0.65;
  let tamTrai = { x: (mTO.x+mTT.x)/2, y: (mTO.y+mTT.y)/2 };
  let tamPhai = { x: (mPO.x+mPT.x)/2, y: (mPO.y+mPT.y)/2 };

  noFill(); stroke("#222"); strokeWeight(5*tl); rectMode(CENTER);
  rect(tamTrai.x, tamTrai.y, rong, cao, 12*tl);
  rect(tamPhai.x, tamPhai.y, rong, cao, 12*tl);
  line(mTT.x, mTT.y, mPT.x, mPT.y);
  line(mTO.x, mTO.y, mTO.x-30*tl, mTO.y-5*tl);
  line(mPO.x, mPO.y, mPO.x+30*tl, mPO.y-5*tl);
  pop();
}

function veFilterVuong(camX, camY) {
  push();
  let mui  = lm(1,  camX, camY);
  let dinh = lm(10, camX, camY);
  let tl   = getFaceWidth(camX, camY) / 180;
  let cx = mui.x, cy = dinh.y;

  fill("#ffd700"); stroke("#cc9900"); strokeWeight(2*tl);
  beginShape();
  vertex(cx-110*tl, cy);       vertex(cx-80*tl,  cy-85*tl);
  vertex(cx-40*tl,  cy-28*tl); vertex(cx,         cy-110*tl);
  vertex(cx+40*tl,  cy-28*tl); vertex(cx+80*tl,  cy-85*tl);
  vertex(cx+110*tl, cy);       vertex(cx+110*tl, cy+35*tl);
  vertex(cx-110*tl, cy+35*tl);
  endShape(CLOSE);
  noStroke();
  fill("#ff4d6d"); circle(cx-68*tl, cy-8*tl,  20*tl);
  fill("#a78bfa"); circle(cx,        cy-50*tl, 20*tl);
  fill("#ff4d6d"); circle(cx+68*tl, cy-8*tl,  20*tl);
  pop();
}

// ============================================================
// Filter cố định (khi chưa nhận diện mặt)
// ============================================================
function veFilterCoDinh(x, y, loai) {
  push();
  if (loai === 0) {
    fill("#ffb6c1"); stroke("#cc7788"); strokeWeight(2);
    triangle(x-115,y-115,x-80,y-205,x-40,y-115);
    triangle(x+40,y-115,x+80,y-205,x+115,y-115);
    fill("#ff9ab0"); noStroke();
    triangle(x-104,y-122,x-80,y-190,x-52,y-122);
    triangle(x+52,y-122,x+80,y-190,x+104,y-122);
    stroke("#aaa"); strokeWeight(1.5);
    line(x-90,y+18,x-185,y+5); line(x-90,y+33,x-185,y+33);
    line(x+90,y+18,x+185,y+5); line(x+90,y+33,x+185,y+33);
    fill("#ff8fab"); noStroke(); ellipse(x,y+22,16,12);
  } else if (loai === 1) {
    fill("#f5e6f5"); stroke("#d0b0d0"); strokeWeight(2);
    ellipse(x-72,y-195,58,175); ellipse(x+72,y-195,58,175);
    fill("#ffb6c1"); noStroke();
    ellipse(x-72,y-195,30,115); ellipse(x+72,y-195,30,115);
    fill("#ffaabb"); ellipse(x,y+24,18,13);
  } else if (loai === 2) {
    noFill(); stroke("#222"); strokeWeight(5); rectMode(CORNER);
    rect(x-103,y-47,88,60,14); rect(x+15,y-47,88,60,14);
    line(x-15,y-22,x+15,y-22);
    line(x-103,y-22,x-135,y-16); line(x+103,y-22,x+135,y-16);
  } else if (loai === 3) {
    fill("#ffd700"); stroke("#cc9900"); strokeWeight(2);
    beginShape();
    vertex(x-115,y-105); vertex(x-85,y-195); vertex(x-42,y-128);
    vertex(x,y-215);     vertex(x+42,y-128); vertex(x+85,y-195);
    vertex(x+115,y-105); vertex(x+115,y-68); vertex(x-115,y-68);
    endShape(CLOSE);
    noStroke();
    fill("#ff4d6d"); circle(x-68,y-112,20);
    fill("#a78bfa"); circle(x,y-148,20);
    fill("#ff4d6d"); circle(x+68,y-112,20);
  }
  pop();
}

function updateParticles() {}

// ============================================================
// drawFaceStatus()
// ============================================================
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
