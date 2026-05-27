// ============================================================
// ar-filter.js — 담당: 응웬 바오 담 (Tamy)
// AR Face Filter + Hand Gesture + Save Filter
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

// filter icons
let filterEmoji = [
  "🐱",
  "🐰",
  "👓",
  "👑"
];

// ============================================================
// init
// ============================================================
function initFaceMesh(camera) {

  let videoEl = camera.elt;

  // FaceMesh
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

  faceMesh.onResults((results) => {

    if (
      results.multiFaceLandmarks &&
      results.multiFaceLandmarks.length > 0
    ) {

      faceLandmarks =
        results.multiFaceLandmarks[0];
    }

    else {

      faceLandmarks = null;
    }
  });

  // Hands
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

  handDetector.onResults((results) => {

    if (
      results.multiHandLandmarks &&
      results.multiHandLandmarks.length > 0
    ) {

      handLandmarks =
        results.multiHandLandmarks[0];
    }

    else {

      handLandmarks = null;
    }
  });

  faceReady = true;

  let processing = false;

  setInterval(async () => {

    if (
      !processing &&
      videoEl.readyState >= 2
    ) {

      processing = true;

      try {

        await faceMesh.send({
          image: videoEl
        });

        await handDetector.send({
          image: videoEl
        });

      } catch (e) {}

      processing = false;
    }

  }, 67);
}

// ============================================================
// landmarks
// ============================================================
function lm(index, camX, camY) {

  if (
    !faceLandmarks ||
    index >= faceLandmarks.length
  ) {

    return {
      x: camX,
      y: camY
    };
  }

  let d = faceLandmarks[index];

  return {
    x: camX + (d.x - 0.5) * _camW,
    y: camY + (d.y - 0.5) * _camH
  };
}

function getFaceWidth(camX, camY) {

  let left  = lm(234, camX, camY);
  let right = lm(454, camX, camY);

  return dist(
    left.x,
    left.y,
    right.x,
    right.y
  );
}

// ============================================================
// draw AR filter
// ============================================================
function drawARFilter(
  camX,
  camY,
  filterType,
  camW,
  camH
) {

  if (camW) _camW = camW;
  if (camH) _camH = camH;

  if (faceLandmarks) {

    if (filterType === 0) {

      drawCatFilter(camX, camY);
    }

    else if (filterType === 1) {

      drawRabbitFilter(camX, camY);
    }

    else if (filterType === 2) {

      drawGlassesFilter(camX, camY);
    }

    else if (filterType === 3) {

      drawCrownFilter(camX, camY);
    }
  }

  handleHandGesture(camX, camY);
}

// ============================================================
// hand gesture
// ============================================================
function handleHandGesture(camX, camY) {

  let touching = checkFingerTouch();

  if (
    gesTouchedPrev &&
    !touching
  ) {

    gesIconTimer = 60;

    if (
      typeof startPhotoSequence === "function" &&
      typeof isCapturing !== "undefined" &&
      !isCapturing
    ) {

      startPhotoSequence();
    }
  }

  gesTouchedPrev = touching;

  drawHandGuide(
    touching,
    camX,
    camY
  );
}

function checkFingerTouch() {

  if (!handLandmarks) {

    return false;
  }

  let thumb = handLandmarks[4];
  let index = handLandmarks[8];

  return (
    dist(
      thumb.x,
      thumb.y,
      index.x,
      index.y
    ) < 0.06
  );
}

function drawHandGuide(
  touching,
  camX,
  camY
) {

  push();

  noStroke();

  if (gesIconTimer > 0) {

    textAlign(CENTER, CENTER);

    textSize(
      min(_camW * 0.18, 80)
    );

    fill(
      255,
      255,
      255,
      map(
        gesIconTimer,
        0,
        60,
        0,
        255
      )
    );

    text("📸", camX, camY);

    gesIconTimer--;
  }

  pop();
}

// ============================================================
// CAT FILTER
// ============================================================
function drawCatFilter(camX, camY) {

  push();

  let nose  = lm(1, camX, camY);
  let top   = lm(10, camX, camY);

  let scale =
    getFaceWidth(camX, camY) / 180;

  let cx = nose.x;
  let cy = top.y;

  fill("#ffb6c1");

  stroke("#cc7788");

  strokeWeight(2 * scale);

  triangle(
    cx - 110 * scale,
    cy,
    cx - 75 * scale,
    cy - 90 * scale,
    cx - 35 * scale,
    cy
  );

  triangle(
    cx + 35 * scale,
    cy,
    cx + 75 * scale,
    cy - 90 * scale,
    cx + 110 * scale,
    cy
  );

  fill("#ff8fab");

  noStroke();

  ellipse(
    nose.x,
    nose.y,
    14 * scale,
    10 * scale
  );

  pop();
}

