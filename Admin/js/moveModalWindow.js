const modal = document.getElementById('repeat-modal');
const modalContent = modal.querySelector('.modal-content');

modalContent.style.position = 'absolute'; // чтобы сдвигать окно

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

modalContent.addEventListener('mousedown', (e) => {
  // Начало перетаскивания, только левой кнопкой мыши
  if (e.button !== 0) return;

  isDragging = true;

  // Рассчитываем смещение курсора относительно верхнего левого угла окна
  const rect = modalContent.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;

  // Для лучшей UX предотвратить выделение текста во время движения
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  // Новые координаты окна по позиции курсора с учетом смещения
  let left = e.clientX - dragOffsetX;
  let top = e.clientY - dragOffsetY;

  // Можно добавить ограничение выхода окна за границы экрана
  const maxLeft = window.innerWidth - modalContent.offsetWidth;
  const maxTop = window.innerHeight - modalContent.offsetHeight;

  if (left < 0) left = 0;
  if (top < 0) top = 0;
  if (left > maxLeft) left = maxLeft;
  if (top > maxTop) top = maxTop;

  modalContent.style.left = left + 'px';
  modalContent.style.top = top + 'px';
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
