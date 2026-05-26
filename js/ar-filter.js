const CAM_W = 640;
const CAM_H = 480;

let selectedFilter = 0;
let video;
let capturedPhotos = [];
let countdown = 0;
let isCapturing = false;

function setupCamera() {
    video = createCapture(VIDEO);
    video.size(windowWidth, windowHeight);
    video.hide();
    khoiDongNhanDienMat(video); // ← было initFaceMesh
}

function drawCamera() {
    imageMode(CORNER);
    image(video, 0, 0, width, height);

    veARFilter(width / 2, height / 2, selectedFilter); // ← было drawARFilter
    updateParticles();
    hienTrangThaiMat(width, height); // ← было drawFaceStatus

    if (countdown > 0) {
        fill(255);
        stroke("#ff4d6d");
        strokeWeight(7);
        textAlign(CENTER, CENTER);
        textSize(min(width * 0.2, 150));
        text(countdown, width / 2, height / 2);
    }

    drawPhotoPreview();
}

function startPhotoSequence() {
    if (isCapturing) return;
    capturedPhotos = [];
    isCapturing = true;
    takePhoto(0);
}

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

function flashEffect() {
    push();
    rectMode(CORNER);
    fill(255);
    noStroke();
    rect(0, 0, width, height);
    pop();
}

function drawPhotoPreview() {
    rectMode(CORNER);

    let previewWidth;
    if (width < 700) {
        previewWidth = width * 0.16;
    } else {
        previewWidth = 95;
    }

    let previewHeight = previewWidth;
    let gap = 10;
    let totalWidth = previewWidth * 4 + gap * 3;
    let startX = width / 2 - totalWidth / 2;
    let y = height - previewHeight - 100;

    for (let i = 0; i < 4; i++) {
        fill(255);
        stroke("#ff4d6d");
        strokeWeight(3);
        rect(startX + i * (previewWidth + gap), y, previewWidth, previewHeight, 15);

        if (capturedPhotos[i]) {
            image(capturedPhotos[i], startX + i * (previewWidth + gap), y, previewWidth, previewHeight);
        }
    }
}
