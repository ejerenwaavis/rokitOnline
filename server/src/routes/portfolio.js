const express = require('express');
const router = express.Router();
const { getPortfolio, getFeatured, getPortfolioById, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminCheck');
const upload = require('../middleware/upload');

router.get('/', getPortfolio);
router.get('/featured', getFeatured);
router.get('/:id', getPortfolioById);
router.post('/', protect, adminOnly, upload.array('images', 10), createPortfolioItem);
router.put('/:id', protect, adminOnly, updatePortfolioItem);
router.delete('/:id', protect, adminOnly, deletePortfolioItem);

module.exports = router;
