import React, { Component } from 'react';
import './ForgotPassword.css';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1, // 1: email input, 2: OTP input, 3: password reset
      emailOrUsername: '',
      otp: ['', '', '', '', '', ''], // Array for 6 digit OTP
      newPassword: '',
      confirmPassword: '',
      loading: false,
      error: '',
      otpSent: false,
      resetToken: ''
    };
    this.otpRefs = []; // References for OTP input boxes
  }

  handleInputChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    this.setState({
      [name]: value,
      error: ''
    });
  }

  // Handle OTP input for individual digit boxes
  handleOTPChange = (index, value) => {
    // Only allow numeric input and single digit
    if (!/^[0-9]?$/.test(value)) return;
    
    var newOtp = [...this.state.otp];
    newOtp[index] = value;
    
    this.setState({ 
      otp: newOtp,
      error: '' 
    });
    
    // Auto-focus next input
    if (value && index < 5) {
      this.otpRefs[index + 1].focus();
    }
  }

  // Handle backspace and navigation in OTP inputs
  handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!this.state.otp[index] && index > 0) {
        // If current box is empty and backspace is pressed, go to previous
        this.otpRefs[index - 1].focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      this.otpRefs[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      this.otpRefs[index + 1].focus();
    }
  }

  // Handle paste in OTP inputs
  handleOTPPaste = (e) => {
    e.preventDefault();
    var pasteData = e.clipboardData.getData('text').replace(/\D/g, ''); // Remove non-digits
    
    if (pasteData.length === 6) {
      var newOtp = pasteData.split('');
      this.setState({ otp: newOtp });
      // Focus the last input
      this.otpRefs[5].focus();
    }
  }

  // Step 1: Send OTP to email/username
  handleSendOTP = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: '' });

    try {
      var response = await fetch('http://localhost:3000/api/v1/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername: this.state.emailOrUsername
        })
      });

      var data = await response.json();

      if (data.success) {
        this.setState({ 
          step: 2, 
          otpSent: true,
          resetToken: data.resetToken 
        });
      } else {
        this.setState({ error: data.message });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      this.setState({ error: 'Network error. Please try again.' });
    } finally {
      this.setState({ loading: false });
    }
  }

  // Step 2: Verify OTP
  handleVerifyOTP = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: '' });

    try {
      var response = await fetch('http://localhost:3000/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername: this.state.emailOrUsername,
          otp: this.state.otp.join(''), // Convert array to string
          resetToken: this.state.resetToken
        })
      });

      var data = await response.json();

      if (data.success) {
        this.setState({ 
          step: 3,
          resetToken: data.verifiedToken 
        });
      } else {
        this.setState({ error: data.message });
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      this.setState({ error: 'Network error. Please try again.' });
    } finally {
      this.setState({ loading: false });
    }
  }

  // Step 3: Reset Password
  handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({ error: 'Passwords do not match!' });
      return;
    }

    if (this.state.newPassword.length < 6) {
      this.setState({ error: 'Password must be at least 6 characters long!' });
      return;
    }

    this.setState({ loading: true, error: '' });

    try {
      console.log('🔄 Reset Password Request:');
      console.log('📧 Email/Username:', this.state.emailOrUsername);
      console.log('🔑 Reset Token:', this.state.resetToken);
      console.log('🔐 Password Length:', this.state.newPassword.length);
      
      var response = await fetch('http://localhost:3000/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername: this.state.emailOrUsername,
          newPassword: this.state.newPassword,
          resetToken: this.state.resetToken
        })
      });

      var data = await response.json();

      if (data.success) {
        alert('Password reset successful! Please login with your new password.');
        window.location.href = '/login';
      } else {
        this.setState({ error: data.message });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      this.setState({ error: 'Network error. Please try again.' });
    } finally {
      this.setState({ loading: false });
    }
  }

  goBackToStep = (stepNumber) => {
    this.setState({ step: stepNumber, error: '' });
  }

  renderStep1() {
    return (
      <div className="forgot-password-form">
        <div className="lock-icon">
          <div className="lock-circle">
            <div className="lock-body"></div>
          </div>
        </div>
        
        <h2>Trouble with logging in?</h2>
        <p>Enter your email address, phone number or username, and we'll send you an OTP to reset your password.</p>
        
        <form onSubmit={this.handleSendOTP}>
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Email address, phone number or username"
            value={this.state.emailOrUsername}
            onChange={this.handleInputChange}
            required
          />
          
          <button type="submit" className="send-link-btn" disabled={this.state.loading}>
            {this.state.loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
          
          {this.state.error && (
            <div className="error-message">
              {this.state.error}
            </div>
          )}
        </form>
        
        <div className="divider">
          <span>OR</span>
        </div>
        
        <a href="/signup" className="create-account-link">
          Create New Account
        </a>
        
        <div className="back-to-login">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    );
  }

  renderStep2() {
    return (
      <div className="forgot-password-form">
        <div className="lock-icon">
          <div className="lock-circle">
            <div className="lock-body"></div>
          </div>
        </div>
        
        <h2>Enter OTP</h2>
        <p>We've sent a 6-digit OTP to your email. Please enter it below to verify your identity.</p>
        
        <form onSubmit={this.handleVerifyOTP}>
          <div className="otp-container">
            {this.state.otp.map((digit, index) => (
              <input
                key={index}
                ref={ref => this.otpRefs[index] = ref}
                type="text"
                className="otp-input"
                value={digit}
                onChange={(e) => this.handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => this.handleOTPKeyDown(index, e)}
                onPaste={index === 0 ? this.handleOTPPaste : null}
                maxLength="1"
                pattern="[0-9]"
                inputMode="numeric"
              />
            ))}
          </div>
          
          <button type="submit" className="verify-otp-btn" disabled={this.state.loading || this.state.otp.some(digit => !digit)}>
            {this.state.loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          {this.state.error && (
            <div className="error-message">
              {this.state.error}
            </div>
          )}
        </form>
        
        <div className="back-option">
          <button onClick={() => this.goBackToStep(1)} className="back-step-btn">
            Back to Email Entry
          </button>
        </div>
      </div>
    );
  }

  renderStep3() {
    return (
      <div className="forgot-password-form">
        <div className="lock-icon">
          <div className="lock-circle">
            <div className="lock-body"></div>
          </div>
        </div>
        
        <h2>Reset Password</h2>
        <p>Enter your new password below. Make sure it's at least 6 characters long.</p>
        
        <form onSubmit={this.handleResetPassword}>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={this.state.newPassword}
            onChange={this.handleInputChange}
            minLength="6"
            required
          />
          
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={this.state.confirmPassword}
            onChange={this.handleInputChange}
            minLength="6"
            required
          />
          
          <button type="submit" className="reset-password-btn" disabled={this.state.loading}>
            {this.state.loading ? 'Resetting...' : 'Reset Password'}
          </button>
          
          {this.state.error && (
            <div className="error-message">
              {this.state.error}
            </div>
          )}
        </form>
        
        <div className="back-option">
          <button onClick={() => this.goBackToStep(2)} className="back-step-btn">
            Back to OTP
          </button>
        </div>
      </div>
    );
  }

  render() {
    var currentStep;
    
    if (this.state.step === 1) {
      currentStep = this.renderStep1();
    } else if (this.state.step === 2) {
      currentStep = this.renderStep2();
    } else if (this.state.step === 3) {
      currentStep = this.renderStep3();
    }

    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          {currentStep}
        </div>
      </div>
    );
  }
}

export default ForgotPassword;