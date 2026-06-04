// ============================================================
// camera.js — 담당: 틀레우바이 아야으름
// + Timer selection, flip camera fix
// ============================================================

let mediaRecorder    = null;
let recordedChunks   = [];
let recordedVideoURL = null;

let video;
let capturedPhotos = [];
let allPhotos      = [];
let selectedPhotos = [];
let countdown      = 0;
let isCapturing    = false;
let cameraError    = false;
let flipCamera     = true;
let countdownTime  = 3; // 3, 5, or 10 seconds
let isCapturingClean = false; // khi true: chỉ vẽ video+filter

let _boxX=0, _boxY=0, _boxW=400, _boxH=300;
const MAX_PHOTOS = 8;

// ============================================================
function setupCamera() {
  try {
    video = createCapture(VIDEO, () => { cameraError = false; });
    // Chỉ cần 640x480 — khớp với camera box, giảm data xử lý
    video.size(640, 480);
    video.hide();
    initFaceMesh(video);
    video.elt.onloadedmetadata = () => {
      try {
        const stream = video.elt.srcObject;
        if (!stream) return;
        mediaRecorder = new MediaRecorder(stream, {mimeType:"video/webm"});
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) recordedChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          let blob = new Blob(recordedChunks, {type:"video/webm"});
          recordedVideoURL = URL.createObjectURL(blob);
        };
      } catch(e) { mediaRecorder = null; }
    };
  } catch(e) { cameraError = true; }
}

