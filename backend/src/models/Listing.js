const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  type: {
    type: String,
    enum: ['tool', 'workshop'],
    required: [true, 'Please specify if it is a tool or a workshop']
  },
  images: [String],
  pricePerDay: {
    type: Number,
    required: [true, 'Please add a daily price']
  },
  pricePerHour: {
    type: Number
  },
  deposit: {
    type: Number,
    default: 0
  },
  condition: {
    type: String,
    enum: ['Brand New', 'Like New', 'Used', 'Vintage'],
    required: [true, 'Please add tool condition']
  },
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    startTime: String,
    endTime: String
  }],
  securityDeposit: {
    type: Number,
    required: [true, 'Please add a security deposit amount']
  },
  rules: [String],
  location: {
    address: { type: String, required: [true, 'Please add a street address'] },
    city: { type: String, required: [true, 'Please add a city'] },
    state: { type: String, required: [true, 'Please add a state'] },
    zipcode: { type: String, required: [true, 'Please add a zipcode'] }
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String,
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be can not be more than 5']
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Listing', ListingSchema);
