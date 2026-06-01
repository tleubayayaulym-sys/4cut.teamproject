// ============================================================
// result.js — 담당: 마이티투짱
// Per-photo sticker, bigger preview, 10 frame colors
// ============================================================

// Per-photo sticker: mỗi ảnh có sticker riêng
let photoStickers    = [0, 0, 0, 0, 0, 0]; // sticker index cho từng ảnh
let activePhotoIndex = 0; // ảnh đang được chọn để edit

// Color filter (selectedFormat dùng chung)
let toneNames2 = ["None","Warm","Cool","B&W","Vintage","Dreamy"];

// 10 Sticker sets
let stickerSets = [
  [],  // 0: None
  [{x:0.08,y:0.06,s:"🎀",sz:0.18},{x:0.82,y:0.04,s:"🪞",sz:0.15},{x:0.88,y:0.82,s:"🦋",sz:0.16},{x:0.04,y:0.84,s:"✨",sz:0.14},{x:0.5,y:0.05,s:"🎀",sz:0.12}],
  [{x:0.08,y:0.08,s:"💕",sz:0.16},{x:0.84,y:0.06,s:"🌸",sz:0.17},{x:0.9,y:0.86,s:"💗",sz:0.15},{x:0.05,y:0.88,s:"🌷",sz:0.16},{x:0.45,y:0.06,s:"✿",sz:0.14},{x:0.88,y:0.44,s:"💫",sz:0.13}],
  [{x:0.82,y:0.04,s:"🪐",sz:0.20},{x:0.06,y:0.06,s:"⭐",sz:0.16},{x:0.88,y:0.84,s:"🌙",sz:0.17},{x:0.05,y:0.82,s:"🚀",sz:0.16},{x:0.5,y:0.04,s:"✦",sz:0.12},{x:0.86,y:0.44,s:"💫",sz:0.13}],
  [{x:0.06,y:0.04,s:"🍦",sz:0.18},{x:0.82,y:0.06,s:"☕",sz:0.17},{x:0.86,y:0.82,s:"🧁",sz:0.18},{x:0.04,y:0.82,s:"🍓",sz:0.16},{x:0.5,y:0.04,s:"🍰",sz:0.14}],
  [{x:0.06,y:0.06,s:"✦",sz:0.16},{x:0.86,y:0.04,s:"★",sz:0.18},{x:0.9,y:0.86,s:"✦",sz:0.15},{x:0.04,y:0.88,s:"✿",sz:0.16},{x:0.5,y:0.05,s:"◆",sz:0.12},{x:0.88,y:0.46,s:"✦",sz:0.11}],
  [{x:0.08,y:0.06,s:"🌈",sz:0.18},{x:0.84,y:0.04,s:"⭐",sz:0.16},{x:0.88,y:0.84,s:"🌟",sz:0.17},{x:0.04,y:0.84,s:"☁️",sz:0.18},{x:0.46,y:0.05,s:"🌤",sz:0.14}],
  [{x:0.06,y:0.06,s:"🐝",sz:0.16},{x:0.84,y:0.05,s:"🌻",sz:0.18},{x:0.88,y:0.84,s:"🍀",sz:0.17},{x:0.04,y:0.84,s:"🌿",sz:0.16},{x:0.5,y:0.05,s:"🌸",sz:0.14}],
  [{x:0.06,y:0.06,s:"🎵",sz:0.16},{x:0.84,y:0.04,s:"🎶",sz:0.18},{x:0.88,y:0.84,s:"🎸",sz:0.16},{x:0.04,y:0.84,s:"🎹",sz:0.16},{x:0.48,y:0.05,s:"🎤",sz:0.14}],
  [{x:0.06,y:0.05,s:"🐱",sz:0.18},{x:0.84,y:0.04,s:"🐶",sz:0.18},{x:0.88,y:0.84,s:"🐰",sz:0.17},{x:0.04,y:0.84,s:"🦊",sz:0.17},{x:0.48,y:0.05,s:"🐻",sz:0.14}],
];
let stickerNames = ["None","Girlypop","Love","Space","Food","Vintage","Rainbow","Nature","Music","Pets"];
let stickerIcons = ["🚫","🎀","💕","🪐","🍦","✦","🌈","🌿","🎵","🐱"];

