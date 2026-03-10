const express = require('express');
const router = express.Router();
const { createQuotation, getMyQuotations } = require('../controllers/quotesController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public quotation submission (no login required)
router.post('/', upload.array('files', 5), createQuotation);
router.get('/mine', protect, getMyQuotations);

module.exports = router;
