// ────────────────────────────────────────────────────────────────
// Multer middleware — TEMPORARY local disk storage for the AI Photo
// Enhancer only. Unlike upload.js (which sends straight to Cloudinary
// permanently), these files exist on disk just long enough to be
// streamed to Replicate, then get deleted by the controller.
// ────────────────────────────────────────────────────────────────
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const TMP_DIR = path.join(__dirname, '../../tmp/enhance-uploads');
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB — plenty for a scanned/vintage photo

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, TMP_DIR),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${Date.now()}-${unique}${ext}`);
  },
});

const enhanceUpload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new Error('UNSUPPORTED_FILE_TYPE'));
    }
    cb(null, true);
  },
});

module.exports = { enhanceUpload, TMP_DIR };
