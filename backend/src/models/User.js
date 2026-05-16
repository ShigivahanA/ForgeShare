const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const FSUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  bio: {
    type: String,
    maxlength: [200, 'Bio cannot be more than 200 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'owner', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  aadharNumber: {
    type: String,
    select: false
  },
  isAadharVerified: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 5.0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  onboardingData: {
    craftInterests: [String],
    preferredCategories: [String],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      },
      address: String
    },
    intent: {
      type: String,
      enum: ['renter', 'owner', 'both'],
      default: 'both'
    },
    workshopNeeds: [String],
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    completedAt: Date
  },
  wishlist: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Listing'
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorCode: String,
  twoFactorCodeExpire: Date,
  refreshToken: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banUntil: {
    type: Date
  },
  banReason: {
    type: String
  },
  cookiesAccepted: {
    type: Boolean,
    default: false
  },
  termsAccepted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
FSUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
FSUserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate and return Refresh Token
FSUserSchema.methods.getRefreshToken = function() {
  const refreshToken = jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '30d'
  });
  this.refreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
  return refreshToken;
};

// Match user entered password to hashed password in database
FSUserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
FSUserSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// Generate email verification token
FSUserSchema.methods.getEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  return verificationToken;
};

// Generate 2FA code
FSUserSchema.methods.getTwoFactorCode = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.twoFactorCode = crypto.createHash('sha256').update(otp).digest('hex');
  this.twoFactorCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

module.exports = mongoose.model('User', FSUserSchema);
