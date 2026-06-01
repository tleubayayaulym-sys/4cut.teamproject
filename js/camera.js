// ============================================================
// camera.js — 담당: 틀레우바이 아야으름
// ============================================================

let mediaRecorder    = null;
let recordedChunks   = [];
let recordedVideo// ============================================================
// camera.js — 담당: 틀레우바이 아야으름
// Fullscreen camera (thầy yêu cầu) + countdown + 4컷 촬영
// ============================================================

let video;
let capturedPhotos = [];
let countdown      = 0;
let isCapturing    = false;

// vị trí chụp (fullscreen = toàn canvas)
let _boxX = 0;
let _boxY = 0;
let _boxW = 400;
let _boxH = 400;

// ============================================================
// setupCamera()
// ============================================================
function setupCamera() {
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();
  initFaceMesh(video); // ar-filter.js
}

// ============================================================
// drawCamera() — FULLSCREEN
// ============================================================
function drawCamera() {
  push();
  rectMode(CORNER); textAlign(CENTER, CENTER);

  // --- Camera FULLSCREEN ---
  imageMode(CORNER);
  image(video, 0, 0, width, height);

  // Lưu lại toàn màn hình để chụp
  _boxX = 0; _boxY = 0; _boxW = width; _boxH = height;

  // --- AR filter (ar-filter.js) ---
  drawARFilter(width/2, height/2, selectedFilter, width, height);
  drawFaceStatus(width, height);

  // --- LIVE badge ---
  push();
  fill("#ff4d6d"); noStroke();
  rect(14, 14, 52, 24, 12);
  fill(255); textSize(13);
  text("LIVE", 40, 26);
  pop();

  // --- Filter selector (góc phải) ---
  let fBtnSize = min(width * 0.07, 44);
  let fBtnX    = width - fBtnSize - 12;
  for (let i = 0; i < filterEmoji.length; i++) {
    push();
    let by = 14 + i * (fBtnSize + 8);
    if (selectedFilter === i) {
      fill("#ff4d6d"); stroke("#ff4d6d");
    } else {
      fill(255, 255, 255, 180); stroke("#ddd");
    }
    strokeWeight(2); rect(fBtnX, by, fBtnSize, fBtnSize, 10);
    noStroke(); fill(selectedFilter === i ? "#fff" : "#333");
    textSize(fBtnSize * 0.5);
    text(filterEmoji[i], fBtnX + fBtnSize/2, by + fBtnSize/2);
    pop();
  }

  // --- Progress dots ---
  let dotY = height - 90;
  let dotSize = min(width * 0.045, 28);
  let dotGap  = 10;
  let dotTot  = dotSize * 4 + dotGap * 3;
  let dotSX   = width/2 - dotTot/2;

  for (let i = 0; i < 4; i++) {
    push();
    let dx = dotSX + i * (dotSize + dotGap);
    if (i < capturedPhotos.length) {
      fill("#4caf50"); noStroke();
    } else if (i === capturedPhotos.length && isCapturing) {
      fill("#ff4d6d"); noStroke();
    } else {
      fill(255, 255, 255, 150); stroke("#ddd"); strokeWeight(2);
    }
    circle(dx + dotSize/2, dotY, dotSize);
    fill(255); noStroke(); textSize(dotSize * 0.5);
    if (i < capturedPhotos.length) text("✓", dx + dotSize/2, dotY);
    else text(str(i+1), dx + dotSize/2, dotY);
    pop();
  }

  // --- 촬영 버튼 ---
  push();
  fill(isCapturing ? 200 : "#ff4d6d"); noStroke();
  circle(width/2, height - 42, 58);
  fill(255); noStroke(); textSize(13);
  text("촬영", width/2, height - 42);
  pop();

  // --- Back ---
  push();
  fill(255, 255, 255, 180); noStroke(); rectMode(CORNER);
  rect(14, height - 58, 72, 32, 16);
  fill("#555"); textSize(13);
  text("← Back", 50, height - 42);
  pop();

  // --- Hand gesture hint ---
  push();
  fill(0, 0, 0, 100); noStroke();
  rect(0, height - 28, width, 28);
  fill(255); textSize(12);
  text("👌  엄지+검지 터치 = 촬영", width/2, height - 14);
  pop();

  // --- Countdown overlay ---
  if (countdown > 0) {
    push();
    fill(0, 0, 0, 140); noStroke(); rect(0, 0, width, height);
    fill(255); stroke("#ff4d6d"); strokeWeight(8);
    textSize(min(width*0.35, 200));
    text(str(countdown), width/2, height/2);
    pop();
  }

  pop();
}

