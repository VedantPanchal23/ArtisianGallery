import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ArtistProfile.css';

class ArtistProfile extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      artist: null,
      artworks: [],
      earnings: {
        totalEarnings: 0,
        monthlyRevenue: 0,
        artworksSold: 0
      },
      loading: true,
      error: null,
      activeTab: 'artworks'
    };
  }

  componentDidMount() {
    this.fetchArtistData();
    this.fetchArtworks();
    this.fetchEarnings();
  }

  fetchArtistData = async () => {
    try {
      const { user, token } = this.context;
      const userId = user?._id || user?.id;
      
      if (!userId) {
        console.error('User ID not found:', user);
        this.setState({ loading: false });
        return;
      }

      const response = await fetch(`http://localhost:3000/api/v1/artists/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({ artist: data.artist });
      } else {
        // Use mock data if API fails
        this.setState({
          artist: {
            name: this.context.user?.name || 'Anya Sharma',
            title: 'Visual Storyteller & Digital Dreamweaver',
            bio: 'I create vibrant, surreal digital artworks that blur the lines between reality and intricate fantasy landscapes. My work explores themes of nature, technology, and human emotion.',
            followers: '12,600',
            following: '160',
            profileImage: '/api/placeholder/100/100'
          }
        });
      }
    } catch (error) {
      console.error('Error fetching artist data:', error);
      // Use mock data on error
      this.setState({
        artist: {
          name: this.context.user?.name || 'Anya Sharma',
          title: 'Visual Storyteller & Digital Dreamweaver',
          bio: 'I create vibrant, surreal digital artworks that blur the lines between reality and intricate fantasy landscapes. My work explores themes of nature, technology, and human emotion.',
          followers: '12,600',
          following: '160',
          profileImage: '/api/placeholder/100/100'
        }
      });
    }
  };

  fetchArtworks = async () => {
    try {
      const { user, token } = this.context;
      const userId = user?._id || user?.id;
      
      if (!userId) {
        this.setState({ artworks: this.getMockArtworks() });
        return;
      }

      const response = await fetch(`http://localhost:3000/api/v1/artists/${userId}/artworks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({ artworks: data.artworks });
      } else {
        // Use mock data if API fails
        this.setState({
          artworks: this.getMockArtworks()
        });
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
      this.setState({
        artworks: this.getMockArtworks()
      });
    }
  };

  fetchEarnings = async () => {
    try {
      const { user, token } = this.context;
      const userId = user?._id || user?.id;
      
      if (!userId) {
        this.setState({
          earnings: {
            totalEarnings: 12346.67,
            monthlyRevenue: 1234.50,
            artworksSold: 87
          },
          loading: false
        });
        return;
      }

      const response = await fetch(`http://localhost:3000/api/v1/artists/${userId}/earnings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({ earnings: data.earnings });
      } else {
        // Use mock data if API fails
        this.setState({
          earnings: {
            totalEarnings: 12346.67,
            monthlyRevenue: 1234.50,
            artworksSold: 87
          }
        });
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
      this.setState({
        earnings: {
          totalEarnings: 12346.67,
          monthlyRevenue: 1234.50,
          artworksSold: 87
        }
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  getMockArtworks = () => {
    return [
      {
        id: 1,
        title: 'Echoes of Eldoria',
        category: 'Digital Art',
        price: 250.00,
        likes: 1230,
        image: '/api/placeholder/300/400',
        description: 'Mystical forest scene with ethereal lighting'
      },
      {
        id: 2,
        title: 'Quantum Bloom',
        category: 'Abstract',
        price: 180.00,
        likes: 860,
        image: '/api/placeholder/300/400',
        description: 'Abstract representation of quantum mechanics'
      },
      {
        id: 3,
        title: 'Skyscape Metropolis',
        category: 'Urban Fantasy',
        price: 320.00,
        likes: 1500,
        image: '/api/placeholder/300/400',
        description: 'Futuristic cityscape at golden hour'
      },
      {
        id: 4,
        title: 'Floral Muse',
        category: 'Portrait',
        price: 210.00,
        likes: 920,
        image: '/api/placeholder/300/400',
        description: 'Portrait with floral elements'
      },
      {
        id: 5,
        title: 'Chromatic Ascent',
        category: 'Abstract',
        price: 195.00,
        likes: 750,
        image: '/api/placeholder/300/400',
        description: 'Vibrant color composition'
      },
      {
        id: 6,
        title: 'Neon Horizon',
        category: 'Cyberpunk',
        price: 280.00,
        likes: 1100,
        image: '/api/placeholder/300/400',
        description: 'Neon-lit urban landscape'
      },
      {
        id: 7,
        title: "Dragon's Fury",
        category: 'Fantasy',
        price: 350.00,
        likes: 1800,
        image: '/api/placeholder/300/400',
        description: 'Epic dragon battle scene'
      },
      {
        id: 8,
        title: 'Zen Garden',
        category: 'Nature',
        price: 200.00,
        likes: 680,
        image: '/api/placeholder/300/400',
        description: 'Peaceful cherry blossom garden'
      }
    ];
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  uploadArtwork = () => {
    // TODO: Implement artwork upload functionality
    alert('Upload artwork functionality coming soon!');
  };

  sendMessage = () => {
    // TODO: Implement messaging functionality
    alert('Messaging functionality coming soon!');
  };

  render() {
    const { artist, artworks, earnings, loading, activeTab } = this.state;
    const { user } = this.context;

    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      );
    }

    return (
      <div className="artist-profile">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="logo">
              <span>Arthive</span>
            </div>
            <div className="header-nav">
              <a href="#" className="nav-link">Explore</a>
              <a href="#" className="nav-link">My Profile</a>
              <a href="#" className="nav-link">Sell Art</a>
              <div className="search-container">
                <input type="text" placeholder="Search for art" className="search-input" />
                <button className="search-btn">🔍</button>
              </div>
              <div className="header-icons">
                <button className="icon-btn">🛒</button>
                <button className="icon-btn">💬</button>
                <div className="profile-avatar">
                  <img src={artist?.profileImage || '/api/placeholder/40/40'} alt="Profile" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-info">
            <div className="profile-avatar-large">
              <img src={artist?.profileImage || '/api/placeholder/100/100'} alt={artist?.name} />
            </div>
            <div className="profile-details">
              <h1>{artist?.name}</h1>
              <p className="profile-title">{artist?.title}</p>
              <p className="profile-bio">{artist?.bio}</p>
              <div className="profile-stats">
                <span>{artist?.followers} Followers</span>
                <span>{artist?.following} Following</span>
              </div>
            </div>
            <div className="profile-actions">
              <button className="upload-btn" onClick={this.uploadArtwork}>
                Upload Artwork
              </button>
              <button className="message-btn" onClick={this.sendMessage}>
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="earnings-section">
          <h2>Earnings Overview</h2>
          <div className="earnings-cards">
            <div className="earning-card">
              <div className="earning-icon">📈</div>
              <div className="earning-info">
                <h3>${earnings.totalEarnings.toLocaleString()}</h3>
                <p>Total Earnings</p>
              </div>
            </div>
            <div className="earning-card">
              <div className="earning-icon">💰</div>
              <div className="earning-info">
                <h3>${earnings.monthlyRevenue.toLocaleString()}</h3>
                <p>Monthly Revenue</p>
              </div>
            </div>
            <div className="earning-card">
              <div className="earning-icon">🎨</div>
              <div className="earning-info">
                <h3>{earnings.artworksSold}</h3>
                <p>Artworks Sold</p>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks Section */}
        <div className="artworks-section">
          <div className="section-header">
            <h2>My Artworks</h2>
            <div className="section-tabs">
              <button 
                className={`tab ${activeTab === 'artworks' ? 'active' : ''}`}
                onClick={() => this.handleTabChange('artworks')}
              >
                All Artworks
              </button>
              <button 
                className={`tab ${activeTab === 'sold' ? 'active' : ''}`}
                onClick={() => this.handleTabChange('sold')}
              >
                Sold
              </button>
              <button 
                className={`tab ${activeTab === 'drafts' ? 'active' : ''}`}
                onClick={() => this.handleTabChange('drafts')}
              >
                Drafts
              </button>
            </div>
          </div>

          <div className="artworks-grid">
            {artworks.map((artwork) => (
              <div key={artwork.id} className="artwork-card">
                <div className="artwork-image">
                  <img src={artwork.image} alt={artwork.title} />
                  <div className="artwork-overlay">
                    <button className="overlay-btn">👁</button>
                    <button className="overlay-btn">✏️</button>
                    <button className="overlay-btn">🗑</button>
                  </div>
                </div>
                <div className="artwork-info">
                  <h4>{artwork.title}</h4>
                  <p className="artwork-category">{artwork.category}</p>
                  <div className="artwork-stats">
                    <span className="price">${artwork.price}</span>
                    <span className="likes">❤️ {artwork.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="profile-footer">
          <div className="footer-links">
            <a href="#" className="footer-link">Quick Links</a>
            <a href="#" className="footer-link">Legal</a>
          </div>
          <div className="footer-social">
            <button className="social-btn">📱</button>
            <button className="social-btn">📧</button>
            <button className="social-btn">🔗</button>
            <button className="social-btn">📌</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ArtistProfile;