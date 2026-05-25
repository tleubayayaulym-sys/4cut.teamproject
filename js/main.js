let currentScreen = "start";

// setup
function setup() {

    createCanvas(
        windowWidth,
        windowHeight
    );

    setupCamera();

    rectMode(CORNER);

    textAlign(CENTER, CENTER);
}

// draw
function draw() {

    background("#f6f1ff");

    // 시작 화면
    if (currentScreen === "start") {

        drawStartScreen();
    }

    // 카메라 화면
    else if (currentScreen === "camera") {

        drawCamera();

        drawCameraButton();
    }

    // 결과 화면
    else if (currentScreen === "result") {

        drawResultScreen();
    }
}

// 시작 화면
function drawStartScreen() {

    background("#f6f1ff");

    // title
    fill("#ff4d6d");

    textSize(
        min(width * 0.1, 70)
    );

    text(
        "4CUT BOOTH",
        width / 2,
        height * 0.22
    );

    // subtitle
    fill("#666");

    textSize(
        min(width * 0.03, 24)
    );

    text(
        "포토부스 촬영",
        width / 2,
        height * 0.32
    );

    // start button
    fill("#ff4d6d");

    noStroke();

    rect(
        width / 2 - width * 0.21,
        height * 0.62 - 40,
        width * 0.42,
        80,
        25
    );

    fill(255);

    textSize(
        min(width * 0.05, 36)
    );

    text(
        "시작하기",
        width / 2,
        height * 0.62
    );
}

// 촬영 버튼
function drawCameraButton() {

    fill("#ff4d6d");

    noStroke();

    rect(
        width / 2 - width * 0.2,
        height - 80,
        width * 0.4,
        60,
        25
    );

    fill(255);

    textSize(
        min(width * 0.045, 32)
    );

    text(
        "촬영하기",
        width / 2,
        height - 50
    );
}

// 결과 화면
function drawResultScreen() {

    background("#f6f1ff");

    let stripWidth;

    // mobile
    if (width < 700) {

        stripWidth = width * 0.55;
    }

    // desktop
    else {

        stripWidth = 320;
    }

    let stripX =
        width / 2 -
        stripWidth / 2;

    let photoWidth =
        stripWidth - 20;

    // 세로 비율
    let photoHeight =
        photoWidth * 1.25;

    let gap = 10;

    // strip background
    fill(255);

    rect(
        stripX,
        20,
        stripWidth,
        photoHeight * 4 +
        gap * 3 +
        20,
        20
    );

    // photos
    for (let i = 0; i < capturedPhotos.length; i++) {

        image(
            capturedPhotos[i],

            stripX + 10,

            30 + i * (photoHeight + gap),

            photoWidth,

            photoHeight
        );
    }

    // 저장 버튼
    fill("#ff4d6d");

    rect(
        width / 2 - width * 0.2,
        height - 75,
        width * 0.4,
        55,
        20
    );

    fill(255);

    textSize(
        min(width * 0.04, 28)
    );

    text(
        "저장하기",
        width / 2,
        height - 48
    );
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

// button logic
function handleButtons() {

    // 시작하기
    if (
        currentScreen === "start" &&

        mouseX >
        width / 2 - width * 0.21 &&

        mouseX <
        width / 2 + width * 0.21 &&

        mouseY >
        height * 0.62 - 40 &&

        mouseY <
        height * 0.62 + 40
    ) {

        currentScreen = "camera";
    }

    // 촬영하기
    else if (
        currentScreen === "camera" &&

        mouseX >
        width / 2 - width * 0.2 &&

        mouseX <
        width / 2 + width * 0.2 &&

        mouseY >
        height - 80 &&

        mouseY <
        height - 20
    ) {

        startPhotoSequence();
    }

    // 저장하기
    else if (
        currentScreen === "result" &&

        mouseX >
        width / 2 - width * 0.2 &&

        mouseX <
        width / 2 + width * 0.2 &&

        mouseY >
        height - 75 &&

        mouseY <
        height - 20
    ) {

        saveCanvas(
            "4cut-photo",
            "png"
        );
    }
}

// resize
function windowResized() {

    resizeCanvas(
        windowWidth,
        windowHeight
    );
}
