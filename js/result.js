// ============================================================
// result.js — picapicabooth style
// ============================================================

let selectedSticker = 0;
let toneNames2  = ["None","Warm","Cool","B&W","Vintage","Dreamy"];
let toneEmoji2  = ["🚫","🌅","❄️","🖤","📷","🌸"];

let stickerThemeNames = ["No Stickers","Cute Avo","Sleepy Avo","Cool Avo","Love","Space","Nature","Music","Pets","Girlypop"];
let stickerThemeIcons = ["🚫","🥑","😴","😎","💕","🪐","🌿","🎵","🐱","🎀"];

// ✅ Глобальные координаты для handleResultButtons
let _res_rx=0, _res_ry=0, _res_rw=0;
let _res_pw2=0; 
let _res_ph2 = 30;
let _res_pg = 4;  
let _res_ry_frame=0;
let _res_ry_sticker=0;
let _res_ry_tone=0;
let _res_ry_save=0;
let _res_tw=0, _res_th=36;


// ============================================================
// Avocado drawing functions
// ============================================================
function avocadoBody(x,y,s){
  push();translate(x,y);scale(s);
  fill("#253d20");stroke(0);strokeWeight(7);
  beginShape();vertex(45,-165);bezierVertex(130,-120,145,20,110,115);bezierVertex(65,210,-70,200,-115,120);bezierVertex(-170,25,-125,-120,-40,-175);bezierVertex(0,-200,35,-190,45,-165);endShape(CLOSE);
  fill("#2d7a2f");stroke(0);strokeWeight(7);
  beginShape();vertex(-20,-185);bezierVertex(70,-185,125,-95,115,40);bezierVertex(105,165,20,220,-70,185);bezierVertex(-150,150,-160,35,-125,-70);bezierVertex(-95,-155,-60,-185,-20,-185);endShape(CLOSE);
  fill("#dff59b");noStroke();
  beginShape();vertex(-20,-155);bezierVertex(50,-160,92,-88,90,35);bezierVertex(88,130,18,178,-55,150);bezierVertex(-120,125,-128,38,-100,-48);bezierVertex(-78,-118,-52,-150,-20,-155);endShape(CLOSE);
  pop();
}
function avoSeed(x,y,s,c1,c2){
  push();translate(x,y);scale(s);
  fill(c1||"#9f5b18");stroke(0);strokeWeight(5);ellipse(0,55,105,135);
  fill(c2||"#d28a35");noStroke();ellipse(-10,25,52,55);pop();
}
function drawCuteAvo(x,y,s){
  avocadoBody(x,y,s);avoSeed(x,y+10*s,s);
  push();translate(x,y);scale(s);
  fill(0);noStroke();ellipse(-38,-75,26,34);ellipse(38,-75,26,34);
  fill(255);ellipse(-46,-84,8,8);ellipse(30,-84,8,8);
  noFill();stroke(0);strokeWeight(4);arc(0,-65,25,25,0,PI);
  stroke(0);strokeWeight(5);
  bezier(-120,20,-170,-5,-155,55,-165,75);bezier(115,-20,160,-40,145,10,165,30);
  line(-38,180,-55,240);line(38,180,55,240);pop();
}
function drawSleepyAvo(x,y,s){
  avocadoBody(x,y,s*0.95);avoSeed(x,y+20*s,s*0.95,"#4b351b","#b28a62");
  push();translate(x,y);scale(s);
  stroke(0);strokeWeight(4);line(-45,-80,-18,-70);line(18,-70,45,-80);
  noFill();arc(0,-58,32,32,0,PI);
  noStroke();fill("#ff9ab0");ellipse(-58,-55,20,10);ellipse(58,-55,20,10);pop();
}
function drawCoolAvo(x,y,s){
  avocadoBody(x,y,s*1.05);avoSeed(x,y+10*s,s*1.05,"#7b3f16","#b97735");
  push();translate(x,y);scale(s);
  fill("#118c3a");stroke(0);strokeWeight(5);line(0,-185,15,-230);ellipse(-30,-215,70,35);
  fill("#111");noStroke();rectMode(CENTER);
  rect(-45,-85,58,28,5);rect(45,-85,58,28,5);
  stroke("#111");strokeWeight(5);line(-15,-85,15,-85);
  stroke(0);strokeWeight(4);line(-15,-45,20,-45);
  stroke(0);strokeWeight(5);noFill();
  bezier(-115,20,-165,-10,-160,60,-175,80);bezier(115,10,170,-10,165,50,180,55);
  line(-45,180,-60,230);line(45,180,65,230);pop();
}

