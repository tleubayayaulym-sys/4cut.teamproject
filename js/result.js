// ============================================================
// result.js — 담당: 마이티투짱
// ============================================================

function getStripDimensions() {
  let base = min(width*0.34, 200);
  switch(selectedFormat){
    // 0: Strip — классическая вертикальная полоска 4 фото
    case 0: return {w:base,      photoH:base*0.72, pad:12, bot:40, cols:1};
    // 1: Square — 2x2 сетка
    case 1: return {w:base*1.6,  photoH:base*0.58, pad:10, bot:40, cols:2};
    // 2: Wide — широкий, 4 фото в ряд
    case 2: return {w:base*2.2,  photoH:base*0.5,  pad:10, bot:40, cols:4};
    // 3: Polaroid — с большим нижним полем
    case 3: return {w:base,      photoH:base*0.72, pad:12, bot:80, cols:1};
    default:return {w:base,      photoH:base*0.72, pad:12, bot:40, cols:1};
  }
}

function drawResultScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let {w:stripW, photoH, pad, bot, cols} = getStripDimensions();
  let gap = 8, padTop = 14;

  // Считаем высоту стрипа по формату
  let stripH;
  if(cols===1){
    stripH = padTop + photoH*4 + gap*3 + bot;
  } else if(cols===2){
    stripH = padTop + photoH*2 + gap + bot;
  } else if(cols===4){
    stripH = padTop + photoH + bot;
  }

  let stripX = width/2 - stripW/2;
  let stripY = 58;

  // Заголовок
  fill("#c8b4f8"); textSize(min(width*0.04,24));
  text("✨  나의 인생네컷", width/2, 34);

  // Тень стрипа
  fill(180,150,200,50); noStroke();
  rect(stripX+6, stripY+6, stripW, stripH, 18);

  // Фрейм
  fill(frameColors[selectedFrame]);
  stroke(frameDark[selectedFrame]); strokeWeight(3);
  rect(stripX, stripY, stripW, stripH, 14);

  // Декор точки сверху
  push(); noStroke();
  for(let i=0; i<8; i++){
    fill(frameDark[selectedFrame]);
    circle(stripX+16+i*stripW/7, stripY+8, 5);
  }
  pop();

  // 4장 사진 — позиции зависят от формата
  for(let i=0; i<4; i++){
    let px, py, pw, ph;
    if(cols===1){
      // Вертикальный стрип / Полароид
      px = stripX+pad;
      py = stripY+padTop+i*(photoH+gap);
      pw = stripW-pad*2;
      ph = photoH;
    } else if(cols===2){
      // 2x2
      let col = i%2, row = floor(i/2);
      pw = (stripW-pad*2-gap)/2;
      ph = photoH;
      px = stripX+pad+col*(pw+gap);
      py = stripY+padTop+row*(ph+gap);
    } else if(cols===4){
      // Широкий — 4 в ряд
      pw = (stripW-pad*2-gap*3)/4;
      ph = photoH;
      px = stripX+pad+i*(pw+gap);
      py = stripY+padTop;
    }

    push();
    fill(0,0,0,20); noStroke(); rect(px+2,py+2,pw,ph,6);

    if(capturedPhotos[i]){
      imageMode(CORNER); image(capturedPhotos[i],px,py,pw,ph);
      if(selectedSticker>0) drawStickerOverlay(px,py,pw,ph,i);
      if(selectedFormat===3){
        stroke(255); strokeWeight(3); noFill(); rect(px,py,pw,ph,4);
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
  let d = new Date();
  let dateStr = d.getFullYear()+"."+
    String(d.getMonth()+1).padStart(2,"0")+"."+
    String(d.getDate()).padStart(2,"0");

  if(selectedFormat===3){
    // Полароид — название и дата снизу
    fill(frameDark[selectedFrame]); textSize(12);
    text("📸 4CUT BOOTH", stripX+stripW/2, stripY+stripH-52);
    fill(80); textSize(10);
    text(dateStr, stripX+stripW/2, stripY+stripH-32);
  } else {
    fill(80); textSize(10);
    text(dateStr, stripX+stripW/2, stripY+stripH-18);
  }
  pop();

  // Правая панель — выбор фрейма
  let panelX = stripX + stripW + 18;
  let panelW = min(width-panelX-12, 155);

  drawCard(panelX, stripY, panelW, 172, 16);
  fill("#888"); textSize(12); textAlign(LEFT,CENTER);
  text("🎨 프레임", panelX+12, stripY+16);

  let fSize=min(panelW*0.2,30), fGapR=8;
  let fRowW=fSize*2+fGapR;
  let fStartX=panelX+(panelW-fRowW)/2;
  for(let i=0; i<frameColors.length; i++){
    push();
    let fx = fStartX+(i%2)*(fSize+fGapR);
    let fy = stripY+34+floor(i/2)*(fSize+fGapR+4);
    if(selectedFrame===i){stroke(frameDark[i]);strokeWeight(3);}
    else{stroke("#ddd");strokeWeight(1.5);}
    fill(frameColors[i]); circle(fx+fSize/2,fy+fSize/2,fSize);
    if(selectedFrame===i){
      fill(255,200); noStroke(); circle(fx+fSize/2,fy+fSize/2,fSize*0.45);
    }
    noStroke(); fill(selectedFrame===i?frameDark[i]:"#aaa");
    textSize(9); textAlign(CENTER,CENTER);
    text(frameNames[i], fx+fSize/2, fy+fSize+10);
    pop();
  }

  // Правая панель — выбор формата
  drawCard(panelX, stripY+184, panelW, 188, 16);
  fill("#888"); textSize(12); textAlign(LEFT,CENTER);
  text("📐 형식", panelX+12, stripY+202);

  let fmtIcons = ["📏","⬛","🖥️","📷"];
  let fmtLabels = ["Strip","Square","Wide","Polaroid"];
  for(let i=0; i<4; i++){
    push();
    let fx = panelX+10+(i%2)*(panelW/2-8);
    let fy = stripY+216+floor(i/2)*46;
    let fw = panelW/2-16;
    if(selectedFormat===i){
      fill("#f3e5ff"); stroke("#c8b4f8"); strokeWeight(2);
    } else {
      fill("#fafafa"); stroke("#eee"); strokeWeight(1);
    }
    rect(fx,fy,fw,38,10);
    noStroke(); fill(selectedFormat===i?"#c8b4f8":"#777");
    textSize(12); textAlign(CENTER,CENTER);
    text(fmtIcons[i], fx+fw/2, fy+12);
    textSize(9);
    text(fmtLabels[i], fx+fw/2, fy+27);
    pop();
  }

  // Правая панель — стикеры
  drawCard(panelX, stripY+384, panelW, 90, 16);
  fill("#888"); textSize(12); textAlign(LEFT,CENTER);
  text("🌟 스티커", panelX+12, stripY+402);
  let stkIcons=["✕","✦","💕","🌸","🎀"];
  let stkW=min((panelW-20)/5, 22);
  for(let i=0; i<5; i++){
    push();
    let sx = panelX+10+i*(stkW+4);
    let sy = stripY+416;
    if(selectedSticker===i){fill("#fff0f5");stroke("#ffb6c1");strokeWeight(2);}
    else{fill("#fafafa");stroke("#eee");strokeWeight(1);}
    rect(sx,sy,stkW,stkW,6);
    noStroke();fill("#333");textSize(stkW*0.6);textAlign(CENTER,CENTER);
    text(stkIcons[i],sx+stkW/2,sy+stkW/2);
    pop();
  }

  // Кнопки снизу
  let btnW = min(stripW, 210);
  let btnX = width/2 - btnW/2;
  let btnY = stripY+stripH+14;
  drawPinkBtn(btnX, btnY, btnW, 48, "💾  저장하기");
  drawLightBtn(btnX, btnY+60, btnW, 38, "🔄  다시 찍기");
  fill("#ddd"); textSize(10); textAlign(CENTER,CENTER);
  text("S키 저장  |  R키 재촬영", width/2, btnY+110);

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
  let list=stickers[selectedSticker];
  for(let s of list){
    textSize(min(pw*0.15,16)); textAlign(CENTER,CENTER);
    text(s.s, px+pw*s.x, py+ph*s.y);
  }
  // Угловые линии
  stroke(255,180); strokeWeight(1.5); noFill();
  let cs=10;
  line(px+3,py+3,px+3+cs,py+3); line(px+3,py+3,px+3,py+3+cs);
  line(px+pw-3,py+3,px+pw-3-cs,py+3); line(px+pw-3,py+3,px+pw-3,py+3+cs);
  line(px+3,py+ph-3,px+3+cs,py+ph-3); line(px+3,py+ph-3,px+3,py+ph-3-cs);
  line(px+pw-3,py+ph-3,px+pw-3-cs,py+ph-3); line(px+pw-3,py+ph-3,px+pw-3,py+ph-3-cs);
  pop();
}

// ============================================================
function handleResultButtons(){
  let {w:stripW,photoH,pad,bot,cols}=getStripDimensions();
  let gap=8,padTop=14;
  let stripH;
  if(cols===1) stripH=padTop+photoH*4+gap*3+bot;
  else if(cols===2) stripH=padTop+photoH*2+gap+bot;
  else if(cols===4) stripH=padTop+photoH+bot;

  let stripX=width/2-stripW/2, stripY=58;
  let panelX=stripX+stripW+18;
  let panelW=min(width-panelX-12,155);

  // Фрейм
  let fSize=min(panelW*0.2,30),fGapR=8;
  let fRowW=fSize*2+fGapR,fStartX=panelX+(panelW-fRowW)/2;
  for(let i=0;i<frameColors.length;i++){
    let fx=fStartX+(i%2)*(fSize+fGapR);
    let fy=stripY+34+floor(i/2)*(fSize+fGapR+4);
    if(dist(mouseX,mouseY,fx+fSize/2,fy+fSize/2)<fSize/2){selectedFrame=i;return;}
  }

  // Формат
  for(let i=0;i<4;i++){
    let fx=panelX+10+(i%2)*(panelW/2-8);
    let fy=stripY+216+floor(i/2)*46;
    let fw=panelW/2-16;
    if(mouseX>fx&&mouseX<fx+fw&&mouseY>fy&&mouseY<fy+38){selectedFormat=i;return;}
  }

  // Стикеры
  let stkW=min((panelW-20)/5,22);
  for(let i=0;i<5;i++){
    let sx=panelX+10+i*(stkW+4);
    let sy=stripY+416;
    if(mouseX>sx&&mouseX<sx+stkW&&mouseY>sy&&mouseY<sy+stkW){selectedSticker=i;return;}
  }

  // Кнопки
  let btnW=min(stripW,210),btnX=width/2-btnW/2,btnY=stripY+stripH+14;
  if(mouseX>btnX&&mouseX<btnX+btnW&&mouseY>btnY&&mouseY<btnY+48){saveResultCanvas();return;}
  if(mouseX>btnX&&mouseX<btnX+btnW&&mouseY>btnY+60&&mouseY<btnY+98){
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];currentScreen="camera";
  }
}

// ============================================================
function saveResultCanvas(){
  let {w:stripW,photoH,pad,bot,cols}=getStripDimensions();
  let gap=8,padTop=14;
  let stripH;
  if(cols===1) stripH=padTop+photoH*4+gap*3+bot;
  else if(cols===2) stripH=padTop+photoH*2+gap+bot;
  else if(cols===4) stripH=padTop+photoH+bot;

  let g=createGraphics(stripW,stripH);
  g.rectMode(CORNER); g.textAlign(CENTER,CENTER);
  g.fill(frameColors[selectedFrame]);
  g.stroke(frameDark[selectedFrame]); g.strokeWeight(3);
  g.rect(0,0,stripW,stripH,14);

  // Декор
  for(let i=0;i<8;i++){
    g.fill(frameDark[selectedFrame]); g.noStroke();
    g.circle(14+i*stripW/7,8,5);
  }

  for(let i=0;i<4;i++){
    let px,py,pw,ph;
    if(cols===1){
      px=pad; py=padTop+i*(photoH+gap); pw=stripW-pad*2; ph=photoH;
    } else if(cols===2){
      let col=i%2,row=floor(i/2);
      pw=(stripW-pad*2-gap)/2; ph=photoH;
      px=pad+col*(pw+gap); py=padTop+row*(ph+gap);
    } else if(cols===4){
      pw=(stripW-pad*2-gap*3)/4; ph=photoH;
      px=pad+i*(pw+gap); py=padTop;
    }
    if(capturedPhotos[i]) g.image(capturedPhotos[i],px,py,pw,ph);
    else{ g.fill(220);g.noStroke();g.rect(px,py,pw,ph,6); }
  }

  let d=new Date();
  let dateStr=d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0");
  g.noStroke();g.fill(80);g.textSize(10);
  g.text(dateStr,stripW/2,stripH-14);

  save(g,"4cut_"+formatNames[selectedFormat]+"_"+frameNames[selectedFrame]+".png");
  g.remove();
  currentScreen="saved";
}
