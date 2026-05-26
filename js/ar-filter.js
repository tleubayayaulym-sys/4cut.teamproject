function initFaceMesh(camera) {
  // MediaPipe не используем — ничего не делаем
}

function drawFaceStatus(w, h) {
  // Статус не показываем
}

// Главная функция фильтра
function drawARFilter(cx, cy, loaiFilter) {
  if      (loaiFilter === 0) veFilterMeo(cx, cy);
  else if (loaiFilter === 1) veFilterTho(cx, cy);
  else if (loaiFilter === 2) veFilterKinh(cx, cy);
  else if (loaiFilter === 3) veFilterVuong(cx, cy);
}

// 🐱 Кот
function veFilterMeo(cx, cy) {
  push();
  let y = cy - height * 0.12;

  // уши
  fill("#ffb6c1"); stroke("#cc7788"); strokeWeight(2);
  triangle(cx-110, y, cx-75, y-90, cx-35, y);
  triangle(cx+35,  y, cx+75, y-90, cx+110, y);
  fill("#ff9ab0"); noStroke();
  triangle(cx-100, y-5, cx-75, y-78, cx-48, y-5);
  triangle(cx+48,  y-5, cx+75, y-78, cx+100, y-5);

  // усы
  stroke("#aaa"); strokeWeight(1.5);
  line(cx-20, cy+10, cx-120, cy);
  line(cx-20, cy+25, cx-120, cy+25);
  line(cx+20, cy+10, cx+120, cy);
  line(cx+20, cy+25, cx+120, cy+25);

  // нос
  fill("#ff8fab"); noStroke();
  ellipse(cx, cy+15, 14, 10);
  pop();
}

// 🐰 Кролик
function veFilterTho(cx, cy) {
  push();
  let y = cy - height * 0.12;

  // уши
  fill("#f5e6f5"); stroke("#d0b0d0"); strokeWeight(2);
  ellipse(cx-65, y-80, 50, 150);
  ellipse(cx+65, y-80, 50, 150);
  fill("#ffb6c1"); noStroke();
  ellipse(cx-65, y-80, 26, 100);
  ellipse(cx+65, y-80, 26, 100);

  // нос
  fill("#ffaabb");
  ellipse(cx, cy+15, 16, 12);
  pop();
}

// 👓 Очки
function veFilterKinh(cx, cy) {
  push();
  let y = cy - height * 0.02;

  noFill(); stroke("#222"); strokeWeight(5);
  rectMode(CENTER);
  rect(cx-60, y, 100, 65, 14);
  rect(cx+60, y, 100, 65, 14);

  // переносица
  line(cx-10, y, cx+10, y);

  // дужки
  line(cx-110, y, cx-140, y-8);
  line(cx+110, y, cx+140, y-8);
  pop();
}

// 👑 Корона
function veFilterVuong(cx, cy) {
  push();
  let y = cy - height * 0.12;

  fill("#ffd700"); stroke("#cc9900"); strokeWeight(2);
  beginShape();
  vertex(cx-110, y);
  vertex(cx-80,  y-85);
  vertex(cx-40,  y-28);
  vertex(cx,     y-110);
  vertex(cx+40,  y-28);
  vertex(cx+80,  y-85);
  vertex(cx+110, y);
  vertex(cx+110, y+35);
  vertex(cx-110, y+35);
  endShape(CLOSE);

  noStroke();
  fill("#ff4d6d"); circle(cx-68, y-8,  20);
  fill("#a78bfa"); circle(cx,    y-50, 20);
  fill("#ff4d6d"); circle(cx+68, y-8,  20);
  pop();
}
function updateParticles() {}
function updateParticles() {}
