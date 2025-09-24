import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './LandingPage.css';

class LandingPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      notification: ''
    };
  }

  componentDidMount() {
    // Check for success messages from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    
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
  }

  render() {
    const { isAuthenticated, user, logout } = this.context;
    const { notification } = this.state;

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
            <ul className="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/explore">Explore</a></li>
              {!isAuthenticated && <li><a href="/login">Login</a></li>}
              {!isAuthenticated && <li><a href="/signup">Sign Up</a></li>}
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              {isAuthenticated && <li><a href="/cart">Cart</a></li>}
              {isAuthenticated && (
                <li>
                  <button className="logout-btn" onClick={logout}>
                    Logout
                  </button>
                </li>
              )}
            </ul>
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
            <div className="artwork-grid">
              <div className="artwork-card">
                <img src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop" alt="Urban Horizon" />
                <div className="artwork-info">
                  <h3>Urban Horizon</h3>
                  <p>Abstract</p>
                  <p className="price">₹250.00</p>
                </div>
              </div>
              <div className="artwork-card">
                <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop" alt="Forest Whispers" />
                <div className="artwork-info">
                  <h3>Forest Whispers</h3>
                  <p>Landscape</p>
                  <p className="price">₹180.50</p>
                </div>
              </div>
              <div className="artwork-card">
                <img src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=200&fit=crop" alt="Galactic Outpost" />
                <div className="artwork-info">
                  <h3>Galactic Outpost</h3>
                  <p>Illustrative</p>
                  <p className="price">₹320.75</p>
                </div>
              </div>
              <div className="artwork-card">
                <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop" alt="Crystal Cave" />
                <div className="artwork-info">
                  <h3>Crystal Cave</h3>
                  <p>3D Render</p>
                  <p className="price">₹195.00</p>
                </div>
              </div>
              <div className="artwork-card">
                <img src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop" alt="Cosmic Dance" />
                <div className="artwork-info">
                  <h3>Cosmic Dance</h3>
                  <p>Abstract</p>
                  <p className="price">₹280.00</p>
                </div>
              </div>
              <div className="artwork-card">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop" alt="Neon Dreams" />
                <div className="artwork-info">
                  <h3>Neon Dreams</h3>
                  <p>Digital Art</p>
                  <p className="price">₹240.00</p>
                </div>
              </div>
            </div>
            <button className="btn-primary">See All</button>
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