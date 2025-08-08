document.getElementById('img-btn').addEventListener('click', () => {
  const fileInput = document.getElementById('upload-image-input');
  fileInput.click(); // вызвать окно выбора файла
});

document.getElementById('upload-image-input').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const albumArt = document.querySelector('.album-art');
    albumArt.src = e.target.result; // обновляем изображение
  };

  reader.readAsDataURL(file);
});
