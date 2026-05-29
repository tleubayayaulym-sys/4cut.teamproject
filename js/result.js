// ============================================================
// result.js — 담당: 마이티투짱
// ============================================================

function getStripDimensions() {
  let base=min(width*0.36,210);
  switch(selectedFormat){
    case 0: return {w:base,      photoH:base*0.72, pad:14, bot:44};
    case 1: return {w:base,      photoH:base-20,   pad:14, bot:44};
    case 2: return {w:base*1.5,  photoH:base*0.5,  pad:14, bot:44};
    case 3: return {w:base,      photoH:base*0.72, pad:14, bot:70};
    default:return {w:base,      photoH:base*0.72, pad:14, bot:44};
  }
}

function drawResultScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let {w:stripW,photoH,pad,bot}=getStripDimensions();
  let gap=8,padTop=14;
  let stripH=padTop+photoH*4+gap*3+bot;
  let stripX=width/2-stripW/2, stripY=60;

  fill("#c8b4f8"); textSize(min(width*0.042,26));
  text("✨  나의 인생네컷", width/2, 36);

  // 스트립 그림자
  fill(180,150,200,50);noStroke();rect(stripX+6,stripY+6,stripW,stripH,18);

  // 프레임
  fill(frameColors[selectedFrame]);
  stroke(frameDark[selectedFrame]);strokeWeight(3);
  rect(stripX,stripY,stripW,stripH,14);

  // 상단 도트 장식
  push();noStroke();
  for(let i=0;i<8;i++){
    fill(frameDark[selectedFrame]);
    circle(stripX+16+i*stripW/7,stripY+8,5);
  }
  pop();

  // 4장 사진
  for(let i=0;i<4;i++){
    let px=stripX+pad, py=stripY+padTop+i*(photoH+gap), pw=stripW-pad*2;
    push();
    fill(0,0,0,20);noStroke();rect(px+2,py+2,pw,photoH,6);
    if(capturedPhotos[i]){
      imageMode(CORNER);image(capturedPhotos[i],px,py,pw,photoH);
      if(selectedSticker>0) drawStickerOverlay(px,py,pw,photoH,i);
      if(selectedFormat===3){stroke(255);strokeWeight(3);noFill();rect(px,py,pw,photoH,4);}
    } else {
      fill(230);noStroke();rect(px,py,pw,photoH,6);
      fill(180);textSize(13);text("사진 없음",px+pw/2,py+photoH/2);
    }
    pop();
  }

  // 날짜
  push();noStroke();
  let d=new Date();
  let dateStr=d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0");
  if(selectedFormat===3){
    fill(frameDark[selectedFrame]);textSize(11);
    text("📸 4CUT BOOTH",stripX+stripW/2,stripY+stripH-46);
    fill(100);textSize(10);text(dateStr,stripX+stripW/2,stripY+stripH-28);
  } else {
    fill(100);textSize(11);text(dateStr,stripX+stripW/2,stripY+stripH-24);
  }
  pop();

  // 오른쪽 패널
  let panelX=stripX+stripW+20;
  let panelW=min(width-panelX-16,160);

  drawCard(panelX,stripY,panelW,180,16);
  fill("#888");textSize(12);textAlign(LEFT,CENTER);
  text("🎨 프레임",panelX+12,stripY+18);
  let fSize=min(panelW*0.18,28),fGapR=8;
  let fRowW=fSize*2+fGapR,fStartX=panelX+(panelW-fRowW)/2;
  for(let i=0;i<frameColors.length;i++){
    push();
    let fx=fStartX+(i%2)*(fSize+fGapR);
    let fy=stripY+36+floor(i/2)*(fSize+fGapR);
    if(selectedFrame===i){stroke(frameDark[i]);strokeWeight(3);}
    else{stroke("#ddd");strokeWeight(1.5);}
    fill(frameColors[i]);circle(fx+fSize/2,fy+fSize/2,fSize);
    if(selectedFrame===i){fill(255,200);noStroke();circle(fx+fSize/2,fy+fSize/2,fSize*0.5);}
    pop();
  }

  drawCard(panelX,stripY+192,panelW,160,16);
  fill("#888");textSize(12);textAlign(LEFT,CENTER);
  text("📐 형식",panelX+12,stripY+210);
  let fmtIcons=["📏","⬛","🖥️","📷"];
  for(let i=0;i<4;i++){
    push();
    let fx=panelX+10+(i%2)*(panelW/2-8);
    let fy=stripY+224+floor(i/2)*42;
    if(selectedFormat===i){fill("#f3e5ff");stroke("#c8b4f8");strokeWeight(2);}
    else{fill("#fafafa");stroke("#eee");strokeWeight(1);}
    rect(fx,fy,panelW/2-16,36,10);
    noStroke();fill("#555");textSize(13);textAlign(CENTER,CENTER);
    text(fmtIcons[i]+" "+formatNames[i],fx+(panelW/2-16)/2,fy+18);
    pop();
  }

  // 버튼들
  let btnW=min(stripW,220),btnX=width/2-btnW/2,btnY=stripY+stripH+16;
  drawPinkBtn(btnX,btnY,btnW,50,"💾  저장하기");
  drawLightBtn(btnX,btnY+62,btnW,40,"🔄  다시 찍기");
  fill("#ddd");textSize(11);textAlign(CENTER,CENTER);
  text("S키 저장  |  R키 재촬영",width/2,btnY+116);
  pop();
}

