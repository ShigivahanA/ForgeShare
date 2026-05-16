const express = require('express');
const {
  createBooking,
  getBookings,
  updateBookingStatus,
  returnBooking,
  completeBooking
} = require('../controllers/bookings');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.use(protect);

router
  .route('/')
  .get(getBookings)
  .post(createBooking);

router.put('/:id/status', updateBookingStatus);
router.put('/:id/return', returnBooking);
router.put('/:id/complete', completeBooking);

module.exports = router;
