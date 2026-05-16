const mongoose = require('mongoose');

const ToolRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  keyword: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  category: String,
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: [Number],
    address: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient matching
ToolRequestSchema.index({ keyword: 1 });

module.exports = mongoose.model('ToolRequest', ToolRequestSchema);
