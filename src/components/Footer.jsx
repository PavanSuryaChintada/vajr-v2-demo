import React from 'react';

const Footer = () => {
  return (
    <footer className="target-footer">
      <div className="target-container">
        <div className="target-footer-grid">
          <div className="target-footer-brand">
            <div className="target-footer-logo">
              <span className="target-logo-title">VAJR</span>
              <div className="target-logo-line"></div>
              <span className="target-logo-subtitle">JEWELS</span>
            </div>
            <p className="target-footer-text">
              Crafting eternity since 1985. The premier destination for ultra-luxury
              Indian fine jewelry, specializing in rare diamonds and majestic
              emeralds.
            </p>
          </div>
          <div className="target-footer-links">
            <h4>Explore</h4>
            <ul>
              <li><a href="#collections">Collections</a></li>
              <li><a href="#bridal">Bridal</a></li>
              <li><a href="#craftsmanship">High Jewelry</a></li>
              <li><a href="#about">Our Heritage</a></li>
            </ul>
          </div>
          <div className="target-footer-contact">
            <h4>Contact</h4>
            <ul>
              <li>Boutique: Taj Mansingh, New Delhi</li>
              <li>+91 999 999 9999</li>
              <li>concierge@vajrjewels.com</li>
              <li><a href="#" className="target-gold-text">@vajrjewelsofficial</a></li>
            </ul>
          </div>
        </div>
        <div className="target-footer-divider"></div>
        <div className="target-footer-bottom">
          <p>&copy; 2025 VAJR JEWELS Private Limited. All Rights Reserved.</p>
          <div className="target-footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
