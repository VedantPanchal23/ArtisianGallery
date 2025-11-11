var express = require('express');
var router = express.Router();
var Review = require('../models/Review');
var Artwork = require('../models/Artwork');
var Transaction = require('../models/Transaction');
var { authenticateToken } = require('../middleware/auth');

/* POST /api/v1/reviews - Create a review */
router.post('/', authenticateToken, async function(req, res, next) {
  try {
    var { artworkId, rating, comment } = req.body;

    // Validate input
    if (!artworkId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Artwork ID, rating, and comment are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if artwork exists
    var artwork = await Artwork.findById(artworkId);
    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    // Check if user already reviewed this artwork
    var existingReview = await Review.findOne({
      artwork: artworkId,
      reviewer: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this artwork'
      });
    }

    // Check if user purchased this artwork (for verified badge)
    var hasPurchased = await Transaction.hasPurchased(req.user._id, artworkId);

    // Create review
    var review = new Review({
      artwork: artworkId,
      reviewer: req.user._id,
      reviewerName: req.user.name,
      rating: rating,
      comment: comment,
      verified: hasPurchased
    });

    await review.save();

    // Update artwork's average rating
    var ratingStats = await Review.calculateAverageRating(artworkId);
    artwork.averageRating = ratingStats.averageRating;
    artwork.totalReviews = ratingStats.totalReviews;
    await artwork.save();

    // Populate reviewer info
    await review.populate('reviewer', 'name username avatarUrl');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review: review,
      ratingStats: ratingStats
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* GET /api/v1/reviews/artwork/:artworkId - Get reviews for an artwork */
router.get('/artwork/:artworkId', async function(req, res, next) {
  try {
    var { page = 1, limit = 10, sort = 'recent' } = req.query;
    var skip = (parseInt(page) - 1) * parseInt(limit);

    var sortOption = {};
    switch (sort) {
      case 'helpful':
        sortOption = { helpfulCount: -1, createdAt: -1 };
        break;
      case 'rating_high':
        sortOption = { rating: -1, createdAt: -1 };
        break;
      case 'rating_low':
        sortOption = { rating: 1, createdAt: -1 };
        break;
      default: // 'recent'
        sortOption = { createdAt: -1 };
    }

    var reviews = await Review.find({ artwork: req.params.artworkId })
      .populate('reviewer', 'name username avatarUrl')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    var totalCount = await Review.countDocuments({ artwork: req.params.artworkId });
    var ratingStats = await Review.calculateAverageRating(req.params.artworkId);

    res.status(200).json({
      success: true,
      reviews: reviews,
      ratingStats: ratingStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* PUT /api/v1/reviews/:id - Update a review */
router.put('/:id', authenticateToken, async function(req, res, next) {
  try {
    var { rating, comment } = req.body;

    var review = await Review.findOne({
      _id: req.params.id,
      reviewer: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized'
      });
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }
      review.rating = rating;
    }

    if (comment) {
      review.comment = comment;
    }

    await review.save();

    // Update artwork's average rating
    var ratingStats = await Review.calculateAverageRating(review.artwork);
    await Artwork.findByIdAndUpdate(review.artwork, {
      averageRating: ratingStats.averageRating,
      totalReviews: ratingStats.totalReviews
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review: review
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* DELETE /api/v1/reviews/:id - Delete a review */
router.delete('/:id', authenticateToken, async function(req, res, next) {
  try {
    var review = await Review.findOne({
      _id: req.params.id,
      reviewer: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized'
      });
    }

    var artworkId = review.artwork;
    await review.deleteOne();

    // Update artwork's average rating
    var ratingStats = await Review.calculateAverageRating(artworkId);
    await Artwork.findByIdAndUpdate(artworkId, {
      averageRating: ratingStats.averageRating,
      totalReviews: ratingStats.totalReviews
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* POST /api/v1/reviews/:id/helpful - Mark review as helpful */
router.post('/:id/helpful', authenticateToken, async function(req, res, next) {
  try {
    var review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if already marked as helpful
    var alreadyMarked = review.helpful.includes(req.user._id);

    if (alreadyMarked) {
      // Remove from helpful
      review.helpful = review.helpful.filter(id => id.toString() !== req.user._id.toString());
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      // Add to helpful
      review.helpful.push(req.user._id);
      review.helpfulCount += 1;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: alreadyMarked ? 'Removed from helpful' : 'Marked as helpful',
      helpfulCount: review.helpfulCount,
      isHelpful: !alreadyMarked
    });

  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
