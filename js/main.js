// ============================================================
// main.js — 담당: 틀레우바이 아야으름
// ============================================================

let currentScreen  = "start";
let selectedFrame  = 0;
let selectedFilter = 0;

let frameNames  = ["Pink", "Mint", "Yellow", "Lavender"];
let frameColors = ["#ffb6c1", "#b2f0e8", "#fff59d", "#e1bee7"];
let frameDark   = ["#f48fb1", "#80cbc4", "#f9a825", "#ce93d8"];

let filterEmoji = ["🎀", "💕", "🐱", "👓", "🐸"];
let filterLabel = ["Ribbon", "Love", "Cat", "Glasses", "Frog"];

// ============================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  setupCamera();
}

function draw() {
  background("#fff0f5");
  if      (currentScreen === "start")    drawStartScreen();
  else if (currentScreen === "settings") drawSettingsScreen();
  else if (currentScreen === "camera")   drawCameraScreen();
  else if (currentScreen === "select")   drawSelectScreen();
  else if (currentScreen === "result")   drawResultScreen();
  else if (currentScreen === "saved")    drawSavedScreen();
  else if (currentScreen === "ending")   drawEndingScreen();
}

// ============================================================
// 꾸밈 요소 — 떠다니는 별과 하트
// ============================================================
function drawDecorations() {
  push();
  noStroke();
  let shapes = ["★", "♡", "✦", "·", "✿"];
  let cols   = ["#ffb6c1", "#b2f0e8", "#fff59d", "#e1bee7", "#ffd6e7"];
  for (let i = 0; i < 12; i++) {
    let x  = (sin(frameCount * 0.008 + i * 137) * 0.5 + 0.5) * width;
    let y  = (cos(frameCount * 0.006 + i * 97)  * 0.5 + 0.5) * height;
    let sz = 10 + sin(frameCount * 0.02 + i) * 4;
    fill(cols[i % cols.length] + "88");
    textSize(sz);
    textAlign(CENTER, CENTER);
    text(shapes[i % shapes.length], x, y);
  }
  pop();
}

// ============================================================
// SCREEN 1: START
// ============================================================
function drawStartScreen() {
  drawDecorations();
  push();
  rectMode(CORNER); noStroke();

  // 큰 원 배경 장식
  for (let i = 0; i < frameColors.length; i++) {
    push(); noStroke();
    fill(frameColors[i] + "55");
    let x = i % 2 === 0 ? width * 0.05 : width * 0.95;
    let y = i < 2 ? height * 0.1 : height * 0.9;
    circle(x, y, 220);
    pop();
  }

  // 흰 카드 배경
  push();
  fill(255, 255, 255, 200); noStroke();
  rect(width/2 - min(width*0.38, 220), height*0.12,
       min(width*0.76, 440), height*0.76, 30);
  pop();

  // 제목
  push();
  fill("#ff4d6d");
  textSize(min(width * 0.09, 58));
  text("📸 4CUT BOOTH", width/2, height * 0.24);
  fill("#ffb6c1");
  textSize(min(width * 0.026, 16));
  text("✨  인생네컷 스타일 웹 포토부스  ✨", width/2, height * 0.32);
  pop();

  // 제작자 카드
  push();
  fill("#fff0f5"); noStroke();
  rect(width/2 - min(width*0.3, 170), height*0.38 - 16,
       min(width*0.6, 340), 72, 16);
  fill("#ff4d6d"); textSize(12);
  text("💝  제작자", width/2, height*0.38);
  fill("#555"); textSize(min(width*0.023, 14));
  text("아야울름  ·  응웬 바오 담  ·  마이티투짱", width/2, height*0.38 + 22);
  pop();

  // 사용법 카드
  push();
  fill("#fff0f5"); noStroke();
  rect(width/2 - min(width*0.3, 170), height*0.52 - 14,
       min(width*0.6, 340), 108, 16);
  fill("#ff4d6d"); textSize(12);
  text("📖  사용법", width/2, height*0.52);
  fill("#555"); textSize(min(width*0.021, 13));
  text("① 프레임과 AR 필터를 선택하세요",    width/2, height*0.52 + 24);
  text("② 사진을 최대 8장까지 촬영하세요",   width/2, height*0.52 + 44);
  text("③ 마음에 드는 4장을 선택하세요",     width/2, height*0.52 + 64);
  text("④ 저장하고 공유하세요! 🎉",          width/2, height*0.52 + 84);
  pop();

  // START 버튼
  push();
  // 그림자 효과
  fill(255, 77, 109, 60); noStroke();
  rect(width/2 - min(width*0.22, 122) + 4,
       height*0.74 - 26,
       min(width*0.44, 244), 56, 28);
  fill("#ff4d6d"); noStroke();
  rect(width/2 - min(width*0.22, 122), height*0.74 - 28,
       min(width*0.44, 244), 56, 28);
  fill(255);
  textSize(min(width * 0.042, 26));
  text("▶  START", width/2, height * 0.74);
  pop();

  fill("#ffb6c1"); textSize(12);
  text("Space 또는 화면을 터치하세요", width/2, height * 0.74 + 46);

  pop();
}

