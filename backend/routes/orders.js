var express = require('express');
var router = express.Router();
var Transaction = require('../models/Transaction');
var Artwork = require('../models/Artwork');
var User = require('../models/User');
var Notification = require('../models/Notification');
var { authenticateToken } = require('../middleware/auth');
var { sendPurchaseConfirmationEmail, sendSaleNotificationEmail } = require('../utils/emailService');

// POST /api/v1/orders - Create new order (mock payment)
router.post('/', authenticateToken, async function(req, res, next) {
  try {
    var { cart, billingAddress, cardDetails } = req.body;

    // Validate cart
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      console.error('Order validation failed: Cart is empty or invalid', { cart });
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate billing address
    if (!billingAddress || !billingAddress.fullName || !billingAddress.address) {
      console.error('Order validation failed: Billing address invalid', { billingAddress });
      return res.status(400).json({
        success: false,
        message: 'Billing address is required'
      });
    }

    // Validate card details (mock validation)
    if (!cardDetails || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
      console.error('Order validation failed: Card details invalid', { 
        hasCardDetails: !!cardDetails,
        hasCardNumber: !!cardDetails?.cardNumber,
        hasExpiryDate: !!cardDetails?.expiryDate,
        hasCvv: !!cardDetails?.cvv
      });
      return res.status(400).json({
        success: false,
        message: 'Card details are required'
      });
    }

    // Fetch artworks from database to verify prices
    var artworkIds = cart.map(item => item._id);
    var artworks = await Artwork.find({ 
      _id: { $in: artworkIds },
      status: 'approved',
      isActive: true
    });

    if (artworks.length !== cart.length) {
      return res.status(400).json({
        success: false,
        message: 'Some artworks are no longer available'
      });
    }

    // Calculate total and prepare artwork data
    var totalAmount = 0;
    var artworkData = [];

    for (var i = 0; i < artworks.length; i++) {
      var artwork = artworks[i];
      totalAmount += artwork.price;
      
      artworkData.push({
        artwork: artwork._id,
        title: artwork.title,
        price: artwork.price,
        currency: artwork.currency,
        imageUrl: artwork.thumbnailUrl || artwork.imageUrl,
        artistId: artwork.artist,
        artistName: artwork.artistName,
        quantity: 1
      });
    }

    // Generate transaction ID
    var transactionId = Transaction.generateTransactionId();

    // Create transaction
    var transaction = new Transaction({
      buyer: req.user._id,
      buyerName: req.user.name,
      buyerEmail: req.user.email,
      artworks: artworkData,
      totalAmount: totalAmount,
      currency: 'INR',
      paymentMethod: 'mock',
      paymentStatus: 'completed',
      transactionId: transactionId,
      billingAddress: billingAddress,
      cardDetails: {
        cardNumber: '**** **** **** ' + cardDetails.cardNumber.slice(-4),
        cardType: cardDetails.cardType || 'VISA'
      },
      status: 'completed'
    });

    await transaction.save();

    // Update artwork sales counts and user's purchased artworks
    var artistIds = new Set();
    for (var j = 0; j < artworks.length; j++) {
      var artworkToUpdate = artworks[j];
      await Artwork.findByIdAndUpdate(artworkToUpdate._id, {
        $inc: { salesCount: 1 }
      });
      artistIds.add(artworkToUpdate.artist.toString());
    }

    // Add to user's purchased artworks
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { 
        purchasedArtworks: { $each: artworkIds }
      }
    });

    // Create notifications for buyer
    await Notification.createNotification({
      recipient: req.user._id,
      type: 'order_placed',
      title: 'Order Confirmed',
      message: `Your order of ${artworks.length} artwork(s) has been confirmed!`,
      relatedTransaction: transaction._id
    });

    // Create notifications for each artist
    for (var artistId of artistIds) {
      var artistArtworks = artworks.filter(a => a.artist.toString() === artistId);
      await Notification.createNotification({
        recipient: artistId,
        type: 'artwork_purchased',
        title: 'Artwork Sold',
        message: `${req.user.name} purchased ${artistArtworks.length} of your artwork(s)!`,
        relatedTransaction: transaction._id
      });
    }

    // Send emails asynchronously (don't wait for them to complete)
    // Send purchase confirmation to buyer
    sendPurchaseConfirmationEmail(req.user.email, req.user.name, {
      transactionId: transaction.transactionId,
      totalAmount: transaction.totalAmount,
      currency: transaction.currency,
      artworks: artworkData,
      createdAt: transaction.createdAt
    }).then(function(result) {
      console.log('✅ Purchase confirmation email queued for:', req.user.email);
    }).catch(function(error) {
      console.error('❌ Failed to send purchase confirmation email:', error.message);
    });

    // Send sale notifications to artists
    for (var artistId of artistIds) {
      var artistArtworks = artworks.filter(a => a.artist.toString() === artistId);
      var artist = await User.findById(artistId).select('email name');
      
      if (artist && artist.email) {
        sendSaleNotificationEmail(artist.email, artist.name, {
          buyerName: req.user.name,
          artworkCount: artistArtworks.length
        }).then(function(result) {
          console.log('✅ Sale notification email queued for:', artist.email);
        }).catch(function(error) {
          console.error('❌ Failed to send sale notification email:', error.message);
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      transaction: {
        _id: transaction._id,
        transactionId: transaction.transactionId,
        totalAmount: transaction.totalAmount,
        currency: transaction.currency,
        artworks: transaction.artworks,
        createdAt: transaction.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing order',
      error: error.message
    });
  }
});

// GET /api/v1/orders - Get user's order history
router.get('/', authenticateToken, async function(req, res, next) {
  try {
    var page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 10;
    var skip = (page - 1) * limit;

    var transactions = await Transaction.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('artworks.artwork', 'title imageUrl thumbnailUrl')
      .lean();

    var total = await Transaction.countDocuments({ buyer: req.user._id });

    res.status(200).json({
      success: true,
      transactions: transactions,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// GET /api/v1/orders/:id - Get single order details
router.get('/:id', authenticateToken, async function(req, res, next) {
  try {
    var transaction = await Transaction.findById(req.params.id)
      .populate('artworks.artwork', 'title imageUrl thumbnailUrl description')
      .lean();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user owns this transaction
    if (transaction.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      transaction: transaction
    });

  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction',
      error: error.message
    });
  }
});

// GET /api/v1/orders/check/:artworkId - Check if user has purchased an artwork
router.get('/check/:artworkId', authenticateToken, async function(req, res, next) {
  try {
    var hasPurchased = await Transaction.hasPurchased(req.user._id, req.params.artworkId);
    
    res.status(200).json({
      success: true,
      hasPurchased: hasPurchased
    });

  } catch (error) {
    console.error('Error checking purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking purchase',
      error: error.message
    });
  }
});

// GET /api/v1/orders/download/:artworkId - Generate secure download link for purchased artwork
router.get('/download/:artworkId', authenticateToken, async function(req, res, next) {
  try {
    var artworkId = req.params.artworkId;
    var userId = req.user._id;

    // Check if user has purchased this artwork
    var hasPurchased = await Transaction.hasPurchased(userId, artworkId);
    
    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: 'You have not purchased this artwork'
      });
    }

    // Get artwork details
    var artwork = await Artwork.findById(artworkId);
    
    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    // Generate time-limited download token (valid for 1 hour)
    var jwt = require('jsonwebtoken');
    var downloadToken = jwt.sign(
      { 
        userId: userId,
        artworkId: artworkId,
        type: 'download'
      },
      process.env.JWT_SECRET || 'arthive_secret_key',
      { expiresIn: '1h' }
    );

    // Generate secure download URL
    var downloadUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/api/download/${artworkId}?token=${downloadToken}`;

    res.status(200).json({
      success: true,
      downloadUrl: downloadUrl,
      expiresIn: '1 hour',
      artwork: {
        title: artwork.title,
        imageUrl: artwork.imageUrl
      }
    });

  } catch (error) {
    console.error('Error generating download link:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating download link',
      error: error.message
    });
  }
});

module.exports = router;