// ============================================================
function applyPhotoFilter(px, py, pw, ph) {
  if (selectedFormat === 0) return;
  push(); noStroke(); blendMode(MULTIPLY);
  if      (selectedFormat===1) { fill(255,200,100,60);  rect(px,py,pw,ph); }
  else if (selectedFormat===2) { fill(100,160,255,55);  rect(px,py,pw,ph); }
  else if (selectedFormat===3) { fill(200,200,200,180); rect(px,py,pw,ph); }
  else if (selectedFormat===4) { fill(180,140,80,70);   rect(px,py,pw,ph); }
  else if (selectedFormat===5) { fill(255,180,220,50);  rect(px,py,pw,ph); }
  blendMode(BLEND);
  if (selectedFormat===4) {
    for(let g=0;g<60;g++){
      stroke(200,180,120,random(15,40)); strokeWeight(0.5);
      point(px+random(pw), py+random(ph));
    }
  }
  pop();
}

function applyPhotoFilterSave(g, px, py, pw, ph) {
  if (selectedFormat===0) return;
  g.push(); g.noStroke(); g.blendMode(MULTIPLY);
  if      (selectedFormat===1) { g.fill(255,200,100,60);  g.rect(px,py,pw,ph); }
  else if (selectedFormat===2) { g.fill(100,160,255,55);  g.rect(px,py,pw,ph); }
  else if (selectedFormat===3) { g.fill(200,200,200,180); g.rect(px,py,pw,ph); }
  else if (selectedFormat===4) { g.fill(180,140,80,70);   g.rect(px,py,pw,ph); }
  else if (selectedFormat===5) { g.fill(255,180,220,50);  g.rect(px,py,pw,ph); }
  g.blendMode(BLEND); g.pop();
}

// ============================================================
function getPhotoLayout() {
  let L = layouts[selectedLayout] || layouts[0];
  let base = min(height*0.65, 320);
  let photoH, pw, ph;
  if (L.cols===1) {
    pw = base*0.5;
    ph = base/L.rows;
  } else {
    pw = base*0.9/L.cols;
    ph = pw*0.75;
  }
  return {L, pw, ph, base};
}

