let currentScreen = "start";

let selectedFilter = 0;

// setup
function setup() {

    createCanvas(
        windowWidth,
        windowHeight
    );

    setupCamera();

    textAlign(CENTER, CENTER);

    rectMode(CORNER);
}

// draw
function draw() {

    background("#f6f1ff");

    // =========================
    // START SCREEN
    // =========================
    if (currentScreen === "start") {

        drawStartScreen();
    }

    // =========================
    // CAMERA SCREEN
    // =========================
    else if (currentScreen === "camera") {

        drawCamera();

        drawCameraUI();
    }

    // =========================
    // RESULT SCREEN
    // =========================
    else if (currentScreen === "result") {

        drawResultScreen();
    }
}

// =====================================================
// START SCREEN
// =====================================================
function drawStartScreen() {

    background("#f7f1ff");

    // background glow
    noStroke();

    fill(255, 210, 230, 90);

    ellipse(
        width * 0.2,
        height * 0.2,
        300
    );

    ellipse(
        width * 0.8,
        height * 0.3,
        240
    );

    ellipse(
        width * 0.5,
        height * 0.75,
        380
    );

    // title
    fill("#ff4d6d");

    textSize(
        min(width * 0.09, 72)
    );

    text(
        "4CUT BOOTH",
        width / 2,
        height * 0.22
    );

    // subtitle
    fill("#777");

    textSize(
        min(width * 0.03, 24)
    );

    text(
        "포토부스 촬영",
        width / 2,
        height * 0.31
    );

    // card
    fill(255);

    rect(
        width / 2 - width * 0.35,
        height * 0.42,
        width * 0.7,
        height * 0.28,
        30
    );

    // icons
    textSize(
        min(width * 0.08, 60)
    );

    text(
        "📸   ✨   🐱",
        width / 2,
        height * 0.52
    );

    fill("#999");

    textSize(
        min(width * 0.03, 20)
    );

    text(
        "AR 필터 포토부스",
        width / 2,
        height * 0.60
    );

    // start button
    let btnW;

    if (width < 700) {

        btnW = width * 0.7;
    }

    else {

        btnW = 320;
    }

    fill("#ff4d6d");

    rect(
        width / 2 - btnW / 2,
        height * 0.8,
        btnW,
        65,
        25
    );

    fill(255);

    textSize(
        min(width * 0.05, 34)
    );

    text(
        "시작하기",
        width / 2,
        height * 0.8 + 33
    );
}

// =====================================================
// CAMERA UI
// =====================================================
function drawCameraUI() {

    // top blur
    fill(0, 0, 0, 70);

    noStroke();

    rect(
        0,
        0,
        width,
        100
    );

    // filter buttons
    drawFilterButtons();

    // bottom blur
    fill(0, 0, 0, 80);

    rect(
        0,
        height - 180,
        width,
        180
    );

    // capture button
    drawCaptureButton();
}

// =====================================================
// FILTER BUTTONS
// =====================================================
function drawFilterButtons() {

    let names = [
        "🐱",
        "🐰",
        "👓",
        "👑"
    ];

    let buttonSize;

    if (width < 700) {

        buttonSize = 52;
    }

    else {

        buttonSize = 60;
    }

    let gap = 15;

    let totalWidth =
        buttonSize * 4 +
        gap * 3;

    let startX =
        width / 2 -
        totalWidth / 2;

    let y = 20;

    for (let i = 0; i < 4; i++) {

        if (selectedFilter === i) {

            fill("#ff4d6d");
        }

        else {

            fill(255, 220);
        }

        stroke(255);

        strokeWeight(3);

        rect(
            startX +
            i * (buttonSize + gap),

            y,

            buttonSize,

            buttonSize,

            18
        );

        noStroke();

        textSize(buttonSize * 0.5);

        if (selectedFilter === i) {

            fill(255);
        }

        else {

            fill("#ff4d6d");
        }

        text(
            names[i],

            startX +
            i * (buttonSize + gap) +
            buttonSize / 2,

            y + buttonSize / 2 + 2
        );
    }
}

// =====================================================
// CAPTURE BUTTON
// =====================================================
function drawCaptureButton() {

    let btnW;

    if (width < 700) {

        btnW = width * 0.65;
    }

    else {

        btnW = 320;
    }

    fill("#ff4d6d");

    noStroke();

    rect(
        width / 2 - btnW / 2,
        height - 80,
        btnW,
        55,
        22
    );

    fill(255);

    textSize(
        min(width * 0.04, 28)
    );

    text(
        "촬영하기",
        width / 2,
        height - 52
    );
}

