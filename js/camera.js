let video;

let capturedPhotos = [];

let countdown = 0;

let isCapturing = false;

// setup camera
function setupCamera() {

    video = createCapture({

        video: true,
        audio: false
    });

    video.size(windowWidth, windowHeight);

    video.hide();
}

// draw camera screen
function drawCamera() {

    // camera
    image(
        video,
        0,
        0,
        windowWidth,
        windowHeight
    );

    // silver overlay
    fill(255, 255, 255, 35);

    rect(0, 0, width, height);

    // title
    fill(255);

    stroke(180);

    strokeWeight(3);

    textAlign(CENTER, CENTER);

    textSize(min(width * 0.06, 32));

    text(
        "Silver Photo Booth ✨",
        width / 2,
        40
    );

    // countdown
    if (countdown > 0) {

        fill(255);

        stroke(180);

        strokeWeight(6);

        textSize(width * 0.15);

        text(
            countdown,
            width / 2,
            height / 2
        );
    }

    // preview photos
    drawPhotoPreview();

    // stars
    drawStars();
}

// start sequence
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

            flashEffect();

            let img = video.get();

            capturedPhotos.push(img);

            setTimeout(() => {

                takePhoto(index + 1);

            }, 1000);
        }

    }, 1000);
}

// flash
function flashEffect() {

    fill(255);

    rect(0, 0, width, height);
}

// stars
function drawStars() {

    noStroke();

    for (let i = 0; i < 20; i++) {

        fill(255, random(80, 180));

        ellipse(
            random(width),
            random(height),
            random(2, 5)
        );
    }
}

// preview photos
function drawPhotoPreview() {

    let previewSize;

    // mobile
    if (width < 700) {

        previewSize = width * 0.18;
    }

    // desktop
    else {

        previewSize = 110;
    }

    let gap = 10;

    let totalWidth =
        previewSize * 4 + gap * 3;

    let startX =
        width / 2 - totalWidth / 2;

    let y =
        height - previewSize - 20;

    // slots
    for (let i = 0; i < 4; i++) {

        fill(255, 180);

        stroke(200);

        strokeWeight(2);

        rect(
            startX + i * (previewSize + gap),
            y,
            previewSize,
            previewSize * 0.75,
            12
        );

        // image
        if (capturedPhotos[i]) {

            image(
                capturedPhotos[i],
                startX + i * (previewSize + gap),
                y,
                previewSize,
                previewSize * 0.75
            );
        }
    }
}
