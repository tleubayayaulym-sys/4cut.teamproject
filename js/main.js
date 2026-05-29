// ============================================================
// main.js — 담당: 틀레우바이 아야으름
// ============================================================

let currentScreen   = "start";
let selectedFrame   = 0;
let selectedFilter  = 0;
let selectedFormat  = 0;
let selectedSticker = 0;

let frameNames  = ["Pink", "Mint", "Lemon", "Lavender"];
let frameColors = ["#ffb6c1", "#b2f0e8", "#fff59d", "#e1bee7"];
let frameDark   = ["#f48fb1", "#80cbc4", "#f9a825", "#ce93d8"];
let frameLight  = ["#fff0f5", "#e8fffe", "#fffde7", "#f3e5f5"];

let filterEmoji = ["🎀", "💕", "🐱", "👓", "🐸"];
let filterLabel = ["Ribbon", "Love", "Cat", "Glasses", "Frog"];

let formatNames = ["길게", "정사각", "넓게", "폴라로이드"];
let stickerNames = ["없음", "별✨", "하트💕", "꽃🌸", "리본🎀"];

let qrCanvas = null;
let GOOGLE_DRIVE_URL = "https://drive.google.com/drive/folders/1azvg-N9Wf7Jfpc3pcz8WQQGTQQnvbIGY?usp=share_link";

// ============================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  setupCamera();
  generateQR();
}

function generateQR() {
  let el = document.createElement("div");
  el.id = "qrDiv";
  el.style.display = "none";
  document.body.appendChild(el);
  try {
    new QRCode(el, {
      text: GOOGLE_DRIVE_URL,
      width: 160, height: 160,
      colorDark: "#333333", colorLight: "#ffffff",
    });
    setTimeout(() => {
      let canvas = el.querySelector("canvas");
      if (canvas) qrCanvas = canvas;
    }, 800);
  } catch(e) {}
}

function draw() {
  if      (currentScreen === "start")    drawStartScreen();
  else if (currentScreen === "settings") drawSettingsScreen();
  else if (currentScreen === "camera")   drawCameraScreen();
  else if (currentScreen === "select")   drawSelectScreen();
  else if (currentScreen === "result")   drawResultScreen();
  else if (currentScreen === "saved")    drawSavedScreen();
  else if (currentScreen === "ending")   drawEndingScreen();
}

// ============================================================
// 배경
// ============================================================
function drawBG() {
  background("#fff0f5");
  push(); noStroke();
  let shapes = ["★","♡","✦","✿","◌"];
  let cols   = ["#ffb6c155","#b2f0e855","#fff59d55","#e1bee755","#ffd6e755"];
  for (let i = 0; i < 16; i++) {
    let x  = (sin(frameCount*0.007+i*137.5)*0.5+0.5)*width;
    let y  = (cos(frameCount*0.005+i*97.3) *0.5+0.5)*height;
    let sz = 8 + sin(frameCount*0.02+i)*3;
    fill(cols[i%cols.length]);
    textSize(sz); textAlign(CENTER,CENTER);
    text(shapes[i%shapes.length], x, y);
  }
  pop();
}

// ============================================================
// 공통 카드
// ============================================================
function drawCard(x, y, w, h, r=20, alpha=215) {
  push(); noStroke();
  fill(200, 180, 210, 40); rect(x+4, y+4, w, h, r);
  fill(255, 255, 255, alpha); rect(x, y, w, h, r);
  pop();
}

// 핑크 그라디언트 버튼 (lerpColor 없이)
function drawPinkBtn(x, y, w, h, label) {
  push(); noStroke();
  fill(220, 100, 160, 70); rect(x+4, y+4, w, h, h/2);
  fill("#ff4d6d"); rect(x, y, w, h, h/2);
  fill(255); textSize(min(h*0.4, 20)); textAlign(CENTER,CENTER);
  text(label, x+w/2, y+h/2);
  pop();
}

// 연보라 버튼
function drawLightBtn(x, y, w, h, label) {
  push(); noStroke();
  fill(200, 180, 220, 60); rect(x+3, y+3, w, h, h/2);
  fill("#f3e5ff"); rect(x, y, w, h, h/2);
  fill("#c8b4f8"); textSize(min(h*0.38, 18)); textAlign(CENTER,CENTER);
  text(label, x+w/2, y+h/2);
  pop();
}