function drawFrameSticker(sx,sy,sw,sh,theme){
  if(theme===0) return;
  push();
  if(theme===1){
    drawCuteAvo(sx+2,sy-10,0.055);drawCuteAvo(sx+sw-2,sy-10,0.055);
    drawCuteAvo(sx+2,sy+sh+8,0.055);drawCuteAvo(sx+sw-2,sy+sh+8,0.055);
    drawCuteAvo(sx+sw/2,sy-12,0.065);
  }else if(theme===2){
    drawSleepyAvo(sx+2,sy-8,0.055);drawSleepyAvo(sx+sw-2,sy-8,0.055);
    drawSleepyAvo(sx+2,sy+sh+8,0.055);drawSleepyAvo(sx+sw-2,sy+sh+8,0.055);
    drawSleepyAvo(sx+sw/2,sy-10,0.065);
  }else if(theme===3){
    drawCoolAvo(sx+2,sy-8,0.055);drawCoolAvo(sx+sw-2,sy-8,0.055);
    drawCoolAvo(sx+2,sy+sh+8,0.055);drawCoolAvo(sx+sw-2,sy+sh+8,0.055);
    drawCoolAvo(sx+sw/2,sy-12,0.065);
  }else{
    let sets={
      4:[{x:0.05,y:0.05,s:"💕",sz:16},{x:0.93,y:0.05,s:"💗",sz:16},{x:0.05,y:0.93,s:"🌸",sz:16},{x:0.93,y:0.93,s:"💕",sz:16},{x:0.5,y:0.03,s:"✿",sz:13}],
      5:[{x:0.05,y:0.05,s:"🪐",sz:18},{x:0.92,y:0.05,s:"⭐",sz:16},{x:0.05,y:0.93,s:"🌙",sz:17},{x:0.92,y:0.93,s:"🚀",sz:16},{x:0.5,y:0.03,s:"✦",sz:13}],
      6:[{x:0.05,y:0.05,s:"🌿",sz:17},{x:0.92,y:0.05,s:"🌻",sz:17},{x:0.05,y:0.93,s:"🌸",sz:16},{x:0.92,y:0.93,s:"🍀",sz:16}],
      7:[{x:0.05,y:0.05,s:"🎵",sz:16},{x:0.92,y:0.05,s:"🎶",sz:18},{x:0.05,y:0.93,s:"🎸",sz:16},{x:0.92,y:0.93,s:"🎤",sz:16}],
      8:[{x:0.05,y:0.05,s:"🐱",sz:18},{x:0.92,y:0.05,s:"🐶",sz:18},{x:0.05,y:0.93,s:"🐰",sz:17},{x:0.92,y:0.93,s:"🦊",sz:17}],
      9:[{x:0.05,y:0.05,s:"🎀",sz:18},{x:0.92,y:0.05,s:"🪞",sz:16},{x:0.05,y:0.93,s:"🦋",sz:17},{x:0.92,y:0.93,s:"✨",sz:16}],
    };
    let list=sets[theme]||[];
    noStroke();textAlign(CENTER,CENTER);
    for(let i=0;i<list.length;i++){
      let e=list[i],nhip=1+sin(frameCount*0.04+i)*0.08;
      textSize(e.sz*nhip);text(e.s,sx+sw*e.x,sy+sh*e.y);
    }
  }
  pop();
}