function drawStickerOverlay(px,py,pw,ph,photoIndex){
  push();noStroke();
  let stickers=[
    [],
    [{x:0.1,y:0.1,s:"✦"},{x:0.85,y:0.08,s:"★"},{x:0.9,y:0.85,s:"✦"},{x:0.08,y:0.88,s:"✦"}],
    [{x:0.12,y:0.12,s:"💕"},{x:0.82,y:0.1,s:"💗"},{x:0.88,y:0.82,s:"💕"},{x:0.1,y:0.82,s:"💗"}],
    [{x:0.1,y:0.1,s:"🌸"},{x:0.84,y:0.08,s:"🌷"},{x:0.88,y:0.84,s:"🌸"},{x:0.08,y:0.86,s:"🌷"}],
    [{x:0.1,y:0.08,s:"🎀"},{x:0.82,y:0.06,s:"🎀"},{x:0.86,y:0.84,s:"✨"},{x:0.08,y:0.84,s:"✨"}],
  ];
  let list=stickers[selectedSticker];
  for(let s of list){
    textSize(min(pw*0.14,18));textAlign(CENTER,CENTER);
    text(s.s,px+pw*s.x,py+ph*s.y);
  }
  stroke(255,200);strokeWeight(1.5);noFill();
  let cs=12;
  line(px+4,py+4,px+4+cs,py+4); line(px+4,py+4,px+4,py+4+cs);
  line(px+pw-4,py+4,px+pw-4-cs,py+4); line(px+pw-4,py+4,px+pw-4,py+4+cs);
  line(px+4,py+ph-4,px+4+cs,py+ph-4); line(px+4,py+ph-4,px+4,py+ph-4-cs);
  line(px+pw-4,py+ph-4,px+pw-4-cs,py+ph-4); line(px+pw-4,py+ph-4,px+pw-4,py+ph-4-cs);
  pop();
}

function handleResultButtons(){
  let {w:stripW,photoH,pad,bot}=getStripDimensions();
  let gap=8,padTop=14,stripH=padTop+photoH*4+gap*3+bot;
  let stripX=width/2-stripW/2,stripY=60;
  let panelX=stripX+stripW+20,panelW=min(width-panelX-16,160);

  let fSize=min(panelW*0.18,28),fGapR=8;
  let fRowW=fSize*2+fGapR,fStartX=panelX+(panelW-fRowW)/2;
  for(let i=0;i<frameColors.length;i++){
    let fx=fStartX+(i%2)*(fSize+fGapR);
    let fy=stripY+36+floor(i/2)*(fSize+fGapR);
    if(dist(mouseX,mouseY,fx+fSize/2,fy+fSize/2)<fSize/2){selectedFrame=i;return;}
  }
  for(let i=0;i<4;i++){
    let fx=panelX+10+(i%2)*(panelW/2-8);
    let fy=stripY+224+floor(i/2)*42;
    if(mouseX>fx&&mouseX<fx+panelW/2-16&&mouseY>fy&&mouseY<fy+36){selectedFormat=i;return;}
  }
  let btnW=min(stripW,220),btnX=width/2-btnW/2,btnY=stripY+stripH+16;
  if(mouseX>btnX&&mouseX<btnX+btnW&&mouseY>btnY&&mouseY<btnY+50){saveResultCanvas();return;}
  if(mouseX>btnX&&mouseX<btnX+btnW&&mouseY>btnY+62&&mouseY<btnY+102){
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];currentScreen="camera";
  }
}

function saveResultCanvas(){
  let {w:stripW,photoH,pad,bot}=getStripDimensions();
  let gap=8,padTop=14,stripH=padTop+photoH*4+gap*3+bot;
  let g=createGraphics(stripW,stripH);
  g.rectMode(CORNER);g.textAlign(CENTER,CENTER);
  g.fill(frameColors[selectedFrame]);
  g.stroke(frameDark[selectedFrame]);g.strokeWeight(3);
  g.rect(0,0,stripW,stripH,14);
  for(let i=0;i<8;i++){g.fill(frameDark[selectedFrame]);g.noStroke();g.circle(14+i*stripW/7,8,5);}
  for(let i=0;i<4;i++){
    let px=pad,py=padTop+i*(photoH+gap),pw=stripW-pad*2;
    if(capturedPhotos[i]) g.image(capturedPhotos[i],px,py,pw,photoH);
    else{g.fill(220);g.noStroke();g.rect(px,py,pw,photoH,6);}
  }
  let d=new Date();
  let dateStr=d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0");
  g.noStroke();g.fill(100);g.textSize(11);g.text(dateStr,stripW/2,stripH-20);
  save(g,"4cut_"+formatNames[selectedFormat]+"_"+frameNames[selectedFrame]+".png");
  g.remove();
  currentScreen="saved";
}
