document.getElementById('name-music-btn').addEventListener('click', () => {
  const trackTitleElem = document.querySelector('.track-title');

  // Если поле ввода уже показано, ничего не делать
  if (document.getElementById('music-input')) return;

  // Текущее название трека
  const currentTitle = trackTitleElem.textContent;

  // Создаём input
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'music-input';
  input.value = currentTitle;
  input.classList.add('custom-input');  // примените нужные стили
  input.style.boxSizing = 'border-box';

  // Заменяем текст заголовка на input
  trackTitleElem.textContent = '';
  trackTitleElem.appendChild(input);
  input.focus();

  function saveAndRemoveInput() {
    const newTitle = input.value.trim() || 'Название трека';
    trackTitleElem.textContent = newTitle;

    // Сохраняем в localStorage
    localStorage.setItem('playerTrackTitle', newTitle);
  }

  input.addEventListener('blur', () => {
    saveAndRemoveInput();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();
    }
  });
});

// При загрузке страницы восстанавливаем название трека
window.addEventListener('DOMContentLoaded', () => {
  const savedTitle = localStorage.getItem('playerTrackTitle');
  const trackTitleElem = document.querySelector('.track-title');
  if (savedTitle) {
    trackTitleElem.textContent = savedTitle;
  }
});
