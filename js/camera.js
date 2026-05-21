let video;

let capturedPhotos = [];

let countdown = 0;

let isCapturing = false;

function setup() {

    createCanvas(400, 400);

    background(255, 240, 245);

    textAlign(CENTER, CENTER);

    textSize(24);

    text("Loading Camera...", 200, 200);

    setupCamera();
}

function setupCamera() {

    video = createCapture({
        video: true,
        audio: false
    });

    video.size(400, 300);

    video.hide();
}

function draw() {

    background(255, 240, 245);

    // camera
    if (video) {

        image(video, 0, 0, 400, 300);
    }

    // countdown
    if (countdown > 0) {

        fill(255);

        stroke(0);

        strokeWeight(4);

        textSize(80);

        text(countdown, 200, 150);
    }

    // preview photos
    for (let i = 0; i < capturedPhotos.length; i++) {

        image(
            capturedPhotos[i],
            10 + i * 95,
            320,
            80,
            60
        );
    }
}

function startPhotoSequence() {

    if (isCapturing) {
        return;
    }

    capturedPhotos = [];

    isCapturing = true;

    takePhoto(0);
}

function takePhoto(index) {

    if (index >= 4) {

        isCapturing = false;

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

function flashEffect() {

    fill(255);

    rect(0, 0, width, height);
}
