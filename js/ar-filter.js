// ar-filter.js — 담당: 응웬 바오 담 (Tamy)

let faceMesh = null;
let faceLandmarks = null;
let faceReady = false;
let particles = [];

const CAM_W = 480;
const CAM_H = 360;
const P_X = 0, P_Y = 1, P_SIZE = 2, P_SPX = 3, P_SPY = 4, P_COL = 5, P_ALPHA = 6;
const MAX_PARTICLES = 60;

function initFaceMesh(camElement) {
  const videoEl = camElement.elt;
  faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
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

function lm(index, camX, camY) {
  if (!faceLandmarks || index >= faceLandmarks.length) return { x: camX, y: camY };
  let l = faceLandmarks[index];
  return { x: camX + (0.5 - l.x) * CAM_W, y: camY + (l.y - 0.5) * CAM_H };
}

function faceWidth(ca
