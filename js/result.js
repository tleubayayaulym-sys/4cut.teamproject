/* ==========================================================================
   ЛОГИКА РЕЗУЛЬТАТА, ВЫБОРА РАМОК И СОХРАНЕНИЯ (RESULT & CANVAS LOGIC)
   ========================================================================== */

/**
 * Отрисовка финального фотострипа (Вызывается автоматически из camera.js)
 */
function renderPhotoStrip() {
  console.log("🖼️ Сборка фотострипа началась...");

  // Получаем данные из глобального состояния приложения
  const photos = window.AppState.capturedImages;
  const currentFrame = window.AppState.selectedFrame;
  
  // Находим контейнер для предпросмотра на экране результатов
  const resultWrapper = document.getElementById("result-view-wrapper");
  if (!resultWrapper) {
    console.error("❌ Элемент #result-view-wrapper не найден в HTML!");
    return;
  }

  // Очищаем контейнер перед новой сборкой
  resultWrapper.innerHTML = "";

  // 1. Создаем структуру фотострипа (вертикальная полоска)
  const photoStrip = document.createElement("div");
  photoStrip.id = "generated-photo-strip";
  
  // Задаем стили для полоски в зависимости от выбранной рамки
  // В будущем здесь будут полноценные PNG-картинки из assets/frames/
  photoStrip.style.width = "100%";
  photoStrip.style.height = "100%";
  photoStrip.style.display = "flex";
  photoStrip.style.flexDirection = "column";
  photoStrip.style.alignItems = "center";
  photoStrip.style.gap = "15px";
  photoStrip.style.padding = "20px 15px 40px 15px";
  photoStrip.style.position = "relative";
  
  // Применяем цвет рамки в зависимости от выбора пользователя (для теста)
  applyMockFrameStyle(photoStrip, currentFrame);

  // 2. Добавляем 4 фотографии (последовательно сверху вниз)
  photos.forEach((photoData, index) => {
    const photoCell = document.createElement("div");
    photoCell.className = "photo-cell";
    photoCell.style.width = "100%";
    photoCell.style.aspectRatio = "4 / 3"; // Классический формат кадра
    photoCell.style.borderRadius = "4px";
    photoCell.style.backgroundColor = photoData; // Используем цвет-заглушку из camera.js
    
    // Текст для наглядности внутри каждого кадра
    photoCell.style.display = "flex";
    photoCell.style.justifyContent = "center";
    photoCell.style.alignItems = "center";
    photoCell.style.color = "#fff";
    photoCell.style.fontWeight = "bold";
    photoCell.innerHTML = `Кадр ${index + 1}`;

    photoStrip.appendChild(photoCell);
  });

  // 3. ДОБАВЛЕНИЕ ТЕКУЩЕЙ ДАТЫ (Логика Май Ти Ту Чжанг)
  const dateElement = document.createElement("div");
  dateElement.className = "strip-date";
  dateElement.innerText = getFormattedDate();
  dateElement.style.position = "absolute";
  dateElement.style.bottom = "12px";
  dateElement.style.fontSize = "0.8rem";
  dateElement.style.fontWeight = "600";
  dateElement.style.letterSpacing = "1px";
  
  // Цвет даты меняется под цвет текста на рамке
  dateElement.style.color = (currentFrame === "frame-2") ? "#333333" : "#ffffff";

  photoStrip.appendChild(dateElement);

  // Вставляем готовую полоску в контейнер на экране
  resultWrapper.appendChild(photoStrip);
  console.log("🎉 Фотострип успешно собран и выведен на экран!");
}

/**
 * Получение текущей даты в красивом формате (YYYY.MM.DD)
 * @returns {string} - Отформатированная строка даты
 */
function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * ВРЕМЕННАЯ ФУНКЦИЯ: Применение цвета рамок (пока нет картинок PNG)
 */
function applyMockFrameStyle(element, frameType) {
  switch (frameType) {
    case "frame-1":
      element.style.backgroundColor = "#1a1a1a"; // Классический черный
      element.style.border = "2px solid #333";
      break;
    case "frame-2":
      element.style.backgroundColor = "#f5f5f5"; // Белый минимализм
      element.style.border = "2px solid #ddd";
      break;
    case "frame-3":
      element.style.backgroundColor = "#ff758c"; // Розовый неон
      element.style.border = "2px solid #ff758c";
      break;
    case "frame-4":
      element.style.backgroundColor = "#4776e6"; // Синий градиент
      element.style.border = "2px solid #4776e6";
      break;
    default:
      element.style.backgroundColor = "#1a1a1a";
  }
}

/**
 * Имитация функции saveCanvas для скачивания готовой фотополоски
 */
function downloadPhotoStrip() {
  console.log("💾 Запуск сохранения фотострипа...");
  
  // В будущем здесь будет реальная функция p5.js: saveCanvas(canvas, 'my-four-cuts', 'png');
  // Сейчас мы делаем симуляцию скачивания файла
  alert(`🎉 Успешно сохранено!\nРамка: ${window.AppState.selectedFrame}\nДата: ${getFormattedDate()}`);
}
