const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Listing = require('../models/Listing');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all bookings
// @route   GET /api/v1/admin/bookings
// @access  Private/Admin
exports.getBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate('listing', 'title images pricePerDay')
    .populate('renter', 'name email avatar')
    .populate('owner', 'name email avatar')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Approve/Reject listing
// @route   PUT /api/v1/admin/listings/:id/status
// @access  Private/Admin
exports.updateListingStatus = asyncHandler(async (req, res, next) => {
  const { status, rejectionReason } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return next(new ErrorResponse('Invalid status', 400));
  }

  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { status, rejectionReason },
    { new: true, runValidators: true }
  );

  if (!listing) {
    return next(new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: listing
  });
});

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  // Exclude admins from the list
  const users = await User.find({ role: { $ne: 'admin' } }).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/v1/admin/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user details
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Ban user
// @route   PUT /api/v1/admin/users/:id/ban
// @access  Private/Admin
exports.banUser = asyncHandler(async (req, res, next) => {
  const { isBanned, banUntil, banReason } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBanned, banUntil, banReason },
    { new: true }
  );

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: isBanned ? 'User has been banned' : 'User has been unbanned',
    data: user
  });
});

// @desc    Get system stats
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
exports.getStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments({ role: { $in: ['user', 'owner'] } });
  
  // 'Live Tools' should only be approved and not deleted
  const totalListings = await Listing.countDocuments({ status: 'approved', isDeleted: false });
  
  // 'Pending' should be pending and not deleted
  const pendingListings = await Listing.countDocuments({ status: 'pending', isDeleted: false });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalListings,
      pendingListings
    }
  });
});

// @desc    Get all pending listings
// @route   GET /api/v1/admin/listings/pending
// @access  Private/Admin
exports.getPendingListings = asyncHandler(async (req, res, next) => {
  const listings = await Listing.find({ status: 'pending' }).populate('owner', 'name email avatar');

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});