// ============================================================
function drawResultScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let panelW   = min(width*0.3, 220);
  let panelX   = width - panelW - 10;
  let photoAreaW = panelX - 10;

  // Title
  fill("#c8b4f8"); textSize(min(width*0.035,20));
  text("✨  Your Photos", photoAreaW/2+5, 28);

  // --- LEFT: Photo strip (BIGGER) ---
  let {L, pw, ph} = getPhotoLayout();
  let count     = min(capturedPhotos.length, L.count);
  let gap       = 6;
  let padTop    = 12, pad = 10, bot = 36;
  let stripW, stripH;

  if (L.cols===4) {
    stripW = pad*2 + pw*L.cols + gap*(L.cols-1);
    stripH = padTop + ph + bot;
  } else if (L.cols===2) {
    stripW = pad*2 + pw*2 + gap;
    stripH = padTop + ph*ceil(L.count/2) + gap*(ceil(L.count/2)-1) + bot;
  } else {
    stripW = pad*2 + pw;
    stripH = padTop + ph*L.count + gap*(L.count-1) + bot;
  }

  let stripX = photoAreaW/2 - stripW/2;
  let stripY = 44;

  // Strip shadow + frame
  fill(180,150,200,50); noStroke(); rect(stripX+5,stripY+5,stripW,stripH,14);
  fill(frameColors[selectedFrame]); stroke(frameDark[selectedFrame]); strokeWeight(3);
  rect(stripX,stripY,stripW,stripH,10);

  // Dot decoration
  push(); noStroke();
  for(let i=0;i<6;i++){
    fill(frameDark[selectedFrame]);
    circle(stripX+10+i*stripW/6, stripY+7, 4);
  }
  pop();

  // Photos
  for (let i=0; i<L.count; i++) {
    let px, py, ppw=pw, pph=ph;
    if (L.cols===4) {
      px = stripX+pad+i*(pw+gap); py = stripY+padTop;
    } else if (L.cols===2) {
      let col=i%2, row=floor(i/2);
      px=stripX+pad+col*(pw+gap); py=stripY+padTop+row*(ph+gap);
    } else {
      px=stripX+pad; py=stripY+padTop+i*(ph+gap);
    }

    push(); fill(0,0,0,16); noStroke(); rect(px+2,py+2,ppw,pph,6); pop();

    let isActive = (i === activePhotoIndex);
    if (capturedPhotos[i]) {
      push(); imageMode(CORNER); image(capturedPhotos[i],px,py,ppw,pph); pop();
      applyPhotoFilter(px,py,ppw,pph);
      let si = photoStickers[i] || 0;
      if (si>0) drawStickerOverlayOnPhoto(px,py,ppw,pph,si);
      // Active highlight
      if (isActive) {
        push(); noFill(); stroke("#ff4d6d"); strokeWeight(3);
        rect(px-2,py-2,ppw+4,pph+4,7); pop();
        push(); fill("#ff4d6d"); noStroke(); circle(px+ppw-10,py+10,20);
        fill(255); textSize(10); text("✎",px+ppw-10,py+10); pop();
      } else {
        push(); noFill(); stroke(255,255,255,80); strokeWeight(1.5);
        rect(px,py,ppw,pph,4); pop();
      }
    } else {
      push(); fill(220); noStroke(); rect(px,py,ppw,pph,6);
      fill(160); textSize(11); text("No photo",px+ppw/2,py+pph/2); pop();
    }
  }

  // Date
  push(); noStroke(); fill(80); textSize(10);
  let d=new Date();
  let ds=d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0");
  text(ds, stripX+stripW/2, stripY+stripH-16); pop();

  // Tap hint
  push(); fill("#aaa"); textSize(10); noStroke();
  text("Tap a photo to add sticker", photoAreaW/2+5, stripY+stripH+14); pop();

  // --- RIGHT PANEL ---
  drawCard(panelX, 40, panelW, height-50, 16);

  let ry = 58;
  push(); fill("#888"); textSize(11); textAlign(LEFT,CENTER);
  text("🎨 Frame Color", panelX+10, ry); pop();

  // 10 frame colors — 5x2 grid
  let fSize=min(panelW*0.17,28), fGapR=5;
  let fPerRow=5;
  for (let i=0; i<frameColors.length; i++) {
    push();
    let col=i%fPerRow, row=floor(i/fPerRow);
    let fx=panelX+8+col*(fSize+fGapR);
    let fy=ry+14+row*(fSize+fGapR+12);
    if(selectedFrame===i){stroke(frameDark[i]);strokeWeight(3);}
    else{stroke("#ddd");strokeWeight(1.5);}
    fill(frameColors[i]); circle(fx+fSize/2,fy+fSize/2,fSize);
    if(selectedFrame===i){fill(255,200);noStroke();circle(fx+fSize/2,fy+fSize/2,fSize*0.38);}
    noStroke();fill(selectedFrame===i?frameDark[i]:"#bbb");
    textSize(7);textAlign(CENTER,CENTER);text(frameNames[i],fx+fSize/2,fy+fSize+7);
    pop();
  }

  ry += 100;

  // Sticker for active photo
  push(); fill("#888"); textSize(11); textAlign(LEFT,CENTER);
  text("🌟 Sticker (Photo "+(activePhotoIndex+1)+")", panelX+10, ry); pop();

  let stkSize = min(panelW*0.18,30), stkGap=4;
  let stkPerRow=floor((panelW-16)/(stkSize+stkGap));
  for (let i=0; i<stickerSets.length; i++) {
    push();
    let col=i%stkPerRow, row=floor(i/stkPerRow);
    let sx=panelX+8+col*(stkSize+stkGap);
    let sy=ry+14+row*(stkSize+stkGap+10);
    let isSel=(photoStickers[activePhotoIndex]===i);
    if(isSel){fill("#fff0f5");stroke("#ffb6c1");strokeWeight(2);}
    else{fill("#fafafa");stroke("#eee");strokeWeight(1);}
    rect(sx,sy,stkSize,stkSize,7);
    noStroke();fill("#333");textSize(stkSize*0.5);textAlign(CENTER,CENTER);
    text(stickerIcons[i],sx+stkSize/2,sy+stkSize/2-2);
    textSize(7);fill(isSel?"#ff4d6d":"#aaa");
    text(stickerNames[i],sx+stkSize/2,sy+stkSize+6);
    pop();
  }

  ry += 14 + ceil(stickerSets.length/stkPerRow)*(stkSize+stkGap+10) + 8;

  // Buttons
  drawPinkBtn(panelX, ry,    panelW, 42, "💾  Save");
  drawLightBtn(panelX, ry+50, panelW, 36, "🔄  Retake");
  push(); fill("#ddd"); textSize(9); textAlign(CENTER,CENTER);
  text("S = save  |  R = retake", panelX+panelW/2, ry+95); pop();

  pop();
}

