const express = require('express');
const {
    getAllContent,
    getContent,
    getAdminContent,
    createContent,
    updateContent,
    deleteContent
} = require('../controllers/content');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes for landing page content
router.get('/', getAllContent);
router.get('/:id', getContent);

// Admin routes
router.get('/admin', protect, authorize('admin'), getAdminContent);
router.post('/admin', protect, authorize('admin'), createContent);
router.put('/admin/:id', protect, authorize('admin'), updateContent);
router.delete('/admin/:id', protect, authorize('admin'), deleteContent);

module.exports = router;
