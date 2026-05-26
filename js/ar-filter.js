// ============================================================
// ar-filter.js
// Người phụ trách: 응웬 바오 담 (Tamy)
// Chức năng: nhận diện khuôn mặt + vẽ AR filter lên p5.js canvas
// Sử dụng: MediaPipe FaceMesh (nhận diện mặt) + p5.js (vẽ hình)
// ============================================================

// ---------- Biến trạng thái nhận diện mặt ----------
let moHinhMat = null;        // đối tượng FaceMesh của MediaPipe
let danhSachDiemMat = null;  // danh sách 478 điểm trên khuôn mặt
let daLoadXong = false;      // true khi mô hình đã tải xong

// ---------- Danh sách tên filter (배열 사용) ----------
let danhSachFilter = ["Cat 🐱", "Rabbit 🐰", "Glasses 👓", "Crown 👑"];

// ============================================================
// Hàm khởi động FaceMesh — gọi 1 lần trong setup()
// ============================================================
function khoiDongNhanDienMat(camera) {
  // lấy phần tử video thật từ p5.js createCapture
  let videoElement = camera.elt;

  // tạo đối tượng FaceMesh từ thư viện MediaPipe
  moHinhMat = new FaceMesh({
    locateFile: (tenFile) =>
      "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/" + tenFile
  });

  // cài đặt: chỉ nhận diện 1 khuôn mặt, độ chính xác 50%
  moHinhMat.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  // mỗi khi FaceMesh phát hiện khuôn mặt → lưu danh sách điểm
  moHinhMat.onResults((ketQua) => {
    if (ketQua.multiFaceLandmarks && ketQua.multiFaceLandmarks.length > 0) {
      danhSachDiemMat = ketQua.multiFaceLandmarks[0];
    } else {
      danhSachDiemMat = null; // không thấy mặt
    }
  });

  daLoadXong = true;

  // dùng setInterval để liên tục gửi frame video cho FaceMesh phân tích
  // (thay cho MediaPipe Camera utils để không bị xung đột với p5.js)
  let dangXuLy = false;
  setInterval(async () => {
    if (!dangXuLy && videoElement.readyState >= 2) {
      dangXuLy = true;
      try {
        await moHinhMat.send({ image: videoElement });
      } catch (e) {}
      dangXuLy = false;
    }
  }, 67); // ~15fps
}

// ============================================================
// Hàm lấy tọa độ 1 điểm trên mặt
// FaceMesh trả về tọa độ từ 0→1 (normalized)
// → cần chuyển sang tọa độ pixel của canvas p5.js
// ============================================================
function layToaDo(chiSo, tamX, tamY) {
  // nếu chưa nhận diện được mặt → trả về tâm màn hình
  if (!danhSachDiemMat || chiSo >= danhSachDiemMat.length) {
    return { x: tamX, y: tamY };
  }

  let diem = danhSachDiemMat[chiSo];

  // diem.x và diem.y là tỉ lệ từ 0→1 so với khung hình video
  // nhân với width/height để ra tọa độ thực trên canvas
  // (diem.x - 0.5) vì gốc tọa độ của FaceMesh là góc trên trái
  // còn p5.js tính từ tâm canvas khi dùng camX = width/2
  return {
    x: tamX + (diem.x - 0.5) * width,
    y: tamY + (diem.y - 0.5) * height
  };
}

// Tính độ rộng khuôn mặt (dùng để scale filter theo mặt to/nhỏ)
function tinhRongMat(tamX, tamY) {
  let diemTrai  = layToaDo(234, tamX, tamY); // má trái
  let diemPhai  = layToaDo(454, tamX, tamY); // má phải
  return dist(diemTrai.x, diemTrai.y, diemPhai.x, diemPhai.y);
}

