import { auth } from './firebase.js';

async function fetchModels() {
  const user = auth.currentUser;
  if (!user) {
    alert('Silakan login terlebih dahulu!');
    return;
  }
  const token = await user.getIdToken();
  try {
    const response = await fetch('https://your-flask-backend.com/models', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const models = await response.json();
    const listContainer = document.getElementById('model-list');
    listContainer.innerHTML = '';
    models.forEach(model => {
      const card = document.createElement('div');
      card.className = 'model-card';
      card.innerHTML = `
        <h3>${model.nama}</h3>
        <div class="model-info">
          <p><strong>Asal Anime:</strong> ${model.asal_anime}</p>
          <p><strong>Software:</strong> ${model.software}</p>
          <p><strong>Status Rigging:</strong> ${model.status_rigging}</p>
        </div>
        <a href="${model.url}" download><button class="download-btn">Download Model</button></a>
        <button class="view-btn" data-url="${model.url}">Lihat 3D</button>
        <button class="delete-btn" data-filename="${model.filename}">Hapus</button>
      `;
      listContainer.appendChild(card);
    });
    // Event listener untuk tombol hapus dan preview
    listContainer.addEventListener('click', async (e) => {
      if (e.target.classList.contains('delete-btn')) {
        if (confirm('Hapus model ini?')) {
          await fetch('https://your-flask-backend.com/delete_model', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: e.target.dataset.filename })
          });
          fetchModels();
        }
      } else if (e.target.classList.contains('view-btn')) {
        document.getElementById('model-viewer').src = e.target.dataset.url;
      }
    });
  } catch (err) {
    alert('Gagal mengambil daftar model');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchModels();
});
