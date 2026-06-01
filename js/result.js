// ============================================================
// result.js — 담당: 마이티투짱
// Style: picapicabooth — large photo left, clean panel right
// ============================================================

let photoStickers    = [0,0,0,0,0,0];
let activePhotoIndex = 0;

let toneNames2 = ["None","Warm","Cool","B&W","Vintage","Dreamy"];
let toneEmoji2 = ["🚫","🌅","❄️","🖤","📷","🌸"];

let stickerSets = [
  [],
  [{x:0.08,y:0.06,s:"🎀",sz:0.18},{x:0.82,y:0.04,s:"🪞",sz:0.15},{x:0.88,y:0.82,s:"🦋",sz:0.16},{x:0.04,y:0.84,s:"✨",sz:0.14},{x:0.5,y:0.05,s:"🎀",sz:0.12}],
  [{x:0.08,y:0.08,s:"💕",sz:0.16},{x:0.84,y:0.06,s:"🌸",sz:0.17},{x:0.9,y:0.86,s:"💗",sz:0.15},{x:0.05,y:0.88,s:"🌷",sz:0.16},{x:0.45,y:0.06,s:"✿",sz:0.14},{x:0.88,y:0.44,s:"💫",sz:0.13}],
  [{x:0.82,y:0.04,s:"🪐",sz:0.20},{x:0.06,y:0.06,s:"⭐",sz:0.16},{x:0.88,y:0.84,s:"🌙",sz:0.17},{x:0.05,y:0.82,s:"🚀",sz:0.16},{x:0.5,y:0.04,s:"✦",sz:0.12}],
  [{x:0.06,y:0.04,s:"🍦",sz:0.18},{x:0.82,y:0.06,s:"☕",sz:0.17},{x:0.86,y:0.82,s:"🧁",sz:0.18},{x:0.04,y:0.82,s:"🍓",sz:0.16},{x:0.5,y:0.04,s:"🍰",sz:0.14}],
  [{x:0.06,y:0.06,s:"✦",sz:0.16},{x:0.86,y:0.04,s:"★",sz:0.18},{x:0.9,y:0.86,s:"✦",sz:0.15},{x:0.04,y:0.88,s:"✿",sz:0.16},{x:0.5,y:0.05,s:"◆",sz:0.12}],
  [{x:0.08,y:0.06,s:"🌈",sz:0.18},{x:0.84,y:0.04,s:"⭐",sz:0.16},{x:0.88,y:0.84,s:"🌟",sz:0.17},{x:0.04,y:0.84,s:"☁️",sz:0.18},{x:0.46,y:0.05,s:"🌤",sz:0.14}],
  [{x:0.06,y:0.06,s:"🐝",sz:0.16},{x:0.84,y:0.05,s:"🌻",sz:0.18},{x:0.88,y:0.84,s:"🍀",sz:0.17},{x:0.04,y:0.84,s:"🌿",sz:0.16},{x:0.5,y:0.05,s:"🌸",sz:0.14}],
  [{x:0.06,y:0.06,s:"🎵",sz:0.16},{x:0.84,y:0.04,s:"🎶",sz:0.18},{x:0.88,y:0.84,s:"🎸",sz:0.16},{x:0.04,y:0.84,s:"🎹",sz:0.16},{x:0.48,y:0.05,s:"🎤",sz:0.14}],
  [{x:0.06,y:0.05,s:"🐱",sz:0.18},{x:0.84,y:0.04,s:"🐶",sz:0.18},{x:0.88,y:0.84,s:"🐰",sz:0.17},{x:0.04,y:0.84,s:"🦊",sz:0.17},{x:0.48,y:0.05,s:"🐻",sz:0.14}],
];
let stickerNames = ["None","Girlypop","Love","Space","Food","Vintage","Rainbow","Nature","Music","Pets"];
let stickerIcons = ["🚫","🎀","💕","🪐","🍦","✦","🌈","🌿","🎵","🐱"];

// ============================================================
// Layout helpers
// ============================================================
function getLayoutConfig() {
  let L = (typeof layouts !== "undefined" && layouts[selectedLayout])
    ? layouts[selectedLayout] : {cols:1,rows:4,count:4};
  return L;
}

