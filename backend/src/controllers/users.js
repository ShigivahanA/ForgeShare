const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const Listing = require('../models/Listing');
const sendEmail = require('../services/emailService');
const { getOnboardingCompleteTemplate } = require('../utils/emailTemplates');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user (Onboarding)
// @route   PUT /api/v1/users/onboarding
// @access  Private
// @desc    Update user details
// @route   PUT /api/v1/users/updatedetails
// @access  Private
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  const { name, bio, location } = req.body;

  const fieldsToUpdate = { name };
  if (bio !== undefined) fieldsToUpdate.bio = bio;
  if (location !== undefined) {
    fieldsToUpdate['onboardingData.location'] = location;
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

exports.completeOnboarding = asyncHandler(async (req, res, next) => {
  const { craftInterests, preferredCategories, location, intent, workshopNeeds, notificationPreferences } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      onboardingCompleted: true,
      onboardingData: {
        craftInterests,
        preferredCategories,
        location,
        intent,
        workshopNeeds,
        notificationPreferences,
        completedAt: Date.now()
      }
    },
    {
      new: true,
      runValidators: true
    }
  );

  // Send onboarding complete email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Onboarding Protocol Complete',
      html: getOnboardingCompleteTemplate(user.name)
    });
  } catch (err) {
    console.error('Onboarding Email Error:', err);
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Add/Remove from wishlist
// @route   POST /api/v1/users/wishlist/:listingId
// @access  Private
// @desc    Verify Aadhar (Stage 1: Send OTP simulation)
// @route   POST /api/v1/users/aadhar/send-otp
// @access  Private
exports.sendAadharOTP = asyncHandler(async (req, res, next) => {
  const { aadharNumber } = req.body;

  if (!aadharNumber || aadharNumber.length !== 12) {
    return next(new ErrorResponse('Please provide a valid 12-digit Aadhar number', 400));
  }

  // Simulation: We would call an external Aadhar API here
  // For now, we just return success
  res.status(200).json({
    success: true,
    message: 'OTP sent to mobile linked with Aadhar'
  });
});

// @desc    Verify Aadhar (Stage 2: Verify OTP simulation)
// @route   POST /api/v1/users/aadhar/verify
// @access  Private
exports.verifyAadhar = asyncHandler(async (req, res, next) => {
  const { otp, aadharNumber } = req.body;

  // Simulation: Accept any 6 digit OTP for now
  if (otp !== '123456') {
    return next(new ErrorResponse('Invalid OTP', 400));
  }

  const user = await User.findByIdAndUpdate(req.user.id, {
    isAadharVerified: true,
    aadharNumber: aadharNumber // Storing for record (would be encrypted in production)
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

const cloudinary = require('../utils/cloudinary');

// @desc    Upload avatar
// @route   PUT /api/v1/users/avatar
// @access  Private
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.body.avatar) {
    return next(new ErrorResponse('Please provide an image in base64 format', 400));
  }

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(req.body.avatar, {
    folder: 'forgeshare/avatars',
    width: 300,
    crop: 'scale'
  });

  const user = await User.findByIdAndUpdate(req.user.id, {
    avatar: result.secure_url
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete avatar
// @route   DELETE /api/v1/users/avatar
// @access  Private
exports.deleteAvatar = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, {
    avatar: null
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

exports.toggleWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const listingId = req.params.listingId;

  // Check if listing exists
  const listing = await Listing.findById(listingId);
  if (!listing) {
    return next(new ErrorResponse(`Listing not found with id of ${listingId}`, 404));
  }

  // Find index using string comparison for ObjectIds
  const index = user.wishlist.findIndex(id => id.toString() === listingId);
  
  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(listingId);
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user.wishlist
  });
});

// @desc    Update user consents (Cookies/Terms)
// @route   PUT /api/v1/users/consents
// @access  Private
exports.updateConsents = asyncHandler(async (req, res, next) => {
  const { cookiesAccepted, termsAccepted } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { cookiesAccepted, termsAccepted },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: user
  });
});
