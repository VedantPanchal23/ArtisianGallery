import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

class ProtectedRoute extends Component {
  static contextType = AuthContext;

  render() {
    const { isAuthenticated, user } = this.context;
    const { children, requiredRole } = this.props;

    console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
    console.log('ProtectedRoute - user:', user);
    console.log('ProtectedRoute - requiredRole:', requiredRole);

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      return <Navigate to="/login" replace />;
    }

    // If role is required and user doesn't have it, show unauthorized message
    if (requiredRole && user && user.role !== requiredRole) {
      console.log('User role mismatch. User role:', user.role, 'Required:', requiredRole);
      
      // Create unauthorized component
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f7fafc',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h1 style={{ color: '#e53e3e', marginBottom: '1rem' }}>
            🚫 Access Denied
          </h1>
          <p style={{ color: '#718096', marginBottom: '2rem' }}>
            You don't have permission to access this page.
            <br />
            Required role: <strong>{requiredRole}</strong>
            <br />
            Your role: <strong>{user.role}</strong>
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => window.history.back()}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Go Back
            </button>
            <a
              href={user.role === 'artist' ? '/artist-profile' : '/user-profile'}
              style={{
                background: '#48bb78',
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '600'
              }}
            >
              Go to My Profile
            </a>
          </div>
        </div>
      );
    }

    console.log('Access granted to protected route');
    return children;
  }
}

export default ProtectedRoute;