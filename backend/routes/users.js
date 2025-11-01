var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Notification = require('../models/Notification');
var { authenticateToken } = require('../middleware/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET user profile - Protected route */
router.get('/profile', authenticateToken, async function(req, res, next) {
  try {
    var userId = req.user._id;
    
    var user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: user
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* PUT update user profile - Protected route */
router.put('/profile', authenticateToken, async function(req, res, next) {
  try {
    var userId = req.user._id;
    var { name, email, bio } = req.body;
    
    // Find user
    var user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      var existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
      user.email = email;
    }
    
    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    
    await user.save();
    
    // Return updated user without password
    var updatedUser = user.toObject();
    delete updatedUser.password;
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* GET user's purchased artworks - Protected route */
router.get('/purchased-artworks', authenticateToken, async function(req, res, next) {
  try {
    var userId = req.user._id;
    
    var user = await User.findById(userId).populate('purchasedArtworks');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      artworks: user.purchasedArtworks
    });
    
  } catch (error) {
    console.error('Get purchased artworks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* POST /api/v1/users/:userId/follow - Follow an artist */
router.post('/:userId/follow', authenticateToken, async function(req, res, next) {
  try {
    var currentUserId = req.user._id;
    var targetUserId = req.params.userId;

    // Can't follow yourself
    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    // Check if target user exists and is an artist
    var targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get current user
    var currentUser = await User.findById(currentUserId);

    // Check if already following
    var isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user'
      });
    }

    // Add to following/followers
    currentUser.following.push(targetUserId);
    currentUser.followingCount += 1;
    targetUser.followers.push(currentUserId);
    targetUser.followersCount += 1;

    await currentUser.save();
    await targetUser.save();

    // Create notification for the followed user
    await Notification.createNotification({
      recipient: targetUserId,
      type: 'new_follower',
      title: 'New Follower',
      message: `${currentUser.name} started following you`,
      relatedUser: currentUserId
    });

    res.status(200).json({
      success: true,
      message: 'Successfully followed user',
      isFollowing: true,
      followersCount: targetUser.followersCount
    });

  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* POST /api/v1/users/:userId/unfollow - Unfollow an artist */
router.post('/:userId/unfollow', authenticateToken, async function(req, res, next) {
  try {
    var currentUserId = req.user._id;
    var targetUserId = req.params.userId;

    var currentUser = await User.findById(currentUserId);
    var targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if following
    var isFollowing = currentUser.following.includes(targetUserId);

    if (!isFollowing) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this user'
      });
    }

    // Remove from following/followers
    currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
    currentUser.followingCount = Math.max(0, currentUser.followingCount - 1);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId.toString());
    targetUser.followersCount = Math.max(0, targetUser.followersCount - 1);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unfollowed user',
      isFollowing: false,
      followersCount: targetUser.followersCount
    });

  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* GET /api/v1/users/:userId/followers - Get user's followers */
router.get('/:userId/followers', async function(req, res, next) {
  try {
    var user = await User.findById(req.params.userId)
      .populate('followers', 'name username avatarUrl bio role')
      .select('followers followersCount');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      followers: user.followers,
      count: user.followersCount
    });

  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* GET /api/v1/users/:userId/following - Get user's following */
router.get('/:userId/following', async function(req, res, next) {
  try {
    var user = await User.findById(req.params.userId)
      .populate('following', 'name username avatarUrl bio role')
      .select('following followingCount');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      following: user.following,
      count: user.followingCount
    });

  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
