// ============================================================
// main.js — 담당: 틀레우바이 아야으름
// ============================================================

let currentScreen  = "start";
let selectedFrame  = 0;
let selectedFilter = 0;
let selectedFormat = 0; // 0=길게 1=정사각 2=넓게 3=폴라로이드
let selectedSticker = 0; // 스티커/장식 선택

let frameNames  = ["Pink", "Mint", "Lemon", "Lavender"];
let frameColors = ["#ffb6c1", "#b2f0e8", "#fff59d", "#e1bee7"];
let frameDark   = ["#f48fb1", "#80cbc4", "#f9a825", "#ce93d8"];
let frameLight  = ["#fff0f5", "#e8fffe", "#fffde7", "#f3e5f5"];

let filterEmoji = ["🎀", "💕", "🐱", "👓", "🐸"];
let filterLabel = ["Ribbon", "Love", "Cat", "Glasses", "Frog"];

let formatNames  = ["길게", "정사각", "넓게", "폴라로이드"];
let formatEmoji  = ["📏", "⬛", "🖥️", "📷"];
let formatRatios = [
  { w: 1,   h: 1.4  }, // 길게
  { w: 1,   h: 1    }, // 정사각
  { w: 1.6, h: 1    }, // 넓게
  { w: 1,   h: 1.3  }, // 폴라로이드 (아래 여백 더 있음)
];

let stickerNames = ["없음", "별✨", "하트💕", "꽃🌸", "리본🎀"];

