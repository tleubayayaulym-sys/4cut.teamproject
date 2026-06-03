// ============================================================
// result.js — 담당: 마이티투짱
// Avocado sticker themes for whole frame
// ============================================================

let selectedSticker   = 0; // sticker theme cho cả frame
let selectedPhotoFilter = 0; // aka selectedFormat for color tone

let toneNames2 = ["None","Warm","Cool","B&W","Vintage","Dreamy"];
let toneEmoji2 = ["🚫","🌅","❄️","🖤","📷","🌸"];

// Sticker theme names
let stickerThemeNames = ["None","Cute Avo","Sleepy Avo","Cool Avo","Love","Space","Nature"];
let stickerThemeIcons = ["🚫","🥑","😴","😎","💕","🪐","🌿"];

// ============================================================
// AVOCADO DRAWING FUNCTIONS (từ code của người dùng)
// ============================================================
function avocadoBody(x, y, s) {
  push(); translate(x, y); scale(s);
  fill("#253d20"); stroke(0); strokeWeight(7);
  beginShape();
  vertex(45, -165);
  bezierVertex(130,-120, 145,20, 110,115);
  bezierVertex(65,210, -70,200, -115,120);
  bezierVertex(-170,25, -125,-120, -40,-175);
  bezierVertex(0,-200, 35,-190, 45,-165);
  endShape(CLOSE);
  fill("#2d7a2f"); stroke(0); strokeWeight(7);
  beginShape();
  vertex(-20,-185);
  bezierVertex(70,-185, 125,-95, 115,40);
  bezierVertex(105,165, 20,220, -70,185);
  bezierVertex(-150,150, -160,35, -125,-70);
  bezierVertex(-95,-155, -60,-185, -20,-185);
  endShape(CLOSE);
  fill("#dff59b"); noStroke();
  beginShape();
  vertex(-20,-155);
  bezierVertex(50,-160, 92,-88, 90,35);
  bezierVertex(88,130, 18,178, -55,150);
  bezierVertex(-120,125, -128,38, -100,-48);
  bezierVertex(-78,-118, -52,-150, -20,-155);
  endShape(CLOSE);
  pop();
}

function avoSeed(x, y, s, c1, c2) {
  let col1 = c1 || "#9f5b18", col2 = c2 || "#d28a35";
  push(); translate(x, y); scale(s);
  fill(col1); stroke(0); strokeWeight(5); ellipse(0,55,105,135);
  fill(col2); noStroke(); ellipse(-10,25,52,55);
  pop();
}

// Cute avocado — type 1
function drawCuteAvo(x, y, s) {
  avocadoBody(x, y, s);
  avoSeed(x, y+10*s, s);
  push(); translate(x,y); scale(s);
  fill(0); noStroke();
  ellipse(-38,-75,26,34); ellipse(38,-75,26,34);
  fill(255); ellipse(-46,-84,8,8); ellipse(30,-84,8,8);
  noFill(); stroke(0); strokeWeight(4);
  arc(0,-65,25,25,0,PI);
  stroke(0); strokeWeight(5);
  bezier(-120,20,-170,-5,-155,55,-165,75);
  bezier(115,-20,160,-40,145,10,165,30);
  line(-38,180,-55,240); line(38,180,55,240);
  pop();
}

// Sleepy avocado — type 2
function drawSleepyAvo(x, y, s) {
  avocadoBody(x, y, s*0.95);
  avoSeed(x, y+20*s, s*0.95, "#4b351b","#b28a62");
  push(); translate(x,y); scale(s);
  stroke(0); strokeWeight(4);
  line(-45,-80,-18,-70); line(18,-70,45,-80);
  noFill(); arc(0,-58,32,32,0,PI);
  noStroke(); fill("#ff9ab0");
  ellipse(-58,-55,20,10); ellipse(58,-55,20,10);
  pop();
}

