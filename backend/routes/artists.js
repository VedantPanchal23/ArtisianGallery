const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get artist profile
router.get('/:id', auth.authenticateToken, async (req, res) => {
  try {
    const artist = await User.findById(req.params.id).select('-password');
    
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    // Check if user is an artist
    if (artist.role !== 'artist' && artist.userType !== 'artist') {
      return res.status(403).json({
        success: false,
        message: 'User is not an artist'
      });
    }

    res.json({
      success: true,
      artist: {
        id: artist._id,
        name: artist.name || artist.username,
        title: artist.title || 'Visual Storyteller & Digital Dreamweaver',
        bio: artist.bio || 'I create vibrant, surreal digital artworks that blur the lines between reality and intricate fantasy landscapes. My work explores themes of nature, technology, and human emotion.',
        followers: artist.followers || '12,600',
        following: artist.following || '160',
        profileImage: artist.profileImage || null,
        email: artist.email,
        createdAt: artist.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching artist profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get artist artworks
router.get('/:id/artworks', auth.authenticateToken, async (req, res) => {
  try {
    // Mock data for now - replace with actual artwork model when implemented
    const mockArtworks = [
      {
        id: 1,
        title: 'Echoes of Eldoria',
        category: 'Digital Art',
        price: 250.00,
        likes: 1230,
        image: '/api/placeholder/300/400',
        description: 'Mystical forest scene with ethereal lighting',
        createdAt: new Date()
      },
      {
        id: 2,
        title: 'Quantum Bloom',
        category: 'Abstract',
        price: 180.00,
        likes: 860,
        image: '/api/placeholder/300/400',
        description: 'Abstract representation of quantum mechanics',
        createdAt: new Date()
      },
      {
        id: 3,
        title: 'Skyscape Metropolis',
        category: 'Urban Fantasy',
        price: 320.00,
        likes: 1500,
        image: '/api/placeholder/300/400',
        description: 'Futuristic cityscape at golden hour',
        createdAt: new Date()
      },
      {
        id: 4,
        title: 'Floral Muse',
        category: 'Portrait',
        price: 210.00,
        likes: 920,
        image: '/api/placeholder/300/400',
        description: 'Portrait with floral elements',
        createdAt: new Date()
      },
      {
        id: 5,
        title: 'Chromatic Ascent',
        category: 'Abstract',
        price: 195.00,
        likes: 750,
        image: '/api/placeholder/300/400',
        description: 'Vibrant color composition',
        createdAt: new Date()
      },
      {
        id: 6,
        title: 'Neon Horizon',
        category: 'Cyberpunk',
        price: 280.00,
        likes: 1100,
        image: '/api/placeholder/300/400',
        description: 'Neon-lit urban landscape',
        createdAt: new Date()
      },
      {
        id: 7,
        title: "Dragon's Fury",
        category: 'Fantasy',
        price: 350.00,
        likes: 1800,
        image: '/api/placeholder/300/400',
        description: 'Epic dragon battle scene',
        createdAt: new Date()
      },
      {
        id: 8,
        title: 'Zen Garden',
        category: 'Nature',
        price: 200.00,
        likes: 680,
        image: '/api/placeholder/300/400',
        description: 'Peaceful cherry blossom garden',
        createdAt: new Date()
      }
    ];

    res.json({
      success: true,
      artworks: mockArtworks
    });
  } catch (error) {
    console.error('Error fetching artist artworks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get artist earnings
router.get('/:id/earnings', auth.authenticateToken, async (req, res) => {
  try {
    // Mock data for now - replace with actual earnings calculation when implemented
    const mockEarnings = {
      totalEarnings: 12346.67,
      monthlyRevenue: 1234.50,
      artworksSold: 87
    };

    res.json({
      success: true,
      earnings: mockEarnings
    });
  } catch (error) {
    console.error('Error fetching artist earnings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update artist profile
router.put('/:id', auth.authenticateToken, async (req, res) => {
  try {
    const { name, title, bio, profileImage } = req.body;
    
    // Check if user is updating their own profile
    const userId = req.user._id || req.user.id;
    if (userId.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    const updatedArtist = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        title,
        bio,
        profileImage
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedArtist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    res.json({
      success: true,
      artist: updatedArtist
    });
  } catch (error) {
    console.error('Error updating artist profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;