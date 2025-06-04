const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");

dotenv.config();
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

const db = admin.firestore();
const storage = admin.storage().bucket();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== ".glb") {
      return cb(new Error("Only .glb files are allowed!"));
    }
    cb(null, true);
  },
});

// Cloudflare R2 / S3 configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const BUCKET = process.env.BUCKET_NAME;
const PUBLIC_URL = "https://pub-24e73edade6f4cf8aeb28eca974ed36b.r2.dev";

// Upload model endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { nama, asal_anime, software, status_rigging } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const params = {
      Bucket: BUCKET,
      Key: `models/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    await s3.send(new PutObjectCommand(params));
    const url = `${PUBLIC_URL}/${params.Key}`;

    // Save metadata to Firestore
    await db.collection("models").add({
      nama,
      asal_anime,
      software,
      status_rigging,
      file: url,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ url, filename: path.basename(params.Key) });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

// Get models list endpoint
app.get("/models", async (req, res) => {
  try {
    const snapshot = await db.collection("models").orderBy("createdAt", "desc").get();
    const models = [];
    snapshot.forEach((doc) => {
      models.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(models);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

// Get public URL endpoint
app.get("/file/:filename", (req, res) => {
  const filename = req.params.filename;
  const url = `${PUBLIC_URL}/models/${filename}`;
  res.json({ url });
});

// Delete file endpoint
app.delete("/file/:filename", async (req, res) => {
  const filename = req.params.filename;
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: `models/${filename}` }));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.api = onRequest(app);
