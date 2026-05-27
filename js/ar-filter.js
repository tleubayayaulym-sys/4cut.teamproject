// ar-filter.js — 담당: 응웬 바오 담 (Tamy)
// Chức năng: nhận diện khuôn mặt + vẽ AR filter lên canvas
// fullscreen camera → dùng width/height thay vì CAM_W/CAM_H cố định

// --- Biến trạng thái ---
let faceMesh     = null;  // đối tượng FaceMesh
let faceLandmarks = null; // 478 điểm trên khuôn mặt
let faceReady    = false; // true khi mô hình đã tải xong
let particles    = [];    // mảng particle (배열 사용)

// --- Danh sách tên filter (배열 사용) ---
let filterNames = ["Cat 🐱", "Rabbit 🐰", "Glasses 👓", "Crown 👑"];

// ============================================================
// initFaceMesh() — khởi động nhận diện khuôn mặt
// Gọi 1 lần trong setupCamera() của camera.js
// ============================================================
function initFaceMesh(camera) {
  let videoEl = camera.elt; // lấy phần tử <video> thật từ p5.js

  // tạo mô hình FaceMesh từ MediaPipe
  faceMesh = new FaceMesh({
    locateFile: (file) =>
      "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/" + file
  });

  // cài đặt: nhận diện tối đa 1 khuôn mặt
  faceMesh.setOptions({
    maxNumFaces:            1,
    refineLandmarks:        true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence:  0.5
  });

  // mỗi khi FaceMesh phát hiện mặt → lưu danh sách điểm
  faceMesh.onResults((results) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      faceLandmarks = results.multiFaceLandmarks[0];
    } else {
      faceLandmarks = null;
    }
  });

  faceReady = true;

  // setInterval: liên tục gửi frame video cho FaceMesh (~15fps)
  // dùng setInterval thay vì MediaPipe Camera để không xung đột với p5.js
  let dangXuLy = false;
  setInterval(async () => {
    if (!dangXuLy && videoEl.readyState >= 2) {
      dangXuLy = true;
      try { await faceMesh.send({ image: videoEl }); } catch (e) {}
      dangXuLy = false;
    }
  }, 67);
}

// ============================================================
// lm() — chuyển tọa độ FaceMesh (0→1) sang tọa độ canvas p5.js
// fullscreen: nhân với width/height thay vì CAM_W/CAM_H cố định
// ============================================================
function lm(index, camX, camY) {
  if (!faceLandmarks || index >= faceLandmarks.length) {
    return { x: camX, y: camY }; // chưa thấy mặt → trả về tâm màn hình
  }
  let d = faceLandmarks[index];
  return {
    x: camX + (d.x - 0.5) * width,
    y: camY + (d.y - 0.5) * height
  };
}

// Tính độ rộng khuôn mặt → scale filter theo mặt to/nhỏ
function faceWidth(camX, camY) {
  let trai = lm(234, camX, camY); // má trái
  let phai = lm(454, camX, camY); // má phải
  return dist(trai.x, trai.y, phai.x, phai.y);
}

// ============================================================
// drawARFilter() — hàm chính, gọi từ drawCamera() trong camera.js
// camX=width/2, camY=height/2 (tâm màn hình fullscreen)
// ============================================================
function drawARFilter(camX, camY, filterType) {
  if (faceLandmarks) {
    // nhận diện được mặt → filter bám theo mặt
    if      (filterType === 0) drawCatFilter_tracked(camX, camY);
    else if (filterType === 1) drawRabbitFilter_tracked(camX, camY);
    else if (filterType === 2) drawGlassesFilter_tracked(camX, camY);
    else if (filterType === 3) drawCrownFilter_tracked(camX, camY);
  } else {
    // chưa thấy mặt → filter cố định giữa màn hình
    drawARFilter_fixed(camX, camY - height * 0.08, filterType);
  }
}

