import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './UserProfile.css';

class UserProfile extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      purchases: [],
      favorites: [],
      loading: true,
      activeTab: 'purchases',
      editMode: false,
      editData: {
        name: '',
        bio: '',
        profileImage: ''
      }
    };
  }

  componentDidMount() {
    this.fetchUserData();
    this.fetchUserPurchases();
    this.fetchUserFavorites();
  }

  fetchUserData = async () => {
    try {
      const { user, token } = this.context;
      const userId = user?._id || user?.id;
      
      if (!userId) {
        console.error('User ID not found:', user);
        this.setState({ 
          user: this.context.user,
          loading: false 
        });
        return;
      }

      // Try to fetch from API, fallback to context user
      try {
        const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.setState({ 
            user: data.user,
            editData: {
              name: data.user.name || '',
              bio: data.user.bio || '',
              profileImage: data.user.profileImage || ''
            }
          });
        } else {
          // Use context user as fallback
          this.setState({ 
            user: this.context.user,
            editData: {
              name: this.context.user?.name || '',
              bio: this.context.user?.bio || '',
              profileImage: this.context.user?.profileImage || ''
            }
          });
        }
      } catch (apiError) {
        console.log('API not available, using context user');
        this.setState({ 
          user: this.context.user,
          editData: {
            name: this.context.user?.name || '',
            bio: this.context.user?.bio || '',
            profileImage: this.context.user?.profileImage || ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  fetchUserPurchases = async () => {
    // Mock data for now
    const mockPurchases = [
      {
        id: 1,
        title: 'Abstract Dreams',
        artist: 'Digital Master',
        price: 150.00,
        purchaseDate: '2024-09-20',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop',
        status: 'completed'
      },
      {
        id: 2,
        title: 'Nature\'s Harmony',
        artist: 'EcoArtist',
        price: 200.00,
        purchaseDate: '2024-09-18',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
        status: 'completed'
      }
    ];
    
    this.setState({ purchases: mockPurchases });
  };

  fetchUserFavorites = async () => {
    // Mock data for now
    const mockFavorites = [
      {
        id: 1,
        title: 'Cyber Landscape',
        artist: 'TechArtist',
        price: 300.00,
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop',
        likes: 1250
      },
      {
        id: 2,
        title: 'Ocean Waves',
        artist: 'BlueCreator',
        price: 180.00,
        image: 'https://images.unsplash.com/photo-1544967882-4dcce72b6ad3?w=200&h=200&fit=crop',
        likes: 890
      }
    ];
    
    this.setState({ favorites: mockFavorites });
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  toggleEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  };

  handleEditChange = (e) => {
    this.setState({
      editData: {
        ...this.state.editData,
        [e.target.name]: e.target.value
      }
    });
  };

  saveProfile = async () => {
    // TODO: Implement profile update API call
    console.log('Saving profile:', this.state.editData);
    this.setState({ editMode: false });
    alert('Profile updated successfully!');
  };

  render() {
    const { user, purchases, favorites, loading, activeTab, editMode, editData } = this.state;
    const { logout } = this.context;

    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      );
    }

    return (
      <div className="user-profile">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="logo">
              <span>✦ArtHive</span>
            </div>
            <div className="header-nav">
              <a href="/" className="nav-link">Home</a>
              <a href="/explore" className="nav-link">Explore</a>
              <a href="/user-profile" className="nav-link active">My Profile</a>
              <div className="header-actions">
                <button className="icon-btn">🛒</button>
                <button className="logout-btn" onClick={logout}>Logout</button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-info">
            <div className="profile-avatar-large">
              <img 
                src={user?.profileImage || user?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face'} 
                alt={user?.name} 
              />
              {editMode && (
                <input
                  type="url"
                  name="profileImage"
                  placeholder="Profile Image URL"
                  value={editData.profileImage}
                  onChange={this.handleEditChange}
                  className="edit-input"
                />
              )}
            </div>
            <div className="profile-details">
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={this.handleEditChange}
                  className="edit-input-large"
                />
              ) : (
                <h1>{user?.name}</h1>
              )}
              <p className="profile-role">Art Enthusiast</p>
              {editMode ? (
                <textarea
                  name="bio"
                  value={editData.bio}
                  onChange={this.handleEditChange}
                  placeholder="Tell us about yourself..."
                  className="edit-textarea"
                />
              ) : (
                <p className="profile-bio">
                  {user?.bio || 'Art lover exploring the digital marketplace. Passionate about discovering unique creative works and supporting talented artists.'}
                </p>
              )}
              <div className="profile-stats">
                <span>{purchases.length} Purchases</span>
                <span>{favorites.length} Favorites</span>
                <span>Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
              </div>
            </div>
            <div className="profile-actions">
              {editMode ? (
                <>
                  <button className="save-btn" onClick={this.saveProfile}>
                    Save Changes
                  </button>
                  <button className="cancel-btn" onClick={this.toggleEditMode}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="edit-btn" onClick={this.toggleEditMode}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="content-section">
          <div className="section-header">
            <div className="section-tabs">
              <button 
                className={`tab ${activeTab === 'purchases' ? 'active' : ''}`}
                onClick={() => this.handleTabChange('purchases')}
              >
                My Purchases ({purchases.length})
              </button>
              <button 
                className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => this.handleTabChange('favorites')}
              >
                Favorites ({favorites.length})
              </button>
              <button 
                className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => this.handleTabChange('settings')}
              >
                Settings
              </button>
            </div>
          </div>

          <div className="tab-content">
            {activeTab === 'purchases' && (
              <div className="purchases-grid">
                {purchases.length > 0 ? (
                  purchases.map((purchase) => (
                    <div key={purchase.id} className="purchase-card">
                      <div className="purchase-image">
                        <img src={purchase.image} alt={purchase.title} />
                        <div className="purchase-status">{purchase.status}</div>
                      </div>
                      <div className="purchase-info">
                        <h4>{purchase.title}</h4>
                        <p className="purchase-artist">by {purchase.artist}</p>
                        <div className="purchase-details">
                          <span className="price">₹{purchase.price}</span>
                          <span className="date">{purchase.purchaseDate}</span>
                        </div>
                        <button className="download-btn">Download</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No purchases yet. <a href="/explore">Explore artworks</a> to get started!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="favorites-grid">
                {favorites.length > 0 ? (
                  favorites.map((favorite) => (
                    <div key={favorite.id} className="favorite-card">
                      <div className="favorite-image">
                        <img src={favorite.image} alt={favorite.title} />
                        <button className="unfavorite-btn">💖</button>
                      </div>
                      <div className="favorite-info">
                        <h4>{favorite.title}</h4>
                        <p className="favorite-artist">by {favorite.artist}</p>
                        <div className="favorite-stats">
                          <span className="price">₹{favorite.price}</span>
                          <span className="likes">❤️ {favorite.likes}</span>
                        </div>
                        <button className="buy-btn">Buy Now</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No favorites yet. <a href="/explore">Explore artworks</a> and save your favorites!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-panel">
                <div className="settings-section">
                  <h3>Account Settings</h3>
                  <div className="setting-item">
                    <label>Email</label>
                    <input type="email" value={user?.email} disabled />
                  </div>
                  <div className="setting-item">
                    <label>Username</label>
                    <input type="text" value={user?.username} disabled />
                  </div>
                  <div className="setting-item">
                    <label>Account Type</label>
                    <input type="text" value={user?.role?.toUpperCase()} disabled />
                  </div>
                </div>
                
                <div className="settings-section">
                  <h3>Preferences</h3>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Email notifications for new artworks
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Newsletter subscription
                    </label>
                  </div>
                </div>

                <div className="settings-section danger-zone">
                  <h3>Danger Zone</h3>
                  <button className="delete-account-btn">Delete Account</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;