// ============================================================
// SCREEN 2: SETTINGS
// ============================================================
function drawSettingsScreen() {
  drawDecorations();
  push();
  rectMode(CORNER); noStroke();

  // 흰 카드
  fill(255, 255, 255, 210); noStroke();
  rect(width/2 - min(width*0.42, 260), 10,
       min(width*0.84, 520), height - 20, 24);

  fill("#ff4d6d");
  textSize(min(width * 0.046, 30));
  text("⚙️  Settings", width/2, 58);

  // 프레임 선택
  fill("#555"); textSize(15); textAlign(LEFT, CENTER);
  text("🎨  프레임 선택", width * 0.12, 100);

  let fBox = min(width * 0.13, 72);
  let fGap = min(width * 0.04, 16);
  let fTot = fBox * frameNames.length + fGap * (frameNames.length - 1);
  let fSX  = width/2 - fTot/2;

  for (let i = 0; i < frameNames.length; i++) {
    push();
    let bx = fSX + i * (fBox + fGap);
    let by = 116;
    // 그림자
    fill(0, 0, 0, 15); noStroke();
    rect(bx + 3, by + 3, fBox, fBox, 12);
    if (selectedFrame === i) { stroke(frameDark[i]); strokeWeight(4); }
    else { stroke("#eee"); strokeWeight(2); }
    fill(frameColors[i]);
    rect(bx, by, fBox, fBox, 12);
    // 체크 표시
    if (selectedFrame === i) {
      fill(frameDark[i]); noStroke();
      circle(bx + fBox - 12, by + 12, 20);
      fill(255); textSize(10); textAlign(CENTER, CENTER);
      text("✓", bx + fBox - 12, by + 12);
    }
    noStroke(); fill(selectedFrame === i ? frameDark[i] : "#999");
    textAlign(CENTER, CENTER); textSize(11);
    text(frameNames[i], bx + fBox/2, by + fBox + 13);
    pop();
  }

  // 필터 선택
  fill("#555"); noStroke(); textSize(15); textAlign(LEFT, CENTER);
  text("✨  AR 필터 선택", width * 0.12, 242);

  let filtBox = min(width * 0.13, 72);
  let filtGap = min(width * 0.032, 12);
  let filtTot = filtBox * filterEmoji.length + filtGap * (filterEmoji.length - 1);
  let filtSX  = width/2 - filtTot/2;

  for (let i = 0; i < filterEmoji.length; i++) {
    push();
    let bx = filtSX + i * (filtBox + filtGap);
    let by = 260;
    fill(0, 0, 0, 15); noStroke();
    rect(bx + 3, by + 3, filtBox, filtBox, 12);
    if (selectedFilter === i) { stroke("#ff4d6d"); strokeWeight(4); }
    else { stroke("#eee"); strokeWeight(2); }
    fill(selectedFilter === i ? "#fff0f5" : "#fff");
    rect(bx, by, filtBox, filtBox, 12);
    if (selectedFilter === i) {
      fill("#ff4d6d"); noStroke();
      circle(bx + filtBox - 12, by + 12, 20);
      fill(255); textSize(10); textAlign(CENTER, CENTER);
      text("✓", bx + filtBox - 12, by + 12);
    }
    noStroke(); fill("#333");
    textAlign(CENTER, CENTER); textSize(26);
    text(filterEmoji[i], bx + filtBox/2, by + filtBox/2);
    textSize(10); fill("#999");
    text(filterLabel[i], bx + filtBox/2, by + filtBox + 13);
    pop();
  }

  // 촬영 시작 버튼
  push();
  fill(255, 77, 109, 50); noStroke();
  rect(width/2 - min(width*0.27,146) + 4, height - 86,
       min(width*0.54, 292), 56, 28);
  fill("#ff4d6d"); noStroke();
  rect(width/2 - min(width*0.27,146), height - 88,
       min(width*0.54, 292), 56, 28);
  fill(255); textAlign(CENTER, CENTER);
  textSize(min(width * 0.038, 24));
  text("촬영 시작  📷", width/2, height - 60);
  pop();

  // Back 버튼
  fill("#ffe0eb"); noStroke();
  rect(20, 14, 76, 32, 16);
  fill("#ff4d6d"); textSize(13); textAlign(CENTER, CENTER);
  text("← Back", 58, 30);

  pop();
}

