// ============================================================
// main.js — 담당: 틀레우바이 아야으름
// 화면: start → settings → camera → result → saved → ending
// ============================================================

let currentScreen  = "start";
let selectedFrame  = 0;
let selectedFilter = 0;

// Frame data (배열 사용)
let frameNames  = ["Pink", "Mint", "Yellow", "Lavender"];
let frameColors = ["#ffb6c1", "#b2f0e8", "#fff59d", "#e1bee7"];
let frameDark   = ["#f48fb1", "#80cbc4", "#f9a825", "#ce93d8"];

// Filter data (배열 사용)
let filterEmoji = ["🎀", "💕", "🐱", "👓", "🐸"];
let filterLabel = ["Ribbon", "Love", "Cat", "Glasses", "Frog"];

// ============================================================
// setup() + draw()
// ============================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  setupCamera();
}

function draw() {
  background("#f6f1ff");
  if      (currentScreen === "start")    drawStartScreen();
  else if (currentScreen === "settings") drawSettingsScreen();
  else if (currentScreen === "camera")   drawCameraScreen();
  else if (currentScreen === "result")   drawResultScreen();
  else if (currentScreen === "saved")    drawSavedScreen();
  else if (currentScreen === "ending")   drawEndingScreen();
}

// ============================================================
// SCREEN 1: START
// 제목, 멤버 이름, 사용법 포함 (thầy yêu cầu)
// ============================================================
function drawStartScreen() {
  push();
  rectMode(CORNER); noStroke();

  // Trang trí góc
  for (let i = 0; i < frameColors.length; i++) {
    push();
    fill(frameColors[i] + "66"); noStroke();
    circle(
      i % 2 === 0 ? width * 0.08 : width * 0.92,
      i < 2 ? height * 0.12 : height * 0.88,
      180
    );
    pop();
  }

  // Logo
  fill("#ff4d6d");
  textSize(min(width * 0.1, 64));
  text("📸 4CUT BOOTH", width / 2, height * 0.2);

  // Subtitle
  fill("#888");
  textSize(min(width * 0.028, 18));
  text("인생네컷 스타일 웹 포토부스", width / 2, height * 0.28);

  // 제작자 이름 (thầy yêu cầu có tên tác giả)
  push();
  fill("#fff"); noStroke();
  rect(width/2 - min(width*0.32, 180), height*0.35 - 18,
       min(width*0.64, 360), 80, 12);
  fill("#ff4d6d"); textSize(13);
  text("제작자", width/2, height*0.35);
  fill("#333"); textSize(min(width*0.025, 15));
  text("아야울름  ·  응웬 바오 담  ·  마이티투짱", width/2, height*0.35 + 24);
  pop();

  // 사용법 (thầy yêu cầu có hướng dẫn)
  push();
  fill("#fff"); noStroke();
  rect(width/2 - min(width*0.32, 180), height*0.48 - 14,
       min(width*0.64, 360), 100, 12);
  fill("#ff4d6d"); textSize(13);
  text("사용법", width/2, height*0.48);
  fill("#555"); textSize(min(width*0.022, 13));
  text("① 프레임과 AR 필터를 선택하세요", width/2, height*0.48 + 22);
  text("② 얼굴을 카메라에 맞추세요", width/2,     height*0.48 + 42);
  text("③ 엄지+검지 터치 또는 버튼으로 촬영!", width/2, height*0.48 + 62);
  pop();

  // START button
  fill("#ff4d6d"); noStroke();
  rect(width/2 - min(width*0.22, 125), height*0.72 - 28,
       min(width*0.44, 250), 56, 28);
  fill(255);
  textSize(min(width * 0.045, 28));
  text("▶  START", width / 2, height * 0.72);

  // Space hint
  fill("#bbb"); textSize(12);
  text("Space 또는 화면 터치", width / 2, height * 0.72 + 46);

  pop();
}

