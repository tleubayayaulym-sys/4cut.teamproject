let currentScreen = "start";

// 전역 변수
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

// =========================
// 시작 화면
// =========================
function drawStartScreen() {

    background("#f6f1ff");

    fill("#ff4d6d");

    noStroke();

    textSize(
        min(width * 0.11, 72)
    );

    text(
        "4CUT BOOTH",
        width / 2,
        height * 0.23
    );

    fill("#666");

    textSize(
        min(width * 0.035, 24)
    );

    text(
        "포토부스 촬영",
        width / 2,
        height * 0.33
    );

    // 시작 버튼
    fill("#ff4d6d");

    rect(
        width / 2 - 140,
        height * 0.62 - 40,
        280,
        80,
        25
    );

    fill(255);

    textSize(34);

    text(
        "시작하기",
        width / 2,
        height * 0.62
    );
}

// =========================
// 필터 버튼
// =========================
function drawFilterButtons() {

    let names = [
        "🐱",
        "🐰",
        "👓",
        "👑"
    ];

    let size = 60;

    let gap = 14;

    let total =
        size * 4 +
        gap * 3;

    let startX =
        width / 2 - total / 2;

    let y = 20;

    for (let i = 0; i < 4; i++) {

        // 선택된 버튼
        if (selectedFilter === i) {

            fill("#ff4d6d");
        }

        else {

            fill(255);
        }

        stroke("#ff4d6d");

        strokeWeight(3);

        rect(
            startX + i * (size + gap),
            y,
            size,
            size,
            18
        );

        noStroke();

        if (selectedFilter === i) {

            fill(255);
        }

        else {

            fill("#ff4d6d");
        }

        textSize(30);

        text(
            names[i],
            startX + i * (size + gap) + size / 2,
            y + size / 2 + 2
        );
    }
}

// =========================
// 촬영 버튼
// =========================
function drawCameraButton() {

    fill("#ff4d6d");

    noStroke();

    rect(
        width / 2 - 130,
        height - 75,
        260,
        55,
        20
    );

    fill(255);

    textSize(28);

    text(
        "촬영하기",
        width / 2,
        height - 47
    );
}

// =========================
// 결과 화면
// =========================
function drawResultScreen() {

    background("#f6f1ff");

    let stripWidth;

    // 모바일
    if (width < 700) {

        stripWidth = width * 0.82;
    }

    // 데스크탑
    else {

        stripWidth = 460;
    }

    let stripX =
        width / 2 - stripWidth / 2;

    let photoWidth =
        (stripWidth - 30) / 2;

    let photoHeight =
        photoWidth;

    let gap = 10;

    // 배경
    fill(255);

    noStroke();

    rect(
        stripX,
        40,
        stripWidth,
        photoHeight * 2 + 40,
        20
    );

    // 사진 출력
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

    // 저장 버튼
    fill("#ff4d6d");

    rect(
        width / 2 - 130,
        height - 75,
        260,
        55,
        20
    );

    fill(255);

    textSize(28);

    text(
        "저장하기",
        width / 2,
        height - 47
    );
}

// =========================
// 클릭
// =========================
function mousePressed() {

    handleButtons();
}

function touchStarted() {

    handleButtons();

    return false;
}

// =========================
// 버튼 처리
// =========================
function handleButtons() {

    // 시작하기
    if (
        currentScreen === "start" &&

        mouseX > width / 2 - 140 &&
        mouseX < width / 2 + 140 &&

        mouseY > height * 0.62 - 40 &&
        mouseY < height * 0.62 + 40
    ) {

        currentScreen = "camera";
    }

    // 촬영하기
    else if (
        currentScreen === "camera" &&

        mouseX > width / 2 - 130 &&
        mouseX < width / 2 + 130 &&

        mouseY > height - 75 &&
        mouseY < height - 20
    ) {

        startPhotoSequence();
    }

    // 저장하기
    else if (
        currentScreen === "result" &&

        mouseX > width / 2 - 130 &&
        mouseX < width / 2 + 130 &&

        mouseY > height - 75 &&
        mouseY < height - 20
    ) {

        saveCanvas(
            "4cut-photo",
            "png"
        );
    }

    // 필터 선택
    if (currentScreen === "camera") {

        let size = 60;

        let gap = 14;

        let total =
            size * 4 +
            gap * 3;

        let startX =
            width / 2 - total / 2;

        let y = 20;

        for (let i = 0; i < 4; i++) {

            let bx =
                startX + i * (size + gap);

            if (
                mouseX > bx &&
                mouseX < bx + size &&
                mouseY > y &&
                mouseY < y + size
            ) {

                selectedFilter = i;
            }
        }
    }
}

// =========================
// 화면 리사이즈
// =========================
function windowResized() {

    resizeCanvas(
        windowWidth,
        windowHeight
    );

    if (video) {

        video.size(
            windowWidth,
            windowHeight
        );
    }
}
