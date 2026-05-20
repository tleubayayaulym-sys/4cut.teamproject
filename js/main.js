/* ==========================================================================
   ГЛАВНЫЙ СКРИПТ УПРАВЛЕНИЯ ПРИЛОЖЕНИЕМ (MAIN LOGIC)
   ========================================================================== */

// Ждем полной загрузки DOM-структуры страницы
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

// Глобальный объект состояния приложения (переменные для всей команды)
window.AppState = {
  currentScreen: "start-screen", // Название активного экрана
  selectedFilter: "none",        // Выбранный AR-фильтр
  selectedFrame: "frame-1",      // Выбранная фоторамка
  capturedImages: []             // Массив для хранения 4 фоток
};

/**
 * Инициализация приложения, поиск элементов и навешивание кликов
 */
function initApp() {
  console.log("🚀 Фотобудка успешно инициализирована!");

  // --- ЭЛЕМЕНТЫ ИНТЕРФЕЙСА ---
  const btnStart = document.getElementById("btn-start");
  const btnCapture = document.getElementById("btn-capture"); // Временная кнопка для теста
  const btnSave = document.getElementById("btn-save");
  const btnRestart = document.getElementById("btn-restart");
  
  const filterItems = document.querySelectorAll(".filter-item");
  const frameItems = document.querySelectorAll(".frame-item");

  // --- НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ ---
  
  // Клик "Начать" на стартовом экране
  if (btnStart) {
    btnStart.addEventListener("click", () => {
      switchScreen("camera-screen");
      // Здесь Тлеубай Аяулым в будущем запустит камеру: startCamera();
    });
  }

  // Временная кнопка симуляции съемки 4 кадров (для тестов, пока нет камеры)
  if (btnCapture) {
    btnCapture.addEventListener("click", () => {
      simulatePhotoSession();
    });
  }

  // Клик "Сохранить" на экране результата
  if (btnSave) {
    btnSave.addEventListener("click", () => {
      // Здесь Май Ти Ту Чжанг вызовет свою функцию: savePhotoStrip();
      alert("💾 Функция сохранения сработает, когда Май напишет result.js!");
    });
  }

  // Клик "Главный экран" (Сброс всего)
  if (btnRestart) {
    btnRestart.addEventListener("click", () => {
      resetApp();
    });
  }

  // --- ЛОГИКА ВЫБОРА ФИЛЬТРОВ (Для Нгуен Бао Дам) ---
  filterItems.forEach(item => {
    item.addEventListener("click", (e) => {
      // Убираем активный класс у всех и даем текущему
      filterItems.forEach(i => i.classList.remove("active"));
      const selectedItem = e.currentTarget;
      selectedItem.classList.add("active");
      
      // Обновляем глобальный статус
      window.AppState.selectedFilter = selectedItem.dataset.filter;
      console.log(`🎭 Выбран фильтр: ${window.AppState.selectedFilter}`);
    });
  });

  // --- ЛОГИКА ВЫБОРА РАМОК (Для Май Ти Ту Чжанг) ---
  frameItems.forEach(item => {
    item.addEventListener("click", (e) => {
      frameItems.forEach(i => i.classList.remove("active"));
      const selectedItem = e.currentTarget;
      selectedItem.classList.add("active");
      
      window.AppState.selectedFrame = selectedItem.dataset.frame;
      console.log(`🖼️ Выбрана рамка: ${window.AppState.selectedFrame}`);
      // Здесь Май вызовет перерисовку канваса с новой рамкой: redrawCanvas();
    });
  });
}

/**
 * Переключение экранов
 * @param {string} screenId - ID экрана, который нужно показать
 */
function switchScreen(screenId) {
  // Скрываем все экраны, добавляя класс .hidden
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.add("hidden");
  });

  // Показываем нужный экран, удаляя .hidden
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove("hidden");
    window.AppState.currentScreen = screenId;
    console.log(`📺 Переключение на экран: ${screenId}`);
  }
}

/**
 * Временная функция: Симуляция автоматической съемки 4 кадров
 */
function simulatePhotoSession() {
  console.log("📸 Запуск симуляции съемки 4 кадров...");
  
  // В будущем тут будет интервал Тлеубай Аяулым со вспышкой и звуком.
  // Сейчас мы просто мгновенно забиваем массив фейковыми данными
  window.AppState.capturedImages = ["img1", "img2", "img3", "img4"];
  
  alert("📸 Снято 4 кадра! Переходим к результату.");
  switchScreen("result-screen");
}

/**
 * Полный сброс приложения в начальное состояние
 */
function resetApp() {
  window.AppState.capturedImages = [];
  window.AppState.selectedFilter = "none";
  window.AppState.selectedFrame = "frame-1";
  
  // Сбрасываем визуальные активные классы на дефолт
  document.querySelectorAll(".filter-item").forEach(i => i.classList.remove("active"));
  document.querySelectorAll(".frame-item").forEach(i => i.classList.remove("active"));
  
  const defaultFilter = document.querySelector('[data-filter="none"]');
  const defaultFrame = document.querySelector('[data-frame="frame-1"]');
  
  if (defaultFilter) defaultFilter.classList.add("active");
  if (defaultFrame) defaultFrame.classList.add("active");

  switchScreen("start-screen");
  console.log("🔄 Состояние приложения сброшено.");
}
