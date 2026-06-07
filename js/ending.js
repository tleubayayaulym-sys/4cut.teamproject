// ============================================================
// ending.js — Ending credit screen (English)
// ============================================================
function drawEndingScreen() {
  drawBG();
  push(); rectMode(CORNER); noStroke(); textAlign(CENTER,CENTER);

  let cw = min(width*0.88, 520), cx = width/2 - cw/2;
  drawCard(cx, 8, cw, height-16, 24);

  // Header — blue theme
  push(); fill("#a8d8f0"); noStroke();
  rect(cx, 8, cw, 68, 24, 24, 0, 0);
  fill(255,255,255,80); noStroke();
  rect(cx, 8, cw, 34, 24, 24, 0, 0);
  fill(255); textSize(min(cw*0.08, 24));
  text("📸  4CUT BOOTH", width/2, 34);
  fill(255,255,255,200); textSize(10);
  text("Art & Technology  |  Team 13  |  2026", width/2, 56);
  pop();

  // Divider
  push(); stroke("#d0eaf8"); strokeWeight(1.5); noFill();
  line(cx+24, 80, cx+cw-24, 80); pop();

  // Team members
  let members = [
    {name:"Tleubay Ayaulym",    role:"Camera · UI · Screen Flow",         col:"#b3d9ff"},
    {name:"Nguyen Bao Dam",      role:"AR Filter · FaceMesh · Hand Pose",  col:"#b2f0e8"},
    {name:"Mai Thi Tu Trang",    role:"Result Screen · Frame · Save",       col:"#d4b3ff"},
  ];

  for (let i=0; i<members.length; i++) {
    push();
    let my = height*0.22 + i*72;

    fill(members[i].col+"55"); noStroke();
    rect(cx+16, my-20, cw-32, 58, 12);

    fill(members[i].col); noStroke();
    circle(cx+38, my+9, 28);
    fill(255); textSize(13); textAlign(CENTER,CENTER);
    text(str(i+1), cx+38, my+9);

    fill("#333"); textSize(min(cw*0.032,16)); textAlign(LEFT,CENTER);
    text(members[i].name, cx+58, my-2);
    fill("#888"); textSize(11);
    text(members[i].role, cx+58, my+16);
    pop();
  }

  // Tech stack
  push();
  fill("#e8f4ff"); noStroke();
  rect(cx+16, height*0.6, cw-32, 48, 12);
  fill("#4a90d9"); textSize(11); textAlign(CENTER,CENTER);
  text("Technologies Used", width/2, height*0.6+12);
  fill("#555"); textSize(10);
  text("p5.js  ·  MediaPipe FaceMesh  ·  MediaPipe Hands  ·  GitHub Pages",
       width/2, height*0.6+32);
  pop();

  // Back home button
  let bw = min(cw-48, 220), bx = width/2 - bw/2;
  drawPinkBtn(bx, height*0.74, bw, 48, "🏠  Back to Start");
  pop();
}

function handleEndingButtons() {
  let cw = min(width*0.88, 520);
  let bw = min(cw-48, 220), bx = width/2 - bw/2;
  let by = height*0.74;
  if (mouseX>=bx && mouseX<=bx+bw && mouseY>=by && mouseY<=by+48) {
    allPhotos=[]; selectedPhotos=[]; capturedPhotos=[];
    currentScreen="start";
  }
}
