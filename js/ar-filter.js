// ============================================================
// ar-filter.js — 담당: 응웬 바오 담 (Tamy)
// ============================================================

let faceMesh      = null;
let faceLandmarks = null;
let faceReady     = false;

let handDetector  = null;
let handLandmarks = null;

let gesTouchedPrev = false;
let gesIconTimer   = 0;

let _camW = 400;
let _camH = 300;

let danhSachTim = [];

// ============================================================
function initFaceMesh(camera) {
  let videoEl = camera.elt;

  faceMesh = new FaceMesh({
    locateFile: (file) =>
      "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/" + file
  });
  faceMesh.setOptions({
    maxNumFaces:            1,
    refineLandmarks:        true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence:  0.5
  });
  faceMesh.onResults((r) => {
    faceLandmarks = (r.multiFaceLandmarks && r.multiFaceLandmarks.length > 0)
      ? r.multiFaceLandmarks[0] : null;
  });

  handDetector = new Hands({
    locateFile: (file) =>
      "https://cdn.jsdelivr.net/npm/@mediapipe/hands/" + file
  });
  handDetector.setOptions({
    maxNumHands:            1,
    modelComplexity:        0,
    minDetectionConfidence: 0.7,
    minTrackingConfidence:  0.5
  });
  handDetector.onResults((r) => {
    handLandmarks = (r.multiHandLandmarks && r.multiHandLandmarks.length > 0)
      ? r.multiHandLandmarks[0] : null;
  });

  faceReady = true;

  for (let i = 0; i < 12; i++) {
    danhSachTim.push({
      ox:  random(-120, 120),
      oy:  random(-140, 60),
      toc: random(0.4, 1.2),
      kich:random(8, 20),
      mau: floor(random(5)),
      pha: random(TWO_PI)
    });
  }

  let dangXuLy = false;
  let demFrame  = 0;
  setInterval(async () => {
    if (dangXuLy || videoEl.readyState < 2) return;
    dangXuLy = true;
    demFrame++;
    try {
      await faceMesh.send({ image: videoEl });
      if (demFrame % 2 === 0) {
        await handDetector.send({ image: videoEl });
      }
    } catch (e) {}
    dangXuLy = false;
  }, 80);
}

// ============================================================
function lm(index, camX, camY) {
  if (!faceLandmarks || index >= faceLandmarks.length) {
    return { x: camX, y: camY };
  }
  let d = faceLandmarks[index];
  let xOffset = (typeof flipCamera !== "undefined" && flipCamera)
    ? (0.5 - d.x) * _camW
    : (d.x - 0.5) * _camW;
  return {
    x: camX + xOffset,
    y: camY + (d.y - 0.5) * _camH
  };
}

function getFaceWidth(camX, camY) {
  let trai = lm(234, camX, camY);
  let phai = lm(454, camX, camY);
  return dist(trai.x, trai.y, phai.x, phai.y);
}

// ============================================================
function drawARFilter(camX, camY, loaiFilter, camW, camH) {
  if (camW) _camW = camW;
  if (camH) _camH = camH;

  let arIdx = loaiFilter - 1;

  if (loaiFilter > 0) {
    if (faceLandmarks) {
      if      (arIdx === 0) veFilterNo(camX, camY);
      else if (arIdx === 1) veFilterTim(camX, camY);
      else if (arIdx === 2) veFilterMeoKawaii(camX, camY);
      else if (arIdx === 3) veFilterKinhTron(camX, camY);
      else if (arIdx === 4) veFilterEch(camX, camY);
    } else {
      veFilterCoDinh(camX, camY - _camH * 0.06, arIdx);
    }
  }

  let dangCham = ktraCuChi();
  if (gesTouchedPrev && !dangCham) {
    gesIconTimer = 60;
    if (typeof startPhotoSequence === "function" &&
        typeof isCapturing !== "undefined" && !isCapturing) {
      startPhotoSequence();
    }
  }
  gesTouchedPrev = dangCham;
  veHuongDanTay(dangCham, camX, camY);
}

