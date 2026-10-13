const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminCheck');
const {
  ingestFile,
  getCurrentSessionItem,
  getActiveSession,
  generateCloudinarySignature,
  commitProjectMedia,
  skipProject,
  discardSession,
} = require('../controllers/mediaBridgeController');

// Multer memory storage for direct file stream parsing
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit for register files
});

// Protect all media bridge routes with admin authentication
router.use(protect, adminOnly);

// Session check
router.get('/session/active', getActiveSession);
router.get('/session/:sessionId/current', getCurrentSessionItem);
router.post('/session/:sessionId/skip', skipProject);
router.post('/session/:sessionId/discard', discardSession);

// Ingestion
router.post('/ingest', upload.single('file'), ingestFile);

// Cloudinary signature
router.post('/cloudinary-sign', generateCloudinarySignature);

// Commit project media & deltas
router.put('/project/:projectId/commit', commitProjectMedia);

module.exports = router;