// ============================================================
// handleCameraButtons()
// ============================================================
function handleCameraButtons() {
  // Back
  if (mouseX>14 && mouseX<86 && mouseY>height-58 && mouseY<height-26) {
    currentScreen = "settings"; return;
  }
  // Filter buttons
  let fBtnSize = min(width*0.07, 44);
  let fBtnX    = width - fBtnSize - 12;
  for (let i = 0; i < filterEmoji.length; i++) {
    let by = 14 + i * (fBtnSize + 8);
    if (mouseX>fBtnX && mouseX<fBtnX+fBtnSize && mouseY>by && mouseY<by+fBtnSize) {
      selectedFilter = i; return;
    }
  }
  // 촬영 버튼
  if (!isCapturing && dist(mouseX, mouseY, width/2, height-42) < 29)
    startPhotoSequence();
}

// ============================================================
// startPhotoSequence() + takePhoto()
// ============================================================
function startPhotoSequence() {
  if (isCapturing) return;
  capturedPhotos = [];
  isCapturing    = true;
  takePhoto(0);
}

function takePhoto(index) {
  if (index >= 4) {
    isCapturing = false; currentScreen = "result"; return;
  }
  countdown = 3;
  let timer = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(timer);
      countdown = 0;
      // Đợi 1 frame để countdown biến mất rồi mới chụp
      setTimeout(() => {
        let img = get(_boxX, _boxY, _boxW, _boxH);
        capturedPhotos.push(img);
        flashEffect();
        setTimeout(() => { takePhoto(index + 1); }, 600);
      }, 50);
    }
  }, 1000);
}

function flashEffect() {
  push(); fill(255); noStroke(); rectMode(CORNER);
  rect(0, 0, width, height); pop();
}
URL = null;

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
    video = createCapture(VIDEO, () => {
      cameraError = false;
    });
video.size(windowWidth, windowHeight);
    video.hide();
    initFaceMesh(video);

    // MediaRecorder — запускаем когда видео готово
    video.elt.onloadedmetadata = () => {
      try {
        const stream = video.elt.srcObject;
        if (!stream) return;
        mediaRecorder = new MediaRecorder(stream, {mimeType: "video/webm"});

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          let blob = new Blob(recordedChunks, {type: "video/webm"});
          recordedVideoURL = URL.createObjectURL(blob);
          console.log("🎥 Video ready");
        };
      } catch(e) {
        console.log("MediaRecorder error:", e);
        mediaRecorder = null;
      }
    };

    initFaceMesh(video);
  } catch(e) {
    cameraError = true;
  }
}

