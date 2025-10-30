var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/User');
var { sendOTPEmail } = require('../utils/emailService');

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

// POST /api/v1/auth/send-otp
router.post('/send-otp', async function(req, res, next) {
  try {
    var emailOrUsername = req.body.emailOrUsername;

    if (!emailOrUsername) {
      return res.status(400).json({
        success: false,
        message: 'Email or username is required'
      });
    }

    // Find user by email or username
    var user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email/username'
      });
    }

    // Generate 6-digit OTP
    var otp = Math.floor(100000 + Math.random() * 900000).toString();
    var otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    var resetToken = generateToken(user._id);

    // Save OTP to user
    user.resetOTP = otp;
    user.resetOTPExpiry = otpExpiry;
    user.resetToken = resetToken;
    user.resetOTPVerified = false; // Reset verification status
    await user.save();

    // Send OTP via email
    console.log('📧 Generating OTP for: ' + user.email);
    console.log('🔐 OTP: ' + otp); // Keep for backup/testing
    
    try {
      var emailResult = await sendOTPEmail(user.email, otp, user.name);
      console.log('📧 Email service result:', emailResult.message);
      
      res.status(200).json({
        success: true,
        message: emailResult.message || 'OTP sent successfully to your email',
        resetToken: resetToken
      });
    } catch (emailError) {
      console.error('❌ Email service error:', emailError);
      // Still return success since OTP is saved and logged
      res.status(200).json({
        success: true,
        message: 'OTP generated successfully (check console if email failed)',
        resetToken: resetToken
      });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/v1/auth/verify-otp
router.post('/verify-otp', async function(req, res, next) {
  try {
    var emailOrUsername = req.body.emailOrUsername;
    var otp = req.body.otp;
    var resetToken = req.body.resetToken;

    if (!emailOrUsername || !otp || !resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Email/username, OTP, and reset token are required'
      });
    }

    // Find user
    var user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if OTP is valid and not expired
    if (!user.resetOTP || user.resetOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (user.resetOTPExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    if (user.resetToken !== resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      });
    }

    // Mark OTP as verified and generate verified token
    console.log('✅ OTP verification successful for user:', user.username);
    console.log('👤 User ID:', user._id);
    console.log('👤 User email:', user.email);
    user.resetOTPVerified = true;
    var verifiedToken = user.resetToken + '_verified';
    user.resetToken = verifiedToken; // Update the reset token to verified token
    await user.save();
    
    console.log('🔑 Generated verified token:', verifiedToken);
    console.log('� Saved to user.resetToken');

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      verifiedToken: verifiedToken
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/v1/auth/reset-password
router.post('/reset-password', async function(req, res, next) {
  try {
    var emailOrUsername = req.body.emailOrUsername;
    var newPassword = req.body.newPassword;
    var resetToken = req.body.resetToken;

    console.log('🔄 Reset Password Request:');
    console.log('📧 Email/Username:', emailOrUsername);
    console.log('🔑 Reset Token:', resetToken);
    console.log('🔐 Password Length:', newPassword ? newPassword.length : 'undefined');

    if (!emailOrUsername || !newPassword || !resetToken) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find user
    var user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('👤 User found:', user.username);
    console.log('� User ID:', user._id);
    console.log('👤 User email:', user.email);
    console.log('�🔑 User reset token:', user.resetToken);
    console.log('🔑 Received token:', resetToken);
    console.log('✅ OTP verified status:', user.resetOTPVerified);
    console.log('🔍 Token includes _verified:', resetToken.includes('_verified'));

    // Check if token is a verified token (contains '_verified')
    if (!resetToken.includes('_verified')) {
      console.log('❌ Token not verified (missing _verified)');
      return res.status(400).json({
        success: false,
        message: 'Reset token not verified. Please complete OTP verification first.'
      });
    }

    // Check if user has OTP verified flag  
    if (!user.resetOTPVerified) {
      console.log('❌ User OTP not verified');
      return res.status(400).json({
        success: false,
        message: 'OTP verification required before password reset'
      });
    }

    console.log('🔄 Token validation:');
    console.log('  Received token:', resetToken);
    console.log('  Stored token:', user.resetToken);
    console.log('  Tokens match:', user.resetToken === resetToken);

    // Verify that the user has a verified reset token
    if (!user.resetToken || user.resetToken !== resetToken) {
      console.log('❌ Token mismatch - checking alternative validation');
      
      // Alternative validation: check if received token matches stored token
      // or if received token is the verified version of stored token
      var alternativeMatch = false;
      
      if (user.resetToken && resetToken) {
        // Case 1: Direct match (should be the normal case)
        if (user.resetToken === resetToken) {
          alternativeMatch = true;
        }
        // Case 2: Stored token is original, received is verified
        else if (user.resetToken + '_verified' === resetToken) {
          alternativeMatch = true;
        }
        // Case 3: Stored token is verified, received might be original + _verified
        else if (user.resetToken.includes('_verified') && user.resetToken === resetToken) {
          alternativeMatch = true;
        }
      }
      
      if (!alternativeMatch) {
        console.log('❌ All token validation attempts failed');
        return res.status(400).json({
          success: false,
          message: 'Invalid or unverified reset token'
        });
      } else {
        console.log('✅ Alternative token validation succeeded');
      }
    }

    console.log('✅ All token validations passed');

    // Update password
    console.log('🔐 Updating password for user:', user.username);
    user.password = newPassword;
    user.resetOTP = null;
    user.resetOTPExpiry = null;
    user.resetToken = null;
    user.resetOTPVerified = false;
    await user.save();
    console.log('✅ Password updated successfully');

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;