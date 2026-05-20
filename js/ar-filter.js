/* ==========================================================================
   ЛОГИКА AR-ФИЛЬТРОВ И ПАРТИКЛОВ (AR FILTERS & PARTICLES LOGIC)
   ========================================================================== */

// Массив для хранения активных партиклов (конфетти)
let particles = [];
const MAX_PARTICLES = 50; // Оптимизация рендеринга, чтобы не лагало

/**
 * Класс Партикла (Конфетти)
 * Создает эффект праздника на экране камеры
 */
class ConfettiParticle {
  constructor(canvasWidth) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * -20 - 10; // Появляются чуть выше экрана
    this.size = Math.random() * 8 + 4;
    this.speedY = Math.random() * 3 + 2; // Скорость падения
    this.speedX = Math.random() * 2 - 1; // Небольшое покачивание влево/вправо
    
    // Случайный яркий цвет для конфетти
    const colors = ['#ff416c', '#ff4b2b', '#ffeb3b', '#00e676', '#00b0ff'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  // Обновление позиции
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
  }

  // Рисование на экране (использует функции p5.js)
  draw() {
    // Проверяем, что p5.js доступен
    if (typeof noStroke === 'function') {
      noStroke();
      fill(this.color);
      ellipse(this.x, this.y, this.size);
    }
  }
}

/**
 * ВРЕМЕННАЯ ФУНКЦИЯ: Отрисовка AR-элементов на холсте p5.js
 * Эта функция будет вызываться внутри главного цикла draw() в p5.js
 * @param {object} p5Canvas - контекст или сам холст для рисования
 */
function drawAROverlay(p5Canvas) {
  // Получаем выбранный фильтр из глобального состояния
  const currentFilter = window.AppState.selectedFilter;
  
  // Ширина и высота виртуального экрана (примерные дефолты)
  const w = 400;
  const h = 533;

  // 1. СИМУЛЯЦИЯ FACE MESH (Пока нет камеры, рисуем фейковую голову в центре)
  let mockFaceX = w / 2;
  let mockFaceY = h / 2 - 20;

  // 2. ОТРИСОВКА ВЫБРАННОГО ФИЛЬТРА (Логика Нгуена)
  if (currentFilter && currentFilter !== 'none') {
    // В будущем здесь будут реальные координаты Face Mesh (landmarks)
    // Сейчас мы просто показываем текст-заглушку на месте лица
    fill(255);
    textSize(18);
    textAlign(CENTER);
    
    if (currentFilter === 'cat') {
      text("🐱 [Здесь будут ушки котика]", mockFaceX, mockFaceY - 60);
    } else if (currentFilter === 'rabbit') {
      text("🐰 [Здесь будут ушки кролика]", mockFaceX, mockFaceY - 70);
    } else if (currentFilter === 'glasses') {
      text("👓 [Здесь будут крутые очки]", mockFaceX, mockFaceY);
    } else if (currentFilter === 'crown') {
      text("👑 [Здесь будет золотая корона]", mockFaceX, mockFaceY - 90);
    }
  }

  // 3. СИМУЛЯЦИЯ СИСТЕМЫ ПАРТИКЛОВ (Эффект конфетти)
  // Всегда генерируем новые партиклы, если их мало
  if (particles.length < MAX_PARTICLES && Math.random() < 0.2) {
    particles.push(new ConfettiParticle(w));
  }

  // Обновляем и рисуем каждый партикл
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    // Оптимизация: удаляем партиклы, которые упали за нижний край экрана
    if (particles[i].y > h) {
      particles.splice(i, 1);
    }
  }
}

/**
 * Функция для сброса эффектов (вызывается при перезапуске)
 */
function resetARFilters() {
  particles = [];
  console.log("🎭 AR эффекты сброшены");
}
