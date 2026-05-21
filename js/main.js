let currentScreen = "start";

// setup
function setup() {

    createCanvas(windowWidth, windowHeight);

    setupCamera();
}

// draw loop
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

    // glow
    fill(255, 120);

    ellipse(width / 2, height / 2, width * 0.7);

    // title
    fill(255);

    stroke(170);

    strokeWeight(4);

    textAlign(CENTER, CENTER);

    textSize(width * 0.08);

    text(
        "Silver Photo Booth ✨",
        width / 2,
        height * 0.22
    );

    // bow
    textSize(width * 0.12);

    text(
        "🎀",
        width / 2,
        height * 0.35
    );

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
        "START",
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
        height - 100,
        width * 0.4,
        60,
        20
    );

    fill(120);

    noStroke();

    textAlign(CENTER, CENTER);

    textSize(width * 0.05);

    text(
        "CAPTURE",
        width / 2,
        height - 70
    );
}

// RESULT SCREEN
function drawResultScreen() {

    background(235);

    // responsive strip
    let stripWidth = width * 0.42;

    let stripX = width / 2 - stripWidth / 2;

    let photoWidth = stripWidth - 30;

    let photoHeight = photoWidth * 0.75;

    let stripHeight =
        photoHeight * 4 + 140;

    // strip background
    fill(255);

    rect(
        stripX,
        30,
        stripWidth,
        stripHeight,
        30
    );

    // title
    fill(160);

    textAlign(CENTER);

    textSize(width * 0.06);

    text(
        "Your Photos ✨",
        width / 2,
        70
    );

    // photos
    for (let i = 0; i < capturedPhotos.length; i++) {

        image(
            capturedPhotos[i],
            stripX + 15,
            100 + i * (photoHeight + 15),
            photoWidth,
            photoHeight
        );
    }
}

// mouse
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
        mouseY > height - 100 &&
        mouseY < height - 40
    ) {

        startPhotoSequence();
    }
}

// resize
function windowResized() {

    resizeCanvas(windowWidth, windowHeight);
}
