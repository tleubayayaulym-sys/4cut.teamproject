// ============================================================
// camera.js — 담당: 틀레우바이 아야으름
// 새 기능: 최대 8장 촬영 후 선택
// ============================================================

let video;
let capturedPhotos = [];
let allPhotos      = [];   // 촬영한 모든 사진
let selectedPhotos = [];   // 선택된 4장 인덱스
let countdown      = 0;
let isCapturing    = false;
let cameraError    = false; // 카메라 오류 여부

let _boxX = 0, _boxY = 0, _boxW = 400, _boxH = 300;

const MAX_PHOTOS = 8;

// ============================================================
function setupCamera() {
  try {
    video = createCapture(VIDEO, () => {
      cameraError = false;
    });
    video.size(640, 480);
    video.hide();
    initFaceMesh(video);
  } catch (e) {
    cameraError = true;
  }
}

// ============================================================
function drawCamera() {
  push();
  rectMode(CORNER); textAlign(CENTER, CENTER);

  // 카메라 오류 화면
  if (cameraError || !video || video.width === 0) {
    drawCameraError();
    pop(); return;
  }

  let camW = min(width * 0.68, 500);
  let camH = camW * 0.72;
  let camX = width/2 - camW/2;
  let camY = height * 0.08;

  _boxX=camX; _boxY=camY; _boxW=camW; _boxH=camH;

  // 배경
  background("#fff0f5");

  // 카메라 그림자
  push(); fill(0,0,0,20); noStroke();
  rect(camX+5, camY+5, camW, camH, 16); pop();

  // 프레임 테두리
  push(); stroke(frameDark[selectedFrame]); strokeWeight(6); noFill();
  rect(camX-4, camY-4, camW+8, camH+8, 16); pop();

  // 비디오
  push(); imageMode(CORNER);
  image(video, camX, camY, camW, camH); pop();

  // AR 필터
  drawARFilter(camX+camW/2, camY+camH/2, selectedFilter, camW, camH);
  drawFaceStatus(width, height);

  // LIVE 뱃지
  push();
  fill("#ff4d6d"); noStroke();
  rect(camX+10, camY+10, 58, 26, 13);
  fill(255); textSize(13);
  text("● LIVE", camX+39, camY+23);
  pop();

  // 촬영 수
  push();
  fill(0,0,0,100); noStroke();
  rect(camX+camW-78, camY+10, 68, 26, 13);
  fill(255); textSize(13);
  text("📷 " + allPhotos.length + "/" + MAX_PHOTOS, camX+camW-44, camY+23);
  pop();

  // 오른쪽 필터 버튼
  let fBtnSize = min(width*0.065, 42);
  let fBtnX    = camX + camW + 14;
  for (let i = 0; i < filterEmoji.length; i++) {
    push();
    let by = camY + i*(fBtnSize+8);
    fill(0,0,0,15); noStroke();
    rect(fBtnX+2, by+2, fBtnSize, fBtnSize, 10);
    if (selectedFilter===i) { fill("#ff4d6d"); stroke("#ff4d6d"); }
    else { fill("#fff"); stroke("#eee"); }
    strokeWeight(2);
    rect(fBtnX, by, fBtnSize, fBtnSize, 10);
    noStroke(); fill(selectedFilter===i?"#fff":"#333");
    textSize(fBtnSize*0.48);
    text(filterEmoji[i], fBtnX+fBtnSize/2, by+fBtnSize/2);
    pop();
  }

  // 하단 미리보기 (찍은 사진들)
  let prevSize = min(width*0.08, 52);
  let prevY    = camY + camH + 16;
  let prevGap  = 8;
  let prevTotal = prevSize*MAX_PHOTOS + prevGap*(MAX_PHOTOS-1);
  let prevStart = width/2 - prevTotal/2;

  for (let i = 0; i < MAX_PHOTOS; i++) {
    push();
    let px = prevStart + i*(prevSize+prevGap);
    fill(0,0,0,15); noStroke();
    rect(px+2, prevY+2, prevSize, prevSize, 8);
    if (allPhotos[i]) {
      imageMode(CORNER);
      image(allPhotos[i], px, prevY, prevSize, prevSize);
      stroke("#ff4d6d"); strokeWeight(2); noFill();
      rect(px, prevY, prevSize, prevSize, 8);
    } else {
      fill(i===allPhotos.length && isCapturing ? "#ff4d6d" : "#ffe0eb");
      stroke("#ffb6c1"); strokeWeight(2);
      rect(px, prevY, prevSize, prevSize, 8);
      noStroke();
      fill(i===allPhotos.length && isCapturing ? 255 : "#ffb6c1");
      textSize(11);
      text(str(i+1), px+prevSize/2, prevY+prevSize/2);
    }
    pop();
  }

  // 촬영 버튼
  let btnY = height - 72;
  push();
  if (isCapturing || allPhotos.length >= MAX_PHOTOS) {
    fill("#eee"); noStroke();
    rect(width/2 - 118, btnY, 236, 50, 25);
    fill("#bbb"); textSize(18);
    text(allPhotos.length >= MAX_PHOTOS ? "최대 8장 촬영됨" : "촬영 중...", width/2, btnY+25);
  } else {
    fill(255,77,109,50); noStroke();
    rect(width/2-118+3, btnY+3, 236, 50, 25);
    fill("#ff4d6d"); noStroke();
    rect(width/2-118, btnY, 236, 50, 25);
    fill(255); textSize(20);
    text("📷  촬영하기", width/2, btnY+25);
  }
  pop();

  // 선택하기 버튼 (1장 이상 찍었을 때)
  if (allPhotos.length > 0) {
    push();
    fill("#ffe0eb"); noStroke();
    rect(width/2+124, btnY, 110, 50, 25);
    fill("#ff4d6d"); textSize(15);
    text("선택하기 →", width/2+179, btnY+25);
    pop();
  }

  // Back 버튼
  push();
  fill("#ffe0eb"); noStroke();
  rect(20, 14, 76, 32, 16);
  fill("#ff4d6d"); textSize(13); textAlign(CENTER, CENTER);
  text("← Back", 58, 30);
  pop();

  // 카운트다운
  if (countdown > 0) {
    push();
    fill(0,0,0,140); noStroke();
    rect(camX, camY, camW, camH);
    fill(255); stroke("#ff4d6d"); strokeWeight(6);
    textSize(min(camW*0.32, 150));
    text(str(countdown), camX+camW/2, camY+camH/2);
    pop();
  }

  pop();
}

