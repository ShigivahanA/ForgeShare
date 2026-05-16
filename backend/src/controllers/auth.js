const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const sendEmail = require('../services/emailService');
const { 
  getPasswordResetTemplate, 
  getVerificationTemplate, 
  getTwoFactorTemplate,
  getSignupWelcomeTemplate,
  getLoginAlertTemplate,
  getPasswordResetSuccessTemplate,
  getPasswordChangedTemplate,
  getOnboardingPendingTemplate
} = require('../utils/emailTemplates');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  // Create verification token
  const verificationToken = user.getEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Create verification url
  const verificationUrl = `${process.env.FRONTEND_URL}/verifyemail/${verificationToken}`;

  const message = `Please verify your email by clicking the link: \n\n ${verificationUrl}`;

  try {
    // Send Verification Email
    await sendEmail({
      email: user.email,
      subject: 'Email Verification Protocol',
      html: getVerificationTemplate(verificationUrl)
    });

    // Send Signup Welcome Email
    await sendEmail({
      email: user.email,
      subject: 'Welcome to ForgeShare',
      html: getSignupWelcomeTemplate(user.name)
    });

    // Send Onboarding Pending Email (Initial Reminder)
    await sendEmail({
      email: user.email,
      subject: 'Synchronization Pending',
      html: getOnboardingPendingTemplate(user.name)
    });

    await sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Email Error:', err);
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Identity emails could not be dispatched', 500));
  }
});

// @desc    Verify email
// @route   GET /api/v1/auth/verifyemail/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken,
  });

  if (!user) {
    return next(new ErrorResponse('Invalid verification token', 400));
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: 'Email verified successfully'
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check for 2FA
  if (user.twoFactorEnabled) {
    const otp = user.getTwoFactorCode();
    await user.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        email: user.email,
        subject: '2FA Verification Code',
        message: `Your 2FA code is ${otp}`,
        html: getTwoFactorTemplate(otp)
      });

      return res.status(200).json({
        success: true,
        twoFactorRequired: true,
        userId: user._id
      });
    } catch (err) {
      user.twoFactorCode = undefined;
      user.twoFactorCodeExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorResponse('Verification email could not be sent', 500));
    }
  }

  // Send login alert
  try {
    await sendEmail({
      email: user.email,
      subject: 'Security Alert: New Login Detected',
      html: getLoginAlertTemplate({
        ip: req.ip,
        location: 'Detected Node'
      })
    });
  } catch (err) {
    console.error('Login Alert Error:', err);
  }

  await sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please use the following link: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
      html: getPasswordResetTemplate(resetUrl)
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Send Password Reset Success Email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Security Update: Password Reset Successful',
      html: getPasswordResetSuccessTemplate()
    });
  } catch (err) {
    console.error('Reset Success Email Error:', err);
  }

  await sendTokenResponse(user, 200, res);
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  // Check for 2FA OTP if provided or required
  const twoFactorCode = crypto
    .createHash('sha256')
    .update(req.body.otp)
    .digest('hex');

  if (user.twoFactorCode !== twoFactorCode || user.twoFactorCodeExpire < Date.now()) {
    return next(new ErrorResponse('Invalid or expired security code', 400));
  }

  user.password = req.body.newPassword;
  user.twoFactorCode = undefined;
  user.twoFactorCodeExpire = undefined;
  await user.save();

  // Send Password Changed Email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Security Update: Password Modified',
      html: getPasswordChangedTemplate()
    });
  } catch (err) {
    console.error('Password Change Email Error:', err);
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Toggle 2FA
// @route   PUT /api/v1/auth/toggle2fa
// @access  Private
exports.toggle2fa = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (req.body.enable && !user.twoFactorEnabled) {
    // Verify OTP before enabling
    const twoFactorCode = crypto
      .createHash('sha256')
      .update(req.body.otp)
      .digest('hex');

    if (user.twoFactorCode !== twoFactorCode || user.twoFactorCodeExpire < Date.now()) {
      return next(new ErrorResponse('Invalid or expired security code', 400));
    }
    user.twoFactorEnabled = true;
    user.twoFactorCode = undefined;
    user.twoFactorCodeExpire = undefined;
  } else if (!req.body.enable && user.twoFactorEnabled) {
    user.twoFactorEnabled = false;
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: { twoFactorEnabled: user.twoFactorEnabled }
  });
});

// @desc    Send 2FA OTP (for password change or other actions)
// @route   POST /api/v1/auth/sendotp
// @access  Private
exports.sendOTP = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  const otp = user.getTwoFactorCode();
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: 'Security Verification Code',
      message: `Your verification code is ${otp}`,
      html: getTwoFactorTemplate(otp)
    });

    res.status(200).json({ success: true, data: 'OTP sent to email' });
  } catch (err) {
    user.twoFactorCode = undefined;
    user.twoFactorCodeExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Verify 2FA Login
// @route   POST /api/v1/auth/verify2fa
// @access  Public
exports.verify2fa = asyncHandler(async (req, res, next) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return next(new ErrorResponse('Please provide user ID and OTP', 400));
  }

  const user = await User.findById(userId).select('+password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const twoFactorCode = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  if (user.twoFactorCode !== twoFactorCode || user.twoFactorCodeExpire < Date.now()) {
    return next(new ErrorResponse('Invalid or expired security code', 400));
  }

  user.twoFactorCode = undefined;
  user.twoFactorCodeExpire = undefined;
  await user.save({ validateBeforeSave: false });

  // Send login alert (after 2FA)
  try {
    await sendEmail({
      email: user.email,
      subject: 'Security Alert: New Login Detected',
      html: getLoginAlertTemplate({
        ip: req.ip,
        location: 'Detected Node'
      })
    });
  } catch (err) {
    console.error('Login Alert Error:', err);
  }

  await sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
async function sendTokenResponse(user, statusCode, res) {
  // Create token
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();
  
  await user.save({ validateBeforeSave: false });

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .cookie('refreshToken', refreshToken, { ...options, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isAadharVerified: user.isAadharVerified,
        onboardingCompleted: user.onboardingCompleted,
        wishlist: user.wishlist || [],
        avatar: user.avatar,
        bio: user.bio,
        cookiesAccepted: user.cookiesAccepted,
        termsAccepted: user.termsAccepted
      }
    });
};
