import React, { Component } from 'react';
import { Palette, Moon, Accessibility, Smartphone, Target, Zap, BarChart3, TrendingUp, Users, Download, Paintbrush, DollarSign, Shield, Lock, MonitorSpeaker, Heart, MessageCircle, Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import './WhatsNew.css';

class WhatsNew extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      activeFilter: 'all',
      releases: [
        {
          id: 'v2-5-0',
          version: 'v2.5.0',
          date: '2025-11-06',
          type: 'major',
          title: 'Enhanced Theme System & Typography',
          description: 'Complete redesign with Inter font, comprehensive dark mode support, and improved accessibility.',
          features: [
            { icon: Palette, text: 'New typography system with Inter font family' },
            { icon: Moon, text: 'Enhanced dark mode with proper contrast ratios' },
            { icon: Accessibility, text: 'Improved accessibility with better focus indicators' },
            { icon: Smartphone, text: 'Responsive design improvements' },
            { icon: Target, text: 'Better visual hierarchy and spacing' }
          ],
          category: 'ui'
        },
        {
          id: 'v2-4-1',
          version: 'v2.4.1',
          date: '2025-10-28',
          type: 'minor',
          title: 'Performance & Bug Fixes',
          description: 'Various performance improvements and bug fixes across the platform.',
          features: [
            { icon: Zap, text: 'Faster image loading with lazy loading' },
            { icon: BarChart3, text: 'Better analytics tracking' },
            { icon: TrendingUp, text: 'Improved performance metrics' }
          ],
          category: 'performance'
        },
        {
          id: 'v2-4-0',
          version: 'v2.4.0',
          date: '2025-10-15',
          type: 'major',
          title: 'Advanced Artist Dashboard',
          description: 'New comprehensive dashboard for artists with analytics, sales tracking, and management tools.',
          features: [
            { icon: TrendingUp, text: 'Sales analytics and revenue tracking' },
            { icon: Users, text: 'Customer management tools' },
            { icon: Download, text: 'Download statistics and insights' },
            { icon: Paintbrush, text: 'Bulk artwork management' },
            { icon: DollarSign, text: 'Payout tracking and history' }
          ],
          category: 'features'
        },
        {
          id: 'v2-3-2',
          version: 'v2.3.2',
          date: '2025-09-30',
          type: 'patch',
          title: 'Security Updates',
          description: 'Important security patches and dependency updates.',
          features: [
            { icon: Shield, text: 'Security vulnerability fixes' },
            { icon: Lock, text: 'Improved authentication security' }
          ],
          category: 'security'
        },
        {
          id: 'v2-3-1',
          version: 'v2.3.1',
          date: '2025-09-20',
          type: 'minor',
          title: 'Mobile Experience Improvements',
          description: 'Enhanced mobile experience with better touch interactions and responsive design.',
          features: [
            { icon: Smartphone, text: 'Improved mobile navigation' },
            { icon: Palette, text: 'Mobile-optimized forms and inputs' },
            { icon: Zap, text: 'Faster mobile loading times' }
          ],
          category: 'ui'
        },
        {
          id: 'v2-3-0',
          version: 'v2.3.0',
          date: '2025-09-01',
          type: 'major',
          title: 'Social Features Launch',
          description: 'Introducing social features including following artists, liking artwork, and community interactions.',
          features: [
            { icon: Users, text: 'Follow your favorite artists' },
            { icon: Heart, text: 'Like and save artwork' },
            { icon: MessageCircle, text: 'Community comments and discussions' },
            { icon: Bell, text: 'Notification system' }
          ],
          category: 'features'
        }
      ]
    };
  }

  componentDidMount() {
    document.title = 'What\'s New - ArtHive';
  }

  setActiveFilter = (filter) => {
    this.setState({ activeFilter: filter });
  };

  getFilteredReleases = () => {
    const { activeFilter, releases } = this.state;
    if (activeFilter === 'all') return releases;
    return releases.filter(release => release.category === activeFilter);
  };

  getReleaseTypeColor = (type) => {
    switch (type) {
      case 'major': return 'var(--color-success-500)';
      case 'minor': return 'var(--color-info-500)';
      case 'patch': return 'var(--color-warning-500)';
      default: return 'var(--text-muted)';
    }
  };

  getReleaseTypeLabel = (type) => {
    switch (type) {
      case 'major': return 'Major';
      case 'minor': return 'Minor';
      case 'patch': return 'Patch';
      default: return 'Update';
    }
  };

  formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  render() {
    const { user, logout } = this.context;
    const { activeFilter } = this.state;
    const filteredReleases = this.getFilteredReleases();

    const filters = [
      { id: 'all', label: 'All Updates', count: this.state.releases.length },
      { id: 'features', label: 'New Features', count: this.state.releases.filter(r => r.category === 'features').length },
      { id: 'ui', label: 'UI/UX', count: this.state.releases.filter(r => r.category === 'ui').length },
      { id: 'performance', label: 'Performance', count: this.state.releases.filter(r => r.category === 'performance').length },
      { id: 'security', label: 'Security', count: this.state.releases.filter(r => r.category === 'security').length }
    ];

    return (
      <div className="whats-new">
        {/* Header */}
        <header className="whats-new-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="display-lg">What's New</h1>
              <p className="text-lg text-secondary">Stay updated with the latest features and improvements</p>
            </div>
            {user && <ProfileDropdown user={user} onLogout={logout} />}
          </div>
        </header>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-container">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`filter-button ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => this.setActiveFilter(filter.id)}
              >
                <span className="filter-label">{filter.label}</span>
                <span className="filter-count">{filter.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Releases */}
        <div className="releases-container">
          <div className="releases-list">
            {filteredReleases.map(release => (
              <div key={release.id} className="release-card">
                <div className="release-header">
                  <div className="release-meta">
                    <span
                      className="release-type"
                      style={{ backgroundColor: this.getReleaseTypeColor(release.type) }}
                    >
                      {this.getReleaseTypeLabel(release.type)}
                    </span>
                    <span className="release-version">{release.version}</span>
                    <span className="release-date">{this.formatDate(release.date)}</span>
                  </div>
                  <h2 className="release-title">{release.title}</h2>
                  <p className="release-description">{release.description}</p>
                </div>

                <div className="release-features">
                  <h3>What's New</h3>
                  <ul className="features-list">
                    {release.features.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <li key={index} className="feature-item">
                          <IconComponent size={16} />
                          <span>{feature.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="release-footer">
                  <button className="learn-more-btn">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredReleases.length === 0 && (
            <div className="no-releases">
              <div className="no-releases-content">
                <span className="no-releases-icon"><MonitorSpeaker size={48} /></span>
                <h3>No updates found</h3>
                <p>Try adjusting your filters to see more updates.</p>
              </div>
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="newsletter-section">
          <div className="newsletter-container">
            <div className="newsletter-content">
              <h2>Stay in the Loop</h2>
              <p>Get notified about new features, updates, and exclusive offers.</p>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button className="newsletter-button">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WhatsNew;