// ============================================================
function drawStickerOverlayOnPhoto(px,py,pw,ph,stickerIndex) {
  let list = stickerSets[stickerIndex]||[];
  if(!list.length) return;
  noStroke(); textAlign(CENTER,CENTER);
  for(let i=0;i<list.length;i++){
    let s   = list[i];
    let sz  = min(pw*(s.sz||0.15),22);
    let nhip = 1+sin(frameCount*0.04+s.x*10)*0.08;
    textSize(sz*nhip);
    text(s.s, px+pw*s.x, py+ph*s.y);
  }
}

function saveStickerOverlay(g,px,py,pw,ph,stickerIndex) {
  let list = stickerSets[stickerIndex]||[];
  if(!list.length) return;
  for(let s of list){
    let sz=min(pw*(s.sz||0.15),22);
    g.push();g.noStroke();g.textAlign(CENTER,CENTER);
    g.textSize(sz);g.text(s.s,px+pw*s.x,py+ph*s.y);g.pop();
  }
}

// ============================================================
function handleResultButtons() {
  let panelW=min(width*0.3,220), panelX=width-panelW-10;
  let photoAreaW=panelX-10;
  let {L,pw,ph}=getPhotoLayout();
  let gap=6,padTop=12,pad=10,bot=36;
  let stripW,stripH;
  if(L.cols===4){ stripW=pad*2+pw*L.cols+gap*(L.cols-1); stripH=padTop+ph+bot; }
  else if(L.cols===2){ stripW=pad*2+pw*2+gap; stripH=padTop+ph*ceil(L.count/2)+gap*(ceil(L.count/2)-1)+bot; }
  else{ stripW=pad*2+pw; stripH=padTop+ph*L.count+gap*(L.count-1)+bot; }
  let stripX=photoAreaW/2-stripW/2, stripY=44;

  // Click on photo
  for(let i=0;i<L.count;i++){
    let px,py;
    if(L.cols===4){ px=stripX+pad+i*(pw+gap); py=stripY+padTop; }
    else if(L.cols===2){ let col=i%2,row=floor(i/2); px=stripX+pad+col*(pw+gap); py=stripY+padTop+row*(ph+gap); }
    else{ px=stripX+pad; py=stripY+padTop+i*(ph+gap); }
    if(mouseX>px&&mouseX<px+pw&&mouseY>py&&mouseY<py+ph&&capturedPhotos[i]){
      activePhotoIndex=i; return;
    }
  }

  let ry=58;
  // Frame color
  let fSize=min(panelW*0.17,28), fGapR=5, fPerRow=5;
  for(let i=0;i<frameColors.length;i++){
    let col=i%fPerRow, row=floor(i/fPerRow);
    let fx=panelX+8+col*(fSize+fGapR);
    let fy=ry+14+row*(fSize+fGapR+12);
    if(dist(mouseX,mouseY,fx+fSize/2,fy+fSize/2)<fSize/2){ selectedFrame=i; return; }
  }
  ry+=100;

  // Sticker
  let stkSize=min(panelW*0.18,30), stkGap=4;
  let stkPerRow=floor((panelW-16)/(stkSize+stkGap));
  for(let i=0;i<stickerSets.length;i++){
    let col=i%stkPerRow, row=floor(i/stkPerRow);
    let sx=panelX+8+col*(stkSize+stkGap);
    let sy=ry+14+row*(stkSize+stkGap+10);
    if(mouseX>sx&&mouseX<sx+stkSize&&mouseY>sy&&mouseY<sy+stkSize){
      photoStickers[activePhotoIndex]=i; return;
    }
  }
  ry+=14+ceil(stickerSets.length/stkPerRow)*(stkSize+stkGap+10)+8;

  if(mouseX>panelX&&mouseX<panelX+panelW&&mouseY>ry&&mouseY<ry+42){ saveResultCanvas(); return; }
  if(mouseX>panelX&&mouseX<panelX+panelW&&mouseY>ry+50&&mouseY<ry+86){
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];
    photoStickers=[0,0,0,0,0,0]; currentScreen="camera";
  }
}