// QR 코드 관련
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
  el.id  = "qrDiv";
  el.style.display = "none";
  document.body.appendChild(el);

  new QRCode(el, {
    text:   GOOGLE_DRIVE_URL,
    width:  160,
    height: 160,
    colorDark:  "#333333",
    colorLight: "#ffffff",
  });

  // QRCode рисует canvas внутри div — берём его
  setTimeout(() => {
    let canvas = el.querySelector("canvas");
    if (canvas) qrCanvas = canvas;
  }, 500);
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
// 배경 파티클
// ============================================================
function drawBG() {
  // 그라디언트 배경
  push(); noStroke();
  for (let i = 0; i <= height; i++) {
    let t = i / height;
    let r = lerp(255, 240, t);
    let g = lerp(240, 245, t);
    let b = lerp(250, 255, t);
    stroke(r, g, b);
    line(0, i, width, i);
  }
  pop();

  // 떠다니는 파티클
  push(); noStroke();
  let shapes = ["★", "♡", "✦", "✿", "◌"];
  let cols   = [
    "#ffb6c155","#b2f0e855","#fff59d55",
    "#e1bee755","#ffd6e755"
  ];
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
// 공통 카드 그리기
// ============================================================
function drawCard(x, y, w, h, r=20, alpha=215) {
  push(); noStroke();
  // 그림자
  fill(200, 180, 210, 40);
  rect(x+4, y+4, w, h, r);
  // 카드
  fill(255, 255, 255, alpha);
  rect(x, y, w, h, r);
  pop();
}

// ============================================================
// 공통 버튼
// ============================================================
function drawBtn(x, y, w, h, label, color="#ff4d6d", textCol=255) {
  push(); noStroke();
  // 그림자
  fill(red(color(color)), green(color(color)), blue(color(color)), 60);
  rect(x+3, y+3, w, h, h/2);
  // 버튼
  fill(color);
  rect(x, y, w, h, h/2);
  fill(textCol);
  textSize(min(w*0.1, 20));
  textAlign(CENTER, CENTER);
  text(label, x+w/2, y+h/2);
  pop();
}

// ============================================================
// START 화면
// ============================================================
function drawStartScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke();

  // 메인 카드
  let cw = min(width*0.82, 480);
  let ch = height*0.82;
  let cx = width/2 - cw/2;
  let cy = height*0.09;
  drawCard(cx, cy, cw, ch, 28);

  // 상단 그라디언트 배너
  push(); noStroke();
  for (let i=0; i<80; i++) {
    let t = i/80;
    fill(lerpColor(color("#ffb6c1"), color("#c8b4f8"), t), 180);
    rect(cx, cy+i, cw, 1, i===0?28:0, i===0?28:0, 0, 0);
  }
  pop();

  // 제목
  push();
  fill(255);
  textSize(min(cw*0.13, 52));
  text("📸", width/2, cy+28);
  textSize(min(cw*0.1, 38));
  text("4CUT BOOTH", width/2, cy+58);
  fill(255, 255, 255, 180); textSize(12);
  text("✨  인생네컷 스타일 웹 포토부스  ✨", width/2, cy+80);
  pop();

  // 제작자 카드
  let cardX = cx+24;
  let cardW = cw-48;
  drawCard(cardX, cy+100, cardW, 64, 16, 160);
  fill("#c8b4f8"); textSize(11); textAlign(CENTER,CENTER);
  text("💝  TEAM 13", width/2, cy+118);
  fill("#555"); textSize(13);
  text("아야울름  ·  응웬 바오 담  ·  마이티투짱", width/2, cy+140);

  // 사용법 카드
  drawCard(cardX, cy+178, cardW, 120, 16, 160);
  fill("#ff4d6d"); textSize(11);
  text("📖  HOW TO USE", width/2, cy+196);
  fill("#555"); textSize(12);
  text("① 프레임 · 필터 · 형식 선택",    width/2, cy+216);
  text("② 최대 8장 자유롭게 촬영",        width/2, cy+234);
  text("③ 마음에 드는 4장 선택",          width/2, cy+252);
  text("④ 장식 추가 후 저장 & 공유! 🎉", width/2, cy+272);

  // 포맷 미리보기
  let preY = cy+316;
  fill("#888"); textSize(11);
  text("형식 선택 가능", width/2, preY);
  let fmts = ["│", "■", "─", "⬜"];
  let fcols = ["#ffb6c1","#b2f0e8","#fff59d","#e1bee7"];
  for (let i=0;i<4;i++) {
    push();
    fill(fcols[i]); noStroke();
    rect(cx+40+i*58, preY+12, 44, 44, 8);
    fill("#555"); textSize(20); textAlign(CENTER,CENTER);
    text(fmts[i], cx+62+i*58, preY+34);
    fill("#888"); textSize(9);
    text(formatNames[i], cx+62+i*58, preY+58);
    pop();
  }

  // START 버튼
  let btnW = min(cw-48, 260);
  let btnX = width/2 - btnW/2;
  let btnY = cy+ch-70;
  push(); noStroke();
  fill(200, 100, 180, 80); rect(btnX+4, btnY+4, btnW, 52, 26);
  // 그라디언트 버튼
  for (let i=0;i<52;i++){
    let t = i/52;
    fill(lerpColor(color("#ff6b9d"), color("#c8b4f8"), t));
    rect(btnX, btnY+i, btnW, 1, i===0?26:0, i===0?26:0, i===51?26:0, i===51?26:0);
  }
  fill(255); textSize(22);
  text("▶  START", width/2, btnY+26);
  pop();

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

  // 헤더
  push();
  for(let i=0;i<60;i++){
    let t=i/60;
    fill(lerpColor(color("#ffb6c1"),color("#c8b4f8"),t),160);
    rect(cx,8+i,cw,1,i===0?24:0,i===0?24:0,0,0);
  }
  fill(255); textSize(min(cw*0.08,26)); textAlign(CENTER,CENTER);
  text("⚙️  Settings", width/2, 38);
  pop();

  let lx = cx+20;

  // 프레임 선택
  fill("#555"); textSize(13); textAlign(LEFT,CENTER);
  text("🎨  프레임", lx, 86);
  let fBox=min(cw*0.18,80), fGap=min(cw*0.04,14);
  let fTot=fBox*frameNames.length+fGap*(frameNames.length-1);
  let fSX=width/2-fTot/2;
  for(let i=0;i<frameNames.length;i++){
    push(); let bx=fSX+i*(fBox+fGap), by=100;
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
  text("✨  AR 필터", lx, 208);
  let filtBox=min(cw*0.16,70), filtGap=min(cw*0.03,10);
  let filtTot=filtBox*filterEmoji.length+filtGap*(filterEmoji.length-1);
  let filtSX=width/2-filtTot/2;
  for(let i=0;i<filterEmoji.length;i++){
    push(); let bx=filtSX+i*(filtBox+filtGap), by=222;
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
  text("📐  사진 형식", lx, 322);
  let fmtW=min(cw*0.2,86), fmtGap=min(cw*0.03,10);
  let fmtTot=fmtW*4+fmtGap*3;
  let fmtSX=width/2-fmtTot/2;
  let fmtIcons=["📏","⬛","🖥️","📷"];
  for(let i=0;i<4;i++){
    push(); let bx=fmtSX+i*(fmtW+fmtGap), by=336;
    let fh = [100,80,60,100][i];
    fill(0,0,0,15);noStroke();rect(bx+3,by+3,fmtW,fh,12);
    if(selectedFormat===i){stroke("#c8b4f8");strokeWeight(3);}
    else{stroke("#eee");strokeWeight(1.5);}
    fill(selectedFormat===i?"#f3e5ff":"#fff");rect(bx,by,fmtW,fh,12);
    if(selectedFormat===i){
      fill("#c8b4f8");noStroke();circle(bx+fmtW-12,by+12,20);
      fill(255);textSize(10);textAlign(CENTER,CENTER);text("✓",bx+fmtW-12,by+12);
    }
    noStroke();fill("#333");textAlign(CENTER,CENTER);textSize(22);
    text(fmtIcons[i],bx+fmtW/2,by+fh/2-6);
    textSize(10);fill("#888");
    text(formatNames[i],bx+fmtW/2,by+fh-14);
    pop();
  }

  // 스티커 선택
  fill("#555"); textSize(13); textAlign(LEFT,CENTER);
  text("🌟  장식 스티커", lx, 458);
  let stkW=min(cw*0.15,64), stkGap=8;
  let stkTot=stkW*stickerNames.length+stkGap*(stickerNames.length-1);
  let stkSX=width/2-stkTot/2;
  let stkIcons=["✕","✦✦","💕","🌸","🎀"];
  for(let i=0;i<stickerNames.length;i++){
    push(); let bx=stkSX+i*(stkW+stkGap), by=472;
    fill(0,0,0,15);noStroke();rect(bx+3,by+3,stkW,stkW,10);
    if(selectedSticker===i){stroke("#ffb6c1");strokeWeight(3);}
    else{stroke("#eee");strokeWeight(1.5);}
    fill(selectedSticker===i?"#fff0f5":"#fff");rect(bx,by,stkW,stkW,10);
    noStroke();fill("#333");textAlign(CENTER,CENTER);textSize(18);
    text(stkIcons[i],bx+stkW/2,by+stkW/2-4);
    textSize(9);fill("#aaa");
    text(stickerNames[i],bx+stkW/2,by+stkW-10);
    pop();
  }

  // 촬영 시작 버튼
  let btnW=min(cw-40,300), btnX=width/2-btnW/2;
  push(); noStroke();
  fill(200,100,180,70); rect(btnX+4,height-82,btnW,54,27);
  for(let i=0;i<54;i++){
    let t=i/54;
    fill(lerpColor(color("#ff6b9d"),color("#c8b4f8"),t));
    rect(btnX,height-82+i,btnW,1,i===0?27:0,i===0?27:0,i===53?27:0,i===53?27:0);
  }
  fill(255);textSize(20);textAlign(CENTER,CENTER);
  text("촬영 시작  📷",width/2,height-55);
  pop();

  // Back
  push();
  fill("#f3e5ff");noStroke();rect(16,12,82,34,17);
  fill("#c8b4f8");textSize(13);textAlign(CENTER,CENTER);
  text("← Back",57,29);
  pop();

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
    let bw=min(width*0.5,260),bx=width/2-bw/2;
    let cw=min(width*0.82,480),cy=height*0.09,ch=height*0.82;
    let btnY=cy+ch-70;
    if(mouseX>bx&&mouseX<bx+bw&&mouseY>btnY&&mouseY<btnY+52)
      currentScreen="settings";
  }
  else if (currentScreen==="settings") {
    if(mouseX>16&&mouseX<98&&mouseY>12&&mouseY<46){currentScreen="start";return;}

    let cw=min(width*0.88,540),cx=width/2-cw/2;
    // 프레임
    let fBox=min(cw*0.18,80),fGap=min(cw*0.04,14);
    let fSX=width/2-(fBox*4+fGap*3)/2;
    for(let i=0;i<frameNames.length;i++){
      let bx=fSX+i*(fBox+fGap);
      if(mouseX>bx&&mouseX<bx+fBox&&mouseY>100&&mouseY<100+fBox){selectedFrame=i;return;}
    }
    // 필터
    let filtBox=min(cw*0.16,70),filtGap=min(cw*0.03,10);
    let filtSX=width/2-(filtBox*5+filtGap*4)/2;
    for(let i=0;i<filterEmoji.length;i++){
      let bx=filtSX+i*(filtBox+filtGap);
      if(mouseX>bx&&mouseX<bx+filtBox&&mouseY>222&&mouseY<222+filtBox){selectedFilter=i;return;}
    }
    // 형식
    let fmtW=min(cw*0.2,86),fmtGap=min(cw*0.03,10);
    let fmtSX=width/2-(fmtW*4+fmtGap*3)/2;
    let fmtH=[100,80,60,100];
    for(let i=0;i<4;i++){
      let bx=fmtSX+i*(fmtW+fmtGap);
      if(mouseX>bx&&mouseX<bx+fmtW&&mouseY>336&&mouseY<336+fmtH[i]){selectedFormat=i;return;}
    }
    // 스티커
    let stkW=min(cw*0.15,64),stkGap=8;
    let stkSX=width/2-(stkW*5+stkGap*4)/2;
    for(let i=0;i<stickerNames.length;i++){
      let bx=stkSX+i*(stkW+stkGap);
      if(mouseX>bx&&mouseX<bx+stkW&&mouseY>472&&mouseY<472+stkW){selectedSticker=i;return;}
    }
    // 촬영 시작
    let btnW=min(cw-40,300),btnX=width/2-btnW/2;
    if(mouseX>btnX&&mouseX<btnX+btnW&&mouseY>height-82&&mouseY<height-28)
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
    if(currentScreen==="start")   currentScreen="settings";
    else if(currentScreen==="camera") takeSinglePhoto();
  }
  if((key==='s'||key==='S')&&currentScreen==="result") saveResultCanvas();
  if((key==='r'||key==='R')&&(currentScreen==="result"||currentScreen==="saved")){
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];currentScreen="camera";
  }
  return false;
}

function windowResized() { resizeCanvas(windowWidth,windowHeight); }
