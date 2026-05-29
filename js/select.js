// ============================================================
// select.js — 4장 선택 화면
// ============================================================

function drawSelectScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let cw=min(width*0.96,640), cx=width/2-cw/2;
  drawCard(cx,8,cw,height-16,24);

  // 헤더
  push();
  for(let i=0;i<56;i++){
    let t=i/56;
    fill(lerpColor(color("#ffb6c1"),color("#c8b4f8"),t),150);
    rect(cx,8+i,cw,1,i===0?24:0,i===0?24:0,0,0);
  }
  fill(255);textSize(min(cw*0.07,22));
  text("🌸  4장을 선택하세요", width/2,32);
  pop();

  // 선택 상태
  push();
  fill("#f3e5ff");noStroke();rect(width/2-100,52,200,28,14);
  fill("#c8b4f8");textSize(13);
  text("선택: "+selectedPhotos.length+" / 4  |  총 "+allPhotos.length+"장",width/2,66);
  pop();

  // 사진 그리드
  let cols=4, pad=14, gap=8;
  let pw=(cw-pad*2-gap*(cols-1))/cols;
  let ph=pw*0.75, startY=90;

  for(let i=0;i<allPhotos.length;i++){
    let col=i%cols, row=floor(i/cols);
    let px=cx+pad+col*(pw+gap), py=startY+row*(ph+gap+22);

    push();
    // 그림자
    fill(0,0,0,18);noStroke();rect(px+3,py+3,pw,ph,10);
    // 사진
    imageMode(CORNER);image(allPhotos[i],px,py,pw,ph);

    let isSel=selectedPhotos.indexOf(i)!==-1;
    let ord=selectedPhotos.indexOf(i)+1;

    if(isSel){
      // 핑크 글로우 테두리
      stroke("#ff4d6d");strokeWeight(3);noFill();rect(px,py,pw,ph,10);
      // 번호 뱃지
      fill("#ff4d6d");noStroke();circle(px+pw-14,py+14,26);
      fill(255);textSize(12);textAlign(CENTER,CENTER);text(str(ord),px+pw-14,py+14);
      // 하단 오버레이
      fill(255,77,109,30);noStroke();rect(px,py,pw,ph,10);
    } else {
      stroke("#ddd");strokeWeight(1.5);noFill();rect(px,py,pw,ph,10);
      // 호버 힌트
      fill(0,0,0,18);noStroke();rect(px,py,pw,ph,10);
      fill(255,150);textSize(18);textAlign(CENTER,CENTER);
      text("＋",px+pw/2,py+ph/2);
    }
    fill("#bbb");noStroke();textSize(10);
    text("📷 "+(i+1),px+pw/2,py+ph+11);
    pop();
  }

  // 완료 버튼
  let btnY=height-68;
  push();
  if(selectedPhotos.length===4){
    noStroke();
    fill(200,100,180,70);rect(width/2-122+4,btnY+4,244,52,26);
    for(let i=0;i<52;i++){
      let t=i/52;
      fill(lerpColor(color("#ff6b9d"),color("#c8b4f8"),t));
      rect(width/2-122,btnY+i,244,1,i===0?26:0,i===0?26:0,i===51?26:0,i===51?26:0);
    }
    fill(255);textSize(20);textAlign(CENTER,CENTER);
    text("완료! ✨",width/2,btnY+26);
  } else {
    fill("#f0f0f0");noStroke();rect(width/2-122,btnY,244,52,26);
    fill("#ccc");textSize(15);textAlign(CENTER,CENTER);
    text("4장을 선택해주세요",width/2,btnY+26);
  }
  pop();

  // 다시촬영 버튼
  push();fill("#f3e5ff");noStroke();rect(16,12,100,32,16);
  fill("#c8b4f8");textSize(13);textAlign(CENTER,CENTER);
  text("🔄 다시촬영",66,28);pop();

  pop();
}

function handleSelectButtons(){
  if(mouseX>16&&mouseX<116&&mouseY>12&&mouseY<44){
    allPhotos=[];selectedPhotos=[];currentScreen="camera";return;
  }
  let cw=min(width*0.96,640),cx=width/2-cw/2;
  let cols=4,pad=14,gap=8;
  let pw=(cw-pad*2-gap*(cols-1))/cols;
  let ph=pw*0.75,startY=90;
  for(let i=0;i<allPhotos.length;i++){
    let col=i%cols,row=floor(i/cols);
    let px=cx+pad+col*(pw+gap),py=startY+row*(ph+gap+22);
    if(mouseX>px&&mouseX<px+pw&&mouseY>py&&mouseY<py+ph){
      let idx=selectedPhotos.indexOf(i);
      if(idx!==-1) selectedPhotos.splice(idx,1);
      else if(selectedPhotos.length<4) selectedPhotos.push(i);
      return;
    }
  }
  let btnY=height-68;
  if(selectedPhotos.length===4&&
     mouseX>width/2-122&&mouseX<width/2+122&&
     mouseY>btnY&&mouseY<btnY+52){
    capturedPhotos=selectedPhotos.map(i=>allPhotos[i]);
    currentScreen="result";
  }
}