// =====================================================
// RESULT SCREEN
// =====================================================
function drawResultScreen() {

    background("#f7f1ff");

    let stripWidth;

    if (width < 700) {

        stripWidth = width * 0.82;
    }

    else {

        stripWidth = 340;
    }

    let stripX =
        width / 2 -
        stripWidth / 2;

    let photoWidth =
        stripWidth - 30;

    let photoHeight =
        photoWidth * 0.72;

    let gap = 12;

    let stripHeight =
        photoHeight * 4 +
        gap * 3 +
        90;

    // shadow
    fill(220, 220, 220, 80);

    rect(
        stripX + 8,
        38,
        stripWidth,
        stripHeight,
        30
    );

    // strip
    fill(255);

    rect(
        stripX,
        30,
        stripWidth,
        stripHeight,
        30
    );

    // title
    fill("#ff4d6d");

    textSize(
        min(width * 0.045, 30)
    );

    text(
        "촬영 결과",
        width / 2,
        70
    );

    // date
    fill("#999");

    textSize(
        min(width * 0.025, 18)
    );

    let today =
        year() + "." +
        nf(month(), 2) + "." +
        nf(day(), 2);

    text(
        today,
        width / 2,
        100
    );

    // photos
    for (let i = 0; i < capturedPhotos.length; i++) {

        image(
            capturedPhotos[i],

            stripX + 15,

            120 +
            i * (photoHeight + gap),

            photoWidth,

            photoHeight
        );
    }

    // save button
    let btnW;

    if (width < 700) {

        btnW = width * 0.7;
    }

    else {

        btnW = 300;
    }

    fill("#ff4d6d");

    rect(
        width / 2 - btnW / 2,
        height - 80,
        btnW,
        55,
        22
    );

    fill(255);

    textSize(
        min(width * 0.04, 28)
    );

    text(
        "저장하기",
        width / 2,
        height - 52
    );
}

// =====================================================
// CLICK
// =====================================================
function mousePressed() {

    handleButtons();
}

// =====================================================
// TOUCH
// =====================================================
function touchStarted() {

    handleButtons();

    return false;
}

// =====================================================
// BUTTONS
// =====================================================
function handleButtons() {

    // =========================
    // START BUTTON
    // =========================
    if (currentScreen === "start") {

        let btnW;

        if (width < 700) {

            btnW = width * 0.7;
        }

        else {

            btnW = 320;
        }

        if (
            mouseX > width / 2 - btnW / 2 &&
            mouseX < width / 2 + btnW / 2 &&
            mouseY > height * 0.8 &&
            mouseY < height * 0.8 + 65
        ) {

            currentScreen = "camera";
        }
    }

    // =========================
    // CAMERA SCREEN
    // =========================
    else if (currentScreen === "camera") {

        // capture
        let btnW;

        if (width < 700) {

            btnW = width * 0.65;
        }

        else {

            btnW = 320;
        }

        if (
            mouseX > width / 2 - btnW / 2 &&
            mouseX < width / 2 + btnW / 2 &&
            mouseY > height - 80 &&
            mouseY < height - 25
        ) {

            startPhotoSequence();
        }

        // filters
        let buttonSize;

        if (width < 700) {

            buttonSize = 52;
        }

        else {

            buttonSize = 60;
        }

        let gap = 15;

        let totalWidth =
            buttonSize * 4 +
            gap * 3;

        let startX =
            width / 2 -
            totalWidth / 2;

        let y = 20;

        for (let i = 0; i < 4; i++) {

            let bx =
                startX +
                i * (buttonSize + gap);

            if (
                mouseX > bx &&
                mouseX < bx + buttonSize &&
                mouseY > y &&
                mouseY < y + buttonSize
            ) {

                selectedFilter = i;
            }
        }
    }

    // =========================
    // SAVE BUTTON
    // =========================
    else if (currentScreen === "result") {

        let btnW;

        if (width < 700) {

            btnW = width * 0.7;
        }

        else {

            btnW = 300;
        }

        if (
            mouseX > width / 2 - btnW / 2 &&
            mouseX < width / 2 + btnW / 2 &&
            mouseY > height - 80 &&
            mouseY < height - 25
        ) {

            saveCanvas(
                "4cut-photo",
                "png"
            );
        }
    }
}

// =====================================================
// RESIZE
// =====================================================
function windowResized() {

    resizeCanvas(
        windowWidth,
        windowHeight
    );

    if (video && video.size) {

        video.size(
            windowWidth,
            windowHeight
        );
    }
}
