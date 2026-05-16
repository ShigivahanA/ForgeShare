const express = require('express');
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getPlatformStats,
  getCategoryStats,
  getLandingReviews
} = require('../controllers/listings');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

// Include other resource routers
const reviewRouter = require('./reviews');

// Re-route into other resource routers
router.use('/:listingId/reviews', reviewRouter);

router.get('/stats', getPlatformStats);
router.get('/categories', getCategoryStats);
router.get('/reviews/landing', getLandingReviews);

router
  .route('/')
  .get(getListings)
  .post(protect, authorize('user', 'owner', 'admin'), createListing);

router
  .route('/:id')
  .get(getListing)
  .put(protect, authorize('user', 'owner', 'admin'), updateListing)
  .delete(protect, authorize('user', 'owner', 'admin'), deleteListing);

module.exports = router;
