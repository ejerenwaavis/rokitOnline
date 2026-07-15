const express = require('express');
const router = express.Router();
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { enhanceUpload } = require('../middleware/enhanceUpload');
const { enhancePhoto } = require('../controllers/enhanceController');

// Photo enhancement hits a paid third-party API — throttle it harder
// than the global /api/ limiter (200/15min) to control cost/abuse.
const enhanceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many enhancement requests. Please wait a few minutes and try again.' },
});

// Wrap multer so its errors (file too large, bad type, etc.) come back
// as clean JSON instead of an unhandled exception / raw HTML error page.
const uploadSingle = (req, res, next) => {
  enhanceUpload.single('photo')(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'Image is too large. Max file size is 20MB.' });
    }
    if (err.message === 'UNSUPPORTED_FILE_TYPE') {
      return res.status(415).json({ message: 'Unsupported file type. Please upload a JPEG, PNG, or WEBP image.' });
    }
    return res.status(400).json({ message: 'Upload failed. Please try again.' });
  });
};

// POST /api/enhance-photo  (multipart/form-data, field name: "photo")
router.post('/', enhanceLimiter, uploadSingle, enhancePhoto);

module.exports = router;
