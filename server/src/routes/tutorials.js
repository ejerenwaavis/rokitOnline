const express = require('express');
const router = express.Router();
const { getTutorials, getTutorialBySlug, createTutorial, updateTutorial, deleteTutorial, getAllTutorialsAdmin } = require('../controllers/tutorialsController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminCheck');
const upload = require('../middleware/upload');

router.get('/', getTutorials);
router.get('/admin/all', protect, adminOnly, getAllTutorialsAdmin);
router.get('/:slug', getTutorialBySlug);
router.post('/', protect, adminOnly, upload.single('thumbnail'), createTutorial);
router.put('/:id', protect, adminOnly, upload.single('thumbnail'), updateTutorial);
router.delete('/:id', protect, adminOnly, deleteTutorial);

module.exports = router;
