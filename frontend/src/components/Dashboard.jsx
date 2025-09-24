import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';

class Dashboard extends Component {
  static contextType = AuthContext;

  render() {
    const { user } = this.context;

    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Welcome to Dashboard!</h1>
        <p>You are successfully logged in!</p>
        {user && (
          <div>
            <h2>User Details:</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        )}
        <div style={{ marginTop: '20px' }}>
          <a href="/artist-profile" style={{ 
            background: '#4285f4', 
            color: 'white', 
            padding: '10px 20px', 
            textDecoration: 'none',
            borderRadius: '5px',
            display: 'inline-block'
          }}>
            Go to Artist Profile
          </a>
        </div>
      </div>
    );
  }
}

export default Dashboard;