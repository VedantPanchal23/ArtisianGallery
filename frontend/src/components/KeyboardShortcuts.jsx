import React, { Component } from 'react';
import { Keyboard, Navigation, Palette, User, Accessibility, Lightbulb, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import './KeyboardShortcuts.css';

class KeyboardShortcuts extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      activeCategory: 'general',
      searchQuery: ''
    };
  }

  componentDidMount() {
    document.title = 'Keyboard Shortcuts - ArtHive';
  }

  setActiveCategory = (category) => {
    this.setState({ activeCategory: category });
  };

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  render() {
    const { user, logout } = this.context;
    const { activeCategory, searchQuery } = this.state;

    const categories = [
      { id: 'general', label: 'General', icon: Keyboard },
      { id: 'navigation', label: 'Navigation', icon: Navigation },
      { id: 'artwork', label: 'Artwork', icon: Palette },
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'accessibility', label: 'Accessibility', icon: Accessibility }
    ];

    const shortcuts = {
      general: [
        { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts' },
        { keys: ['Ctrl', 'K'], description: 'Focus search bar' },
        { keys: ['Escape'], description: 'Close modals, dropdowns, or cancel actions' },
        { keys: ['Enter'], description: 'Submit forms or confirm actions' },
        { keys: ['Tab'], description: 'Navigate between interactive elements' },
        { keys: ['Shift', 'Tab'], description: 'Navigate backwards between elements' }
      ],
      navigation: [
        { keys: ['H'], description: 'Go to Home' },
        { keys: ['E'], description: 'Go to Explore' },
        { keys: ['P'], description: 'Go to Profile' },
        { keys: ['C'], description: 'Go to Cart' },
        { keys: ['U'], description: 'Go to Upload Artwork' },
        { keys: ['S'], description: 'Go to Settings' },
        { keys: ['?'], description: 'Go to Help Center' }
      ],
      artwork: [
        { keys: ['L'], description: 'Like/unlike artwork (when viewing)' },
        { keys: ['S'], description: 'Save artwork to favorites' },
        { keys: ['F'], description: 'Follow artist' },
        { keys: ['R'], description: 'Report artwork' },
        { keys: ['D'], description: 'Download artwork (if purchased)' },
        { keys: ['←', '→'], description: 'Navigate between artworks in gallery' }
      ],
      profile: [
        { keys: ['Ctrl', 'S'], description: 'Save profile changes' },
        { keys: ['Ctrl', 'U'], description: 'Upload new profile picture' },
        { keys: ['Ctrl', 'E'], description: 'Edit profile information' },
        { keys: ['Delete'], description: 'Delete selected item (with confirmation)' }
      ],
      accessibility: [
        { keys: ['Alt', 'H'], description: 'Skip to main content' },
        { keys: ['Alt', 'N'], description: 'Skip to navigation' },
        { keys: ['Alt', 'S'], description: 'Skip to search' },
        { keys: ['Ctrl', '+'], description: 'Increase text size' },
        { keys: ['Ctrl', '-'], description: 'Decrease text size' },
        { keys: ['Ctrl', '0'], description: 'Reset text size' }
      ]
    };

    const filteredShortcuts = shortcuts[activeCategory] || [];
    const filteredCategories = categories.filter(category =>
      category.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcuts[category.id].some(shortcut =>
        shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shortcut.keys.some(key => key.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );

    return (
      <div className="keyboard-shortcuts">
        {/* Header */}
        <header className="shortcuts-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="display-lg">Keyboard Shortcuts</h1>
              <p className="text-lg text-secondary">Master ArtHive with keyboard shortcuts for faster navigation</p>
            </div>
            {user && <ProfileDropdown user={user} onLogout={logout} />}
          </div>
        </header>

        {/* Search */}
        <div className="shortcuts-search">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search shortcuts..."
              value={searchQuery}
              onChange={this.handleSearch}
              className="search-input"
            />
            <button className="search-button">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="shortcuts-content">
          <div className="shortcuts-sidebar">
            <h2 className="sidebar-title">Categories</h2>
            <nav className="category-nav">
              {filteredCategories.map(category => (
                <button
                  key={category.id}
                  className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => this.setActiveCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-label">{category.label}</span>
                  <span className="category-count">{shortcuts[category.id].length}</span>
                </button>
              ))}
            </nav>

            <div className="shortcuts-tip">
              <h3><Lightbulb size={20} /> Pro Tip</h3>
              <p>Press <kbd>Ctrl</kbd> + <kbd>/</kbd> anytime to see this shortcuts reference.</p>
            </div>
          </div>

          <div className="shortcuts-main">
            <div className="category-header">
              <h2 className="category-title">
                {categories.find(cat => cat.id === activeCategory)?.icon}{' '}
                {categories.find(cat => cat.id === activeCategory)?.label} Shortcuts
              </h2>
              <p className="category-description">
                {activeCategory === 'general' && 'Essential shortcuts for everyday use'}
                {activeCategory === 'navigation' && 'Quick navigation between pages and sections'}
                {activeCategory === 'artwork' && 'Interact with artworks and artists'}
                {activeCategory === 'profile' && 'Manage your profile and settings'}
                {activeCategory === 'accessibility' && 'Accessibility and usability shortcuts'}
              </p>
            </div>

            <div className="shortcuts-grid">
              {filteredShortcuts.map((shortcut, index) => (
                <div key={index} className="shortcut-card">
                  <div className="shortcut-keys">
                    {shortcut.keys.map((key, keyIndex) => (
                      <React.Fragment key={keyIndex}>
                        <kbd className="key">{key}</kbd>
                        {keyIndex < shortcut.keys.length - 1 && (
                          <span className="key-separator">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="shortcut-description">
                    {shortcut.description}
                  </div>
                </div>
              ))}
            </div>

            {filteredShortcuts.length === 0 && (
              <div className="no-shortcuts">
              <div className="no-shortcuts-content">
                <Search size={48} className="no-shortcuts-icon" />
                <h3>No shortcuts found</h3>
                <p>Try adjusting your search or select a different category.</p>
              </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="quick-reference">
          <div className="reference-container">
            <h2>Quick Reference</h2>
            <div className="reference-grid">
              <div className="reference-item">
                <kbd className="key">H</kbd>
                <span>Home</span>
              </div>
              <div className="reference-item">
                <kbd className="key">E</kbd>
                <span>Explore</span>
              </div>
              <div className="reference-item">
                <kbd className="key">P</kbd>
                <span>Profile</span>
              </div>
              <div className="reference-item">
                <kbd className="key">C</kbd>
                <span>Cart</span>
              </div>
              <div className="reference-item">
                <kbd className="key">S</kbd>
                <span>Settings</span>
              </div>
              <div className="reference-item">
                <kbd className="key">?</kbd>
                <span>Help</span>
              </div>
              <div className="reference-item">
                <kbd className="key">Ctrl</kbd> <span className="key-separator">+</span> <kbd className="key">/</kbd>
                <span>Shortcuts</span>
              </div>
              <div className="reference-item">
                <kbd className="key">Escape</kbd>
                <span>Close/Cancel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default KeyboardShortcuts;