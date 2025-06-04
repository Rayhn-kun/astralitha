document.addEventListener('DOMContentLoaded', () => {
    const modelList = document.getElementById('model-list');
    const uploadForm = document.getElementById('upload-form');
    const uploadMessage = document.getElementById('upload-message');
    const modelViewer = document.getElementById('model-viewer');
    const fileInput = document.getElementById('fileModel');

    // Preview selected 3D file before upload using <model-viewer>
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) {
            modelViewer.src = '';
            return;
        }
        const url = URL.createObjectURL(file);
        modelViewer.src = url;
    });

    // Handle view button clicks to load model in <model-viewer>
    modelList.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-btn')) {
            const filename = e.target.getAttribute('data-filename');
            modelViewer.src = '/uploads/' + encodeURIComponent(filename);
        }
    });

    // Hilangkan/disable event handler uploadForm di script.js jika sudah pakai upload.js berbasis Firebase Auth
});

// Script ini sudah meng-handle preview model dan event handler, hasil migrasi dari XORVEXCIC/static/script.js