// ============================================================
function drawCamera() {
  push(); rectMode(CORNER); textAlign(CENTER,CENTER);

  if (cameraError || !video || video.width===0) {
    drawCameraError(); pop(); return;
  }

  drawBG();

  let camW = min(width*0.65, 480);
  let camH = camW * 0.72;
  let camX = width/2 - camW/2;
  let camY = height * 0.07;

  _boxX=camX; _boxY=camY; _boxW=camW; _boxH=camH;

  // Camera frame - soft glow + clean border
  let fc = color(frameColors[selectedFrame]);
  let fr = red(fc), fg = green(fc), fb = blue(fc);
  // Glow mờ bên ngoài
  push(); noFill();
  stroke(fr, fg, fb, 30); strokeWeight(18); rect(camX, camY, camW, camH, 18);
  stroke(fr, fg, fb, 20); strokeWeight(12); rect(camX, camY, camW, camH, 18);
  stroke(fr, fg, fb, 12); strokeWeight(6);  rect(camX, camY, camW, camH, 18);
  pop();
  // Shadow nhẹ
  push(); noFill();
  stroke(40, 50, 80, 18); strokeWeight(6); rect(camX+3, camY+4, camW, camH, 18);
  pop();
  // Viền chính tối bo tròn
  push(); stroke(30, 30, 45, 190); strokeWeight(3); noFill();
  rect(camX, camY, camW, camH, 18); pop();
  // Viền màu frame bên trong
  push(); stroke(fr, fg, fb, 120); strokeWeight(2); noFill();
  rect(camX+4, camY+4, camW-8, camH-8, 14); pop();

  // Video with flip
  push();
  if (flipCamera) {
    translate(camX+camW, camY);
    scale(-1, 1);
    imageMode(CORNER);
    image(video, 0, 0, camW, camH);
  } else {
    imageMode(CORNER);
    image(video, camX, camY, camW, camH);
  }
  pop();

  // AR filter
  drawARFilter(camX+camW/2, camY+camH/2, selectedFilter, camW, camH);
  drawFaceStatus(width, height);

  // === UI chỉ hiện khi không capture sạch ===
  if (!isCapturingClean) {
    // LIVE badge
    push(); fill(255,77,109,200); noStroke();
    rect(camX+10, camY+10, 58, 24, 12);
    fill(255); textSize(11); text("● LIVE", camX+39, camY+22); pop();

    // Flip button
    push();
    fill(flipCamera ? color(255,77,109,200) : color(0,0,0,130));
    noStroke(); rect(camX+10, camY+42, 76, 24, 12);
    fill(255); textSize(10);
    text(flipCamera?"🔄 Mirror":"🔄 Normal", camX+48, camY+54); pop();

    // Shot count badge
    push(); fill(0,0,0,130); noStroke();
    rect(camX+camW-82, camY+10, 72, 24, 12);
    fill(255); textSize(11);
    text("📷 "+allPhotos.length+"/"+MAX_PHOTOS, camX+camW-46, camY+22); pop();

    // Gesture hint
    push(); fill(0,0,0,110); noStroke();
    rect(camX+camW-188, camY+camH-36, 178, 26, 13);
    fill(255); textSize(10); textAlign(LEFT,CENTER);
    text("👌 Pinch fingers = shoot", camX+camW-182, camY+camH-23); pop();

    // Filter buttons
    let fBtnSize = min(width*0.058, 38);
    let fBtnX    = camX+camW+14;
    for (let i=0; i<filterEmoji.length; i++) {
      push(); let by=camY+i*(fBtnSize+7);
      fill(0,0,0,12); noStroke(); rect(fBtnX+2,by+2,fBtnSize,fBtnSize,9);
      if(selectedFilter===i){ fill("#ff4d6d"); noStroke(); }
      else{ fill("#fff"); stroke("#eee"); strokeWeight(1.5); }
      rect(fBtnX,by,fBtnSize,fBtnSize,9);
      noStroke(); fill(selectedFilter===i?"#fff":"#555");
      textSize(fBtnSize*0.45);
      text(filterEmoji[i], fBtnX+fBtnSize/2, by+fBtnSize/2); pop();
    }

    // Timer selection
    let timerY = camY + camH + 14;
    push(); fill("#888"); noStroke(); textSize(11); textAlign(CENTER,CENTER);
    text("Timer:", camX+30, timerY+16); pop();
    let times = [3, 5, 10];
    for (let i=0; i<times.length; i++) {
      push();
      let tx = camX+60+i*52, ty = timerY;
      if(countdownTime===times[i]){ fill("#ff4d6d"); noStroke(); }
      else{ fill(255,255,255,180); stroke("#ddd"); strokeWeight(1.5); }
      rect(tx, ty, 44, 30, 15);
      noStroke(); fill(countdownTime===times[i]?255:"#555");
      textSize(12); textAlign(CENTER,CENTER);
      text(times[i]+"s", tx+22, ty+15);
      pop();
    }

    // Photo previews
    let prevSize  = min(width*0.072, 48);
    let prevGap   = 5;
    let prevTotal = prevSize*MAX_PHOTOS+prevGap*(MAX_PHOTOS-1);
    let prevStart = width/2-prevTotal/2;
    let prevY     = timerY + 40;
    for (let i=0; i<MAX_PHOTOS; i++) {
      push(); let px=prevStart+i*(prevSize+prevGap);
      fill(0,0,0,12); noStroke(); rect(px+2,prevY+2,prevSize,prevSize,7);
      if (allPhotos[i]) {
        imageMode(CORNER); image(allPhotos[i],px,prevY,prevSize,prevSize);
        stroke("#ff4d6d"); strokeWeight(2); noFill(); rect(px,prevY,prevSize,prevSize,7);
        fill("#ff4d6d"); noStroke(); circle(px+prevSize-7,prevY+7,14);
        fill(255); textSize(8); textAlign(CENTER,CENTER); text(str(i+1),px+prevSize-7,prevY+7);
      } else {
        fill(i===allPhotos.length&&isCapturing?"#ff4d6d":"#f3e5ff");
        stroke("#c8b4f8"); strokeWeight(1.5); rect(px,prevY,prevSize,prevSize,7);
        noStroke(); fill(i===allPhotos.length&&isCapturing?255:"#c8b4f8");
        textSize(9); textAlign(CENTER,CENTER); text(str(i+1),px+prevSize/2,prevY+prevSize/2);
      }
      pop();
    }

    // Shoot button
    let btnY = height-68;
    if (isCapturing||allPhotos.length>=MAX_PHOTOS) {
      push(); fill("#f0f0f0"); noStroke(); rect(width/2-116,btnY,232,48,24);
      fill("#ccc"); textSize(15); textAlign(CENTER,CENTER);
      text(allPhotos.length>=MAX_PHOTOS?"Max 8 shots ✓":"Shooting...",width/2,btnY+24); pop();
    } else {
      drawPinkBtn(width/2-116, btnY, 232, 48, "📷  Shoot");
    }
    if (allPhotos.length>0) drawLightBtn(width/2+122, btnY, 116, 48, "Select →");
    if (recordedVideoURL) {
      push(); fill(80,180,120,200); noStroke();
      rect(width/2-58,btnY-54,116,38,19);
      fill(255); textSize(12); textAlign(CENTER,CENTER);
      text("🎥 Save Video",width/2,btnY-35); pop();
    }
    drawLightBtn(16, 12, 82, 32, "← Back");
  } // end if(!isCapturingClean)

  // Countdown overlay
  if (countdown>0) {
    push(); fill(0,0,0,150); noStroke(); rect(camX,camY,camW,camH);
    fill(255,77,109,80); textSize(min(camW*0.32,150)+16); textAlign(CENTER,CENTER);
    text(str(countdown),camX+camW/2,camY+camH/2);
    fill(255); stroke("#ff4d6d"); strokeWeight(4);
    textSize(min(camW*0.32,150)); text(str(countdown),camX+camW/2,camY+camH/2);
    pop();
  }

  pop();
}

