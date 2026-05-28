// ============================================================
// camera.js
// ============================================================

let video;

let allPhotos = [];

let countdown = 0;
let isCapturing = false;

let cameraError = false;

const MAX_PHOTOS = 8;

// camera box
let _boxX = 0;
let _boxY = 0;
let _boxW = 0;
let _boxH = 0;

// ============================================================
// setupCamera()
// ============================================================

function setupCamera() {

try {

video = createCapture(VIDEO, () => {

cameraError = false;

});

video.size(640, 480);

video.hide();

}
catch(e) {

cameraError = true;

console.log(e);

}

}

// ============================================================
// drawCamera()
// ============================================================

function drawCamera() {

push();

background("#fff0f5");

// ============================================================
// ERROR
// ============================================================

if (cameraError || !video) {

drawCameraError();

pop();

return;

}

// ============================================================
// CAMERA SIZE
// ============================================================

let camW = min(width * 0.7, 520);

let camH = camW * 0.75;

let camX = width/2 - camW/2;
let camY = 60;

// save for AR filter
_boxX = camX;
_boxY = camY;
_boxW = camW;
_boxH = camH;

// ============================================================
// SHADOW
// ============================================================

fill(0,0,0,20);

noStroke();

rect(
camX + 6,
camY + 6,
camW,
camH,
30
);

// ============================================================
// FRAME
// ============================================================

fill(255);

stroke("#ff4d6d");

strokeWeight(6);

rect(
camX,
camY,
camW,
camH,
30
);

// ============================================================
// VIDEO
// ============================================================

push();

// mirror camera

translate(camX + camW, 0);

scale(-1,1);

image(
video,
0,
camY,
camW,
camH
);

pop();

// ============================================================
// LIVE
// ============================================================

fill("#ff4d6d");

noStroke();

rect(
camX + 16,
camY + 16,
70,
30,
15
);

fill(255);

textSize(16);

textAlign(CENTER,CENTER);

text(
"LIVE",
camX + 51,
camY + 31
);

// ============================================================
// PHOTO COUNT
// ============================================================

fill(255,255,255,220);

rect(
camX + camW - 100,
camY + 16,
84,
30,
15
);

fill("#ff4d6d");

textSize(16);

text(
allPhotos.length + "/" + MAX_PHOTOS,
camX + camW - 58,
camY + 31
);

// ============================================================
// PREVIEW
// ============================================================

let previewSize = 58;

let gap = 10;

let total =
MAX_PHOTOS * previewSize +
(MAX_PHOTOS - 1) * gap;

let startX = width/2 - total/2;

for (let i=0; i<MAX_PHOTOS; i++) {

let x = startX + i*(previewSize+gap);

let y = camY + camH + 30;

// frame

fill("#fff");

stroke("#ffb6c1");

strokeWeight(2);

rect(
x,
y,
previewSize,
previewSize,
14
);

// photo

if (allPhotos[i]) {

image(
allPhotos[i],
x,
y,
previewSize,
previewSize
);

}
else {

fill("#ffb6c1");

noStroke();

textSize(18);

text(
i+1,
x + previewSize/2,
y + previewSize/2
);

}

}

// ============================================================
// CAPTURE BUTTON
// ============================================================

let btnW = 280;
let btnH = 60;

fill(
isCapturing
? "#cccccc"
: "#ff4d6d"
);

noStroke();

rect(
width/2 - btnW/2,
height - 100,
btnW,
btnH,
30
);

fill(255);

textSize(28);

text(
isCapturing
? "촬영 중..."
: "📷 촬영하기",
width/2,
height - 70
);

// ============================================================
// COUNTDOWN
// ============================================================

if (countdown > 0) {

fill(0,0,0,120);

rect(
camX,
camY,
camW,
camH,
30
);

fill(255);

textSize(150);

text(
countdown,
camX + camW/2,
camY + camH/2
);

}

pop();

}

// ============================================================
// drawCameraError()
// ============================================================

function drawCameraError() {

push();

fill(255);

rect(
width/2 - 220,
height/2 - 180,
440,
360,
30
);

fill("#ff4d6d");

textSize(40);

text(
"📷",
width/2,
height/2 - 80
);

fill("#333");

textSize(28);

text(
"카메라 오류",
width/2,
height/2
);

fill("#888");

textSize(16);

text(
"카메라 권한을 허용해주세요",
width/2,
height/2 + 50
);

pop();

}

// ============================================================
// handleCameraButtons()
// ============================================================

function handleCameraButtons() {

// ============================================================
// CAPTURE BUTTON
// ============================================================

if (
!isCapturing &&
allPhotos.length < MAX_PHOTOS &&

mouseX > width/2 - 140 &&
mouseX < width/2 + 140 &&

mouseY > height - 100 &&
mouseY < height - 40
) {

takeSinglePhoto();

}

}

// ============================================================
// takeSinglePhoto()
// ============================================================

function takeSinglePhoto() {

if (isCapturing) return;

isCapturing = true;

countdown = 3;

// ============================================================

let timer = setInterval(() => {

countdown--;

if (countdown <= 0) {

clearInterval(timer);

countdown = 0;

// ============================================================

setTimeout(() => {

// take photo

let img = get(
_boxX,
_boxY,
_boxW,
_boxH
);

allPhotos.push(img);

// flash

flashEffect();

isCapturing = false;

}, 80);

}

}, 1000);

}

// ============================================================
// flashEffect()
// ============================================================

function flashEffect() {

push();

fill(255);

noStroke();

rect(
0,
0,
width,
height
);

pop();

}