// Cool avocado — type 3
function drawCoolAvo(x, y, s) {
  avocadoBody(x, y, s*1.05);
  avoSeed(x, y+10*s, s*1.05,"#7b3f16","#b97735");
  push(); translate(x,y); scale(s);
  fill("#118c3a"); stroke(0); strokeWeight(5);
  line(0,-185,15,-230); ellipse(-30,-215,70,35);
  fill("#111"); noStroke(); rectMode(CENTER);
  rect(-45,-85,58,28,5); rect(45,-85,58,28,5);
  stroke("#111"); strokeWeight(5); line(-15,-85,15,-85);
  stroke(0); strokeWeight(4); line(-15,-45,20,-45);
  stroke(0); strokeWeight(5); noFill();
  bezier(-115,20,-165,-10,-160,60,-175,80);
  bezier(115,10,170,-10,165,50,180,55);
  line(-45,180,-60,230); line(45,180,65,230);
  pop();
}

// ============================================================
// Draw sticker theme on frame
// ============================================================
function drawFrameSticker(stripX, stripY, stripW, stripH, theme) {
  if (theme === 0) return;

  push();
  if (theme === 1) {
    // Cute Avo: 4 góc + giữa 2 bên
    drawCuteAvo(stripX + 2,          stripY - 10,         0.055);
    drawCuteAvo(stripX + stripW - 2, stripY - 10,         0.055);
    drawCuteAvo(stripX + 2,          stripY + stripH + 8, 0.055);
    drawCuteAvo(stripX + stripW - 2, stripY + stripH + 8, 0.055);
    drawCuteAvo(stripX + stripW/2,   stripY - 12,         0.065);
  } else if (theme === 2) {
    if (frameCount % 2 === 0) {
    drawSleepyAvo(stripX + 2,          stripY - 8,          0.055);
    drawSleepyAvo(stripX + stripW - 2, stripY - 8,          0.055);
    drawSleepyAvo(stripX + 2,          stripY + stripH + 8, 0.055);
    drawSleepyAvo(stripX + stripW - 2, stripY + stripH + 8, 0.055);
    drawSleepyAvo(stripX + stripW/2,   stripY - 10,         0.065);
    }
  } else if (theme === 3) {
    if (frameCount % 2 === 0) {
    drawCoolAvo(stripX + 2,          stripY - 8,          0.055);
    drawCoolAvo(stripX + stripW - 2, stripY - 8,          0.055);
    drawCoolAvo(stripX + 2,          stripY + stripH + 8, 0.055);
    drawCoolAvo(stripX + stripW - 2, stripY + stripH + 8, 0.055);
    drawCoolAvo(stripX + stripW/2,   stripY - 12,         0.065);
    }
  } else if (theme === 4) {
    // Love — emoji xung quanh frame
    let loveList = [
      {x:0.05,y:0.06,s:"💕",sz:16},{x:0.95,y:0.06,s:"💗",sz:16},
      {x:0.05,y:0.94,s:"💗",sz:16},{x:0.95,y:0.94,s:"💕",sz:16},
      {x:0.5, y:0.03,s:"🌸",sz:14},{x:0.5, y:0.97,s:"🌸",sz:14},
      {x:0.02,y:0.5, s:"✿", sz:13},{x:0.98,y:0.5, s:"✿", sz:13},
    ];
    noStroke(); textAlign(CENTER,CENTER);
    for (let i=0;i<loveList.length;i++){
      let e=loveList[i];
      let nhip=1+sin(frameCount*0.04+i)*0.1;
      textSize(e.sz*nhip);
      text(e.s, stripX+stripW*e.x, stripY+stripH*e.y);
    }
  } else if (theme === 5) {
    // Space
    let spaceList = [
      {x:0.05,y:0.05,s:"🪐",sz:18},{x:0.93,y:0.04,s:"⭐",sz:16},
      {x:0.04,y:0.93,s:"🌙",sz:17},{x:0.94,y:0.93,s:"🚀",sz:16},
      {x:0.5, y:0.03,s:"✦", sz:14},{x:0.5, y:0.97,s:"💫",sz:14},
    ];
    noStroke(); textAlign(CENTER,CENTER);
    for (let i=0;i<spaceList.length;i++){
      let e=spaceList[i];
      let nhip=1+sin(frameCount*0.04+i*0.8)*0.1;
      textSize(e.sz*nhip);
      text(e.s, stripX+stripW*e.x, stripY+stripH*e.y);
    }
  } else if (theme === 6) {
    // Nature
    let natureList = [
      {x:0.05,y:0.05,s:"🌿",sz:17},{x:0.93,y:0.05,s:"🌻",sz:17},
      {x:0.05,y:0.93,s:"🌸",sz:16},{x:0.93,y:0.93,s:"🍀",sz:16},
      {x:0.5, y:0.03,s:"🐝",sz:14},{x:0.5, y:0.97,s:"🌷",sz:14},
    ];
    noStroke(); textAlign(CENTER,CENTER);
    for (let i=0;i<natureList.length;i++){
      let e=natureList[i];
      let nhip=1+sin(frameCount*0.04+i*0.7)*0.08;
      textSize(e.sz*nhip);
      text(e.s, stripX+stripW*e.x, stripY+stripH*e.y);
    }
  }
  pop();
}

