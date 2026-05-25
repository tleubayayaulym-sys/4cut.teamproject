// ============================================================
// ar-filter.js
// 담당: 응웬 바오 담 (Tamy)
// MediaPipe FaceMesh 기반 실시간 AR 필터 + 파티클 시스템
// ============================================================

// ---------- FaceMesh state ----------
let faceMesh       = null;
let faceLandmarks  = null;   // normalized landmarks [{ x, y, z }, ...]
let faceReady      = false;  // true once FaceMesh is initialized

// ---------- Particles (배열 사용) ----------
let particles = [];

// ---------- Camera display area (sketch.js 와 공유) ----------
// These values must match the camera drawing in sketch.js
const CAM_W = 480;
const CAM_H = 360;

// ============================================================
// INIT — call once in setup(), pass the p5 cam element
// ============================================================
function initFaceMesh(camElement) {
  const videoEl = camElement.elt;

  faceMesh = new FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces:            1,
    refineLandmarks:        true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence:  0.5
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
      try {
        await faceMesh.send({ image: videoEl });
      } catch (e) {}
      isProcessing = false;
    }
  }, 67);
}

// ============================================================
// COORDINATE HELPER
// Converts a normalized FaceMesh landmark to p5.js canvas position.
// camX, camY = center of camera display area in canvas.
// Webcam is mirrored → flip x with (1 - l.x).
// ============================================================
function lm(index, camX, camY) {
  if (!faceLandmarks || index >= faceLandmarks.length) {
    return { x: camX, y: camY };   // fallback: center
  }
  let l = faceLandmarks[index];
  return {
    x: camX + (0.5 - l.x) * CAM_W,   // mirrored x
    y: camY + (l.y - 0.5) * CAM_H    // y from center
  };
}

