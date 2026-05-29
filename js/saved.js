// ============================================================
// saved.js
// ============================================================

function drawSavedScreen(){
  drawBG();
  push();rectMode(CORNER);noStroke();textAlign(CENTER,CENTER);

  let cw=min(width*0.82,460),cx=width/2-cw/2;
  drawCard(cx,height*0.08,cw,height*0.84,28);

  push();fill("#b2f0e8");noStroke();
  rect(cx,height*0.08,cw,66,28,28,0,0);
  pop();

  push();fill(80,200,130,200);noStroke();
  circle(width/2,height*0.28,88);
  fill(255);textSize(38);text("✓",width/2,height*0.28+4);
  pop();

  fill("#333");textSize(min(width*0.06,36));
  text("저장 완료! 🎉",width/2,height*0.42);
  fill("#aaa");textSize(13);
  text("PNG 파일이 자동 다운로드됩니다",width/2,height*0.5);
  fill("#c8b4f8");textSize(11);
  text("형식: "+formatNames[selectedFormat]+" | 프레임: "+frameNames[selectedFrame],width/2,height*0.56);

  let bw=min(cw-48,240),bx=width/2-bw/2;
  drawPinkBtn(bx,height*0.62,bw,50,"📷  새로 촬영");
  drawLightBtn(bx,height*0.62+64,bw,44,"🏠  처음으로");
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
