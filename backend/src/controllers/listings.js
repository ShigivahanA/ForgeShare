const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Listing = require('../models/Listing');
const User = require('../models/User');
const ToolRequest = require('../models/ToolRequest');
const Review = require('../models/Review');

// @desc    Get all listings
// @route   GET /api/v1/listings
// @access  Public
exports.getListings = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'keyword', 'location'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Public filters: Only approved and active
  // If owner is specified, we assume it's a profile view (or admin) and show all non-deleted
  const filters = { ...JSON.parse(queryStr), isDeleted: false };
  if (!filters.owner) {
    filters.status = 'approved';
    filters.isActive = true;
  }

  // Finding resource
  query = Listing.find(filters).populate('owner', 'name avatar');

  // Keyword search
  if (req.query.keyword) {
    query = query.find({
      $or: [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ]
    });

    // SPECIAL FEATURE: If no results, save the tool request
    const tempResults = await Listing.find({
      $or: [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ],
      status: 'approved'
    });

    if (tempResults.length === 0 && req.user) {
      await ToolRequest.create({
        user: req.user.id,
        keyword: req.query.keyword
      });
    }
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Listing.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const listings = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: listings.length,
    pagination,
    data: listings
  });
});

// @desc    Get single listing
// @route   GET /api/v1/listings/:id
// @access  Public
exports.getListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).populate('owner', 'name avatar');

  if (!listing) {
    return next(new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: listing
  });
});

// @desc    Create new listing
// @route   POST /api/v1/listings
// @access  Private (Owner/Admin)
exports.createListing = asyncHandler(async (req, res, next) => {
  // Check if user is verified
  if (!req.user.isAadharVerified) {
    return next(new ErrorResponse('Please verify your identity (Aadhar) to list your items', 403));
  }

  // Add user to req.body
  req.body.owner = req.user.id;

  // Handle images if they come in base64
  if (req.body.images && Array.isArray(req.body.images)) {
    const cloudinary = require('../utils/cloudinary');
    const uploadPromises = req.body.images.map(img =>
      cloudinary.uploader.upload(img, { folder: 'forgeshare/listings' })
    );
    const results = await Promise.all(uploadPromises);
    req.body.images = results.map(res => res.secure_url);
  }

  const listing = await Listing.create(req.body);

  // CHECK FOR TOOL REQUEST MATCHES
  const matches = await ToolRequest.find({
    keyword: { $regex: listing.title, $options: 'i' },
    isActive: true
  });

  if (matches.length > 0) {
    // Logic to notify users would go here
    // For now we just mark them as handled
    await ToolRequest.updateMany(
      { _id: { $in: matches.map(m => m._id) } },
      { isActive: false }
    );
  }

  res.status(201).json({
    success: true,
    data: listing
  });
});

// @desc    Update listing
// @route   PUT /api/v1/listings/:id
// @access  Private (Owner/Admin)
exports.updateListing = asyncHandler(async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is listing owner
  if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this listing`, 401));
  }

  listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: listing
  });
});

// @desc    Delete listing
// @route   DELETE /api/v1/listings/:id
// @access  Private (Owner/Admin)
exports.deleteListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is listing owner
  if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this listing`, 401));
  }

  listing.isDeleted = true;
  await listing.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get platform stats
// @route   GET /api/v1/listings/stats
// @access  Public
exports.getPlatformStats = asyncHandler(async (req, res, next) => {
  const listingCount = await Listing.countDocuments({ isDeleted: false, isActive: true, status: 'approved' });
  const userCount = await User.countDocuments({ role: { $in: ['user', 'owner'] } });

  res.status(200).json({
    success: true,
    data: {
      listings: listingCount,
      users: userCount
    }
  });
});

// @desc    Get counts by category
// @route   GET /api/v1/listings/categories
// @access  Public
exports.getCategoryStats = asyncHandler(async (req, res, next) => {
  const stats = await Listing.aggregate([
    { $match: { isDeleted: false, isActive: true, status: 'approved' } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get featured reviews for landing page
// @route   GET /api/v1/listings/reviews/landing
// @access  Public
exports.getLandingReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find()
    .sort('-rating')
    .limit(5)
    .populate('user', 'name role onboardingData.location');

  res.status(200).json({
    success: true,
    data: reviews
  });
});
