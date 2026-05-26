// ============================================================
// ar-filter.js — 담당: 응웬 바오 담 (Tamy)
// MediaPipe FaceMesh 기반 실시간 AR 필터 + 파티클 시스템
// fullscreen 카메라 대응 (width/height 동적 사용)
// ============================================================

let faceMesh = null;
let faceLandmarks = null;
let faceReady = false;
let particles = [];
let selectedFilter = 0; // 0=Cat 1=Rabbit 2=Glasses 3=Crown

// ============================================================
// INIT — main.js의 setup()에서 호출
// ============================================================
function initFaceMesh(camElement) {
  const videoEl = camElement.elt;
  faceMesh = new FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  faceMesh.onResults((results) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      faceLandmarks = results.multiFaceLandmarks[0];
    } else {
      faceLandmarks = null;
    }
  });
  faceReady = true;
  let isProcessing = false;
  setInterval(async () => {
    if (!isProcessing && videoEl.readyState >= 2) {
      isProcessing = true;
      try { await faceMesh.send({ image: videoEl }); } catch (e) {}
      isProcessing = false;
    }
  }, 67);
}

// ============================================================
// 좌표 변환 — fullscreen 카메라 기준
// camX=width/2, camY=height/2 로 호출
// ============================================================
function lm(index, camX, camY) {
  if (!faceLandmarks || index >= faceLandmarks.length) return { x: camX, y: camY };
  let l = faceLandmarks[index];
  return {
    x: camX + (l.x - 0.5) * width,
    y: camY + (l.y - 0.5) * height
  };
}

function getFaceWidth(camX, camY) {
  let left  = lm(234, camX, camY);
  let right = lm(454, camX, camY);
  return dist(left.x, left.y, right.x, right.y);
}

// ============================================================
// MAIN DRAW — camera.js의 drawCamera()에서 호출
// ============================================================
function drawARFilter(camX, camY, filterType) {
  if (faceLandmarks) {
    if      (filterType === 0) drawCatFilter_tracked(camX, camY);
    else if (filterType === 1) drawRabbitFilter_tracked(camX, camY);
    else if (filterType === 2) drawGlassesFilter_tracked(camX, camY);
    else if (filterType === 3) drawCrownFilter_tracked(camX, camY);
  } else {
    drawARFilter_fixed(camX, camY - height * 0.08, filterType);
  }
}

// ============================================================
// TRACKED FILTERS
// ============================================================
function drawCatFilter_tracked(camX, camY) {
  push();
  let nose       = lm(1,   camX, camY);
  let topHead    = lm(10,  camX, camY);
  let leftCheek  = lm(234, camX, camY);
  let rightCheek = lm(454, camX, camY);
  let scale      = getFaceWidth(camX, camY) / 180;
  let cx = nose.x, cy = topHead.y;
  fill("#ffb6c1"); stroke("#cc7788"); strokeWeight(2 * scale);
  triangle(cx-110*scale, cy, cx-75*scale, cy-90*scale, cx-35*scale, cy);
  triangle(cx+35*scale,  cy, cx+75*scale, cy-90*scale, cx+110*scale, cy);
  fill("#ff9ab0"); noStroke();
  triangle(cx-100*scale, cy-5*scale, cx-75*scale, cy-78*scale, cx-48*scale, cy-5*scale);
  triangle(cx+48*scale,  cy-5*scale, cx+75*scale, cy-78*scale, cx+100*scale, cy-5*scale);
  stroke("#999"); strokeWeight(1.5 * scale);
  line(leftCheek.x, leftCheek.y-10*scale, leftCheek.x-70*scale, leftCheek.y-15*scale);
  line(leftCheek.x, leftCheek.y,          leftCheek.x-70*scale, leftCheek.y);
  line(leftCheek.x, leftCheek.y+10*scale, leftCheek.x-70*scale, leftCheek.y+12*scale);
  line(rightCheek.x, rightCheek.y-10*scale, rightCheek.x+70*scale, rightCheek.y-15*scale);
  line(rightCheek.x, rightCheek.y,           rightCheek.x+70*scale, rightCheek.y);
  line(rightCheek.x, rightCheek.y+10*scale,  rightCheek.x+70*scale, rightCheek.y+12*scale);
  fill("#ff8fab"); noStroke();
  ellipse(nose.x, nose.y, 14*scale, 10*scale);
  pop();
}

function drawRabbitFilter_tracked(camX, camY) {
  push();
  let nose    = lm(1,  camX, camY);
  let topHead = lm(10, camX, camY);
  let scale   = getFaceWidth(camX, camY) / 180;
  let cx = nose.x, cy = topHead.y;
  fill("#f5e6f5"); stroke("#d0b0d0"); strokeWeight(2 * scale);
  ellipse(cx-65*scale, cy-80*scale, 50*scale, 150*scale);
  ellipse(cx+65*scale, cy-80*scale, 50*scale, 150*scale);
  fill("#ffb6c1"); noStroke();
  ellipse(cx-65*scale, cy-80*scale, 26*scale, 100*scale);
  ellipse(cx+65*scale, cy-80*scale, 26*scale, 100*scale);
  fill("#ffaabb");
  ellipse(nose.x, nose.y, 16*scale, 12*scale);
  pop();
}