// ============================================================
function applyPhotoFilter(px,py,pw,ph) {
  if (selectedFormat===0) return;
  push(); noStroke(); blendMode(MULTIPLY);
  if      (selectedFormat===1){ fill(255,200,100,60);  rect(px,py,pw,ph); }
  else if (selectedFormat===2){ fill(100,160,255,55);  rect(px,py,pw,ph); }
  else if (selectedFormat===3){ fill(200,200,200,180); rect(px,py,pw,ph); }
  else if (selectedFormat===4){ fill(180,140,80,70);   rect(px,py,pw,ph); }
  else if (selectedFormat===5){ fill(255,180,220,50);  rect(px,py,pw,ph); }
  blendMode(BLEND);
  if(selectedFormat===4){
    for(let g=0;g<50;g++){
      stroke(200,180,120,random(15,35)); strokeWeight(0.5);
      point(px+random(pw),py+random(ph));
    }
  }
  pop();
}

function applyPhotoFilterSave(g,px,py,pw,ph) {
  if(selectedFormat===0) return;
  g.push(); g.noStroke(); g.blendMode(MULTIPLY);
  if      (selectedFormat===1){ g.fill(255,200,100,60);  g.rect(px,py,pw,ph); }
  else if (selectedFormat===2){ g.fill(100,160,255,55);  g.rect(px,py,pw,ph); }
  else if (selectedFormat===3){ g.fill(200,200,200,180); g.rect(px,py,pw,ph); }
  else if (selectedFormat===4){ g.fill(180,140,80,70);   g.rect(px,py,pw,ph); }
  else if (selectedFormat===5){ g.fill(255,180,220,50);  g.rect(px,py,pw,ph); }
  g.blendMode(BLEND); g.pop();
}

// ============================================================
function getLayoutConfig() {
  return (typeof layouts !== "undefined" && layouts[selectedLayout])
    ? layouts[selectedLayout] : {cols:1,rows:4,count:4,name:"4-Cut Strip"};
}

function calcPhotoPositions(stripX, stripY, stripW, photoH, pad, gap, L) {
  let positions = [];
  let pw = L.cols===4 ? (stripW-pad*2-gap*3)/4
         : L.cols===2 ? (stripW-pad*2-gap)/2
         : stripW-pad*2;
  for (let i=0; i<L.count; i++) {
    let px,py;
    if (L.cols===4){      px=stripX+pad+i*(pw+gap); py=stripY+pad; }
    else if (L.cols===2){ let col=i%2,row=floor(i/2); px=stripX+pad+col*(pw+gap); py=stripY+pad+row*(photoH+gap); }
    else {                px=stripX+pad; py=stripY+pad+i*(photoH+gap); }
    positions.push({px,py,pw,ph:photoH});
  }
  return positions;
}

// ============================================================

// ============================================================
// Helper: calculate consistent panel positions for draw + click
// ============================================================
function getPanelPositions(panW) {
  let pillW=(panW-30)/2, pillH=36, pillGap=8, pillRowGap=8;
  let toneBtnW=(panW-30)/3-4, toneBtnH=32;
  let pos = {};
  let sy = 82;

  // Frame color
  pos.frameY = sy;
  sy += ceil(frameColors.length/2)*(pillH+pillRowGap) + 22;

  // Sticker
  pos.stickerY = sy;
  sy += ceil(stickerThemeNames.length/2)*(pillH+pillRowGap) + 22;

  // Color tone label + buttons
  pos.toneLabelY = sy + 10;
  pos.toneY      = sy + 22;
  sy += 22 + ceil(6/3)*(toneBtnH+6) + 14;

  // Buttons
  pos.saveBtnY   = sy + 10;
  pos.retakeBtnY = sy + 62;

  pos.pillW=pillW; pos.pillH=pillH; pos.pillGap=pillGap; pos.pillRowGap=pillRowGap;
  pos.toneBtnW=toneBtnW; pos.toneBtnH=toneBtnH;
  return pos;
}

function drawResultScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let L      = getLayoutConfig();
  let divX   = width * 0.62;
  let margin = 20;
  let availH = height - 80;
  let pad=16, gap=6, bot=40;
  let photoH, stripW;

  if (L.cols===4){
    let cellW=(divX-margin*2-pad*2-gap*3)/4;
    photoH=cellW*0.75; stripW=pad*2+cellW*4+gap*3;
  } else if (L.cols===2){
    let cellW=min((divX-margin*2-pad*2-gap)/2, availH*0.48/0.75);
    photoH=cellW*0.75; stripW=pad*2+cellW*2+gap;
  } else {
    photoH=(availH-pad*2-gap*(L.rows-1)-bot)/L.rows;
    let cellW=min(photoH/0.75,(divX-margin*2-pad*2));
    photoH=cellW*0.75; stripW=pad*2+cellW;
  }

  let stripH = L.cols===4 ? pad*2+photoH+bot
             : L.cols===2 ? pad*2+photoH*ceil(L.count/2)+gap*(ceil(L.count/2)-1)+bot
             : pad*2+photoH*L.count+gap*(L.count-1)+bot;

  let stripX = divX/2 - stripW/2;
  let stripY = max((height-stripH)/2, 50);

  // Title
  push(); fill("#888"); textSize(13); noStroke();
  text("Photo Strip Preview", stripX+stripW/2, stripY-22);
  fill("#f0e6ff"); noStroke();
  rect(stripX+stripW/2-70,stripY-14,140,18,9);
  fill("#b366ff"); textSize(10);
  text("Layout: "+L.name+" ("+L.count+" photos)", stripX+stripW/2, stripY-5);
  pop();

  // Sticker theme — cache buffer để tránh vẽ lại bezier mỗi frame
  if (frameCount % 2 === 0 || selectedSticker > 3) drawFrameSticker(stripX, stripY, stripW, stripH, selectedSticker);

  // Shadow
  fill(180,150,200,40); noStroke(); rect(stripX+5,stripY+5,stripW,stripH,14);
  // Frame
  fill(frameColors[selectedFrame]); stroke(frameDark[selectedFrame]); strokeWeight(3);
  rect(stripX,stripY,stripW,stripH,10);

  // Photos
  let positions = calcPhotoPositions(stripX,stripY,stripW,photoH,pad,gap,L);
  for (let i=0; i<L.count; i++) {
    let {px,py,pw,ph}=positions[i];
    push(); fill(0,0,0,15); noStroke(); rect(px+2,py+2,pw,ph,5); pop();
    if (capturedPhotos[i]) {
      push(); imageMode(CORNER); image(capturedPhotos[i],px,py,pw,ph); pop();
      applyPhotoFilter(px,py,pw,ph);
    } else {
      push(); fill(225); noStroke(); rect(px,py,pw,ph,5);
      fill(170); textSize(10); text("No photo",px+pw/2,py+ph/2); pop();
    }
  }

  // Date
  push(); noStroke(); fill(100); textSize(9);
  let d=new Date();
  let ds=d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0");
  text(ds, stripX+stripW/2, stripY+stripH-12); pop();

  // ---- RIGHT PANEL ----
  let panX = divX+10, panW = width-panX-10;

  push(); fill("#333"); textSize(min(panW*0.1,18)); noStroke();
  text("Customize your photo strip", panX+panW/2, 40); pop();

  let pillW=(panW-30)/2, pillH=36, pillGap=8, pillRowGap=8;
  let scrollY=60;

  // Frame Color
  push(); fill("#888"); textSize(11); noStroke();
  text("Frame Colour", panX+panW/2, scrollY+10); pop();
  scrollY+=22;
  for (let i=0;i<frameColors.length;i++){
    push();
    let col=i%2, row=floor(i/2);
    let bx=panX+10+col*(pillW+pillGap);
    let by=scrollY+row*(pillH+pillRowGap);
    let isSel=(selectedFrame===i);
    let rc=color(frameColors[i]);
    fill(red(rc)*0.3+255*0.7, green(rc)*0.3+255*0.7, blue(rc)*0.3+255*0.7);
    if(isSel){stroke(frameDark[i]);strokeWeight(2.5);}
    else{stroke(220);strokeWeight(1);}
    rect(bx,by,pillW,pillH,pillH/2);
    noStroke(); fill(frameColors[i]); circle(bx+pillH*0.5,by+pillH/2,pillH*0.55);
    fill(isSel?frameDark[i]:"#555"); textSize(12); textAlign(LEFT,CENTER);
    text(frameNames[i], bx+pillH*0.9, by+pillH/2);
    if(isSel){fill(frameDark[i]);noStroke();circle(bx+pillW-14,by+pillH/2,14);fill(255);textSize(8);textAlign(CENTER,CENTER);text("✓",bx+pillW-14,by+pillH/2);}
    pop();
  }
  scrollY+=ceil(frameColors.length/2)*(pillH+pillRowGap)+12;

  // Sticker Theme
  push(); stroke(230); strokeWeight(1); noFill();
  line(panX+10,scrollY,panX+panW-10,scrollY); pop();
  scrollY+=10;
  push(); fill("#888"); textSize(11); noStroke();
  text("Sticker Theme", panX+panW/2, scrollY+10); pop();
  scrollY+=22;
  for (let i=0;i<stickerThemeNames.length;i++){
    push();
    let col=i%2, row=floor(i/2);
    let bx=panX+10+col*(pillW+pillGap);
    let by=scrollY+row*(pillH+pillRowGap);
    let isSel=(selectedSticker===i);
    if(isSel){fill("#fff0f5");stroke("#ff4d6d");strokeWeight(2.5);}
    else{fill(255,255,255,200);stroke(220);strokeWeight(1);}
    rect(bx,by,pillW,pillH,pillH/2);
    noStroke(); textSize(16); textAlign(CENTER,CENTER);
    text(stickerThemeIcons[i],bx+pillH*0.5,by+pillH/2);
    fill(isSel?"#ff4d6d":"#555"); textSize(11); textAlign(LEFT,CENTER);
    text(stickerThemeNames[i],bx+pillH*0.9,by+pillH/2);
    if(isSel){fill("#ff4d6d");noStroke();circle(bx+pillW-14,by+pillH/2,14);fill(255);textSize(8);textAlign(CENTER,CENTER);text("✓",bx+pillW-14,by+pillH/2);}
    pop();
  }
  scrollY+=ceil(stickerThemeNames.length/2)*(pillH+pillRowGap)+12;

  // Color Tone
  push(); stroke(230); strokeWeight(1); noFill();
  line(panX+10,scrollY,panX+panW-10,scrollY); pop();
  scrollY+=10;
  push(); fill("#888"); textSize(11); noStroke();
  text("Color Tone", panX+panW/2, scrollY+10); pop();
  scrollY+=22;
  let toneBtnW=(panW-30)/3-4, toneBtnH=32;
  for (let i=0;i<toneNames2.length;i++){
    push();
    let col=i%3, row=floor(i/3);
    let bx=panX+10+col*(toneBtnW+6);
    let by=scrollY+row*(toneBtnH+6);
    let isSel=(selectedFormat===i);
    if(isSel){fill("#ffe0f0");stroke("#ff4d6d");strokeWeight(2);}
    else{fill(255,255,255,180);stroke(220);strokeWeight(1);}
    rect(bx,by,toneBtnW,toneBtnH,toneBtnH/2);
    noStroke(); fill(isSel?"#ff4d6d":"#555");
    textSize(11); textAlign(CENTER,CENTER);
    text(toneEmoji2[i]+" "+toneNames2[i],bx+toneBtnW/2,by+toneBtnH/2);
    pop();
  }
  scrollY+=ceil(toneNames2.length/3)*(toneBtnH+6)+14;

  // Buttons
  push(); stroke(230); strokeWeight(1); noFill();
  line(panX+10,scrollY,panX+panW-10,scrollY); pop();
  scrollY+=10;
  drawPinkBtn(panX+10,scrollY,panW-20,44,"💾  Save Photo");
  drawLightBtn(panX+10,scrollY+52,panW-20,36,"🔄  Retake");

  pop();
}

