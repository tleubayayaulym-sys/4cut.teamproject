// ============================================================
// result.js — 담당: 마이티투짱
// + Photo filter thêm bởi Tamy
// ============================================================

// --- Photo filter data (배열 사용) ---
let filterNames2  = ["Original", "Warm", "Cool", "B&W", "Vintage", "Dreamy"];
let filterEmoji2  = ["🌿", "🌅", "❄️", "🖤", "📷", "🌸"];
let selectedPhotoFilter = 0;

// Hàm áp dụng filter lên ảnh khi vẽ trên canvas
function applyPhotoFilter(px, py, pw, ph) {
  if (selectedPhotoFilter === 0) return; // Original — không làm gì
  push();
  noStroke();
  blendMode(MULTIPLY);
  if (selectedPhotoFilter === 1) {
    // Warm — overlay vàng nắng
    fill(255, 200, 100, 60);
    rect(px, py, pw, ph);
  } else if (selectedPhotoFilter === 2) {
    // Cool — overlay xanh lạnh
    fill(100, 160, 255, 55);
    rect(px, py, pw, ph);
  } else if (selectedPhotoFilter === 4) {
    // Vintage — overlay nâu ố vàng
    fill(180, 140, 80, 70);
    rect(px, py, pw, ph);
  } else if (selectedPhotoFilter === 5) {
    // Dreamy — overlay hồng pastel
    fill(255, 180, 220, 50);
    rect(px, py, pw, ph);
  }
  blendMode(BLEND);
  pop();

  if (selectedPhotoFilter === 3) {
    // B&W — overlay trắng đen (dùng SCREEN blend)
    push();
    noStroke();
    // Tạo hiệu ứng desaturate bằng lớp trắng bán trong suốt + multiply
    blendMode(MULTIPLY);
    fill(200, 200, 200, 180);
    rect(px, py, pw, ph);
    blendMode(BLEND);
    pop();
  }

  // Vintage thêm grain nhẹ
  if (selectedPhotoFilter === 4) {
    push();
    for (let g = 0; g < 80; g++) {
      let gx = px + random(pw);
      let gy = py + random(ph);
      let ga = random(20, 50);
      stroke(200, 180, 120, ga);
      strokeWeight(0.5);
      point(gx, gy);
    }
    pop();
  }
}

// Hàm áp dụng filter khi lưu (graphics buffer)
function applyPhotoFilterSave(g, px, py, pw, ph) {
  if (selectedPhotoFilter === 0) return;
  g.push();
  g.noStroke();
  g.blendMode(MULTIPLY);
  if (selectedPhotoFilter === 1) {
    g.fill(255, 200, 100, 60); g.rect(px, py, pw, ph);
  } else if (selectedPhotoFilter === 2) {
    g.fill(100, 160, 255, 55); g.rect(px, py, pw, ph);
  } else if (selectedPhotoFilter === 3) {
    g.fill(200, 200, 200, 180); g.rect(px, py, pw, ph);
  } else if (selectedPhotoFilter === 4) {
    g.fill(180, 140, 80, 70); g.rect(px, py, pw, ph);
  } else if (selectedPhotoFilter === 5) {
    g.fill(255, 180, 220, 50); g.rect(px, py, pw, ph);
  }
  g.blendMode(BLEND);
  g.pop();
}

// ============================================================
function getStripDimensions() {
  let base = min(width*0.28, 180);
  switch(selectedFormat){
    case 0: return {w:base,     photoH:base*0.7,  pad:10, bot:36, cols:1, count:4};
    case 1: return {w:base*1.7, photoH:base*0.6,  pad:10, bot:36, cols:2, count:4};
    case 2: return {w:base*2.4, photoH:base*0.55, pad:10, bot:36, cols:4, count:4};
    case 3: return {w:base*1.2, photoH:base*1.2,  pad:14, bot:80, cols:1, count:1};
    default:return {w:base,     photoH:base*0.7,  pad:10, bot:36, cols:1, count:4};
  }
}

