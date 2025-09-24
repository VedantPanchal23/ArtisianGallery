import React, { Component } from 'react';
import './AboutUs.css';

class AboutUs extends Component {
  render() {
    return (
      <div className="about-page">
        <div className="about-container">
          {/* Header Section */}
          <section className="about-header">
            <h1>About Us</h1>
            <p className="about-intro">
              ArtHive is a digital art marketplace built by a passionate team of AIML undergraduates, 
              designed to empower artists and provide a seamless art discovery experience for collectors. 
              Our mission is to create a secure, accessible, and user-friendly platform where creativity 
              thrives and digital art finds its true value.
            </p>
          </section>

          {/* Team Section */}
          <section className="team-section">
            <h2>👨‍💻 Meet the Team</h2>
            
            <div className="team-grid">
              {/* Team Member 1 */}
              <div className="team-member">
                <div className="member-card">
                  <div className="member-header">
                    <h3>Dax Virani</h3>
                    <span className="member-role">Team Leader · 23AIML076</span>
                    <span className="member-specialty">Backend & Database Developer</span>
                  </div>
                  <div className="member-description">
                    <p>Leads the team with vision and coordination.</p>
                    <p>Responsible for designing and maintaining scalable backend architecture and database management.</p>
                    <p>Ensures robust APIs and secure data handling for users and artworks.</p>
                  </div>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="team-member">
                <div className="member-card">
                  <div className="member-header">
                    <h3>Vedant Panchal</h3>
                    <span className="member-role">Advisor & Frontend Developer · 23AIML042</span>
                    <span className="member-specialty">UI/UX & Frontend Development</span>
                  </div>
                  <div className="member-description">
                    <p>Provides strategic guidance and feedback to the team.</p>
                    <p>Specializes in building responsive and intuitive user interfaces.</p>
                    <p>Focused on delivering a smooth, visually appealing experience for both artists and buyers.</p>
                  </div>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="team-member">
                <div className="member-card">
                  <div className="member-header">
                    <h3>Path Patel</h3>
                    <span className="member-role">Backend Integrator & Documentation · 23AIML055</span>
                    <span className="member-specialty">System Integration & Technical Documentation</span>
                  </div>
                  <div className="member-description">
                    <p>Connects backend APIs with frontend components for seamless communication.</p>
                    <p>Manages technical documentation, ensuring clarity and usability for future development.</p>
                    <p>Works on optimizing workflows between design and implementation.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vision Section */}
          <section className="vision-section">
            <h2>🌟 Our Vision</h2>
            <div className="vision-content">
              <p>
                To bridge the gap between creativity and technology by offering a centralized digital art 
                marketplace that is artist-friendly, secure, and scalable — without the complexity of blockchain.
              </p>
            </div>
          </section>

          {/* Back Link */}
          <div className="back-link-container">
            <a href="/" className="back-link">← Back to Home</a>
          </div>
        </div>
      </div>
    );
  }
}

export default AboutUs;