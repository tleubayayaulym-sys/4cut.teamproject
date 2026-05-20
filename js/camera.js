/* ==========================================================================
   ЛОГИКА КАМЕРЫ И СЪЕМКИ (REAL CAMERA & COUNTDOWN LOGIC WITH P5.JS & ML5.JS)
   ========================================================================== */

let videoCapture;            // Переменная для потока видео с веб-камеры
let p5Canvas;                // Ссылка на холст p5.js
let isSessionActive = false; // Статус: идет ли сейчас фотосессия

let currentPhotoCount = 0;   // Счетчик сделанных снимков
const MAX_PHOTOS = 4;        // Максимум фото для 인생네컷
let countdownTimer = null;   // Переменная для интервала таймера

/**
 * 1. ИНИЦИАЛИЗАЦИЯ P5.JS (SETUP)
 * Автоматически запускается браузером при загрузке страницы
 */
function setup() {
  // Находим контейнер .camera-box в HTML, созданный для отображения камеры
  const cameraBox = document.querySelector('.camera-box');
  if (!cameraBox) {
    console.error("❌ Элемент .camera-box не найден в HTML!");
    return;
  }

  // Узнаем текущие адаптивные размеры блока (подстроится под ПК и под мобилку)
  const w = cameraBox.clientWidth;
  const h = cameraBox.clientHeight;

  // Создаем холст p5.js и привязываем его внутрь нашей HTML-верстки
  p5Canvas = createCanvas(w, h);
  p5Canvas.parent(cameraBox);

  // Включаем захват видеопотока с веб-камеры ноутбука или телефона
  videoCapture = createCapture(VIDEO);
  videoCapture.size(w, h);
  videoCapture.hide(); // Скрываем дублирующий стандартный плеер под холстом

  // --- МАЛЕНЬКАЯ СТЫКОВКА ДЛЯ НГУЕНА (ML5.JS FACE MESH) ---
  // Передаем запущенный поток камеры в файл ar-filter.js, чтобы ИИ начал искать лицо
  if (typeof initFaceMesh === 'function') {
    initFaceMesh(videoCapture);
  } else {
    console.warn("⚠️ Функция initFaceMesh не найдена в ar-filter.js. Проверьте подключение скриптов.");
  }
}

/**
 * 2. ГЛАВНЫЙ ЦИКЛ ОБНОВЛЕНИЯ ЭКРАНА (DRAW)
 * Выполняется p5.js непрерывно (около 60 кадров в секунду)
 */
function draw() {
  // Очищаем задний фон глубоким черным цветом
  background(0);

  if (videoCapture) {
    // Зеркалим изображение (эффект селфи-камеры), чтобы пользователю было привычно позировать
    translate(width, 0);
    scale(-1, 1);
    
    // Рисуем текущий живой кадр с веб-камеры на весь созданный холст
    image(videoCapture, 0, 0, width, height);
    
    // Возвращаем систему координат p5.js в исходное состояние для отрисовки графики поверх
    scale(-1, 1);
    translate(-width, 0);
  }

  // --- ИНТЕГРАЦИЯ ДЛЯ НГУЕНА (ОТРИСОВКА МАСОК И КОНФЕТТИ) ---
  // Каждый кадр вызываем логику Нгуена, чтобы маски и партиклы рендерились поверх видео
  if (typeof drawAROverlay === 'function') {
    drawAROverlay(p5Canvas);
  }
}

/**
 * 3. ЗАПУСК СЕССИИ СЪЕМКИ
 * Вызывается из main.js, когда Тлеубай нажимает кнопку "촬영 시작하기"
 */
function startPhotoSession() {
  console.log("📸 Камера переведена в режим активной фотосессии.");
  isSessionActive = true;
  currentPhotoCount = 0;
  window.AppState.capturedImages = []; // Полностью очищаем массив от прошлых фотосессий

  // Даем пользователю 2 секунды, чтобы встать перед камерой, и запускаем отсчет первого кадра
  setTimeout(() => {
    runCountdownSequence();
  }, 2000);
}

