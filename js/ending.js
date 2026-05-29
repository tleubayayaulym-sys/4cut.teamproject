// ============================================================
// ending.js — QR 코드 포함
// ============================================================

function drawEndingScreen(){
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let cw=min(width*0.88,520),cx=width/2-cw/2;
  drawCard(cx,8,cw,height-16,24);

  // 헤더
  push();noStroke();
  for(let i=0;i<68;i++){
    let t=i/68;
    fill(lerpColor(color("#ffb6c1"),color("#c8b4f8"),t),160);
    rect(cx,8+i,cw,1,i===0?24:0,i===0?24:0,0,0);
  }
  fill(255);textSize(min(cw*0.08,28));
  text("📸 4CUT BOOTH",width/2,38);
  fill(255,255,255,180);textSize(11);
  text("Art & Technology  |  Team 13  |  2026",width/2,60);
  pop();

  // 구분선
  push();stroke("#f0e0ff");strokeWeight(1.5);noFill();
  line(cx+24,80,cx+cw-24,80);pop();

  // 팀원 카드
  let members=[
    {name:"틀레우바이 아야으름",role:"카메라 · UI · 전체 흐름",col:"#ffb6c1"},
    {name:"응웬 바오 담",       role:"AR 필터 · FaceMesh · Hands",col:"#b2f0e8"},
    {name:"마이티투짱",         role:"결과 화면 · 프레임 · 저장",col:"#e1bee7"},
  ];
  for(let i=0;i<members.length;i++){
    push(); let my=height*0.28+i*76;
    // 카드
    fill(members[i].col+"44");noStroke();
    rect(cx+16,my-22,cw-32,62,14);
    // 번호 원
    fill(members[i].col);noStroke();
    circle(cx+40,my+9,30);
    fill(255);textSize(14);textAlign(CENTER,CENTER);
    text(str(i+1),cx+40,my+9);
    // 이름 + 역할
    fill("#333");textSize(min(cw*0.038,18));textAlign(LEFT,CENTER);
    text(members[i].name,cx+62,my-2);
    fill("#999");textSize(11);
    text(members[i].role,cx+62,my+18);
    pop();
  }

  // 기술 스택
  push();
  fill("#f3e5ff");noStroke();
  rect(cx+16,height*0.68,cw-32,50,14);
  fill("#c8b4f8");textSize(11);textAlign(CENTER,CENTER);
  text("사용 기술",width/2,height*0.68+12);
  fill("#777");textSize(10);
  text("p5.js  ·  MediaPipe FaceMesh  ·  MediaPipe Hands  ·  GitHub Pages",
       width/2,height*0.68+32);
  pop();

  // QR 코드
  push();
  fill("#fff0f5");noStroke();
  rect(cx+16,height*0.76,cw-32,110,14);
  fill("#ff4d6d");textSize(12);textAlign(CENTER,CENTER);
  text("📱  제작 영상 보기",width/2,height*0.76+16);
  if(qrCanvas){
    // QR 이미지를 p5.js로 그리기
    let qrImg=createImg(qrCanvas.toDataURL(),"qr");
    qrImg.hide();
    let qrW=80;
    image(qrImg,width/2-qrW/2,height*0.76+26,qrW,qrW);
  } else {
    fill("#eee");noStroke();rect(width/2-40,height*0.76+26,80,80,8);
    fill("#bbb");textSize(11);
    text("QR 로딩 중...",width/2,height*0.76+66);
  }
  fill("#aaa");textSize(10);
  text("Google Drive 영상 폴더",width/2,height*0.76+118);
  pop();

  // 처음으로 버튼
  let bw=min(cw-48,220),bx=width/2-bw/2;
  push();noStroke();
  fill(200,100,180,70);rect(bx+4,height-66,bw,50,25);
  for(let i=0;i<50;i++){
    let t=i/50;
    fill(lerpColor(color("#ff6b9d"),color("#c8b4f8"),t));
    rect(bx,height-66+i,bw,1,i===0?25:0,i===0?25:0,i===49?25:0,i===49?25:0);
  }
  fill(255);textSize(17);textAlign(CENTER,CENTER);
  text("🏠  처음으로",width/2,height-41);
  pop();

  pop();
}

function handleEndingButtons(){
  let cw=min(width*0.88,520),bw=min(cw-48,220),bx=width/2-bw/2;
  if(mouseX>bx&&mouseX<bx+bw&&mouseY>height-66&&mouseY<height-16)
    currentScreen="start";
}
