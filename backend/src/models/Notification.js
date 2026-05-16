const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'booking_request',
      'booking_confirmed',
      'booking_cancelled',
      'listing_approved',
      'listing_rejected',
      'new_listing_alert',
      'tool_request_match',
      'message'
    ],
    required: true
  },
  title: String,
  message: String,
  data: {
    listingId: mongoose.Schema.ObjectId,
    bookingId: mongoose.Schema.ObjectId
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