// ============================================================
// 카메라 오류 화면 (예쁜 디자인)
// ============================================================
function drawCameraError() {
  background("#fff0f5");
  push();
  rectMode(CORNER); textAlign(CENTER, CENTER); noStroke();

  // 카드
  fill(255,255,255,220);
  rect(width/2-min(width*0.35,200), height*0.2,
       min(width*0.7,400), height*0.6, 24);

  // 아이콘
  fill("#ffb6c1"); circle(width/2, height*0.36, 90);
  fill(255); textSize(36); text("📷", width/2, height*0.36+4);

  fill("#ff4d6d"); textSize(min(width*0.05,28));
  text("카메라를 사용할 수 없어요", width/2, height*0.5);

  fill("#aaa"); textSize(13);
  text("브라우저에서 카메라 권한을", width/2, height*0.57);
  text("허용해 주세요 🙏", width/2, height*0.61);

  // 새로고침 버튼
  fill("#ff4d6d"); noStroke();
  rect(width/2-100, height*0.68, 200, 46, 23);
  fill(255); textSize(16);
  text("🔄  새로고침", width/2, height*0.68+23);

  // Back
  fill("#ffe0eb"); noStroke();
  rect(20, 14, 76, 32, 16);
  fill("#ff4d6d"); textSize(13);
  text("← Back", 58, 30);

  pop();
}

