const progressTrail = document.querySelector('.progress-trail');

function updateUI() {
    const percent = currentTime / duration;

    // Основной прогресс — моментальный
    progress.style.transform = `scaleX(${percent})`;
    progressThumb.style.left = (percent * 100) + '%';
    currentTimeElem.textContent = formatTime(currentTime);
    durationElem.textContent = formatTime(duration);
    progressBar.setAttribute('aria-valuenow', Math.floor(percent * 100));

    // Плавное отставание для следа
    clearTimeout(progressTrail._trailTimeout);

    // Немного задерживаем обновление ширины у следа для эффекта "хвоста"
    progressTrail._trailTimeout = setTimeout(() => {
        progressTrail.style.width = (percent * 100) + '%';
    }, 150); // настройте задержку по вкусу
}
