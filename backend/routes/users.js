var express = require('express');
var router = express.Router();
var User = require('../models/User');
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
router.get('/purchased', authenticateToken, async function(req, res, next) {
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

module.exports = router;
