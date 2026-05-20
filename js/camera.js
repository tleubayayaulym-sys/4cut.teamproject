/* ==========================================================================
   ЛОГИКА КАМЕРЫ, СЪЕМКИ И ТАЙМЕРА (CAMERA & COUNTDOWN LOGIC)
   ========================================================================== */

// Глобальные переменные для управления процессом съемки
let countdownInterval = null;
let photoCount = 0;
const TOTAL_PHOTOS = 4;

/**
 * Запуск процесса фотосессии (Вызывается из main.js при переходе на экран камеры)
 */
function startPhotoSession() {
  console.log("📸 Фотосессия началась!");
  
  // Сброс счетчиков
  photoCount = 0;
  window.AppState.capturedImages = [];
  
  // Запускаем цикл для первого кадра
  startCountdown();
}

/**
 * Функция обратного отсчета (3, 2, 1)
 */
function startCountdown() {
  if (photoCount >= TOTAL_PHOTOS) {
    finishPhotoSession();
    return;
  }

  let timeLeft = 3; // Отсчет с 3 секунд
  const countdownEl = document.getElementById("countdown-overlay");
  
  if (countdownEl) {
    countdownEl.textContent = timeLeft;
    countdownEl.classList.remove("hidden");
  }

  console.log(`⏱️ Съемка кадра №${photoCount + 1}. Отсчет пошел...`);

  // Каждую секунду уменьшаем время
  countdownInterval = setInterval(() => {
    timeLeft--;
    
    if (timeLeft > 0) {
      if (countdownEl) countdownEl.textContent = timeLeft;
    } else {
      // Время вышло — делаем снимок
      clearInterval(countdownInterval);
      if (countdownEl) countdownEl.classList.add("hidden");
      
      triggerFlashAndCapture();
    }
  }, 1000);
}

/**
 * Эффект вспышки экрана и захват кадра
 */
function triggerFlashAndCapture() {
  console.log("⚡ ВСПЫШКА!");
  
  // Активируем белую вспышку из style.css
  const flashEl = document.getElementById("flash-overlay");
  if (flashEl) {
    flashEl.classList.add("flash-active");
    
    // Удаляем класс после окончания анимации (0.4 секунды), чтобы использовать снова
    setTimeout(() => {
      flashEl.classList.remove("flash-active");
    }, 400);
  }

  // Делаем снимок (захватываем текущий кадр)
  captureFrame();
}

/**
 * Симуляция захвата кадра (get() из p5.js канваса)
 */
function captureFrame() {
  photoCount++;
  console.log(`🖼️ Кадр ${photoCount} успешно сохранен.`);

  // ВРЕМЕННО: Генерируем цветные квадраты вместо реальных фото с камеры.
  // Это нужно, чтобы Май Ти Ту Чжанг могла проверить склейку в result.js
  const mockColors = ["#ff416c", "#ff4b2b", "#4776e6", "#8e54e9"];
  const temporaryPhotoData = mockColors[photoCount - 1]; // Передаем цвет как имитацию картинки

  // Сохраняем "фото" в глобальное состояние приложения
  window.AppState.capturedImages.push(temporaryPhotoData);

  // Ждем 1.5 секунды после вспышки (чтобы пользователь перевёл дух и сменил позу) и снимаем следующий кадр
  setTimeout(() => {
    startCountdown();
  }, 1500);
}

/**
 * Завершение сессии съемки и переход к результатам
 */
function finishPhotoSession() {
  console.log("🎉 Все 4 кадра успешно сняты!", window.AppState.capturedImages);
  
  // Переключаем экран (функция из main.js)
  if (typeof switchScreen === "function") {
    switchScreen("result-screen");
  }

  // Вызываем функцию Май для отрисовки финального коллажа
  if (typeof renderPhotoStrip === "function") {
    renderPhotoStrip();
  } else {
    console.log("⚠️ Функция renderPhotoStrip() еще не создана в result.js");
  }
}
