const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  toggle2fa,
  sendOTP,
  verify2fa,
  verifyEmail
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatepassword', protect, updatePassword);
router.put('/toggle2fa', protect, toggle2fa);
router.post('/sendotp', protect, sendOTP);
router.post('/verify2fa', verify2fa);
router.get('/verifyemail/:token', verifyEmail);

module.exports = router;
