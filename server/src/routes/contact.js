const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { publicFormRateLimiter, antiBotGuard } = require('../middleware/antiBot');

router.post('/', publicFormRateLimiter, antiBotGuard, submitContact);

module.exports = router;
