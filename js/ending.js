// ============================================================
// ending.js
// ============================================================

function drawEndingScreen(){
  drawBG();
  push();rectMode(CORNER);noStroke();textAlign(CENTER,CENTER);

  let cw=min(width*0.88,520),cx=width/2-cw/2;
  drawCard(cx,8,cw,height-16,24);

  push();fill("#ffb6c1");noStroke();
  rect(cx,8,cw,70,24,24,0,0);
  fill(255);textSize(min(cw*0.08,26));
  text("📸 4CUT BOOTH",width/2,36);
  fill(255,255,255,180);textSize(11);
  text("Art & Technology  |  Team 13  |  2026",width/2,58);
  pop();

  push();stroke("#f0e0ff");strokeWeight(1.5);noFill();
  line(cx+24,84,cx+cw-24,84);pop();

  let members=[
    {name:"틀레우바이 아야으름",role:"카메라 · UI · 전체 흐름",col:"#ffb6c1"},
    {name:"응웬 바오 담",       role:"AR 필터 · FaceMesh · Hands",col:"#b2f0e8"},
    {name:"마이티투짱",         role:"결과 화면 · 프레임 · 저장",col:"#e1bee7"},
  ];
  for(let i=0;i<members.length;i++){
    push();let my=height*0.27+i*76;
    fill(members[i].col+"44");noStroke();
    rect(cx+16,my-22,cw-32,62,14);
    fill(members[i].col);noStroke();
    circle(cx+40,my+9,30);
    fill(255);textSize(14);textAlign(CENTER,CENTER);
    text(str(i+1),cx+40,my+9);
    fill("#333");textSize(min(cw*0.036,18));textAlign(LEFT,CENTER);
    text(members[i].name,cx+62,my-2);
    fill("#999");textSize(11);
    text(members[i].role,cx+62,my+18);
    pop();
  }

  // 기술 스택
  push();fill("#f3e5ff");noStroke();
  rect(cx+16,height*0.67,cw-32,50,14);
  fill("#c8b4f8");textSize(11);textAlign(CENTER,CENTER);
  text("사용 기술",width/2,height*0.67+12);
  fill("#777");textSize(10);
  text("p5.js  ·  MediaPipe FaceMesh  ·  MediaPipe Hands  ·  GitHub Pages",
       width/2,height*0.67+32);
  pop();

  // QR 코드
  push();fill("#fff0f5");noStroke();
  rect(cx+16,height*0.75,cw-32,112,14);
  fill("#ff4d6d");textSize(12);textAlign(CENTER,CENTER);
  text("📱  제작 영상 보기",width/2,height*0.75+16);
  if(qrCanvas){
    let qrW=80;
    // drawingContext로 직접 그리기
    drawingContext.drawImage(qrCanvas, width/2-qrW/2, height*0.75+26, qrW, qrW);
  } else {
    fill("#eee");noStroke();rect(width/2-40,height*0.75+26,80,80,8);
    fill("#bbb");textSize(11);text("QR 로딩 중...",width/2,height*0.75+66);
  }
  fill("#aaa");textSize(10);
  text("Google Drive 영상 폴더",width/2,height*0.75+118);
  pop();

  // 처음으로 버튼
  let bw=min(cw-48,220),bx=width/2-bw/2;
  drawPinkBtn(bx,height-68,bw,50,"🏠  처음으로");
  pop();
}

function handleEndingButtons(){
  let cw=min(width*0.88,520),bw=min(cw-48,220),bx=width/2-bw/2;
  if(mouseX>bx&&mouseX<bx+bw&&mouseY>height-68&&mouseY<height-18)
    currentScreen="start";
}
