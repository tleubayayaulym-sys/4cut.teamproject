let currentScreen = "start";

let selectedFilter = 0;
let selectedFrame = 0;

// ======================
// setup
// ======================
function setup() {

    createCanvas(
        windowWidth,
        windowHeight
    );

    setupCamera();

    textAlign(CENTER, CENTER);
}

// ======================
// draw
// ======================
function draw() {

    background("#f6f1ff");

    // START
    if (currentScreen === "start") {

        drawStartScreen();
    }

    // SETTINGS
    else if (currentScreen === "settings") {

        drawSettingsScreen();
    }

    // CAMERA
    else if (currentScreen === "camera") {

        drawCamera();

        drawCameraButton();
    }

    // RESULT
    else if (currentScreen === "result") {

        drawResultScreen();
    }

    // SAVED
    else if (currentScreen === "saved") {

        drawSavedScreen();
    }
}

// ======================
// START
// ======================
function drawStartScreen() {

    background("#f6f1ff");

    fill("#ff4d6d");

    noStroke();

    textSize(
        min(width * 0.1, 70)
    );

    text(
        "4CUT BOOTH",
        width / 2,
        height * 0.25
    );

    fill("#666");

    textSize(22);

    text(
        "포토부스 촬영",
        width / 2,
        height * 0.35
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

// ======================
// SETTINGS
// ======================
function drawSettingsScreen() {

    background("#f6f1ff");

    fill("#ff4d6d");

    textSize(42);

    text(
        "설정",
        width / 2,
        70
    );

    // 필터 제목
    fill("#555");

    textSize(26);

    text(
        "필터 선택",
        width / 2,
        140
    );

    drawFilterOptions();

    // 프레임 제목
    text(
        "프레임 선택",
        width / 2,
        330
    );

    drawFrameOptions();

    // 촬영 시작 버튼
    fill("#ff4d6d");

    rect(
        width / 2 - 150,
        height - 120,
        300,
        70,
        25
    );

    fill(255);

    textSize(30);

    text(
        "촬영 시작",
        width / 2,
        height - 85
    );
}

// ======================
// FILTER OPTIONS
// ======================
function drawFilterOptions() {

    let filters = [
        "🐱",
        "🐰",
        "👓",
        "👑"
    ];

    let size = 65;

    let gap = 18;

    let startX =
        width / 2 -
        (size * 4 + gap * 3) / 2;

    let y = 180;

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
            startX + i * (size + gap),
            y,
            size,
            size,
            20
        );

        noStroke();

        if (selectedFilter === i) {

            fill(255);
        }

        else {

            fill("#ff4d6d");
        }

        textSize(34);

        text(
            filters[i],
            startX + i * (size + gap) + size / 2,
            y + size / 2 + 2
        );
    }
}

// ======================
// FRAME OPTIONS
// ======================
function drawFrameOptions() {

    let colors = [
        "#ffffff",
        "#ffd6e8",
        "#d6e4ff",
        "#e2ffd6"
    ];

    let size = 70;

    let gap = 18;

    let startX =
        width / 2 -
        (size * 4 + gap * 3) / 2;

    let y = 370;

    for (let i = 0; i < 4; i++) {

        fill(colors[i]);

        strokeWeight(5);

        if (selectedFrame === i) {

            stroke("#ff4d6d");
        }

        else {

            stroke("#ccc");
        }

        rect(
            startX + i * (size + gap),
            y,
            size,
            size,
            20
        );
    }
}

// ======================
// CAMERA BUTTON
// ======================
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

// ======================
// RESULT
// ======================
function drawResultScreen() {

    background("#f6f1ff");

    let stripWidth;

    if (width < 700) {

        stripWidth = width * 0.82;
    }

    else {

        stripWidth = 440;
    }

    let stripX =
        width / 2 -
        stripWidth / 2;

    let photoWidth =
        (stripWidth - 30) / 2;

    let photoHeight =
        photoWidth;

    let gap = 10;

    // frame background
    let frameColors = [
        "#ffffff",
        "#ffd6e8",
        "#d6e4ff",
        "#e2ffd6"
    ];

    fill(
        frameColors[selectedFrame]
    );

    noStroke();

    rect(
        stripX,
        40,
        stripWidth,
        photoHeight * 2 + 40,
        25
    );

    // photos
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
        width / 2 - 145,
        height - 140,
        290,
        55,
        20
    );

    fill(255);

    textSize(26);

    text(
        "저장하기",
        width / 2,
        height - 112
    );

    // 다시 촬영 버튼
    fill("#ffffff");

    stroke("#ff4d6d");

    strokeWeight(3);

    rect(
        width / 2 - 145,
        height - 70,
        290,
        55,
        20
    );

    fill("#ff4d6d");

    noStroke();

    text(
        "다시 촬영",
        width / 2,
        height - 42
    );
}

