// ============================================================
// camera.js — 담당: 틀레우바이 아야으름
// ============================================================

let video;
let capturedPhotos = [];
let allPhotos      = [];
let selectedPhotos = [];
let countdown      = 0;
let isCapturing    = false;
let cameraError    = false;

let _boxX=0, _boxY=0, _boxW=400, _boxH=300;
const MAX_PHOTOS = 8;

// ============================================================
function setupCamera() {
  try {
    video = createCapture(VIDEO, () => { cameraError = false; });
    video.size(640, 480);
    video.hide();
    initFaceMesh(video);
  } catch(e) {
    cameraError = true;
  }
}

// ============================================================
function drawCamera() {
  push();
  rectMode(CORNER); textAlign(CENTER, CENTER);

  if (cameraError || !video || video.width === 0) {
    drawCameraError(); pop(); return;
  }

  drawBG();

  let camW = min(width * 0.65, 480);
  let camH = camW * 0.72;
  let camX = width / 2 - camW / 2;
  let camY = height * 0.08;

  _boxX = camX; _boxY = camY; _boxW = camW; _boxH = camH;

  // 카메라 그림자
  push(); fill(180,150,200,50); noStroke();
  rect(camX+6, camY+6, camW, camH, 16); pop();

  // 프레임 테두리 (그라디언트 효과)
  push(); noStroke();
  for (let i = 0; i < 6; i++) {
    let t = i/6;
    stroke(lerpColor(color(frameDark[selectedFrame]), color("#c8b4f8"), t));
    strokeWeight(6-i); noFill();
    rect(camX-i, camY-i, camW+i*2, camH+i*2, 16);
  }
  pop();

  // 비디오
  push(); imageMode(CORNER);
  image(video, camX, camY, camW, camH); pop();

  // AR 필터
  drawARFilter(camX+camW/2, camY+camH/2, selectedFilter, camW, camH);
  drawFaceStatus(width, height);

  // LIVE 뱃지
  push(); noStroke();
  fill(255,77,109,180); rect(camX+10, camY+10, 68, 26, 13);
  fill(255); textSize(12);
  text("● LIVE", camX+44, camY+23); pop();

  // 촬영 수 뱃지
  push(); fill(0,0,0,130); noStroke();
  rect(camX+camW-86, camY+10, 76, 26, 13);
  fill(255); textSize(12);
  text("📷 "+allPhotos.length+"/"+MAX_PHOTOS, camX+camW-48, camY+23); pop();

  // 👌 제스처 힌트
  push(); fill(0,0,0,100); noStroke();
  rect(camX+camW-188, camY+camH-38, 178, 28, 14);
  fill(255); textSize(11); textAlign(LEFT, CENTER);
  text("👌 엄지+검지 터치 = 촬영", camX+camW-182, camY+camH-24); pop();

  // 오른쪽 필터 버튼
  let fBtnSize = min(width*0.062, 40);
  let fBtnX    = camX + camW + 16;
  for (let i = 0; i < filterEmoji.length; i++) {
    push(); let by = camY + i*(fBtnSize+8);
    fill(0,0,0,15); noStroke(); rect(fBtnX+2, by+2, fBtnSize, fBtnSize, 10);
    if (selectedFilter===i) {
      for(let j=0;j<fBtnSize;j++){
        let t=j/fBtnSize;
        fill(lerpColor(color("#ff6b9d"),color("#c8b4f8"),t));
        rect(fBtnX,by+j,fBtnSize,1,j===0?10:0,j===0?10:0,j===fBtnSize-1?10:0,j===fBtnSize-1?10:0);
      }
    } else {
      fill("#fff"); stroke("#eee"); strokeWeight(1.5);
      rect(fBtnX, by, fBtnSize, fBtnSize, 10);
    }
    noStroke(); fill(selectedFilter===i?"#fff":"#555");
    textSize(fBtnSize*0.46);
    text(filterEmoji[i], fBtnX+fBtnSize/2, by+fBtnSize/2); pop();
  }

  // 하단 미리보기
  let prevSize = min(width*0.075, 50);
  let prevGap  = 6;
  let prevTotal = prevSize*MAX_PHOTOS + prevGap*(MAX_PHOTOS-1);
  let prevStart = width/2 - prevTotal/2;
  let prevY     = camY + camH + 14;

  for (let i = 0; i < MAX_PHOTOS; i++) {
    push(); let px = prevStart + i*(prevSize+prevGap);
    fill(0,0,0,15); noStroke(); rect(px+2, prevY+2, prevSize, prevSize, 8);
    if (allPhotos[i]) {
      imageMode(CORNER); image(allPhotos[i], px, prevY, prevSize, prevSize);
      stroke("#ff4d6d"); strokeWeight(2); noFill();
      rect(px, prevY, prevSize, prevSize, 8);
      // 번호
      fill("#ff4d6d",200); noStroke();
      circle(px+prevSize-8, prevY+8, 16);
      fill(255); textSize(9); textAlign(CENTER,CENTER);
      text(str(i+1), px+prevSize-8, prevY+8);
    } else {
      fill(i===allPhotos.length&&isCapturing?"#ff4d6d":"#f3e5ff");
      stroke("#c8b4f8"); strokeWeight(1.5);
      rect(px, prevY, prevSize, prevSize, 8);
      noStroke();
      fill(i===allPhotos.length&&isCapturing?255:"#c8b4f8");
      textSize(10); textAlign(CENTER,CENTER);
      text(str(i+1), px+prevSize/2, prevY+prevSize/2);
    }
    pop();
  }

  // 촬영 버튼
  let btnY = height - 70;
  push();
  if (isCapturing || allPhotos.length >= MAX_PHOTOS) {
    fill("#f0f0f0"); noStroke();
    rect(width/2-118, btnY, 236, 50, 25);
    fill("#ccc"); textSize(16); textAlign(CENTER,CENTER);
    text(allPhotos.length>=MAX_PHOTOS?"최대 8장 촬영됨 ✓":"촬영 중...",
         width/2, btnY+25);
  } else {
    fill(200,100,180,70); noStroke();
    rect(width/2-118+4, btnY+4, 236, 50, 25);
    for(let i=0;i<50;i++){
      let t=i/50;
      fill(lerpColor(color("#ff6b9d"),color("#c8b4f8"),t));
      rect(width/2-118,btnY+i,236,1,i===0?25:0,i===0?25:0,i===49?25:0,i===49?25:0);
    }
    fill(255); textSize(19); textAlign(CENTER,CENTER);
    text("📷  촬영하기", width/2, btnY+25);
  }
  pop();

  // 선택하기 버튼 (1장 이상 찍으면 표시)
  if (allPhotos.length > 0) {
    push(); noStroke();
    fill(200,100,180,60); rect(width/2+124+4, btnY+4, 120, 50, 25);
    fill("#f3e5ff"); rect(width/2+124, btnY, 120, 50, 25);
    fill("#c8b4f8"); textSize(14); textAlign(CENTER,CENTER);
    text("선택하기 →", width/2+184, btnY+25); pop();
  }

  // Back 버튼
  push(); fill("#f3e5ff"); noStroke(); rect(16, 12, 82, 32, 16);
  fill("#c8b4f8"); textSize(13); textAlign(CENTER,CENTER);
  text("← Back", 57, 28); pop();

  // 카운트다운
  if (countdown > 0) {
    push(); fill(0,0,0,150); noStroke(); rect(camX, camY, camW, camH);
    // 숫자 글로우
    for(let i=4;i>=0;i--){
      fill(255,77,109, 30+i*20); noStroke();
      textSize(min(camW*0.32,150)+i*4);
      textAlign(CENTER,CENTER);
      text(str(countdown), camX+camW/2, camY+camH/2);
    }
    fill(255); stroke("#ff4d6d"); strokeWeight(4);
    textSize(min(camW*0.32,150));
    text(str(countdown), camX+camW/2, camY+camH/2);
    pop();
  }

  pop();
}

