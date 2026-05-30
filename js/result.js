// ============================================================
// result.js — 담당: 마이티투짱
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

  // Заголовок
  fill("#c8b4f8"); textSize(min(width*0.038,22));
  text("✨  나의 인생네컷", stripX + stripW/2, 30);

  // Тень
  fill(180,150,200,50); noStroke();
  rect(stripX+5, stripY+5, stripW, stripH, 16);

  // Фрейм
  fill(frameColors[selectedFrame]);
  stroke(frameDark[selectedFrame]); strokeWeight(3);
  rect(stripX, stripY, stripW, stripH, 12);

  // Декор точки
  push(); noStroke();
  for(let i=0;i<6;i++){
    fill(frameDark[selectedFrame]);
    circle(stripX+12+i*stripW/6, stripY+7, 4);
  }
  pop();

  // Фотографии
  for(let i=0; i<count; i++){
    let px, py, pw, ph;
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

    push();
    fill(0,0,0,18); noStroke(); rect(px+2,py+2,pw,ph,6);
    if(capturedPhotos[i]){
      imageMode(CORNER); image(capturedPhotos[i],px,py,pw,ph);
      if(selectedSticker>0) drawStickerOverlay(px,py,pw,ph,i);
      if(selectedFormat===3){
        stroke(255,255,255,180); strokeWeight(3); noFill();
        rect(px,py,pw,ph,4);
      }
    } else {
      fill(230); noStroke(); rect(px,py,pw,ph,6);
      fill(180); textSize(11); textAlign(CENTER,CENTER);
      text("사진 없음", px+pw/2, py+ph/2);
    }
    pop();
  }

  // Дата
  push(); noStroke();
  let d=new Date();
  let dateStr=d.getFullYear()+"."+
    String(d.getMonth()+1).padStart(2,"0")+"."+
    String(d.getDate()).padStart(2,"0");
  if(selectedFormat===3){
    fill(frameDark[selectedFrame]); textSize(12);
    text("📸 4CUT BOOTH", stripX+stripW/2, stripY+stripH-52);
    fill(80); textSize(10);
    text(dateStr, stripX+stripW/2, stripY+stripH-32);
  } else {
    fill(80); textSize(10);
    text(dateStr, stripX+stripW/2, stripY+stripH-16);
  }
  pop();

  // ============================================================
  // 오른쪽 패널 — 모든 컨트롤
  // ============================================================
  let panelX = stripX + stripW + 14;
  let panelW = width - panelX - 12;
  let panelY = stripY;

  // 프레임 선택
  drawCard(panelX, panelY, panelW, 150, 14);
  fill("#888"); textSize(11); textAlign(LEFT,CENTER);
  text("🎨 프레임", panelX+10, panelY+14);

  let fSize=min(panelW*0.22,32), fGapR=6;
  let fRowW=fSize*2+fGapR;
  let fStartX=panelX+(panelW-fRowW)/2;
  for(let i=0;i<frameColors.length;i++){
    push();
    let fx=fStartX+(i%2)*(fSize+fGapR);
    let fy=panelY+28+floor(i/2)*(fSize+fGapR+14);
    if(selectedFrame===i){stroke(frameDark[i]);strokeWeight(3);}
    else{stroke("#ddd");strokeWeight(1.5);}
    fill(frameColors[i]); circle(fx+fSize/2,fy+fSize/2,fSize);
    if(selectedFrame===i){fill(255,200);noStroke();circle(fx+fSize/2,fy+fSize/2,fSize*0.4);}
    noStroke();fill(selectedFrame===i?frameDark[i]:"#aaa");
    textSize(8);textAlign(CENTER,CENTER);
    text(frameNames[i],fx+fSize/2,fy+fSize+8);
    pop();
  }

  // 형식 선택
  let fmt2Y = panelY+160;
  drawCard(panelX, fmt2Y, panelW, 160, 14);
  fill("#888"); textSize(11); textAlign(LEFT,CENTER);
  text("📐 형식", panelX+10, fmt2Y+14);

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
  let stk2Y = fmt2Y+168;
  drawCard(panelX, stk2Y, panelW, 80, 14);
  fill("#888"); textSize(11); textAlign(LEFT,CENTER);
  text("🌟 스티커", panelX+10, stk2Y+14);

  let stkIcons=["✕","✦","💕","🌸","🎀"];
  let stkW=min((panelW-20)/5-4, 28);
  for(let i=0;i<5;i++){
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

  // Кнопки — справа снизу
  let btn2Y = stk2Y + 88;
  drawPinkBtn(panelX, btn2Y, panelW, 46, "💾  저장하기");
  drawLightBtn(panelX, btn2Y+54, panelW, 38, "🔄  다시 찍기");

  fill("#ddd"); textSize(9); textAlign(CENTER,CENTER);
  text("S키 저장  |  R키 재촬영", panelX+panelW/2, btn2Y+102);

  pop();
}