// ============================================================
function handleCameraButtons() {
  // Back
  if (mouseX>20 && mouseX<96 && mouseY>14 && mouseY<46) {
    currentScreen="settings"; return;
  }

  // 오류 화면 새로고침
  if (cameraError || !video || video.width===0) {
    if (mouseX>width/2-100 && mouseX<width/2+100 &&
        mouseY>height*0.68 && mouseY<height*0.68+46) {
      location.reload();
    }
    return;
  }

  // 필터 버튼
  let camW     = min(width*0.68,500);
  let camX     = width/2-camW/2;
  let camY     = height*0.08;
  let fBtnSize = min(width*0.065,42);
  let fBtnX    = camX+camW+14;
  for (let i = 0; i < filterEmoji.length; i++) {
    let by = camY + i*(fBtnSize+8);
    if (mouseX>fBtnX && mouseX<fBtnX+fBtnSize &&
        mouseY>by && mouseY<by+fBtnSize) {
      selectedFilter=i; return;
    }
  }

  // 선택하기 버튼
  let btnY = height - 72;
  if (allPhotos.length > 0 &&
      mouseX>width/2+124 && mouseX<width/2+234 &&
      mouseY>btnY && mouseY<btnY+50) {
    selectedPhotos=[];
    currentScreen="select"; return;
  }

  // 촬영하기 버튼
  if (!isCapturing && allPhotos.length < MAX_PHOTOS &&
      mouseX>width/2-118 && mouseX<width/2+118 &&
      mouseY>btnY && mouseY<btnY+50) {
    takeSinglePhoto();
  }
}

// ============================================================
// 한 장씩 촬영
// ============================================================
function takeSinglePhoto() {
  if (isCapturing || allPhotos.length >= MAX_PHOTOS) return;
  isCapturing = true;
  countdown   = 3;

  let timer = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(timer);
      countdown = 0;
      setTimeout(() => {
        let img = get(_boxX, _boxY, _boxW, _boxH);
        allPhotos.push(img);
        flashEffect();
        isCapturing = false;
        // 8장 다 찍으면 자동으로 선택 화면
        if (allPhotos.length >= MAX_PHOTOS) {
          selectedPhotos = [];
          setTimeout(() => { currentScreen = "select"; }, 600);
        }
      }, 50);
    }
  }, 1000);
}

// startPhotoSequence — 키보드 Space 호환용
function startPhotoSequence() {
  takeSinglePhoto();
}