function drawGlassesFilter_tracked(camX, camY) {
  push();
  let leftOuter  = lm(33,  camX, camY);
  let leftInner  = lm(133, camX, camY);
  let rightInner = lm(362, camX, camY);
  let rightOuter = lm(263, camX, camY);
  let scale      = getFaceWidth(camX, camY) / 180;
  let lensW  = dist(leftOuter.x, leftOuter.y, leftInner.x, leftInner.y) * 1.3;
  let lensH  = lensW * 0.65;
  let leftCx  = (leftOuter.x  + leftInner.x)  / 2;
  let leftCy  = (leftOuter.y  + leftInner.y)  / 2;
  let rightCx = (rightOuter.x + rightInner.x) / 2;
  let rightCy = (rightOuter.y + rightInner.y) / 2;
  noFill(); stroke("#222"); strokeWeight(5 * scale); rectMode(CENTER);
  rect(leftCx,  leftCy,  lensW, lensH, 12*scale);
  rect(rightCx, rightCy, lensW, lensH, 12*scale);
  line(leftInner.x, leftInner.y, rightInner.x, rightInner.y);
  line(leftOuter.x,  leftOuter.y,  leftOuter.x-30*scale,  leftOuter.y-5*scale);
  line(rightOuter.x, rightOuter.y, rightOuter.x+30*scale, rightOuter.y-5*scale);
  pop();
}

function drawCrownFilter_tracked(camX, camY) {
  push();
  let nose    = lm(1,  camX, camY);
  let topHead = lm(10, camX, camY);
  let scale   = getFaceWidth(camX, camY) / 180;
  let cx = nose.x, cy = topHead.y;
  fill("#ffd700"); stroke("#cc9900"); strokeWeight(2*scale);
  beginShape();
  vertex(cx-110*scale, cy);        vertex(cx-80*scale,  cy-85*scale);
  vertex(cx-40*scale,  cy-28*scale); vertex(cx,           cy-110*scale);
  vertex(cx+40*scale,  cy-28*scale); vertex(cx+80*scale,  cy-85*scale);
  vertex(cx+110*scale, cy);        vertex(cx+110*scale, cy+35*scale);
  vertex(cx-110*scale, cy+35*scale);
  endShape(CLOSE);
  noStroke();
  fill("#ff4d6d"); circle(cx-68*scale, cy-8*scale,  20*scale);
  fill("#a78bfa"); circle(cx,          cy-50*scale, 20*scale);
  fill("#ff4d6d"); circle(cx+68*scale, cy-8*scale,  20*scale);
  pop();
}

// ============================================================
// FIXED FALLBACK (얼굴 미감지 시)
// ============================================================
function drawARFilter_fixed(x, y, filterType) {
  if      (filterType === 0) drawCatFilter_fixed(x, y);
  else if (filterType === 1) drawRabbitFilter_fixed(x, y);
  else if (filterType === 2) drawGlassesFilter_fixed(x, y);
  else if (filterType === 3) drawCrownFilter_fixed(x, y);
}

function drawCatFilter_fixed(x, y) {
  push();
  fill("#ffb6c1"); stroke("#cc7788"); strokeWeight(2);
  triangle(x-115,y-115,x-80,y-205,x-40,y-115);
  triangle(x+40,y-115,x+80,y-205,x+115,y-115);
  fill("#ff9ab0"); noStroke();
  triangle(x-104,y-122,x-80,y-190,x-52,y-122);
  triangle(x+52,y-122,x+80,y-190,x+104,y-122);
  stroke("#888"); strokeWeight(1.5);
  line(x-90,y+18,x-185,y+5);  line(x-90,y+33,x-185,y+33);  line(x-90,y+48,x-185,y+58);
  line(x+90,y+18,x+185,y+5);  line(x+90,y+33,x+185,y+33);  line(x+90,y+48,x+185,y+58);
  fill("#ff8fab"); noStroke(); ellipse(x,y+22,16,12);
  pop();
}

function drawRabbitFilter_fixed(x, y) {
  push();
  fill("#f5e6f5"); stroke("#d0b0d0"); strokeWeight(2);
  ellipse(x-72,y-195,58,175); ellipse(x+72,y-195,58,175);
  fill("#ffb6c1"); noStroke();
  ellipse(x-72,y-195,30,115); ellipse(x+72,y-195,30,115);
  fill("#ffaabb"); ellipse(x,y+24,18,13);
  pop();
}

function drawGlassesFilter_fixed(x, y) {
  push();
  noFill(); stroke("#222"); strokeWeight(5); rectMode(CORNER);
  rect(x-103,y-47,88,60,14); rect(x+15,y-47,88,60,14);
  line(x-15,y-22,x+15,y-22);
  line(x-103,y-22,x-135,y-16); line(x+103,y-22,x+135,y-16);
  pop();
}

function drawCrownFilter_fixed(x, y) {
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
// STATUS INDICATOR
// ============================================================
function drawFaceStatus(canvasW, canvasH) {
  push();
  noStroke(); textAlign(LEFT, CENTER); textSize(14);
  if (!faceReady) {
    fill(255, 200, 0, 200);
    text("⏳ Face Mesh 로딩 중...", 20, canvasH - 55);
  } else if (!faceLandmarks) {
    fill(255, 100, 100, 200);
    text("😶 얼굴을 카메라에 맞춰주세요", 20, canvasH - 55);
  } else {
    fill(100, 220, 100, 200);
    text("✅ 얼굴 인식 중", 20, canvasH - 55);
  }
  pop();
}
