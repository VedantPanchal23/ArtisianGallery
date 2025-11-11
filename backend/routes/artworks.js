var express = require('express');
var router = express.Router();
var Artwork = require('../models/Artwork');
var User = require('../models/User');
var Notification = require('../models/Notification');
var { authenticateToken, optionalAuth } = require('../middleware/auth');
var { uploadArtworkImage } = require('../utils/cloudinaryService');

// Use auth as alias for authenticateToken
var auth = authenticateToken;

// Validation functions
const validateArtworkData = (data) => {
  var { title, description, price, category } = data;
  
  if (!title || title.length < 3 || title.length > 100) {
    return 'Title must be between 3 and 100 characters';
  }
  
  if (!description || description.length < 10 || description.length > 2000) {
    return 'Description must be between 10 and 2000 characters';
  }
  
  if (!price || price < 0) {
    return 'Price must be a positive number';
  }
  
  if (!category) {
    return 'Category is required';
  }
  
  var validCategories = ['abstract', 'landscape', 'portrait', 'digital', 'photography', 'illustration', '3d', 'painting', 'nature', 'urban', 'space', 'other'];
  if (!validCategories.includes(category)) {
    return 'Invalid category';
  }
  
  return null;
};

// POST /api/v1/artworks - Create new artwork (Artist only)
router.post('/', auth, async function(req, res, next) {
  try {
    // Check if user is artist
    if (req.user.role !== 'artist' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only artists can upload artworks'
      });
    }

    // Validate artwork data
    var validationError = validateArtworkData(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    var { title, description, price, currency, category, tags, imageUrl, thumbnailUrl, dimensions, fileSize } = req.body;

    // Determine initial status based on environment variable
    // AUTO_APPROVE_ARTWORKS=true (default) - artworks are approved immediately
    // AUTO_APPROVE_ARTWORKS=false - artworks require admin approval
    var autoApprove = process.env.AUTO_APPROVE_ARTWORKS !== 'false';
    var initialStatus = autoApprove ? 'approved' : 'pending';

    // Create artwork
    var artwork = new Artwork({
      title: title,
      description: description,
      price: price,
      currency: currency || 'INR',
      imageUrl: imageUrl,
      thumbnailUrl: thumbnailUrl || imageUrl,
      artist: req.user._id,
      artistName: req.user.name,
      category: category,
      tags: tags || [],
      dimensions: dimensions || {},
      fileSize: fileSize || 0,
      status: initialStatus
    });

    await artwork.save();

    // Add to user's uploaded artworks
    await User.findByIdAndUpdate(req.user._id, {
      $push: { uploadedArtworks: artwork._id }
    });

    var message = initialStatus === 'approved' 
      ? 'Artwork uploaded and published successfully'
      : 'Artwork uploaded successfully and pending admin approval';

    res.status(201).json({
      success: true,
      message: message,
      artwork: artwork
    });

  } catch (error) {
    console.error('Error creating artwork:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading artwork',
      error: error.message
    });
  }
});

