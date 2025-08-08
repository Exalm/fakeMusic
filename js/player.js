const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const progressThumb = document.getElementById('progress-thumb');
const currentTimeElem = document.getElementById('current-time');
const durationElem = document.getElementById('duration');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const duration = 201; // Длительность трека в секундах
let currentTime = 0;
let playing = false;
let intervalId = null;
let dragging = false;

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
    progressBar.setAttribute('aria-valuenow', Math.floor(percent * 100));
}

function setProgressFromEvent(e) {
    const rect = progressBar.getBoundingClientRect();
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    currentTime = Math.round((x / rect.width) * duration);
    updateUI();
}

// Play/Pause toggle с имитацией
playBtn.addEventListener('click', () => {
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
                    clearInterval(intervalId);
                    playing = false;
                    playBtn.classList.remove('playing');
                    playBtn.classList.add('play');
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
        clearInterval(intervalId);
    }
});

// Drag & drop progress handlers
progressBar.addEventListener('mousedown', e => {
    dragging = true;
    setProgressFromEvent(e);
});
document.addEventListener('mousemove', e => {
    if (dragging) setProgressFromEvent(e);
});
document.addEventListener('mouseup', () => { dragging = false; });

progressThumb.addEventListener('touchstart', e => {
    dragging = true;
    e.preventDefault();
}, { passive: false });
document.addEventListener('touchmove', e => {
    if (dragging) setProgressFromEvent(e);
}, { passive: false });
document.addEventListener('touchend', () => { dragging = false; });

// Click on progress bar jump
progressBar.addEventListener('click', e => {
    setProgressFromEvent(e);
});

// Prev/Next button resets
prevBtn.addEventListener('click', () => {
    currentTime = 0;
    updateUI();
});
nextBtn.addEventListener('click', () => {
    currentTime = duration;
    updateUI();
});

// Keyboard accessibility
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

// Initial UI update on load
updateUI();
