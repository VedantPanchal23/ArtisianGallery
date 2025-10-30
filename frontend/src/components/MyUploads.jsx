import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './MyUploads.css';

class MyUploads extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      artworks: [],
      isLoading: true,
      error: null,
      showDropdown: false,
      stats: {
        totalUploads: 0,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
        totalLikes: 0,
        totalSales: 0,
        totalEarnings: 0
      },
      filterStatus: 'all',
      editingArtwork: null,
      showDeleteModal: false,
      deletingArtwork: null
    };
  }

  componentDidMount() {
    var user = this.context.user;
    
    // Check if user is artist or admin
    if (!user || (user.role !== 'artist' && user.role !== 'admin')) {
      window.location.href = '/';
      return;
    }

    this.loadArtworks();
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.profileMenuRef && !this.profileMenuRef.contains(event.target)) {
      this.setState({ showDropdown: false });
    }
  }

  loadArtworks = async () => {
    var token = localStorage.getItem('arthive_token');
    var user = this.context.user;

    try {
      this.setState({ isLoading: true, error: null });

      var response = await fetch(`http://localhost:3000/api/v1/artworks?artist=${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        var data = await response.json();
        this.calculateStats(data.artworks);
        this.setState({
          artworks: data.artworks,
          isLoading: false
        });
      } else {
        var errorData = await response.json();
        this.setState({
          error: errorData.error || 'Failed to load artworks',
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error loading artworks:', error);
      this.setState({
        error: 'Network error. Please try again later.',
        isLoading: false
      });
    }
  }

  calculateStats = (artworks) => {
    var stats = {
      totalUploads: artworks.length,
      approvedCount: 0,
      pendingCount: 0,
      rejectedCount: 0,
      totalLikes: 0,
      totalSales: 0,
      totalEarnings: 0
    };

    artworks.forEach(function(artwork) {
      if (artwork.status === 'approved') stats.approvedCount++;
      if (artwork.status === 'pending') stats.pendingCount++;
      if (artwork.status === 'rejected') stats.rejectedCount++;
      
      stats.totalLikes += artwork.likesCount || 0;
      stats.totalSales += artwork.salesCount || 0;
      stats.totalEarnings += (artwork.salesCount || 0) * artwork.price;
    });

    this.setState({ stats });
  }

  handleFilterChange = (status) => {
    this.setState({ filterStatus: status });
  }

  getFilteredArtworks = () => {
    var { artworks, filterStatus } = this.state;
    if (filterStatus === 'all') return artworks;
    return artworks.filter(function(artwork) {
      return artwork.status === filterStatus;
    });
  }

  handleEdit = (artworkId) => {
    window.location.href = `/upload-artwork?edit=${artworkId}`;
  }

  handleDelete = (artwork) => {
    this.setState({
      showDeleteModal: true,
      deletingArtwork: artwork
    });
  }

  confirmDelete = async () => {
    var token = localStorage.getItem('arthive_token');
    var { deletingArtwork } = this.state;

    try {
      var response = await fetch(`http://localhost:3000/api/v1/artworks/${deletingArtwork._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        this.setState({
          showDeleteModal: false,
          deletingArtwork: null
        });
        this.loadArtworks();
      } else {
        var errorData = await response.json();
        alert(errorData.error || 'Failed to delete artwork');
      }
    } catch (error) {
      console.error('Error deleting artwork:', error);
      alert('Network error. Please try again.');
    }
  }

  cancelDelete = () => {
    this.setState({
      showDeleteModal: false,
      deletingArtwork: null
    });
  }

  getInitials = (name) => {
    if (!name) return 'U';
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

  getStatusBadgeClass = (status) => {
    if (status === 'approved') return 'status-approved';
    if (status === 'pending') return 'status-pending';
    if (status === 'rejected') return 'status-rejected';
    return '';
  }

  render() {
    var user = this.context.user;
    var { artworks, isLoading, error, showDropdown, stats, filterStatus, showDeleteModal, deletingArtwork } = this.state;
    var filteredArtworks = this.getFilteredArtworks();

    return (
      <div className="my-uploads-page">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo" onClick={() => window.location.href = '/'}>ArtHive</div>
            <div className="nav-right">
              <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/explore">Explore</a></li>
                <li><a href="/upload-artwork">Upload</a></li>
                <li>
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
                          </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <a href="/upload-artwork" className="dropdown-item">Upload Artwork</a>
                        <a href="/my-uploads" className="dropdown-item">My Uploads</a>
                        <a href="/explore" className="dropdown-item">Explore</a>
                        <a href="/cart" className="dropdown-item">Cart</a>
                        <div className="dropdown-divider"></div>
                        <button onClick={this.handleLogout} className="dropdown-item logout-item">
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="uploads-container">
          <div className="uploads-header">
            <h1>My Artworks</h1>
            <button className="btn-upload" onClick={() => window.location.href = '/upload-artwork'}>
              + Upload New Artwork
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎨</div>
              <div className="stat-info">
                <h3>{stats.totalUploads}</h3>
                <p>Total Uploads</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✓</div>
              <div className="stat-info">
                <h3>{stats.approvedCount}</h3>
                <p>Approved</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{stats.pendingCount}</h3>
                <p>Pending Review</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-info">
                <h3>{stats.totalLikes}</h3>
                <p>Total Likes</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>{stats.totalSales}</h3>
                <p>Total Sales</p>
              </div>
            </div>
            <div className="stat-card stat-card-highlight">
              <div className="stat-icon">₹</div>
              <div className="stat-info">
                <h3>₹{stats.totalEarnings.toFixed(2)}</h3>
                <p>Total Earnings</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => this.handleFilterChange('all')}
            >
              All ({artworks.length})
            </button>
            <button 
              className={`filter-tab ${filterStatus === 'approved' ? 'active' : ''}`}
              onClick={() => this.handleFilterChange('approved')}
            >
              Approved ({stats.approvedCount})
            </button>
            <button 
              className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => this.handleFilterChange('pending')}
            >
              Pending ({stats.pendingCount})
            </button>
            <button 
              className={`filter-tab ${filterStatus === 'rejected' ? 'active' : ''}`}
              onClick={() => this.handleFilterChange('rejected')}
            >
              Rejected ({stats.rejectedCount})
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading your artworks...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-container">
              <p>{error}</p>
              <button className="btn-retry" onClick={this.loadArtworks}>Retry</button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredArtworks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🎨</div>
              <h2>No artworks found</h2>
              <p>
                {filterStatus === 'all' 
                  ? 'Start by uploading your first artwork!' 
                  : `No ${filterStatus} artworks yet.`}
              </p>
              <button className="btn-primary" onClick={() => window.location.href = '/upload-artwork'}>
                Upload Artwork
              </button>
            </div>
          )}

          {/* Artworks Grid */}
          {!isLoading && !error && filteredArtworks.length > 0 && (
            <div className="artworks-grid">
              {filteredArtworks.map((artwork) => (
                <div key={artwork._id} className="artwork-card">
                  <div className="artwork-image">
                    <img src={artwork.thumbnailUrl || artwork.imageUrl} alt={artwork.title} />
                    <div className={`status-badge ${this.getStatusBadgeClass(artwork.status)}`}>
                      {artwork.status}
                    </div>
                  </div>
                  <div className="artwork-content">
                    <h3>{artwork.title}</h3>
                    <p className="artwork-price">{this.formatPrice(artwork.price, artwork.currency)}</p>
                    
                    <div className="artwork-stats">
                      <span>❤️ {artwork.likesCount || 0}</span>
                      <span>👁️ {artwork.viewsCount || 0}</span>
                      <span>🛒 {artwork.salesCount || 0}</span>
                    </div>

                    {artwork.status === 'rejected' && artwork.rejectionReason && (
                      <div className="rejection-reason">
                        <strong>Reason:</strong> {artwork.rejectionReason}
                      </div>
                    )}

                    <div className="artwork-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => this.handleEdit(artwork._id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => this.handleDelete(artwork)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={this.cancelDelete}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Delete Artwork</h2>
              <p>Are you sure you want to delete "{deletingArtwork?.title}"?</p>
              <p className="warning-text">This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={this.cancelDelete}>
                  Cancel
                </button>
                <button className="btn-confirm-delete" onClick={this.confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MyUploads;
