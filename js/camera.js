let video;
let capturedPhotos = [];

let countdownNumber = 3;
let isCountingDown = false;

function setupCamera() {

    // video element
    video = createCapture(VIDEO);

    video.size(400, 300);

    video.hide();
}

// draw camera screen
function drawCamera() {

    image(video, 0, 0, 400, 300);

    // countdown text
    if (isCountingDown) {

        fill(255);
        textAlign(CENTER, CENTER);

        textSize(80);

        text(countdownNumber, 200, 150);
    }
}

// start 4-photo capture
function startPhotoSequence() {

    if (isCountingDown) {
        return;
    }

    capturedPhotos = [];

    takePhotoSequence(0);
}

// recursive photo sequence
function takePhotoSequence(index) {

    if (index >= 4) {

        console.log("4 photos captured!");
        console.log(capturedPhotos);

        return;
    }

    countdownNumber = 3;

    isCountingDown = true;

    let countdownInterval = setInterval(function() {

        countdownNumber--;

        if (countdownNumber <= 0) {

            clearInterval(countdownInterval);

            flashEffect();

            captureCurrentPhoto();

            isCountingDown = false;

            setTimeout(function() {

                takePhotoSequence(index + 1);

            }, 800);
        }

    }, 1000);
}

// capture image
function captureCurrentPhoto() {

    let photo = get(0, 0, 400, 300);

    capturedPhotos.push(photo);
}

// flash effect
function flashEffect() {

    fill(255);

    rect(0, 0, width, height);
}

// preview photos
function showCapturedPhotos() {

    background(255);

    for (let i = 0; i < capturedPhotos.length; i++) {

        image(
            capturedPhotos[i],
            20 + i * 95,
            320,
            80,
            60
        );
    }
}