// ============================================================
// SCREEN 3: CAMERA
// ============================================================
function drawCameraScreen() {
  drawCamera();
}

// ============================================================
// SCREEN 4: SELECT (4장 선택)
// ============================================================
function drawSelectScreen() {
  drawDecorations();
  push();
  rectMode(CORNER); noStroke();

  // 배경 카드
  fill(255, 255, 255, 210); noStroke();
  rect(10, 10, width - 20, height - 20, 24);

  fill("#ff4d6d");
  textSize(min(width * 0.042, 26));
  text("🌸  4장을 선택하세요!", width/2, 52);

  fill("#aaa"); textSize(13);
  text("클릭하여 선택 / 해제  ·  선택: " + selectedPhotos.length + " / 4",
       width/2, 76);

  // 사진 그리드
  let cols    = 4;
  let padding = 16;
  let gap     = 10;
  let totalW  = width - padding * 2;
  let pw      = (totalW - gap * (cols - 1)) / cols;
  let ph      = pw * 0.75;
  let startY  = 96;

  for (let i = 0; i < allPhotos.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let px  = padding + col * (pw + gap);
    let py  = startY + row * (ph + gap + 28);

    // 그림자
    push();
    fill(0, 0, 0, 20); noStroke();
    rect(px + 3, py + 3, pw, ph, 10);
    pop();

    // 사진
    push();
    imageMode(CORNER);
    image(allPhotos[i], px, py, pw, ph);
    pop();

    // 선택됐는지 확인
    let isSelected = selectedPhotos.indexOf(i) !== -1;
    let selOrder   = selectedPhotos.indexOf(i) + 1;

    if (isSelected) {
      // 핑크 테두리
      push();
      stroke("#ff4d6d"); strokeWeight(4); noFill();
      rect(px, py, pw, ph, 10);
      // 번호 뱃지
      fill("#ff4d6d"); noStroke();
      circle(px + pw - 16, py + 16, 28);
      fill(255); textSize(13); textAlign(CENTER, CENTER);
      text(str(selOrder), px + pw - 16, py + 16);
      pop();
    } else {
      push();
      stroke("#ddd"); strokeWeight(2); noFill();
      rect(px, py, pw, ph, 10);
      pop();
    }

    // 사진 번호
    push();
    fill("#bbb"); noStroke(); textSize(11); textAlign(CENTER, CENTER);
    text("📷 " + (i + 1), px + pw/2, py + ph + 14);
    pop();
  }

  // 완료 버튼
  let btnY = height - 70;
  push();
  if (selectedPhotos.length === 4) {
    fill(255, 77, 109, 50); noStroke();
    rect(width/2 - 122 + 3, btnY + 3, 244, 50, 25);
    fill("#ff4d6d");
  } else {
    fill("#eee");
  }
  noStroke();
  rect(width/2 - 122, btnY, 244, 50, 25);
  fill(selectedPhotos.length === 4 ? 255 : "#bbb");
  textSize(20); textAlign(CENTER, CENTER);
  text(selectedPhotos.length === 4 ? "완료! ✨" : "4장을 선택해주세요",
       width/2, btnY + 25);
  pop();

  // 다시 촬영 버튼
  push();
  fill("#ffe0eb"); noStroke();
  rect(20, 14, 100, 32, 16);
  fill("#ff4d6d"); textSize(13); textAlign(CENTER, CENTER);
  text("🔄 다시촬영", 70, 30);
  pop();

  pop();
}

// ============================================================
// SCREEN 6: SAVED
// ============================================================
function drawSavedScreen() {
  drawDecorations();
  push();
  rectMode(CORNER); noStroke();

  fill(255, 255, 255, 210); noStroke();
  rect(width/2 - min(width*0.38,220), height*0.1,
       min(width*0.76,440), height*0.8, 24);

  // 체크 아이콘
  push();
  fill("#ff4d6d"); noStroke();
  circle(width/2, height*0.3, 90);
  fill(255); textSize(40);
  text("✓", width/2, height*0.3 + 4);
  pop();

  fill("#333"); textSize(min(width*0.065, 40));
  text("저장 완료! 🎉", width/2, height*0.46);

  fill("#aaa"); textSize(14);
  text("PNG 파일이 자동 다운로드됩니다", width/2, height*0.54);

  // 새로 촬영
  push();
  fill(255, 77, 109, 50); noStroke();
  rect(width/2 - 117, height*0.63 + 3, 234, 48, 24);
  fill("#ff4d6d"); noStroke();
  rect(width/2 - 117, height*0.63, 234, 48, 24);
  fill(255); textSize(18);
  text("📷  새로 촬영", width/2, height*0.63 + 24);
  pop();

  // 처음으로
  push();
  fill("#ffe0eb"); noStroke();
  rect(width/2 - 117, height*0.63 + 62, 234, 44, 22);
  fill("#ff4d6d"); textSize(16);
  text("🏠  처음으로", width/2, height*0.63 + 84);
  pop();

  pop();
}

