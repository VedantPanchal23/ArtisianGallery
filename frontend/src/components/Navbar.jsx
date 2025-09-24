import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

class Navbar extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      showUserMenu: false
    };
  }

  toggleUserMenu = () => {
    this.setState({ showUserMenu: !this.state.showUserMenu });
  };

  handleLogout = () => {
    this.context.logout();
    this.setState({ showUserMenu: false });
  };

  render() {
    const { isAuthenticated, user } = this.context;
    const { showUserMenu } = this.state;

    const profileLink = user?.role === 'artist' ? '/artist-profile' : '/user-profile';
    const profileText = user?.role === 'artist' ? 'Artist Dashboard' : 'My Profile';

    return (
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <a href="/">✦ArtHive</a>
          </div>

          {/* Navigation Links */}
          <div className="navbar-nav">
            <a href="/" className="nav-link">Home</a>
            <a href="/explore" className="nav-link">Explore</a>
            <a href="/about" className="nav-link">About</a>
            <a href="/contact" className="nav-link">Contact</a>
          </div>

          {/* User Actions */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <div className="user-menu">
                <button className="user-menu-trigger" onClick={this.toggleUserMenu}>
                  <img
                    src={user?.profileImage || user?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                    alt={user?.name}
                    className="user-avatar"
                  />
                  <span className="user-name">{user?.name}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="user-info">
                        <img
                          src={user?.profileImage || user?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'}
                          alt={user?.name}
                          className="dropdown-avatar"
                        />
                        <div className="user-details">
                          <div className="user-name-large">{user?.name}</div>
                          <div className="user-role">{user?.role?.toUpperCase()}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-menu">
                      <a href={profileLink} className="dropdown-item">
                        <span className="item-icon">👤</span>
                        {profileText}
                      </a>
                      
                      {user?.role === 'artist' && (
                        <>
                          <a href="/artist-profile" className="dropdown-item">
                            <span className="item-icon">🎨</span>
                            Manage Artworks
                          </a>
                          <a href="/artist-profile" className="dropdown-item">
                            <span className="item-icon">📊</span>
                            Analytics
                          </a>
                        </>
                      )}
                      
                      {user?.role === 'user' && (
                        <>
                          <a href="/user-profile" className="dropdown-item">
                            <span className="item-icon">🛍️</span>
                            My Purchases
                          </a>
                          <a href="/user-profile" className="dropdown-item">
                            <span className="item-icon">❤️</span>
                            Favorites
                          </a>
                        </>
                      )}
                      
                      <div className="dropdown-divider"></div>
                      
                      <a href="/settings" className="dropdown-item">
                        <span className="item-icon">⚙️</span>
                        Settings
                      </a>
                      
                      <button className="dropdown-item logout-item" onClick={this.handleLogout}>
                        <span className="item-icon">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <a href="/login" className="login-btn">Login</a>
                <a href="/signup" className="signup-btn">Sign Up</a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {showUserMenu && (
          <div className="mobile-overlay" onClick={this.toggleUserMenu}></div>
        )}
      </nav>
    );
  }
}

export default Navbar;