// ============================================================
// Hàm vẽ AR filter chính — gọi trong drawCamera() của camera.js
// tamX, tamY = tâm màn hình (width/2, height/2)
// loaiFilter = 0/1/2/3
// ============================================================
function veARFilter(tamX, tamY, loaiFilter) {
  if (danhSachDiemMat) {
    // có khuôn mặt → vẽ bám theo mặt
    if      (loaiFilter === 0) veFilterMeo(tamX, tamY);
    else if (loaiFilter === 1) veFilterTho(tamX, tamY);
    else if (loaiFilter === 2) veFilterKinh(tamX, tamY);
    else if (loaiFilter === 3) veFilterVuong(tamX, tamY);
  } else {
    // chưa nhận diện được mặt → vẽ cố định ở giữa màn hình
    veFilterCodinh(tamX, tamY - height * 0.08, loaiFilter);
  }
}

// ============================================================
// 🐱 Filter mèo — tai + râu + mũi
// ============================================================
function veFilterMeo(tamX, tamY) {
  push();

  // lấy các điểm cần thiết trên khuôn mặt
  let muiNguoi   = layToaDo(1,   tamX, tamY); // đầu mũi
  let dinhDau    = layToaDo(10,  tamX, tamY); // đỉnh đầu
  let maTrai     = layToaDo(234, tamX, tamY); // má trái
  let maPhai     = layToaDo(454, tamX, tamY); // má phải
  let tyLe       = tinhRongMat(tamX, tamY) / 180; // tỉ lệ scale

  let cx = muiNguoi.x;
  let cy = dinhDau.y;

  // --- vẽ tai mèo (dùng triangle — đã học) ---
  fill("#ffb6c1");
  stroke("#cc7788");
  strokeWeight(2 * tyLe);
  triangle(cx - 110*tyLe, cy, cx - 75*tyLe, cy - 90*tyLe, cx - 35*tyLe, cy);
  triangle(cx + 35*tyLe,  cy, cx + 75*tyLe, cy - 90*tyLe, cx + 110*tyLe, cy);

  // --- màu hồng bên trong tai ---
  fill("#ff9ab0");
  noStroke();
  triangle(cx - 100*tyLe, cy - 5*tyLe, cx - 75*tyLe, cy - 78*tyLe, cx - 48*tyLe, cy - 5*tyLe);
  triangle(cx + 48*tyLe,  cy - 5*tyLe, cx + 75*tyLe, cy - 78*tyLe, cx + 100*tyLe, cy - 5*tyLe);

  // --- râu mèo (dùng line — đã học) ---
  stroke("#aaa");
  strokeWeight(1.5 * tyLe);
  line(maTrai.x, maTrai.y - 10*tyLe, maTrai.x - 70*tyLe, maTrai.y - 15*tyLe);
  line(maTrai.x, maTrai.y,            maTrai.x - 70*tyLe, maTrai.y);
  line(maTrai.x, maTrai.y + 10*tyLe,  maTrai.x - 70*tyLe, maTrai.y + 12*tyLe);
  line(maPhai.x, maPhai.y - 10*tyLe,  maPhai.x + 70*tyLe, maPhai.y - 15*tyLe);
  line(maPhai.x, maPhai.y,             maPhai.x + 70*tyLe, maPhai.y);
  line(maPhai.x, maPhai.y + 10*tyLe,  maPhai.x + 70*tyLe, maPhai.y + 12*tyLe);

  // --- mũi mèo (dùng ellipse — đã học) ---
  fill("#ff8fab");
  noStroke();
  ellipse(muiNguoi.x, muiNguoi.y, 14 * tyLe, 10 * tyLe);

  pop();
}