// ============================================================
// SCREEN 7: ENDING
// ============================================================
function drawEndingScreen() {
  drawDecorations();
  push();
  rectMode(CORNER); noStroke();

  fill(255, 255, 255, 200); noStroke();
  rect(width/2 - min(width*0.38,220), height*0.06,
       min(width*0.76,440), height*0.88, 24);

  fill("#ff4d6d");
  textSize(min(width*0.055, 34));
  text("📸 4CUT BOOTH", width/2, height*0.14);

  fill("#ffb6c1"); textSize(13);
  text("Art & Technology  |  Team 13  |  2026", width/2, height*0.21);

  push(); stroke("#ffb6c1"); strokeWeight(1.5); noFill();
  line(width*0.2, height*0.26, width*0.8, height*0.26);
  pop();

  let members = [
    { name: "틀레우바이 아야으름", role: "카메라 · UI · 전체 흐름",  color: "#ffb6c1" },
    { name: "응웬 바오 담",        role: "AR 필터 · FaceMesh · Hand Pose", color: "#b2f0e8" },
    { name: "마이티투짱",          role: "결과 화면 · 프레임 · 저장",  color: "#e1bee7" }
  ];

  for (let i = 0; i < members.length; i++) {
    push();
    let my = height * 0.32 + i * 82;
    fill(members[i].color + "55"); noStroke();
    rect(width/2 - min(width*0.3,170), my - 26,
         min(width*0.6,340), 66, 14);
    fill(members[i].color); noStroke();
    circle(width/2 - min(width*0.3,170) + 28, my + 7, 32);
    fill(255); textSize(15); textAlign(CENTER, CENTER);
    text(str(i+1), width/2 - min(width*0.3,170) + 28, my + 7);
    fill("#333"); textSize(min(width*0.032,18)); textAlign(LEFT, CENTER);
    text(members[i].name, width/2 - min(width*0.3,170) + 52, my - 4);
    fill("#888"); textSize(11);
    text(members[i].role, width/2 - min(width*0.3,170) + 52, my + 16);
    pop();
  }

  push();
  fill("#fff0f5"); noStroke();
  rect(width/2 - min(width*0.3,170), height*0.72,
       min(width*0.6,340), 54, 14);
  fill("#ff4d6d"); textSize(11); textAlign(CENTER, CENTER);
  text("사용 기술", width/2, height*0.72 + 10);
  fill("#777"); textSize(10);
  text("p5.js  ·  MediaPipe FaceMesh  ·  MediaPipe Hands  ·  GitHub Pages",
       width/2, height*0.72 + 30);
  pop();

  push();
  fill(255, 77, 109, 50); noStroke();
  rect(width/2 - 117, height*0.84 + 3, 234, 48, 24);
  fill("#ff4d6d"); noStroke();
  rect(width/2 - 117, height*0.84, 234, 48, 24);
  fill(255); textSize(17);
  text("🏠  처음으로", width/2, height*0.84 + 24);
  pop();

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
    let bw = min(width*0.44, 244);
    let bx = width/2 - bw/2;
    let by = height*0.74 - 28;
    if (mouseX>bx && mouseX<bx+bw && mouseY>by && mouseY<by+56)
      currentScreen = "settings";
  }

  // SETTINGS
  else if (currentScreen === "settings") {
    if (mouseX>20 && mouseX<96 && mouseY>14 && mouseY<46) {
      currentScreen = "start"; return;
    }
    let fBox = min(width*0.13,72), fGap = min(width*0.04,16);
    let fSX  = width/2 - (fBox*frameNames.length + fGap*(frameNames.length-1))/2;
    for (let i = 0; i < frameNames.length; i++) {
      let bx = fSX + i*(fBox+fGap);
      if (mouseX>bx && mouseX<bx+fBox && mouseY>116 && mouseY<116+fBox) {
        selectedFrame = i; return;
      }
    }
    let filtBox = min(width*0.13,72), filtGap = min(width*0.032,12);
    let filtSX  = width/2 - (filtBox*filterEmoji.length + filtGap*(filterEmoji.length-1))/2;
    for (let i = 0; i < filterEmoji.length; i++) {
      let bx = filtSX + i*(filtBox+filtGap);
      if (mouseX>bx && mouseX<bx+filtBox && mouseY>260 && mouseY<260+filtBox) {
        selectedFilter = i; return;
      }
    }
    let bw = min(width*0.54,292), bx = width/2-bw/2;
    if (mouseX>bx && mouseX<bx+bw && mouseY>height-88 && mouseY<height-32)
      currentScreen = "camera";
  }

  // CAMERA
  else if (currentScreen === "camera") { handleCameraButtons(); }

  // SELECT
  else if (currentScreen === "select") {
    // 다시 촬영
    if (mouseX>20 && mouseX<120 && mouseY>14 && mouseY<46) {
      allPhotos = []; selectedPhotos = [];
      currentScreen = "camera"; return;
    }
    // 사진 선택
    let cols = 4, padding = 16, gap = 10;
    let pw   = (width - padding*2 - gap*(cols-1)) / cols;
    let ph   = pw * 0.75;
    let startY = 96;
    for (let i = 0; i < allPhotos.length; i++) {
      let col = i % cols;
      let row = floor(i / cols);
      let px  = padding + col*(pw+gap);
      let py  = startY + row*(ph+gap+28);
      if (mouseX>px && mouseX<px+pw && mouseY>py && mouseY<py+ph) {
        let idx = selectedPhotos.indexOf(i);
        if (idx !== -1) {
          selectedPhotos.splice(idx, 1);
        } else if (selectedPhotos.length < 4) {
          selectedPhotos.push(i);
        }
        return;
      }
    }
    // 완료 버튼
    let btnY = height - 70;
    if (selectedPhotos.length === 4 &&
        mouseX>width/2-122 && mouseX<width/2+122 &&
        mouseY>btnY && mouseY<btnY+50) {
      capturedPhotos = selectedPhotos.map(i => allPhotos[i]);
      currentScreen = "result";
    }
  }

  // RESULT
  else if (currentScreen === "result") { handleResultButtons(); }

  // SAVED
  else if (currentScreen === "saved") {
    let bw = min(width*0.44,234), bx = width/2-bw/2;
    if (mouseX>bx && mouseX<bx+bw && mouseY>height*0.63 && mouseY<height*0.63+48) {
      allPhotos=[]; selectedPhotos=[]; capturedPhotos=[];
      currentScreen = "camera";
    }
    if (mouseX>bx && mouseX<bx+bw && mouseY>height*0.63+62 && mouseY<height*0.63+106) {
      allPhotos=[]; selectedPhotos=[]; capturedPhotos=[];
      currentScreen = "ending";
    }
  }

  // ENDING
  else if (currentScreen === "ending") {
    let bw = min(width*0.44,234), bx = width/2-bw/2;
    if (mouseX>bx && mouseX<bx+bw && mouseY>height*0.84 && mouseY<height*0.84+48)
      currentScreen = "start";
  }
}

