
let cam;
let state = "start";

let selectedFrame = 0;
let selectedFilter = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();
}

function draw() {
  background("#f6f1ff");

  if (state == "start") {
    drawStart();
  } else if (state == "settings") {
    drawSettings();
  } else if (state == "camera") {
    drawCamera();
  }
}

function drawStart() {
  textAlign(CENTER);
  fill("#ff4d6d");
  textSize(60);
  text("4CUT BOOTH", width / 2, 150);

  fill("#ff4d6d");
  rectMode(CENTER);
  rect(width / 2, height / 2, 250, 80, 20);

  fill(255);
  textSize(35);
  text("START", width / 2, height / 2 + 12);
}

function drawSettings() {
  textAlign(CENTER);
  fill("#333");
  textSize(45);
  text("SETTINGS", width / 2, 100);

  textSize(25);
  text("프레임 선택", width / 2, 170);

  for (let i = 0; i < 4; i++) {
    if (selectedFrame == i) {
      fill("#ff4d6d");
    } else {
      fill("#ffffff");
    }
    rect(width / 2 - 240 + i * 160, 230, 120, 70, 15);

    fill("#333");
    textSize(20);
    text("Frame " + (i + 1), width / 2 - 240 + i * 160, 238);
  }

  textSize(25);
  fill("#333");
  text("AR 필터 선택", width / 2, 340);

  let filterNames = ["Cat", "Rabbit", "Glasses", "Crown"];

  for (let i = 0; i < 4; i++) {
    if (selectedFilter == i) {
      fill("#ff4d6d");
    } else {
      fill("#ffffff");
    }
    rect(width / 2 - 240 + i * 160, 400, 120, 70, 15);

    fill("#333");
    textSize(20);
    text(filterNames[i], width / 2 - 240 + i * 160, 408);
  }

  fill("#ff4d6d");
  rect(width / 2, height - 120, 280, 80, 30);

  fill(255);
  textSize(32);
  text("촬영 시작", width / 2, height - 108);
}

function drawCamera() {
  imageMode(CENTER);
  image(cam, width / 2, height / 2, 640, 480);

  fill("#ff4d6d");
  textAlign(CENTER);
  textSize(40);
  text("CAMERA SCREEN", width / 2, 80);
}

function mousePressed() {
  if (state == "start") {
    if (
      mouseX > width / 2 - 125 &&
      mouseX < width / 2 + 125 &&
      mouseY > height / 2 - 40 &&
      mouseY < height / 2 + 40
    ) {
      state = "settings";
    }
  } else if (state == "settings") {
    for (let i = 0; i < 4; i++) {
      let x = width / 2 - 240 + i * 160;

      if (
        mouseX > x - 60 &&
        mouseX < x + 60 &&
        mouseY > 230 - 35 &&
        mouseY < 230 + 35
      ) {
        selectedFrame = i;
      }

      if (
        mouseX > x - 60 &&
        mouseX < x + 60 &&
        mouseY > 400 - 35 &&
        mouseY < 400 + 35
      ) {
        selectedFilter = i;
      }
    }

    if (
      mouseX > width / 2 - 140 &&
      mouseX < width / 2 + 140 &&
      mouseY > height - 160 &&
      mouseY < height - 80
    ) {
      state = "camera";
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