// ============================================================
// START 화면
// ============================================================
function drawStartScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke();

  let cw = min(width*0.82, 480);
  let ch = height*0.82;
  let cx = width/2 - cw/2;
  let cy = height*0.09;
  drawCard(cx, cy, cw, ch, 28);

  // 상단 핑크 배너
  push(); fill("#ffb6c1"); noStroke();
  rect(cx, cy, cw, 88, 28, 28, 0, 0);
  pop();

  // 제목
  fill(255); textSize(min(cw*0.1, 38));
  text("📸  4CUT BOOTH", width/2, cy+38);
  fill(255, 255, 255, 180); textSize(12);
  text("✨  인생네컷 스타일 웹 포토부스  ✨", width/2, cy+68);

  // 제작자 카드
  let cardX = cx+24, cardW = cw-48;
  drawCard(cardX, cy+102, cardW, 60, 14, 160);
  fill("#c8b4f8"); textSize(11); textAlign(CENTER,CENTER);
  text("💝  TEAM 13", width/2, cy+120);
  fill("#555"); textSize(13);
  text("아야울름  ·  응웬 바오 담  ·  마이티투짱", width/2, cy+142);

  // 사용법 카드
  drawCard(cardX, cy+176, cardW, 118, 14, 160);
  fill("#ff4d6d"); textSize(11);
  text("📖  HOW TO USE", width/2, cy+194);
  fill("#555"); textSize(12);
  text("① 프레임 · 필터 · 형식 선택",    width/2, cy+214);
  text("② 최대 8장 자유롭게 촬영",        width/2, cy+232);
  text("③ 마음에 드는 4장 선택",          width/2, cy+250);
  text("④ 장식 추가 후 저장 & 공유! 🎉", width/2, cy+268);

  // 포맷 미리보기
  let preY = cy+310;
  fill("#aaa"); textSize(11);
  text("사진 형식 선택 가능", width/2, preY);
  let fmts  = ["│","■","─","⬜"];
  let fcols = ["#ffb6c1","#b2f0e8","#fff59d","#e1bee7"];
  for (let i=0; i<4; i++) {
    push(); fill(fcols[i]); noStroke();
    rect(cx+36+i*56, preY+12, 42, 42, 8);
    fill("#555"); textSize(18); textAlign(CENTER,CENTER);
    text(fmts[i], cx+57+i*56, preY+33);
    fill("#999"); textSize(9);
    text(formatNames[i], cx+57+i*56, preY+56);
    pop();
  }

  // START 버튼
  let btnW = min(cw-48, 260);
  let btnX = width/2 - btnW/2;
  let btnY = cy+ch-68;
  drawPinkBtn(btnX, btnY, btnW, 50, "▶  START");

  fill("#c8b4f8"); textSize(11);
  text("Space 또는 화면을 터치하세요", width/2, cy+ch-8);
  pop();
}

