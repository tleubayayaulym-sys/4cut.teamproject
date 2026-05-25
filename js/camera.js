// js/camera.js
// Tleubai: логика камеры, countdown, вспышка и захват 4 кадров

let stream = null;
let shotIndex = 0;

// получаем кадры как DataURL (через canvas)
export function getCameraStream() {
  return stream;
}

function showFlash(flashEl, duration = 160) {
  if (!flashEl) return;
  flashEl.style.opacity = "1";
  flashEl.style.transition = `opacity ${duration}ms ease`;
  setTimeout(() => {
    flashEl.style.opacity = "0";
  }, duration);
}

/**
 * initCamera — старт камеры
 * videoEl: <video>
 */
export async function initCamera({
  videoEl,
  flashEl,
  onReady,
} = {}) {
  const constraints = {
    video: {
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  };

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoEl.srcObject = stream;
    await videoEl.play();
    onReady?.();
  } catch (e) {
    console.error(e);
    alert("Не удалось открыть камеру. Проверь разрешения.");
  }
}

/**
 * captureFrame — захват одного кадра из video в canvas и возврат DataURL
 */
export function captureFrame({ videoEl, captureCanvas }) {
  const w = captureCanvas.width;
  const h = captureCanvas.height;

  const ctx = captureCanvas.getContext("2d");
  ctx.save();

  // Чтобы не было растяжения: масштабируем видео под canvas
  // (простая версия для демо)
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(videoEl, 0, 0, w, h);

  ctx.restore();
  return captureCanvas.toDataURL("image/png");
}

/**
 * startBooth4Shots — делает 4 фото подряд:
 * countdown 3..2..1, потом захват, потом снова
 * flash — визуальный эффект
 *
 * onCaptured: callback(index, dataURL)
 * onDone: callback(photosArray)
 */
export function startBooth4Shots({
  videoEl,
  uiCountdownEl,
  flashEl,
  captureCanvas,
  onCaptured,
  onDone,
  countdownFrom = 3,
} = {}) {
  shotIndex = 0;
  const photos = [];

  const tick = (n) => {
    if (!uiCountdownEl) return;
    uiCountdownEl.textContent = String(n);
  };

  const hideCountdown = () => {
    if (!uiCountdownEl) uiCountdownEl.textContent = "";
  };

  const takeOne = () => {
    // вспышка перед снимком
    showFlash(flashEl, 140);

    const dataURL = captureFrame({ videoEl, captureCanvas });
    photos.push(dataURL);

    onCaptured?.(shotIndex, dataURL);
    shotIndex += 1;

    if (shotIndex >= 4) {
      hideCountdown();
      onDone?.(photos);
      return;
    }

    // следующий выстрел: снова countdown
    runCountdown();
  };

  const runCountdown = () => {
    let n = countdownFrom;
    tick(n);

    const id = setInterval(() => {
      n -= 1;
      tick(n);

      if (n <= 0) {
        clearInterval(id);
        hideCountdown();
        takeOne();
      }
    }, 900);
  };

  runCountdown();
}