// ============================================================
// 🐱 Filter mèo — tai + râu + mũi
// ============================================================
function drawCatFilter_tracked(camX, camY) {
  push();
  let mui    = lm(1,   camX, camY); // đầu mũi
  let dinh   = lm(10,  camX, camY); // đỉnh đầu
  let maTrai = lm(234, camX, camY); // má trái
  let maPhai = lm(454, camX, camY); // má phải
  let tl     = faceWidth(camX, camY) / 180; // tỉ lệ scale
  let cx = mui.x;
  let cy = dinh.y;

  // tai mèo — dùng triangle() đã học
  fill("#ffb6c1"); stroke("#cc7788"); strokeWeight(2 * tl);
  triangle(cx-110*tl, cy, cx-75*tl, cy-90*tl, cx-35*tl, cy);
  triangle(cx+35*tl,  cy, cx+75*tl, cy-90*tl, cx+110*tl, cy);
  fill("#ff9ab0"); noStroke();
  triangle(cx-100*tl, cy-5*tl, cx-75*tl, cy-78*tl, cx-48*tl, cy-5*tl);
  triangle(cx+48*tl,  cy-5*tl, cx+75*tl, cy-78*tl, cx+100*tl, cy-5*tl);

  // râu mèo — dùng line() đã học
  stroke("#aaa"); strokeWeight(1.5 * tl);
  line(maTrai.x, maTrai.y-10*tl, maTrai.x-70*tl, maTrai.y-15*tl);
  line(maTrai.x, maTrai.y,       maTrai.x-70*tl, maTrai.y);
  line(maTrai.x, maTrai.y+10*tl, maTrai.x-70*tl, maTrai.y+12*tl);
  line(maPhai.x, maPhai.y-10*tl, maPhai.x+70*tl, maPhai.y-15*tl);
  line(maPhai.x, maPhai.y,       maPhai.x+70*tl, maPhai.y);
  line(maPhai.x, maPhai.y+10*tl, maPhai.x+70*tl, maPhai.y+12*tl);

  // mũi mèo — dùng ellipse() đã học
  fill("#ff8fab"); noStroke();
  ellipse(mui.x, mui.y, 14*tl, 10*tl);
  pop();
}

// ============================================================
// 🐰 Filter thỏ — tai dài + mũi hồng
// ============================================================
function drawRabbitFilter_tracked(camX, camY) {
  push();
  let mui  = lm(1,  camX, camY);
  let dinh = lm(10, camX, camY);
  let tl   = faceWidth(camX, camY) / 180;
  let cx = mui.x;
  let cy = dinh.y;

  // tai thỏ — dùng ellipse() đã học
  fill("#f5e6f5"); stroke("#d0b0d0"); strokeWeight(2 * tl);
  ellipse(cx-65*tl, cy-80*tl, 50*tl, 150*tl);
  ellipse(cx+65*tl, cy-80*tl, 50*tl, 150*tl);
  fill("#ffb6c1"); noStroke();
  ellipse(cx-65*tl, cy-80*tl, 26*tl, 100*tl);
  ellipse(cx+65*tl, cy-80*tl, 26*tl, 100*tl);
  fill("#ffaabb"); ellipse(mui.x, mui.y, 16*tl, 12*tl);
  pop();
}

// ============================================================
// 👓 Filter kính — 2 tròng kính + gọng
// ============================================================
function drawGlassesFilter_tracked(camX, camY) {
  push();
  let mTO = lm(33,  camX, camY); // mắt trái ngoài
  let mTT = lm(133, camX, camY); // mắt trái trong
  let mPT = lm(362, camX, camY); // mắt phải trong
  let mPO = lm(263, camX, camY); // mắt phải ngoài
  let tl  = faceWidth(camX, camY) / 180;

  let rong = dist(mTO.x, mTO.y, mTT.x, mTT.y) * 1.3;
  let cao  = rong * 0.65;
  let tamTrai = { x: (mTO.x+mTT.x)/2, y: (mTO.y+mTT.y)/2 };
  let tamPhai = { x: (mPO.x+mPT.x)/2, y: (mPO.y+mPT.y)/2 };

  // vẽ 2 tròng kính — dùng rect() đã học
  noFill(); stroke("#222"); strokeWeight(5*tl); rectMode(CENTER);
  rect(tamTrai.x, tamTrai.y, rong, cao, 12*tl);
  rect(tamPhai.x, tamPhai.y, rong, cao, 12*tl);
  line(mTT.x, mTT.y, mPT.x, mPT.y);
  line(mTO.x, mTO.y, mTO.x-30*tl, mTO.y-5*tl);
  line(mPO.x, mPO.y, mPO.x+30*tl, mPO.y-5*tl);
  pop();
}

