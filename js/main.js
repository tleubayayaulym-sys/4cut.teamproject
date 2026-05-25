let currentScreen = "start";

// setup
function setup() {

    createCanvas(windowWidth, windowHeight);

    setupCamera();
}

// draw
function draw() {

    background(220);

    // START SCREEN
    if (currentScreen === "start") {

        drawStartScreen();
    }

    // CAMERA SCREEN
    else if (currentScreen === "camera") {

        drawCamera();

        drawCameraButton();
    }

    // RESULT SCREEN
    else if (currentScreen === "result") {

        drawResultScreen();
    }
}

// START SCREEN
function drawStartScreen() {

    background(210, 210, 210);

    textAlign(CENTER, CENTER);

    // start button
    fill(245);

    stroke(180);

    strokeWeight(3);

    rect(
        width / 2 - width * 0.22,
        height * 0.68,
        width * 0.44,
        70,
        20
    );

    fill(120);

    noStroke();

    textSize(width * 0.05);

    text(
        "시작",
        width / 2,
        height * 0.68 + 35
    );
}

// CAMERA BUTTON
function drawCameraButton() {

    fill(245);

    stroke(180);

    strokeWeight(3);

    rect(
        width / 2 - width * 0.2,
        height - 140,
        width * 0.4,
        60,
        20
    );

    fill(120);

    noStroke();

    textAlign(CENTER, CENTER);

    textSize(width * 0.05);

    text(
        "촬영하기",
        width / 2,
        height - 110
    );
}

// RESULT SCREEN
function drawResultScreen() {

    background(235);

    let stripWidth;

    // mobile
    if (width < 700) {

        stripWidth = width * 0.55;
    }

    // desktop
    else {

        stripWidth = 260;
    }

    let stripX =
        width / 2 - stripWidth / 2;

    let photoWidth =
        stripWidth - 20;

    let photoHeight =
        photoWidth * 0.75;

    let gap = 12;

    let stripHeight =
        photoHeight * 4 +
        gap * 3 +
        120;

    // strip
    fill(255);

    rect(
        stripX,
        30,
        stripWidth,
        stripHeight,
        30
    );

    // result text
    fill(170);

    textAlign(CENTER);

    textSize(
        min(width * 0.05, 28)
    );

    text(
        "촬영 결과",
        width / 2,
        70
    );

    // photos
    for (let i = 0; i < capturedPhotos.length; i++) {

        image(
            capturedPhotos[i],
            stripX + 10,
            100 + i * (photoHeight + gap),
            photoWidth,
            photoHeight
        );
    }
}

// click
function mousePressed() {

    handleButtons();
}

// touch
function touchStarted() {

    handleButtons();

    return false;
}

// buttons
function handleButtons() {

    // START
    if (
        currentScreen === "start" &&
        mouseX > width / 2 - width * 0.22 &&
        mouseX < width / 2 + width * 0.22 &&
        mouseY > height * 0.68 &&
        mouseY < height * 0.68 + 70
    ) {

        currentScreen = "camera";
    }

    // CAPTURE
    else if (
        currentScreen === "camera" &&
        mouseX > width / 2 - width * 0.2 &&
        mouseX < width / 2 + width * 0.2 &&
        mouseY > height - 140 &&
        mouseY < height - 80
    ) {

        startPhotoSequence();
    }
}

// resize
function windowResized() {

    resizeCanvas(windowWidth, windowHeight);
}