function keyPressed() {
  if (key === ' ') {
    if      (currentScreen === "start")    currentScreen = "settings";
    else if (currentScreen === "camera")   takeSinglePhoto();
  }
  if ((key==='s'||key==='S') && currentScreen==="result") saveResultCanvas();
  if ((key==='r'||key==='R') && (currentScreen==="result"||currentScreen==="saved")) {
    allPhotos=[]; selectedPhotos=[]; capturedPhotos=[];
    currentScreen = "camera";
  }
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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

// KEYBOARD CONTROLS
function keyPressed() {
  // Клавиша ПРОБЕЛ
  if (key === ' ') {
    if (currentScreen === "start") {
      currentScreen = "settings";
    } else if (currentScreen === "camera") {
      startPhotoSequence(); // Запуск съёмки 4 фото
    }
  }
  
  // Клавиша R или r (Пересъёмка / Сброс)
  if (key === 'r' || key === 'R') {
    // ТЕПЕРЬ РАБОТАЕТ НА ОБОИХ ЭКРАНАХ!
    if (currentScreen === "result" || currentScreen === "saved") { 
      capturedPhotos = []; 
      currentScreen = "camera"; 
    }
  }
  
  // Клавиша S or s (Сохранить коллаж)
  if (key === 's' || key === 'S') {
    // ТЕПЕРЬ РАБОТАЕТ НА ОБОИХ ЭКРАНАХ!
    if (currentScreen === "result" || currentScreen === "saved") { 
      saveResultCanvas(); 
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (video) video.size(windowWidth, windowHeight);
}