// ============================================================
// 🎀 Filter 0: Ribbon
// ============================================================
function veFilterNo(camX, camY) {
  push();
  let dinh = lm(10, camX, camY);
  let tl   = getFaceWidth(camX, camY) / 180;
  let cx   = dinh.x;
  let cy   = dinh.y - 18*tl;

  push();
  fill("#ffb6c1"); stroke("#f48fb1"); strokeWeight(3*tl);
  beginShape();
  vertex(cx,cy);
  bezierVertex(cx-20*tl,cy-30*tl,cx-80*tl,cy-40*tl,cx-90*tl,cy-10*tl);
  bezierVertex(cx-80*tl,cy+20*tl,cx-20*tl,cy+10*tl,cx,cy);
  endShape(CLOSE);
  fill("#f48fb1"); noStroke();
  beginShape();
  vertex(cx-8*tl,cy-2*tl);
  bezierVertex(cx-20*tl,cy-15*tl,cx-55*tl,cy-22*tl,cx-65*tl,cy-5*tl);
  bezierVertex(cx-55*tl,cy+8*tl,cx-20*tl,cy+4*tl,cx-8*tl,cy-2*tl);
  endShape(CLOSE);
  pop();

  push();
  fill("#ffb6c1"); stroke("#f48fb1"); strokeWeight(3*tl);
  beginShape();
  vertex(cx,cy);
  bezierVertex(cx+20*tl,cy-30*tl,cx+80*tl,cy-40*tl,cx+90*tl,cy-10*tl);
  bezierVertex(cx+80*tl,cy+20*tl,cx+20*tl,cy+10*tl,cx,cy);
  endShape(CLOSE);
  fill("#f48fb1"); noStroke();
  beginShape();
  vertex(cx+8*tl,cy-2*tl);
  bezierVertex(cx+20*tl,cy-15*tl,cx+55*tl,cy-22*tl,cx+65*tl,cy-5*tl);
  bezierVertex(cx+55*tl,cy+8*tl,cx+20*tl,cy+4*tl,cx+8*tl,cy-2*tl);
  endShape(CLOSE);
  pop();

  push();
  fill("#f48fb1"); stroke("#e91e8c"); strokeWeight(2*tl);
  ellipse(cx,cy,22*tl,18*tl);
  fill("#ffcdd2"); noStroke();
  ellipse(cx-3*tl,cy-3*tl,8*tl,6*tl);
  pop();

  let viTriTia=[
    {x:cx-105*tl,y:cy-5*tl},{x:cx+105*tl,y:cy-5*tl},
    {x:cx-55*tl,y:cy-55*tl},{x:cx+55*tl,y:cy-55*tl},
    {x:cx,y:cy-60*tl},{x:cx-80*tl,y:cy+25*tl},{x:cx+80*tl,y:cy+25*tl}
  ];
  for (let i=0; i<viTriTia.length; i++) {
    let do_sang=map(sin(frameCount*0.07+i*0.9),-1,1,100,255);
    let sz=(4+sin(frameCount*0.05+i)*1.5)*tl;
    push();
    fill(255,255,255,do_sang); noStroke();
    translate(viTriTia[i].x,viTriTia[i].y);
    beginShape();
    vertex(0,-sz*3); vertex(sz,0); vertex(0,sz*3); vertex(-sz,0);
    endShape(CLOSE);
    pop();
  }
  pop();
}

// ============================================================
// 💕 Filter 1: Pastel Love
// ============================================================
let mauTimList = ["#ffb6c1","#b2f0e8","#fff59d","#c8e6c9","#e1bee7"];

function veTim(x, y, s) {
  push();
  translate(x,y); rotate(PI);
  beginShape();
  vertex(0,0);
  bezierVertex(-s*0.1,-s*0.4,-s*0.6,-s*0.4,-s*0.5,0);
  bezierVertex(-s*0.4,s*0.3,0,s*0.6,0,s*0.7);
  bezierVertex(0,s*0.6,s*0.4,s*0.3,s*0.5,0);
  bezierVertex(s*0.6,-s*0.4,s*0.1,-s*0.4,0,0);
  endShape(CLOSE);
  pop();
}

