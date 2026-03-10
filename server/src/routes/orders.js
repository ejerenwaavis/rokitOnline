const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById } = require('../controllers/ordersController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, upload.array('files', 5), createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
