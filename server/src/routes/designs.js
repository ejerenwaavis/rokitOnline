const express = require('express');
const router = express.Router();
const { createDesignRequest, getMyDesignRequests } = require('../controllers/designsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, upload.array('referenceFiles', 5), createDesignRequest);
router.get('/mine', protect, getMyDesignRequests);

module.exports = router;
