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

// draw camera
function drawCamera() {

    image(
        video,
        0,
        0,
        windowWidth,
        windowHeight
    );

    // silver overlay
    fill(255, 255, 255, 40);

    rect(0, 0, width, height);

    // countdown
    if (countdown > 0) {

        fill(255);

        stroke(180);

        strokeWeight(6);

        textAlign(CENTER, CENTER);

        textSize(width * 0.15);

        text(
            countdown,
            width / 2,
            height / 2
        );
    }

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
