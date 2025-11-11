var express = require('express');
var router = express.Router();
var Notification = require('../models/Notification');
var { authenticateToken } = require('../middleware/auth');

/* GET /api/v1/notifications - Get user's notifications */
router.get('/', authenticateToken, async function(req, res, next) {
  try {
    var { page = 1, limit = 20, unread } = req.query;
    var skip = (parseInt(page) - 1) * parseInt(limit);

    var query = { recipient: req.user._id };
    
    if (unread === 'true') {
      query.isRead = false;
    }

    var notifications = await Notification.find(query)
      .populate('sender', 'name username avatarUrl')
      .populate('relatedArtwork', 'title thumbnailUrl imageUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    var totalCount = await Notification.countDocuments(query);
    var unreadCount = await Notification.getUnreadCount(req.user._id);

    res.status(200).json({
      success: true,
      notifications: notifications,
      unreadCount: unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* PUT /api/v1/notifications/:id/read - Mark notification as read */
router.put('/:id/read', authenticateToken, async function(req, res, next) {
  try {
    var notification = await Notification.markAsRead(req.params.id, req.user._id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      notification: notification
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* PUT /api/v1/notifications/read-all - Mark all notifications as read */
router.put('/read-all', authenticateToken, async function(req, res, next) {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* DELETE /api/v1/notifications/:id - Delete notification */
router.delete('/:id', authenticateToken, async function(req, res, next) {
  try {
    var notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* GET /api/v1/notifications/unread-count - Get unread notifications count */
router.get('/unread-count', authenticateToken, async function(req, res, next) {
  try {
    var count = await Notification.getUnreadCount(req.user._id);

    res.status(200).json({
      success: true,
      count: count
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