// ============================================================
function drawCamera() {
  push(); rectMode(CORNER); textAlign(CENTER,CENTER);

  if (cameraError || !video || video.width === 0) {
    drawCameraError(); pop(); return;
  }

  drawBG();

  let camW = min(width*0.65, 480);
  let camH = camW * 0.72;
  let camX = width/2 - camW/2;
  let camY = height * 0.08;

  _boxX=camX; _boxY=camY; _boxW=camW; _boxH=camH;

  // 그림자
  push(); fill(180,150,200,50); noStroke();
  rect(camX+6,camY+6,camW,camH,16); pop();

  // 프레임 테두리
  push(); stroke(frameDark[selectedFrame]); strokeWeight(5); noFill();
  rect(camX-3,camY-3,camW+6,camH+6,16); pop();

  // 비디오
  push(); imageMode(CORNER); image(video,camX,camY,camW,camH); pop();

  // AR 필터
  drawARFilter(camX+camW/2, camY+camH/2, selectedFilter, camW, camH);
  drawFaceStatus(width, height);

  // LIVE 뱃지
  push(); fill(255,77,109,200); noStroke();
  rect(camX+10,camY+10,68,26,13);
  fill(255); textSize(12); text("● LIVE",camX+44,camY+23); pop();

  // REC 뱃지 (녹화 중일 때)
  if (mediaRecorder && mediaRecorder.state === "recording") {
    push(); fill(220,50,50,220); noStroke();
    rect(camX+88,camY+10,58,26,13);
    fill(255); textSize(11);
    text("⏺ REC",camX+117,camY+23); pop();
  }

  // 촬영 수 뱃지
  push(); fill(0,0,0,130); noStroke();
  rect(camX+camW-86,camY+10,76,26,13);
  fill(255); textSize(12);
  text("📷 "+allPhotos.length+"/"+MAX_PHOTOS,camX+camW-48,camY+23); pop();

  // 제스처 힌트
  push(); fill(0,0,0,110); noStroke();
  rect(camX+camW-192,camY+camH-38,182,28,14);
  fill(255); textSize(11); textAlign(LEFT,CENTER);
  text("👌 엄지+검지 터치 = 촬영",camX+camW-186,camY+camH-24); pop();

  // 필터 버튼
  let fBtnSize = min(width*0.062,40);
  let fBtnX    = camX+camW+16;
  for (let i=0; i<filterEmoji.length; i++) {
    push(); let by=camY+i*(fBtnSize+8);
    fill(0,0,0,15); noStroke(); rect(fBtnX+2,by+2,fBtnSize,fBtnSize,10);
    if(selectedFilter===i){ fill("#ff4d6d"); noStroke(); }
    else{ fill("#fff"); stroke("#eee"); strokeWeight(1.5); }
    rect(fBtnX,by,fBtnSize,fBtnSize,10);
    noStroke(); fill(selectedFilter===i?"#fff":"#555");
    textSize(fBtnSize*0.46);
    text(filterEmoji[i],fBtnX+fBtnSize/2,by+fBtnSize/2); pop();
  }

  // 미리보기
  let prevSize  = min(width*0.075,50);
  let prevGap   = 6;
  let prevTotal = prevSize*MAX_PHOTOS+prevGap*(MAX_PHOTOS-1);
  let prevStart = width/2-prevTotal/2;
  let prevY     = camY+camH+14;

  for (let i=0; i<MAX_PHOTOS; i++) {
    push(); let px=prevStart+i*(prevSize+prevGap);
    fill(0,0,0,15); noStroke(); rect(px+2,prevY+2,prevSize,prevSize,8);
    if (allPhotos[i]) {
      imageMode(CORNER); image(allPhotos[i],px,prevY,prevSize,prevSize);
      stroke("#ff4d6d"); strokeWeight(2); noFill();
      rect(px,prevY,prevSize,prevSize,8);
      fill("#ff4d6d"); noStroke(); circle(px+prevSize-8,prevY+8,16);
      fill(255); textSize(9); textAlign(CENTER,CENTER);
      text(str(i+1),px+prevSize-8,prevY+8);
    } else {
      fill(i===allPhotos.length&&isCapturing?"#ff4d6d":"#f3e5ff");
      stroke("#c8b4f8"); strokeWeight(1.5);
      rect(px,prevY,prevSize,prevSize,8);
      noStroke(); fill(i===allPhotos.length&&isCapturing?255:"#c8b4f8");
      textSize(10); textAlign(CENTER,CENTER);
      text(str(i+1),px+prevSize/2,prevY+prevSize/2);
    }
    pop();
  }

  // 촬영 버튼
  let btnY = height-70;
  if (isCapturing || allPhotos.length>=MAX_PHOTOS) {
    push(); fill("#f0f0f0"); noStroke();
    rect(width/2-118,btnY,236,50,25);
    fill("#ccc"); textSize(16); textAlign(CENTER,CENTER);
    text(allPhotos.length>=MAX_PHOTOS?"최대 8장 촬영됨 ✓":"촬영 중...",width/2,btnY+25);
    pop();
  } else {
    drawPinkBtn(width/2-118,btnY,236,50,"📷  촬영하기");
  }

  // 선택하기 버튼
  if (allPhotos.length>0) {
    drawLightBtn(width/2+124,btnY,120,50,"선택하기 →");
  }

  // 비디오 저장 버튼 (녹화 완료 후)
  if (recordedVideoURL) {
    push(); noStroke();
    fill(80,180,120,200);
    rect(width/2-60,btnY-58,120,40,20);
    fill(255); textSize(13); textAlign(CENTER,CENTER);
    text("🎥 영상 저장",width/2,btnY-38); pop();
  }

  // Back
  drawLightBtn(16,12,82,32,"← Back");

  // 카운트다운
  if (countdown>0) {
    push(); fill(0,0,0,150); noStroke(); rect(camX,camY,camW,camH);
    fill(255,77,109,80); noStroke();
    textSize(min(camW*0.32,150)+16); textAlign(CENTER,CENTER);
    text(str(countdown),camX+camW/2,camY+camH/2);
    fill(255); stroke("#ff4d6d"); strokeWeight(4);
    textSize(min(camW*0.32,150));
    text(str(countdown),camX+camW/2,camY+camH/2);
    pop();
  }

  pop();
}

