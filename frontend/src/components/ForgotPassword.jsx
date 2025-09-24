import React, { Component } from 'react';
import './ForgotPassword.css';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailOrUsername: '',
      isSubmitted: false,
      loading: false,
      error: ''
    };
  }

  handleInputChange = (e) => {
    this.setState({
      emailOrUsername: e.target.value,
      error: ''
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: '' });

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.emailOrUsername
        })
      });

      const data = await response.json();

      if (data.success) {
        this.setState({ isSubmitted: true });
      } else {
        this.setState({ error: data.message });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      this.setState({ error: 'Network error. Please try again.' });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    if (this.state.isSubmitted) {
      return (
        <div className="forgot-password-page">
          <div className="forgot-password-container">
            <div className="forgot-password-form">
              <div className="lock-icon">
                <div className="lock-circle">
                  <div className="lock-body"></div>
                </div>
              </div>
              
              <h2>Check your email</h2>
              <p>We've sent a password reset link to your email address.</p>
              
              <button 
                className="back-to-login-btn"
                onClick={() => window.location.href = '/login'}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="forgot-password-form">
            <div className="lock-icon">
              <div className="lock-circle">
                <div className="lock-body"></div>
              </div>
            </div>
            
            <h2>Trouble with logging in?</h2>
            <p>Enter your email address, phone number or username, and we'll send you a link to get back into your account.</p>
            
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="emailOrUsername"
                placeholder="Email address, phone number or username"
                value={this.state.emailOrUsername}
                onChange={this.handleInputChange}
                required
              />
              
              <button type="submit" className="send-link-btn" disabled={this.state.loading}>
                {this.state.loading ? 'Sending...' : 'Send login link'}
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
        </div>
      </div>
    );
  }
}

export default ForgotPassword;