// ============================================================
// Photo filter
// ============================================================
function applyPhotoFilter(px,py,pw,ph){
  if(selectedFormat===0) return;
  push();noStroke();blendMode(MULTIPLY);
  if     (selectedFormat===1){fill(255,200,100,60);rect(px,py,pw,ph);}
  else if(selectedFormat===2){fill(100,160,255,55);rect(px,py,pw,ph);}
  else if(selectedFormat===3){fill(200,200,200,180);rect(px,py,pw,ph);}
  else if(selectedFormat===4){fill(180,140,80,70);rect(px,py,pw,ph);}
  else if(selectedFormat===5){fill(255,180,220,50);rect(px,py,pw,ph);}
  blendMode(BLEND);
  if(selectedFormat===4){
    for(let g=0;g<50;g++){
      stroke(200,180,120,random(15,35));strokeWeight(0.5);
      point(px+random(pw),py+random(ph));
    }
  }
  pop();
}

function applyPhotoFilterSave(g,px,py,pw,ph){
  if(selectedFormat===0) return;
  g.push();g.noStroke();g.blendMode(MULTIPLY);
  if     (selectedFormat===1){g.fill(255,200,100,60);g.rect(px,py,pw,ph);}
  else if(selectedFormat===2){g.fill(100,160,255,55);g.rect(px,py,pw,ph);}
  else if(selectedFormat===3){g.fill(200,200,200,180);g.rect(px,py,pw,ph);}
  else if(selectedFormat===4){g.fill(180,140,80,70);g.rect(px,py,pw,ph);}
  else if(selectedFormat===5){g.fill(255,180,220,50);g.rect(px,py,pw,ph);}
  g.blendMode(BLEND);g.pop();
}

// ============================================================
// Layout
// ============================================================
function getLayoutConfig(){
  return (typeof layouts!=="undefined"&&layouts[selectedLayout])
    ?layouts[selectedLayout]:{cols:1,rows:4,count:4,name:"4-Cut Strip"};
}

function calcPhotoPositions(sx,sy,sw,ph,pad,gap,L){
  let positions=[],pw;
  if(L.cols===4)      pw=(sw-pad*2-gap*3)/4;
  else if(L.cols===2) pw=(sw-pad*2-gap)/2;
  else                pw=sw-pad*2;
  for(let i=0;i<L.count;i++){
    let px,py;
    if(L.cols===4){
      px=sx+pad+i*(pw+gap); py=sy+pad;
    }else if(L.cols===2){
      let col=i%2,row=floor(i/2);
      px=sx+pad+col*(pw+gap); py=sy+pad+row*(ph+gap);
    }else{
      px=sx+pad; py=sy+pad+i*(ph+gap);
    }
    positions.push({px,py,pw,ph});
  }
  return positions;
}

// ============================================================
// Общая функция вычисления координат панели
// ============================================================
function calcPanelCoords(){
  let L=getLayoutConfig();
  let panW=min(width*0.45,420), panX=width-panW;
  let photoAreaW=panX;
  let pad=14,gap=5,bot=36,availH=height-60;
  let photoH,stripW;
  if(L.cols===4){
    let cw=(photoAreaW-60-pad*2-gap*3)/4;
    photoH=cw*0.75; stripW=pad*2+cw*4+gap*3;
  }else if(L.cols===2){
    let cw=min((photoAreaW-60-pad*2-gap)/2,availH*0.48/0.75);
    photoH=cw*0.75; stripW=pad*2+cw*2+gap;
  }else{
    photoH=(availH-pad*2-gap*(L.rows-1)-bot)/L.rows;
    let cw=min(photoH/0.75,(photoAreaW-60-pad*2));
    photoH=cw*0.75; stripW=pad*2+cw;
  }

  let rx=panX+20, rw=panW-40;
  let pw2=(rw-10)/2, ph2=38, pg=10;
  let tw=(rw-pg*2)/3, th=36;

  let ry=20+36; // title + gap

  // frame
  let ry_frame=ry;
  ry+=22; // label
  ry+=ceil(frameColors.length/2)*(ph2+8)+16;
  ry+=14; // divider

  // sticker
  ry+=22; // label
  let ry_sticker=ry;
  ry+=ceil(stickerThemeNames.length/2)*(ph2+8)+14;
  ry+=14; // divider

  // tone
  ry+=22; // label
  let ry_tone=ry;
  ry+=ceil(toneNames2.length/3)*(th+8)+18;

  // save
  let ry_save=ry;

  return {rx,rw,pw2,ph2,pg,tw,th,ry_frame,ry_sticker,ry_tone,ry_save};
}