// Midpoint between two landmarks
function midLm(a, b, camX, camY) {
  let pa = lm(a, camX, camY);
  let pb = lm(b, camX, camY);
  return { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
}

// Face width (pixel) from left cheek (234) to right cheek (454)
function faceWidth(camX, camY) {
  let left  = lm(234, camX, camY);
  let right = lm(454, camX, camY);
  return dist(left.x, left.y, right.x, right.y);
}

// ============================================================
// MAIN DRAW — called every frame from sketch.js drawCamera()
// camX, camY = center of camera rect on canvas
// filterType : 0=Cat 1=Rabbit 2=Glasses 3=Crown
// ============================================================
function drawARFilter(camX, camY, filterType) {
  // If FaceMesh has landmarks, use them; otherwise draw at fixed center
  if (faceLandmarks) {
    if      (filterType === 0) drawCatFilter_tracked(camX, camY);
    else if (filterType === 1) drawRabbitFilter_tracked(camX, camY);
    else if (filterType === 2) drawGlassesFilter_tracked(camX, camY);
    else if (filterType === 3) drawCrownFilter_tracked(camX, camY);
  } else {
    // Fallback: fixed position (face not detected yet)
    drawARFilter_fixed(camX, camY - 30, filterType);
  }
}

// ============================================================
// TRACKED FILTERS (MediaPipe landmark-based)
// ============================================================

// 🐱 Cat — ears above head, whiskers at cheeks
function drawCatFilter_tracked(camX, camY) {
  push();

  let nose      = lm(1,   camX, camY);   // nose tip
  let topHead   = lm(10,  camX, camY);   // top of head
  let leftCheek = lm(234, camX, camY);   // left cheek
  let rightCheek= lm(454, camX, camY);   // right cheek
  let fw        = faceWidth(camX, camY);
  let scale     = fw / 180;              // normalize to design size

  let cx = nose.x;
  let cy = topHead.y;

  // Ears
  fill("#ffb6c1");
  stroke("#cc7788");
  strokeWeight(2 * scale);
  triangle(
    cx - 110*scale, cy,
    cx - 75*scale,  cy - 90*scale,
    cx - 35*scale,  cy
  );
  triangle(
    cx + 35*scale,  cy,
    cx + 75*scale,  cy - 90*scale,
    cx + 110*scale, cy
  );
  // Inner ears
  fill("#ff9ab0");
  noStroke();
  triangle(
    cx - 100*scale, cy - 5*scale,
    cx - 75*scale,  cy - 78*scale,
    cx - 48*scale,  cy - 5*scale
  );
  triangle(
    cx + 48*scale,  cy - 5*scale,
    cx + 75*scale,  cy - 78*scale,
    cx + 100*scale, cy - 5*scale
  );

  // Whiskers (from cheek landmarks)
  stroke("#999");
  strokeWeight(1.5 * scale);
  let lc = leftCheek;
  let rc = rightCheek;
  line(lc.x, lc.y - 10*scale, lc.x - 70*scale, lc.y - 15*scale);
  line(lc.x, lc.y,             lc.x - 70*scale, lc.y);
  line(lc.x, lc.y + 10*scale,  lc.x - 70*scale, lc.y + 12*scale);
  line(rc.x, rc.y - 10*scale,  rc.x + 70*scale, rc.y - 15*scale);
  line(rc.x, rc.y,              rc.x + 70*scale, rc.y);
  line(rc.x, rc.y + 10*scale,  rc.x + 70*scale, rc.y + 12*scale);

  // Nose dot
  fill("#ff8fab");
  noStroke();
  ellipse(nose.x, nose.y, 14*scale, 10*scale);

  addParticle(cx, cy, "#ff4d6d");
  pop();
}

// 🐰 Rabbit — long ears above forehead
function drawRabbitFilter_tracked(camX, camY) {
  push();

  let topHead = lm(10, camX, camY);
  let nose    = lm(1,  camX, camY);
  let fw      = faceWidth(camX, camY);
  let scale   = fw / 180;

  let cx = nose.x;
  let cy = topHead.y;

  // Outer ears
  fill("#f5e6f5");
  stroke("#d0b0d0");
  strokeWeight(2 * scale);
  ellipse(cx - 65*scale, cy - 80*scale, 50*scale, 150*scale);
  ellipse(cx + 65*scale, cy - 80*scale, 50*scale, 150*scale);

  // Inner ears
  fill("#ffb6c1");
  noStroke();
  ellipse(cx - 65*scale, cy - 80*scale, 26*scale, 100*scale);
  ellipse(cx + 65*scale, cy - 80*scale, 26*scale, 100*scale);

  // Nose
  fill("#ffaabb");
  ellipse(nose.x, nose.y, 16*scale, 12*scale);

  addParticle(cx, cy, "#ffd6e8");
  pop();
}

// 👓 Glasses — aligned with eye landmarks
function drawGlassesFilter_tracked(camX, camY) {
  push();

  // Eye landmarks
  // Left eye: outer=33, inner=133   Right eye: inner=362, outer=263
  let leftOuter  = lm(33,  camX, camY);
  let leftInner  = lm(133, camX, camY);
  let rightInner = lm(362, camX, camY);
  let rightOuter = lm(263, camX, camY);
  let fw         = faceWidth(camX, camY);
  let scale      = fw / 180;

  // Lens sizes based on eye span
  let lensW = dist(leftOuter.x, leftOuter.y, leftInner.x, leftInner.y) * 1.3;
  let lensH = lensW * 0.65;

  let leftCx  = (leftOuter.x  + leftInner.x)  / 2;
  let leftCy  = (leftOuter.y  + leftInner.y)  / 2;
  let rightCx = (rightOuter.x + rightInner.x) / 2;
  let rightCy = (rightOuter.y + rightInner.y) / 2;

  noFill();
  stroke("#222");
  strokeWeight(5 * scale);
  rectMode(CENTER);

  // Left lens
  rect(leftCx,  leftCy,  lensW, lensH, 12 * scale);
  // Right lens
  rect(rightCx, rightCy, lensW, lensH, 12 * scale);

  // Bridge
  line(leftInner.x, leftInner.y, rightInner.x, rightInner.y);

  // Arms
  line(leftOuter.x,  leftOuter.y,  leftOuter.x  - 30*scale, leftOuter.y  - 5*scale);
  line(rightOuter.x, rightOuter.y, rightOuter.x + 30*scale, rightOuter.y - 5*scale);

  addParticle((leftCx + rightCx)/2, leftCy, "#4cc9f0");
  pop();
}

// 👑 Crown — positioned above forehead
function drawCrownFilter_tracked(camX, camY) {
  push();

  let topHead = lm(10,  camX, camY);
  let nose    = lm(1,   camX, camY);
  let fw      = faceWidth(camX, camY);
  let scale   = fw / 180;

  let cx = nose.x;
  let cy = topHead.y;

  // Crown body
  fill("#ffd700");
  stroke("#cc9900");
  strokeWeight(2 * scale);
  beginShape();
  vertex(cx - 110*scale, cy);
  vertex(cx - 80*scale,  cy - 85*scale);
  vertex(cx - 40*scale,  cy - 28*scale);
  vertex(cx,             cy - 110*scale);
  vertex(cx + 40*scale,  cy - 28*scale);
  vertex(cx + 80*scale,  cy - 85*scale);
  vertex(cx + 110*scale, cy);
  vertex(cx + 110*scale, cy + 35*scale);
  vertex(cx - 110*scale, cy + 35*scale);
  endShape(CLOSE);

  // Gems
  noStroke();
  fill("#ff4d6d");
  circle(cx - 68*scale, cy - 8*scale,  20*scale);
  fill("#a78bfa");
  circle(cx,            cy - 50*scale, 20*scale);
  fill("#ff4d6d");
  circle(cx + 68*scale, cy - 8*scale,  20*scale);

  addParticle(cx, cy - 50*scale, "#ffd700");
  pop();
}

// ============================================================
// FIXED-POSITION FALLBACK (얼굴 미감지 시 사용)
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
  triangle(x-115, y-115, x-80, y-205, x-40, y-115);
  triangle(x+40,  y-115, x+80, y-205, x+115,y-115);
  fill("#ff9ab0"); noStroke();
  triangle(x-104, y-122, x-80, y-190, x-52, y-122);
  triangle(x+52,  y-122, x+80, y-190, x+104,y-122);
  stroke("#888"); strokeWeight(1.5);
  line(x-90,y+18,x-185,y+5);  line(x-90,y+33,x-185,y+33);  line(x-90,y+48,x-185,y+58);
  line(x+90,y+18,x+185,y+5);  line(x+90,y+33,x+185,y+33);  line(x+90,y+48,x+185,y+58);
  fill("#ff8fab"); noStroke(); ellipse(x, y+22, 16, 12);
  addParticle(x, y, "#ff4d6d");
  pop();
}

