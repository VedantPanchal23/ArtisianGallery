import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

class ProtectedRoute extends Component {
  static contextType = AuthContext;

  render() {
    const { isAuthenticated, user } = this.context;
    const { children, requireRole } = this.props;

    console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
    console.log('ProtectedRoute - user:', user);
    console.log('ProtectedRoute - requireRole:', requireRole);

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      return <Navigate to="/login" replace />;
    }

    // If role is required and user doesn't have it, redirect to home
    if (requireRole && user && (user.role !== requireRole && user.userType !== requireRole)) {
      console.log('User role mismatch. User role:', user.role, 'Required:', requireRole);
      return <Navigate to="/" replace />;
    }

    console.log('Access granted to protected route');
    return children;
  }
}

export default ProtectedRoute;