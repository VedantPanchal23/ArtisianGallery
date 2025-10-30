import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';

class AuthDebug extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      localStorageToken: '',
      localStorageUser: '',
      contextAuth: false,
      contextUser: null
    };
  }

  componentDidMount() {
    this.checkAuth();
    // Check every second for updates
    this.interval = setInterval(() => {
      this.checkAuth();
    }, 1000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  checkAuth = () => {
    var token = localStorage.getItem('arthive_token');
    var user = localStorage.getItem('arthive_user');
    
    this.setState({
      localStorageToken: token || 'NOT FOUND',
      localStorageUser: user || 'NOT FOUND',
      contextAuth: this.context.isAuthenticated,
      contextUser: this.context.user
    });
  }

  clearStorage = () => {
    localStorage.removeItem('arthive_token');
    localStorage.removeItem('arthive_user');
    alert('LocalStorage cleared! Refresh the page.');
  }

  testLogin = () => {
    var testUser = {
      _id: 'test123',
      name: 'Test User',
      email: 'test@test.com',
      role: 'user',
      username: 'testuser'
    };
    var testToken = 'test-token-123';
    
    this.context.login(testUser, testToken);
    alert('Test login executed! Check the state below.');
  }

  render() {
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h1>Authentication Debug Page</h1>
        
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
          <h2>LocalStorage Data:</h2>
          <div style={{ marginTop: '1rem' }}>
            <strong>arthive_token:</strong>
            <pre style={{ background: 'white', padding: '0.5rem', marginTop: '0.5rem', overflow: 'auto' }}>
              {this.state.localStorageToken}
            </pre>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <strong>arthive_user:</strong>
            <pre style={{ background: 'white', padding: '0.5rem', marginTop: '0.5rem', overflow: 'auto' }}>
              {this.state.localStorageUser}
            </pre>
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#e8f4f8', borderRadius: '8px' }}>
          <h2>AuthContext State:</h2>
          <div style={{ marginTop: '1rem' }}>
            <strong>isAuthenticated:</strong>
            <pre style={{ background: 'white', padding: '0.5rem', marginTop: '0.5rem' }}>
              {JSON.stringify(this.state.contextAuth, null, 2)}
            </pre>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <strong>user:</strong>
            <pre style={{ background: 'white', padding: '0.5rem', marginTop: '0.5rem', overflow: 'auto' }}>
              {JSON.stringify(this.state.contextUser, null, 2)}
            </pre>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button 
            onClick={this.testLogin}
            style={{
              padding: '0.8rem 1.5rem',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Test Login
          </button>
          
          <button 
            onClick={this.clearStorage}
            style={{
              padding: '0.8rem 1.5rem',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Clear Storage
          </button>
          
          <button 
            onClick={() => window.location.href = '/profile'}
            style={{
              padding: '0.8rem 1.5rem',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go to Profile
          </button>
          
          <button 
            onClick={() => window.location.href = '/login'}
            style={{
              padding: '0.8rem 1.5rem',
              background: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go to Login
          </button>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
          <h3>Instructions:</h3>
          <ol>
            <li>First, check if localStorage has data</li>
            <li>Check if AuthContext state matches localStorage</li>
            <li>If localStorage is empty, go to Login and login</li>
            <li>Come back here to verify data is saved</li>
            <li>Then try "Go to Profile"</li>
          </ol>
        </div>
      </div>
    );
  }
}

export default AuthDebug;
