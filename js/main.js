// ============================================================
// main.js — 담당: 틀레우바이 아야으름
// Full English UI + Layout screen + redesigned flow
// ============================================================

let currentScreen   = "start";
let selectedFrame   = 0;
let selectedFilter  = 0;
let selectedFormat  = 0;
let selectedLayout  = 0;

// 10 Frame colors — pastel palette
let frameNames  = ["Pink","Mint","Lemon","Lavender","Peach","Sky","Lilac","Rose","Sage","Cream"];
let frameColors = ["#ffe4ec","#d6f5f0","#fffce0","#f3e8ff","#ffe8d6","#dceeff","#ecdeff","#ffd6e4","#e4f5e4","#fffdf0"];
let frameDark   = ["#f8b8c8","#96d9d0","#f5d97a","#d8aeed","#f5b89a","#99c9f5","#c49af5","#f59ab0","#a8d8a8","#e8d8a8"];
let frameLight  = ["#fff0f5","#e8fffe","#fffde7","#f3e5f5","#fff3ee","#e8f4ff","#f3eaff","#ffe8ef","#edf7ed","#fffdf5"];

// Filter data
let filterEmoji = ["🚫","💕","👓","🐸","🥑"];
let filterLabel = ["None","Love","Glasses","Frog","Avocado"];

// Layout definitions
let layouts = [
  {name:"4-Cut Strip",  cols:1, rows:4, count:4},
  {name:"2×2 Grid",     cols:2, rows:2, count:4},
  {name:"Wide Strip",   cols:4, rows:1, count:4},
  {name:"3-Cut",        cols:1, rows:3, count:3},
  {name:"6-Cut Grid",   cols:2, rows:3, count:6},
  {name:"Polaroid",     cols:1, rows:1, count:1},
];

// ============================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  setupCamera();
}

function draw() {
  if      (currentScreen === "start")    drawStartScreen();
  else if (currentScreen === "layout")   drawLayoutScreen();
  else if (currentScreen === "settings") drawSettingsScreen();
  else if (currentScreen === "camera")   drawCameraScreen();
  else if (currentScreen === "select")   drawSelectScreen();
  else if (currentScreen === "result")   drawResultScreen();
  else if (currentScreen === "saved")    drawSavedScreen();
  else if (currentScreen === "ending")   drawEndingScreen();
}

// ============================================================
// BACKGROUND — smooth ombre gradient
// ============================================================
// Cache nền để tránh vẽ lại mỗi frame
let _bgBuffer = null;
let _bgLastFrame = -999;

function drawBG() {
  // Chỉ vẽ lại nền mỗi 6 frame — mượt mà hơn nhiều
  if (!_bgBuffer || frameCount - _bgLastFrame >= 6) {
    if (!_bgBuffer) _bgBuffer = createGraphics(width, height);
    _bgLastFrame = frameCount;

    let t = (sin(frameCount * 0.003) + 1) / 2;
    let colTop = lerpColor(color(255,255,255), color(210,235,255), t);
    let colMid = lerpColor(color(220,240,255), color(255,255,255), t);
    let colBot = lerpColor(color(240,248,255), color(200,225,255), t);
    _bgBuffer.noStroke();
    let strips = 30; // 60→30: đủ mượt, nhanh gấp đôi
    for (let i = 0; i < strips; i++) {
      let ty = map(i, 0, strips, 0, 1);
      let col = ty < 0.5
        ? lerpColor(colTop, colMid, ty*2)
        : lerpColor(colMid, colBot, (ty-0.5)*2);
      _bgBuffer.fill(col);
      _bgBuffer.rect(0, i*height/strips, width, height/strips+1);
    }
  }
  image(_bgBuffer, 0, 0);

  // Dust particles — giảm xuống 8, tính mỗi frame nhưng nhẹ hơn
  push(); noStroke();
  let dust = ["✦","◦","·","✧"];
  let dc   = [[180,210,255],[210,230,255],[255,255,255],[150,200,255]];
  for (let i = 0; i < 8; i++) {
    let x   = (sin(frameCount*0.004+i*137.5)*0.44+0.5)*width;
    let y   = (cos(frameCount*0.003+i*97.3)*0.44+0.5)*height;
    let sz  = 5+sin(frameCount*0.01+i)*1.5;
    let alp = map(sin(frameCount*0.015+i*0.7),-1,1,10,45);
    let c   = dc[i%dc.length];
    fill(c[0],c[1],c[2],alp); textSize(sz); textAlign(CENTER,CENTER);
    text(dust[i%dust.length],x,y);
  }
  pop();
}