function flashEffect() {
  push(); rectMode(CORNER); fill(255); noStroke();
  rect(0,0,width,height); pop();
}  _boxH = camH;

  // рамка
  push();
  stroke(frameDark[selectedFrame]);
  strokeWeight(5); noFill();
  rect(camX - 3, camY - 3, camW + 6, camH + 6, 10);
  pop();

  // видео
  push();
  imageMode(CORNER);
  image(video, camX, camY, camW, camH);
  pop();

  // LIVE badge
  push();
  fill("#ff4d6d"); noStroke();
  rect(camX + 10, camY + 10, 52, 24, 12);
  fill(255); textSize(13);
  text("LIVE", camX + 36, camY + 22);
  pop();

  // AR фильтр
  drawARFilter(camX + camW / 2, camY + camH / 2, selectedFilter, camW, camH);
  drawFaceStatus(width, height);

  // кнопки фильтров
  let fBtnSize = min(width * 0.07, 44);
  let fBtnX    = camX + camW + 14;
  for (let i = 0; i < filterEmoji.length; i++) {
    push();
    let by = camY + i * (fBtnSize + 10);
    if (selectedFilter === i) {
      fill("#ff4d6d"); stroke("#ff4d6d");
    } else {
      fill("#fff"); stroke("#ddd");
    }
    strokeWeight(2);
    rect(fBtnX, by, fBtnSize, fBtnSize, 10);
    noStroke();
    fill(selectedFilter === i ? "#fff" : "#333");
    textSize(fBtnSize * 0.5);
    text(filterEmoji[i], fBtnX + fBtnSize / 2, by + fBtnSize / 2);
    pop();
  }

  // прогресс
  let progY  = camY + camH + 22;
  let bSize  = min(width * 0.1, 56);
  let bGap   = 10;
  let bTotal = bSize * 4 + bGap * 3;
  let bStart = width / 2 - bTotal / 2;

  for (let i = 0; i < 4; i++) {
    push();
    let bx = bStart + i * (bSize + bGap);
    if (i < capturedPhotos.length) {
      fill("#4caf50"); noStroke();
      rect(bx, progY, bSize, bSize, 10);
      fill(255); textSize(22);
      text("✓" + (i + 1), bx + bSize / 2, progY + bSize / 2);
    } else if (i === capturedPhotos.length && isCapturing) {
      fill("#ff4d6d"); noStroke();
      rect(bx, progY, bSize, bSize, 10);
      fill(255); textSize(18);
      text("→" + (i + 1), bx + bSize / 2, progY + bSize / 2);
    } else {
      fill("#eee"); stroke("#ddd"); strokeWeight(2);
      rect(bx, progY, bSize, bSize, 10);
      fill("#aaa"); noStroke(); textSize(20);
      text(str(i + 1), bx + bSize / 2, progY + bSize / 2);
    }
    pop();
  }

  // счётчик
  push();
  fill("#666"); noStroke(); textSize(14);
  text("촬영: " + capturedPhotos.length + " / 4", width / 2, progY + bSize + 18);
  pop();

  // кнопка съёмки
  push();
  fill(isCapturing ? "#ccc" : "#ff4d6d"); noStroke();
  rect(width / 2 - min(width * 0.22, 120), height - 78,
       min(width * 0.44, 240), 52, 26);
  fill(255); textSize(min(width * 0.04, 26));
  text("촬영하기", width / 2, height - 52);
  pop();

  // подсказка жест
  push();
  fill("#fff"); noStroke();
  rect(camX, camY + camH - 34, camW, 34, 0, 0, 8, 8);
  fill("#ff4d6d"); textSize(13); textAlign(LEFT, CENTER);
  text("👌  엄지+검지 터치 = 촬영", camX + 12, camY + camH - 17);
  pop();

  // обратный отсчёт
  if (countdown > 0) {
    push();
    fill(0, 0, 0, 120); noStroke();
    rect(camX, camY, camW, camH);
    fill(255); stroke("#ff4d6d"); strokeWeight(6);
    textSize(min(camW * 0.35, 160));
    text(str(countdown), camX + camW / 2, camY + camH / 2);
    pop();
  }

  // кнопка назад
  push();
  fill("#eee"); noStroke(); rectMode(CORNER);
  rect(20, 15, 80, 36, 18);
  fill("#777"); textSize(14); textAlign(CENTER, CENTER);
  text("← Back", 60, 33);
  pop();

  pop();
}

function handleCameraButtons() {
  // назад
  if (mouseX > 20 && mouseX < 100 && mouseY > 15 && mouseY < 51) {
    currentScreen = "settings";
    return;
  }

  // выбор фильтра
  let camW     = min(width * 0.72, 520);
  let camX     = width / 2 - camW / 2;
  let camY     = height * 0.1;
  let fBtnSize = min(width * 0.07, 44);
  let fBtnX    = camX + camW + 14;
  for (let i = 0; i < filterEmoji.length; i++) {
    let by = camY + i * (fBtnSize + 10);
    if (mouseX > fBtnX && mouseX < fBtnX + fBtnSize &&
        mouseY > by && mouseY < by + fBtnSize) {
      selectedFilter = i;
      return;
    }
  }

  // кнопка съёмки
  let bw = min(width * 0.44, 240);
  let bx = width / 2 - bw / 2;
  if (!isCapturing &&
      mouseX > bx && mouseX < bx + bw &&
      mouseY > height - 78 && mouseY < height - 26) {
    startPhotoSequence();
  }
}

function startPhotoSequence() {
  if (isCapturing) return;
  capturedPhotos = [];
  isCapturing    = true;
  takePhoto(0);
}

function takePhoto(index) {
  if (index >= 4) {
    isCapturing   = false;
    currentScreen = "result";
    return;
  }

  countdown = 3;

  let timer = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(timer);
      countdown = 0;

      // ждём 1 кадр чтобы countdown исчез с canvas
      setTimeout(() => {
        let img = get(_boxX, _boxY, _boxW, _boxH);
        capturedPhotos.push(img);
        flashEffect();
        setTimeout(() => {
          takePhoto(index + 1);
        }, 800);
      }, 50);
    }
  }, 1000);
}

function flashEffect() {
  push();
  rectMode(CORNER); fill(255); noStroke();
  rect(0, 0, width, height);
  pop();
}