// ============================================================
function drawCameraError() {
  drawBG();
  push(); rectMode(CORNER); textAlign(CENTER,CENTER); noStroke();
  let cw=min(width*0.78,420), cx=width/2-cw/2;
  drawCard(cx,height*0.18,cw,height*0.64,24);
  push(); fill("#ffb6c1"); noStroke(); circle(width/2,height*0.34,90);
  fill(255); textSize(36); text("📷",width/2,height*0.34+4); pop();
  fill("#ff4d6d"); textSize(min(width*0.044,24));
  text("Camera unavailable",width/2,height*0.48);
  fill("#aaa"); textSize(13);
  text("Please allow camera access in your browser 🙏",width/2,height*0.55);
  drawPinkBtn(width/2-104,height*0.65,208,46,"🔄  Refresh");
  drawLightBtn(16,12,82,32,"← Back");
  pop();
}

// ============================================================
function handleCameraButtons() {
  if(mouseX>16&&mouseX<98&&mouseY>12&&mouseY<44){ currentScreen="settings"; return; }

  if(cameraError||!video||video.width===0){
    if(mouseX>width/2-104&&mouseX<width/2+104&&mouseY>height*0.65&&mouseY<height*0.65+46)
      location.reload();
    return;
  }

  let camW=min(width*0.65,480), camX=width/2-camW/2, camY=height*0.07;
  let camH=camW*0.72;

  // Flip button
  if(mouseX>camX+10&&mouseX<camX+86&&mouseY>camY+42&&mouseY<camY+66){
    flipCamera=!flipCamera; return;
  }

  // Timer buttons
  let timerY=camY+camH+14;
  let times=[3,5,10];
  for(let i=0;i<times.length;i++){
    let tx=camX+60+i*52;
    if(mouseX>tx&&mouseX<tx+44&&mouseY>timerY&&mouseY<timerY+30){
      countdownTime=times[i]; return;
    }
  }

  // Filter buttons
  let fBtnSize=min(width*0.058,38), fBtnX=camX+camW+14;
  for(let i=0;i<filterEmoji.length;i++){
    let by=camY+i*(fBtnSize+7);
    if(mouseX>fBtnX&&mouseX<fBtnX+fBtnSize&&mouseY>by&&mouseY<by+fBtnSize){
      selectedFilter=i; return;
    }
  }

  let btnY=height-68;

  if(recordedVideoURL&&mouseX>width/2-58&&mouseX<width/2+58&&mouseY>btnY-54&&mouseY<btnY-16){
    let a=document.createElement("a"); a.href=recordedVideoURL;
    a.download="4cut-video.webm"; a.click(); return;
  }

  if(allPhotos.length>0&&mouseX>width/2+122&&mouseX<width/2+238&&mouseY>btnY&&mouseY<btnY+48){
    if(mediaRecorder&&mediaRecorder.state==="recording") mediaRecorder.stop();
    selectedPhotos=[]; currentScreen="select"; return;
  }

  if(!isCapturing&&allPhotos.length<MAX_PHOTOS&&
     mouseX>width/2-116&&mouseX<width/2+116&&mouseY>btnY&&mouseY<btnY+48){
    takeSinglePhoto();
  }
}

// ============================================================
function takeSinglePhoto() {
  if(isCapturing||allPhotos.length>=MAX_PHOTOS) return;
  if(allPhotos.length===0&&mediaRecorder&&mediaRecorder.state==="inactive"){
    recordedChunks=[];
    try { mediaRecorder.start(); } catch(e){}
  }
  isCapturing=true; countdown=countdownTime;
  let timer=setInterval(()=>{
    countdown--;
    if(countdown<=0){
      clearInterval(timer); countdown=0;
      // Bật chế độ clean capture: ẩn UI
        isCapturingClean = true;
        setTimeout(()=>{
        let img=get(_boxX,_boxY,_boxW,_boxH);
        isCapturingClean = false;
        allPhotos.push(img);
        flashEffect();
        isCapturing=false;
        if(allPhotos.length>=MAX_PHOTOS){
          if(mediaRecorder&&mediaRecorder.state==="recording") mediaRecorder.stop();
          selectedPhotos=[];
          setTimeout(()=>{ currentScreen="select"; },800);
        }
      },50);
    }
  },1000);
}

function startPhotoSequence() { takeSinglePhoto(); }

function flashEffect() {
  push(); rectMode(CORNER); fill(255,255,255,200); noStroke();
  rect(0,0,width,height); pop();
}