function calcStripH(photoH, gap, padTop, bot, cols, count) {
  if(cols===4) return padTop + photoH + bot;
  if(cols===2) return padTop + photoH*2 + gap + bot;
  return padTop + photoH*count + gap*(count-1) + bot;
}

function drawResultScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let {w:stripW, photoH, pad, bot, cols, count} = getStripDimensions();
  let gap=8, padTop=12;
  let stripH = calcStripH(photoH, gap, padTop, bot, cols, count);
  let stripX = 16;
  let stripY = 50;

  // 제목
  fill("#c8b4f8"); textSize(min(width*0.038,22));
  text("✨  나의 인생네컷", stripX+stripW/2, 30);

  // 그림자
  fill(180,150,200,50); noStroke();
  rect(stripX+5,stripY+5,stripW,stripH,16);

  // 프레임 배경
  fill(frameColors[selectedFrame]);
  stroke(frameDark[selectedFrame]); strokeWeight(3);
  rect(stripX,stripY,stripW,stripH,12);

  // 상단 도트 장식
  push(); noStroke();
  for(let i=0;i<6;i++){
    fill(frameDark[selectedFrame]);
    circle(stripX+12+i*stripW/6, stripY+7, 4);
  }
  pop();

  // 사진 + 필터 + 스티커
  for(let i=0; i<count; i++){
    let px,py,pw,ph;
    if(cols===4){
      pw=(stripW-pad*2-gap*3)/4; ph=photoH;
      px=stripX+pad+i*(pw+gap); py=stripY+padTop;
    } else if(cols===2){
      let col=i%2, row=floor(i/2);
      pw=(stripW-pad*2-gap)/2; ph=photoH;
      px=stripX+pad+col*(pw+gap); py=stripY+padTop+row*(ph+gap);
    } else {
      px=stripX+pad; py=stripY+padTop+i*(photoH+gap);
      pw=stripW-pad*2; ph=photoH;
    }

    push(); fill(0,0,0,18); noStroke(); rect(px+2,py+2,pw,ph,6); pop();

    if(capturedPhotos[i]){
      push(); imageMode(CORNER); image(capturedPhotos[i],px,py,pw,ph); pop();
      // Photo filter overlay
      applyPhotoFilter(px, py, pw, ph);
      if(selectedSticker>0){
        push(); drawStickerOverlay(px,py,pw,ph,selectedSticker); pop();
      }
      if(selectedFormat===3){
        push(); stroke(255,255,255,180); strokeWeight(3); noFill();
        rect(px,py,pw,ph,4); pop();
      }
    } else {
      push(); fill(230); noStroke(); rect(px,py,pw,ph,6);
      fill(180); textSize(11); textAlign(CENTER,CENTER);
      text("사진 없음",px+pw/2,py+ph/2); pop();
    }
  }

  // 날짜
  push(); noStroke();
  let d=new Date();
  let dateStr=d.getFullYear()+"."+
    String(d.getMonth()+1).padStart(2,"0")+"."+
    String(d.getDate()).padStart(2,"0");
  if(selectedFormat===3){
    fill(frameDark[selectedFrame]); textSize(12);
    text("📸 4CUT BOOTH",stripX+stripW/2,stripY+stripH-52);
    fill(80); textSize(10);
    text(dateStr,stripX+stripW/2,stripY+stripH-32);
  } else {
    fill(80); textSize(10);
    text(dateStr,stripX+stripW/2,stripY+stripH-16);
  }
  pop();

  // 오른쪽 패널
  let panelX=stripX+stripW+14;
  let panelW=width-panelX-12;
  let panelY=stripY;

  // 프레임 선택
  drawCard(panelX,panelY,panelW,150,14);
  fill("#888"); textSize(11); textAlign(LEFT,CENTER);
  text("🎨 프레임",panelX+10,panelY+14);
  let fSize=min(panelW*0.22,32),fGapR=6;
  let fRowW=fSize*2+fGapR;
  let fStartX=panelX+(panelW-fRowW)/2;
  for(let i=0;i<frameColors.length;i++){
    push();
    let fx=fStartX+(i%2)*(fSize+fGapR);
    let fy=panelY+28+floor(i/2)*(fSize+fGapR+14);
    if(selectedFrame===i){stroke(frameDark[i]);strokeWeight(3);}
    else{stroke("#ddd");strokeWeight(1.5);}
    fill(frameColors[i]); circle(fx+fSize/2,fy+fSize/2,fSize);
    if(selectedFrame===i){
      fill(255,200);noStroke();circle(fx+fSize/2,fy+fSize/2,fSize*0.4);
    }
    noStroke();fill(selectedFrame===i?frameDark[i]:"#aaa");
    textSize(8);textAlign(CENTER,CENTER);
    text(frameNames[i],fx+fSize/2,fy+fSize+8);
    pop();
  }

  // --- PHOTO FILTER 선택 (Tamy 추가) ---
  let flt2Y = panelY + 155;
  drawCard(panelX, flt2Y, panelW, 120, 14);
  fill("#888"); textSize(11); textAlign(LEFT,CENTER);
  text("🎞 필터", panelX+10, flt2Y+14);

  let fltW = min((panelW-16)/3 - 3, 44);
  let fltGap = 4;
  for (let i = 0; i < filterNames2.length; i++) {
    push();
    let col2 = i % 3;
    let row2 = floor(i / 3);
    let fx2 = panelX + 8 + col2 * (fltW + fltGap);
    let fy2 = flt2Y + 28 + row2 * 46;
    if (selectedPhotoFilter === i) {
      fill("#ffe0f0"); stroke("#ff4d6d"); strokeWeight(2);
    } else {
      fill("#fafafa"); stroke("#eee"); strokeWeight(1);
    }
    rect(fx2, fy2, fltW, 38, 8);
    noStroke();
    fill(selectedPhotoFilter === i ? "#ff4d6d" : "#777");
    textSize(11); textAlign(CENTER, CENTER);
    text(filterEmoji2[i], fx2 + fltW/2, fy2 + 12);
    textSize(8);
    text(filterNames2[i], fx2 + fltW/2, fy2 + 28);
    pop();
  }

  // 형식 선택
  let fmt2Y = flt2Y + 128;
  drawCard(panelX,fmt2Y,panelW,160,14);
  fill("#888"); textSize(11); textAlign(LEFT,CENTER);
  text("📐 형식",panelX+10,fmt2Y+14);
  let fmtIcons=["📏","⬛","🖥️","📷"];
  let fmtLabels=["Strip","Square","Wide","Polar"];
  for(let i=0;i<4;i++){
    push();
    let fw=(panelW-20)/2-4;
    let fx=panelX+10+(i%2)*(fw+8);
    let fy=fmt2Y+28+floor(i/2)*52;
    if(selectedFormat===i){fill("#f3e5ff");stroke("#c8b4f8");strokeWeight(2);}
    else{fill("#fafafa");stroke("#eee");strokeWeight(1);}
    rect(fx,fy,fw,44,10);
    noStroke();fill(selectedFormat===i?"#c8b4f8":"#777");
    textSize(16);textAlign(CENTER,CENTER);
    text(fmtIcons[i],fx+fw/2,fy+16);
    textSize(9);
    text(fmtLabels[i],fx+fw/2,fy+34);
    pop();
  }

  // 스티커 선택
  let stk2Y=fmt2Y+168;
  drawCard(panelX,stk2Y,panelW,80,14);
  fill("#888"); textSize(11); textAlign(LEFT,CENTER);
  text("🌟 스티커",panelX+10,stk2Y+14);
  let stkIcons=["✕","🎀","💕","🪐","🍦","✦"];
  let stkW=min((panelW-16)/6-3,26);
  for(let i=0;i<stickerSets.length;i++){
    push();
    let sx=panelX+10+i*(stkW+4);
    let sy=stk2Y+28;
    if(selectedSticker===i){fill("#fff0f5");stroke("#ffb6c1");strokeWeight(2);}
    else{fill("#fafafa");stroke("#eee");strokeWeight(1);}
    rect(sx,sy,stkW,stkW,6);
    noStroke();fill("#333");textSize(stkW*0.55);textAlign(CENTER,CENTER);
    text(stkIcons[i],sx+stkW/2,sy+stkW/2);
    pop();
  }

  // 버튼
  let btn2Y=stk2Y+88;
  drawPinkBtn(panelX,btn2Y,panelW,46,"💾  저장하기");
  drawLightBtn(panelX,btn2Y+54,panelW,38,"🔄  다시 찍기");
  fill("#ddd"); textSize(9); textAlign(CENTER,CENTER);
  text("S키 저장  |  R키 재촬영",panelX+panelW/2,btn2Y+102);

  pop();
}

