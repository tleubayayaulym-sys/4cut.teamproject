// ============================================================
// result.js
// ============================================================

function drawResultScreen() {

push();

background("#ffeef5");

// ============================================================
// CARD
// ============================================================

fill(255);
noStroke();

rect(width/2 - 190, 40, 380, height - 80, 30);

// ============================================================
// TITLE
// ============================================================

fill("#ff4d6d");

textSize(34);

text("4CUT PHOTO", width/2, 90);

fill("#999");

textSize(16);

text("Your memories today ✨", width/2, 125);

// ============================================================
// PHOTOS
// ============================================================

let photoW = 280;
let photoH;

if (selectedFormat === 0) {
photoH = 280;
}
else {
photoH = 210;
}

let startY = 160;

for (let i=0; i<4; i++) {

let x = width/2 - photoW/2;
let y = startY + i*(photoH + 18);

// ================= BORDER STYLE =================

if (selectedBorder === 0) {

fill(255);

stroke(frameDark[selectedFrame]);
strokeWeight(4);

rect(x-8,y-8,photoW+16,photoH+16,20);

}

else if (selectedBorder === 1) {

fill(255);

stroke("#ddd");
strokeWeight(10);

rect(x-12,y-12,photoW+24,photoH+45,10);

}

else if (selectedBorder === 2) {

drawingContext.shadowBlur = 30;
drawingContext.shadowColor = frameDark[selectedFrame];

fill(255);

stroke(frameDark[selectedFrame]);
strokeWeight(5);

rect(x-10,y-10,photoW+20,photoH+20,20);

drawingContext.shadowBlur = 0;

}

else if (selectedBorder === 3) {

fill("#fff0f5");

stroke("#ff4d6d");
strokeWeight(5);

rect(x-10,y-10,photoW+20,photoH+20,30);

fill("#ffb6c1");

circle(x-5,y-5,20);
circle(x+photoW+5,y-5,20);
circle(x-5,y+photoH+5,20);
circle(x+photoW+5,y+photoH+5,20);

}

// ================= PHOTO =================

image(capturedPhotos[i], x, y, photoW, photoH);

}

// ============================================================
// QR SECTION
// ============================================================

let qrY = startY + 4*(photoH+18) + 10;

fill("#fff0f5");

stroke("#ffb6c1");
strokeWeight(3);

rect(width/2 - 130, qrY, 260, 110, 20);

// fake QR

fill(255);

rect(width/2 - 105, qrY + 15, 70, 70);

for (let i=0; i<25; i++) {

fill(random() > 0.5 ? 0 : 255);

rect(
width/2 - 100 + (i%5)*12,
qrY + 20 + floor(i/5)*12,
10,
10
);

}

fill("#ff4d6d");

textSize(16);

text("🎥 Making Film", width/2 + 40, qrY + 38);

fill("#777");

textSize(12);

text("Scan QR to watch", width/2 + 40, qrY + 62);

text("how these photos were made ✨",
width/2 + 40,
qrY + 82);

// ============================================================
// BUTTONS
// ============================================================

let btnY = height - 90;

// SAVE

fill("#ff4d6d");

noStroke();

rect(width/2 - 170, btnY, 150, 55, 28);

fill(255);

textSize(22);

text("💾 SAVE",
width/2 - 95,
btnY + 28);

// RETAKE

fill("#fff");

stroke("#ff4d6d");
strokeWeight(3);

rect(width/2 + 20, btnY, 150, 55, 28);

fill("#ff4d6d");

noStroke();

textSize(22);

text("🔄 AGAIN",
width/2 + 95,
btnY + 28);

pop();
}

// ============================================================
// BUTTONS
// ============================================================

function handleResultButtons() {

let btnY = height - 90;

// SAVE

if (
mouseX > width/2 - 170 &&
mouseX < width/2 - 20 &&
mouseY > btnY &&
mouseY < btnY + 55
) {

saveResultCanvas();

}

// AGAIN

if (
mouseX > width/2 + 20 &&
mouseX < width/2 + 170 &&
mouseY > btnY &&
mouseY < btnY + 55
) {

allPhotos = [];
capturedPhotos = [];
selectedPhotos = [];

currentScreen = "camera";

}

}

// ============================================================
// SAVE PNG
// ============================================================

function saveResultCanvas() {

saveCanvas("4cut_photo", "png");

currentScreen = "saved";

}