// ============================================================
function handleResultButtons() {
  let L=getLayoutConfig();
  let divX=width*0.62, panX=divX+10, panW=width-panX-10;
  let P = getPanelPositions(panW);
  let pillW=(panW-30)/2, pillH=36, pillGap=8, pillRowGap=8;
  // Mirror drawResultScreen exactly
  let scrollY=60;
  scrollY+=22; // frame label
  // frame pills
  for(let i=0;i<frameColors.length;i++){
    let col=i%2,row=floor(i/2);
    let bx=panX+10+col*(pillW+pillGap), by=scrollY+row*(pillH+pillRowGap);
    if(mouseX>bx&&mouseX<bx+pillW&&mouseY>by&&mouseY<by+pillH){ selectedFrame=i; return; }
  }
  scrollY+=ceil(frameColors.length/2)*(pillH+pillRowGap)+12+10+22; // +12 pills, +10 divider, +22 label

  // Sticker theme
  for(let i=0;i<stickerThemeNames.length;i++){
    let col=i%2,row=floor(i/2);
    let bx=panX+10+col*(pillW+pillGap), by=scrollY+row*(pillH+pillRowGap);
    if(mouseX>bx&&mouseX<bx+pillW&&mouseY>by&&mouseY<by+pillH){ selectedSticker=i; return; }
  }
  scrollY+=ceil(stickerThemeNames.length/2)*(pillH+pillRowGap)+12+10+22; // +12 pills, +10 divider, +22 label

  // Color tone
  let toneBtnW=(panW-30)/3-4, toneBtnH=32;
  for(let i=0;i<toneNames2.length;i++){
    let col=i%3,row=floor(i/3);
    let bx=panX+10+col*(toneBtnW+6), by=scrollY+row*(toneBtnH+6);
    if(mouseX>bx&&mouseX<bx+toneBtnW&&mouseY>by&&mouseY<by+toneBtnH){ selectedFormat=i; return; }
  }
  scrollY+=ceil(toneNames2.length/3)*(toneBtnH+6)+14+10; // +14, +10 divider

  // Buttons
  if(mouseX>panX+10&&mouseX<panX+panW-10&&mouseY>scrollY&&mouseY<scrollY+44){
    saveResultCanvas(); return;
  }
  if(mouseX>panX+10&&mouseX<panX+panW-10&&mouseY>scrollY+52&&mouseY<scrollY+88){
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];
    selectedSticker=0; currentScreen="camera";
  }
}

