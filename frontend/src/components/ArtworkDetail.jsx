import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import FollowButton from './FollowButton';
import ReviewList from './ReviewList';
import RatingStars from './RatingStars';
import './ArtworkDetail.css';

class ArtworkDetail extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      artwork: null,
      artist: null,
      isLoading: true,
      error: null,
      isLiked: false,
      isFavorited: false,
      likesCount: 0,
      showDropdown: false,
      addingToCart: false,
      successMessage: ''
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
    this.loadArtwork();
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.profileMenuRef && !this.profileMenuRef.contains(event.target)) {
      this.setState({ showDropdown: false });
    }
  }

  loadArtwork = async () => {
    try {
      // Get artwork ID from URL
      var urlParams = new URLSearchParams(window.location.search);
      var artworkId = urlParams.get('id');

      if (!artworkId) {
        // Try to get from path
        var pathParts = window.location.pathname.split('/');
        artworkId = pathParts[pathParts.length - 1];
      }

      if (!artworkId || artworkId === 'artwork') {
        throw new Error('Artwork ID not found');
      }

      // Check if this artwork has been viewed in this session
      var viewedArtworks = JSON.parse(sessionStorage.getItem('arthive_viewed_artworks') || '[]');
      var shouldCountView = !viewedArtworks.includes(artworkId);

      var token = localStorage.getItem('arthive_token');
      var headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Add count_view parameter only if this is first time viewing in session
      var url = `http://localhost:3000/api/v1/artworks/${artworkId}`;
      if (shouldCountView) {
        url += '?count_view=true';
        // Mark this artwork as viewed in session
        viewedArtworks.push(artworkId);
        sessionStorage.setItem('arthive_viewed_artworks', JSON.stringify(viewedArtworks));
      }

      var response = await fetch(url, {
        headers: headers
      });

      if (!response.ok) {
        var errorData = await response.json();
        throw new Error(errorData.message || 'Failed to load artwork');
      }

      var data = await response.json();
      
      this.setState({
        artwork: data.artwork,
        artist: data.artwork.artist,
        isLiked: data.artwork.isLiked || false,
        isFavorited: data.artwork.isFavorited || false,
        likesCount: data.artwork.likesCount || 0,
        isLoading: false
      });

    } catch (error) {
      console.error('Error loading artwork:', error);
      this.setState({
        error: error.message,
        isLoading: false
      });
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

  handleLike = async () => {
    if (!this.context.isAuthenticated) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
      return;
    }

    try {
      var token = localStorage.getItem('arthive_token');
      var response = await fetch(`http://localhost:3000/api/v1/artworks/${this.state.artwork._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to like artwork');
      }

      var data = await response.json();
      
      this.setState({
        isLiked: data.isLiked,
        likesCount: data.likesCount
      });

    } catch (error) {
      console.error('Error liking artwork:', error);
      alert('Failed to like artwork. Please try again.');
    }
  }

  handleFavorite = async () => {
    if (!this.context.isAuthenticated) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
      return;
    }

    try {
      var token = localStorage.getItem('arthive_token');
      var response = await fetch(`http://localhost:3000/api/v1/artworks/${this.state.artwork._id}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to favorite artwork');
      }

      var data = await response.json();
      
      this.setState({
        isFavorited: data.isFavorited
      });

    } catch (error) {
      console.error('Error favoriting artwork:', error);
      alert('Failed to favorite artwork. Please try again.');
    }
  }

  handleAddToCart = () => {
    if (!this.context.isAuthenticated) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
      return;
    }

    this.setState({ addingToCart: true });

    try {
      // Get existing cart from localStorage
      var cart = JSON.parse(localStorage.getItem('arthive_cart') || '[]');
      
      // Check if artwork already in cart
      var existingIndex = cart.findIndex(item => item._id === this.state.artwork._id);
      
      if (existingIndex === -1) {
        // Add to cart
        cart.push({
          _id: this.state.artwork._id,
          title: this.state.artwork.title,
          price: this.state.artwork.price,
          currency: this.state.artwork.currency,
          imageUrl: this.state.artwork.thumbnailUrl || this.state.artwork.imageUrl,
          artistName: this.state.artwork.artistName,
          quantity: 1
        });
        
        localStorage.setItem('arthive_cart', JSON.stringify(cart));
        
        this.setState({
          successMessage: 'Added to cart successfully!',
          addingToCart: false
        });

        setTimeout(() => {
          this.setState({ successMessage: '' });
        }, 3000);
      } else {
        this.setState({
          successMessage: 'Already in cart!',
          addingToCart: false
        });

        setTimeout(() => {
          this.setState({ successMessage: '' });
        }, 3000);
      }

    } catch (error) {
      console.error('Error adding to cart:', error);
      this.setState({ addingToCart: false });
      alert('Failed to add to cart. Please try again.');
    }
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
    var isAuthenticated = this.context.isAuthenticated;
    var { artwork, artist, isLoading, error, isLiked, isFavorited, likesCount, showDropdown, addingToCart, successMessage } = this.state;

    if (isLoading) {
      return (
        <div className="artwork-detail-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading artwork...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="artwork-detail-page">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.href = '/explore'} className="btn-primary">
              Browse Artworks
            </button>
          </div>
        </div>
      );
    }

    if (!artwork) {
      return null;
    }

    return (
      <div className="artwork-detail-page">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo" onClick={() => window.location.href = '/'}>ArtHive</div>
            <div className="nav-right">
              <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/explore">Explore</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li>
                  {!isAuthenticated ? (
                    <button className="signup-btn" onClick={() => window.location.href = '/signup'}>
                      Signup/Login
                    </button>
                  ) : (
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
                          
                          {user?.role === 'user' && (
                            <a href="/profile" className="dropdown-item">My Profile</a>
                          )}
                          
                          {user?.role === 'artist' && (
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

        {/* Success Message */}
        {successMessage && (
          <div className="success-notification">
            {successMessage}
          </div>
        )}

        {/* Main Content */}
        <div className="artwork-detail-container">
          <div className="artwork-content">
            {/* Left Side - Image */}
            <div className="artwork-image-section">
              <img src={artwork.imageUrl} alt={artwork.title} className="artwork-image" />
              <div className="artwork-actions-mobile">
                <button 
                  className={`icon-btn ${isLiked ? 'liked' : ''}`}
                  onClick={this.handleLike}
                  title="Like"
                >
                  {isLiked ? '❤️' : '🤍'} {likesCount}
                </button>
                <button 
                  className={`icon-btn ${isFavorited ? 'favorited' : ''}`}
                  onClick={this.handleFavorite}
                  title="Add to favorites"
                >
                  {isFavorited ? '⭐' : '☆'}
                </button>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="artwork-info-section">
              <div className="artwork-header">
                <h1 className="artwork-title">{artwork.title}</h1>
                <div className="artwork-meta">
                  <span className="category-badge">{artwork.category}</span>
                  <span className="views-count">👁 {artwork.viewsCount || 0} views</span>
                </div>
              </div>

              {/* Artist Info */}
              <div className="artist-info">
                <div className="artist-avatar">
                  {artist?.avatarUrl ? (
                    <img src={artist.avatarUrl} alt={artist.name} />
                  ) : (
                    <div className="artist-initials">{this.getInitials(artist?.name)}</div>
                  )}
                </div>
                <div className="artist-details">
                  <p className="artist-label">Created by</p>
                  <h3 className="artist-name">{artist?.name || artwork.artistName}</h3>
                  {artist?.bio && <p className="artist-bio">{artist.bio}</p>}
                </div>
                {artist?._id && (
                  <FollowButton 
                    artistId={artist._id} 
                    initialIsFollowing={false}
                  />
                )}
              </div>

              {/* Rating Display */}
              {artwork.averageRating > 0 && (
                <div className="artwork-rating">
                  <RatingStars 
                    value={artwork.averageRating} 
                    readonly 
                    size="medium"
                    showValue
                  />
                  <span className="rating-text">
                    ({artwork.totalReviews} {artwork.totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="price-section">
                <p className="price-label">Price</p>
                <h2 className="price-amount">{this.formatPrice(artwork.price, artwork.currency)}</h2>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="btn-primary btn-large"
                  onClick={this.handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
                </button>
                <div className="icon-buttons">
                  <button 
                    className={`icon-btn-large ${isLiked ? 'liked' : ''}`}
                    onClick={this.handleLike}
                    title="Like"
                  >
                    {isLiked ? '❤️' : '🤍'}
                  </button>
                  <button 
                    className={`icon-btn-large ${isFavorited ? 'favorited' : ''}`}
                    onClick={this.handleFavorite}
                    title="Add to favorites"
                  >
                    {isFavorited ? '⭐' : '☆'}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="description-section">
                <h3>About this artwork</h3>
                <p className="artwork-description">{artwork.description}</p>
              </div>

              {/* Tags */}
              {artwork.tags && artwork.tags.length > 0 && (
                <div className="tags-section">
                  <h3>Tags</h3>
                  <div className="tags-list">
                    {artwork.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="additional-info">
                <div className="info-row">
                  <span className="info-label">Likes:</span>
                  <span className="info-value">{likesCount}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Sales:</span>
                  <span className="info-value">{artwork.salesCount || 0}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Uploaded:</span>
                  <span className="info-value">{new Date(artwork.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="reviews-section">
                <h2 className="section-title">Customer Reviews</h2>
                <ReviewList 
                  artworkId={artwork._id} 
                  currentUserId={this.context?.user?._id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ArtworkDetail;