// ============================================================
// 🐰 Filter thỏ — tai dài + mũi hồng
// ============================================================
function veFilterTho(tamX, tamY) {
  push();

  let muiNguoi = layToaDo(1,  tamX, tamY);
  let dinhDau  = layToaDo(10, tamX, tamY);
  let tyLe     = tinhRongMat(tamX, tamY) / 180;
  let cx = muiNguoi.x;
  let cy = dinhDau.y;

  // --- tai thỏ (dùng ellipse — đã học) ---
  fill("#f5e6f5");
  stroke("#d0b0d0");
  strokeWeight(2 * tyLe);
  ellipse(cx - 65*tyLe, cy - 80*tyLe, 50*tyLe, 150*tyLe);
  ellipse(cx + 65*tyLe, cy - 80*tyLe, 50*tyLe, 150*tyLe);

  // --- bên trong tai ---
  fill("#ffb6c1");
  noStroke();
  ellipse(cx - 65*tyLe, cy - 80*tyLe, 26*tyLe, 100*tyLe);
  ellipse(cx + 65*tyLe, cy - 80*tyLe, 26*tyLe, 100*tyLe);

  // --- mũi thỏ ---
  fill("#ffaabb");
  ellipse(muiNguoi.x, muiNguoi.y, 16*tyLe, 12*tyLe);

  pop();
}

// ============================================================
// 👓 Filter kính — 2 mắt kính + gọng
// ============================================================
function veFilterKinh(tamX, tamY) {
  push();

  // lấy 4 góc của 2 mắt
  let matTraiNgoai  = layToaDo(33,  tamX, tamY);
  let matTraiTrong  = layToaDo(133, tamX, tamY);
  let matPhaiTrong  = layToaDo(362, tamX, tamY);
  let matPhaiNgoai  = layToaDo(263, tamX, tamY);
  let tyLe          = tinhRongMat(tamX, tamY) / 180;

  // tính kích thước tròng kính theo khoảng cách giữa 2 điểm mắt
  let chieuRong  = dist(matTraiNgoai.x, matTraiNgoai.y,
                        matTraiTrong.x, matTraiTrong.y) * 1.3;
  let chieuCao   = chieuRong * 0.65;

  // tâm của mắt trái và mắt phải
  let tamMatTrai  = { x: (matTraiNgoai.x + matTraiTrong.x) / 2,
                      y: (matTraiNgoai.y + matTraiTrong.y) / 2 };
  let tamMatPhai  = { x: (matPhaiNgoai.x + matPhaiTrong.x) / 2,
                      y: (matPhaiNgoai.y + matPhaiTrong.y) / 2 };

  // --- vẽ 2 tròng kính (dùng rect — đã học) ---
  noFill();
  stroke("#222");
  strokeWeight(5 * tyLe);
  rectMode(CENTER);
  rect(tamMatTrai.x, tamMatTrai.y, chieuRong, chieuCao, 12 * tyLe);
  rect(tamMatPhai.x, tamMatPhai.y, chieuRong, chieuCao, 12 * tyLe);

  // --- cầu nối giữa 2 kính ---
  line(matTraiTrong.x, matTraiTrong.y, matPhaiTrong.x, matPhaiTrong.y);

  // --- gọng 2 bên ---
  line(matTraiNgoai.x, matTraiNgoai.y,
       matTraiNgoai.x - 30*tyLe, matTraiNgoai.y - 5*tyLe);
  line(matPhaiNgoai.x, matPhaiNgoai.y,
       matPhaiNgoai.x + 30*tyLe, matPhaiNgoai.y - 5*tyLe);

  pop();
}