// ============================================================
// RESULT SCREEN
// ============================================================
function drawResultScreen(){
  background(250,248,255);
  push();rectMode(CORNER);noStroke();textAlign(CENTER,CENTER);

  let L=getLayoutConfig();
  let panW=min(width*0.45,420), panX=width-panW;
  let photoAreaW=panX;
  let pad=14,gap=5,bot=36,availH=height-60;
  let photoH,stripW;
  if(L.cols===4){
    let cw=(photoAreaW-60-pad*2-gap*3)/4;
    photoH=cw*0.75; stripW=pad*2+cw*4+gap*3;
  }else if(L.cols===2){
    let cw=min((photoAreaW-60-pad*2-gap)/2,availH*0.48/0.75);
    photoH=cw*0.75; stripW=pad*2+cw*2+gap;
  }else{
    photoH=(availH-pad*2-gap*(L.rows-1)-bot)/L.rows;
    let cw=min(photoH/0.75,(photoAreaW-60-pad*2));
    photoH=cw*0.75; stripW=pad*2+cw;
  }
  let stripH=L.cols===4?pad*2+photoH+bot:
             L.cols===2?pad*2+photoH*ceil(L.count/2)+gap*(ceil(L.count/2)-1)+bot:
             pad*2+photoH*L.count+gap*(L.count-1)+bot;
  let stripX=photoAreaW/2-stripW/2;
  let stripY=max((height-stripH)/2,40);

  // Title
  push();fill(100);textSize(14);noStroke();
  text("Photo Strip Preview",stripX+stripW/2,stripY-22);
  fill("#b366ff");textSize(11);
  text("Layout: "+L.name+" ("+L.count+" photos)",stripX+stripW/2,stripY-8);
  pop();

  drawFrameSticker(stripX,stripY,stripW,stripH,selectedSticker);

  push();noStroke();
  fill(150,150,180,20);rect(stripX+8,stripY+10,stripW,stripH,16);
  fill(150,150,180,15);rect(stripX+5,stripY+6,stripW,stripH,16);
  pop();

  fill(frameColors[selectedFrame]);
  stroke(frameDark[selectedFrame]);strokeWeight(3);
  rect(stripX,stripY,stripW,stripH,12);

  let positions=calcPhotoPositions(stripX,stripY,stripW,photoH,pad,gap,L);
  for(let i=0;i<L.count;i++){
    let{px,py,pw,ph}=positions[i];
    push();fill(0,0,0,12);noStroke();rect(px+2,py+2,pw,ph,5);pop();
    if(capturedPhotos[i]){
      push();imageMode(CORNER);image(capturedPhotos[i],px,py,pw,ph);pop();
      applyPhotoFilter(px,py,pw,ph);
    }else{
      push();fill(230);noStroke();rect(px,py,pw,ph,5);
      fill(180);textSize(10);text("No photo",px+pw/2,py+ph/2);pop();
    }
  }

  push();noStroke();fill(120);textSize(9);
  let d=new Date();
  let ds=d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0");
  text(ds,stripX+stripW/2,stripY+stripH-14);pop();

  // Разделитель панели
  push();stroke(230);strokeWeight(1);noFill();line(panX,0,panX,height);pop();

  // ✅ Вычисляем координаты через общую функцию и сохраняем
    let C=calcPanelCoords();
  
  C.ry_sticker = C.ry_sticker - 30; 
  C.ry_tone    = C.ry_tone - 55;    
  C.ry_save    = C.ry_save - 80;    

  // Записываем измененные координаты в глобальные переменные
  _res_rx=C.rx; _res_rw=C.rw;
  _res_pw2=C.pw2; _res_ph2=C.ph2; _res_pg=C.pg;
  _res_tw=C.tw; _res_th=C.th;
  _res_ry_frame=C.ry_frame;
  _res_ry_sticker=C.ry_sticker;
  _res_ry_tone=C.ry_tone;
  _res_ry_save=C.ry_save;

  let rx=C.rx, rw=C.rw, pw2=C.pw2, ph2=C.ph2, pg=C.pg;
  let tw=C.tw, th=C.th;

  // Title панели
  push();fill(30);textSize(min(rw*0.08,18));textStyle(BOLD);noStroke();textAlign(CENTER,CENTER);
  text("Customize your photo strip",rx+rw/2,20+14);
  textStyle(NORMAL);pop();

  // Frame colour label
  push();fill(150);textSize(12);noStroke();textAlign(LEFT,CENTER);
  text("Frame colour",rx,C.ry_frame-14);pop();

  // Frame pills
  for(let i=0;i<frameColors.length;i++){
    push();
    let col=i%2,row=floor(i/2);
    let bx=rx+col*(pw2+pg), by=C.ry_frame+row*(ph2+8);
    let isSel=(selectedFrame===i);
    fill(180,180,200,isSel?40:20);noStroke();rect(bx+2,by+3,pw2,ph2,ph2/2);
    fill(isSel?frameColors[i]:255);
    stroke(isSel?frameDark[i]:210);strokeWeight(isSel?2:1);
    rect(bx,by,pw2,ph2,ph2/2);
    noStroke();fill(isSel?frameDark[i]:60);
    textSize(13);textStyle(isSel?BOLD:NORMAL);textAlign(CENTER,CENTER);
    text(frameNames[i],bx+pw2/2,by+ph2/2);
    textStyle(NORMAL);pop();
  }

  // Divider
  let ry_div1=C.ry_frame+ceil(frameColors.length/2)*(ph2+8)+4;
  push();stroke(235);strokeWeight(1);noFill();line(rx,ry_div1,rx+rw,ry_div1);pop();

  // Sticker label
  push();fill(150);textSize(12);noStroke();textAlign(LEFT,CENTER);
  text("Stickers",rx,C.ry_sticker-14);pop();

  // Sticker pills
  for(let i=0;i<stickerThemeNames.length;i++){
    push();
    let col=i%2,row=floor(i/2);
    let bx=rx+col*(pw2+pg), by=C.ry_sticker+row*(ph2+8);
    let isSel=(selectedSticker===i);
    fill(180,180,200,isSel?40:15);noStroke();rect(bx+2,by+3,pw2,ph2,ph2/2);
    fill(isSel?"#fff0f5":255);
    stroke(isSel?"#ff4d6d":210);strokeWeight(isSel?2:1);
    rect(bx,by,pw2,ph2,ph2/2);
    noStroke();textSize(13);textStyle(isSel?BOLD:NORMAL);textAlign(CENTER,CENTER);
    fill(isSel?"#ff4d6d":60);
    text(stickerThemeIcons[i]+" "+stickerThemeNames[i],bx+pw2/2,by+ph2/2);
    textStyle(NORMAL);pop();
  }


  // Divider
  let ry_div2=C.ry_sticker+ceil(stickerThemeNames.length/2)*(ph2+8)+4;
  push();stroke(235);strokeWeight(1);noFill();line(rx,ry_div2,rx+rw,ry_div2);pop();

  // Tone label
  push();fill(150);textSize(12);noStroke();textAlign(LEFT,CENTER);
  text("Color Tone",rx,C.ry_tone-14);pop();

  // Tone pills
  for(let i=0;i<toneNames2.length;i++){
    push();
    let col=i%3,row=floor(i/3);
    let bx=rx+col*(tw+pg), by=C.ry_tone+row*(th+8);
    let isSel=(selectedFormat===i);
    fill(180,180,200,isSel?40:15);noStroke();rect(bx+2,by+3,tw,th,th/2);
    fill(isSel?"#ffe0f0":255);
    stroke(isSel?"#ff4d6d":210);strokeWeight(isSel?2:1);
    rect(bx,by,tw,th,th/2);
    noStroke();fill(isSel?"#ff4d6d":60);
    textSize(11);textStyle(isSel?BOLD:NORMAL);textAlign(CENTER,CENTER);
    text(toneEmoji2[i]+" "+toneNames2[i],bx+tw/2,by+th/2);
    textStyle(NORMAL);pop();
  }

  // Save button
  let ry_save = C.ry_save - 40; 
  push();noStroke();
  fill(210,80,120,40);rect(rx+2,ry_save+4,rw,50,25);
  fill(245,75,115);rect(rx,ry_save,rw,50,25);
  fill(255,130,160,80);rect(rx+2,ry_save+2,rw-4,24,24,24,0,0);
  noFill();stroke(255,255,255,50);strokeWeight(1);rect(rx+1,ry_save+1,rw-2,48,25);
  noStroke();fill(255);textSize(16);textStyle(BOLD);textAlign(CENTER,CENTER);
  text("💾  Save Photo",rx+rw/2,ry_save+25);
  textStyle(NORMAL);pop();

  // Retake
  drawLightBtn(rx,ry_save+62,rw,40,"🔄  Retake");

  pop();
}