// ============================================================
// SCREEN 2: SETTINGS
// ============================================================
function drawSettingsScreen() {
  push();
  rectMode(CORNER); noStroke();

  fill("#ff4d6d");
  textSize(min(width * 0.048, 32));
  text("⚙️  Settings", width / 2, 52);

  // Frame selection
  fill("#444"); textSize(16); textAlign(LEFT, CENTER);
  text("▶  프레임 선택", width * 0.08, 100);

  let fBox  = min(width * 0.14, 76);
  let fGap  = min(width * 0.04, 18);
  let fTot  = fBox * frameNames.length + fGap * (frameNames.length - 1);
  let fSX   = width/2 - fTot/2;

  for (let i = 0; i < frameNames.length; i++) {
    push();
    let bx = fSX + i * (fBox + fGap);
    let by = 118;
    if (selectedFrame === i) { stroke(frameDark[i]); strokeWeight(4); }
    else { stroke("#ddd"); strokeWeight(2); }
    fill(frameColors[i]);
    rect(bx, by, fBox, fBox, 10);
    noStroke(); fill(selectedFrame === i ? frameDark[i] : "#666");
    textAlign(CENTER, CENTER); textSize(11);
    text(frameNames[i], bx + fBox/2, by + fBox + 11);
    pop();
  }

  // Filter selection
  fill("#444"); noStroke(); textSize(16); textAlign(LEFT, CENTER);
  text("▶  AR 필터 선택", width * 0.08, 248);

  let filtBox = min(width * 0.14, 76);
  let filtGap = min(width * 0.035, 14);
  let filtTot = filtBox * filterEmoji.length + filtGap * (filterEmoji.length - 1);
  let filtSX  = width/2 - filtTot/2;

  for (let i = 0; i < filterEmoji.length; i++) {
    push();
    let bx = filtSX + i * (filtBox + filtGap);
    let by = 266;
    if (selectedFilter === i) { stroke("#ff4d6d"); strokeWeight(4); }
    else { stroke("#ddd"); strokeWeight(2); }
    fill("#fff"); rect(bx, by, filtBox, filtBox, 10);
    noStroke(); fill("#333");
    textAlign(CENTER, CENTER); textSize(28);
    text(filterEmoji[i], bx + filtBox/2, by + filtBox/2);
    textSize(10); fill("#666");
    text(filterLabel[i], bx + filtBox/2, by + filtBox + 11);
    pop();
  }

  // 촬영 시작 button
  fill("#ff4d6d"); noStroke();
  rect(width/2 - min(width*0.28, 150), height - 88,
       min(width*0.56, 300), 58, 29);
  fill(255); textAlign(CENTER, CENTER);
  textSize(min(width * 0.042, 26));
  text("촬영 시작  📷", width / 2, height - 59);

  // Back
  fill("#eee"); noStroke();
  rect(20, 14, 78, 34, 17);
  fill("#777"); textSize(13);
  text("← Back", 59, 31);

  pop();
}

// ============================================================
// SCREEN 3: CAMERA — gọi camera.js (fullscreen)
// ============================================================
function drawCameraScreen() {
  drawCamera();
}

// ============================================================
// SCREEN 5: SAVED
// ============================================================
function drawSavedScreen() {
  push();
  rectMode(CORNER); noStroke();

  fill("#4caf50"); circle(width/2, height*0.3, 100);
  fill(255); textSize(48); text("✓", width/2, height*0.3 + 6);

  fill("#333"); textSize(min(width*0.07, 42));
  text("저장 완료!", width/2, height*0.48);

  fill("#888"); textSize(15);
  text("PNG 파일이 자동 다운로드됩니다!", width/2, height*0.56);

  // 새로 촬영
  fill("#ff4d6d"); noStroke();
  rect(width/2 - min(width*0.22,118), height*0.66,
       min(width*0.44,236), 50, 25);
  fill(255); textSize(20);
  text("📷  새로 촬영", width/2, height*0.66 + 25);

  // 처음으로
  fill("#eee"); noStroke();
  rect(width/2 - min(width*0.22,118), height*0.66 + 64,
       min(width*0.44,236), 44, 22);
  fill("#555"); textSize(17);
  text("🏠  처음으로", width/2, height*0.66 + 86);

  pop();
}

