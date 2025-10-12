// Email Service for sending OTP
var nodemailer = require('nodemailer');

// Email configuration
var emailConfig = {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  from: process.env.EMAIL_FROM || 'ArtHive <noreply@arthive.com>',
  service: 'gmail'
};

// Transporter for email service
var transporter = null;

// Initialize transporter
var initializeTransporter = function() {
  if (emailConfig.user && emailConfig.pass) {
    transporter = nodemailer.createTransport({
      service: emailConfig.service,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
      }
    });
    console.log('📧 Email service initialized with Gmail SMTP');
    console.log('📧 Using email: ' + emailConfig.user);
  } else {
    console.log('📧 Email credentials not found in environment variables');
    console.log('📧 USER: ' + emailConfig.user);
    console.log('📧 PASS: ' + (emailConfig.pass ? 'EXISTS' : 'MISSING'));
  }
};

// Function to send OTP email
var sendOTPEmail = function(toEmail, otp, userName) {
  return new Promise(function(resolve, reject) {
    // Initialize transporter if not already done
    if (!transporter) {
      console.log('📧 Initializing transporter...');
      initializeTransporter();
    }

    // Check if email service is properly configured
    if (!transporter) {
      console.log('\n================================');
      console.log('📧 MOCK EMAIL SERVICE (Development)');
      console.log('================================');
      console.log('📬 To: ' + toEmail);
      console.log('👤 User: ' + (userName || 'User'));
      console.log('🔐 OTP: ' + otp);
      console.log('⏰ Valid for: 10 minutes');
      console.log('================================\n');
      
      resolve({ 
        success: true, 
        messageId: 'mock_' + Date.now(),
        message: 'OTP logged to console (email service not configured)'
      });
      return;
    }

    // Production mode - send real email
    console.log('📧 Sending real email to: ' + toEmail);
    
    var mailOptions = {
      from: emailConfig.from,
      to: toEmail,
      subject: 'Your ArtHive Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px; font-size: 28px;">🎨 ArtHive</h1>
              <p style="color: #666; font-size: 16px; margin: 0;">Password Reset Request</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; margin-bottom: 20px; font-size: 22px;">Hello ${userName || 'User'}!</h2>
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                You requested a password reset for your ArtHive account. Please use the OTP below to reset your password:
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <div style="background-color: #0095f6; color: white; font-size: 36px; font-weight: bold; 
                           padding: 25px 50px; border-radius: 12px; display: inline-block; letter-spacing: 8px; box-shadow: 0 4px 15px rgba(0,149,246,0.3);">
                  ${otp}
                </div>
              </div>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 25px 0;">
                <p style="color: #856404; font-size: 14px; margin: 0; text-align: center;">
                  ⏰ This OTP will expire in 10 minutes for security reasons.
                </p>
              </div>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 25px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 10px 0;">
                If you didn't request this password reset, please ignore this email or contact our support team.
              </p>
              <p style="color: #999; font-size: 12px; margin: 10px 0;">
                © 2024 ArtHive Digital Art Marketplace. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };

    transporter.sendMail(mailOptions)
      .then(function(result) {
        console.log('✅ Email sent successfully to: ' + toEmail);
        console.log('📧 Message ID: ' + result.messageId);
        resolve({ 
          success: true, 
          messageId: result.messageId,
          message: 'OTP sent successfully to your email'
        });
      })
      .catch(function(error) {
        console.error('❌ Error sending OTP email:', error);
        console.error('❌ Full error:', error);
        reject({ 
          success: false, 
          error: error.message,
          message: 'Failed to send OTP email. Please try again.'
        });
      });
  });
};

// Test email configuration
var testEmailConfig = function() {
  return new Promise(function(resolve, reject) {
    try {
      console.log('📧 Testing email configuration...');
      console.log('📧 NODE_ENV: ' + process.env.NODE_ENV);
      console.log('📧 EMAIL_USER: ' + process.env.EMAIL_USER);
      console.log('📧 EMAIL_PASS exists: ' + (process.env.EMAIL_PASS ? 'YES' : 'NO'));
      
      if (!emailConfig.user || !emailConfig.pass) {
        console.log('📧 Email credentials not configured - using mock service');
        resolve(false);
        return;
      }
      
      initializeTransporter();
      
      if (transporter) {
        // Test the connection
        transporter.verify()
          .then(function(success) {
            console.log('✅ Gmail SMTP connection verified successfully');
            resolve(true);
          })
          .catch(function(error) {
            console.error('❌ Gmail SMTP connection failed:', error.message);
            console.log('📧 Will use mock email service instead');
            resolve(false);
          });
      } else {
        console.log('📧 Transporter not initialized - using mock service');
        resolve(false);
      }
    } catch (error) {
      console.error('Email service initialization error:', error);
      resolve(false);
    }
  });
};

module.exports = {
  sendOTPEmail,
  testEmailConfig
};