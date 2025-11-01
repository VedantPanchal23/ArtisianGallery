import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Signup.css';

class Signup extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobile: '',
      role: 'user',
      loading: false,
      error: ''
    };
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: '' // Clear error when user starts typing
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: 'Passwords do not match!' });
      return;
    }

    this.setState({ loading: true, error: '' });

    try {
      var response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.fullName,
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword,
          mobile: this.state.mobile,
          role: this.state.role
        })
      });

      var data = await response.json();

      if (data.success) {
        // Use auth context to update state
        this.context.login(data.user, data.token);
        
        // Redirect to home with success message
        window.location.href = '/?success=signup';
      } else {
        this.setState({ error: data.message });
      }
    } catch (error) {
      console.error('Signup error:', error);
      this.setState({ error: 'Network error. Please try again.' });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-form">
            <h1>ArtHive</h1>
            <p className="signup-subtitle">Sign up to see digital art from your friends.</p>
            
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={this.state.fullName}
                onChange={this.handleInputChange}
                required
              />
              
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={this.state.username}
                onChange={this.handleInputChange}
                required
              />
              
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={this.state.email}
                onChange={this.handleInputChange}
                required
              />
              
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleInputChange}
                required
              />
              
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={this.state.confirmPassword}
                onChange={this.handleInputChange}
                required
              />
              
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number (Optional)"
                value={this.state.mobile}
                onChange={this.handleInputChange}
              />
              
              <select
                name="role"
                value={this.state.role}
                onChange={this.handleInputChange}
                className="role-select"
              >
                <option value="user">BUYER</option>
                <option value="artist">SELLER</option>
              </select>
              
              <button type="submit" className="signup-btn" disabled={this.state.loading}>
                {this.state.loading ? 'Creating Account...' : 'Sign Up'}
              </button>
              
              {this.state.error && (
                <div className="error-message">
                  {this.state.error}
                </div>
              )}
            </form>
            
            <div className="login-section">
              <p>Already have an account? <a href="/login" className="login-link">Login</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;