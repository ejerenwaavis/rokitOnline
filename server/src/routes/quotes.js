const express = require('express');
const router = express.Router();
const { createQuotation, getMyQuotations } = require('../controllers/quotesController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { publicFormRateLimiter, antiBotGuard } = require('../middleware/antiBot');

// Public quotation submission (no login required, protected by rate limit + anti-bot guard)
router.post('/', publicFormRateLimiter, upload.array('files', 5), antiBotGuard, createQuotation);
router.get('/mine', protect, getMyQuotations);

module.exports = router;