function veFilterTim(camX, camY) {
  push();
  let mui    = lm(1,   camX, camY);
  let maTrai = lm(234, camX, camY);
  let maPhai = lm(454, camX, camY);
  let tl     = getFaceWidth(camX, camY) / 180;

  // ✅ исправлено: setAlpha вместо второго аргумента fill()
  for (let i=0; i<danhSachTim.length; i++) {
    let t  = danhSachTim[i];
    let dy = (frameCount * t.toc * 0.5) % (_camH * 0.9);
    let tx = mui.x + t.ox * tl;
    let ty = mui.y + t.oy * tl - dy;
    let do_mo = map(sin(frameCount*0.04+t.pha),-1,1,120,220);
    let c = color(mauTimList[t.mau % mauTimList.length]);
    c.setAlpha(do_mo);
    fill(c); noStroke();
    veTim(tx, ty, t.kich*tl);
  }

  push();
  noStroke(); fill(255,182,193,120);
  ellipse(maTrai.x+8*tl,maTrai.y+8*tl,40*tl,22*tl);
  ellipse(maPhai.x-8*tl,maPhai.y+8*tl,40*tl,22*tl);
  pop();

  // ✅ исправлено: setAlpha вместо второго аргумента fill()
  push();
  let ca=color("#ffb6c1"); ca.setAlpha(200); fill(ca); noStroke();
  veTim(maTrai.x+5*tl,  maTrai.y+2*tl,  12*tl);
  let cb=color("#b2f0e8"); cb.setAlpha(200); fill(cb);
  veTim(maTrai.x+22*tl, maTrai.y-8*tl,  9*tl);
  let cc=color("#fff59d"); cc.setAlpha(200); fill(cc);
  veTim(maPhai.x-5*tl,  maPhai.y+2*tl,  12*tl);
  let cd=color("#c8e6c9"); cd.setAlpha(200); fill(cd);
  veTim(maPhai.x-22*tl, maPhai.y-8*tl,  9*tl);
  pop();

  pop();
}

// ============================================================
// 🐱 Filter 2: Cute Cat Kawaii
// ============================================================
function veFilterMeoKawaii(camX, camY) {
  push();
  let dinh   = lm(10,  camX, camY);
  let mui    = lm(1,   camX, camY);
  let maTrai = lm(234, camX, camY);
  let maPhai = lm(454, camX, camY);
  let tl     = getFaceWidth(camX, camY) / 180;
  let cx     = dinh.x;
  let cy     = dinh.y;

  push();
  for (let k=3; k>=0; k--) {
    let alpha=map(k,3,0,30,90);
    fill(255,182,193,alpha); noStroke();
    beginShape();
    vertex(cx-(72+k*3)*tl,cy+(12-k)*tl);
    vertex(cx-(88+k*2)*tl,cy-(58+k*4)*tl);
    vertex(cx-(32+k*2)*tl,cy-(12+k)*tl);
    endShape(CLOSE);
  }
  fill(255,182,193,160); noStroke();
  beginShape();
  vertex(cx-74*tl,cy+8*tl);
  vertex(cx-86*tl,cy-56*tl);
  vertex(cx-38*tl,cy-14*tl);
  endShape(CLOSE);
  pop();

  push();
  for (let k=3; k>=0; k--) {
    let alpha=map(k,3,0,30,90);
    fill(255,182,193,alpha); noStroke();
    beginShape();
    vertex(cx+(32+k*2)*tl,cy-(12+k)*tl);
    vertex(cx+(88+k*2)*tl,cy-(58+k*4)*tl);
    vertex(cx+(72+k*3)*tl,cy+(12-k)*tl);
    endShape(CLOSE);
  }
  fill(255,182,193,160); noStroke();
  beginShape();
  vertex(cx+38*tl,cy-14*tl);
  vertex(cx+86*tl,cy-56*tl);
  vertex(cx+74*tl,cy+8*tl);
  endShape(CLOSE);
  pop();

  push();
  stroke(255,182,193,180); strokeWeight(2.5*tl);
  for (let i=0; i<3; i++) {
    let vx=cx+(i-1)*8*tl;
    line(vx,cy-18*tl,vx,cy-36*tl);
  }
  pop();

  push();
  stroke(255,105,130,200); strokeWeight(2*tl); noFill();
  beginShape();
  vertex(maTrai.x-5*tl,maTrai.y-5*tl);
  bezierVertex(maTrai.x-25*tl,maTrai.y-15*tl,maTrai.x-50*tl,maTrai.y-12*tl,maTrai.x-65*tl,maTrai.y-8*tl);
  endShape();
  beginShape();
  vertex(maTrai.x-5*tl,maTrai.y+8*tl);
  bezierVertex(maTrai.x-25*tl,maTrai.y+4*tl,maTrai.x-50*tl,maTrai.y+8*tl,maTrai.x-65*tl,maTrai.y+12*tl);
  endShape();
  beginShape();
  vertex(maPhai.x+5*tl,maPhai.y-5*tl);
  bezierVertex(maPhai.x+25*tl,maPhai.y-15*tl,maPhai.x+50*tl,maPhai.y-12*tl,maPhai.x+65*tl,maPhai.y-8*tl);
  endShape();
  beginShape();
  vertex(maPhai.x+5*tl,maPhai.y+8*tl);
  bezierVertex(maPhai.x+25*tl,maPhai.y+4*tl,maPhai.x+50*tl,maPhai.y+8*tl,maPhai.x+65*tl,maPhai.y+12*tl);
  endShape();
  pop();

  push();
  fill(255,105,130,220); noStroke();
  veTim(mui.x,mui.y+4*tl,11*tl);
  pop();

  pop();
}

