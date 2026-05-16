const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('../services/emailService');
const { 
  getBookingRequestTemplate, 
  getBookingConfirmedTemplate, 
  getBookingCancelledTemplate 
} = require('../utils/emailTemplates');

// @desc    Create booking request
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  req.body.renter = req.user.id;

  const listing = await Listing.findById(req.body.listing);

  if (!listing) {
    return next(new ErrorResponse(`No listing with the id of ${req.body.listing}`, 404));
  }

  // Prevent owner from booking their own tool
  if (listing.owner.toString() === req.user.id) {
    return next(new ErrorResponse(`You cannot book your own listing`, 400));
  }

  // Check for double booking
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);

  const existingBooking = await Booking.findOne({
    listing: req.body.listing,
    status: 'confirmed',
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  });

  if (existingBooking) {
    return next(new ErrorResponse(`Listing is already booked for these dates`, 400));
  }

  req.body.owner = listing.owner;

  const booking = await Booking.create(req.body);

  // NOTIFY OWNER VIA EMAIL
  try {
    const owner = await User.findById(listing.owner);
    const renter = req.user;
    
    const duration = `${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`;
    
    await sendEmail({
      email: owner.email,
      subject: 'ForgeShare: New Gear Request Received',
      html: getBookingRequestTemplate({
        listingTitle: listing.title,
        renterName: renter.name,
        duration: duration,
        totalPrice: booking.totalPrice
      })
    });
  } catch (err) {
    console.error('Email Notification Failed', err);
  }

  // CREATE IN-APP NOTIFICATION FOR OWNER
  try {
    await Notification.create({
      recipient: listing.owner,
      sender: req.user.id,
      type: 'booking_request',
      title: 'New Gear Request',
      message: `${req.user.name} wants to enlist your ${listing.title}`,
      data: {
        listingId: listing._id,
        bookingId: booking._id
      }
    });
  } catch (err) {
    console.error('In-App Notification Failed', err);
  }

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Get all bookings for current user
// @route   GET /api/v1/bookings
// @access  Private
exports.getBookings = asyncHandler(async (req, res, next) => {
  let query;

  if (req.user.role === 'admin') {
    query = Booking.find().populate('listing renter owner');
  } else {
    query = Booking.find({
      $or: [
        { renter: req.user.id },
        { owner: req.user.id }
      ]
    }).populate('listing renter owner').sort({ createdAt: -1 });
  }

  const bookings = await query;

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Update booking status
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Only owner or admin can confirm/cancel
  if (booking.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this booking`, 401));
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
    new: true,
    runValidators: true
  }).populate('listing renter owner');

  // NOTIFY RENTER VIA EMAIL
  try {
    const duration = `${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`;
    
    let htmlTemplate;
    let subject;

    if (req.body.status === 'confirmed') {
      subject = 'ForgeShare: Gear Deployment Authorized';
      htmlTemplate = getBookingConfirmedTemplate({
        listingTitle: booking.listing.title,
        ownerName: booking.owner.name,
        duration: duration,
        totalPrice: booking.totalPrice
      });
    } else if (req.body.status === 'cancelled') {
      subject = 'ForgeShare: Gear Request Status Update';
      htmlTemplate = getBookingCancelledTemplate({
        listingTitle: booking.listing.title
      });
    }

    if (htmlTemplate) {
      await sendEmail({
        email: booking.renter.email,
        subject: subject,
        html: htmlTemplate
      });
    }
  } catch (err) {
    console.error('Email Notification Failed', err);
  }

  // CREATE IN-APP NOTIFICATION FOR RENTER
  try {
    const isConfirmed = req.body.status === 'confirmed';
    await Notification.create({
      recipient: booking.renter._id,
      sender: req.user.id,
      type: isConfirmed ? 'booking_confirmed' : 'booking_cancelled',
      title: isConfirmed ? 'Gear Authorized' : 'Request Update',
      message: isConfirmed 
        ? `Your request for ${booking.listing.title} has been authorized.` 
        : `Your request for ${booking.listing.title} has been declined.`,
      data: {
        listingId: booking.listing._id,
        bookingId: booking._id
      }
    });
  } catch (err) {
    console.error('In-App Notification Failed', err);
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Renter marks gear as returned
// @route   PUT /api/v1/bookings/:id/return
// @access  Private
exports.returnBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found`, 404));
  }

  // Only renter or owner can mark as returned
  const isRenter = booking.renter.toString() === req.user.id;
  const isOwner = booking.owner.toString() === req.user.id;

  if (!isRenter && !isOwner) {
    return next(new ErrorResponse(`Not authorized to mark this gear as returned`, 401));
  }

  if (booking.status !== 'confirmed') {
    return next(new ErrorResponse(`Gear must be in 'confirmed' status to be returned`, 400));
  }

  booking.status = 'returned';
  await booking.save();

  // Notify the other party
  try {
    const recipientId = isRenter ? booking.owner : booking.renter;
    const message = isRenter 
      ? `${req.user.name} has returned your gear. Please verify and complete the booking.` 
      : `The owner has marked the gear as returned. Waiting for final confirmation.`;

    await Notification.create({
      recipient: recipientId,
      sender: req.user.id,
      type: 'gear_returned',
      title: 'Gear Returned',
      message: message,
      data: { bookingId: booking._id }
    });
  } catch (err) {
    console.error('Notification failed', err);
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Owner marks booking as completed (received gear)
// @route   PUT /api/v1/bookings/:id/complete
// @access  Private
exports.completeBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found`, 404));
  }

  // Only owner can mark as completed
  if (booking.owner.toString() !== req.user.id) {
    return next(new ErrorResponse(`Only the owner can complete the booking`, 401));
  }

  if (booking.status !== 'returned') {
    return next(new ErrorResponse(`Gear must be 'returned' by renter before completing`, 400));
  }

  booking.status = 'completed';
  await booking.save();

  // Notify Renter
  try {
    await Notification.create({
      recipient: booking.renter,
      sender: req.user.id,
      type: 'booking_completed',
      title: 'Booking Completed',
      message: `The owner has confirmed receipt of the gear. Thank you for using ForgeShare!`,
      data: { bookingId: booking._id }
    });
  } catch (err) {
    console.error('Notification failed', err);
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});