// ============================================================
// UI COMPONENTS
// ============================================================
function drawCard(x,y,w,h,r=20,alpha=215) {
  push(); noStroke();
  // Shadow rất mờ, không đường rõ
  fill(160, 170, 210, 14); rect(x+3, y+4, w, h, r);
  fill(255, 255, 255, alpha); rect(x, y, w, h, r);
  noFill(); stroke(210, 220, 240, 70); strokeWeight(1);
  rect(x, y, w, h, r);
  pop();
}

function drawPinkBtn(x,y,w,h,label) {
  push(); noStroke();
  fill(220, 90, 130, 20); rect(x+2, y+3, w, h, h/2);
  fill(245, 80, 120); rect(x, y, w, h, h/2);
  fill(255, 130, 160, 70); rect(x+2, y+2, w-4, h*0.45, h/2, h/2, 0, 0);
  noStroke(); fill(255);
  textSize(min(h*0.38, 18)); textAlign(CENTER,CENTER);
  text(label, x+w/2, y+h/2);
  pop();
}

function drawLightBtn(x,y,w,h,label) {
  push(); noStroke();
  fill(160, 140, 200, 15); rect(x+2, y+3, w, h, h/2);
  fill(248, 244, 255); rect(x, y, w, h, h/2);
  noFill(); stroke(190, 160, 230, 80); strokeWeight(1);
  rect(x, y, w, h, h/2);
  noStroke(); fill(130, 85, 175);
  textSize(min(h*0.36, 16)); textAlign(CENTER,CENTER);
  text(label, x+w/2, y+h/2);
  pop();
}

// ============================================================
// SCREEN 1: START
// ============================================================
function drawStartScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke();

  let cw = min(width*0.82, 460);
  let cx = width/2 - cw/2;
  let cy = height*0.08;

  // Header banner
  drawCard(cx, cy, cw, 72, 20, 220);
  push(); fill("#ffb6c1"); noStroke(); rect(cx,cy,cw,72,20,20,0,0); pop();
  fill(255); textSize(min(cw*0.1,36));
  text("📸  4CUT BOOTH", width/2, cy+28);
  fill(255,255,255,200); textSize(11);
  text("Insta-style Web Photo Booth", width/2, cy+56);

  // Team card
  let cardX = cx+20, cardW = cw-40;
  let y1 = cy+84;
  drawCard(cardX, y1, cardW, 58, 14, 170);
  fill("#c8b4f8"); textSize(11); textAlign(CENTER,CENTER);
  text("💝  TEAM 13", width/2, y1+16);
  fill("#444"); textSize(13);
  text("틀레우바이 아야으름  ·  응웬 바오 담  ·  마이티투짱", width/2, y1+38);

  // How to use card
  let y2 = y1+70;
  drawCard(cardX, y2, cardW, 108, 14, 170);
  fill("#ff4d6d"); textSize(11);
  text("📖  HOW TO USE", width/2, y2+16);
  fill("#555"); textSize(12);
  text("① Choose your layout", width/2, y2+34);
  text("② Pick AR filter & color tone", width/2, y2+52);
  text("③ Strike a pose! Take up to 8 shots", width/2, y2+70);
  text("④ Pick your best 4, decorate & save 🎉", width/2, y2+88);

  // START button
  let btnW = min(cardW, 240);
  let btnX = width/2 - btnW/2;
  let btnY = y2 + 122;
  drawPinkBtn(btnX, btnY, btnW, 50, "▶  START");

  fill("#c8b4f8"); textSize(11);
  text("Press Space or tap to start", width/2, btnY+66);
  pop();
}