// ============================================================
// 👑 Filter vương miện — đa giác vàng + đá quý
// ============================================================
function veFilterVuong(tamX, tamY) {
  push();

  let muiNguoi = layToaDo(1,  tamX, tamY);
  let dinhDau  = layToaDo(10, tamX, tamY);
  let tyLe     = tinhRongMat(tamX, tamY) / 180;
  let cx = muiNguoi.x;
  let cy = dinhDau.y;

  // --- thân vương miện (dùng beginShape/vertex — đã học) ---
  fill("#ffd700");
  stroke("#cc9900");
  strokeWeight(2 * tyLe);
  beginShape();
  vertex(cx - 110*tyLe, cy);
  vertex(cx - 80*tyLe,  cy - 85*tyLe);
  vertex(cx - 40*tyLe,  cy - 28*tyLe);
  vertex(cx,            cy - 110*tyLe);
  vertex(cx + 40*tyLe,  cy - 28*tyLe);
  vertex(cx + 80*tyLe,  cy - 85*tyLe);
  vertex(cx + 110*tyLe, cy);
  vertex(cx + 110*tyLe, cy + 35*tyLe);
  vertex(cx - 110*tyLe, cy + 35*tyLe);
  endShape(CLOSE);

  // --- đá quý trên vương miện (dùng circle — đã học) ---
  noStroke();
  fill("#ff4d6d");
  circle(cx - 68*tyLe, cy - 8*tyLe,  20 * tyLe);
  fill("#a78bfa");
  circle(cx,           cy - 50*tyLe, 20 * tyLe);
  fill("#ff4d6d");
  circle(cx + 68*tyLe, cy - 8*tyLe,  20 * tyLe);

  pop();
}

// ============================================================
// Filter cố định (khi chưa nhận diện được mặt)
// vị trí cố định ở giữa màn hình
// ============================================================
function veFilterCodinh(x, y, loaiFilter) {
  if      (loaiFilter === 0) veMeoCoDinh(x, y);
  else if (loaiFilter === 1) veThoCoDinh(x, y);
  else if (loaiFilter === 2) veKinhCoDinh(x, y);
  else if (loaiFilter === 3) veVuongCoDinh(x, y);
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
  line(x-90,y+18, x-185,y+5);  line(x-90,y+33, x-185,y+33);
  line(x+90,y+18, x+185,y+5);  line(x+90,y+33, x+185,y+33);
  fill("#ff8fab"); noStroke(); ellipse(x, y+22, 16, 12);
  pop();
}

function veThoCoDinh(x, y) {
  push();
  fill("#f5e6f5"); stroke("#d0b0d0"); strokeWeight(2);
  ellipse(x-72, y-195, 58, 175); ellipse(x+72, y-195, 58, 175);
  fill("#ffb6c1"); noStroke();
  ellipse(x-72, y-195, 30, 115); ellipse(x+72, y-195, 30, 115);
  fill("#ffaabb"); ellipse(x, y+24, 18, 13);
  pop();
}

function veKinhCoDinh(x, y) {
  push();
  noFill(); stroke("#222"); strokeWeight(5); rectMode(CORNER);
  rect(x-103, y-47, 88, 60, 14); rect(x+15, y-47, 88, 60, 14);
  line(x-15, y-22, x+15, y-22);
  line(x-103, y-22, x-135, y-16); line(x+103, y-22, x+135, y-16);
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
  fill("#ff4d6d"); circle(x-68, y-112, 20);
  fill("#a78bfa"); circle(x,    y-148, 20);
  fill("#ff4d6d"); circle(x+68, y-112, 20);
  pop();
}

// ============================================================
// Hiện trạng thái nhận diện mặt (góc dưới trái màn hình)
// ============================================================
function hienTrangThaiMat(chieuRongCanvas, chieuCaoCanvas) {
  push();
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);

  if (!daLoadXong) {
    fill(255, 200, 0, 200);
    text("⏳ Đang tải mô hình nhận diện mặt...", 20, chieuCaoCanvas - 55);
  } else if (!danhSachDiemMat) {
    fill(255, 100, 100, 200);
    text("😶 Hướng mặt vào camera", 20, chieuCaoCanvas - 55);
  } else {
    fill(100, 220, 100, 200);
    text("✅ Đang nhận diện khuôn mặt", 20, chieuCaoCanvas - 55);
  }

function initFaceMesh(camera)      { khoiDongNhanDienMat(camera); }
function drawARFilter(x, y, f)     { veARFilter(x, y, f); }
function drawFaceStatus(w, h)      { hienTrangThaiMat(w, h); }
  pop();
}