// ============================================================
// Bộ sticker data (배열 사용)
// Mỗi sticker có: x/y (vị trí tỉ lệ), s (emoji), size (tỉ lệ size)
let stickerSets = [
  // 0: Không sticker
  [],
  // 1: Girlypop — nơ, gương, bướm, sparkle
  [
    {x:0.08, y:0.06, s:"🎀", sz:0.18},
    {x:0.82, y:0.04, s:"🪞", sz:0.15},
    {x:0.88, y:0.82, s:"🦋", sz:0.16},
    {x:0.04, y:0.84, s:"✨", sz:0.14},
    {x:0.5,  y:0.05, s:"🎀", sz:0.12},
  ],
  // 2: Pastel Love — tim, hoa, ngôi sao
  [
    {x:0.08, y:0.08, s:"💕", sz:0.16},
    {x:0.84, y:0.06, s:"🌸", sz:0.17},
    {x:0.9,  y:0.86, s:"💗", sz:0.15},
    {x:0.05, y:0.88, s:"🌷", sz:0.16},
    {x:0.45, y:0.06, s:"✿",  sz:0.14},
    {x:0.88, y:0.44, s:"💫", sz:0.13},
  ],
  // 3: Space — hành tinh, sao, tên lửa
  [
    {x:0.82, y:0.04, s:"🪐", sz:0.20},
    {x:0.06, y:0.06, s:"⭐", sz:0.16},
    {x:0.88, y:0.84, s:"🌙", sz:0.17},
    {x:0.05, y:0.82, s:"🚀", sz:0.16},
    {x:0.5,  y:0.04, s:"✦",  sz:0.12},
    {x:0.86, y:0.44, s:"💫", sz:0.13},
  ],
  // 4: Food — kem, cà phê, bánh
  [
    {x:0.06, y:0.04, s:"🍦", sz:0.18},
    {x:0.82, y:0.06, s:"☕", sz:0.17},
    {x:0.86, y:0.82, s:"🧁", sz:0.18},
    {x:0.04, y:0.82, s:"🍓", sz:0.16},
    {x:0.5,  y:0.04, s:"🍰", sz:0.14},
  ],
  // 5: Vintage Star — ngôi sao, kim cương, hoa nhỏ
  [
    {x:0.06, y:0.06, s:"✦",  sz:0.16},
    {x:0.86, y:0.04, s:"★",  sz:0.18},
    {x:0.9,  y:0.86, s:"✦",  sz:0.15},
    {x:0.04, y:0.88, s:"✿",  sz:0.16},
    {x:0.5,  y:0.05, s:"◆",  sz:0.12},
    {x:0.88, y:0.46, s:"✦",  sz:0.11},
  ],
];