// ============================================================
// SCREEN 2: LAYOUT SELECTION
// ============================================================
function drawLayoutScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let cw = min(width*0.92, 600);
  let cx = width/2 - cw/2;
  drawCard(cx, 8, cw, height-16, 24);

  // Header
  push(); fill("#ffb6c1"); noStroke(); rect(cx,8,cw,58,24,24,0,0); pop();
  fill(255); textSize(min(cw*0.072,24));
  text("Choose Your Layout", width/2, 37);

  // Layout grid — 2 columns x 3 rows
  let cols = 3, rows = 2;
  let padX = 20, padY = 78;
  let gapX = 12, gapY = 16;
  let cardW = (cw - padX*2 - gapX*(cols-1)) / cols;
  let cardH = (height - 16 - padY - gapY*(rows-1) - 80) / rows;

  for (let i = 0; i < layouts.length; i++) {
    let col = i % cols, row = floor(i / cols);
    let lx  = cx + padX + col*(cardW+gapX);
    let ly  = padY + row*(cardH+gapY);
    let L   = layouts[i];
    let isSel = selectedLayout === i;

    push();
    if (isSel) {
      fill("#ffe0f0"); stroke("#ff4d6d"); strokeWeight(3);
    } else {
      fill(255,255,255,180); stroke("#eee"); strokeWeight(1.5);
    }
    rect(lx, ly, cardW, cardH, 12);

    // Draw mini layout preview
    let preW = cardW*0.55, preH = cardH*0.58;
    let preX = lx + cardW/2 - preW/2;
    let preY = ly + 10;
    let gW = preW/L.cols, gH = preH/L.rows;

    // Frame background
    fill(isSel ? frameColors[selectedFrame] : "#f5f5f5");
    noStroke(); rect(preX, preY, preW, preH, 4);

    // Photo cells
    for (let r = 0; r < L.rows; r++) {
      for (let c = 0; c < L.cols; c++) {
        fill(200,180,220,120); noStroke();
        rect(preX+c*gW+2, preY+r*gH+2, gW-4, gH-4, 3);
        // Little person silhouette
        fill(180,160,200,150); noStroke();
        let fx = preX+c*gW+gW/2, fy = preY+r*gH+gH*0.38;
        circle(fx, fy, gH*0.28);
        fill(180,160,200,120);
        rect(fx-gH*0.15, fy+gH*0.15, gH*0.3, gH*0.32, 2);
      }
    }

    // Check mark
    if (isSel) {
      fill("#ff4d6d"); noStroke(); circle(lx+cardW-14, ly+14, 22);
      fill(255); textSize(11); text("✓", lx+cardW-14, ly+14);
    }

    // Label
    noStroke(); fill(isSel ? "#ff4d6d" : "#555");
    textSize(min(cardW*0.11, 13));
    text(L.name, lx+cardW/2, ly+cardH-26);
    fill("#aaa"); textSize(10);
    text(L.count+" photos", lx+cardW/2, ly+cardH-12);
    pop();
  }

  // NEXT button
  let btnW = min(cw-40, 260), btnX = width/2-btnW/2;
  drawPinkBtn(btnX, height-72, btnW, 48, "Next  →");
  drawLightBtn(16, 12, 82, 32, "← Back");
  pop();
}

// ============================================================
// SCREEN 3: SETTINGS — AR filter + Color filter only
// ============================================================
function drawSettingsScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke();

  let cw = min(width*0.88, 520);
  let cx = width/2 - cw/2;
  drawCard(cx, 8, cw, height-16, 24);

  push(); fill("#ffb6c1"); noStroke(); rect(cx,8,cw,58,24,24,0,0); pop();
  fill(255); textSize(min(cw*0.075,24)); textAlign(CENTER,CENTER);
  text("⚙️  Settings", width/2, 37);

  let lx = cx+20;

  // AR Filter selection
  fill("#444"); textSize(14); textAlign(LEFT,CENTER);
  text("✨  AR Filter", lx, 90);
  let filtBox=min(cw*0.14,68), filtGap=min(cw*0.025,9);
  let filtTot=filtBox*filterEmoji.length+filtGap*(filterEmoji.length-1);
  let filtSX=width/2-filtTot/2;
  for (let i=0; i<filterEmoji.length; i++) {
    push(); let bx=filtSX+i*(filtBox+filtGap), by=106;
    fill(0,0,0,15);noStroke();rect(bx+3,by+3,filtBox,filtBox,12);
    if(selectedFilter===i){stroke("#ff4d6d");strokeWeight(3);}
    else{stroke("#eee");strokeWeight(1.5);}
    fill(selectedFilter===i?"#fff0f5":255);rect(bx,by,filtBox,filtBox,12);
    if(selectedFilter===i){
      fill("#ff4d6d");noStroke();circle(bx+filtBox-11,by+11,20);
      fill(255);textSize(9);textAlign(CENTER,CENTER);text("✓",bx+filtBox-11,by+11);
    }
    noStroke();fill("#333");textAlign(CENTER,CENTER);
    textSize(i===0?20:22);
    text(filterEmoji[i],bx+filtBox/2,by+filtBox/2-4);
    textSize(9);fill(selectedFilter===i?"#ff4d6d":"#aaa");
    text(filterLabel[i],bx+filtBox/2,by+filtBox+11);
    pop();
  }

  // Color filter selection (phần của Tamy — thêm None option)
  fill("#444"); textSize(14); textAlign(LEFT,CENTER);
  text("🎞  Color Tone", lx, height*0.5);

  let toneNames  = ["None","Warm","Cool","B&W","Vintage","Dreamy"];
  let toneEmoji  = ["🚫","🌅","❄️","🖤","📷","🌸"];
  let toneColors = [
    [240,240,240],
    [255,200,100],[100,160,255],[180,180,180],
    [180,140,80],[255,180,220]
  ];
  let tBox=min(cw*0.135,65), tGap=min(cw*0.022,8);
  let tTot=tBox*toneNames.length+tGap*(toneNames.length-1);
  let tSX=width/2-tTot/2;

  for (let i=0; i<toneNames.length; i++) {
    push(); let bx=tSX+i*(tBox+tGap), by=height*0.5+16;
    fill(0,0,0,12);noStroke();rect(bx+2,by+2,tBox,tBox,10);
    if(selectedFormat===i){stroke("#ff4d6d");strokeWeight(3);}
    else{stroke("#eee");strokeWeight(1.5);}
    // Color swatch background
    let tc=toneColors[i];
    fill(tc[0],tc[1],tc[2], i===0?80:100);rect(bx,by,tBox,tBox,10);
    if(selectedFormat===i){
      fill("#ff4d6d");noStroke();circle(bx+tBox-11,by+11,20);
      fill(255);textSize(9);textAlign(CENTER,CENTER);text("✓",bx+tBox-11,by+11);
    }
    noStroke();fill(i===0?"#aaa":"#333");textAlign(CENTER,CENTER);
    textSize(i===0?18:20);
    text(toneEmoji[i],bx+tBox/2,by+tBox/2-4);
    textSize(9);fill(selectedFormat===i?"#ff4d6d":"#666");
    text(toneNames[i],bx+tBox/2,by+tBox+11);
    pop();
  }

  let btnW=min(cw-40,280), btnX=width/2-btnW/2;
  drawPinkBtn(btnX, height-82, btnW, 50, "Start Shooting  📷");
  drawLightBtn(16,12,82,32,"← Back");
  pop();
}