// ============================================================
// 👓 Filter 3: Round Glasses
// ============================================================
function veFilterKinhTron(camX, camY) {
  push();
  let mTO  = lm(33,  camX, camY);
  let mTT  = lm(133, camX, camY);
  let mPT  = lm(362, camX, camY);
  let mPO  = lm(263, camX, camY);
  let dinh = lm(10,  camX, camY);
  let tl   = getFaceWidth(camX, camY) / 180;

  let r       = dist(mTO.x,mTO.y,mTT.x,mTT.y)*0.65;
  let tamTrai = {x:(mTO.x+mTT.x)/2,y:(mTO.y+mTT.y)/2};
  let tamPhai = {x:(mPO.x+mPT.x)/2,y:(mPO.y+mPT.y)/2};

  push();
  noFill(); stroke("#555"); strokeWeight(3*tl);
  ellipse(tamTrai.x,tamTrai.y,r*2,r*2);
  ellipse(tamPhai.x,tamPhai.y,r*2,r*2);
  stroke("#555"); strokeWeight(2*tl);
  line(tamTrai.x+r,tamTrai.y,tamPhai.x-r,tamPhai.y);
  line(tamTrai.x-r,tamTrai.y,tamTrai.x-r-20*tl,tamTrai.y-5*tl);
  line(tamPhai.x+r,tamPhai.y,tamPhai.x+r+20*tl,tamPhai.y-5*tl);
  stroke(255,255,255,120); strokeWeight(2*tl);
  arc(tamTrai.x-r*0.3,tamTrai.y-r*0.3,r*0.7,r*0.6,PI,TWO_PI);
  arc(tamPhai.x-r*0.3,tamPhai.y-r*0.3,r*0.7,r*0.6,PI,TWO_PI);
  pop();

  let noMau="#90caf9",noBien="#42a5f5";
  let noViTri=[
    {x:dinh.x-42*tl,y:dinh.y-5*tl},
    {x:dinh.x+42*tl,y:dinh.y-5*tl}
  ];
  for (let i=0; i<noViTri.length; i++) {
    let nx=noViTri[i].x,ny=noViTri[i].y,ns=14*tl;
    push();
    fill(noMau); stroke(noBien); strokeWeight(1.5*tl);
    beginShape();
    vertex(nx,ny);
    bezierVertex(nx-ns,ny-ns*1.5,nx-ns*2.5,ny-ns,nx-ns*2.2,ny+ns*0.3);
    bezierVertex(nx-ns*1.5,ny+ns,nx-ns*0.3,ny+ns*0.3,nx,ny);
    endShape(CLOSE);
    beginShape();
    vertex(nx,ny);
    bezierVertex(nx+ns,ny-ns*1.5,nx+ns*2.5,ny-ns,nx+ns*2.2,ny+ns*0.3);
    bezierVertex(nx+ns*1.5,ny+ns,nx+ns*0.3,ny+ns*0.3,nx,ny);
    endShape(CLOSE);
    fill(noBien); noStroke();
    ellipse(nx,ny,ns*0.9,ns*0.7);
    pop();
  }
  pop();
}

