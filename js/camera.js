let video;
let capturedPhotos = [];

let countdown = 0;
let isCapturing = false;

function setupCamera() {

    video = createCapture(VIDEO);

    video.size(400, 300);

    video.hide();
}

function drawCamera() {

    // camera image
    image(video, 0, 0, 400, 300);

    // countdown text
    if (countdown > 0) {

        fill(255);
        stroke(0);
        strokeWeight(4);

        textAlign(CENTER, CENTER);

        textSize(80);

        text(countdown, 200, 150);
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

        console.log("Done!");

        return;
    }

    countdown = 3;

    let timer = setInterval(function() {

        countdown--;

        if (countdown <= 0) {

            clearInterval(timer);

            flashEffect();

            let img = get(0, 0, 400, 300);

            capturedPhotos.push(img);

            setTimeout(function() {

                takePhoto(index + 1);

            }, 800);
        }

    }, 1000);
}

function flashEffect() {

    fill(255);

    rect(0, 0, width, height);
}

function showCapturedPhotos() {

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