// ============================================================
function handleResultButtons(){
  // ✅ Используем сохранённые координаты — не пересчитываем
  let rx=_res_rx, rw=_res_rw;
  let pw2=_res_pw2, ph2=_res_ph2, pg=_res_pg;
  let tw=_res_tw, th=_res_th;

  // Frame colour
  for(let i=0;i<frameColors.length;i++){
    let col=i%2, row=floor(i/2);
    let bx=rx+col*(pw2+pg), by=_res_ry_frame+row*(ph2+8);
    if(mouseX>bx&&mouseX<bx+pw2&&mouseY>by&&mouseY<by+ph2){
      selectedFrame=i; return;
    }
  }

  // Sticker
  for(let i=0;i<stickerThemeNames.length;i++){
    let col=i%2, row=floor(i/2);
    let bx=rx+col*(pw2+pg), by=_res_ry_sticker+row*(ph2+8);
    if (mouseY > C.ry_sticker - 30 && mouseY < (C.ry_sticker - 30) + 40){
      selectedSticker=i; return;
    }
  }

  // Color tone
  for(let i=0;i<toneNames2.length;i++){
    let col=i%3, row=floor(i/3);
    let bx=rx+col*(tw+pg), by=_res_ry_tone+row*(th+8);
    if (mouseY > C.ry_tone - 35 && mouseY < (C.ry_tone - 35) + 40){
      selectedFormat=i; return;
    }
  }

  // Save
  if (mouseY > C.ry_save - 40 && mouseY < (C.ry_save - 40) + 50){
    saveResultCanvas(); return;
  }

  // Retake
  if(mouseX>rx&&mouseX<rx+rw&&
     mouseY>_res_ry_save+62&&mouseY<_res_ry_save+102){
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];
    selectedSticker=0; currentScreen="camera";
  }
}

