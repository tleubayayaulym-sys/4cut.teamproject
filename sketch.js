let particles = [];
let countdown = 3;
let counting = false;
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
  
  drawARFilter(width / 2, height / 2 - 40, selectedFilter);
  updateParticles();

  fill("#ff4d6d");

  textAlign(CENTER);

  textSize(40);

  text("CAMERA SCREEN", width / 2, 80);

  // capture button
  fill("#ff4d6d");

  rect(width / 2, height - 100, 220, 70, 20);

  fill(255);

  textSize(30);

  text("CAPTURE", width / 2, height - 90);

  // countdown
  if (counting) {
    fill(255, 0, 0);

    textSize(120);

    text(countdown, width / 2, height / 2);
  }
}
function mousePressed() {
  console.log("clicked", mouseX, mouseY, "state:", state);

  if (state == "start") {
    state = "settings";
  } 
  
  else if (state == "settings") {
    state = "camera";
  } 
  
  else if (state == "camera") {
    if (!counting) {
      startCountdown();
    }
  }
}

function drawARFilter(x, y, filterType) {
  if (filterType == 0) {
    drawCatFilter(x, y);
  } else if (filterType == 1) {
    drawRabbitFilter(x, y);
  } else if (filterType == 2) {
    drawGlassesFilter(x, y);
  } else if (filterType == 3) {
    drawCrownFilter(x, y);
  }
}

function drawCatFilter(x, y) {
  fill("#ffb6c1");
  stroke("#333");
  strokeWeight(3);

  triangle(x - 120, y - 130, x - 70, y - 230, x - 20, y - 130);
  triangle(x + 20, y - 130, x + 70, y - 230, x + 120, y - 130);

  stroke("#333");
  strokeWeight(2);
  line(x - 80, y + 10, x - 180, y - 10);
  line(x - 80, y + 30, x - 180, y + 30);
  line(x - 80, y + 50, x - 180, y + 70);

  line(x + 80, y + 10, x + 180, y - 10);
  line(x + 80, y + 30, x + 180, y + 30);
  line(x + 80, y + 50, x + 180, y + 70);

  addParticle(x, y, "#ff4d6d");
}

function drawRabbitFilter(x, y) {
  fill("#ffffff");
  stroke("#333");
  strokeWeight(3);

  ellipse(x - 70, y - 190, 60, 180);
  ellipse(x + 70, y - 190, 60, 180);

  fill("#ffc0cb");
  ellipse(x - 70, y - 190, 30, 120);
  ellipse(x + 70, y - 190, 30, 120);

  addParticle(x, y, "#ffd166");
}

function drawGlassesFilter(x, y) {
  noFill();
  stroke("#111");
  strokeWeight(6);

  rectMode(CENTER);
  rect(x - 55, y - 20, 90, 55, 15);
  rect(x + 55, y - 20, 90, 55, 15);
  line(x - 10, y - 20, x + 10, y - 20);

  addParticle(x, y, "#4cc9f0");
}

function drawCrownFilter(x, y) {
  fill("#ffd700");
  stroke("#333");
  strokeWeight(3);

  beginShape();
  vertex(x - 100, y - 110);
  vertex(x - 70, y - 190);
  vertex(x - 30, y - 120);
  vertex(x, y - 210);
  vertex(x + 30, y - 120);
  vertex(x + 70, y - 190);
  vertex(x + 100, y - 110);
  vertex(x + 100, y - 70);
  vertex(x - 100, y - 70);
  endShape(CLOSE);

  addParticle(x, y, "#ffd700");
}

function addParticle(x, y, colorValue) {
  if (particles.length < 40) {
    particles.push({
      x: x + random(-180, 180),
      y: y + random(-180, 180),
      size: random(8, 18),
      speed: random(1, 3),
      color: colorValue,
      alpha: 255
    });
  }
}

function updateParticles() {
  noStroke();

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    fill(p.color);
    circle(p.x, p.y, p.size);

    p.y -= p.speed;
    p.alpha -= 5;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (key == "1") selectedFilter = 0;
  if (key == "2") selectedFilter = 1;
  if (key == "3") selectedFilter = 2;
  if (key == "4") selectedFilter = 3;
}