// ============================================================
// 카메라 오류 화면
// ============================================================
function drawCameraError() {
  drawBG();
  push(); rectMode(CORNER); textAlign(CENTER,CENTER); noStroke();

  let cw=min(width*0.78,420), cx=width/2-cw/2;
  drawCard(cx, height*0.18, cw, height*0.64, 24);

  // 아이콘
  push(); noStroke();
  fill("#ffb6c1"); circle(width/2, height*0.34, 90);
  fill(255); textSize(36); text("📷", width/2, height*0.34+4); pop();

  fill("#ff4d6d"); textSize(min(width*0.044,24));
  text("카메라를 사용할 수 없어요", width/2, height*0.48);
  fill("#aaa"); textSize(13);
  text("브라우저에서 카메라 권한을", width/2, height*0.54);
  text("허용해 주세요 🙏", width/2, height*0.59);

  // 새로고침 버튼
  push(); noStroke();
  fill(200,100,180,70); rect(width/2-104+4, height*0.66+4, 208, 48, 24);
  for(let i=0;i<48;i++){
    let t=i/48;
    fill(lerpColor(color("#ff6b9d"),color("#c8b4f8"),t));
    rect(width/2-104,height*0.66+i,208,1,i===0?24:0,i===0?24:0,i===47?24:0,i===47?24:0);
  }
  fill(255); textSize(17); textAlign(CENTER,CENTER);
  text("🔄  새로고침", width/2, height*0.66+24); pop();

  // Back
  push(); fill("#f3e5ff"); noStroke(); rect(16,12,82,32,16);
  fill("#c8b4f8"); textSize(13); text("← Back",57,28); pop();

  pop();
}

// ============================================================
function handleCameraButtons() {
  // Back
  if (mouseX>16 && mouseX<98 && mouseY>12 && mouseY<44) {
    currentScreen="settings"; return;
  }

  // 오류 화면
  if (cameraError || !video || video.width===0) {
    if (mouseX>width/2-104 && mouseX<width/2+104 &&
        mouseY>height*0.66 && mouseY<height*0.66+48)
      location.reload();
    return;
  }

  let camW    = min(width*0.65,480);
  let camX    = width/2-camW/2;
  let camY    = height*0.08;
  let fBtnSize = min(width*0.062,40);
  let fBtnX   = camX+camW+16;

  // 필터 버튼
  for (let i=0; i<filterEmoji.length; i++) {
    let by = camY+i*(fBtnSize+8);
    if (mouseX>fBtnX && mouseX<fBtnX+fBtnSize &&
        mouseY>by && mouseY<by+fBtnSize) {
      selectedFilter=i; return;
    }
  }

  let btnY = height-70;

  // 선택하기 버튼
  if (allPhotos.length>0 &&
      mouseX>width/2+124 && mouseX<width/2+244 &&
      mouseY>btnY && mouseY<btnY+50) {
    selectedPhotos=[];
    currentScreen="select"; return;
  }

  // 촬영하기 버튼
  if (!isCapturing && allPhotos.length<MAX_PHOTOS &&
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
          setTimeout(() => {
            currentScreen = "select";
          }, 800);
        }
      }, 80);
    }
  }, 1000);
}

// 키보드/제스처 호환
function startPhotoSequence() { takeSinglePhoto(); }

// ============================================================
function flashEffect() {
  push(); rectMode(CORNER);
  // 그라디언트 플래시
  for(let i=0;i<255;i+=8){
    fill(255,255,255,255-i); noStroke();
    rect(0,0,width,height);
  }
  pop();
}
