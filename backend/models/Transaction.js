const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  buyerName: {
    type: String,
    required: true
  },
  buyerEmail: {
    type: String,
    required: true
  },
  artworks: [{
    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artwork',
      required: true
    },
    title: String,
    price: Number,
    currency: String,
    imageUrl: String,
    artistId: mongoose.Schema.Types.ObjectId,
    artistName: String,
    quantity: {
      type: Number,
      default: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    default: 'mock' // mock payment for now
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed' // Auto-complete for mock payment
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  billingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  cardDetails: {
    cardNumber: String, // Last 4 digits only
    cardType: String
  },
  downloadLinks: [{
    artworkId: mongoose.Schema.Types.ObjectId,
    url: String,
    expiresAt: Date
  }],
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
    default: 'completed'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
transactionSchema.index({ buyer: 1, createdAt: -1 });
transactionSchema.index({ 'artworks.artwork': 1 });
// transactionId already has unique:true which creates an index automatically

// Generate unique transaction ID
transactionSchema.statics.generateTransactionId = function() {
  var timestamp = Date.now().toString(36);
  var randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN-${timestamp}-${randomStr}`;
};

// Method to check if user has purchased an artwork
transactionSchema.statics.hasPurchased = async function(userId, artworkId) {
  var transaction = await this.findOne({
    buyer: userId,
    'artworks.artwork': artworkId,
    paymentStatus: 'completed'
  });
  return !!transaction;
};

// Get user's purchase history
transactionSchema.statics.getUserPurchases = function(userId) {
  return this.find({ buyer: userId })
    .sort({ createdAt: -1 })
    .populate('artworks.artwork', 'title imageUrl')
    .lean();
};

module.exports = mongoose.model('Transaction', transactionSchema);
