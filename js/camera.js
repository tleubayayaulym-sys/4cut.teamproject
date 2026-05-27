const CAM_W = 640;
const CAM_H = 480;

let video;

let capturedPhotos = [];

let countdown = 0;

let isCapturing = false;

// setup camera
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

    // start FaceMesh
    if (
        typeof initFaceMesh ===
        "function"
    ) {

        initFaceMesh(video);
    }
}

// draw camera screen
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

    // AR filter
    if (
        typeof drawARFilter ===
        "function"
    ) {

        drawARFilter(
            width / 2,
            height / 2,
            selectedFilter
        );
    }

    // particles
    if (
        typeof updateParticles ===
        "function"
    ) {

        updateParticles();
    }

    // face status
    if (
        typeof drawFaceStatus ===
        "function"
    ) {

        drawFaceStatus(
            width,
            height
        );
    }

    // countdown
    if (countdown > 0) {

        fill(255);

        stroke("#ff4d6d");

        strokeWeight(7);

        textAlign(
            CENTER,
            CENTER
        );

        textSize(
            min(
                width * 0.2,
                150
            )
        );

        text(
            countdown,
            width / 2,
            height / 2
        );
    }

    // filter buttons
    drawFilterButtons();

    // preview photos
    drawPhotoPreview();
}

// filter buttons
function drawFilterButtons() {

    let names = [
        "🐱",
        "🐰",
        "👓",
        "👑"
    ];

    let size = 55;

    let gap = 12;

    let totalWidth =
        size * 4 +
        gap * 3;

    let startX =
        width / 2 -
        totalWidth / 2;

    let y = 20;

    textAlign(
        CENTER,
        CENTER
    );

    for (let i = 0; i < 4; i++) {

        // selected
        if (selectedFilter === i) {

            fill("#ff4d6d");
        }

        // normal
        else {

            fill(255);
        }

        stroke("#ff4d6d");

        strokeWeight(3);

        rect(
            startX +
            i * (size + gap),

            y,

            size,

            size,

            15
        );

        textSize(28);

        noStroke();

        fill(
            selectedFilter === i
            ? 255
            : "#ff4d6d"
        );

        text(
            names[i],

            startX +
            i * (size + gap) +
            size / 2,

            y + size / 2
        );
    }
}

// start photo sequence
function startPhotoSequence() {

    if (isCapturing) {

        return;
    }

    capturedPhotos = [];

    isCapturing = true;

    takePhoto(0);
}

// take 4 photos
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

            setTimeout(() => {

                takePhoto(index + 1);

            }, 900);
        }

    }, 1000);
}

// flash effect
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

// preview photos
function drawPhotoPreview() {

    rectMode(CORNER);

    let previewWidth;

    // mobile
    if (width < 700) {

        previewWidth =
            width * 0.16;
    }

    // desktop
    else {

        previewWidth = 95;
    }

    let previewHeight =
        previewWidth;

    let gap = 10;

    let totalWidth =
        previewWidth * 4 +
        gap * 3;

    let startX =
        width / 2 -
        totalWidth / 2;

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
            i * (
                previewWidth + gap
            ),

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
                i * (
                    previewWidth + gap
                ),

                y,

                previewWidth,

                previewHeight
            );
        }
    }
}

// filter select
function selectFilter() {

    let size = 55;

    let gap = 12;

    let totalWidth =
        size * 4 +
        gap * 3;

    let startX =
        width / 2 -
        totalWidth / 2;

    let y = 20;

    for (let i = 0; i < 4; i++) {

        let x =
            startX +
            i * (size + gap);

        if (
            mouseX > x &&
            mouseX < x + size &&
            mouseY > y &&
            mouseY < y + size
        ) {

            selectedFilter = i;
        }
    }
}

// resize
function resizeCamera() {

    if (video) {

        video.size(
            windowWidth,
            windowHeight
        );
    }
}
