var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/User');

// Simple validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRegisterData = (data) => {
  const { name, username, email, password, confirmPassword } = data;
  
  if (!name || name.length < 2 || name.length > 50) {
    return 'Name must be between 2 and 50 characters';
  }
  
  if (!username || username.length < 3 || username.length > 30) {
    return 'Username must be between 3 and 30 characters';
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return 'Username must contain only alphanumeric characters';
  }
  
  if (!email || !validateEmail(email)) {
    return 'Please provide a valid email address';
  }
  
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

const validateLoginData = (data) => {
  const { username, password } = data;
  
  if (!username) {
    return 'Username is required';
  }
  
  if (!password) {
    return 'Password is required';
  }
  
  return null;
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId },
    'arthive_secret_key',
    { expiresIn: '7d' }
  );
};

// POST /api/v1/auth/register
router.post('/register', async function(req, res, next) {
  try {
    // Validate request body
    const validationError = validateRegisterData(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const { name, username, email, password, mobile, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      username,
      email,
      password,
      role
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user,
      token: token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/v1/auth/login
router.post('/login', async function(req, res, next) {
  try {
    // Validate request body
    const validationError = validateLoginData(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Account is blocked. Please contact support.'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: user,
      token: token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', async function(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email });

    // Always return success for security (don't reveal if email exists)
    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    });

    // TODO: Implement email sending logic here
    if (user) {
      console.log(`Password reset requested for user: ${user.email}`);
      // Generate reset token and send email
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;