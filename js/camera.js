/* ==========================================================================
   ЛОГИКА КАМЕРЫ И СЪЕМКИ (REAL CAMERA & COUNTDOWN LOGIC WITH P5.JS)
   ========================================================================== */

let videoCapture; // Переменная для потока видео с веб-камеры
let p5Canvas;     // Ссылка на холст p5.js
let isSessionActive = false; // Статус: идет ли сейчас фотосессия

let countdownNumber = 3;
let currentPhotoCount = 0;
const MAX_PHOTOS = 4;
let countdownTimer = null;

/**
 * Главные функции p5.js (Глобальный режим)
 * p5.js автоматически ищет функции setup() и draw() при запуске страницы
 */
function setup() {
  // Находим контейнер .camera-box в HTML
  const cameraBox = document.querySelector('.camera-box');
  if (!cameraBox) return;

  // Узнаем его размеры, чтобы холст идеально вписался
  const w = cameraBox.clientWidth;
  const h = cameraBox.clientHeight;

  // Создаем холст p5.js и помещаем его внутрь нашей черной рамки
  p5Canvas = createCanvas(w, h);
  p5Canvas.parent(cameraBox);

  // Включаем захват видео с веб-камеры
  videoCapture = createCapture(VIDEO);
  videoCapture.size(w, h);
  videoCapture.hide(); // Прячем стандартный тег <video>, так как будем рисовать его на холсте
}

function draw() {
  // Очищаем экран черным цветом
  background(0);

  if (videoCapture) {
    // Зеркально отражаем видео (как в селфи-камере), чтобы пользователю было удобно
    translate(width, 0);
    scale(-1, 1);
    
    // Рисуем текущий кадр с веб-камеры на весь холст
    image(videoCapture, 0, 0, width, height);
    
    // Возвращаем настройки трансформации обратно для рисования других элементов
    scale(-1, 1);
    translate(-width, 0);
  }

  // --- ИНТЕГРАЦИЯ ДЛЯ НГУЕНА (AR-ФИЛЬТРЫ) ---
  // Если Нгуен уже создала функцию drawAROverlay, p5.js будет вызывать её здесь каждый кадр
  if (typeof drawAROverlay === 'function') {
    drawAROverlay(p5Canvas);
  }
}

/**
 * Функция запуска сессии съемки (Вызывается из main.js при клике на "촬영 시작하기")
 */
function startPhotoSession() {
  console.log("📸 Камера активирована. Старт сессии.");
  isSessionActive = true;
  currentPhotoCount = 0;
  window.AppState.capturedImages = []; // Очищаем массив старых фоток

  // Даем пользователю 2 секунды подготовиться и запускаем первый отсчет
  setTimeout(() => {
    runCountdownSequence();
  }, 2000);
}

/**
 * Логика обратного отсчета 3... 2... 1...
 */
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

  // Каждую секунду обновляем цифру на экране
  countdownTimer = setInterval(() => {
    timeLeft--;
    
    if (timeLeft > 0) {
      if (countdownOverlay) countdownOverlay.textContent = timeLeft;
    } else {
      // Время вышло! Выключаем таймер, прячем текст и делаем снимок
      clearInterval(countdownTimer);
      if (countdownOverlay) countdownOverlay.classList.add("hidden");
      
      triggerFlashAndCapture();
    }
  }, 1000);
}

/**
 * Эффект вспышки и моментальный захват изображения
 */
function triggerFlashAndCapture() {
  // 1. Включаем анимацию вспышки из style.css
  const flashOverlay = document.getElementById("flash-overlay");
  if (flashOverlay) {
    flashOverlay.classList.add("flash-active");
    setTimeout(() => {
      flashOverlay.classList.remove("flash-active");
    }, 350); // Убираем класс через 0.35 секунды (длина анимации)
  }

  // 2. Делаем снимок (захватываем текущую картинку с p5 canvas)
  captureCanvasFrame();
}

/**
 * Сохранение кадра в память приложения
 */
function captureCanvasFrame() {
  // Функция get() из p5.js делает моментальный снимок текущего состояния холста
  // Вместе с видео и наложенными поверх AR-фильтрами Нгуена!
  let snapshot = get();
  
  currentPhotoCount++;
  console.log(`📷 Снят кадр №${currentPhotoCount}`);

  // Сохраняем снимок в глобальный массив для Май
  window.AppState.capturedImages.push(snapshot);

  // Даем пользователю 2 секунды, чтобы сменить позу, и запускаем отсчет для следующего кадра
  if (currentPhotoCount < MAX_PHOTOS) {
    setTimeout(() => {
      runCountdownSequence();
    }, 2000);
  } else {
    // Если сняли 4 кадра, завершаем
    setTimeout(() => {
      endPhotoSession();
    }, 1000);
  }
}

/**
 * Завершение съемки и передача управления экрану результатов
 */
function endPhotoSession() {
  isSessionActive = false;
  console.log("🎉 Все 4 кадра успешно сохранены в AppState!");

  // Переключаем экран на экран результатов (функция из main.js)
  if (typeof switchScreen === "function") {
    switchScreen("result-screen");
  }

  // Передаем команде Май команду на сборку фотополоски
  if (typeof renderPhotoStrip === "function") {
    renderPhotoStrip();
  }
}
