const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }
  // Set token from cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if user is banned
    if (req.user.isBanned) {
      if (req.user.banUntil && req.user.banUntil > Date.now()) {
        return next(new ErrorResponse(`Account is suspended until ${req.user.banUntil.toLocaleDateString()}. Reason: ${req.user.banReason || 'Violation of guild terms'}`, 403));
      } else if (!req.user.banUntil) {
        return next(new ErrorResponse(`Account is permanently suspended. Reason: ${req.user.banReason || 'Violation of guild terms'}`, 403));
      }
      // If banUntil is in the past, we should ideally unban them or let them in.
      // For now, let's just let them in if it's expired.
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
