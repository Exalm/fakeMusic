// Элементы управления
const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const progressThumb = document.getElementById('progress-thumb');
const currentTimeElem = document.getElementById('current-time');
const durationElem = document.getElementById('duration');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackTitleElem = document.getElementById('track-title');
const trackArtistElem = document.querySelector('.track-artist');
const albumImageElem = document.querySelector('.album-art');

// Ключи для localStorage
const STORAGE_KEYS = {
  duration: 'playerDuration',
  trackTitle: 'playerTrackTitle',
  trackArtist: 'playerTrackArtist',
  albumImage: 'playerAlbumImage'
};

// Переменные плеера
let duration = 201;
let currentTime = 0;
let playing = false;
let intervalId = null;
let dragging = false;

// Функция форматирования времени
function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) {
    return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  } else {
    return m + ':' + String(s).padStart(2, '0');
  }
}

// Обновление интерфейса
function updateUI() {
  const percent = currentTime / duration;
  progress.style.transform = `scaleX(${percent})`;
  progressThumb.style.left = (percent * 100) + '%';
  currentTimeElem.textContent = formatTime(currentTime);
  durationElem.textContent = formatTime(duration);
  progressBar.setAttribute('aria-valuenow', Math.floor(percent * 100));
}

// Установка прогресса от событий
function setProgressFromEvent(e) {
  const rect = progressBar.getBoundingClientRect();
  let clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let x = clientX - rect.left;
  x = Math.max(0, Math.min(x, rect.width));
  currentTime = Math.round((x / rect.width) * duration);
  updateUI();
}

// Управление кнопкой воспроизведения
playBtn.addEventListener('click', () => {
  if (!playing) {
    playing = true;
    playBtn.classList.remove('play');
    playBtn.classList.add('playing');
    playBtn.setAttribute('aria-label', 'Пауза');
    playBtn.innerHTML = '';
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
          playBtn.innerHTML = '';
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
    playBtn.innerHTML = '';
    clearInterval(intervalId);
  }
});

// Обработка drag и touch для прогресс-бара
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

// Кнопки Previous/Next
prevBtn.addEventListener('click', () => {
  currentTime = 0;
  updateUI();
});
nextBtn.addEventListener('click', () => {
  currentTime = duration;
  updateUI();
});

// Управление клавиатурой
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

// Функции сохранения в локальном хранилище
function saveDuration(seconds) {
  localStorage.setItem(STORAGE_KEYS.duration, seconds.toString());
}
function saveTrackTitle(title) {
  localStorage.setItem(STORAGE_KEYS.trackTitle, title);
}
function saveTrackArtist(artist) {
  localStorage.setItem(STORAGE_KEYS.trackArtist, artist);
}
function saveAlbumImage(src) {
  localStorage.setItem(STORAGE_KEYS.albumImage, src);
}

// Восстановление данных при загрузке
window.addEventListener('DOMContentLoaded', () => {
  const savedDuration = localStorage.getItem(STORAGE_KEYS.duration);
  const savedTitle = localStorage.getItem(STORAGE_KEYS.trackTitle);
  const savedArtist = localStorage.getItem(STORAGE_KEYS.trackArtist);
  const savedImage = localStorage.getItem(STORAGE_KEYS.albumImage);

  if (savedDuration) {
    duration = parseInt(savedDuration, 10);
  }
  if (savedTitle) {
    trackTitleElem.textContent = savedTitle;
  }
  if (savedArtist) {
    trackArtistElem.textContent = savedArtist;
  }
  if (savedImage) {
    albumImageElem.src = savedImage;
  }

  updateUI();
});

// Кнопка изменения времени и поля ввода
const changeTimeBtn = document.getElementById('change-time-btn');
const timeInputContainer = document.createElement('div');

changeTimeBtn.addEventListener('click', () => {
  if (document.getElementById('new-time-input')) return;

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'new-time-input';
  input.placeholder = 'Введите время (чч:мм:сс или мм:сс)';
  input.style.marginLeft = '10px';
  input.style.width = '140px';

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

    const timeParts = val.split(':');
    if (
      (timeParts.length === 2 || timeParts.length === 3) &&
      timeParts.every(part => /^\d{1,2}$/.test(part))
    ) {
      let totalSeconds = 0;

      if (timeParts.length === 2) {
        const minutes = parseInt(timeParts[0], 10);
        const seconds = parseInt(timeParts[1], 10);
        if (seconds >= 60) {
          alert('Секунды должны быть меньше 60');
          input.focus();
          return;
        }
        totalSeconds = minutes * 60 + seconds;
      } else {
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);
        if (minutes >= 60 || seconds >= 60) {
          alert('Минуты и секунды должны быть меньше 60');
          input.focus();
          return;
        }
        totalSeconds = hours * 3600 + minutes * 60 + seconds;
      }

      duration = totalSeconds;
      saveDuration(totalSeconds); // Сохраняем в localStorage

      if (currentTime > duration) currentTime = 0;

      updateUI();

      timeInputContainer.innerHTML = '';
    } else {
      alert('Введите время в формате чч:мм:сс или мм:сс, например 01:15:30 или 3:45');
      input.focus();
    }
  });
});

