import React, { Component } from 'react';
import { Monitor, Zap, Smartphone, Bell, Palette, Lock, RefreshCw, Download, Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import './DesktopApp.css';

class DesktopApp extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      selectedPlatform: 'windows',
      isDownloading: false
    };
  }

  componentDidMount() {
    document.title = 'Desktop App - ArtHive';
  }

  selectPlatform = (platform) => {
    this.setState({ selectedPlatform: platform });
  };

  handleDownload = () => {
    this.setState({ isDownloading: true });

    // Simulate download delay
    setTimeout(() => {
      this.setState({ isDownloading: false });
      // In a real app, this would trigger the actual download
      alert('Download would start here in a real application!');
    }, 2000);
  };

  render() {
    const { user, logout } = this.context;
    const { selectedPlatform, isDownloading } = this.state;

    const platforms = [
      {
        id: 'windows',
        name: 'Windows',
        icon: Monitor,
        description: 'For Windows 10 and later',
        fileName: 'ArtHive-Setup-2.5.0.exe',
        fileSize: '45.2 MB'
      },
      {
        id: 'mac',
        name: 'macOS',
        icon: Monitor,
        description: 'For macOS 10.15 and later',
        fileName: 'ArtHive-2.5.0.dmg',
        fileSize: '52.8 MB'
      },
      {
        id: 'linux',
        name: 'Linux',
        icon: Monitor,
        description: 'For Ubuntu 18.04+ and other distributions',
        fileName: 'ArtHive-2.5.0.AppImage',
        fileSize: '38.9 MB'
      }
    ];

    const features = [
      {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Native performance with instant loading and smooth interactions'
      },
      {
        icon: Smartphone,
        title: 'Offline Access',
        description: 'Browse your purchased artworks and manage your collection offline'
      },
      {
        icon: Bell,
        title: 'Smart Notifications',
        description: 'Get notified about new artworks, sales, and important updates'
      },
      {
        icon: Palette,
        title: 'Advanced Tools',
        description: 'Enhanced upload tools, batch operations, and artist analytics'
      },
      {
        icon: Lock,
        title: 'Secure & Private',
        description: 'Your data stays secure with end-to-end encryption and local storage'
      },
      {
        icon: RefreshCw,
        title: 'Auto Updates',
        description: 'Always stay up-to-date with automatic background updates'
      }
    ];

    const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

    return (
      <div className="desktop-app">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="display-lg">ArtHive Desktop App</h1>
              <p className="text-lg text-secondary">Take your creative workflow to the next level with our native desktop application</p>
            </div>
            {user && <ProfileDropdown user={user} onLogout={logout} />}
          </div>
        </header>

        {/* Hero Section */}
        <section className="app-hero">
          <div className="hero-container">
            <div className="hero-content">
              <h2>Work Faster, Create Better</h2>
              <p>Experience ArtHive with native performance, offline capabilities, and advanced tools designed specifically for artists and collectors.</p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">2M+</span>
                  <span className="stat-label">Downloads</span>
                </div>
                <div className="stat">
                  <span className="stat-number">4.8<Star size={16} className="inline-star" /></span>
                  <span className="stat-label">User Rating</span>
                </div>
                <div className="stat">
                  <span className="stat-number">Free</span>
                  <span className="stat-label">Forever</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="app-mockup">
                <div className="mockup-screen">
                  <div className="mockup-header">
                    <div className="mockup-titlebar">
                      <div className="titlebar-buttons">
                        <span className="button close"></span>
                        <span className="button minimize"></span>
                        <span className="button maximize"></span>
                      </div>
                      <div className="titlebar-title">ArtHive Desktop</div>
                    </div>
                  </div>
                  <div className="mockup-content">
                    <div className="mockup-artwork-grid">
                      <div className="mockup-artwork"></div>
                      <div className="mockup-artwork"></div>
                      <div className="mockup-artwork"></div>
                      <div className="mockup-artwork"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="download-section">
          <div className="download-container">
            <h2>Download for Your Platform</h2>
            <p>Choose your operating system to get started</p>

            <div className="platform-selector">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  className={`platform-button ${selectedPlatform === platform.id ? 'active' : ''}`}
                  onClick={() => this.selectPlatform(platform.id)}
                >
                  <span className="platform-icon"><platform.icon size={24} /></span>
                  <div className="platform-info">
                    <span className="platform-name">{platform.name}</span>
                    <span className="platform-description">{platform.description}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="download-card">
              <div className="download-info">
                <div className="download-icon"><selectedPlatformData.icon size={48} /></div>
                <div className="download-details">
                  <h3>{selectedPlatformData.name} Version 2.5.0</h3>
                  <p>{selectedPlatformData.description}</p>
                  <div className="download-meta">
                    <span className="file-name">{selectedPlatformData.fileName}</span>
                    <span className="file-size">{selectedPlatformData.fileSize}</span>
                  </div>
                </div>
              </div>
              <button
                className={`download-button ${isDownloading ? 'downloading' : ''}`}
                onClick={this.handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <span className="download-spinner"></span>
                    Downloading...
                  </>
                ) : (
                  <>
                  <Download size={20} />
                  Download for {selectedPlatformData.name}
                  </>
                )}
              </button>
            </div>

            <div className="system-requirements">
              <h3>System Requirements</h3>
              <div className="requirements-grid">
                <div className="requirement">
                  <span className="req-label">OS:</span>
                  <span className="req-value">
                    {selectedPlatform === 'windows' && 'Windows 10 or later (64-bit)'}
                    {selectedPlatform === 'mac' && 'macOS 10.15 or later'}
                    {selectedPlatform === 'linux' && 'Ubuntu 18.04+, Fedora 30+, or other modern distributions'}
                  </span>
                </div>
                <div className="requirement">
                  <span className="req-label">RAM:</span>
                  <span className="req-value">4 GB minimum, 8 GB recommended</span>
                </div>
                <div className="requirement">
                  <span className="req-label">Storage:</span>
                  <span className="req-value">500 MB free space</span>
                </div>
                <div className="requirement">
                  <span className="req-label">Internet:</span>
                  <span className="req-value">Required for initial setup and sync</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="features-container">
            <h2>Why Choose the Desktop App?</h2>
            <p>Built specifically for creators who demand the best tools and performance</p>

            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon"><feature.icon size={32} /></div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="faq-container">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>Is the desktop app free?</h3>
                <p>Yes! The ArtHive desktop app is completely free to download and use. All features are included with your ArtHive account.</p>
              </div>
              <div className="faq-item">
                <h3>Do I need an internet connection?</h3>
                <p>Internet is required for initial setup, browsing new content, and syncing your account. However, you can view your purchased artworks offline.</p>
              </div>
              <div className="faq-item">
                <h3>Is my data secure?</h3>
                <p>Absolutely. Your data is encrypted both in transit and at rest. The app uses the same security measures as our web platform.</p>
              </div>
              <div className="faq-item">
                <h3>Can I use it alongside the web version?</h3>
                <p>Yes! Your account syncs seamlessly between the desktop app and web version. Changes you make in one will appear in the other.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default DesktopApp;