function calcPhotoPositions(stripX, stripY, stripW, photoH, pad, gap, L) {
  let positions = [];
  let pw;
  if (L.cols===4)      pw = (stripW-pad*2-gap*3)/4;
  else if (L.cols===2) pw = (stripW-pad*2-gap)/2;
  else                 pw = stripW-pad*2;

  for (let i=0; i<L.count; i++) {
    let px,py;
    if (L.cols===4){
      px=stripX+pad+i*(pw+gap); py=stripY+pad;
    } else if (L.cols===2){
      let col=i%2, row=floor(i/2);
      px=stripX+pad+col*(pw+gap); py=stripY+pad+row*(photoH+gap);
    } else {
      px=stripX+pad; py=stripY+pad+i*(photoH+gap);
    }
    positions.push({px,py,pw,ph:photoH});
  }
  return positions;
}

// ============================================================
// Photo filter
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
// MAIN RESULT SCREEN
// ============================================================
function drawResultScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke();

  let L        = getLayoutConfig();
  let margin   = 20;
  let divX     = width * 0.52; // divider: left 52% photo, right 48% panel

  // ---- LEFT: Photo Strip ----
  let availH   = height - 80;
  let photoH, stripW, pad=8, gap=5, bot=32;
  if (L.cols===4){
    let maxW = divX - margin*2;
    let cellW = (maxW - pad*2 - gap*3) / 4;
    photoH  = cellW * 0.75;
    stripW  = pad*2 + cellW*4 + gap*3;
  } else if (L.cols===2){
    let cellW = min((divX-margin*2-pad*2-gap)/2, availH*0.45/0.75);
    photoH  = cellW * 0.75;
    stripW  = pad*2 + cellW*2 + gap;
  } else {
    photoH  = (availH - pad*2 - gap*(L.rows-1) - bot) / L.rows;
    let cellW = min(photoH/0.75, (divX-margin*2-pad*2));
    photoH  = cellW * 0.75;
    stripW  = pad*2 + cellW;
  }

  let stripH;
  if (L.cols===4)      stripH = pad*2 + photoH + bot;
  else if (L.cols===2) stripH = pad*2 + photoH*ceil(L.count/2) + gap*(ceil(L.count/2)-1) + bot;
  else                 stripH = pad*2 + photoH*L.count + gap*(L.count-1) + bot;

  let stripX = divX/2 - stripW/2;
  let stripY = (height - stripH) / 2;
  if (stripY < 50) stripY = 50;

  // Strip title
  push(); fill("#888"); textSize(13); textAlign(CENTER,CENTER); noStroke();
  text("Photo Strip Preview", stripX+stripW/2, stripY-22);
  // Layout badge
  fill("#f0e6ff"); stroke("#d4b3ff"); strokeWeight(1); noStroke();
  rect(stripX+stripW/2-70, stripY-14, 140, 18, 9);
  fill("#b366ff"); textSize(10);
  text("Layout: "+L.name+" ("+L.count+" photos)", stripX+stripW/2, stripY-5);
  pop();

  // Shadow
  fill(180,150,200,45); noStroke(); rect(stripX+5,stripY+5,stripW,stripH,14);

  // Frame background
  fill(frameColors[selectedFrame]);
  stroke(frameDark[selectedFrame]); strokeWeight(3);
  rect(stripX,stripY,stripW,stripH,12);

  // Photos
  let positions = calcPhotoPositions(stripX,stripY,stripW,photoH,pad,gap,L);
  for (let i=0; i<L.count; i++) {
    let {px,py,pw,ph} = positions[i];
    let isActive = (i===activePhotoIndex);

    push(); fill(0,0,0,15); noStroke(); rect(px+2,py+2,pw,ph,5); pop();

    if (capturedPhotos[i]) {
      push(); imageMode(CORNER); image(capturedPhotos[i],px,py,pw,ph); pop();
      applyPhotoFilter(px,py,pw,ph);
      let si = photoStickers[i]||0;
      if (si>0) drawStickerOnPhoto(px,py,pw,ph,si);

      if (isActive) {
        push(); noFill(); stroke("#ff4d6d"); strokeWeight(3); rect(px-2,py-2,pw+4,ph+4,7); pop();
        push(); fill("#ff4d6d"); noStroke(); circle(px+pw-10,py+10,20);
        fill(255); textSize(10); textAlign(CENTER,CENTER); text("✎",px+pw-10,py+10); pop();
      } else {
        push(); fill(0,0,0,0); stroke(255,255,255,60); strokeWeight(1); rect(px,py,pw,ph,4); pop();
      }
    } else {
      push(); fill(225); noStroke(); rect(px,py,pw,ph,5);
      fill(170); textSize(10); textAlign(CENTER,CENTER); text("No photo",px+pw/2,py+ph/2); pop();
    }
  }

  // Date
  push(); noStroke(); fill(100); textSize(9); textAlign(CENTER,CENTER);
  let d=new Date();
  let ds=d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0");
  text(ds, stripX+stripW/2, stripY+stripH-12); pop();

  // Tap hint
  push(); fill("#bbb"); textSize(10); noStroke(); textAlign(CENTER,CENTER);
  text("↑ Tap a photo to edit its sticker", stripX+stripW/2, stripY+stripH+14); pop();

  // ---- RIGHT: Customize Panel ----
  let panX = divX + 10;
  let panW = width - panX - 10;

  // Panel title
  push(); fill("#333"); textSize(min(panW*0.1,18)); textAlign(CENTER,CENTER); noStroke();
  text("Customize your photo strip", panX+panW/2, 40); pop();

  let scrollY = 60; // current Y in right panel

  // -- Frame Color --
  push(); fill("#888"); textSize(11); textAlign(CENTER,CENTER); noStroke();
  text("Frame Colour", panX+panW/2, scrollY+10); pop();
  scrollY += 22;

  // Pill buttons 2 columns
  let pillW = (panW-30)/2, pillH = 36, pillGap = 8, pillRowGap = 8;
  for (let i=0; i<frameColors.length; i++) {
    push();
    let col = i%2, row = floor(i/2);
    let bx = panX+10 + col*(pillW+pillGap);
    let by = scrollY + row*(pillH+pillRowGap);
    let isSel = (selectedFrame===i);
    // Background: tint với màu frame
    fill(red(color(frameColors[i]))*0.3+255*0.7,
         green(color(frameColors[i]))*0.3+255*0.7,
         blue(color(frameColors[i]))*0.3+255*0.7);
    if(isSel){ stroke(frameDark[i]); strokeWeight(2.5); }
    else{ stroke(220); strokeWeight(1); }
    rect(bx,by,pillW,pillH,pillH/2);
    // Color dot
    noStroke(); fill(frameColors[i]); circle(bx+pillH*0.5,by+pillH/2,pillH*0.55);
    // Label
    fill(isSel?frameDark[i]:"#555"); textSize(12); textAlign(LEFT,CENTER); noStroke();
    text(frameNames[i], bx+pillH*0.9, by+pillH/2);
    if(isSel){
      fill(frameDark[i]); noStroke();
      circle(bx+pillW-14, by+pillH/2, 14);
      fill(255); textSize(8); textAlign(CENTER,CENTER);
      text("✓", bx+pillW-14, by+pillH/2);
    }
    pop();
  }
  scrollY += ceil(frameColors.length/2)*(pillH+pillRowGap) + 12;

  // -- Sticker Section --
  push(); stroke(230); strokeWeight(1); noFill();
  line(panX+10, scrollY, panX+panW-10, scrollY); pop();
  scrollY += 10;

  push(); fill("#888"); textSize(11); textAlign(CENTER,CENTER); noStroke();
  text("Stickers  (editing photo "+(activePhotoIndex+1)+")", panX+panW/2, scrollY+10); pop();
  scrollY += 22;

  // Sticker pill buttons 2 columns
  for (let i=0; i<stickerSets.length; i++) {
    push();
    let col=i%2, row=floor(i/2);
    let bx=panX+10+col*(pillW+pillGap);
    let by=scrollY+row*(pillH+pillRowGap);
    let isSel=(photoStickers[activePhotoIndex]===i);
    if(isSel){ fill("#fff0f5"); stroke("#ff4d6d"); strokeWeight(2.5); }
    else{ fill(255,255,255,200); stroke(220); strokeWeight(1); }
    rect(bx,by,pillW,pillH,pillH/2);
    noStroke(); textSize(16); textAlign(CENTER,CENTER);
    text(stickerIcons[i], bx+pillH*0.5, by+pillH/2);
    fill(isSel?"#ff4d6d":"#555"); textSize(11); textAlign(LEFT,CENTER); noStroke();
    text(stickerNames[i], bx+pillH*0.9, by+pillH/2);
    if(isSel){
      fill("#ff4d6d"); noStroke(); circle(bx+pillW-14,by+pillH/2,14);
      fill(255); textSize(8); textAlign(CENTER,CENTER); text("✓",bx+pillW-14,by+pillH/2);
    }
    pop();
  }
  scrollY += ceil(stickerSets.length/2)*(pillH+pillRowGap) + 14;

  // -- Color Tone --
  push(); stroke(230); strokeWeight(1); noFill();
  line(panX+10, scrollY, panX+panW-10, scrollY); pop();
  scrollY += 10;

  push(); fill("#888"); textSize(11); textAlign(CENTER,CENTER); noStroke();
  text("Color Tone", panX+panW/2, scrollY+10); pop();
  scrollY += 22;

  let toneBtnW=(panW-30)/3-4, toneBtnH=32;
  for (let i=0; i<toneNames2.length; i++) {
    push();
    let col=i%3, row=floor(i/3);
    let bx=panX+10+col*(toneBtnW+6);
    let by=scrollY+row*(toneBtnH+6);
    let isSel=(selectedFormat===i);
    if(isSel){ fill("#ffe0f0"); stroke("#ff4d6d"); strokeWeight(2); }
    else{ fill(255,255,255,180); stroke(220); strokeWeight(1); }
    rect(bx,by,toneBtnW,toneBtnH,toneBtnH/2);
    noStroke(); fill(isSel?"#ff4d6d":"#555");
    textSize(11); textAlign(CENTER,CENTER);
    text(toneEmoji2[i]+" "+toneNames2[i], bx+toneBtnW/2, by+toneBtnH/2);
    pop();
  }
  scrollY += ceil(toneNames2.length/3)*(toneBtnH+6) + 14;

  // -- Buttons --
  push(); stroke(230); strokeWeight(1); noFill();
  line(panX+10, scrollY, panX+panW-10, scrollY); pop();
  scrollY += 10;

  drawPinkBtn(panX+10, scrollY,    panW-20, 44, "💾  Save Photo");
  drawLightBtn(panX+10, scrollY+52, panW-20, 36, "🔄  Retake");

  pop();
}

