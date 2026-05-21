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

    // silver glow
    fill(255, 120);

    ellipse(width / 2, height / 2, 500);

    // title
    fill(255);

    stroke(170);

    strokeWeight(4);

    textAlign(CENTER, CENTER);

    textSize(width * 0.07);

    text("Silver Photo Booth ✨", width / 2, height * 0.25);

    // bow
    textSize(width * 0.1);

    text("🎀", width / 2, height * 0.38);

    // start button
    fill(245);

    stroke(180);

    strokeWeight(3);

    rect(
        width / 2 - 120,
        height * 0.65,
        240,
        70,
        20
    );

    fill(120);

    noStroke();

    textSize(28);

    text(
        "START",
        width / 2,
        height * 0.65 + 35
    );
}

// camera button
function drawCameraButton() {

    fill(245);

    stroke(180);

    strokeWeight(3);

    rect(
        width / 2 - 110,
        height - 100,
        220,
        60,
        20
    );

    fill(120);

    noStroke();

    textAlign(CENTER, CENTER);

    textSize(24);

    text(
        "CAPTURE",
        width / 2,
        height - 70
    );
}

// result screen
function drawResultScreen() {

    background(235);

    fill(255);

    rect(width / 2 - 110, 40, 220, height - 80, 30);

    // title
    fill(160);

    textAlign(CENTER);

    textSize(30);

    text(
        "Your Photos ✨",
        width / 2,
        90
    );

    // photos
    for (let i = 0; i < capturedPhotos.length; i++) {

        image(
            capturedPhotos[i],
            width / 2 - 80,
            120 + i * 140,
            160,
            120
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
        mouseX > width / 2 - 120 &&
        mouseX < width / 2 + 120 &&
        mouseY > height * 0.65 &&
        mouseY < height * 0.65 + 70
    ) {

        currentScreen = "camera";
    }

    // CAPTURE
    else if (
        currentScreen === "camera" &&
        mouseX > width / 2 - 110 &&
        mouseX < width / 2 + 110 &&
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
