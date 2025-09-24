import React, { Component } from 'react';
import './ContactUs.css';

class ContactUs extends Component {
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
    
    const { name, email, body } = this.state;
    
    if (!name.trim() || !email.trim() || !body.trim()) {
      this.setState({ error: 'All fields are required.' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+₹/;
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
    const { name, email, body, loading, success, error } = this.state;

    if (success) {
      return (
        <div className="contact-page">
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