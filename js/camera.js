// camera.js

let video;

let capturedPhotos = [];

let countdown = 0;

let isCapturing = false;

// 선택된 필터
// 0 = 고양이
// 1 = 토끼
// 2 = 안경
// 3 = 왕관
let selectedFilter = 0;

// =========================
// 카메라 설정
// =========================
function setupCamera() {

    video = createCapture(
        VIDEO,
        () => {
            console.log("camera ready");
        }
    );

    video.size(
        windowWidth,
        windowHeight
    );

    video.hide();

    // FaceMesh 시작
    initFaceMesh(video);
}

// =========================
// 카메라 화면
// =========================
function drawCamera() {

    imageMode(CORNER);

    // fullscreen camera
    image(
        video,
        0,
        0,
        width,
        height
    );

    // =========================
    // AR FILTER
    // =========================
    drawARFilter(
        width / 2,
        height / 2,
        selectedFilter
    );

    updateParticles();

    drawFaceStatus(
        width,
        height
    );

    // =========================
    // FILTER SELECT UI
    // =========================
    drawFilterButtons();

    // =========================
    // COUNTDOWN
    // =========================
    if (countdown > 0) {

        fill(255);

        stroke("#ff4d6d");

        strokeWeight(8);

        textAlign(CENTER, CENTER);

        textSize(
            min(width * 0.22, 170)
        );

        text(
            countdown,
            width / 2,
            height / 2
        );
    }

    // =========================
    // PREVIEW
    // =========================
    drawPhotoPreview();
}

// =========================
// FILTER BUTTONS
// =========================
function drawFilterButtons() {

    let names = [
        "🐱",
        "🐰",
        "👓",
        "👑"
    ];

    let buttonSize = 58;

    let gap = 14;

    let totalWidth =
        buttonSize * 4 +
        gap * 3;

    let startX =
        width / 2 -
        totalWidth / 2;

    let y = 20;

    textAlign(CENTER, CENTER);

    for (let i = 0; i < 4; i++) {

        // selected
        if (selectedFilter === i) {

            fill("#ff4d6d");
        }

        // normal
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

        textSize(28);

        text(
            names[i],

            startX +
            i * (buttonSize + gap) +
            buttonSize / 2,

            y + buttonSize / 2 + 1
        );
    }
}

// =========================
// 촬영 시작
// =========================
function startPhotoSequence() {

    if (isCapturing) {
        return;
    }

    capturedPhotos = [];

    isCapturing = true;

    takePhoto(0);
}

// =========================
// 4장 촬영
// =========================
function takePhoto(index) {

    // 끝
    if (index >= 4) {

        isCapturing = false;

        currentScreen = "result";

        return;
    }

    countdown = 3;

    let timer = setInterval(() => {

        countdown--;

        // capture
        if (countdown <= 0) {

            clearInterval(timer);

            countdown = 0;

            flashEffect();

            let img = video.get();

            capturedPhotos.push(img);

            // next photo
            setTimeout(() => {

                takePhoto(index + 1);

            }, 850);
        }

    }, 1000);
}

// =========================
// FLASH EFFECT
// =========================
function flashEffect() {

    push();

    rectMode(CORNER);

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

// =========================
// PHOTO PREVIEW
// =========================
function drawPhotoPreview() {

    rectMode(CORNER);

    let previewSize;

    // mobile
    if (width < 700) {

        previewSize = width * 0.15;
    }

    // desktop
    else {

        previewSize = 90;
    }

    let gap = 10;

    let totalWidth =
        previewSize * 4 +
        gap * 3;

    let startX =
        width / 2 -
        totalWidth / 2;

    // 버튼 위
    let y =
        height -
        previewSize -
        95;

    for (let i = 0; i < 4; i++) {

        // frame
        fill(255, 240);

        stroke("#ff4d6d");

        strokeWeight(3);

        rect(
            startX +
            i * (previewSize + gap),

            y,

            previewSize,

            previewSize,

            15
        );

        // image
        if (capturedPhotos[i]) {

            image(
                capturedPhotos[i],

                startX +
                i * (previewSize + gap),

                y,

                previewSize,

                previewSize
            );
        }
    }
}

// =========================
// FILTER CLICK
// =========================
function handleFilterButtons() {

    let buttonSize = 58;

    let gap = 14;

    let totalWidth =
        buttonSize * 4 +
        gap * 3;

    let startX =
        width / 2 -
        totalWidth / 2;

    let y = 20;

    for (let i = 0; i < 4; i++) {

        let x =
            startX +
            i * (buttonSize + gap);

        if (
            mouseX > x &&
            mouseX < x + buttonSize &&
            mouseY > y &&
            mouseY < y + buttonSize
        ) {

            selectedFilter = i;
        }
    }
}
