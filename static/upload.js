import { auth } from './firebase.js';

document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) {
    alert('Silakan login terlebih dahulu!');
    return;
  }
  const token = await user.getIdToken();
  const formData = new FormData(e.target);
  // Tambahkan metadata karakter
  formData.append('nama', document.getElementById('nama').value);
  formData.append('asal_anime', document.getElementById('asal_anime').value);
  formData.append('software', document.getElementById('software').value);
  formData.append('status_rigging', document.getElementById('status_rigging').value);
  formData.append('file', document.getElementById('file').files[0]);
  fetch('https://your-flask-backend.com/upload', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token },
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('upload-message').textContent = 'Upload Success: ' + data.filename;
      document.getElementById('upload-message').style.color = 'green';
    })
    .catch(err => {
      document.getElementById('upload-message').textContent = 'Upload gagal!';
      document.getElementById('upload-message').style.color = 'red';
    });
});