// ============================================================
function saveResultCanvas() {
  let L=getLayoutConfig();
  let pad=8,gap=5,bot=32,cellW=160;
  let photoH=cellW*0.75;
  let stripW = L.cols===4 ? pad*2+cellW*4+gap*3
             : L.cols===2 ? pad*2+cellW*2+gap
             : pad*2+cellW;
  let stripH = L.cols===4 ? pad*2+photoH+bot
             : L.cols===2 ? pad*2+photoH*ceil(L.count/2)+gap*(ceil(L.count/2)-1)+bot
             : pad*2+photoH*L.count+gap*(L.count-1)+bot;

  let g=createGraphics(stripW,stripH);
  g.rectMode(CORNER); g.textAlign(CENTER,CENTER);
  g.fill(frameColors[selectedFrame]); g.stroke(frameDark[selectedFrame]); g.strokeWeight(3);
  g.rect(0,0,stripW,stripH,10);

  let fakePosns=calcPhotoPositions(0,0,stripW,photoH,pad,gap,L);
  for(let i=0;i<L.count;i++){
    let {px,py,pw,ph}=fakePosns[i];
    if(capturedPhotos[i]){
      g.push();g.imageMode(CORNER);g.image(capturedPhotos[i],px,py,pw,ph);g.pop();
      applyPhotoFilterSave(g,px,py,pw,ph);
    } else {
      g.push();g.fill(220);g.noStroke();g.rect(px,py,pw,ph,5);g.pop();
    }
  }
  let d=new Date();
  let ds=d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0");
  g.noStroke();g.fill(100);g.textSize(9);g.text(ds,stripW/2,stripH-12);
  save(g,"4cut_"+frameNames[selectedFrame]+".png");
  g.remove();
  currentScreen="saved";
}
