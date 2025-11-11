import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import './ContactUs.css';

class ContactUs extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      body: '',
      loading: false,
      success: false,
      error: ''
    };
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: ''
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    
    var name = this.state.name;
    var email = this.state.email;
    var body = this.state.body;
    
    if (!name.trim() || !email.trim() || !body.trim()) {
      this.setState({ error: 'All fields are required.' });
      return;
    }

    // Email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.setState({ error: 'Please enter a valid email address.' });
      return;
    }

    this.setState({ loading: true, error: '' });

    try {
      // In a real app, you would send this to your backend
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.setState({ 
        success: true,
        name: '',
        email: '',
        body: ''
      });
    } catch (error) {
      this.setState({ error: 'Failed to send message. Please try again.' });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    var name = this.state.name;
    var email = this.state.email;
    var body = this.state.body;
    var loading = this.state.loading;
    var success = this.state.success;
    var error = this.state.error;
    const { isAuthenticated, user } = this.context;

    if (success) {
      return (
        <div className="contact-page">
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
                      <ProfileDropdown
                        user={user}
                        onLogout={() => this.context.logout()}
                      />
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="contact-container">
            <div className="success-message">
              <h2>Message Sent!</h2>
              <p>Thank you for contacting us. We'll get back to you soon.</p>
              <button 
                className="btn-primary"
                onClick={() => this.setState({ success: false })}
              >
                Send Another Message
              </button>
              <a href="/" className="back-link">← Back to Home</a>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="contact-page">
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
                    <ProfileDropdown
                      user={user}
                      onLogout={() => this.context.logout()}
                    />
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="contact-container">
          <div className="contact-form">
            <h1>Contact Us</h1>
            <p className="contact-subtitle">Get in touch with the ArtHive team</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={name}
                onChange={this.handleInputChange}
                required
              />
              
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={email}
                onChange={this.handleInputChange}
                required
              />
              
              <textarea
                name="body"
                placeholder="Your Message"
                value={body}
                onChange={this.handleInputChange}
                rows="6"
                required
              />
              
              <button 
                type="submit" 
                disabled={loading}
                className="submit-btn"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
            
            <div className="back-link-container">
              <a href="/" className="back-link">← Back to Home</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ContactUs;