function drawStickerOverlay(px,py,pw,ph,stickerIndex){
  let stickers = stickerSets;
  let list=stickers[stickerIndex]||[];
  let list=stickers[stickerIndex]||[];
  if(list.length===0) return;
  noStroke(); textAlign(CENTER,CENTER);
  for(let s of list){
    // size mỗi sticker riêng biệt, có hiệu ứng nhấp nháy nhẹ
    let sz = min(pw * (s.sz || 0.15), 22);
    let nhip = 1 + sin(frameCount * 0.04 + s.x * 10) * 0.08;
    textSize(sz * nhip);
    text(s.s, px+pw*s.x, py+ph*s.y);
  }
  stroke(255,180); strokeWeight(1.5); noFill();
  let cs=8;
  line(px+3,py+3,px+3+cs,py+3); line(px+3,py+3,px+3,py+3+cs);
  line(px+pw-3,py+3,px+pw-3-cs,py+3); line(px+pw-3,py+3,px+pw-3,py+3+cs);
  line(px+3,py+ph-3,px+3+cs,py+ph-3); line(px+3,py+ph-3,px+3,py+ph-3-cs);
  line(px+pw-3,py+ph-3,px+pw-3-cs,py+ph-3); line(px+pw-3,py+ph-3,px+pw-3,py+ph-3-cs);
}

