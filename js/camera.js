let video;

let capturedPhotos = [];

let countdown = 0;

let isCapturing = false;

// 카메라 설정
function setupCamera() {

    video = createCapture(VIDEO);

    video.size(
        windowWidth,
        windowHeight
    );

    video.hide();
}

// 카메라 화면
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

    // countdown
    if (countdown > 0) {

        fill(255);

        stroke("#ff4d6d");

        strokeWeight(7);

        textAlign(CENTER, CENTER);

        textSize(
            min(width * 0.2, 150)
        );

        text(
            countdown,
            width / 2,
            height / 2
        );
    }

    // preview
    drawPhotoPreview();
}

// 촬영 시작
function startPhotoSequence() {

    if (isCapturing) {
        return;
    }

    capturedPhotos = [];

    isCapturing = true;

    takePhoto(0);
}

// 4장 촬영
function takePhoto(index) {

    // finish
    if (index >= 4) {

        isCapturing = false;

        currentScreen = "result";

        return;
    }

    countdown = 3;

    let timer = setInterval(() => {

        countdown--;

        if (countdown <= 0) {

            clearInterval(timer);

            countdown = 0;

            flashEffect();

            let img = video.get();

            capturedPhotos.push(img);

            setTimeout(() => {

                takePhoto(index + 1);

            }, 900);
        }

    }, 1000);
}

// flash
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

// preview
function drawPhotoPreview() {

    rectMode(CORNER);

    let previewWidth;

    // mobile
    if (width < 700) {

        previewWidth = width * 0.16;
    }

    // desktop
    else {

        previewWidth = 95;
    }

    // square
    let previewHeight =
        previewWidth;

    let gap = 10;

    let totalWidth =
        previewWidth * 4 +
        gap * 3;

    let startX =
        width / 2 -
        totalWidth / 2;

    // above button
    let y =
        height -
        previewHeight -
        100;

    for (let i = 0; i < 4; i++) {

        // frame
        fill(255);

        stroke("#ff4d6d");

        strokeWeight(3);

        rect(
            startX +
            i * (previewWidth + gap),

            y,

            previewWidth,

            previewHeight,

            15
        );

        // image
        if (capturedPhotos[i]) {

            image(
                capturedPhotos[i],

                startX +
                i * (previewWidth + gap),

                y,

                previewWidth,

                previewHeight
            );
        }
    }
}
