// ============================================================
// ar-filter.js — Người phụ trách: 응웬 바오 담 (Tamy)
// Chức năng: nhận diện khuôn mặt + vẽ AR filter lên canvas
// Thư viện: MediaPipe FaceMesh (nhận diện) + p5.js (vẽ hình)
// ============================================================

// --- Biến lưu trạng thái nhận diện mặt ---
let moHinhMat     = null;  // đối tượng FaceMesh
let dsDiemMat     = null;  // 478 điểm trên khuôn mặt (hoặc null nếu không thấy mặt)
let daLoadXong    = false; // true khi mô hình đã tải xong

// --- Danh sách tên filter (배열 사용) ---
let danhSachFilter = ["Cat 🐱", "Rabbit 🐰", "Glasses 👓", "Crown 👑"];

// ============================================================
// initFaceMesh() — khởi động nhận diện khuôn mặt
// Gọi 1 lần trong setupCamera() của camera.js
// ============================================================
function initFaceMesh(camera) {
  // lấy phần tử <video> thật từ p5.js
  let videoEl = camera.elt;

  // tạo mô hình FaceMesh từ MediaPipe
  moHinhMat = new FaceMesh({
    locateFile: (tenFile) =>
      "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/" + tenFile
  });

  // cài đặt: nhận diện tối đa 1 khuôn mặt
  moHinhMat.setOptions({
    maxNumFaces:            1,
    refineLandmarks:        true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence:  0.5
  });

  // mỗi khi FaceMesh phát hiện mặt → lưu danh sách điểm vào dsDiemMat
  moHinhMat.onResults((ketQua) => {
    if (ketQua.multiFaceLandmarks && ketQua.multiFaceLandmarks.length > 0) {
      dsDiemMat = ketQua.multiFaceLandmarks[0];
    } else {
      dsDiemMat = null;
    }
  });

  daLoadXong = true;

  // setInterval: liên tục gửi frame video cho FaceMesh phân tích (~15fps)
  // dùng setInterval thay vì MediaPipe Camera để không xung đột với p5.js
  let dangXuLy = false;
  setInterval(async () => {
    if (!dangXuLy && videoEl.readyState >= 2) {
      dangXuLy = true;
      try { await moHinhMat.send({ image: videoEl }); } catch (e) {}
      dangXuLy = false;
    }
  }, 67);
}

// ============================================================
// layDiem() — chuyển tọa độ từ FaceMesh sang tọa độ p5.js
// FaceMesh trả về giá trị từ 0→1 (tỉ lệ so với khung hình)
// → nhân với width/height để ra pixel thực trên canvas
// ============================================================
function layDiem(chiSo, tamX, tamY) {
  if (!dsDiemMat || chiSo >= dsDiemMat.length) {
    return { x: tamX, y: tamY }; // chưa thấy mặt → trả về tâm màn hình
  }
  let d = dsDiemMat[chiSo];
  return {
    x: tamX + (d.x - 0.5) * width,
    y: tamY + (d.y - 0.5) * height
  };
}

// Tính độ rộng khuôn mặt → dùng để scale filter theo mặt to/nhỏ
function tinhRongMat(tamX, tamY) {
  let trai  = layDiem(234, tamX, tamY); // má trái
  let phai  = layDiem(454, tamX, tamY); // má phải
  return dist(trai.x, trai.y, phai.x, phai.y);
}

// ============================================================
// drawARFilter() — hàm chính, gọi từ drawCamera() trong camera.js
// tamX, tamY = tâm màn hình (width/2, height/2)
// ============================================================
function drawARFilter(tamX, tamY, loaiFilter) {
  if (dsDiemMat) {
    // nhận diện được mặt → vẽ bám theo mặt
    if      (loaiFilter === 0) veFilterMeo(tamX, tamY);
    else if (loaiFilter === 1) veFilterTho(tamX, tamY);
    else if (loaiFilter === 2) veFilterKinh(tamX, tamY);
    else if (loaiFilter === 3) veFilterVuong(tamX, tamY);
  } else {
    // chưa thấy mặt → vẽ cố định ở giữa màn hình
    veFilterCoDinh(tamX, tamY - height * 0.08, loaiFilter);
  }
}

