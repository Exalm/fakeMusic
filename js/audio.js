// Элементы управления
const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const progressThumb = document.getElementById('progress-thumb');
const currentTimeElem = document.getElementById('current-time');
const durationElem = document.getElementById('duration');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Переменные плеера
let duration = 201; // длительность в секундах (пример)
let currentTime = 0;
let playing = false;
let intervalId = null;
let dragging = false; // для drag управления

// Формат времени
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

// Обновление UI плеера
function updateUI() {
  const percent = currentTime / duration;
  progress.style.transform = `scaleX(${percent})`;
  progressThumb.style.left = (percent * 100) + '%';
  currentTimeElem.textContent = formatTime(currentTime);
  durationElem.textContent = formatTime(duration);
  progressBar.setAttribute('aria-valuenow', Math.floor(percent * 100));
}

// Установка прогресса от события (клик, drag)
function setProgressFromEvent(e) {
  const rect = progressBar.getBoundingClientRect();
  let clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let x = clientX - rect.left;
  x = Math.max(0, Math.min(x, rect.width));
  currentTime = Math.round((x / rect.width) * duration);
  updateUI();
}

// Управление кнопкой Play/Pause
playBtn.addEventListener('click', () => {
  if (!playing) {
    playing = true;
    playBtn.classList.remove('play');
    playBtn.classList.add('playing');
    playBtn.setAttribute('aria-label', 'Пауза');
    playBtn.innerHTML = '&#10074;&#10074;';
    intervalId = setInterval(() => {
      if (!dragging) {
        if (currentTime < duration) {
          currentTime++;
          updateUI();
        } else {
          clearInterval(intervalId);
          playing = false;
          playBtn.classList.remove('playing');
          playBtn.classList.add('play');
          playBtn.setAttribute('aria-label', 'Воспроизвести');
          playBtn.innerHTML = '&#9654;';
          currentTime = 0;
          updateUI();
        }
      }
    }, 1000);
  } else {
    playing = false;
    playBtn.classList.remove('playing');
    playBtn.classList.add('play');
    playBtn.setAttribute('aria-label', 'Воспроизвести');
    playBtn.innerHTML = '&#9654;';
    clearInterval(intervalId);
  }
});

// Обработка drag мышью и touch для прогресс-бара
progressBar.addEventListener('mousedown', e => {
  dragging = true;
  setProgressFromEvent(e);
  if (!playing) {
    playing = true;
    playBtn.classList.remove('play');
    playBtn.classList.add('playing');
    playBtn.setAttribute('aria-label', 'Пауза');
  }
});
document.addEventListener('mousemove', e => {
  if (dragging) setProgressFromEvent(e);
});
document.addEventListener('mouseup', () => {
  dragging = false;
});
progressThumb.addEventListener('touchstart', e => {
  dragging = true;
  e.preventDefault();
  setProgressFromEvent(e);
  if (!playing) {
    playing = true;
    playBtn.classList.remove('play');
    playBtn.classList.add('playing');
    playBtn.setAttribute('aria-label', 'Пауза');
  }
}, { passive: false });
document.addEventListener('touchmove', e => {
  if (dragging) setProgressFromEvent(e);
}, { passive: false });
document.addEventListener('touchend', () => {
  dragging = false;
});
progressBar.addEventListener('click', e => {
  setProgressFromEvent(e);
});

// Заглушки кнопок
prevBtn.addEventListener('click', () => {
  currentTime = 0;
  updateUI();
});
nextBtn.addEventListener('click', () => {
  currentTime = duration;
  updateUI();
});

// Клавиатурное управление прогрессом
progressBar.addEventListener('keydown', e => {
  const step = 5;
  if (e.key === 'ArrowRight' || e.key === 'Right') {
    e.preventDefault();
    currentTime = Math.min(duration, currentTime + step);
    updateUI();
  } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
    e.preventDefault();
    currentTime = Math.max(0, currentTime - step);
    updateUI();
  }
});

// Инициализация
updateUI();

// Кнопка для изменения времени трека и поле для ввода
const changeTimeBtn = document.getElementById('change-time-btn');
const timeInputContainer = document.createElement('div');

changeTimeBtn.addEventListener('click', () => {
  if (document.getElementById('new-time-input')) return;

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'new-time-input';
  input.placeholder = 'Введите новое время (мин:сек)';
  input.style.marginLeft = '10px';
  input.style.width = '110px';

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Сохранить';
  submitBtn.style.marginLeft = '5px';

  const modalContent = changeTimeBtn.parentElement;
  modalContent.appendChild(timeInputContainer);
  timeInputContainer.appendChild(input);
  timeInputContainer.appendChild(submitBtn);

  input.focus();

  submitBtn.addEventListener('click', () => {
    const val = input.value.trim();

    if (/^\d{1,2}:\d{2}$/.test(val)) {
      const [minutesStr, secondsStr] = val.split(':');
      const minutes = parseInt(minutesStr, 10);
      const seconds = parseInt(secondsStr, 10);

      if (seconds >= 60) {
        alert('Секунды должны быть меньше 60');
        input.focus();
        return;
      }

      // Перевод в секунды и обновление переменной duration
      duration = minutes * 60 + seconds;

      if (currentTime > duration) currentTime = 0;

      updateUI();

      timeInputContainer.innerHTML = '';
    } else {
      alert('Введите время в формате мин:сек, например 3:45');
      input.focus();
    }
  });
});
