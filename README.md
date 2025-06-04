# Astralitha 3D Upload Project

## Overview
This project is a web app for uploading and viewing 3D models using:
- Frontend hosted on Netlify with Firebase Authentication
- Backend Flask API with Firebase token validation
- Cloudflare R2 for file storage

## Setup

### Environment Variables
Create a `.env` file based on `.env.example` and fill in your credentials:
```
FLASK_SECRET_KEY=your_secret_key_here
FIREBASE_CREDENTIALS=serviceAccountKey.json
R2_ACCESS_KEY=your_access_key
R2_SECRET_KEY=your_secret_key
```

### Install Dependencies
```
pip install -r requirements.txt
```

### Run Flask Backend
```
flask run
```

### Deploy Frontend
- Update backend URL in `static/upload.js` and `static/models.js`
- Deploy frontend to Netlify or your preferred static hosting

## Features
- User signup/login with Firebase Auth
- Upload 3D model files (.vrm, .fbx) to Cloudflare R2
- List uploaded models per user
- Public URLs for 3D models accessible by Three.js viewer

## Notes
- Configure CORS policy on Cloudflare R2 bucket to allow frontend domain
- Securely store environment variables in production
- Customize and extend as needed

---

## Node.js + Express + Cloudflare R2 Alternative (Hybrid/Optional)

If you want to use Node.js/Express as your backend (instead of Flask), you can use this structure:

```
/project-root
├── server.js          # Backend Express + R2 uploader
├── .env               # Environment variables
├── /public
│   ├── index.html     # Frontend viewer & uploader
│   └── three.min.js   # Three.js library (or via CDN)
```

### .env Example
```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_key
R2_ENDPOINT=https://<your-account>.r2.cloudflarestorage.com
R2_BUCKET=astralitha
R2_REGION=auto
```

### server.js Example
```js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const app = express();
const upload = multer();
app.use(cors());
app.use(express.static('public'));

const s3 = new S3Client({
  region: process.env.R2_REGION,
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.post('/upload', upload.single('model'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send('No file uploaded.');
  const params = {
    Bucket: process.env.R2_BUCKET,
    Key: `models/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };
  try {
    await s3.send(new PutObjectCommand(params));
    const url = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/models/${file.originalname}`;
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed.');
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
```

### public/index.html Example
```html
<!DOCTYPE html>
<html>
<head>
  <title>3D Model Viewer</title>
  <style>
    body { margin: 0; font-family: sans-serif; text-align: center; background: #f0f0f0; }
    #viewer { width: 100%; height: 80vh; background: #222; }
    input, button { margin-top: 10px; }
  </style>
</head>
<body>
  <h2>Upload & View GLB File</h2>
  <input type="file" id="fileInput" accept=".glb">
  <button onclick="uploadFile()">Upload</button>
  <div id="viewer"></div>
  <script src="https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.153.0/examples/js/loaders/GLTFLoader.js"></script>
  <script>
    async function uploadFile() {
      const file = document.getElementById('fileInput').files[0];
      if (!file) return alert('Select a file first.');
      const formData = new FormData();
      formData.append('model', file);
      const res = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        loadModel(data.url);
      }
    }
    function loadModel(url) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
      document.getElementById('viewer').innerHTML = '';
      document.getElementById('viewer').appendChild(renderer.domElement);
      const loader = new THREE.GLTFLoader();
      loader.load(url, function (gltf) {
        scene.add(gltf.scene);
        camera.position.z = 5;
        function animate() {
          requestAnimationFrame(animate);
          gltf.scene.rotation.y += 0.01;
          renderer.render(scene, camera);
        }
        animate();
      }, undefined, function (error) {
        console.error(error);
      });
    }
  </script>
</body>
</html>
```

---

## How to Run (Node.js Alternative)

1. `npm install express multer dotenv @aws-sdk/client-s3`
2. `node server.js`
3. Open `http://localhost:3000` and test upload/view.

---

## Hybrid Stack Recommendation
- You can use either Flask or Node.js backend for R2 upload.
- For Python/Flask, see the main instructions above.
- For Node.js/Express, use the template above.
- Both support public 3D model viewing via Three.js and Cloudflare R2.

# Astralitha 3D Model Upload & Gallery (Node.js + Cloudflare R2)

## Deskripsi
Sistem upload dan galeri file .glb ke Cloudflare R2 bucket `astralitha`.

## Instalasi

1. Clone repo dan masuk ke folder project
2. Copy `.env.example` ke `.env` dan isi kredensial Cloudflare R2 Anda
3. Install dependencies:
   ```bash
   npm install express multer dotenv cors @aws-sdk/client-s3
   ```

## Menjalankan Server

```bash
npm start
```
Atau mode development (auto-reload):
```bash
npm run dev
```

Server berjalan di: http://localhost:3000

## Struktur Folder

```
/project-root
├── index.js           # Backend Express + R2 uploader
├── .env.example       # Contoh environment variables
├── public/
│   └── index.html     # Frontend galeri & uploader
├── package.json
```

## Contoh URL File

- Public URL: https://pub-24e73edade6f4cf8aeb28eca974ed36b.r2.dev/models/namafile.glb

## Link Publik Bucket

- https://pub-24e73edade6f4cf8aeb28eca974ed36b.r2.dev

## Fitur
- Upload file .glb (maks 50MB, validasi)
- Daftar file + metadata (nama, ukuran, waktu unggah)
- Preview 3D model dengan <model-viewer>
- Download & hapus file
- CORS support

## Catatan
- Hanya file .glb yang diterima
- File disimpan di folder `models/` dalam bucket
- Pastikan kredensial Cloudflare R2 benar di .env
