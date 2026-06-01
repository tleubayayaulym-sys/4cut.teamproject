// ============================================================
// main.js — 담당: 틀레우바이 아야으름
// ============================================================

let currentScreen   = "start";
let selectedFrame   = 0;
let selectedFilter  = 0;
let selectedFormat  = 0;
let selectedSticker = 0;

// Frame data (배열 사용)
let frameNames  = ["Pink", "Mint", "Lemon", "Lavender"];
let frameColors = ["#ffb6c1", "#b2f0e8", "#fff59d", "#e1bee7"];
let frameDark   = ["#f48fb1", "#80cbc4", "#f9a825", "#ce93d8"];
let frameLight  = ["#fff0f5", "#e8fffe", "#fffde7", "#f3e5f5"];

// Filter data (배열 사용)
let filterEmoji = ["🎀", "💕", "🐱", "👓", "🐸"];
let filterLabel = ["Ribbon", "Love", "Cat", "Glasses", "Frog"];

// Format data (배열 사용)
let formatNames  = ["길게", "정사각", "넓게", "폴라로이드"];
let stickerNames = ["없음", "Girlypop🎀", "Love💕", "Space🪐", "Food🍦", "Vintage✦"];

// ============================================================
// setup() + draw()
// ============================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  setupCamera();
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
// 배경 — pastel blob + dust particles
// ============================================================
function drawBG() {
  // Gradient ombre mượt: dùng for loop + lerpColor (đã học)
  // Màu thay đổi chậm theo frameCount — tạo hiệu ứng sống động
  let t = (sin(frameCount * 0.003) + 1) / 2; // 0→1 dao động chậm

  // 3 màu pastel luân phiên nhau
  let colTop    = lerpColor(color(255,182,193), color(225,190,231), t);
  let colMid    = lerpColor(color(255,240,220), color(178,240,232), t);
  let colBot    = lerpColor(color(225,245,255), color(255,249,196), t);

  // Vẽ gradient bằng for loop — dải ngang mỏng, lerpColor từng dải
  noStroke();
  let strips = 60; // số dải — càng nhiều càng mượt
  for (let i = 0; i < strips; i++) {
    let ty   = map(i, 0, strips, 0, 1);
    let col;
    if (ty < 0.5) {
      col = lerpColor(colTop, colMid, ty * 2);
    } else {
      col = lerpColor(colMid, colBot, (ty - 0.5) * 2);
    }
    fill(col);
    rect(0, i * height / strips, width, height / strips + 1);
  }

  // Hạt bụi lấp lánh nhẹ (for loop + sin/cos — đã học)
  push(); noStroke();
  let dustSymbols = ["✦", "✿", "◦", "·", "✧", "◌"];
  let dustCols    = [
    [255, 182, 193],
    [206, 147, 216],
    [255, 236, 179],
    [178, 240, 232],
    [255, 255, 255]
  ];
  for (let i = 0; i < 18; i++) {
    let x   = (sin(frameCount * 0.005 + i * 137.5) * 0.46 + 0.5) * width;
    let y   = (cos(frameCount * 0.004 + i * 97.3)  * 0.46 + 0.5) * height;
    let sz  = 6 + sin(frameCount * 0.012 + i) * 2.5;
    let alp = map(sin(frameCount * 0.018 + i * 0.7), -1, 1, 20, 75);
    let dc  = dustCols[i % dustCols.length];
    fill(dc[0], dc[1], dc[2], alp);
    textSize(sz); textAlign(CENTER, CENTER);
    text(dustSymbols[i % dustSymbols.length], x, y);
  }
  pop();
}

// ============================================================
// 공통 UI 컴포넌트
// ============================================================
function drawCard(x, y, w, h, r=20, alpha=215) {
  push(); noStroke();
  // Shadow
  fill(180, 150, 200, 35);
  rect(x+4, y+5, w, h, r);
  // Nền trắng mờ
  fill(255, 255, 255, alpha);
  rect(x, y, w, h, r);
  // Viền pastel mỏng
  noFill(); stroke(220, 190, 230, 80); strokeWeight(1);
  rect(x, y, w, h, r);
  pop();
}

function drawPinkBtn(x, y, w, h, label) {
  push(); noStroke();
  // Shadow mềm
  fill(220, 100, 140, 50);
  rect(x+3, y+5, w, h, h/2);
  // Nền hồng
  fill(255, 105, 135);
  rect(x, y, w, h, h/2);
  // Highlight trên
  fill(255, 150, 170, 80);
  rect(x, y, w, h*0.5, h/2, h/2, 0, 0);
  // Text
  fill(255);
  textSize(min(h*0.38, 18));
  textAlign(CENTER, CENTER);
  text(label, x+w/2, y+h/2);
  pop();
}