// ======================
// SAVED SCREEN
// ======================
function drawSavedScreen() {

    background("#f6f1ff");

    fill("#ff4d6d");

    textSize(44);

    text(
        "저장 완료 💖",
        width / 2,
        height * 0.35
    );

    // 새로 촬영
    fill("#ff4d6d");

    rect(
        width / 2 - 145,
        height * 0.55,
        290,
        60,
        20
    );

    fill(255);

    textSize(28);

    text(
        "새로 촬영",
        width / 2,
        height * 0.55 + 30
    );

    // 처음으로
    fill("#ffffff");

    stroke("#ff4d6d");

    strokeWeight(3);

    rect(
        width / 2 - 145,
        height * 0.68,
        290,
        60,
        20
    );

    fill("#ff4d6d");

    noStroke();

    text(
        "처음으로",
        width / 2,
        height * 0.68 + 30
    );
}

// ======================
// click
// ======================
function mousePressed() {

    handleButtons();
}

function touchStarted() {

    handleButtons();

    return false;
}

// ======================
// BUTTONS
// ======================
function handleButtons() {

    // START → SETTINGS
    if (
        currentScreen === "start" &&
        mouseX > width / 2 - 140 &&
        mouseX < width / 2 + 140 &&
        mouseY > height * 0.62 - 40 &&
        mouseY < height * 0.62 + 40
    ) {

        currentScreen = "settings";
    }

    // SETTINGS
    else if (currentScreen === "settings") {

        // filter select
        let size = 65;
        let gap = 18;

        let startX =
            width / 2 -
            (size * 4 + gap * 3) / 2;

        let y = 180;

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

        // frame select
        let fy = 370;

        for (let i = 0; i < 4; i++) {

            let bx =
                startX + i * (size + gap);

            if (
                mouseX > bx &&
                mouseX < bx + size &&
                mouseY > fy &&
                mouseY < fy + size
            ) {

                selectedFrame = i;
            }
        }

        // start camera
        if (
            mouseX > width / 2 - 150 &&
            mouseX < width / 2 + 150 &&
            mouseY > height - 120 &&
            mouseY < height - 50
        ) {

            currentScreen = "camera";
        }
    }

    // CAMERA
    else if (
        currentScreen === "camera" &&
        mouseX > width / 2 - 130 &&
        mouseX < width / 2 + 130 &&
        mouseY > height - 75 &&
        mouseY < height - 20
    ) {

        startPhotoSequence();
    }

    // RESULT
    else if (currentScreen === "result") {

        // 저장하기
        if (
            mouseX > width / 2 - 145 &&
            mouseX < width / 2 + 145 &&
            mouseY > height - 140 &&
            mouseY < height - 85
        ) {

            saveCanvas(
                "4cut-photo",
                "png"
            );

            currentScreen = "saved";
        }

        // 다시 촬영
        if (
            mouseX > width / 2 - 145 &&
            mouseX < width / 2 + 145 &&
            mouseY > height - 70 &&
            mouseY < height - 15
        ) {

            capturedPhotos = [];

            currentScreen = "camera";
        }
    }

    // SAVED
    else if (currentScreen === "saved") {

        // 새로 촬영
        if (
            mouseX > width / 2 - 145 &&
            mouseX < width / 2 + 145 &&
            mouseY > height * 0.55 &&
            mouseY < height * 0.55 + 60
        ) {

            capturedPhotos = [];

            currentScreen = "camera";
        }

        // 처음으로
        if (
            mouseX > width / 2 - 145 &&
            mouseX < width / 2 + 145 &&
            mouseY > height * 0.68 &&
            mouseY < height * 0.68 + 60
        ) {

            capturedPhotos = [];

            currentScreen = "start";
        }
    }
}

// ======================
// resize
// ======================
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