function saveStickerOverlay(g, px, py, pw, ph, stickerIndex){
  let list = (stickerSets[stickerIndex]) || [];
  if(list.length===0) return;
  for(let s of list){
    let sz = min(pw * (s.sz || 0.15), 22);
    g.push(); g.noStroke(); g.textAlign(CENTER,CENTER);
    g.textSize(sz); g.text(s.s, px+pw*s.x, py+ph*s.y); g.pop();
  }
  g.push(); g.stroke(255,180); g.strokeWeight(1.5); g.noFill();
  let cs=8;
  g.line(px+3,py+3,px+3+cs,py+3); g.line(px+3,py+3,px+3,py+3+cs);
  g.line(px+pw-3,py+3,px+pw-3-cs,py+3); g.line(px+pw-3,py+3,px+pw-3,py+3+cs);
  g.line(px+3,py+ph-3,px+3+cs,py+ph-3); g.line(px+3,py+ph-3,px+3,py+ph-3-cs);
  g.line(px+pw-3,py+ph-3,px+pw-3-cs,py+ph-3); g.line(px+pw-3,py+ph-3,px+pw-3,py+ph-3-cs);
  g.pop();
}

// ============================================================
function handleResultButtons(){
  let {w:stripW,photoH,pad,bot,cols,count}=getStripDimensions();
  let gap=8,padTop=12;
  let stripH=calcStripH(photoH,gap,padTop,bot,cols,count);
  let stripX=16,stripY=50;
  let panelX=stripX+stripW+14;
  let panelW=width-panelX-12;

  // Frame
  let fSize=min(panelW*0.22,32),fGapR=6;
  let fRowW=fSize*2+fGapR,fStartX=panelX+(panelW-fRowW)/2;
  for(let i=0;i<frameColors.length;i++){
    let fx=fStartX+(i%2)*(fSize+fGapR);
    let fy=stripY+28+floor(i/2)*(fSize+fGapR+14);
    if(dist(mouseX,mouseY,fx+fSize/2,fy+fSize/2)<fSize/2){ selectedFrame=i; return; }
  }

  // Photo filter buttons
  let flt2Y = stripY + 155;
  let fltW  = min((panelW-16)/3 - 3, 44);
  let fltGap = 4;
  for (let i = 0; i < filterNames2.length; i++) {
    let col2 = i % 3, row2 = floor(i / 3);
    let fx2 = panelX + 8 + col2 * (fltW + fltGap);
    let fy2 = flt2Y + 28 + row2 * 46;
    if (mouseX > fx2 && mouseX < fx2+fltW && mouseY > fy2 && mouseY < fy2+38) {
      selectedPhotoFilter = i; return;
    }
  }

  // Format
  let fmt2Y = flt2Y + 128;
  let fw=(panelW-20)/2-4;
  for(let i=0;i<4;i++){
    let fx=panelX+10+(i%2)*(fw+8);
    let fy=fmt2Y+28+floor(i/2)*52;
    if(mouseX>fx&&mouseX<fx+fw&&mouseY>fy&&mouseY<fy+44){ selectedFormat=i; return; }
  }

  // Sticker
  let stk2Y=fmt2Y+168;
  let stkW=min((panelW-16)/6-3,26);
  for(let i=0;i<stickerSets.length;i++){
    let sx=panelX+10+i*(stkW+4), sy=stk2Y+28;
    if(mouseX>sx&&mouseX<sx+stkW&&mouseY>sy&&mouseY<sy+stkW){ selectedSticker=i; return; }
  }

  let btn2Y=stk2Y+88;
  if(mouseX>panelX&&mouseX<panelX+panelW&&mouseY>btn2Y&&mouseY<btn2Y+46){
    saveResultCanvas(); return;
  }
  if(mouseX>panelX&&mouseX<panelX+panelW&&mouseY>btn2Y+54&&mouseY<btn2Y+92){
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];currentScreen="camera";
  }
}

