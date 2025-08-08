const repeatBtn = document.getElementById('repeat-btn');
const repeatModal = document.getElementById('repeat-modal');
const repeatModalClose = document.getElementById('repeat-modal-close');

// Открытие модального окна по клику на кнопку Repeat
repeatBtn.addEventListener('click', () => {
  repeatModal.style.display = 'flex';
  // Опционально: задать фокус на модальное окно или первый элемент для доступности
  repeatModal.querySelector('.modal-content').focus();
});

// Закрытие модального окна по клику на кнопку "Закрыть"
repeatModalClose.addEventListener('click', () => {
  repeatModal.style.display = 'none';
});

// Закрытие при клике в области вне модального контента
repeatModal.addEventListener('click', e => {
  if (e.target === repeatModal) {
    repeatModal.style.display = 'none';
  }
});

// Опционально: закрытие по нажатию клавиши Esc
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && repeatModal.style.display === 'flex') {
    repeatModal.style.display = 'none';
  }
});