// ============================================================
// Filter cố định
// ============================================================
function veFilterCoDinh(x, y, loai) {
  push();
  if (loai===0) {
    fill("#ffb6c1"); stroke("#f48fb1"); strokeWeight(3);
    beginShape();
    vertex(x,y); bezierVertex(x-20,y-30,x-80,y-40,x-90,y-10);
    bezierVertex(x-80,y+20,x-20,y+10,x,y);
    endShape(CLOSE);
    beginShape();
    vertex(x,y); bezierVertex(x+20,y-30,x+80,y-40,x+90,y-10);
    bezierVertex(x+80,y+20,x+20,y+10,x,y);
    endShape(CLOSE);
    fill("#f48fb1"); noStroke(); ellipse(x,y,22,18);

  } else if (loai===1) {
    // ✅ исправлено: setAlpha
    for (let i=0; i<6; i++) {
      let goc=i*PI/3;
      let r=70;
      let tx=x+cos(goc)*r;
      let ty=y+sin(goc)*r*0.5-30;
      let ct=color(mauTimList[i%mauTimList.length]);
      ct.setAlpha(180); fill(ct); noStroke();
      veTim(tx,ty,14);
    }
    fill(255,182,193,130); noStroke();
    ellipse(x-50,y+20,40,20);
    ellipse(x+50,y+20,40,20);

  } else if (loai===2) {
    fill("#fff0f5"); stroke("#ffb6c1"); strokeWeight(3);
    triangle(x-75,y+10,x-95,y-65,x-35,y-15);
    triangle(x+35,y-15,x+95,y-65,x+75,y+10);
    fill("#ffb6c1"); noStroke();
    triangle(x-75,y+3,x-90,y-52,x-42,y-12);
    triangle(x+42,y-12,x+90,y-52,x+75,y+3);
    fill("#ff8fab"); veTim(x,y+25,13);
    stroke("#888"); strokeWeight(1.5); noFill();
    line(x-30,y+30,x-95,y+22); line(x-30,y+42,x-95,y+40);
    line(x+30,y+30,x+95,y+22); line(x+30,y+42,x+95,y+40);

  } else if (loai===3) {
    noFill(); stroke("#555"); strokeWeight(3);
    ellipse(x-42,y+10,56,56); ellipse(x+42,y+10,56,56);
    line(x-14,y+10,x+14,y+10);
    line(x-70,y+10,x-90,y+5); line(x+70,y+10,x+90,y+5);
    fill("#90caf9"); stroke("#42a5f5"); strokeWeight(2);
    let nx1=x-42,ny1=y-42;
    beginShape(); vertex(nx1,ny1);
    bezierVertex(nx1-14,ny1-21,nx1-35,ny1-14,nx1-30.8,ny1+4.2);
    bezierVertex(nx1-21,ny1+14,nx1-4.2,ny1+4.2,nx1,ny1);
    endShape(CLOSE);
    beginShape(); vertex(nx1,ny1);
    bezierVertex(nx1+14,ny1-21,nx1+35,ny1-14,nx1+30.8,ny1+4.2);
    bezierVertex(nx1+21,ny1+14,nx1+4.2,ny1+4.2,nx1,ny1);
    endShape(CLOSE);
    fill("#42a5f5"); noStroke(); ellipse(nx1,ny1,12.6,9.8);
    let nx2=x+42;
    fill("#90caf9"); stroke("#42a5f5"); strokeWeight(2);
    beginShape(); vertex(nx2,ny1);
    bezierVertex(nx2-14,ny1-21,nx2-35,ny1-14,nx2-30.8,ny1+4.2);
    bezierVertex(nx2-21,ny1+14,nx2-4.2,ny1+4.2,nx2,ny1);
    endShape(CLOSE);
    beginShape(); vertex(nx2,ny1);
    bezierVertex(nx2+14,ny1-21,nx2+35,ny1-14,nx2+30.8,ny1+4.2);
    bezierVertex(nx2+21,ny1+14,nx2+4.2,ny1+4.2,nx2,ny1);
    endShape(CLOSE);
    fill("#42a5f5"); noStroke(); ellipse(nx2,ny1,12.6,9.8);
  }
  pop();
}

