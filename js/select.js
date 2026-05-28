// ============================================================
// select.js
// ============================================================

function drawSelectScreen() {

push();

background("#fff0f5");

// ============================================================
// TITLE
// ============================================================

fill("#ff4d6d");

textSize(34);

text("Choose Your Best 4 ✨", width/2, 60);

fill("#999");

textSize(16);

text(
selectedPhotos.length + " / 4 selected",
width/2,
95
);

// ============================================================
// GRID
// ============================================================

let cols = 4;

let gap = 18;

let size = min(width * 0.18, 150);

let totalW = cols * size + (cols-1)*gap;

let startX = width/2 - totalW/2;

let startY = 130;

for (let i=0; i<allPhotos.length; i++) {

let col = i % cols;
let row = floor(i / cols);

let x = startX + col*(size+gap);
let y = startY + row*(size+55);

// ================= SHADOW =================

fill(0,0,0,20);
noStroke();

rect(x+4,y+4,size,size,20);

// ================= PHOTO CARD =================

fill(255);

stroke("#ffd1df");
strokeWeight(3);

rect(x,y,size,size,20);

// ================= PHOTO =================

image(allPhotos[i], x+6, y+6, size-12, size-12);

// ================= SELECT =================

let isSelected = selectedPhotos.includes(i);

if (isSelected) {

stroke("#ff4d6d");
strokeWeight(5);

noFill();

rect(x,y,size,size,20);

// number badge

let order = selectedPhotos.indexOf(i) + 1;

fill("#ff4d6d");
noStroke();

circle(x + size - 14, y + 14, 34);

fill(255);

textSize(18);

text(order, x + size - 14, y + 15);

}

// ================= LABEL =================

fill("#999");

noStroke();

textSize(14);

text(
"PHOTO " + (i+1),
x + size/2,
y + size + 25
);

}

// ============================================================
// COMPLETE BUTTON
// ============================================================

let btnW = 300;
let btnH = 62;

if (selectedPhotos.length === 4) {

fill("#ff4d6d");

}
else {

fill("#ccc");

}

noStroke();

rect(
width/2 - btnW/2,
height - 95,
btnW,
btnH,
30
);

fill(255);

textSize(26);

if (selectedPhotos.length === 4) {

text(
"완료하기 ✨",
width/2,
height - 64
);

}
else {

text(
"4장 선택해주세요",
width/2,
height - 64
);

}

// ============================================================
// BACK BUTTON
// ============================================================

fill("#fff");

stroke("#ff4d6d");
strokeWeight(3);

rect(30,30,120,48,24);

fill("#ff4d6d");

noStroke();

textSize(20);

text("← BACK", 90, 55);

pop();

}

// ============================================================
// SELECT BUTTONS
// ============================================================

function handleSelectButtons() {

let cols = 4;

let gap = 18;

let size = min(width * 0.18, 150);

let totalW = cols * size + (cols-1)*gap;

let startX = width/2 - totalW/2;

let startY = 130;

// ================= BACK =================

if (
mouseX > 30 &&
mouseX < 150 &&
mouseY > 30 &&
mouseY < 78
) {

currentScreen = "camera";
return;

}

// ================= PHOTO CLICK =================

for (let i=0; i<allPhotos.length; i++) {

let col = i % cols;
let row = floor(i / cols);

let x = startX + col*(size+gap);
let y = startY + row*(size+55);

if (
mouseX > x &&
mouseX < x + size &&
mouseY > y &&
mouseY < y + size
) {

if (selectedPhotos.includes(i)) {

// REMOVE

selectedPhotos =
selectedPhotos.filter(p => p !== i);

}
else {

// ADD

if (selectedPhotos.length < 4) {

selectedPhotos.push(i);

}

}

return;

}

}

// ================= COMPLETE =================

if (
selectedPhotos.length === 4 &&
mouseX > width/2 - 150 &&
mouseX < width/2 + 150 &&
mouseY > height - 95 &&
mouseY < height - 33
) {

capturedPhotos = [];

for (let i=0; i<4; i++) {

capturedPhotos.push(
allPhotos[selectedPhotos[i]]
);

}

currentScreen = "result";

}

}