// ============================================================
// 🐱 Filter mèo
// ============================================================
function veFilterMeo(tamX, tamY) {
  push();
  let mui    = layDiem(1,   tamX, tamY); // đầu mũi
  let dinh   = layDiem(10,  tamX, tamY); // đỉnh đầu
  let maTrai = layDiem(234, tamX, tamY); // má trái
  let maPhai = layDiem(454, tamX, tamY); // má phải
  let tl     = tinhRongMat(tamX, tamY) / 180; // tỉ lệ scale
  let cx = mui.x;
  let cy = dinh.y;

  // tai mèo — dùng triangle() đã học
  fill("#ffb6c1"); stroke("#cc7788"); strokeWeight(2 * tl);
  triangle(cx-110*tl, cy, cx-75*tl, cy-90*tl, cx-35*tl, cy);
  triangle(cx+35*tl,  cy, cx+75*tl, cy-90*tl, cx+110*tl, cy);

  // màu bên trong tai
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
// 🐰 Filter thỏ
// ============================================================
function veFilterTho(tamX, tamY) {
  push();
  let mui  = layDiem(1,  tamX, tamY);
  let dinh = layDiem(10, tamX, tamY);
  let tl   = tinhRongMat(tamX, tamY) / 180;
  let cx = mui.x;
  let cy = dinh.y;

  // tai thỏ — dùng ellipse() đã học
  fill("#f5e6f5"); stroke("#d0b0d0"); strokeWeight(2 * tl);
  ellipse(cx-65*tl, cy-80*tl, 50*tl, 150*tl);
  ellipse(cx+65*tl, cy-80*tl, 50*tl, 150*tl);

  // màu bên trong tai
  fill("#ffb6c1"); noStroke();
  ellipse(cx-65*tl, cy-80*tl, 26*tl, 100*tl);
  ellipse(cx+65*tl, cy-80*tl, 26*tl, 100*tl);

  // mũi thỏ
  fill("#ffaabb");
  ellipse(mui.x, mui.y, 16*tl, 12*tl);
  pop();
}

// ============================================================
// 👓 Filter kính
// ============================================================
function veFilterKinh(tamX, tamY) {
  push();
  // 4 điểm góc của 2 mắt
  let mTO = layDiem(33,  tamX, tamY); // mắt trái ngoài
  let mTT = layDiem(133, tamX, tamY); // mắt trái trong
  let mPT = layDiem(362, tamX, tamY); // mắt phải trong
  let mPO = layDiem(263, tamX, tamY); // mắt phải ngoài
  let tl  = tinhRongMat(tamX, tamY) / 180;

  // tính kích thước tròng kính theo khoảng cách 2 điểm mắt
  let rong = dist(mTO.x, mTO.y, mTT.x, mTT.y) * 1.3;
  let cao  = rong * 0.65;

  // tâm của từng mắt
  let tamTrai = { x: (mTO.x + mTT.x) / 2, y: (mTO.y + mTT.y) / 2 };
  let tamPhai = { x: (mPO.x + mPT.x) / 2, y: (mPO.y + mPT.y) / 2 };

  // vẽ 2 tròng kính — dùng rect() đã học
  noFill(); stroke("#222"); strokeWeight(5 * tl); rectMode(CENTER);
  rect(tamTrai.x, tamTrai.y, rong, cao, 12*tl);
  rect(tamPhai.x, tamPhai.y, rong, cao, 12*tl);

  // cầu nối + gọng — dùng line() đã học
  line(mTT.x, mTT.y, mPT.x, mPT.y);
  line(mTO.x, mTO.y, mTO.x - 30*tl, mTO.y - 5*tl);
  line(mPO.x, mPO.y, mPO.x + 30*tl, mPO.y - 5*tl);
  pop();
}

// ============================================================
// 👑 Filter vương miện
// ============================================================
function veFilterVuong(tamX, tamY) {
  push();
  let mui  = layDiem(1,  tamX, tamY);
  let dinh = layDiem(10, tamX, tamY);
  let tl   = tinhRongMat(tamX, tamY) / 180;
  let cx = mui.x;
  let cy = dinh.y;

  // thân vương miện — dùng beginShape/vertex đã học
  fill("#ffd700"); stroke("#cc9900"); strokeWeight(2*tl);
  beginShape();
  vertex(cx-110*tl, cy);        vertex(cx-80*tl,  cy-85*tl);
  vertex(cx-40*tl,  cy-28*tl);  vertex(cx,         cy-110*tl);
  vertex(cx+40*tl,  cy-28*tl);  vertex(cx+80*tl,  cy-85*tl);
  vertex(cx+110*tl, cy);        vertex(cx+110*tl, cy+35*tl);
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
function veFilterCoDinh(x, y, loai) {
  if      (loai === 0) veMeoCoDinh(x, y);
  else if (loai === 1) veThoCoDinh(x, y);
  else if (loai === 2) veKinhCoDinh(x, y);
  else if (loai === 3) veVuongCoDinh(x, y);
}

function veMeoCoDinh(x, y) {
  push();
  fill("#ffb6c1"); stroke("#cc7788"); strokeWeight(2);
  triangle(x-115,y-115, x-80,y-205, x-40,y-115);
  triangle(x+40,y-115,  x+80,y-205, x+115,y-115);
  fill("#ff9ab0"); noStroke();
  triangle(x-104,y-122, x-80,y-190, x-52,y-122);
  triangle(x+52,y-122,  x+80,y-190, x+104,y-122);
  stroke("#aaa"); strokeWeight(1.5);
  line(x-90,y+18,x-185,y+5);  line(x-90,y+33,x-185,y+33);
  line(x+90,y+18,x+185,y+5);  line(x+90,y+33,x+185,y+33);
  fill("#ff8fab"); noStroke(); ellipse(x,y+22,16,12);
  pop();
}

function veThoCoDinh(x, y) {
  push();
  fill("#f5e6f5"); stroke("#d0b0d0"); strokeWeight(2);
  ellipse(x-72,y-195,58,175); ellipse(x+72,y-195,58,175);
  fill("#ffb6c1"); noStroke();
  ellipse(x-72,y-195,30,115); ellipse(x+72,y-195,30,115);
  fill("#ffaabb"); ellipse(x,y+24,18,13);
  pop();
}

function veKinhCoDinh(x, y) {
  push();
  noFill(); stroke("#222"); strokeWeight(5); rectMode(CORNER);
  rect(x-103,y-47,88,60,14); rect(x+15,y-47,88,60,14);
  line(x-15,y-22,x+15,y-22);
  line(x-103,y-22,x-135,y-16); line(x+103,y-22,x+135,y-16);
  pop();
}

function veVuongCoDinh(x, y) {
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
// drawFaceStatus() — hiển thị trạng thái nhận diện mặt
// Gọi từ drawCamera() trong camera.js
// ============================================================
function drawFaceStatus(w, h) {
  push();
  noStroke(); textAlign(LEFT, CENTER); textSize(14);
  if (!daLoadXong) {
    fill(255, 200, 0, 200);
    text("⏳ Đang tải mô hình nhận diện mặt...", 20, h - 55);
  } else if (!dsDiemMat) {
    fill(255, 100, 100, 200);
    text("😶 Hướng mặt vào camera", 20, h - 55);
  } else {
    fill(100, 220, 100, 200);
    text("✅ Đang nhận diện khuôn mặt", 20, h - 55);
  }
  pop();
}