// ============================================================
// Жест рукой
// ============================================================
function ktraCuChi() {
  if (!handLandmarks) return false;
  let ngonCai=handLandmarks[4];
  let ngonTro=handLandmarks[8];
  return dist(ngonCai.x,ngonCai.y,ngonTro.x,ngonTro.y)<0.06;
}

function veHuongDanTay(dangCham, camX, camY) {
  push(); noStroke();
  if (gesIconTimer>0) {
    textAlign(CENTER,CENTER);
    textSize(min(_camW*0.18,80));
    fill(255,255,255,map(gesIconTimer,0,60,0,255));
    text("📸",camX,camY);
    gesIconTimer--;
  }
  if (handLandmarks) {
    let ngonCai=handLandmarks[4];
    let ngonTro=handLandmarks[8];
    let caiX=(typeof flipCamera!=="undefined"&&flipCamera)
      ?(1-ngonCai.x)*width:ngonCai.x*width;
    let caiY=ngonCai.y*height;
    let troX=(typeof flipCamera!=="undefined"&&flipCamera)
      ?(1-ngonTro.x)*width:ngonTro.x*width;
    let troY=ngonTro.y*height;
    if (dangCham){stroke("#ff4d6d");strokeWeight(4);line(caiX,caiY,troX,troY);}
    noStroke();
    fill(dangCham?"#ff4d6d":255);
    circle(caiX,caiY,20); circle(troX,troY,20);
  }
  pop();
}

function updateParticles() {}

function drawFaceStatus(w, h) {
  push();
  noStroke(); textAlign(LEFT,CENTER); textSize(14);
  if (!faceReady) {
    fill(255,200,0,200);
    text("⏳ 모델 로딩 중...",20,h-55);
  } else if (!faceLandmarks) {
    fill(255,100,100,200);
    text("😶 얼굴을 카메라에 맞춰주세요",20,h-55);
  } else {
    fill(100,220,100,200);
    text("✅ 얼굴 인식 중",20,h-55);
  }
  pop();
}

// ============================================================
// 🐸 Filter 4: Frog
// ============================================================
function veFilterEch(camX, camY) {
  push();
  let dinh   = lm(10,  camX, camY);
  let maTrai = lm(234, camX, camY);
  let maPhai = lm(454, camX, camY);
  let tl     = getFaceWidth(camX, camY) / 180;
  let ex=dinh.x, ey=dinh.y-55*tl;

  push(); fill("#4CAF50"); noStroke();
  ellipse(ex,ey,150*tl,120*tl); pop();

  veMat_Ech(ex-40*tl,ey-60*tl,tl);
  veMat_Ech(ex+40*tl,ey-60*tl,tl);

  push(); fill("#2E7D32"); noStroke();
  ellipse(ex-15*tl,ey-10*tl,8*tl,6*tl);
  ellipse(ex+15*tl,ey-10*tl,8*tl,6*tl); pop();

  push(); noFill(); stroke("#2E7D32"); strokeWeight(3*tl);
  arc(ex,ey+10*tl,80*tl,40*tl,0.2,PI-0.2); pop();

  push(); noStroke(); fill(255,182,193,130);
  ellipse(maTrai.x+8*tl,maTrai.y+5*tl,28*tl,14*tl);
  ellipse(maPhai.x-8*tl,maPhai.y+5*tl,28*tl,14*tl); pop();

  pop();
}

function veMat_Ech(x, y, tl) {
  push();
  fill("white"); stroke("#2E7D32"); strokeWeight(3*tl);
  circle(x,y,50*tl);
  fill("black"); noStroke(); circle(x,y,22*tl);
  fill(255); noStroke(); circle(x-5*tl,y-5*tl,8*tl);
  pop();
}