function drawCameraScreen() { drawCamera(); }

// ============================================================
// MOUSE + TOUCH
// ============================================================
function mousePressed() { handleButtons(); }
function touchStarted()  { handleButtons(); return false; }

function handleButtons() {
  if (currentScreen === "start") {
    // Bấm bất kỳ đâu trên màn start → chuyển layout
    currentScreen = "layout";
    return;
  }

  else if (currentScreen==="layout") {
    if(mouseX>16&&mouseX<98&&mouseY>12&&mouseY<44){currentScreen="start";return;}

    let cw=min(width*0.92,600), cx=width/2-cw/2;
    let cols=3,rows=2,padX=20,padY=78,gapX=12,gapY=16;
    let cardW=(cw-padX*2-gapX*(cols-1))/cols;
    let cardH=(height-16-padY-gapY*(rows-1)-80)/rows;
    for(let i=0;i<layouts.length;i++){
      let col=i%cols, row=floor(i/cols);
      let lx=cx+padX+col*(cardW+gapX), ly=padY+row*(cardH+gapY);
      if(mouseX>lx&&mouseX<lx+cardW&&mouseY>ly&&mouseY<ly+cardH){
        selectedLayout=i; return;
      }
    }
    let btnW=min(cw-40,260),btnX=width/2-btnW/2;
    if(mouseX>btnX&&mouseX<btnX+btnW&&mouseY>height-72&&mouseY<height-24)
      currentScreen="settings";
  }

  else if (currentScreen==="settings") {
    if(mouseX>16&&mouseX<98&&mouseY>12&&mouseY<44){currentScreen="layout";return;}

    let cw=min(width*0.88,520);
    let filtBox=min(cw*0.14,68),filtGap=min(cw*0.025,9);
    let filtSX=width/2-(filtBox*filterEmoji.length+filtGap*(filterEmoji.length-1))/2;
    for(let i=0;i<filterEmoji.length;i++){
      let bx=filtSX+i*(filtBox+filtGap);
      if(mouseX>bx&&mouseX<bx+filtBox&&mouseY>106&&mouseY<106+filtBox){selectedFilter=i;return;}
    }
    let tBox=min(cw*0.135,65),tGap=min(cw*0.022,8);
    let tSX=width/2-(tBox*6+tGap*5)/2;
    for(let i=0;i<6;i++){
      let bx=tSX+i*(tBox+tGap), by=height*0.5+16;
      if(mouseX>bx&&mouseX<bx+tBox&&mouseY>by&&mouseY<by+tBox){selectedFormat=i;return;}
    }
    let btnW=min(cw-40,280),btnX=width/2-btnW/2;
    if(mouseX>btnX&&mouseX<btnX+btnW&&mouseY>height-82&&mouseY<height-32)
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
    if(currentScreen==="start")       currentScreen="layout";
    else if(currentScreen==="camera") takeSinglePhoto();
  }
  if((key==='s'||key==='S')&&currentScreen==="result") saveResultCanvas();
  if((key==='r'||key==='R')){
    if(currentScreen==="result"||currentScreen==="saved"){
      allPhotos=[];selectedPhotos=[];capturedPhotos=[];currentScreen="camera";
    }
  }
  return false;
}

function windowResized() { resizeCanvas(windowWidth,windowHeight); _bgBuffer=null; }
