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

        drawFilterButtons();

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

    rectMode(CORNER);

    // title
    fill("#ff4d6d");

    noStroke();

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

// 필터 버튼
function drawFilterButtons() {

    let names = [
        "🐱",
        "🐰",
        "👓",
        "👑"
    ];

    let buttonSize = 60;

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

            fill(255);
        }

        stroke("#ff4d6d");

        strokeWeight(3);

        rect(
            startX +
            i * (buttonSize + gap),

            y,

            buttonSize,

            buttonSize,

            18
        );

        textAlign(CENTER, CENTER);

        textSize(30);

        noStroke();

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

// 촬영 버튼
function drawCameraButton() {

    rectMode(CORNER);

    fill("#ff4d6d");

    noStroke();

    rect(
        width / 2 - width * 0.2,
        height - 75,
        width * 0.4,
        55,
        20
    );

    fill(255);

    textSize(
        min(width * 0.045, 30)
    );

    text(
        "촬영하기",
        width / 2,
        height - 48
    );
}

// 결과 화면
function drawResultScreen() {

    background("#f6f1ff");

    rectMode(CORNER);

    let stripWidth;

    // mobile
    if (width < 700) {

        stripWidth = width * 0.75;
    }

    // desktop
    else {

        stripWidth = 420;
    }

    let stripX =
        width / 2 -
        stripWidth / 2;

    // square photos
    let photoWidth =
        (stripWidth - 30) / 2;

    let photoHeight =
        photoWidth;

    let gap = 10;

    // strip background
    fill(255);

    noStroke();

    rect(
        stripX,
        40,
        stripWidth,
        photoHeight * 2 +
        gap +
        30,
        20
    );

    // 2x2 photos
    for (let i = 0; i < capturedPhotos.length; i++) {

        let x =
            stripX + 10 +
            (i % 2) * (photoWidth + gap);

        let y =
            50 +
            floor(i / 2) *
            (photoHeight + gap);

        image(
            capturedPhotos[i],
            x,
            y,
            photoWidth,
            photoHeight
        );
    }

    // save button
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
        height - 75 &&

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

    // 필터 선택
    if (currentScreen === "camera") {

        let buttonSize = 60;

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
}

// resize
function windowResized() {

    resizeCanvas(
        windowWidth,
        windowHeight
    );

    if (video) {

        if (video && video.size) {

            video.size(
                windowWidth,
                windowHeight
            );
        }
    }
}
