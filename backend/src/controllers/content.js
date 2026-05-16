const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Content = require('../models/Content');

// @desc    Get all content
// @route   GET /api/v1/content
// @access  Public
exports.getAllContent = asyncHandler(async (req, res, next) => {
  const { type } = req.query;
  const filter = { isPublished: true };
  if (type) filter.type = type;

  const content = await Content.find(filter).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: content.length,
    data: content
  });
});

// @desc    Get single content
// @route   GET /api/v1/content/:id
// @access  Public
exports.getContent = asyncHandler(async (req, res, next) => {
  const content = await Content.findById(req.params.id);

  if (!content) {
    return next(new ErrorResponse(`Content not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: content
  });
});

// @desc    Get all content for admin (including unpublished)
// @route   GET /api/v1/admin/content
// @access  Private/Admin
exports.getAdminContent = asyncHandler(async (req, res, next) => {
  const content = await Content.find().sort('-createdAt');

  res.status(200).json({
    success: true,
    count: content.length,
    data: content
  });
});

// @desc    Create content
// @route   POST /api/v1/admin/content
// @access  Private/Admin
exports.createContent = asyncHandler(async (req, res, next) => {
  const content = await Content.create(req.body);

  res.status(201).json({
    success: true,
    data: content
  });
});

// @desc    Update content
// @route   PUT /api/v1/admin/content/:id
// @access  Private/Admin
exports.updateContent = asyncHandler(async (req, res, next) => {
  let content = await Content.findById(req.params.id);

  if (!content) {
    return next(new ErrorResponse(`Content not found with id of ${req.params.id}`, 404));
  }

  content = await Content.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: content
  });
});

// @desc    Delete content
// @route   DELETE /api/v1/admin/content/:id
// @access  Private/Admin
exports.deleteContent = asyncHandler(async (req, res, next) => {
  const content = await Content.findById(req.params.id);

  if (!content) {
    return next(new ErrorResponse(`Content not found with id of ${req.params.id}`, 404));
  }

  await content.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