// ============================================================
// RABBIT FILTER
// ============================================================
function drawRabbitFilter(camX, camY) {

  push();

  let nose = lm(1, camX, camY);

  let top = lm(10, camX, camY);

  let scale =
    getFaceWidth(camX, camY) / 180;

  let cx = nose.x;
  let cy = top.y;

  fill("#f5e6f5");

  stroke("#d0b0d0");

  strokeWeight(2 * scale);

  ellipse(
    cx - 65 * scale,
    cy - 80 * scale,
    50 * scale,
    150 * scale
  );

  ellipse(
    cx + 65 * scale,
    cy - 80 * scale,
    50 * scale,
    150 * scale
  );

  pop();
}

// ============================================================
// GLASSES
// ============================================================
function drawGlassesFilter(camX, camY) {

  push();

  let l1 = lm(33, camX, camY);
  let l2 = lm(133, camX, camY);

  let r1 = lm(362, camX, camY);
  let r2 = lm(263, camX, camY);

  let scale =
    getFaceWidth(camX, camY) / 180;

  noFill();

  stroke("#222");

  strokeWeight(5 * scale);

  rectMode(CENTER);

  rect(
    (l1.x + l2.x) / 2,
    (l1.y + l2.y) / 2,
    70 * scale,
    45 * scale,
    10
  );

  rect(
    (r1.x + r2.x) / 2,
    (r1.y + r2.y) / 2,
    70 * scale,
    45 * scale,
    10
  );

  pop();
}

// ============================================================
// CROWN
// ============================================================
function drawCrownFilter(camX, camY) {

  push();

  let nose = lm(1, camX, camY);

  let top = lm(10, camX, camY);

  let scale =
    getFaceWidth(camX, camY) / 180;

  let cx = nose.x;
  let cy = top.y;

  fill("#ffd700");

  stroke("#cc9900");

  strokeWeight(2 * scale);

  triangle(
    cx - 100 * scale,
    cy,
    cx,
    cy - 120 * scale,
    cx + 100 * scale,
    cy
  );

  pop();
}

// ============================================================
// STATUS
// ============================================================
function drawFaceStatus(w, h) {

  push();

  noStroke();

  textAlign(LEFT, CENTER);

  textSize(14);

  if (!faceReady) {

    fill(255, 200, 0);

    text(
      "⏳ 모델 로딩 중...",
      20,
      h - 55
    );
  }

  else if (!faceLandmarks) {

    fill(255, 100, 100);

    text(
      "😶 얼굴을 카메라에 맞춰주세요",
      20,
      h - 55
    );
  }

  else {

    fill(100, 220, 100);

    text(
      "✅ 얼굴 인식 중",
      20,
      h - 55
    );
  }

  pop();
}

// ============================================================
// SAVE FILTER TO PHOTO
// ============================================================
function drawARFilterToGraphics(
  g,
  filterIndex,
  w,
  h
) {

  if (!faceLandmarks) return;

  let leftEye  = faceLandmarks[33];
  let rightEye = faceLandmarks[263];
  let nose     = faceLandmarks[1];

  if (
    !leftEye ||
    !rightEye ||
    !nose
  ) return;

  let lx = leftEye.x * w;
  let ly = leftEye.y * h;

  let rx = rightEye.x * w;
  let ry = rightEye.y * h;

  let nx = nose.x * w;
  let ny = nose.y * h;

  let eyeDist = dist(
    lx,
    ly,
    rx,
    ry
  );

  g.push();

  g.textAlign(CENTER, CENTER);

  // CAT
  if (filterIndex === 0) {

    g.textSize(eyeDist * 0.7);

    g.text(
      "🐱",
      nx,
      ny - eyeDist * 0.8
    );
  }

  // BUNNY
  else if (filterIndex === 1) {

    g.textSize(eyeDist * 0.9);

    g.text(
      "🐰",
      nx,
      ny - eyeDist
    );
  }

  // GLASSES
  else if (filterIndex === 2) {

    g.textSize(eyeDist * 0.8);

    g.text(
      "👓",
      nx,
      ny
    );
  }

  // CROWN
  else if (filterIndex === 3) {

    g.textSize(eyeDist * 0.9);

    g.text(
      "👑",
      nx,
      ny - eyeDist
    );
  }

  g.pop();
}
