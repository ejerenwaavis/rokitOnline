const express = require('express');
const router = express.Router();
const { stripeWebhook } = require('../controllers/paymentController');

// Raw body required for Stripe webhook signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