// POST /api/v1/artworks/upload-image - Upload artwork image
router.post('/upload-image', auth, function(req, res, next) {
  // Check if user is artist
  if (req.user.role !== 'artist' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only artists can upload artwork images'
    });
  }

  uploadArtworkImage(req, res, function(error) {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error uploading image'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Get image URL
    var imageUrl = req.file.path || `/uploads/artworks/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      thumbnailUrl: imageUrl,
      file: {
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  });
});

// GET /api/v1/artworks - List artworks with filters and pagination
router.get('/', optionalAuth, async function(req, res, next) {
  try {
    var { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      sort, 
      page = 1, 
      limit = 12,
      status = 'approved',
      artist
    } = req.query;

    // Build query
    var query = { isActive: true };

    // Only show approved artworks for non-admin users
    if (status === 'approved' || !req.user || req.user.role !== 'admin') {
      query.status = 'approved';
    } else if (status) {
      query.status = status;
    }

    // Search by title, description, or tags
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by artist
    if (artist) {
      query.artist = artist;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    var sortOption = {};
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'popular':
        sortOption = { likesCount: -1, salesCount: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    // Pagination
    var pageNum = parseInt(page);
    var limitNum = parseInt(limit);
    var skip = (pageNum - 1) * limitNum;

    // Execute query
    var artworks = await Artwork.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate('artist', 'name username email avatarUrl bio')
      .lean();

    // Get total count for pagination
    var total = await Artwork.countDocuments(query);

    res.status(200).json({
      success: true,
      artworks: artworks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching artworks',
      error: error.message
    });
  }
});

// GET /api/v1/artworks/:id - Get single artwork details
router.get('/:id', optionalAuth, async function(req, res, next) {
  try {
    var artwork = await Artwork.findById(req.params.id)
      .populate('artist', 'name username email avatarUrl bio')
      .lean();

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    // Check if artwork is approved or user is artist/admin
    if (artwork.status !== 'approved') {
      if (!req.user || (req.user.role !== 'admin' && req.user._id.toString() !== artwork.artist._id.toString())) {
        return res.status(403).json({
          success: false,
          message: 'This artwork is not yet approved'
        });
      }
    }

    // Increment view count only if 'count_view' query param is present
    // This allows fetching artwork data without incrementing views
    if (req.query.count_view === 'true') {
      await Artwork.findByIdAndUpdate(req.params.id, {
        $inc: { viewsCount: 1 }
      });
      // Update the artwork object to reflect the new view count
      artwork.viewsCount = (artwork.viewsCount || 0) + 1;
    }

    // Check if user has liked or favorited
    if (req.user) {
      artwork.isLiked = artwork.likes.some(id => id.toString() === req.user._id.toString());
      artwork.isFavorited = artwork.favorites.some(id => id.toString() === req.user._id.toString());
    }

    res.status(200).json({
      success: true,
      artwork: artwork
    });

  } catch (error) {
    console.error('Error fetching artwork:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching artwork',
      error: error.message
    });
  }
});

// PUT /api/v1/artworks/:id - Update artwork (Artist owner or Admin)
router.put('/:id', auth, async function(req, res, next) {
  try {
    var artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    // Check permission
    if (req.user.role !== 'admin' && artwork.artist.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this artwork'
      });
    }

    // Validate if updating
    if (req.body.title || req.body.description || req.body.price || req.body.category) {
      var validationError = validateArtworkData({
        title: req.body.title || artwork.title,
        description: req.body.description || artwork.description,
        price: req.body.price || artwork.price,
        category: req.body.category || artwork.category
      });

      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError
        });
      }
    }

    // Update fields
    var allowedUpdates = ['title', 'description', 'price', 'currency', 'category', 'tags', 'imageUrl', 'thumbnailUrl'];
    allowedUpdates.forEach(function(field) {
      if (req.body[field] !== undefined) {
        artwork[field] = req.body[field];
      }
    });

    // If artwork was rejected and now being updated, reset status to pending
    if (artwork.status === 'rejected') {
      artwork.status = 'pending';
      artwork.rejectionReason = '';
    }

    await artwork.save();

    res.status(200).json({
      success: true,
      message: 'Artwork updated successfully',
      artwork: artwork
    });

  } catch (error) {
    console.error('Error updating artwork:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating artwork',
      error: error.message
    });
  }
});

// DELETE /api/v1/artworks/:id - Delete artwork (Artist owner or Admin)
router.delete('/:id', auth, async function(req, res, next) {
  try {
    var artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    // Check permission
    if (req.user.role !== 'admin' && artwork.artist.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this artwork'
      });
    }

    // Soft delete (set isActive to false)
    artwork.isActive = false;
    await artwork.save();

    // Remove from user's uploaded artworks
    await User.findByIdAndUpdate(artwork.artist, {
      $pull: { uploadedArtworks: artwork._id }
    });

    res.status(200).json({
      success: true,
      message: 'Artwork deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting artwork',
      error: error.message
    });
  }
});

// POST /api/v1/artworks/:id/like - Toggle like
router.post('/:id/like', auth, async function(req, res, next) {
  try {
    var artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    var userId = req.user._id;
    var hasLiked = artwork.likes.includes(userId);

    if (hasLiked) {
      // Unlike
      artwork.likes = artwork.likes.filter(id => id.toString() !== userId.toString());
      artwork.likesCount = Math.max(0, artwork.likesCount - 1);
    } else {
      // Like
      artwork.likes.push(userId);
      artwork.likesCount += 1;

      // Create notification for the artist (only on like, not unlike)
      if (userId.toString() !== artwork.artist.toString()) {
        await Notification.createNotification({
          recipient: artwork.artist,
          type: 'artwork_liked',
          title: 'Artwork Liked',
          message: `${req.user.name} liked your artwork "${artwork.title}"`,
          relatedArtwork: artwork._id,
          relatedUser: userId
        });
      }
    }

    await artwork.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? 'Artwork unliked' : 'Artwork liked',
      isLiked: !hasLiked,
      likesCount: artwork.likesCount
    });

  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message
    });
  }
});

// POST /api/v1/artworks/:id/favorite - Toggle favorite
router.post('/:id/favorite', auth, async function(req, res, next) {
  try {
    var artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    var userId = req.user._id;
    var hasFavorited = artwork.favorites.includes(userId);

    if (hasFavorited) {
      // Remove from favorites
      artwork.favorites = artwork.favorites.filter(id => id.toString() !== userId.toString());
      artwork.favoritesCount = Math.max(0, artwork.favoritesCount - 1);
    } else {
      // Add to favorites
      artwork.favorites.push(userId);
      artwork.favoritesCount += 1;
    }

    await artwork.save();

    res.status(200).json({
      success: true,
      message: hasFavorited ? 'Removed from favorites' : 'Added to favorites',
      isFavorited: !hasFavorited,
      favoritesCount: artwork.favoritesCount
    });

  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling favorite',
      error: error.message
    });
  }
});

module.exports = router;
