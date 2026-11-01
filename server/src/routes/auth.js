const express = require('express');
const router = express.Router();
const { register, login, verifyMfa, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { publicFormRateLimiter, antiBotGuard } = require('../middleware/antiBot');

router.post('/register', publicFormRateLimiter, antiBotGuard, register);
router.post('/login', login);
router.post('/verify-mfa', verifyMfa);
router.get('/me', protect, getMe);
router.post('/forgot-password', publicFormRateLimiter, antiBotGuard, forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