function drawLightBtn(x, y, w, h, label) {
  push(); noStroke();
  // Shadow
  fill(180, 150, 210, 40);
  rect(x+3, y+4, w, h, h/2);
  // Nền pastel tím
  fill(243, 229, 245);
  rect(x, y, w, h, h/2);
  // Highlight
  fill(255, 255, 255, 100);
  rect(x+2, y+2, w-4, h*0.45, h/2, h/2, 0, 0);
  // Viền
  noFill(); stroke(206, 147, 216, 120); strokeWeight(1);
  rect(x, y, w, h, h/2);
  // Text
  noStroke(); fill(150, 100, 180);
  textSize(min(h*0.36, 16));
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

  let cw = min(width*0.82, 480);
  let ch = height*0.82;
  let cx = width/2 - cw/2;
  let cy = height*0.09;
  drawCard(cx, cy, cw, ch, 28);

  // 상단 핑크 배너
  push(); fill("#ffb6c1"); noStroke();
  rect(cx, cy, cw, 88, 28, 28, 0, 0);
  pop();

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

  // 헤더
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
  let stkW=min(cw*0.13,56), stkGap=7;
  let stkTot=stkW*stickerNames.length+stkGap*(stickerNames.length-1);
  let stkSX=width/2-stkTot/2;
  let stkIcons=["✕","🎀","💕","🪐","🍦","✦"];
  for (let i=0; i<stickerNames.length; i++) {
    push(); let bx=stkSX+i*(stkW+stkGap), by=470;
    fill(0,0,0,15);noStroke();rect(bx+3,by+3,stkW,stkW,10);
    if(selectedSticker===i){stroke("#ffb6c1");strokeWeight(3);}
    else{stroke("#eee");strokeWeight(1.5);}
    fill(selectedSticker===i?"#fff0f5":"#fff");rect(bx,by,stkW,stkW,10);
    noStroke();fill("#333");textAlign(CENTER,CENTER);textSize(20);
    text(stkIcons[i],bx+stkW/2,by+stkW/2-4);
    textSize(9);fill("#aaa");
    text(stickerNames[i].replace(/[^\x00-\x7F]/g,"").trim()||stickerNames[i],
         bx+stkW/2,by+stkW-10);
    pop();
  }

  // 촬영 시작 버튼
  let btnW=min(cw-40,300), btnX=width/2-btnW/2;
  drawPinkBtn(btnX, height-86, btnW, 52, "촬영 시작  📷");

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

    // Frame
    let fBox=min(cw*0.18,80),fGap=min(cw*0.04,14);
    let fSX=width/2-(fBox*4+fGap*3)/2;
    for(let i=0;i<frameNames.length;i++){
      let bx=fSX+i*(fBox+fGap);
      if(mouseX>bx&&mouseX<bx+fBox&&mouseY>98&&mouseY<98+fBox){selectedFrame=i;return;}
    }

    // Filter
    let filtBox=min(cw*0.16,70),filtGap=min(cw*0.03,10);
    let filtSX=width/2-(filtBox*5+filtGap*4)/2;
    for(let i=0;i<filterEmoji.length;i++){
      let bx=filtSX+i*(filtBox+filtGap);
      if(mouseX>bx&&mouseX<bx+filtBox&&mouseY>220&&mouseY<220+filtBox){selectedFilter=i;return;}
    }

    // Format
    let fmtW=min(cw*0.2,86),fmtGap=min(cw*0.03,10);
    let fmtSX=width/2-(fmtW*4+fmtGap*3)/2;
    let fmtH=[100,80,60,100];
    for(let i=0;i<4;i++){
      let bx=fmtSX+i*(fmtW+fmtGap);
      if(mouseX>bx&&mouseX<bx+fmtW&&mouseY>334&&mouseY<334+fmtH[i]){selectedFormat=i;return;}
    }

    // Sticker
    let stkW=min(cw*0.13,56),stkGap=7;
    let stkSX=width/2-(stkW*stickerNames.length+stkGap*(stickerNames.length-1))/2;
    for(let i=0;i<stickerNames.length;i++){
      let bx=stkSX+i*(stkW+stkGap);
      if(mouseX>bx&&mouseX<bx+stkW&&mouseY>470&&mouseY<470+stkW){selectedSticker=i;return;}
    }

    // 촬영 시작
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
    if(currentScreen==="start")       currentScreen="settings";
    else if(currentScreen==="camera") takeSinglePhoto();
  }
  if((key==='s'||key==='S')&&currentScreen==="result") saveResultCanvas();
  if((key==='r'||key==='R')&&(currentScreen==="result"||currentScreen==="saved")){
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];currentScreen="camera";
  }
  return false;
}

function windowResized() { resizeCanvas(windowWidth,windowHeight); }
