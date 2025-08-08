document.getElementById('name-music-btn').addEventListener('click', () => {
  const trackTitleElem = document.querySelector('.track-title');

  // Если поле уже показано — не создавать новое
  if (document.getElementById('music-input')) return;

  // Текущее название песни
  const currentTitle = trackTitleElem.textContent;

  // Создаём input
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'music-input';
  input.value = currentTitle;
  input.classList.add('custom-input');  // если есть стили, аналогичные для автора
  input.style.boxSizing = 'border-box';

  // Заменяем текст на input
  trackTitleElem.textContent = '';
  trackTitleElem.appendChild(input);
  input.focus();

  // Функция сохранения и удаления поля ввода
  function saveAndRemoveInput() {
    const newTitle = input.value.trim() || 'Название трека';
    trackTitleElem.textContent = newTitle;
  }

  // При потере фокуса сохраняем введённое
  input.addEventListener('blur', () => {
    saveAndRemoveInput();
  });

  // При нажатии Enter сохраняем и убираем фокус
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();
    }
  });
});
