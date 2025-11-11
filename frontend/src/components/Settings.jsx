import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Settings.css';

class Settings extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'security',
      profile: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        bio: '',
        website: '',
        location: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          marketing: false
        },
        privacy: {
          profileVisibility: 'public',
          showOnlineStatus: true,
          allowMessages: true
        }
      },
      security: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false
      },
      isLoading: false,
      message: null
    };
  }

  componentDidMount() {
    // Load user data from context or API
    this.loadUserSettings();
  }

  loadUserSettings = () => {
    // Get user data from AuthContext
    const user = this.context.user;
    
    if (user) {
      this.setState({
        profile: {
          firstName: user.name ? user.name.split(' ')[0] : '',
          lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
          email: user.email || '',
          phone: user.mobile || '',
          dateOfBirth: '',
          gender: '',
          bio: '',
          website: '',
          location: '',
          streetAddress: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        preferences: {
          theme: localStorage.getItem('theme') || 'system',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            marketing: false
          },
          privacy: {
            profileVisibility: 'public',
            showOnlineStatus: true,
            allowMessages: true
          }
        }
      });
    } else {
      // Fallback to placeholder data if user not available
      this.setState({
        profile: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          bio: '',
          website: '',
          location: '',
          streetAddress: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        preferences: {
          theme: localStorage.getItem('theme') || 'system',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            marketing: false
          },
          privacy: {
            profileVisibility: 'public',
            showOnlineStatus: true,
            allowMessages: true
          }
        }
      });
    }
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  handleProfileChange = (field, value) => {
    this.setState(prevState => ({
      profile: {
        ...prevState.profile,
        [field]: value
      }
    }));
  };

  handlePreferenceChange = (category, field, value) => {
    this.setState(prevState => ({
      preferences: {
        ...prevState.preferences,
        [category]: typeof prevState.preferences[category] === 'object'
          ? { ...prevState.preferences[category], [field]: value }
          : value
      }
    }));
  };

  handleSecurityChange = (field, value) => {
    this.setState(prevState => ({
      security: {
        ...prevState.security,
        [field]: value
      }
    }));
  };

  handleThemeChange = (theme) => {
    this.handlePreferenceChange('theme', null, theme);
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  handleSaveProfile = async () => {
    this.setState({ isLoading: true, message: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.setState({
        isLoading: false,
        message: { type: 'success', text: 'Profile updated successfully!' }
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        message: { type: 'error', text: 'Failed to update profile. Please try again.' }
      });
    }
  };

  handleSavePreferences = async () => {
    this.setState({ isLoading: true, message: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.setState({
        isLoading: false,
        message: { type: 'success', text: 'Preferences updated successfully!' }
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        message: { type: 'error', text: 'Failed to update preferences. Please try again.' }
      });
    }
  };

  handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = this.state.security;

    if (newPassword !== confirmPassword) {
      this.setState({
        message: { type: 'error', text: 'New passwords do not match.' }
      });
      return;
    }

    if (newPassword.length < 8) {
      this.setState({
        message: { type: 'error', text: 'Password must be at least 8 characters long.' }
      });
      return;
    }

    this.setState({ isLoading: true, message: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.setState({
        isLoading: false,
        message: { type: 'success', text: 'Password changed successfully!' },
        security: {
          ...this.state.security,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        message: { type: 'error', text: 'Failed to change password. Please try again.' }
      });
    }
  };

  render() {
    const { activeTab, profile, preferences, security, isLoading, message } = this.state;

    return (
      <div className="settings">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className="settings-container">
          <div className="settings-sidebar">
            <button
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => this.handleTabChange('profile')}
            >
              <span className="tab-icon">Profile</span>
              Profile
            </button>
            <button
              className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => this.handleTabChange('preferences')}
            >
              <span className="tab-icon">Preferences</span>
              Preferences
            </button>
            <button
              className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => this.handleTabChange('security')}
            >
              <span className="tab-icon">Security</span>
              Security
            </button>
          </div>

          <div className="settings-content">
            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            {activeTab === 'profile' && this.renderProfileTab()}
            {activeTab === 'preferences' && this.renderPreferencesTab()}
            {activeTab === 'security' && this.renderSecurityTab()}
          </div>
        </div>
      </div>
    );
  }

  renderProfileTab = () => {
    const { profile, isLoading } = this.state;

    return (
      <div className="settings-tab">
        <div className="tab-header">
          <h2>Profile Information</h2>
          <p>Update your personal information and public profile</p>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={profile.firstName}
              onChange={(e) => this.handleProfileChange('firstName', e.target.value)}
              placeholder="Enter your first name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={profile.lastName}
              onChange={(e) => this.handleProfileChange('lastName', e.target.value)}
              placeholder="Enter your last name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={profile.email}
              onChange={(e) => this.handleProfileChange('email', e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={profile.phone}
              onChange={(e) => this.handleProfileChange('phone', e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              value={profile.dateOfBirth}
              onChange={(e) => this.handleProfileChange('dateOfBirth', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={profile.gender}
              onChange={(e) => this.handleProfileChange('gender', e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="streetAddress">Street Address</label>
            <input
              type="text"
              id="streetAddress"
              value={profile.streetAddress}
              onChange={(e) => this.handleProfileChange('streetAddress', e.target.value)}
              placeholder="Enter your street address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={profile.city}
                onChange={(e) => this.handleProfileChange('city', e.target.value)}
                placeholder="City"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State/Province</label>
              <input
                type="text"
                id="state"
                value={profile.state}
                onChange={(e) => this.handleProfileChange('state', e.target.value)}
                placeholder="State"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zipCode">ZIP/Postal Code</label>
              <input
                type="text"
                id="zipCode"
                value={profile.zipCode}
                onChange={(e) => this.handleProfileChange('zipCode', e.target.value)}
                placeholder="ZIP Code"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                value={profile.country}
                onChange={(e) => this.handleProfileChange('country', e.target.value)}
                placeholder="Country"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => this.handleProfileChange('bio', e.target.value)}
              placeholder="Tell us about yourself"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              value={profile.website}
              onChange={(e) => this.handleProfileChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={profile.location}
              onChange={(e) => this.handleProfileChange('location', e.target.value)}
              placeholder="City, Country"
            />
          </div>
        </div>

        <div className="tab-actions">
          <button
            className="btn-primary"
            onClick={this.handleSaveProfile}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  };

  renderPreferencesTab = () => {
    const { preferences, isLoading } = this.state;

    return (
      <div className="settings-tab">
        <div className="tab-header">
          <h2>Preferences</h2>
          <p>Customize your experience and notification settings</p>
        </div>

        <div className="form-section">
          <div className="preference-group">
            <h3>Appearance</h3>
            <div className="theme-selector">
              <label className="radio-option">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={preferences.theme === 'light'}
                  onChange={(e) => this.handleThemeChange(e.target.value)}
                />
                <span className="radio-label">
                  <span className="theme-icon">Light</span>
                  Light
                </span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={preferences.theme === 'dark'}
                  onChange={(e) => this.handleThemeChange(e.target.value)}
                />
                <span className="radio-label">
                  <span className="theme-icon">Dark</span>
                  Dark
                </span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={preferences.theme === 'system'}
                  onChange={(e) => this.handleThemeChange(e.target.value)}
                />
                <span className="radio-label">
                  <span className="theme-icon">System</span>
                  System
                </span>
              </label>
            </div>
          </div>

          <div className="preference-group">
            <h3>Language</h3>
            <select
              value={preferences.language}
              onChange={(e) => this.handlePreferenceChange('language', null, e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div className="preference-group">
            <h3>Notifications</h3>
            <div className="checkbox-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={preferences.notifications.email}
                  onChange={(e) => this.handlePreferenceChange('notifications', 'email', e.target.checked)}
                />
                <span>Email notifications</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={preferences.notifications.push}
                  onChange={(e) => this.handlePreferenceChange('notifications', 'push', e.target.checked)}
                />
                <span>Push notifications</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={preferences.notifications.marketing}
                  onChange={(e) => this.handlePreferenceChange('notifications', 'marketing', e.target.checked)}
                />
                <span>Marketing communications</span>
              </label>
            </div>
          </div>

          <div className="preference-group">
            <h3>Privacy</h3>
            <div className="radio-group">
              <label>Profile Visibility</label>
              <select
                value={preferences.privacy.profileVisibility}
                onChange={(e) => this.handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
            <div className="checkbox-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={preferences.privacy.showOnlineStatus}
                  onChange={(e) => this.handlePreferenceChange('privacy', 'showOnlineStatus', e.target.checked)}
                />
                <span>Show online status</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={preferences.privacy.allowMessages}
                  onChange={(e) => this.handlePreferenceChange('privacy', 'allowMessages', e.target.checked)}
                />
                <span>Allow direct messages</span>
              </label>
            </div>
          </div>
        </div>

        <div className="tab-actions">
          <button
            className="btn-primary"
            onClick={this.handleSavePreferences}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    );
  };

  renderSecurityTab = () => {
    const { security, isLoading } = this.state;

    return (
      <div className="settings-tab">
        <div className="tab-header">
          <h2>Security</h2>
          <p>Manage your password and security settings</p>
        </div>

        <div className="form-section">
          <div className="security-section">
            <h3>Change Password</h3>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={security.currentPassword}
                onChange={(e) => this.handleSecurityChange('currentPassword', e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={security.newPassword}
                onChange={(e) => this.handleSecurityChange('newPassword', e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={security.confirmPassword}
                onChange={(e) => this.handleSecurityChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <button
              className="btn-secondary"
              onClick={this.handleChangePassword}
              disabled={isLoading}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>

          <div className="security-section">
            <h3>Two-Factor Authentication</h3>
            <div className="security-status">
              <div className="status-indicator">
                <span className={`status-dot ${security.twoFactorEnabled ? 'enabled' : 'disabled'}`}></span>
                <span>{security.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <p className="security-description">
                Add an extra layer of security to your account by requiring a second form of authentication.
              </p>
              <button className="btn-outline">
                {security.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
              </button>
            </div>
          </div>

          <div className="security-section">
            <h3>Active Sessions</h3>
            <div className="session-list">
              <div className="session-item current">
                <div className="session-info">
                  <span className="device-name">Chrome on Windows</span>
                  <span className="session-location">New York, NY • Current session</span>
                </div>
                <span className="session-time">Active now</span>
              </div>
              <div className="session-item">
                <div className="session-info">
                  <span className="device-name">Safari on iPhone</span>
                  <span className="session-location">New York, NY</span>
                </div>
                <div className="session-actions">
                  <span className="session-time">2 hours ago</span>
                  <button className="btn-link">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default Settings;