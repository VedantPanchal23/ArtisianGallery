const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  artwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true,
    index: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewerName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  verified: {
    type: Boolean,
    default: false // True if reviewer actually purchased the artwork
  },
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  helpfulCount: {
    type: Number,
    default: 0
  },
  reported: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to ensure one review per user per artwork
reviewSchema.index({ artwork: 1, reviewer: 1 }, { unique: true });

// Index for sorting
reviewSchema.index({ artwork: 1, createdAt: -1 });
reviewSchema.index({ artwork: 1, helpfulCount: -1 });
reviewSchema.index({ artwork: 1, rating: -1 });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(artworkId) {
  try {
    const result = await this.aggregate([
      { $match: { artwork: mongoose.Types.ObjectId(artworkId) } },
      {
        $group: {
          _id: '$artwork',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    if (result.length > 0) {
      // Calculate rating distribution
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      result[0].ratingDistribution.forEach(rating => {
        distribution[rating] = (distribution[rating] || 0) + 1;
      });

      return {
        averageRating: Math.round(result[0].averageRating * 10) / 10,
        totalReviews: result[0].totalReviews,
        distribution: distribution
      };
    }

    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  } catch (error) {
    console.error('Error calculating average rating:', error);
    throw error;
  }
};

module.exports = mongoose.model('Review', reviewSchema);
