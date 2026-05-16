const express = require('express');
const {
  completeOnboarding,
  toggleWishlist,
  updateUserDetails,
  sendAadharOTP,
  verifyAadhar,
  uploadAvatar,
  deleteAvatar,
  updateConsents
} = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.use(protect);

router.put('/onboarding', completeOnboarding);
router.put('/updatedetails', updateUserDetails);
router.put('/avatar', uploadAvatar);
router.delete('/avatar', deleteAvatar);
router.post('/aadhar/send-otp', sendAadharOTP);
router.post('/aadhar/verify', verifyAadhar);
router.post('/wishlist/:listingId', toggleWishlist);
router.put('/consents', updateConsents);

module.exports = router;
