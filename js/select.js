// ============================================================
// select.js
// ============================================================

function drawSelectScreen() {
  let requiredPhotos = (selectedFormat === 3) ? 1 : 4;
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let cw=min(width*0.96,640), cx=width/2-cw/2;
  drawCard(cx,8,cw,height-16,24);

  // 헤더
  push(); fill("#ffb6c1"); noStroke();
  rect(cx,8,cw,56,24,24,0,0);
  fill(255); textSize(min(cw*0.07,22));

text("🌸  "+requiredPhotos+"장을 선택하세요", width/2, 36);
  pop();

 // 상태
push();
fill("#f3e5ff");
noStroke();
rect(width/2-110,54,220,28,14);

fill("#c8b4f8");
textSize(13);

text(
  "선택: "+selectedPhotos.length+" / "+requiredPhotos+
  " | 총 "+allPhotos.length+"장",
  width/2,
  68
);

pop();
  // 사진 그리드
  let cols=4, pad=14, gap=8;
  let pw=(cw-pad*2-gap*(cols-1))/cols;
  let ph=pw*0.75, startY=92;

  for(let i=0;i<allPhotos.length;i++){
    let col=i%cols, row=floor(i/cols);
    let px=cx+pad+col*(pw+gap), py=startY+row*(ph+gap+22);
    push();
    fill(0,0,0,18);noStroke();rect(px+3,py+3,pw,ph,10);
    imageMode(CORNER);image(allPhotos[i],px,py,pw,ph);
    let isSel=selectedPhotos.indexOf(i)!==-1;
    let ord=selectedPhotos.indexOf(i)+1;
    if(isSel){
      stroke("#ff4d6d");strokeWeight(3);noFill();rect(px,py,pw,ph,10);
      fill("#ff4d6d");noStroke();circle(px+pw-14,py+14,26);
      fill(255);textSize(12);textAlign(CENTER,CENTER);text(str(ord),px+pw-14,py+14);
      fill(255,77,109,25);noStroke();rect(px,py,pw,ph,10);
    } else {
      stroke("#ddd");strokeWeight(1.5);noFill();rect(px,py,pw,ph,10);
      fill(0,0,0,15);noStroke();rect(px,py,pw,ph,10);
      fill(255,140);textSize(18);textAlign(CENTER,CENTER);
      text("＋",px+pw/2,py+ph/2);
    }
    fill("#bbb");noStroke();textSize(10);
    text("📷 "+(i+1),px+pw/2,py+ph+11);
    pop();
  }

  // 완료 버튼
  let btnY=height-68;

if(selectedPhotos.length===requiredPhotos){
    drawPinkBtn(width/2-122, btnY, 244, 52, "완료! ✨");
  } else {
    push(); fill("#f0f0f0"); noStroke(); rect(width/2-122,btnY,244,52,26);
    fill("#ccc"); textSize(15); textAlign(CENTER,CENTER);
    text(requiredPhotos+"장을 선택해주세요",width/2,btnY+26);
  pop();
  }

  drawLightBtn(16,12,100,32,"🔄 다시촬영");
  pop();
}

function handleSelectButtons(){
  let requiredPhotos = (selectedFormat === 3) ? 1 : 4;
  if(mouseX>16&&mouseX<116&&mouseY>12&&mouseY<44){
    allPhotos=[];selectedPhotos=[];currentScreen="camera";return;
  }
  let cw=min(width*0.96,640),cx=width/2-cw/2;
  let cols=4,pad=14,gap=8;
  let pw=(cw-pad*2-gap*(cols-1))/cols;
  let ph=pw*0.75,startY=92;
  for(let i=0;i<allPhotos.length;i++){
    let col=i%cols,row=floor(i/cols);
    let px=cx+pad+col*(pw+gap),py=startY+row*(ph+gap+22);
    if(mouseX>px&&mouseX<px+pw&&mouseY>py&&mouseY<py+ph){
  

let idx = selectedPhotos.indexOf(i);

if(selectedFormat===3){

  if(idx!==-1){
    selectedPhotos=[];
  }else{
    selectedPhotos=[i];
  }

}else{

  if(idx!==-1){
    selectedPhotos.splice(idx,1);
  }else if(selectedPhotos.length<requiredPhotos){
    selectedPhotos.push(i);
  }

}
      return;
    }
  }
  let btnY=height-68;

if(selectedPhotos.length===requiredPhotos &&
     mouseX>width/2-122&&mouseX<width/2+122&&
     mouseY>btnY&&mouseY<btnY+52){
    capturedPhotos=selectedPhotos.map(i=>allPhotos[i]);
    currentScreen="result";
  }
}
