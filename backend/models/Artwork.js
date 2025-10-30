const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  imageUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  artistName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['abstract', 'landscape', 'portrait', 'digital', 'photography', 'illustration', '3d', 'painting', 'nature', 'urban', 'space', 'other'],
    index: true
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0,
    index: true
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  favoritesCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0,
    index: true
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  reportCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  dimensions: {
    width: Number,
    height: Number
  },
  fileSize: {
    type: Number,
    default: 0
  },
  downloadUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
artworkSchema.index({ title: 'text', description: 'text', tags: 'text' });
artworkSchema.index({ price: 1 });
artworkSchema.index({ createdAt: -1 });
artworkSchema.index({ artist: 1, status: 1 });

// Virtual for checking if artwork is liked by a user
artworkSchema.methods.isLikedBy = function(userId) {
  return this.likes.includes(userId);
};

// Virtual for checking if artwork is favorited by a user
artworkSchema.methods.isFavoritedBy = function(userId) {
  return this.favorites.includes(userId);
};

// Method to increment view count
artworkSchema.methods.incrementViews = function() {
  this.viewsCount += 1;
  return this.save();
};

// Remove sensitive data from JSON output
artworkSchema.methods.toJSON = function() {
  const artworkObject = this.toObject();
  // Can add any transformations here if needed
  return artworkObject;
};

// Static method to get artwork with artist details
artworkSchema.statics.findWithArtist = function(query) {
  return this.find(query).populate('artist', 'name username email avatarUrl bio');
};

// Static method to get approved artworks only
artworkSchema.statics.findApproved = function(query = {}) {
  return this.find({ ...query, status: 'approved', isActive: true });
};

module.exports = mongoose.model('Artwork', artworkSchema);