/**
 * 4. ПОШАГОВЫЙ ОБРАТНЫЙ ОТСЧЕТ 3... 2... 1...
 */
function runCountdownSequence() {
  // Если уже сделали 4 кадра, принудительно останавливаемся
  if (currentPhotoCount >= MAX_PHOTOS) {
    endPhotoSession();
    return;
  }

  let timeLeft = 3; // Каждый кадр ждем ровно 3 секунды
  const countdownOverlay = document.getElementById("countdown-overlay");
  
  // Выводим стартовую цифру "3" поверх экрана камеры
  if (countdownOverlay) {
    countdownOverlay.textContent = timeLeft;
    countdownOverlay.classList.remove("hidden");
  }

  console.log(`⏱️ Отсчет для кадра №${currentPhotoCount + 1} начался...`);

  // Запускаем ежесекундный таймер
  countdownTimer = setInterval(() => {
    timeLeft--;
    
    if (timeLeft > 0) {
      // Обновляем цифру на экране (покажет 2, затем 1)
      if (countdownOverlay) countdownOverlay.textContent = timeLeft;
    } else {
      // Время вышло (0 секунд) — останавливаем таймер, прячем текст и делаем снимок
      clearInterval(countdownTimer);
      if (countdownOverlay) countdownOverlay.classList.add("hidden");
      
      triggerFlashAndCapture();
    }
  }, 1000);
}

/**
 * 5. ЭФФЕКТ СЛУЖЕБНОЙ ВСПЫШКИ И МОМЕНТАЛЬНЫЙ ЗАХВАТ ЭКРАНА
 */
function triggerFlashAndCapture() {
  // Активируем анимацию белой вспышки (класс .flash-active прописан в style.css)
  const flashOverlay = document.getElementById("flash-overlay");
  if (flashOverlay) {
    flashOverlay.classList.add("flash-active");
    
    // Удаляем класс сразу после окончания анимации (0.35 секунды), чтобы использовать при следующем кадре
    setTimeout(() => {
      flashOverlay.classList.remove("flash-active");
    }, 350);
  }

  // Запускаем физический захват кадра с холста
  captureCanvasFrame();
}

/**
 * 6. СОХРАНЕНИЕ ТЕКУЩЕГО ХОЛСТА В ГЛОБАЛЬНУЮ ПАМЯТЬ ПРИЛОЖЕНИЯ
 */
function captureCanvasFrame() {
  // Функция get() из p5.js делает мгновенный снимок ВСЕГО, что сейчас нарисовано на холсте
  // Это захватит и видео Тлеубай, и AR-маску с партиклом от Нгуена!
  let snapshot = get();
  
  currentPhotoCount++;
  console.log(`📷 Успешно сделан снимок №${currentPhotoCount}`);

  // Сохраняем снимок в глобальный массив, откуда его заберет Май
  window.AppState.capturedImages.push(snapshot);

  // Проверяем, нужно ли снимать дальше
  if (currentPhotoCount < MAX_PHOTOS) {
    // Даем пользователю 2 секунды, чтобы перевести дух, изменить позу и выражение лица
    setTimeout(() => {
      runCountdownSequence();
    }, 2000);
  } else {
    // Если сняли все 4 кадра, переходим к финалу через 1 секунду после последней вспышки
    setTimeout(() => {
      endPhotoSession();
    }, 1000);
  }
}

/**
 * 7. ЗАВЕРШЕНИЕ СЪЕМКИ И ПЕРЕДАЧА УПРАВЛЕНИЯ ЭКРАНУ РЕЗУЛЬТАТОВ
 */
function endPhotoSession() {
  isSessionActive = false;
  console.log("🎉 Фотосессия окончена. Все 4 снимка переданы в AppState.");

  // Переключаем интерфейс со страницы камеры на страницу готовой полоски (логика в main.js)
  if (typeof switchScreen === "function") {
    switchScreen("result-screen");
  }

  // Передаем Май команду автоматически запустить сборку и наложение рамок
  if (typeof renderPhotoStrip === "function") {
    renderPhotoStrip();
  } else {
    console.error("❌ Функция renderPhotoStrip в result.js не обнаружена!");
  }
}
