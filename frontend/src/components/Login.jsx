import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

class Login extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
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
    this.setState({ loading: true, error: '' });

    try {
      var response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      });

      var data = await response.json();

      if (data.success) {
        // Use auth context to update state
        this.context.login(data.user, data.token);
        
        // Redirect to home with success message
        window.location.href = '/?success=login';
      } else {
        this.setState({ error: data.message });
      }
    } catch (error) {
      console.error('Login error:', error);
      this.setState({ error: 'Network error. Please try again.' });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-form">
            <h1>ArtHive</h1>
            
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="username or email"
                value={this.state.username}
                onChange={this.handleInputChange}
                required
              />
              
              <input
                type="password"
                name="password"
                placeholder="password"
                value={this.state.password}
                onChange={this.handleInputChange}
                required
              />
              
              <button type="submit" className="login-btn" disabled={this.state.loading}>
                {this.state.loading ? 'Logging in...' : 'Log in'}
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
            
             <a href="/forgot-password" className="forgot-link">
              Forgotten your password?
            </a>
            
            <div className="signup-section">
              <p>New to ArtHive? <a href="/signup" className="signup-link">Create Account</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;