// ============================================================
// 👑 Filter vương miện
// ============================================================
function drawCrownFilter_tracked(camX, camY) {
  push();
  let mui  = lm(1,  camX, camY);
  let dinh = lm(10, camX, camY);
  let tl   = faceWidth(camX, camY) / 180;
  let cx = mui.x;
  let cy = dinh.y;

  // thân vương miện — dùng beginShape/vertex đã học
  fill("#ffd700"); stroke("#cc9900"); strokeWeight(2*tl);
  beginShape();
  vertex(cx-110*tl, cy);       vertex(cx-80*tl,  cy-85*tl);
  vertex(cx-40*tl,  cy-28*tl); vertex(cx,         cy-110*tl);
  vertex(cx+40*tl,  cy-28*tl); vertex(cx+80*tl,  cy-85*tl);
  vertex(cx+110*tl, cy);       vertex(cx+110*tl, cy+35*tl);
  vertex(cx-110*tl, cy+35*tl);
  endShape(CLOSE);

  // đá quý — dùng circle() đã học
  noStroke();
  fill("#ff4d6d"); circle(cx-68*tl, cy-8*tl,  20*tl);
  fill("#a78bfa"); circle(cx,        cy-50*tl, 20*tl);
  fill("#ff4d6d"); circle(cx+68*tl, cy-8*tl,  20*tl);
  pop();
}

// ============================================================
// Filter cố định (khi chưa nhận diện được mặt)
// ============================================================
function drawARFilter_fixed(x, y, filterType) {
  if      (filterType === 0) drawCatFixed(x, y);
  else if (filterType === 1) drawRabbitFixed(x, y);
  else if (filterType === 2) drawGlassesFixed(x, y);
  else if (filterType === 3) drawCrownFixed(x, y);
}

function drawCatFixed(x, y) {
  push();
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
  pop();
}

function drawRabbitFixed(x, y) {
  push();
  fill("#f5e6f5"); stroke("#d0b0d0"); strokeWeight(2);
  ellipse(x-72,y-195,58,175); ellipse(x+72,y-195,58,175);
  fill("#ffb6c1"); noStroke();
  ellipse(x-72,y-195,30,115); ellipse(x+72,y-195,30,115);
  fill("#ffaabb"); ellipse(x,y+24,18,13);
  pop();
}

function drawGlassesFixed(x, y) {
  push();
  noFill(); stroke("#222"); strokeWeight(5); rectMode(CORNER);
  rect(x-103,y-47,88,60,14); rect(x+15,y-47,88,60,14);
  line(x-15,y-22,x+15,y-22);
  line(x-103,y-22,x-135,y-16); line(x+103,y-22,x+135,y-16);
  pop();
}

function drawCrownFixed(x, y) {
  push();
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
  pop();
}

// ============================================================
// updateParticles() — hàm rỗng (đã bỏ particle theo yêu cầu)
// Giữ lại để camera.js không bị lỗi "not defined"
// ============================================================
function updateParticles() {}

// ============================================================
// drawFaceStatus() — hiện trạng thái nhận diện mặt
// Gọi từ drawCamera() trong camera.js
// ============================================================
function drawFaceStatus(w, h) {
  push();
  noStroke(); textAlign(LEFT, CENTER); textSize(14);
  if (!faceReady) {
    fill(255, 200, 0, 200);
    text("⏳ Đang tải mô hình...", 20, h - 55);
  } else if (!faceLandmarks) {
    fill(255, 100, 100, 200);
    text("😶 Hướng mặt vào camera", 20, h - 55);
  } else {
    fill(100, 220, 100, 200);
    text("✅ Đang nhận diện khuôn mặt", 20, h - 55);
  }
  pop();
}
