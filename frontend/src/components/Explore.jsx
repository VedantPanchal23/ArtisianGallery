import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Explore.css';

class Explore extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      selectedCategory: 'all',
      priceRange: 'all',
      sortBy: 'newest',
      showDropdown: false,
      artworks: [],
      isLoading: true,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalArtworks: 0
    };
  }

  componentDidMount() {
    // Add click outside listener for dropdown
    document.addEventListener('click', this.handleClickOutside);
    // Load artworks from API
    this.loadArtworks();
  }

  loadArtworks = async () => {
    try {
      this.setState({ isLoading: true, error: null });

      // Build query parameters
      var params = new URLSearchParams();
      
      if (this.state.searchTerm) {
        params.append('search', this.state.searchTerm);
      }
      
      if (this.state.selectedCategory && this.state.selectedCategory !== 'all') {
        params.append('category', this.state.selectedCategory);
      }
      
      // Price range filtering
      if (this.state.priceRange !== 'all') {
        switch (this.state.priceRange) {
          case 'under300':
            params.append('maxPrice', '300');
            break;
          case '300to500':
            params.append('minPrice', '300');
            params.append('maxPrice', '500');
            break;
          case '500to700':
            params.append('minPrice', '500');
            params.append('maxPrice', '700');
            break;
          case 'over700':
            params.append('minPrice', '700');
            break;
        }
      }
      
      // Sorting
      var sortParam = this.state.sortBy;
      if (sortParam === 'price_low') sortParam = 'price-low';
      if (sortParam === 'price_high') sortParam = 'price-high';
      params.append('sort', sortParam);
      
      params.append('page', this.state.currentPage);
      params.append('limit', '12');
      params.append('status', 'approved');

      var token = localStorage.getItem('arthive_token');
      var headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      var response = await fetch(`http://localhost:3000/api/v1/artworks?${params.toString()}`, {
        headers: headers
      });

      if (!response.ok) {
        throw new Error('Failed to load artworks');
      }

      var data = await response.json();
      
      this.setState({
        artworks: data.artworks || [],
        totalPages: data.pagination?.pages || 1,
        totalArtworks: data.pagination?.total || 0,
        isLoading: false
      });

    } catch (error) {
      console.error('Error loading artworks:', error);
      this.setState({
        error: error.message,
        isLoading: false,
        artworks: []
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.profileMenuRef && !this.profileMenuRef.contains(event.target)) {
      this.setState({ showDropdown: false });
    }
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

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value }, () => {
      // Reload artworks after a short delay (debouncing)
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.setState({ currentPage: 1 }, this.loadArtworks);
      }, 500);
    });
  }

  handleCategoryChange = (e) => {
    this.setState({ selectedCategory: e.target.value, currentPage: 1 }, this.loadArtworks);
  }

  handlePriceRangeChange = (e) => {
    this.setState({ priceRange: e.target.value, currentPage: 1 }, this.loadArtworks);
  }

  handleSortChange = (e) => {
    this.setState({ sortBy: e.target.value, currentPage: 1 }, this.loadArtworks);
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

  handleArtworkClick = (artworkId) => {
    window.location.href = `/artwork/${artworkId}`;
  }

  render() {
    var { isAuthenticated } = this.context;
    var { artworks, isLoading, error, totalArtworks } = this.state;

    return (
      <div className="explore-page">
        {/* Navigation Bar */}
        <nav className="explore-navbar">
          <div className="nav-container">
            <div className="logo">
              <a href="/">ArtHive</a>
            </div>
            <div className="nav-right">
              <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/explore" className="active">Explore</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact Us</a></li>
                <li>
                  {!isAuthenticated ? (
                    <button className="signup-btn" onClick={() => window.location.href = '/signup'}>
                      Signup/Login
                    </button>
                  ) : (
                    <div className="profile-menu" ref={(ref) => this.profileMenuRef = ref}>
                      <div className="profile-circle" onClick={this.toggleDropdown}>
                        {this.getInitials(this.context.user?.name)}
                      </div>
                      {this.state.showDropdown && (
                        <div className="dropdown-menu">
                          <div className="dropdown-header">
                            <div className="dropdown-avatar">
                              {this.getInitials(this.context.user?.name)}
                            </div>
                            <div className="dropdown-user-info">
                              <p className="dropdown-name">{this.context.user?.name}</p>
                              <p className="dropdown-email">{this.context.user?.email}</p>
                            </div>
                          </div>
                          <div className="dropdown-divider"></div>
                          
                          {/* Show "My Profile" only for buyers (role: 'user') */}
                          {this.context.user?.role === 'user' && (
                            <a href="/profile" className="dropdown-item">My Profile</a>
                          )}
                          
                          {/* Show "My Uploads" and "Upload Artwork" for artists */}
                          {this.context.user?.role === 'artist' && (
                            <>
                              <a href="/upload-artwork" className="dropdown-item">Upload Artwork</a>
                              <a href="/my-uploads" className="dropdown-item">My Uploads</a>
                            </>
                          )}
                          
                          <a href="/explore" className="dropdown-item">Explore</a>
                          <a href="/cart" className="dropdown-item">Cart</a>
                          
                          <div className="dropdown-divider"></div>
                          <button onClick={this.handleLogout} className="dropdown-item logout-item">
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="explore-hero">
          <div className="hero-content">
            <h1>Discover Amazing Digital Art</h1>
            <p>Explore our curated collection of unique digital artworks from talented artists worldwide</p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <div className="filters-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search artworks, artists, or tags..."
                value={this.state.searchTerm}
                onChange={this.handleSearchChange}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <select value={this.state.selectedCategory} onChange={this.handleCategoryChange}>
                <option value="all">All Categories</option>
                <option value="digital">Digital Art</option>
                <option value="abstract">Abstract</option>
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
                <option value="photography">Photography</option>
                <option value="illustration">Illustration</option>
                <option value="3d">3D Art</option>
                <option value="painting">Painting</option>
                <option value="nature">Nature</option>
                <option value="urban">Urban</option>
                <option value="space">Space</option>
                <option value="other">Other</option>
              </select>

              <select value={this.state.priceRange} onChange={this.handlePriceRangeChange}>
                <option value="all">All Prices</option>
                <option value="under300">Under ₹300</option>
                <option value="300to500">₹300 - ₹500</option>
                <option value="500to700">₹500 - ₹700</option>
                <option value="over700">Over ₹700</option>
              </select>

              <select value={this.state.sortBy} onChange={this.handleSortChange}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </section>

        {/* Artworks Grid */}
        <section className="artworks-section">
          <div className="artworks-container">
            <div className="results-info">
              <h2>
                {isLoading ? 'Loading...' : `${totalArtworks} ${totalArtworks === 1 ? 'artwork' : 'artworks'} found`}
              </h2>
            </div>
            
            {isLoading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading artworks...</p>
              </div>
            )}

            {error && (
              <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={this.loadArtworks} className="retry-btn">Try Again</button>
              </div>
            )}
            
            {!isLoading && !error && artworks.length > 0 && (
              <div className="artworks-grid">
                {artworks.map(artwork => (
                  <div key={artwork._id} className="artwork-card" onClick={() => this.handleArtworkClick(artwork._id)}>
                    <div className="artwork-image">
                      <img src={artwork.thumbnailUrl || artwork.imageUrl} alt={artwork.title} />
                      <div className="artwork-overlay">
                        <button className="view-btn">View Details</button>
                      </div>
                    </div>
                    <div className="artwork-info">
                      <h3 className="artwork-title">{artwork.title}</h3>
                      <p className="artwork-artist">by {artwork.artistName}</p>
                      {artwork.tags && artwork.tags.length > 0 && (
                        <div className="artwork-tags">
                          {artwork.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="artwork-footer">
                        <div className="artwork-price">{this.formatPrice(artwork.price, artwork.currency)}</div>
                        <div className="artwork-stats">
                          <span>❤️ {artwork.likesCount || 0}</span>
                          <span>👁 {artwork.viewsCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && artworks.length === 0 && (
              <div className="no-results">
                <h3>No artworks found</h3>
                <p>Try adjusting your search criteria or browse all categories.</p>
                <button onClick={() => {
                  this.setState({
                    searchTerm: '',
                    selectedCategory: 'all',
                    priceRange: 'all',
                    sortBy: 'newest'
                  }, this.loadArtworks);
                }} className="reset-filters-btn">
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }
}

export default Explore;