document.getElementById('name-author-btn').addEventListener('click', () => {
  const trackArtistElem = document.querySelector('.track-artist');

  if (document.getElementById('author-input')) return;

  const currentArtist = trackArtistElem.textContent;

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'author-input';
  input.value = currentArtist;
  input.classList.add('custom-input');
  input.style.boxSizing = 'border-box';

  trackArtistElem.textContent = '';
  trackArtistElem.appendChild(input);
  input.focus();

  function saveAndRemoveInput() {
    const newArtist = input.value.trim() || 'Имя исполнителя';
    trackArtistElem.textContent = newArtist;

    // Сохраняем в localStorage
    localStorage.setItem('playerTrackArtist', newArtist);
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

// При загрузке страницы восстанавливаем исполнителя из localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedArtist = localStorage.getItem('playerTrackArtist');
  const trackArtistElem = document.querySelector('.track-artist');
  if (savedArtist) {
    trackArtistElem.textContent = savedArtist;
  }
});
