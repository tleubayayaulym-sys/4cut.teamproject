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

    // fullscreen camera
    image(
        video,
        0,
        0,
        width,
        height
    );

    // dark overlay
    fill(0, 0, 0, 35);

    rect(
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

    // preview photos
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

            }, 900);
        }

    }, 1000);
}

// flash effect
function flashEffect() {

    fill(255);

    rect(
        0,
        0,
        width,
        height
    );
}

// preview
function drawPhotoPreview() {

    let previewSize;

    // mobile
    if (width < 700) {

        previewSize = width * 0.18;
    }

    // desktop
    else {

        previewSize = 120;
    }

    let gap = 10;

    let totalWidth =
        previewSize * 4 +
        gap * 3;

    let startX =
        width / 2 -
        totalWidth / 2;

    let y =
        height -
        previewSize -
        20;

    // preview slots
    for (let i = 0; i < 4; i++) {

        fill(255);

        stroke("#ff4d6d");

        strokeWeight(3);

        rect(
            startX +
            i * (previewSize + gap),

            y,

            previewSize,

            previewSize * 0.75,

            15
        );

        // photo
        if (capturedPhotos[i]) {

            image(
                capturedPhotos[i],

                startX +
                i * (previewSize + gap),

                y,

                previewSize,

                previewSize * 0.75
            );
        }
    }
}