function drawRabbitFilter_fixed(x, y) {
  push();
  fill("#f5e6f5"); stroke("#d0b0d0"); strokeWeight(2);
  ellipse(x-72, y-195, 58, 175); ellipse(x+72, y-195, 58, 175);
  fill("#ffb6c1"); noStroke();
  ellipse(x-72, y-195, 30, 115); ellipse(x+72, y-195, 30, 115);
  fill("#ffaabb"); ellipse(x, y+24, 18, 13);
  addParticle(x, y, "#ffd6e8");
  pop();
}

function drawGlassesFilter_fixed(x, y) {
  push();
  noFill(); stroke("#222"); strokeWeight(5);
  rectMode(CORNER);
  rect(x-103, y-47, 88, 60, 14);
  rect(x+15,  y-47, 88, 60, 14);
  line(x-15, y-22, x+15, y-22);
  line(x-103,y-22, x-135,y-16);
  line(x+103,y-22, x+135,y-16);
  addParticle(x, y, "#4cc9f0");
  pop();
}

function drawCrownFilter_fixed(x, y) {
  push();
  fill("#ffd700"); stroke("#cc9900"); strokeWeight(2);
  beginShape();
  vertex(x-115,y-105); vertex(x-85,y-195); vertex(x-42,y-128);
  vertex(x,    y-215); vertex(x+42,y-128); vertex(x+85,y-195);
  vertex(x+115,y-105); vertex(x+115,y-68); vertex(x-115,y-68);
  endShape(CLOSE);
  noStroke();
  fill("#ff4d6d"); circle(x-68, y-112, 20);
  fill("#a78bfa"); circle(x,    y-148, 20);
  fill("#ff4d6d"); circle(x+68, y-112, 20);
  addParticle(x, y, "#ffd700");
  pop();
}

// ============================================================
// PARTICLE SYSTEM (최적화됨 / optimized)
// ============================================================

// Particle data: 2D array 형태 [x, y, size, speedX, speedY, col, alpha]
// 인덱스 상수 (가독성 향상)
const P_X     = 0;
const P_Y     = 1;
const P_SIZE  = 2;
const P_SPX   = 3;
const P_SPY   = 4;
const P_COL   = 5;
const P_ALPHA = 6;

const MAX_PARTICLES = 60;

function addParticle(x, y, col) {
  if (particles.length >= MAX_PARTICLES) return;
  particles.push([
    x + random(-220, 220),   // P_X
    y + random(-220, 220),   // P_Y
    random(5, 14),            // P_SIZE
    random(-0.8, 0.8),        // P_SPX  (horizontal drift)
    random(-2.5, -0.5),       // P_SPY  (float upward)
    col,                      // P_COL
    220                       // P_ALPHA
  ]);
}

function updateParticles() {
  noStroke();
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    push();
    fill(p[P_COL]);
    circle(p[P_X], p[P_Y], p[P_SIZE]);
    pop();
    p[P_X]     += p[P_SPX];
    p[P_Y]     += p[P_SPY];
    p[P_ALPHA] -= 4;
    if (p[P_ALPHA] <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Status indicator — shows in camera screen if FaceMesh is loading
function drawFaceStatus(canvasW, canvasH) {
  push();
  noStroke();
  if (!faceReady) {
    fill(255, 200, 0, 200);
    textAlign(LEFT, CENTER);
    textSize(13);
    text("⏳ Face Mesh 로딩 중...", 140, canvasH - 65);
  } else if (!faceLandmarks) {
    fill(255, 100, 100, 200);
    textAlign(LEFT, CENTER);
    textSize(13);
    text("😶 얼굴을 카메라에 맞춰주세요", 140, canvasH - 65);
  } else {
    fill(100, 220, 100, 200);
    textAlign(LEFT, CENTER);
    textSize(13);
    text("✅ 얼굴 인식 중", 140, canvasH - 65);
  }
  pop();
}
