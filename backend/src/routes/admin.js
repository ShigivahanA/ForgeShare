const express = require('express');
const { 
  getStats, 
  getUsers, 
  updateUserDetails, 
  banUser,
  getPendingListings,
  updateListingStatus,
  getBookings
} = require('../controllers/admin');
const {
  getAdminContent,
  createContent,
  updateContent,
  deleteContent
} = require('../controllers/content');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

// System Stats
router.get('/stats', getStats);

// User Management
router.get('/users', getUsers);
router.put('/users/:id', updateUserDetails);
router.put('/users/:id/ban', banUser);

// Listing Management
router.get('/listings/pending', getPendingListings);
router.put('/listings/:id/status', updateListingStatus);

// Booking Management
router.get('/bookings', getBookings);

// Content Management
router.get('/content', getAdminContent);
router.post('/content', createContent);
router.put('/content/:id', updateContent);
router.delete('/content/:id', deleteContent);

module.exports = router;
