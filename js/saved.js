// ============================================================
// saved.js — Save complete screen (English)
// ============================================================
function drawSavedScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let cw = min(width*0.82, 460), cx = width/2 - cw/2;
  drawCard(cx, height*0.08, cw, height*0.84, 28);

  // Header
  push(); fill("#a8d8f0"); noStroke();
  rect(cx, height*0.08, cw, 66, 28, 28, 0, 0); pop();

  // Check circle
  push(); fill(80,200,130,200); noStroke();
  circle(width/2, height*0.28, 88);
  fill(255); textSize(38); text("✓", width/2, height*0.28+4); pop();

  fill("#333"); textSize(min(width*0.06, 36));
  text("Saved! 🎉", width/2, height*0.42);

  fill("#aaa"); textSize(13);
  text("Your PNG file has been downloaded", width/2, height*0.5);

  fill("#7ab8e8"); textSize(11);
  text("Frame: "+frameNames[selectedFrame], width/2, height*0.56);

  let bw = min(cw-48, 240), bx = width/2-bw/2;
  drawPinkBtn(bx, height*0.62,    bw, 50, "📷  Take New Photos");
  drawLightBtn(bx, height*0.62+60, bw, 44, "🏠  Back to Start");

  if (recordedVideoURL) {
    drawLightBtn(bx, height*0.62+114, bw, 44, "🎥 Save Video");
  }
  pop();
}

function handleSavedButtons() {
  let cw = min(width*0.82,460), bw = min(cw-48,240), bx = width/2-bw/2;

  if (mouseX>bx&&mouseX<bx+bw&&mouseY>height*0.62&&mouseY<height*0.62+50) {
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];currentScreen="camera"; return;
  }
  if (mouseX>bx&&mouseX<bx+bw&&mouseY>height*0.62+60&&mouseY<height*0.62+104) {
    allPhotos=[];selectedPhotos=[];capturedPhotos=[];currentScreen="ending"; return;
  }
  if (recordedVideoURL &&
      mouseX>bx&&mouseX<bx+bw&&mouseY>height*0.62+114&&mouseY<height*0.62+158) {
    let a=document.createElement("a");
    a.href=recordedVideoURL; a.download="photobooth-video.webm"; a.click();
  }
}
