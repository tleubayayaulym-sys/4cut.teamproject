/* ==========================================================================
   ВРЕМЕННАЯ ЛОГИКА ФИЛЬТРОВ И КОНФЕТТИ
   ========================================================================== */

let particles = [];
const MAX_PARTICLES = 40;

// Заглушка, чтобы camera.js не выдавал ошибку
function initFaceMesh(videoStream) {
  console.log("📸 ИИ временно отключен, работает только чистая камера!");
}

function drawAROverlay(p5Canvas) {
  const currentFilter = window.AppState.selectedFilter;
  
  // Просто пишем текст фильтра по центру экрана, пока камера работает
  if (currentFilter && currentFilter !== 'none') {
    fill(255);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text(`[Выбран фильтр: ${currentFilter}]`, width / 2, height / 2);
  }

  // Конфетти падают на фоне
  if (particles.length < MAX_PARTICLES && random(1) < 0.15) {
    particles.push(new ConfettiParticle(width));
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].y > height) {
      particles.splice(i, 1);
    }
  }
}

class ConfettiParticle {
  constructor(canvasWidth) {
    this.x = random(canvasWidth);
    this.y = random(-20, -10);
    this.size = random(5, 12);
    this.speedY = random(1.5, 4);
    this.speedX = random(-1, 1);
    const colors = ['#ff416c', '#ff4b2b', '#ffeb3b', '#00e676', '#00b0ff'];
    this.color = colors[floor(random(colors.length))];
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
  }
  draw() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

function resetARFilters() {
  particles = [];
}
