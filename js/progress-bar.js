const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const progressThumb = document.getElementById('progress-thumb');
const currentTimeElem = document.getElementById('current-time');
const durationElem = document.getElementById('duration');

const duration = 201; // длительность в секундах (пример)
let currentTime = 0;
let playing = false;
let intervalId = null;
let dragging = false; // для возможности остановки при drag

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

function updateUI() {
  const percent = currentTime / duration;
  progress.style.transform = `scaleX(${percent})`;
  progressThumb.style.left = (percent * 100) + '%';
  currentTimeElem.textContent = formatTime(currentTime);
  durationElem.textContent = formatTime(duration);
}

function playSimulation() {
  if (!playing) {
    playing = true;
    playBtn.classList.remove('play');
    playBtn.classList.add('playing');
    playBtn.setAttribute('aria-label', 'Пауза');
    intervalId = setInterval(() => {
      if (!dragging) {
        if (currentTime < duration) {
          currentTime++;
          updateUI();
        } else {
          // Достигли конца - остановить и сбросить обратно
          clearInterval(intervalId);
          playing = false;
          playBtn.classList.remove('playing');
          playBtn.classList.add('play');
          currentTime = 0;
          updateUI();
        }
      }
    }, 1000); // обновление каждую секунду
  } else {
    playing = false;
    playBtn.classList.remove('playing');
    playBtn.classList.add('play');
    playBtn.setAttribute('aria-label', 'Воспроизвести');
    clearInterval(intervalId);
  }
}

// Обработчик клика по кнопке play
playBtn.addEventListener('click', playSimulation);

// Инициализация UI при загрузке страницы
updateUI();