// ============================================================
function drawStickerOnPhoto(px,py,pw,ph,idx) {
  let list=stickerSets[idx]||[];
  if(!list.length) return;
  noStroke(); textAlign(CENTER,CENTER);
  for(let i=0;i<list.length;i++){
    let s=list[i];
    let sz=min(pw*(s.sz||0.15),22);
    let nhip=1+sin(frameCount*0.04+s.x*10)*0.08;
    textSize(sz*nhip);
    text(s.s,px+pw*s.x,py+ph*s.y);
  }
}

function saveStickerOverlay(g,px,py,pw,ph,idx) {
  let list=stickerSets[idx]||[];
  if(!list.length) return;
  for(let s of list){
    let sz=min(pw*(s.sz||0.15),22);
    g.push();g.noStroke();g.textAlign(CENTER,CENTER);
    g.textSize(sz);g.text(s.s,px+pw*s.x,py+ph*s.y);g.pop();
  }
}

// ============================================================
function handleResultButtons() {
  let L        = getLayoutConfig();
  let margin   = 20;
  let divX     = width*0.52;
  let availH   = height-80;
  let pad=8, gap=5, bot=32;
  let photoH, stripW;

  if(L.cols===4){
    let maxW=divX-margin*2;
    let cellW=(maxW-pad*2-gap*3)/4;
    photoH=cellW*0.75; stripW=pad*2+cellW*4+gap*3;
  } else if(L.cols===2){
    let cellW=min((divX-margin*2-pad*2-gap)/2, availH*0.45/0.75);
    photoH=cellW*0.75; stripW=pad*2+cellW*2+gap;
  } else {
    photoH=(availH-pad*2-gap*(L.rows-1)-bot)/L.rows;
    let cellW=min(photoH/0.75,(divX-margin*2-pad*2));
    photoH=cellW*0.75; stripW=pad*2+cellW;
  }

  let stripH;
  if(L.cols===4)      stripH=pad*2+photoH+bot;
  else if(L.cols===2) stripH=pad*2+photoH*ceil(L.count/2)+gap*(ceil(L.count/2)-1)+bot;
  else                stripH=pad*2+photoH*L.count+gap*(L.count-1)+bot;

  let stripX=divX/2-stripW/2;
  let stripY=(height-stripH)/2;
  if(stripY<50) stripY=50;

  // Click on photo
  let positions=calcPhotoPositions(stripX,stripY,stripW,photoH,pad,gap,L);
  for(let i=0;i<L.count;i++){
    let {px,py,pw,ph}=positions[i];
    if(mouseX>px&&mouseX<px+pw&&mouseY>py&&mouseY<py+ph&&capturedPhotos[i]){
      activePhotoIndex=i; return;
    }
  }

  let panX=divX+10, panW=width-panX-10;
  let pillW=(panW-30)/2, pillH=36, pillGap=8, pillRowGap=8;
  let scrollY=82;

  // Frame color pills
  for(let i=0;i<frameColors.length;i++){
    let col=i%2, row=floor(i/2);
    let bx=panX+10+col*(pillW+pillGap);
    let by=scrollY+row*(pillH+pillRowGap);
    if(mouseX>bx&&mouseX<bx+pillW&&mouseY>by&&mouseY<by+pillH){ selectedFrame=i; return; }
  }
  scrollY+=ceil(frameColors.length/2)*(pillH+pillRowGap)+22;

  // Sticker pills
  for(let i=0;i<stickerSets.length;i++){
    let col=i%2, row=floor(i/2);
    let bx=panX+10+col*(pillW+pillGap);
    let by=scrollY+row*(pillH+pillRowGap);
    if(mouseX>bx&&mouseX<bx+pillW&&mouseY>by&&mouseY<by+pillH){ photoStickers[activePhotoIndex]=i; return; }
  }
  scrollY+=ceil(stickerSets.length/2)*(pillH+pillRowGap)+22;

  // Color tone
  let toneBtnW=(panW-30)/3-4, toneBtnH=32;
  for(let i=0;i<toneNames2.length;i++){
    let col=i%3, row=floor(i/3);
    let bx=panX+10+col*(toneBtnW+6);
    let by=scrollY+row*(toneBtnH+6);
    if(mouseX>bx&&mouseX<bx+toneBtnW&&mouseY>by&&mouseY<by+toneBtnH){ selectedFormat=i; return; }
  }
  scrollY+=ceil(toneNames2.length/3)*(toneBtnH+6)+24;

  if(mouseX>panX+10&&mouseX<panX+panW-10&&mouseY>scrollY&&mouseY<scrollY+44){ saveResultCanvas(); return; }
  if(mouseX>panX+10&&mouseX<panX+panW-10&&mouseY>scrollY+52&&mouseY<scrollY+88){
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];
    photoStickers=[0,0,0,0,0,0]; currentScreen="camera";
  }
}

// ============================================================
function saveResultCanvas() {
  let L=getLayoutConfig();
  let pad=8,gap=5,bot=32;
  let cellW=160;
  let photoH=cellW*0.75;
  let stripW,stripH;
  if(L.cols===4){       stripW=pad*2+cellW*4+gap*3; stripH=pad*2+photoH+bot; }
  else if(L.cols===2){  stripW=pad*2+cellW*2+gap;   stripH=pad*2+photoH*ceil(L.count/2)+gap*(ceil(L.count/2)-1)+bot; }
  else{                 stripW=pad*2+cellW;           stripH=pad*2+photoH*L.count+gap*(L.count-1)+bot; }

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
      let si=photoStickers[i]||0;
      if(si>0) saveStickerOverlay(g,px,py,pw,ph,si);
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
