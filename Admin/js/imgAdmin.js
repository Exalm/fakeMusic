document.getElementById('img-btn').addEventListener('click', () => {
  const fileInput = document.getElementById('upload-image-input');
  fileInput.click();
});

document.getElementById('upload-image-input').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Image = e.target.result;
    const albumArt = document.querySelector('.album-art');
    albumArt.src = base64Image; // обновляем изображение

    // Сохраняем base64 в localStorage
    localStorage.setItem('playerAlbumImage', base64Image);
  };
  reader.readAsDataURL(file);
});

// При загрузке страницы подгружаем сохранённое изображение
window.addEventListener('DOMContentLoaded', () => {
  const savedImage = localStorage.getItem('playerAlbumImage');
  if (savedImage) {
    const albumArt = document.querySelector('.album-art');
    albumArt.src = savedImage;
  }
});