// ============================================================
// SETTINGS 화면
// ============================================================
function drawSettingsScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke();

  let cw = min(width*0.88, 540);
  let cx = width/2 - cw/2;
  drawCard(cx, 8, cw, height-16, 24);

  // 헤더 핑크
  push(); fill("#ffb6c1"); noStroke();
  rect(cx, 8, cw, 60, 24, 24, 0, 0);
  fill(255); textSize(min(cw*0.08,24)); textAlign(CENTER,CENTER);
  text("⚙️  Settings", width/2, 38);
  pop();

  let lx = cx+20;

  // 프레임 선택
  fill("#555"); textSize(13); textAlign(LEFT,CENTER);
  text("🎨  프레임", lx, 84);
  let fBox=min(cw*0.18,80), fGap=min(cw*0.04,14);
  let fTot=fBox*frameNames.length+fGap*(frameNames.length-1);
  let fSX=width/2-fTot/2;
  for (let i=0; i<frameNames.length; i++) {
    push(); let bx=fSX+i*(fBox+fGap), by=98;
    fill(0,0,0,15); noStroke(); rect(bx+3,by+3,fBox,fBox,14);
    if(selectedFrame===i){stroke(frameDark[i]);strokeWeight(3);}
    else{stroke("#eee");strokeWeight(1.5);}
    fill(frameColors[i]); rect(bx,by,fBox,fBox,14);
    if(selectedFrame===i){
      fill(frameDark[i]);noStroke();circle(bx+fBox-13,by+13,22);
      fill(255);textSize(11);textAlign(CENTER,CENTER);text("✓",bx+fBox-13,by+13);
    }
    noStroke();fill(selectedFrame===i?frameDark[i]:"#aaa");
    textAlign(CENTER,CENTER);textSize(11);
    text(frameNames[i],bx+fBox/2,by+fBox+13);
    pop();
  }

  // 필터 선택
  fill("#555"); textSize(13); textAlign(LEFT,CENTER);
  text("✨  AR 필터", lx, 206);
  let filtBox=min(cw*0.16,70), filtGap=min(cw*0.03,10);
  let filtTot=filtBox*filterEmoji.length+filtGap*(filterEmoji.length-1);
  let filtSX=width/2-filtTot/2;
  for (let i=0; i<filterEmoji.length; i++) {
    push(); let bx=filtSX+i*(filtBox+filtGap), by=220;
    fill(0,0,0,15);noStroke();rect(bx+3,by+3,filtBox,filtBox,12);
    if(selectedFilter===i){stroke("#ff4d6d");strokeWeight(3);}
    else{stroke("#eee");strokeWeight(1.5);}
    fill(selectedFilter===i?"#fff0f5":"#fff");rect(bx,by,filtBox,filtBox,12);
    if(selectedFilter===i){
      fill("#ff4d6d");noStroke();circle(bx+filtBox-12,by+12,20);
      fill(255);textSize(10);textAlign(CENTER,CENTER);text("✓",bx+filtBox-12,by+12);
    }
    noStroke();fill("#333");textAlign(CENTER,CENTER);textSize(24);
    text(filterEmoji[i],bx+filtBox/2,by+filtBox/2);
    textSize(10);fill("#aaa");
    text(filterLabel[i],bx+filtBox/2,by+filtBox+13);
    pop();
  }

  // 형식 선택
  fill("#555"); textSize(13); textAlign(LEFT,CENTER);
  text("📐  사진 형식", lx, 320);
  let fmtW=min(cw*0.2,86), fmtGap=min(cw*0.03,10);
  let fmtTot=fmtW*4+fmtGap*3;
  let fmtSX=width/2-fmtTot/2;
  let fmtIcons=["📏","⬛","🖥️","📷"];
  let fmtH=[100,80,60,100];
  for (let i=0; i<4; i++) {
    push(); let bx=fmtSX+i*(fmtW+fmtGap), by=334;
    fill(0,0,0,15);noStroke();rect(bx+3,by+3,fmtW,fmtH[i],12);
    if(selectedFormat===i){stroke("#c8b4f8");strokeWeight(3);}
    else{stroke("#eee");strokeWeight(1.5);}
    fill(selectedFormat===i?"#f3e5ff":"#fff");rect(bx,by,fmtW,fmtH[i],12);
    if(selectedFormat===i){
      fill("#c8b4f8");noStroke();circle(bx+fmtW-12,by+12,20);
      fill(255);textSize(10);textAlign(CENTER,CENTER);text("✓",bx+fmtW-12,by+12);
    }
    noStroke();fill("#333");textAlign(CENTER,CENTER);textSize(22);
    text(fmtIcons[i],bx+fmtW/2,by+fmtH[i]/2-6);
    textSize(10);fill("#888");
    text(formatNames[i],bx+fmtW/2,by+fmtH[i]-14);
    pop();
  }

  // 스티커 선택
  fill("#555"); textSize(13); textAlign(LEFT,CENTER);
  text("🌟  장식 스티커", lx, 456);
  let stkW=min(cw*0.15,62), stkGap=8;
  let stkTot=stkW*stickerNames.length+stkGap*(stickerNames.length-1);
  let stkSX=width/2-stkTot/2;
  let stkIcons=["✕","✦","💕","🌸","🎀"];
  for (let i=0; i<stickerNames.length; i++) {
    push(); let bx=stkSX+i*(stkW+stkGap), by=470;
    fill(0,0,0,15);noStroke();rect(bx+3,by+3,stkW,stkW,10);
    if(selectedSticker===i){stroke("#ffb6c1");strokeWeight(3);}
    else{stroke("#eee");strokeWeight(1.5);}
    fill(selectedSticker===i?"#fff0f5":"#fff");rect(bx,by,stkW,stkW,10);
    noStroke();fill("#333");textAlign(CENTER,CENTER);textSize(20);
    text(stkIcons[i],bx+stkW/2,by+stkW/2-4);
    textSize(9);fill("#aaa");
    text(stickerNames[i],bx+stkW/2,by+stkW-10);
    pop();
  }

  // 촬영 시작 버튼
  let btnW=min(cw-40,300), btnX=width/2-btnW/2;
  drawPinkBtn(btnX, height-86, btnW, 52, "촬영 시작  📷");

  // Back
  drawLightBtn(16, 12, 82, 32, "← Back");
  pop();
}