// ============================================================
function saveResultCanvas(){
  let L=getLayoutConfig();
  let pad=14,gap=5,bot=36,cellW=160,photoH=cellW*0.75;
  let stripW=L.cols===4?pad*2+cellW*4+gap*3:
             L.cols===2?pad*2+cellW*2+gap:
             pad*2+cellW;
  let stripH=L.cols===4?pad*2+photoH+bot:
             L.cols===2?pad*2+photoH*ceil(L.count/2)+gap*(ceil(L.count/2)-1)+bot:
             pad*2+photoH*L.count+gap*(L.count-1)+bot;

  let g=createGraphics(stripW,stripH);
  g.rectMode(CORNER);g.textAlign(CENTER,CENTER);
  g.fill(frameColors[selectedFrame]);
  g.stroke(frameDark[selectedFrame]);g.strokeWeight(3);
  g.rect(0,0,stripW,stripH,10);

  let posns=calcPhotoPositions(0,0,stripW,photoH,pad,gap,L);
  for(let i=0;i<L.count;i++){
    let{px,py,pw,ph}=posns[i];
    if(capturedPhotos[i]){
      g.push();g.imageMode(CORNER);g.image(capturedPhotos[i],px,py,pw,ph);g.pop();
      applyPhotoFilterSave(g,px,py,pw,ph);
    }else{
      g.push();g.fill(220);g.noStroke();g.rect(px,py,pw,ph,5);g.pop();
    }
  }

  let d=new Date();
  let ds=d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0");
  g.noStroke();g.fill(120);g.textSize(9);
  g.text(ds,stripW/2,stripH-14);

  save(g,"4cut_"+frameNames[selectedFrame]+".png");
  g.remove();
  currentScreen="saved";
}
