import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css';

class AdminDashboard extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'pending',
      showDropdown: false,
      
      // Pending artworks
      pendingArtworks: [],
      isLoadingPending: false,
      pendingError: null,
      
      // Analytics
      analytics: null,
      isLoadingAnalytics: false,
      analyticsError: null,
      
      // Users
      users: [],
      isLoadingUsers: false,
      usersError: null,
      
      // Reject modal
      showRejectModal: false,
      rejectingArtwork: null,
      rejectionReason: '',
      
      // Auth check
      isCheckingAuth: true
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
    
    // Give AuthContext time to load from localStorage
    setTimeout(() => {
      this.checkAuthentication();
    }, 100);
  }

  checkAuthentication = () => {
    var user = this.context.user;
    var token = localStorage.getItem('arthive_token');
    var storedUser = localStorage.getItem('arthive_user');

    // If context hasn't loaded yet but localStorage has data, wait
    if (!user && token && storedUser) {
      setTimeout(() => {
        this.checkAuthentication();
      }, 200);
      return;
    }

    // Parse stored user if context user is not available
    var currentUser = user;
    if (!currentUser && storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }

    // Check if user is admin
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Admin Dashboard is only available for administrators.');
      window.location.href = '/';
      return;
    }

    this.setState({ isCheckingAuth: false });
    this.loadPendingArtworks();
    this.loadAnalytics();
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.profileMenuRef && !this.profileMenuRef.contains(event.target)) {
      this.setState({ showDropdown: false });
    }
  }

  loadPendingArtworks = async () => {
    var token = localStorage.getItem('arthive_token');

    try {
      this.setState({ isLoadingPending: true, pendingError: null });

      var response = await fetch('http://localhost:3000/api/v1/admin/artworks/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        var data = await response.json();
        this.setState({
          pendingArtworks: data.artworks,
          isLoadingPending: false
        });
      } else {
        var errorData = await response.json();
        this.setState({
          pendingError: errorData.error || 'Failed to load pending artworks',
          isLoadingPending: false
        });
      }
    } catch (error) {
      console.error('Error loading pending artworks:', error);
      this.setState({
        pendingError: 'Network error. Please try again later.',
        isLoadingPending: false
      });
    }
  }

  loadAnalytics = async () => {
    var token = localStorage.getItem('arthive_token');

    try {
      this.setState({ isLoadingAnalytics: true, analyticsError: null });

      var response = await fetch('http://localhost:3000/api/v1/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        var data = await response.json();
        this.setState({
          analytics: data.analytics,
          isLoadingAnalytics: false
        });
      } else {
        var errorData = await response.json();
        this.setState({
          analyticsError: errorData.error || 'Failed to load analytics',
          isLoadingAnalytics: false
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      this.setState({
        analyticsError: 'Network error. Please try again later.',
        isLoadingAnalytics: false
      });
    }
  }

  loadUsers = async () => {
    var token = localStorage.getItem('arthive_token');

    try {
      this.setState({ isLoadingUsers: true, usersError: null });

      var response = await fetch('http://localhost:3000/api/v1/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        var data = await response.json();
        this.setState({
          users: data.users,
          isLoadingUsers: false
        });
      } else {
        var errorData = await response.json();
        this.setState({
          usersError: errorData.error || 'Failed to load users',
          isLoadingUsers: false
        });
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.setState({
        usersError: 'Network error. Please try again later.',
        isLoadingUsers: false
      });
    }
  }

  handleApprove = async (artworkId) => {
    var token = localStorage.getItem('arthive_token');

    try {
      var response = await fetch(`http://localhost:3000/api/v1/admin/artworks/${artworkId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Artwork approved successfully!');
        this.loadPendingArtworks();
        this.loadAnalytics();
      } else {
        var errorData = await response.json();
        alert(errorData.error || 'Failed to approve artwork');
      }
    } catch (error) {
      console.error('Error approving artwork:', error);
      alert('Network error. Please try again.');
    }
  }

  openRejectModal = (artwork) => {
    this.setState({
      showRejectModal: true,
      rejectingArtwork: artwork,
      rejectionReason: ''
    });
  }

  closeRejectModal = () => {
    this.setState({
      showRejectModal: false,
      rejectingArtwork: null,
      rejectionReason: ''
    });
  }

  handleReject = async () => {
    var token = localStorage.getItem('arthive_token');
    var { rejectingArtwork, rejectionReason } = this.state;

    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      var response = await fetch(`http://localhost:3000/api/v1/admin/artworks/${rejectingArtwork._id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      if (response.ok) {
        alert('Artwork rejected successfully!');
        this.closeRejectModal();
        this.loadPendingArtworks();
        this.loadAnalytics();
      } else {
        var errorData = await response.json();
        alert(errorData.error || 'Failed to reject artwork');
      }
    } catch (error) {
      console.error('Error rejecting artwork:', error);
      alert('Network error. Please try again.');
    }
  }

  handleBlockUser = async (userId, currentlyBlocked) => {
    var token = localStorage.getItem('arthive_token');
    var action = currentlyBlocked ? 'unblock' : 'block';

    if (!confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      var response = await fetch(`http://localhost:3000/api/v1/admin/users/${userId}/block`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ block: !currentlyBlocked })
      });

      if (response.ok) {
        alert(`User ${action}ed successfully!`);
        this.loadUsers();
      } else {
        var errorData = await response.json();
        alert(errorData.error || `Failed to ${action} user`);
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert('Network error. Please try again.');
    }
  }

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
    
    if (tab === 'users' && this.state.users.length === 0) {
      this.loadUsers();
    }
  }

  getInitials = (name) => {
    if (!name) return 'A';
    var names = name.split(' ');
    var initials = names[0].charAt(0);
    if (names.length > 1) {
      initials += names[1].charAt(0);
    }
    return initials.toUpperCase();
  }

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  }

  handleLogout = () => {
    this.setState({ showDropdown: false });
    this.context.logout();
  }

  formatPrice = (price, currency) => {
    var symbols = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    return `${symbols[currency] || '₹'}${parseFloat(price).toFixed(2)}`;
  }

  render() {
    var user = this.context.user;
    var { activeTab, showDropdown, pendingArtworks, isLoadingPending, pendingError, analytics, isLoadingAnalytics, users, isLoadingUsers, usersError, showRejectModal, rejectingArtwork, rejectionReason, isCheckingAuth } = this.state;

    if (isCheckingAuth) {
      return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          <p>Loading...</p>
        </div>
      );
    }

    return (
      <div className="admin-dashboard-page">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo" onClick={() => window.location.href = '/'}>ArtHive Admin</div>
            <div className="nav-right">
              <div className="profile-menu" ref={(ref) => this.profileMenuRef = ref}>
                <div className="profile-circle" onClick={this.toggleDropdown}>
                  {this.getInitials(user?.name)}
                </div>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        {this.getInitials(user?.name)}
                      </div>
                      <div className="dropdown-user-info">
                        <p className="dropdown-name">{user?.name}</p>
                        <p className="dropdown-email">{user?.email}</p>
                        <span className="admin-badge">Admin</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <a href="/" className="dropdown-item">Home</a>
                    <a href="/explore" className="dropdown-item">Explore</a>
                    <div className="dropdown-divider"></div>
                    <button onClick={this.handleLogout} className="dropdown-item logout-item">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>Manage artworks, users, and platform analytics</p>
          </div>

          {/* Analytics Overview */}
          {analytics && (
            <div className="analytics-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{analytics.overview.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎨</div>
                <div className="stat-info">
                  <h3>{analytics.overview.totalArtists}</h3>
                  <p>Artists</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🖼️</div>
                <div className="stat-info">
                  <h3>{analytics.overview.totalArtworks}</h3>
                  <p>Artworks</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{analytics.overview.pendingArtworks}</h3>
                  <p>Pending Review</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-info">
                  <h3>{analytics.overview.totalSales}</h3>
                  <p>Total Sales</p>
                </div>
              </div>
              <div className="stat-card stat-card-highlight">
                <div className="stat-icon">₹</div>
                <div className="stat-info">
                  <h3>₹{analytics.overview.totalRevenue.toFixed(2)}</h3>
                  <p>Revenue</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => this.handleTabChange('pending')}
            >
              Pending Artworks ({pendingArtworks.length})
            </button>
            <button 
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => this.handleTabChange('users')}
            >
              User Management
            </button>
            <button 
              className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => this.handleTabChange('analytics')}
            >
              Analytics
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Pending Artworks Tab */}
            {activeTab === 'pending' && (
              <div>
                <h2>Pending Artworks for Review</h2>
                
                {isLoadingPending && (
                  <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading pending artworks...</p>
                  </div>
                )}

                {pendingError && (
                  <div className="error-container">
                    <p>{pendingError}</p>
                    <button className="btn-retry" onClick={this.loadPendingArtworks}>Retry</button>
                  </div>
                )}

                {!isLoadingPending && !pendingError && pendingArtworks.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">✓</div>
                    <h3>All caught up!</h3>
                    <p>No pending artworks to review.</p>
                    <p style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>
                      Note: Artworks are currently set to auto-approve. 
                      To require manual approval, change status to 'pending' in backend/routes/artworks.js line 77.
                    </p>
                  </div>
                )}

                {!isLoadingPending && !pendingError && pendingArtworks.length > 0 && (
                  <div className="artworks-list">
                    {pendingArtworks.map((artwork) => (
                      <div key={artwork._id} className="artwork-review-card">
                        <div className="artwork-image">
                          <img src={artwork.thumbnailUrl || artwork.imageUrl} alt={artwork.title} />
                        </div>
                        <div className="artwork-info">
                          <h3>{artwork.title}</h3>
                          <p className="artist-info">
                            by {artwork.artist.name} (@{artwork.artist.username})
                          </p>
                          <p className="description">{artwork.description}</p>
                          <div className="artwork-meta">
                            <span className="price">{this.formatPrice(artwork.price, artwork.currency)}</span>
                            <span className="category">{artwork.category}</span>
                            <span className="date">Uploaded: {new Date(artwork.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="tags">
                            {artwork.tags.map((tag, index) => (
                              <span key={index} className="tag">#{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="artwork-actions">
                          <button 
                            className="btn-approve"
                            onClick={() => this.handleApprove(artwork._id)}
                          >
                            ✓ Approve
                          </button>
                          <button 
                            className="btn-reject"
                            onClick={() => this.openRejectModal(artwork)}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2>User Management</h2>
                
                {isLoadingUsers && (
                  <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading users...</p>
                  </div>
                )}

                {usersError && (
                  <div className="error-container">
                    <p>{usersError}</p>
                    <button className="btn-retry" onClick={this.loadUsers}>Retry</button>
                  </div>
                )}

                {!isLoadingUsers && !usersError && users.length > 0 && (
                  <div className="users-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Joined</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`role-badge role-${user.role}`}>
                                {user.role}
                              </span>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`status-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                                {user.isBlocked ? 'Blocked' : 'Active'}
                              </span>
                            </td>
                            <td>
                              {user.role !== 'admin' && (
                                <button 
                                  className={`btn-toggle ${user.isBlocked ? 'btn-unblock' : 'btn-block'}`}
                                  onClick={() => this.handleBlockUser(user._id, user.isBlocked)}
                                >
                                  {user.isBlocked ? 'Unblock' : 'Block'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && analytics && (
              <div>
                <h2>Platform Analytics</h2>
                
                {/* Top Artworks */}
                <div className="analytics-section">
                  <h3>Top Selling Artworks</h3>
                  <div className="top-items-grid">
                    {analytics.topArtworks.map((artwork) => (
                      <div key={artwork._id} className="top-item-card">
                        <img src={artwork.imageUrl} alt={artwork.title} />
                        <div className="top-item-info">
                          <h4>{artwork.title}</h4>
                          <p>by {artwork.artist.name}</p>
                          <p className="sales">Sales: {artwork.salesCount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="analytics-section">
                  <h3>Category Distribution</h3>
                  <div className="category-stats">
                    {analytics.categoryDistribution.map((cat) => (
                      <div key={cat._id} className="category-bar">
                        <span className="category-name">{cat._id}</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill" 
                            style={{ width: `${(cat.count / analytics.overview.totalArtworks) * 100}%` }}
                          ></div>
                        </div>
                        <span className="category-count">{cat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="modal-overlay" onClick={this.closeRejectModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Reject Artwork</h2>
              <p>You are rejecting: <strong>{rejectingArtwork?.title}</strong></p>
              <p>Please provide a reason for rejection:</p>
              <textarea
                className="rejection-textarea"
                value={rejectionReason}
                onChange={(e) => this.setState({ rejectionReason: e.target.value })}
                placeholder="E.g., Image quality does not meet platform standards, inappropriate content, etc."
                rows="4"
              ></textarea>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={this.closeRejectModal}>
                  Cancel
                </button>
                <button className="btn-confirm-reject" onClick={this.handleReject}>
                  Reject Artwork
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default AdminDashboard;