// ============================================================
function saveResultCanvas() {
  let {L,pw,ph}=getPhotoLayout();
  let gap=6,padTop=12,pad=10,bot=36;
  let stripW,stripH;
  if(L.cols===4){ stripW=pad*2+pw*L.cols+gap*(L.cols-1); stripH=padTop+ph+bot; }
  else if(L.cols===2){ stripW=pad*2+pw*2+gap; stripH=padTop+ph*ceil(L.count/2)+gap*(ceil(L.count/2)-1)+bot; }
  else{ stripW=pad*2+pw; stripH=padTop+ph*L.count+gap*(L.count-1)+bot; }

  let g=createGraphics(stripW,stripH);
  g.rectMode(CORNER); g.textAlign(CENTER,CENTER);
  g.fill(frameColors[selectedFrame]); g.stroke(frameDark[selectedFrame]); g.strokeWeight(3);
  g.rect(0,0,stripW,stripH,10);
  for(let i=0;i<6;i++){ g.fill(frameDark[selectedFrame]);g.noStroke();g.circle(10+i*stripW/6,7,4); }

  for(let i=0;i<L.count;i++){
    let px,py,ppw=pw,pph=ph;
    if(L.cols===4){ px=pad+i*(pw+gap); py=padTop; }
    else if(L.cols===2){ let col=i%2,row=floor(i/2); px=pad+col*(pw+gap); py=padTop+row*(ph+gap); }
    else{ px=pad; py=padTop+i*(ph+gap); }

    if(capturedPhotos[i]){
      g.push();g.imageMode(CORNER);g.image(capturedPhotos[i],px,py,ppw,pph);g.pop();
      applyPhotoFilterSave(g,px,py,ppw,pph);
      let si=photoStickers[i]||0;
      if(si>0) saveStickerOverlay(g,px,py,ppw,pph,si);
    } else {
      g.push();g.fill(220);g.noStroke();g.rect(px,py,ppw,pph,6);g.pop();
    }
  }

  let d=new Date();
  let ds=d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0");
  g.noStroke();g.fill(80);g.textSize(10);g.text(ds,stripW/2,stripH-16);

  save(g,"4cut_"+frameNames[selectedFrame]+".png");
  g.remove();
  currentScreen="saved";
}