function drawCameraScreen() { drawCamera(); }

// ============================================================
// MOUSE + TOUCH
// ============================================================
function mousePressed() { handleButtons(); }
function touchStarted()  { handleButtons(); return false; }

function handleButtons() {
  if (currentScreen==="start") {
    let cw=min(width*0.82,480), cy=height*0.09, ch=height*0.82;
    let btnW=min(cw-48,260), btnX=width/2-btnW/2, btnY=cy+ch-68;
    if(mouseX>btnX&&mouseX<btnX+btnW&&mouseY>btnY&&mouseY<btnY+50)
      currentScreen="settings";
  }
  else if (currentScreen==="settings") {
    if(mouseX>16&&mouseX<98&&mouseY>12&&mouseY<44){currentScreen="start";return;}
    let cw=min(width*0.88,540);
    let fBox=min(cw*0.18,80),fGap=min(cw*0.04,14);
    let fSX=width/2-(fBox*4+fGap*3)/2;
    for(let i=0;i<frameNames.length;i++){
      let bx=fSX+i*(fBox+fGap);
      if(mouseX>bx&&mouseX<bx+fBox&&mouseY>98&&mouseY<98+fBox){selectedFrame=i;return;}
    }
    let filtBox=min(cw*0.16,70),filtGap=min(cw*0.03,10);
    let filtSX=width/2-(filtBox*5+filtGap*4)/2;
    for(let i=0;i<filterEmoji.length;i++){
      let bx=filtSX+i*(filtBox+filtGap);
      if(mouseX>bx&&mouseX<bx+filtBox&&mouseY>220&&mouseY<220+filtBox){selectedFilter=i;return;}
    }
    let fmtW=min(cw*0.2,86),fmtGap=min(cw*0.03,10);
    let fmtSX=width/2-(fmtW*4+fmtGap*3)/2;
    let fmtH=[100,80,60,100];
    for(let i=0;i<4;i++){
      let bx=fmtSX+i*(fmtW+fmtGap);
      if(mouseX>bx&&mouseX<bx+fmtW&&mouseY>334&&mouseY<334+fmtH[i]){selectedFormat=i;return;}
    }
    let stkW=min(cw*0.15,62),stkGap=8;
    let stkSX=width/2-(stkW*5+stkGap*4)/2;
    for(let i=0;i<stickerNames.length;i++){
      let bx=stkSX+i*(stkW+stkGap);
      if(mouseX>bx&&mouseX<bx+stkW&&mouseY>470&&mouseY<470+stkW){selectedSticker=i;return;}
    }
    let btnW=min(cw-40,300),btnX=width/2-btnW/2;
    if(mouseX>btnX&&mouseX<btnX+btnW&&mouseY>height-86&&mouseY<height-34)
      currentScreen="camera";
  }
  else if(currentScreen==="camera")  { handleCameraButtons(); }
  else if(currentScreen==="select")  { handleSelectButtons(); }
  else if(currentScreen==="result")  { handleResultButtons(); }
  else if(currentScreen==="saved")   { handleSavedButtons(); }
  else if(currentScreen==="ending")  { handleEndingButtons(); }
}

function keyPressed() {
  if(key===' '){
    if(currentScreen==="start")      currentScreen="settings";
    else if(currentScreen==="camera") takeSinglePhoto();
  }
  if((key==='s'||key==='S')&&currentScreen==="result") saveResultCanvas();
  if((key==='r'||key==='R')&&(currentScreen==="result"||currentScreen==="saved")){
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];currentScreen="camera";
  }
  return false;
}

function windowResized() { resizeCanvas(windowWidth,windowHeight); }
