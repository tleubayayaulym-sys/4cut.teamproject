// ============================================================
// saved.js
// ============================================================

function drawSavedScreen() {

push();

background("#fff0f5");

// ============================================================
// MAIN CARD
// ============================================================

fill(255);

noStroke();

rect(
width/2 - 220,
height/2 - 260,
440,
520,
35
);

// ============================================================
// CHECK ICON
// ============================================================

fill("#ff4d6d");

circle(width/2, height/2 - 130, 110);

fill(255);

textSize(56);

text("✓", width/2, height/2 - 122);

// ============================================================
// TITLE
// ============================================================

fill("#333");

textSize(38);

text(
"Saved Successfully!",
width/2,
height/2 - 20
);

// ============================================================
// SUBTITLE
// ============================================================

fill("#999");

textSize(18);

text(
"PNG image downloaded ✨",
width/2,
height/2 + 30
);

text(
"Thank you for using 4CUT BOOTH 💕",
width/2,
height/2 + 60
);

// ============================================================
// PREVIEW MINI
// ============================================================

fill("#fff0f5");

stroke("#ffb6c1");
strokeWeight(3);

rect(
width/2 - 80,
height/2 + 95,
160,
120,
24
);

fill("#ff4d6d");

textSize(18);

text(
"📸 PHOTO READY",
width/2,
height/2 + 155
);

// ============================================================
// AGAIN BUTTON
// ============================================================

fill("#ff4d6d");

noStroke();

rect(
width/2 - 170,
height - 120,
150,
60,
30
);

fill(255);

textSize(24);

text(
"📷 AGAIN",
width/2 - 95,
height - 89
);

// ============================================================
// HOME BUTTON
// ============================================================

fill("#fff");

stroke("#ff4d6d");
strokeWeight(3);

rect(
width/2 + 20,
height - 120,
150,
60,
30
);

fill("#ff4d6d");

noStroke();

textSize(24);

text(
"🏠 HOME",
width/2 + 95,
height - 89
);

pop();

}

// ============================================================
// SAVED BUTTONS
// ============================================================

function handleSavedButtons() {

// ================= AGAIN =================

if (
mouseX > width/2 - 170 &&
mouseX < width/2 - 20 &&
mouseY > height - 120 &&
mouseY < height - 60
) {

allPhotos = [];
selectedPhotos = [];
capturedPhotos = [];

currentScreen = "camera";

}

// ================= HOME =================

if (
mouseX > width/2 + 20 &&
mouseX < width/2 + 170 &&
mouseY > height - 120 &&
mouseY < height - 60
) {

allPhotos = [];
selectedPhotos = [];
capturedPhotos = [];

currentScreen = "ending";

}

}