// ============================================================
// 스티커 오버레이
// ============================================================
function drawStickerOverlay(px,py,pw,ph,photoIndex){
  push(); noStroke();
  let stickers=[
    [],
    [{x:0.08,y:0.08,s:"✦"},{x:0.88,y:0.06,s:"★"},{x:0.92,y:0.88,s:"✦"},{x:0.06,y:0.9,s:"✦"}],
    [{x:0.1,y:0.1,s:"💕"},{x:0.84,y:0.08,s:"💗"},{x:0.9,y:0.84,s:"💕"},{x:0.08,y:0.86,s:"💗"}],
    [{x:0.08,y:0.08,s:"🌸"},{x:0.86,y:0.06,s:"🌷"},{x:0.9,y:0.86,s:"🌸"},{x:0.06,y:0.88,s:"🌷"}],
    [{x:0.08,y:0.06,s:"🎀"},{x:0.84,y:0.04,s:"🎀"},{x:0.88,y:0.86,s:"✨"},{x:0.06,y:0.86,s:"✨"}],
  ];
  let list=stickers[selectedSticker]||[];
  for(let s of list){
    textSize(min(pw*0.15,16)); textAlign(CENTER,CENTER);
    text(s.s, px+pw*s.x, py+ph*s.y);
  }
  stroke(255,180); strokeWeight(1.5); noFill();
  let cs=8;
  line(px+3,py+3,px+3+cs,py+3); line(px+3,py+3,px+3,py+3+cs);
  line(px+pw-3,py+3,px+pw-3-cs,py+3); line(px+pw-3,py+3,px+pw-3,py+3+cs);
  line(px+3,py+ph-3,px+3+cs,py+ph-3); line(px+3,py+ph-3,px+3,py+ph-3-cs);
  line(px+pw-3,py+ph-3,px+pw-3-cs,py+ph-3); line(px+pw-3,py+ph-3,px+pw-3,py+ph-3-cs);
  pop();
}

// ============================================================
function handleResultButtons(){
  let {w:stripW,photoH,pad,bot,cols,count}=getStripDimensions();
  let gap=8,padTop=12;
  let stripH=calcStripH(photoH,gap,padTop,bot,cols,count);
  let stripX=16, stripY=50;
  let panelX=stripX+stripW+14;
  let panelW=width-panelX-12;

  // Фрейм
  let fSize=min(panelW*0.22,32),fGapR=6;
  let fRowW=fSize*2+fGapR,fStartX=panelX+(panelW-fRowW)/2;
  for(let i=0;i<frameColors.length;i++){
    let fx=fStartX+(i%2)*(fSize+fGapR);
    let fy=stripY+28+floor(i/2)*(fSize+fGapR+14);
    if(dist(mouseX,mouseY,fx+fSize/2,fy+fSize/2)<fSize/2){selectedFrame=i;return;}
  }

  // Формат
  let fmt2Y=stripY+160;
  let fw=(panelW-20)/2-4;
  for(let i=0;i<4;i++){
    let fx=panelX+10+(i%2)*(fw+8);
    let fy=fmt2Y+28+floor(i/2)*52;
    if(mouseX>fx&&mouseX<fx+fw&&mouseY>fy&&mouseY<fy+44){selectedFormat=i;return;}
  }

  // Стикеры
  let stk2Y=fmt2Y+168;
  let stkW=min((panelW-20)/5-4,28);
  for(let i=0;i<5;i++){
    let sx=panelX+10+i*(stkW+4);
    let sy=stk2Y+28;
    if(mouseX>sx&&mouseX<sx+stkW&&mouseY>sy&&mouseY<sy+stkW){selectedSticker=i;return;}
  }

  // Кнопки
  let btn2Y=stk2Y+88;
  if(mouseX>panelX&&mouseX<panelX+panelW&&mouseY>btn2Y&&mouseY<btn2Y+46){
    saveResultCanvas();return;
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
    g.fill(frameDark[selectedFrame]);g.noStroke();
    g.circle(12+i*stripW/6,7,4);
  }

  for(let i=0;i<count;i++){
    let px,py,pw,ph;
    if(cols===4){
      pw=(stripW-pad*2-gap*3)/4;ph=photoH;
      px=pad+i*(pw+gap);py=padTop;
    } else if(cols===2){
      let col=i%2,row=floor(i/2);
      pw=(stripW-pad*2-gap)/2;ph=photoH;
      px=pad+col*(pw+gap);py=padTop+row*(ph+gap);
    } else {
      px=pad;py=padTop+i*(photoH+gap);
      pw=stripW-pad*2;ph=photoH;
    }
    if(capturedPhotos[i]) g.image(capturedPhotos[i],px,py,pw,ph);
    else{g.fill(220);g.noStroke();g.rect(px,py,pw,ph,6);}
  }

  let d=new Date();
  let ds=d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0");
  g.noStroke();g.fill(80);g.textSize(10);
  g.text(ds,stripW/2,stripH-12);

  save(g,"4cut_"+formatNames[selectedFormat]+"_"+frameNames[selectedFrame]+".png");
  g.remove();
  currentScreen="saved";
}
