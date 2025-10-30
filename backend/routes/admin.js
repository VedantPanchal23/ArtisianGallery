var express = require('express');
var router = express.Router();
var { authenticateToken, authorizeRole } = require('../middleware/auth');
var Artwork = require('../models/Artwork');
var User = require('../models/User');
var Transaction = require('../models/Transaction');

// Middleware to ensure only admin can access these routes
router.use(authenticateToken);
router.use(authorizeRole('admin'));

/**
 * GET /api/v1/admin/artworks/pending
 * Get all pending artworks for approval
 */
router.get('/artworks/pending', async (req, res) => {
  try {
    var { page = 1, limit = 20 } = req.query;
    var skip = (parseInt(page) - 1) * parseInt(limit);

    var artworks = await Artwork.find({ status: 'pending', isActive: true })
      .populate('artist', 'name email username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    var totalArtworks = await Artwork.countDocuments({ status: 'pending', isActive: true });
    var totalPages = Math.ceil(totalArtworks / parseInt(limit));

    res.json({
      success: true,
      artworks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalArtworks,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching pending artworks:', error);
    res.status(500).json({ error: 'Failed to fetch pending artworks' });
  }
});

/**
 * GET /api/v1/admin/artworks/all
 * Get all artworks with filters
 */
router.get('/artworks/all', async (req, res) => {
  try {
    var { status, page = 1, limit = 20, search } = req.query;
    var skip = (parseInt(page) - 1) * parseInt(limit);

    var query = { isActive: true };
    
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$text = { $search: search };
    }

    var artworks = await Artwork.find(query)
      .populate('artist', 'name email username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    var totalArtworks = await Artwork.countDocuments(query);
    var totalPages = Math.ceil(totalArtworks / parseInt(limit));

    res.json({
      success: true,
      artworks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalArtworks,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({ error: 'Failed to fetch artworks' });
  }
});

/**
 * PUT /api/v1/admin/artworks/:id/approve
 * Approve an artwork
 */
router.put('/artworks/:id/approve', async (req, res) => {
  try {
    var artworkId = req.params.id;
    var adminId = req.user.id;

    var artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    if (artwork.status === 'approved') {
      return res.status(400).json({ error: 'Artwork is already approved' });
    }

    artwork.status = 'approved';
    artwork.approvedBy = adminId;
    artwork.approvedAt = new Date();
    artwork.rejectionReason = undefined;

    await artwork.save();

    // Populate artist info for response
    await artwork.populate('artist', 'name email username');

    res.json({
      success: true,
      message: 'Artwork approved successfully',
      artwork
    });
  } catch (error) {
    console.error('Error approving artwork:', error);
    res.status(500).json({ error: 'Failed to approve artwork' });
  }
});

/**
 * PUT /api/v1/admin/artworks/:id/reject
 * Reject an artwork with reason
 */
router.put('/artworks/:id/reject', async (req, res) => {
  try {
    var artworkId = req.params.id;
    var { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    var artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    if (artwork.status === 'rejected') {
      return res.status(400).json({ error: 'Artwork is already rejected' });
    }

    artwork.status = 'rejected';
    artwork.rejectionReason = reason;
    artwork.approvedBy = undefined;
    artwork.approvedAt = undefined;

    await artwork.save();

    // Populate artist info for response
    await artwork.populate('artist', 'name email username');

    res.json({
      success: true,
      message: 'Artwork rejected successfully',
      artwork
    });
  } catch (error) {
    console.error('Error rejecting artwork:', error);
    res.status(500).json({ error: 'Failed to reject artwork' });
  }
});

/**
 * GET /api/v1/admin/users
 * Get all users with pagination
 */
router.get('/users', async (req, res) => {
  try {
    var { page = 1, limit = 20, role, search } = req.query;
    var skip = (parseInt(page) - 1) * parseInt(limit);

    var query = {};
    
    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    var users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    var totalUsers = await User.countDocuments(query);
    var totalPages = Math.ceil(totalUsers / parseInt(limit));

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * PUT /api/v1/admin/users/:id/block
 * Block or unblock a user
 */
router.put('/users/:id/block', async (req, res) => {
  try {
    var userId = req.params.id;
    var { block } = req.body; // true to block, false to unblock

    if (typeof block !== 'boolean') {
      return res.status(400).json({ error: 'Block status must be a boolean' });
    }

    var user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot block admin users' });
    }

    user.isBlocked = block;
    await user.save();

    res.json({
      success: true,
      message: block ? 'User blocked successfully' : 'User unblocked successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user block status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

/**
 * GET /api/v1/admin/analytics
 * Get platform analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    // Total counts
    var totalUsers = await User.countDocuments();
    var totalArtists = await User.countDocuments({ role: 'artist' });
    var totalArtworks = await Artwork.countDocuments({ isActive: true });
    var totalSales = await Transaction.countDocuments({ paymentStatus: 'completed' });
    
    // Artwork by status
    var pendingArtworks = await Artwork.countDocuments({ status: 'pending', isActive: true });
    var approvedArtworks = await Artwork.countDocuments({ status: 'approved', isActive: true });
    var rejectedArtworks = await Artwork.countDocuments({ status: 'rejected', isActive: true });

    // Calculate total revenue
    var revenueData = await Transaction.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { 
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    var totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Top selling artworks
    var topArtworks = await Artwork.find({ isActive: true })
      .sort({ salesCount: -1 })
      .limit(5)
      .populate('artist', 'name username')
      .select('title price currency salesCount imageUrl');

    // Top artists by sales
    var topArtists = await Artwork.aggregate([
      { $match: { isActive: true, salesCount: { $gt: 0 } } },
      {
        $group: {
          _id: '$artist',
          totalSales: { $sum: '$salesCount' },
          totalArtworks: { $sum: 1 }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 }
    ]);

    // Populate artist details
    await User.populate(topArtists, { path: '_id', select: 'name username email' });

    // Recent transactions
    var recentTransactions = await Transaction.find({ paymentStatus: 'completed' })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('buyer', 'name email')
      .select('transactionId totalAmount currency createdAt buyerName');

    // Category distribution
    var categoryDistribution = await Artwork.aggregate([
      { $match: { isActive: true, status: 'approved' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      analytics: {
        overview: {
          totalUsers,
          totalArtists,
          totalArtworks,
          totalSales,
          totalRevenue,
          pendingArtworks,
          approvedArtworks,
          rejectedArtworks
        },
        topArtworks,
        topArtists,
        recentTransactions,
        categoryDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

/**
 * DELETE /api/v1/admin/artworks/:id
 * Permanently delete an artwork (admin only)
 */
router.delete('/artworks/:id', async (req, res) => {
  try {
    var artworkId = req.params.id;

    var artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    // Check if artwork has sales
    if (artwork.salesCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete artwork with sales. Consider rejecting instead.' 
      });
    }

    await Artwork.findByIdAndDelete(artworkId);

    res.json({
      success: true,
      message: 'Artwork deleted permanently'
    });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({ error: 'Failed to delete artwork' });
  }
});

module.exports = router;
