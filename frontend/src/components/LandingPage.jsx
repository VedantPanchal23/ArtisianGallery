import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './LandingPage.css';

class LandingPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      notification: '',
      showDropdown: false,
      trendingArtworks: [],
      isLoadingArtworks: true
    };
  }

  componentDidMount() {
    // Check for success messages from URL params
    var urlParams = new URLSearchParams(window.location.search);
    var success = urlParams.get('success');
    
    if (success === 'login') {
      this.setState({ notification: 'Successfully logged in! Welcome to ArtHive.' });
    } else if (success === 'signup') {
      this.setState({ notification: 'Account created successfully! Welcome to ArtHive.' });
    }
    
    // Clear notification after 5 seconds
    if (success) {
      setTimeout(() => {
        this.setState({ notification: '' });
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 5000);
    }

    // Add click outside listener for dropdown
    document.addEventListener('click', this.handleClickOutside);

    // Load trending artworks from API
    this.loadTrendingArtworks();
  }

  loadTrendingArtworks = async () => {
    try {
      var response = await fetch('http://localhost:3000/api/v1/artworks?limit=6&sort=newest&status=approved');
      
      if (!response.ok) {
        throw new Error('Failed to load artworks');
      }

      var data = await response.json();
      
      this.setState({
        trendingArtworks: data.artworks || [],
        isLoadingArtworks: false
      });

    } catch (error) {
      console.error('Error loading trending artworks:', error);
      this.setState({ isLoadingArtworks: false });
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
    var isAuthenticated = this.context.isAuthenticated;
    var user = this.context.user;
    var logout = this.context.logout;
    var notification = this.state.notification;
    var { trendingArtworks, isLoadingArtworks } = this.state;

    return (
      <div className="landing-page">
        {notification && (
          <div className="notification-banner">
            {notification}
          </div>
        )}
        
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo">ArtHive</div>
            <div className="nav-right">
              <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/explore">Explore</a></li>
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
                        {this.getInitials(user?.name)}
                      </div>
                      {this.state.showDropdown && (
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
                          
                          {/* Show "My Profile" only for buyers (role: 'user') */}
                          {user?.role === 'user' && (
                            <a href="/profile" className="dropdown-item">My Profile</a>
                          )}
                          
                          {/* Show "My Uploads" and "Upload Artwork" for artists */}
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

        <section className="hero">
          <div className="hero-container">
            <h1>Discover & buy original digital art</h1>
            <p>Explore a curated marketplace of unique digital creations from talented artists around the globe.</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => window.location.href = '/explore'}>Explore marketplace</button>
              {!isAuthenticated && (
                <button className="btn-secondary" onClick={() => window.location.href = '/signup'}>Sign Up Free</button>
              )}
            </div>
          </div>
        </section>

        <section className="showcase">
          <div className="section-container">
            <h2>Trending Artworks</h2>
            {isLoadingArtworks ? (
              <div className="artwork-grid">
                <p style={{textAlign: 'center', padding: '40px', width: '100%'}}>Loading artworks...</p>
              </div>
            ) : trendingArtworks.length > 0 ? (
              <div className="artwork-grid">
                {trendingArtworks.map(artwork => (
                  <div key={artwork._id} className="artwork-card" onClick={() => this.handleArtworkClick(artwork._id)} style={{cursor: 'pointer'}}>
                    <img src={artwork.thumbnailUrl || artwork.imageUrl} alt={artwork.title} />
                    <div className="artwork-info">
                      <h3>{artwork.title}</h3>
                      <p>{artwork.category}</p>
                      <p className="price">{this.formatPrice(artwork.price, artwork.currency)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="artwork-grid">
                <p style={{textAlign: 'center', padding: '40px', width: '100%'}}>No artworks available at the moment.</p>
              </div>
            )}
            <button className="btn-primary" onClick={() => window.location.href = '/explore'}>See All</button>
          </div>
        </section>

        <section className="how-it-works">
          <div className="section-container">
            <h2>How It Works</h2>
            <div className="steps">
            
              <div className="step">
                <div className="step-number">1</div>
                <h3>Browse & Discover</h3>
                <p>Explore a wide range of digital artworks from talented artists around the world.</p>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <h3>Add to Cart</h3>
                <p>Select your favorite pieces and add them to your shopping cart for easy checkout.</p>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <h3>Buy Securely</h3>
                <p>Purchase artworks safely using our secure payment system with instant processing.</p>
              </div>
              
              <div className="step">
                <div className="step-number">4</div>
                <h3>Download Instantly</h3>
                <p>Get immediate access to your purchased high-quality digital files.</p>
              </div>
            
            </div>
          </div>
        </section>

        <section className="cta-banner">
          <div className="section-container">
            <h2>Are you an artist? Start selling today.</h2>
            <p>Join thousands of artists already earning from their digital creations</p>
            <button className="btn-white">Upload Artwork</button>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
             
          </div>
      
        </footer>
      </div>
    );
  }
}

export default LandingPage;