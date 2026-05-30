// ============================================================
// ending.js
// ============================================================

function drawEndingScreen(){
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let cw=min(width*0.88,520), cx=width/2-cw/2;
  drawCard(cx,8,cw,height-16,24);

  // 헤더
  push(); fill("#ffb6c1"); noStroke();
  rect(cx,8,cw,68,24,24,0,0);
  fill(255); textSize(min(cw*0.08,24));
  text("📸 4CUT BOOTH",width/2,34);
  fill(255,255,255,180); textSize(10);
  text("Art & Technology  |  Team 13  |  2026",width/2,56);
  pop();

  push(); stroke("#f0e0ff"); strokeWeight(1.5); noFill();
  line(cx+24,80,cx+cw-24,80); pop();

  // 팀원
  let members=[
    {name:"틀레우바이 아야으름",role:"카메라 · UI · 전체 흐름",   col:"#ffb6c1"},
    {name:"응웬 바오 담",       role:"AR 필터 · FaceMesh · Hands",col:"#b2f0e8"},
    {name:"마이티투짱",         role:"결과 화면 · 프레임 · 저장", col:"#e1bee7"},
  ];
  for(let i=0;i<members.length;i++){
    push(); let my=height*0.22+i*68;
    fill(members[i].col+"44");noStroke();rect(cx+16,my-18,cw-32,54,12);
    fill(members[i].col);noStroke();circle(cx+38,my+9,26);
    fill(255);textSize(12);textAlign(CENTER,CENTER);text(str(i+1),cx+38,my+9);
    fill("#333");textSize(min(cw*0.032,16));textAlign(LEFT,CENTER);
    text(members[i].name,cx+58,my-2);
    fill("#999");textSize(10);text(members[i].role,cx+58,my+16);
    pop();
  }

  // 기술
  push();fill("#f3e5ff");noStroke();
  rect(cx+16,height*0.58,cw-32,44,12);
  fill("#c8b4f8");textSize(10);textAlign(CENTER,CENTER);
  text("사용 기술",width/2,height*0.58+10);
  fill("#777");textSize(9);
  text("p5.js  ·  MediaPipe FaceMesh  ·  MediaPipe Hands  ·  GitHub Pages",
       width/2,height*0.58+28);
  pop();

  // QR — большой, сверху, без кнопки рядом
  push();
  fill("#fff");noStroke();
  rect(cx+16,height*0.65,cw-32,150,14);
  fill("#ff4d6d");textSize(13);textAlign(CENTER,CENTER);
  text("📱  제작 영상 보기",width/2,height*0.65+18);

  let qrW=100;
  let qrX=width/2-qrW/2;
  let qrY=height*0.65+30;

  if(qrCanvas){
    // Белый фон под QR чтобы сканировался
    fill(255);noStroke();rect(qrX-6,qrY-6,qrW+12,qrW+12,6);
    drawingContext.drawImage(qrCanvas,qrX,qrY,qrW,qrW);
  } else {
    fill("#f3e5ff");noStroke();rect(qrX,qrY,qrW,qrW,8);
    fill("#c8b4f8");textSize(11);text("QR 생성 중...",width/2,qrY+qrW/2);
  }

  fill("#888");textSize(10);
  text("📁 Google Drive 영상 폴더",width/2,qrY+qrW+14);
  // Показываем ссылку кликабельной
  fill("#c8b4f8");textSize(9);
  text("tap to open →",width/2,qrY+qrW+28);
  pop();

  // Кнопка "처음으로" — отдельно внизу
  let bw=min(cw-48,220),bx=width/2-bw/2;
  drawPinkBtn(bx,height-64,bw,48,"🏠  처음으로");

  pop();
}

function handleEndingButtons(){
  let cw=min(width*0.88,520),cx=width/2-cw/2;

  // Клик по QR — открыть ссылку
  let qrW=100,qrX=width/2-qrW/2;
  let qrY=height*0.65+30;
  if(mouseX>qrX-6&&mouseX<qrX+qrW+6&&mouseY>qrY-6&&mouseY<qrY+qrW+6){
    window.open(GOOGLE_DRIVE_URL,"_blank");
    return;
  }

  // Кнопка назад
  let bw=min(cw-48,220),bx=width/2-bw/2;
  if(mouseX>bx&&mouseX<bx+bw&&mouseY>height-64&&mouseY<height-16)
    currentScreen="start";
}
