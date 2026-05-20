/* ==========================================================================
   ЛОГИКА КАМЕРЫ И СЪЕМКИ (ONLY CAMERA & COUNTDOWN)
   ========================================================================== */

let videoCapture;            
let p5Canvas;                
let isSessionActive = false; 

let currentPhotoCount = 0;   
const MAX_PHOTOS = 4;        
let countdownTimer = null;   

function setup() {
  const cameraBox = document.querySelector('.camera-box');
  if (!cameraBox) return;

  const w = cameraBox.clientWidth;
  const h = cameraBox.clientHeight;

  // Создаем холст и привязываем его к HTML
  p5Canvas = createCanvas(w, h);
  p5Canvas.parent(cameraBox);

  // Обычный запуск камеры БЕЗ подключения к сторонним ИИ-библиотекам
  videoCapture = createCapture(VIDEO);
  videoCapture.size(w, h);
  videoCapture.hide(); 
}

function draw() {
  background(0); // Черный фон по умолчанию

  if (videoCapture) {
    // Эффект зеркала, чтобы удобно позировать
    translate(width, 0);
    scale(-1, 1);
    
    // Рисуем живое видео на холсте
    image(videoCapture, 0, 0, width, height);
    
    // Возвращаем координаты обратно
    scale(-1, 1);
    translate(-width, 0);
  }

  // Временно рисуем только конфетти (для красоты), пока ИИ отключен
  if (typeof drawAROverlay === 'function') {
    drawAROverlay(p5Canvas);
  }
}

function startPhotoSession() {
  isSessionActive = true;
  currentPhotoCount = 0;
  window.AppState.capturedImages = []; 

  setTimeout(() => {
    runCountdownSequence();
  }, 2000);
}

function runCountdownSequence() {
  if (currentPhotoCount >= MAX_PHOTOS) {
    endPhotoSession();
    return;
  }

  let timeLeft = 3; 
  const countdownOverlay = document.getElementById("countdown-overlay");
  
  if (countdownOverlay) {
    countdownOverlay.textContent = timeLeft;
    countdownOverlay.classList.remove("hidden");
  }

  countdownTimer = setInterval(() => {
    timeLeft--;
    
    if (timeLeft > 0) {
      if (countdownOverlay) countdownOverlay.textContent = timeLeft;
    } else {
      clearInterval(countdownTimer);
      if (countdownOverlay) countdownOverlay.classList.add("hidden");
      triggerFlashAndCapture();
    }
  }, 1000);
}

function triggerFlashAndCapture() {
  const flashOverlay = document.getElementById("flash-overlay");
  if (flashOverlay) {
    flashOverlay.classList.add("flash-active");
    setTimeout(() => {
      flashOverlay.classList.remove("flash-active");
    }, 350);
  }
  captureCanvasFrame();
}

function captureCanvasFrame() {
  let snapshot = get(); 
  currentPhotoCount++;

  window.AppState.capturedImages.push(snapshot);

  if (currentPhotoCount < MAX_PHOTOS) {
    setTimeout(() => {
      runCountdownSequence();
    }, 2000);
  } else {
    setTimeout(() => {
      endPhotoSession();
    }, 1000);
  }
}

function endPhotoSession() {
  isSessionActive = false;
  switchScreen("result-screen");

  if (typeof renderPhotoStrip === "function") {
    renderPhotoStrip();
  }
}
