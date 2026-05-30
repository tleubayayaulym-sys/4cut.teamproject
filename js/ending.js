// ============================================================
// ending.js
// ============================================================

function drawEndingScreen(){
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let cw=min(width*0.88,520), cx=width/2-cw/2;
  drawCard(cx, 8, cw, height-16, 24);

  // 헤더
  push(); fill("#ffb6c1"); noStroke();
  rect(cx, 8, cw, 70, 24, 24, 0, 0);
  fill(255); textSize(min(cw*0.08,26));
  text("📸 4CUT BOOTH", width/2, 36);
  fill(255,255,255,180); textSize(11);
  text("Art & Technology  |  Team 13  |  2026", width/2, 58);
  pop();

  // 구분선
  push(); stroke("#f0e0ff"); strokeWeight(1.5); noFill();
  line(cx+24, 84, cx+cw-24, 84); pop();

  // 팀원 카드
  let members=[
    {name:"틀레우바이 아야으름", role:"카메라 · UI · 전체 흐름",    col:"#ffb6c1"},
    {name:"응웬 바오 담",        role:"AR 필터 · FaceMesh · Hands", col:"#b2f0e8"},
    {name:"마이티투짱",          role:"결과 화면 · 프레임 · 저장",  col:"#e1bee7"},
  ];
  for(let i=0; i<members.length; i++){
    push(); let my = height*0.22 + i*72;
    fill(members[i].col+"44"); noStroke();
    rect(cx+16, my-20, cw-32, 58, 14);
    fill(members[i].col); noStroke();
    circle(cx+40, my+9, 28);
    fill(255); textSize(13); textAlign(CENTER,CENTER);
    text(str(i+1), cx+40, my+9);
    fill("#333"); textSize(min(cw*0.034,17)); textAlign(LEFT,CENTER);
    text(members[i].name, cx+60, my-3);
    fill("#999"); textSize(11);
    text(members[i].role, cx+60, my+16);
    pop();
  }

  // 기술 스택
  push(); fill("#f3e5ff"); noStroke();
  rect(cx+16, height*0.58, cw-32, 46, 14);
  fill("#c8b4f8"); textSize(11); textAlign(CENTER,CENTER);
  text("사용 기술", width/2, height*0.58+10);
  fill("#777"); textSize(10);
  text("p5.js  ·  MediaPipe FaceMesh  ·  MediaPipe Hands  ·  GitHub Pages",
       width/2, height*0.58+28);
  pop();

  // QR 코드 — 위에 크게
  push();
  fill("#fff"); noStroke();
  rect(cx+16, height*0.66, cw-32, 148, 14);

  fill("#ff4d6d"); textSize(13); textAlign(CENTER,CENTER);
  text("📱  제작 영상 보기 — Google Drive", width/2, height*0.66+18);

  // QR 크게 표시
  let qrW = 110;
  let qrX  = width/2 - qrW/2;
  let qrY  = height*0.66 + 30;

  if(qrCanvas){
    // 흰 배경
    fill(255); noStroke(); rect(qrX-4, qrY-4, qrW+8, qrW+8, 8);
    drawingContext.drawImage(qrCanvas, qrX, qrY, qrW, qrW);
  } else {
    fill("#f3e5ff"); noStroke(); rect(qrX, qrY, qrW, qrW, 8);
    fill("#c8b4f8"); textSize(12);
    text("QR 생성 중...", width/2, qrY+qrW/2);
  }

  fill("#aaa"); textSize(10);
  text("카메라로 스캔하세요", width/2, qrY+qrW+14);

  // 링크 텍스트도 표시
  fill("#c8b4f8"); textSize(9);
  text("drive.google.com/...", width/2, qrY+qrW+28);
  pop();

  // 처음으로 버튼 — QR 아래
  let bw=min(cw-48,220), bx=width/2-bw/2;
  drawPinkBtn(bx, height-66, bw, 50, "🏠  처음으로");

  pop();
}

function handleEndingButtons(){
  let cw=min(width*0.88,520), bw=min(cw-48,220), bx=width/2-bw/2;
  if(mouseX>bx && mouseX<bx+bw && mouseY>height-66 && mouseY<height-16)
    currentScreen="start";
}