// ============================================================
function drawCameraError() {
  drawBG();
  push(); rectMode(CORNER); textAlign(CENTER,CENTER); noStroke();
  let cw=min(width*0.78,420), cx=width/2-cw/2;
  drawCard(cx,height*0.18,cw,height*0.64,24);
  push(); fill("#ffb6c1"); noStroke();
  circle(width/2,height*0.34,90);
  fill(255); textSize(36); text("📷",width/2,height*0.34+4); pop();
  fill("#ff4d6d"); textSize(min(width*0.044,24));
  text("카메라를 사용할 수 없어요",width/2,height*0.48);
  fill("#aaa"); textSize(13);
  text("브라우저에서 카메라 권한을 허용해 주세요 🙏",width/2,height*0.55);
  drawPinkBtn(width/2-104,height*0.65,208,46,"🔄  새로고침");
  drawLightBtn(16,12,82,32,"← Back");
  pop();
}

// ============================================================
function handleCameraButtons() {
  if(mouseX>16&&mouseX<98&&mouseY>12&&mouseY<44){
    currentScreen="settings"; return;
  }

  if(cameraError||!video||video.width===0){
    if(mouseX>width/2-104&&mouseX<width/2+104&&
       mouseY>height*0.65&&mouseY<height*0.65+46) location.reload();
    return;
  }

  let camW=min(width*0.65,480), camX=width/2-camW/2, camY=height*0.08;
  let fBtnSize=min(width*0.062,40), fBtnX=camX+camW+16;

  // 필터 버튼
  for(let i=0;i<filterEmoji.length;i++){
    let by=camY+i*(fBtnSize+8);
    if(mouseX>fBtnX&&mouseX<fBtnX+fBtnSize&&mouseY>by&&mouseY<by+fBtnSize){
      selectedFilter=i; return;
    }
  }

  let btnY=height-70;

  // 비디오 저장 버튼
  if(recordedVideoURL&&
     mouseX>width/2-60&&mouseX<width/2+60&&
     mouseY>btnY-58&&mouseY<btnY-18){
    let a=document.createElement("a");
    a.href=recordedVideoURL;
    a.download="4cut-video.webm";
    a.click();
    return;
  }

  // 선택하기 버튼
  if(allPhotos.length>0&&
     mouseX>width/2+124&&mouseX<width/2+244&&
     mouseY>btnY&&mouseY<btnY+50){
    // останавливаем запись при переходе
    if(mediaRecorder&&mediaRecorder.state==="recording"){
      mediaRecorder.stop();
    }
    selectedPhotos=[]; currentScreen="select"; return;
  }

  // 촬영하기 버튼
  if(!isCapturing&&allPhotos.length<MAX_PHOTOS&&
     mouseX>width/2-118&&mouseX<width/2+118&&
     mouseY>btnY&&mouseY<btnY+50){
    takeSinglePhoto();
  }
}

// ============================================================
function takeSinglePhoto() {
  if(isCapturing||allPhotos.length>=MAX_PHOTOS) return;

  // Начинаем запись при первой фотке
  if(allPhotos.length===0&&mediaRecorder&&mediaRecorder.state==="inactive"){
    recordedChunks=[];
    try { mediaRecorder.start(); } catch(e){}
  }

  isCapturing=true; countdown=3;

  let timer=setInterval(()=>{
    countdown--;
    if(countdown<=0){
      clearInterval(timer); countdown=0;
      setTimeout(()=>{
        let img=get(_boxX,_boxY,_boxW,_boxH);
        allPhotos.push(img);
        flashEffect();
        isCapturing=false;

        // После 8 фото — стопим запись и идём на выбор
        if(allPhotos.length>=MAX_PHOTOS){
          if(mediaRecorder&&mediaRecorder.state==="recording"){
            mediaRecorder.stop();
          }
          selectedPhotos=[];
          setTimeout(()=>{ currentScreen="select"; },800);
        }
      },80);
    }
  },1000);
}

function startPhotoSequence() { takeSinglePhoto(); }

function flashEffect() {
  push(); rectMode(CORNER); fill(255,255,255,200); noStroke();
  rect(0,0,width,height); pop();
}
