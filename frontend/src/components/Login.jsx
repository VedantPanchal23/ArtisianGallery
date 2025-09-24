import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Login.css';

class Login extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false,
      error: '',
      redirectTo: null
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

    console.log('Attempting login with:', {
      username: this.state.username,
      password: '***hidden***'
    });

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Login response data:', data);

      if (data.success) {
        console.log('Login successful, user role:', data.user.role);
        
        // Use auth context to update state
        this.context.login(data.user, data.token);
        
        // Show success message
        alert('Login successful!');
        
        // Role-based redirect
        const redirectPath = data.user.role === 'artist' ? '/artist-profile' : '/user-profile';
        console.log(`Setting redirect to ${redirectPath} for role: ${data.user.role}`);
        this.setState({ redirectTo: redirectPath });
      } else {
        console.error('Login failed:', data.message);
        this.setState({ error: data.message || 'Login failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if backend is running
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        // Backend is not running - use mock data for testing
        console.log('Backend not available, using mock login...');
        
        // Mock artist login
        if (this.state.username === 'vedantbauna' && this.state.password === 'password123') {
          const mockUser = {
            _id: '507f1f77bcf86cd799439011',
            name: 'vedant bauna',
            username: 'vedantbauna',
            email: 'vedant@gmail.com',
            role: 'artist'
          };
          
          const mockToken = 'mock-jwt-token-for-testing';
          
          alert('Mock artist login successful! (Backend not running)');
          this.context.login(mockUser, mockToken);
          
          // Role-based redirect for mock user
          const redirectPath = mockUser.role === 'artist' ? '/artist-profile' : '/user-profile';
          console.log(`Mock redirect to ${redirectPath} for role: ${mockUser.role}`);
          this.setState({ redirectTo: redirectPath });
          return;
        }
        
        // Mock basic user login
        if (this.state.username === 'johnuser' && this.state.password === 'password123') {
          const mockUser = {
            _id: '507f1f77bcf86cd799439012',
            name: 'John Smith',
            username: 'johnuser',
            email: 'john@gmail.com',
            role: 'user'
          };
          
          const mockToken = 'mock-jwt-token-for-testing';
          
          alert('Mock login successful! (Backend not running)');
          this.context.login(mockUser, mockToken);
          
          // Role-based redirect for mock user
          const redirectPath = mockUser.role === 'artist' ? '/artist-profile' : '/user-profile';
          console.log(`Mock redirect to ${redirectPath} for role: ${mockUser.role}`);
          this.setState({ redirectTo: redirectPath });
          return;
        } else {
          this.setState({ error: 'Backend server not running. Try username: "vedantbauna", password: "password123" for mock login.' });
        }
      } else {
        this.setState({ error: `Network error: ${error.message}. Please try again.` });
      }
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    // Handle redirect after successful login
    if (this.state.redirectTo) {
      return <Navigate to={this.state.redirectTo} replace />;
    }

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
              <p>Don't have an account? <a href="/signup">Sign up</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;