// ============================================================
// SCREEN 6: ENDING CREDIT (thầy yêu cầu)
// ============================================================
function drawEndingScreen() {
  push();
  rectMode(CORNER); noStroke();

  // Trang trí nền
  for (let i = 0; i < frameColors.length; i++) {
    push();
    fill(frameColors[i] + "55"); noStroke();
    circle(
      (i % 2 === 0 ? width*0.12 : width*0.88),
      (i < 2 ? height*0.1 : height*0.9),
      200
    );
    pop();
  }

  // Tiêu đề
  fill("#ff4d6d");
  textSize(min(width*0.06, 38));
  text("📸 4CUT BOOTH", width/2, height*0.12);

  fill("#888"); textSize(14);
  text("Art & Technology Team Project  |  2026", width/2, height*0.2);

  // Đường kẻ
  push();
  stroke(frameDark[0]); strokeWeight(2); noFill();
  line(width*0.15, height*0.25, width*0.85, height*0.25);
  pop();

  // Thành viên
  let members = [
    { name: "틀레우바이 아야으름", role: "카메라 촬영 · UI 설계 · 전체 흐름 제어" },
    { name: "응웬 바오 담",        role: "AR 필터 · Face Mesh · Hand Pose 제스처" },
    { name: "마이티투짱",          role: "결과 화면 · 프레임 디자인 · 저장 기능"  }
  ];

  for (let i = 0; i < members.length; i++) {
    push();
    let my = height * 0.33 + i * 90;

    // Card
    fill("#fff"); noStroke();
    rect(width/2 - min(width*0.32,180), my - 30,
         min(width*0.64,360), 72, 12);

    // Số thứ tự
    fill(frameDark[i]); noStroke();
    circle(width/2 - min(width*0.32,180) + 30, my + 6, 34);
    fill(255); textSize(16);
    text(str(i+1), width/2 - min(width*0.32,180) + 30, my + 6);

    // Tên
    fill("#333"); textSize(min(width*0.035,20)); textAlign(LEFT, CENTER);
    text(members[i].name, width/2 - min(width*0.32,180) + 55, my - 5);

    // Vai trò
    fill("#888"); textSize(12);
    text(members[i].role, width/2 - min(width*0.32,180) + 55, my + 16);

    pop();
  }

  // Công nghệ
  push();
  fill("#fff"); noStroke();
  rect(width/2 - min(width*0.32,180), height*0.73,
       min(width*0.64,360), 58, 12);
  fill("#ff4d6d"); textSize(12); textAlign(CENTER, CENTER);
  text("사용 기술", width/2, height*0.73 + 10);
  fill("#555"); textSize(11);
  text("p5.js  ·  MediaPipe FaceMesh  ·  MediaPipe Hands  ·  GitHub Pages",
       width/2, height*0.73 + 32);
  pop();

  // 처음으로 button
  fill("#ff4d6d"); noStroke();
  rect(width/2 - min(width*0.22,118), height*0.86,
       min(width*0.44,236), 50, 25);
  fill(255); textSize(18);
  text("🏠  처음으로", width/2, height*0.86 + 25);

  pop();
}

// ============================================================
// MOUSE + TOUCH
// ============================================================
function mousePressed() { handleButtons(); }
function touchStarted()  { handleButtons(); return false; }

function handleButtons() {

  // START
  if (currentScreen === "start") {
    let bw = min(width*0.44, 250);
    let bx = width/2 - bw/2;
    let by = height*0.72 - 28;
    if (mouseX > bx && mouseX < bx+bw && mouseY > by && mouseY < by+56)
      currentScreen = "settings";
  }

  // SETTINGS
  else if (currentScreen === "settings") {
    // Back
    if (mouseX>20 && mouseX<98 && mouseY>14 && mouseY<48) {
      currentScreen = "start"; return;
    }
    // Frame
    let fBox = min(width*0.14,76), fGap = min(width*0.04,18);
    let fSX  = width/2 - (fBox*frameNames.length + fGap*(frameNames.length-1))/2;
    for (let i = 0; i < frameNames.length; i++) {
      let bx = fSX + i*(fBox+fGap);
      if (mouseX>bx && mouseX<bx+fBox && mouseY>118 && mouseY<118+fBox) {
        selectedFrame = i; return;
      }
    }
    // Filter
    let filtBox = min(width*0.14,76), filtGap = min(width*0.035,14);
    let filtSX  = width/2 - (filtBox*filterEmoji.length + filtGap*(filterEmoji.length-1))/2;
    for (let i = 0; i < filterEmoji.length; i++) {
      let bx = filtSX + i*(filtBox+filtGap);
      if (mouseX>bx && mouseX<bx+filtBox && mouseY>266 && mouseY<266+filtBox) {
        selectedFilter = i; return;
      }
    }
    // 촬영 시작
    let bw = min(width*0.56,300), bx = width/2-bw/2;
    if (mouseX>bx && mouseX<bx+bw && mouseY>height-88 && mouseY<height-30)
      currentScreen = "camera";
  }

  // CAMERA
  else if (currentScreen === "camera") {
    handleCameraButtons();
  }

  // RESULT
  else if (currentScreen === "result") {
    handleResultButtons();
  }

  // SAVED
  else if (currentScreen === "saved") {
    let bw = min(width*0.44,236), bx = width/2-bw/2;
    // 새로 촬영
    if (mouseX>bx && mouseX<bx+bw && mouseY>height*0.66 && mouseY<height*0.66+50) {
      capturedPhotos = []; currentScreen = "camera";
    }
    // 처음으로
    if (mouseX>bx && mouseX<bx+bw && mouseY>height*0.66+64 && mouseY<height*0.66+108) {
      capturedPhotos = []; currentScreen = "ending";
    }
  }

  // ENDING
  else if (currentScreen === "ending") {
    let bw = min(width*0.44,236), bx = width/2-bw/2;
    if (mouseX>bx && mouseX<bx+bw && mouseY>height*0.86 && mouseY<height*0.86+50)
      currentScreen = "start";
  }
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (video) video.size(windowWidth, windowHeight);
}
