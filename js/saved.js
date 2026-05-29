// ============================================================
// saved.js
// ============================================================

function drawSavedScreen(){
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let cw=min(width*0.82,460),cx=width/2-cw/2;
  drawCard(cx,height*0.08,cw,height*0.84,28);

  // 헤더 그라디언트
  push();noStroke();
  for(let i=0;i<70;i++){
    let t=i/70;
    fill(lerpColor(color("#b2f0e8"),color("#c8b4f8"),t),150);
    rect(cx,height*0.08+i,cw,1,i===0?28:0,i===0?28:0,0,0);
  }
  pop();

  // 체크 아이콘
  push();noStroke();
  fill(100,220,130,200);circle(width/2,height*0.28,88);
  fill(255);textSize(38);text("✓",width/2,height*0.28+4);
  pop();

  fill("#333");textSize(min(width*0.06,36));
  text("저장 완료! 🎉",width/2,height*0.42);
  fill("#aaa");textSize(13);
  text("PNG 파일이 자동 다운로드됩니다",width/2,height*0.5);
  fill("#c8b4f8");textSize(11);
  text("형식: "+formatNames[selectedFormat]+" | 프레임: "+frameNames[selectedFrame],width/2,height*0.56);

  // 새로 촬영 버튼
  let bw=min(cw-48,240),bx=width/2-bw/2;
  push();noStroke();
  fill(200,100,180,70);rect(bx+4,height*0.62+4,bw,50,25);
  for(let i=0;i<50;i++){
    let t=i/50;
    fill(lerpColor(color("#ff6b9d"),color("#c8b4f8"),t));
    rect(bx,height*0.62+i,bw,1,i===0?25:0,i===0?25:0,i===49?25:0,i===49?25:0);
  }
  fill(255);textSize(18);textAlign(CENTER,CENTER);
  text("📷  새로 촬영",width/2,height*0.62+25);
  pop();

  // 처음으로
  push();fill("#f3e5ff");noStroke();
  rect(bx,height*0.62+64,bw,44,22);
  fill("#c8b4f8");textSize(16);textAlign(CENTER,CENTER);
  text("🏠  처음으로",width/2,height*0.62+86);
  pop();

  pop();
}

function handleSavedButtons(){
  let cw=min(width*0.82,460),bw=min(cw-48,240),bx=width/2-bw/2;
  if(mouseX>bx&&mouseX<bx+bw&&mouseY>height*0.62&&mouseY<height*0.62+50){
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];currentScreen="camera";
  }
  if(mouseX>bx&&mouseX<bx+bw&&mouseY>height*0.62+64&&mouseY<height*0.62+108){
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];currentScreen="ending";
  }
}
