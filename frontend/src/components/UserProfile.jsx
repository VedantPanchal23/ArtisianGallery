import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './UserProfile.css';

class UserProfile extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false,
      activeTab: 'purchased',
      isCheckingAuth: true,
      purchasedArt: [],
      favourites: [],
      isLoadingPurchases: false,
      purchaseError: null,
      isLoadingFavorites: false,
      favoritesError: null,
      purchasedArt: [
        // Mock data - will be replaced with real API data
        { id: 1, title: 'Artwork 1', image: '', artist: 'Artist Name', price: '$100' },
        { id: 2, title: 'Artwork 2', image: '', artist: 'Artist Name', price: '$150' },
        { id: 3, title: 'Artwork 3', image: '', artist: 'Artist Name', price: '$200' },
        { id: 4, title: 'Artwork 4', image: '', artist: 'Artist Name', price: '$120' }
      ],
      favourites: [],
      userSettings: {
        name: '',
        email: '',
        bio: ''
      }
    };
  }

  componentDidMount() {
    // Add click outside listener for dropdown
    document.addEventListener('click', this.handleClickOutside);
    
    // Give the AuthContext time to load from localStorage
    setTimeout(() => {
      this.checkAuthentication();
    }, 100);
  }

  checkAuthentication = () => {
    var isAuthenticated = this.context.isAuthenticated;
    var user = this.context.user;
    
    console.log('UserProfile - Checking authentication');
    console.log('UserProfile - isAuthenticated:', isAuthenticated);
    console.log('UserProfile - user:', user);
    console.log('UserProfile - localStorage token:', localStorage.getItem('arthive_token'));
    console.log('UserProfile - localStorage user:', localStorage.getItem('arthive_user'));
    
    // Double check localStorage directly
    var token = localStorage.getItem('arthive_token');
    var storedUser = localStorage.getItem('arthive_user');
    
    if (!token || !storedUser) {
      console.log('No authentication data in localStorage, redirecting to login');
      alert('Please login to access your profile');
      window.location.href = '/login';
      return;
    }
    
    // If context hasn't loaded yet but localStorage has data, wait a bit more
    if (!isAuthenticated && token && storedUser) {
      console.log('Context not ready yet, waiting...');
      setTimeout(() => {
        this.checkAuthentication();
      }, 200);
      return;
    }
    
    // Redirect if not authenticated
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      alert('Please login to access your profile');
      window.location.href = '/login';
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
    
    // Check if user role is 'user' (buyer only)
    if (currentUser && currentUser.role !== 'user') {
      console.log('User role is not "user", redirecting home');
      alert('Profile page is only available for buyers. Artists have a different dashboard.');
      window.location.href = '/';
      return;
    }
    
    // Load user data
    if (currentUser) {
      this.setState({
        isCheckingAuth: false,
        userSettings: {
          name: currentUser.name || '',
          email: currentUser.email || '',
          bio: currentUser.bio || ''
        }
      });
      // Load purchase history and favorites
      this.loadPurchaseHistory();
      this.loadFavorites();
    } else {
      this.setState({ isCheckingAuth: false });
    }
  }

  loadPurchaseHistory = async () => {
    var token = localStorage.getItem('arthive_token');
    
    try {
      this.setState({ isLoadingPurchases: true, purchaseError: null });

      var response = await fetch('http://localhost:3000/api/v1/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        var data = await response.json();
        
        // Transform transactions to purchased art format
        var purchasedArt = [];
        data.transactions.forEach(function(transaction) {
          transaction.artworks.forEach(function(artwork) {
            purchasedArt.push({
              id: artwork.artwork,
              title: artwork.title,
              image: artwork.imageUrl,
              artist: artwork.artistName,
              price: artwork.price,
              currency: artwork.currency,
              transactionId: transaction.transactionId,
              purchaseDate: transaction.createdAt,
              transactionDate: new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            });
          });
        });

        this.setState({
          purchasedArt,
          isLoadingPurchases: false
        });
      } else {
        var errorData = await response.json();
        this.setState({
          purchaseError: errorData.error || 'Failed to load purchase history',
          isLoadingPurchases: false
        });
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
      this.setState({
        purchaseError: 'Network error. Please try again later.',
        isLoadingPurchases: false
      });
    }
  }

  loadFavorites = async () => {
    var token = localStorage.getItem('arthive_token');
    var user = this.context.user;

    if (!token || !user) {
      return;
    }

    try {
      this.setState({ isLoadingFavorites: true, favoritesError: null });

      var response = await fetch(`http://localhost:3000/api/v1/artworks?favorites=${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        var data = await response.json();
        
        // Transform artworks data to match the favorites display format
        var favorites = data.artworks.map(artwork => ({
          id: artwork._id,
          title: artwork.title,
          artist: artwork.artist.name,
          image: artwork.thumbnailUrl || artwork.imageUrl,
          price: artwork.price,
          currency: artwork.currency
        }));

        this.setState({
          favourites: favorites,
          isLoadingFavorites: false
        });
      } else {
        var errorData = await response.json();
        this.setState({
          favoritesError: errorData.error || 'Failed to load favorites',
          isLoadingFavorites: false
        });
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.setState({
        favoritesError: 'Network error. Please try again later.',
        isLoadingFavorites: false
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

  handleTabClick = (tab) => {
    this.setState({ activeTab: tab });
  }

  handleInputChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    this.setState({
      userSettings: {
        ...this.state.userSettings,
        [name]: value
      }
    });
  }

  handleSaveSettings = async () => {
    try {
      var token = localStorage.getItem('token');
      var response = await fetch('http://localhost:3000/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(this.state.userSettings)
      });

      var data = await response.json();
      
      if (data.success) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings: ' + data.message);
      }
    } catch (error) {
      console.error('Save settings error:', error);
      alert('Network error. Please try again.');
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

  renderPurchasedTab() {
    var { purchasedArt, isLoadingPurchases, purchaseError } = this.state;
    
    if (isLoadingPurchases) {
      return (
        <div className="tab-content">
          <h2 className="section-title">My Purchased Art</h2>
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your purchases...</p>
          </div>
        </div>
      );
    }

    if (purchaseError) {
      return (
        <div className="tab-content">
          <h2 className="section-title">My Purchased Art</h2>
          <div className="error-container">
            <p>{purchaseError}</p>
            <button className="btn-retry" onClick={this.loadPurchaseHistory}>Retry</button>
          </div>
        </div>
      );
    }
  renderPurchasedTab() {
    var purchasedArt = this.state.purchasedArt;
    
    return (
      <div className="tab-content">
        <h2 className="section-title">My Purchased Art</h2>
        <div className="artwork-grid">
          {purchasedArt.length > 0 ? (
            purchasedArt.map((art) => (
              <div key={art.id} className="artwork-card">
                <div className="artwork-image-placeholder">
                  {art.image ? (
                    <img src={art.image} alt={art.title} />
                  ) : (
                    <div className="placeholder-content">
                      <span>🎨</span>
                    </div>
                  )}
                </div>
                <div className="artwork-details">
                  <h3>{art.title}</h3>
                  <p className="artist-name">by {art.artist}</p>
                  <p className="price">{this.formatPrice(art.price, art.currency)}</p>
                  <p className="purchase-date">Purchased: {art.transactionDate}</p>
                  <button 
                    className="btn-view-artwork"
                    onClick={() => window.location.href = `/artwork/${art.id}`}
                  >
                    View Artwork
                  </button>
                  <p className="artist-name">{art.artist}</p>
                  <p className="price">{art.price}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h3>No purchases yet</h3>
              <p>Start exploring our marketplace and buy your first artwork!</p>
              <button className="btn-explore" onClick={() => window.location.href = '/explore'}>
                Browse Artworks
              </button>
              <p>No purchased artworks yet</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  renderFavouritesTab() {
    var { favourites, isLoadingFavorites, favoritesError } = this.state;
    var favourites = this.state.favourites;
    
    return (
      <div className="tab-content">
        <h2 className="section-title">My Favourite Art</h2>
        
        {isLoadingFavorites && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your favorites...</p>
          </div>
        )}

        {favoritesError && (
          <div className="error-container">
            <p>{favoritesError}</p>
            <button className="btn-retry" onClick={this.loadFavorites}>Retry</button>
          </div>
        )}

        {!isLoadingFavorites && !favoritesError && (
          <div className="artwork-grid">
            {favourites.length > 0 ? (
              favourites.map((art) => (
                <div key={art.id} className="artwork-card">
                  <div className="artwork-image-placeholder">
                    {art.image ? (
                      <img src={art.image} alt={art.title} />
                    ) : (
                      <div className="placeholder-content">
                        <span>🎨</span>
                      </div>
                    )}
                  </div>
                  <div className="artwork-details">
                    <h3>{art.title}</h3>
                    <p className="artist-name">by {art.artist}</p>
                    <p className="artwork-price">{this.formatPrice(art.price, art.currency)}</p>
                    <a href={`/artwork/${art.id}`} className="btn-view-artwork">View Artwork</a>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">💙</div>
                <h3>No favorites yet</h3>
                <p>Start exploring and add artworks to your favorites!</p>
                <a href="/explore" className="btn-explore">Explore Artworks</a>
              </div>
            )}
          </div>
        )}
        <div className="artwork-grid">
          {favourites.length > 0 ? (
            favourites.map((art) => (
              <div key={art.id} className="artwork-card">
                <div className="artwork-image-placeholder">
                  {art.image ? (
                    <img src={art.image} alt={art.title} />
                  ) : (
                    <div className="placeholder-content">
                      <span>🎨</span>
                    </div>
                  )}
                </div>
                <div className="artwork-details">
                  <h3>{art.title}</h3>
                  <p className="artist-name">{art.artist}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No favourite artworks yet</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  renderSettingsTab() {
    var userSettings = this.state.userSettings;
    
    return (
      <div className="tab-content">
        <h2 className="section-title">Account Settings</h2>
        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userSettings.name}
              onChange={this.handleInputChange}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userSettings.email}
              onChange={this.handleInputChange}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={userSettings.bio}
              onChange={this.handleInputChange}
              placeholder="Tell us about yourself"
              rows="4"
            />
          </div>
          
          <button className="save-btn" onClick={this.handleSaveSettings}>
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  render() {
    var isAuthenticated = this.context.isAuthenticated;
    var user = this.context.user;
    var activeTab = this.state.activeTab;
    var isCheckingAuth = this.state.isCheckingAuth;

    // Show loading state while checking authentication
    if (isCheckingAuth || !isAuthenticated || !user) {
      return (
        <div className="user-profile-page">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '1.2rem',
            color: '#666'
          }}>
            Loading your profile...
          </div>
        </div>
      );
    }

    // Check if user is a buyer
    if (user.role !== 'user') {
      return (
        <div className="user-profile-page">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              Profile page is only available for buyers.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                padding: '0.8rem 2rem',
                background: '#2B2F6B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="user-profile-page">
        {/* Navbar - same as other pages */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo">ArtHive</div>
            <div className="nav-right">
              <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/explore">Explore</a></li>
                <li>
                  {isAuthenticated && (
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
                          <a href="/profile" className="dropdown-item">My Profile</a>
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

        {/* Main Content */}
        <div className="profile-content">
          <div className="profile-container">
            <h1 className="dashboard-title">My Dashboard</h1>
            
            {/* Tab Navigation */}
            <div className="tab-navigation">
              <button 
                className={`tab-button ${activeTab === 'purchased' ? 'active' : ''}`}
                onClick={() => this.handleTabClick('purchased')}
              >
                Purchased
              </button>
              <button 
                className={`tab-button ${activeTab === 'favourites' ? 'active' : ''}`}
                onClick={() => this.handleTabClick('favourites')}
              >
                Favourites
              </button>
              <button 
                className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => this.handleTabClick('settings')}
              >
                Setting
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'purchased' && this.renderPurchasedTab()}
            {activeTab === 'favourites' && this.renderFavouritesTab()}
            {activeTab === 'settings' && this.renderSettingsTab()}
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;