// ============================================================
function saveResultCanvas(){
  let {w:stripW,photoH,pad,bot,cols,count}=getStripDimensions();
  let gap=8,padTop=12;
  let stripH=calcStripH(photoH,gap,padTop,bot,cols,count);

  let g=createGraphics(stripW,stripH);
  g.rectMode(CORNER); g.textAlign(CENTER,CENTER);

  g.fill(frameColors[selectedFrame]);
  g.stroke(frameDark[selectedFrame]); g.strokeWeight(3);
  g.rect(0,0,stripW,stripH,12);

  for(let i=0;i<6;i++){
    g.fill(frameDark[selectedFrame]); g.noStroke();
    g.circle(12+i*stripW/6,7,4);
  }

  for(let i=0;i<count;i++){
    let px,py,pw,ph;
    if(cols===4){
      pw=(stripW-pad*2-gap*3)/4; ph=photoH;
      px=pad+i*(pw+gap); py=padTop;
    } else if(cols===2){
      let col=i%2,row=floor(i/2);
      pw=(stripW-pad*2-gap)/2; ph=photoH;
      px=pad+col*(pw+gap); py=padTop+row*(ph+gap);
    } else {
      px=pad; py=padTop+i*(photoH+gap);
      pw=stripW-pad*2; ph=photoH;
    }

    if(capturedPhotos[i]){
      g.push(); g.imageMode(CORNER);
      g.image(capturedPhotos[i],px,py,pw,ph); g.pop();
      applyPhotoFilterSave(g, px, py, pw, ph);
      if(selectedSticker>0) saveStickerOverlay(g,px,py,pw,ph,selectedSticker);
      if(selectedFormat===3){
        g.push(); g.stroke(255); g.strokeWeight(3); g.noFill();
        g.rect(px,py,pw,ph,4); g.pop();
      }
    } else {
      g.push(); g.fill(220); g.noStroke(); g.rect(px,py,pw,ph,6); g.pop();
    }
  }

  let d=new Date();
  let ds=d.getFullYear()+"."+
    String(d.getMonth()+1).padStart(2,"0")+"."+
    String(d.getDate()).padStart(2,"0");
  if(selectedFormat===3){
    g.fill(frameDark[selectedFrame]); g.noStroke(); g.textSize(12);
    g.text("📸 4CUT BOOTH",stripW/2,stripH-48);
    g.fill(80); g.textSize(10); g.text(ds,stripW/2,stripH-28);
  } else {
    g.noStroke(); g.fill(80); g.textSize(10);
    g.text(ds,stripW/2,stripH-12);
  }

  save(g,"4cut_"+formatNames[selectedFormat]+"_"+frameNames[selectedFrame]+".png");
  g.remove();
  currentScreen="saved";
}
