import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3 className="footer-logo">
            TravelingCooker<span className="ai-text">AI</span>
          </h3>
        </div>
        
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 TravelingCookerAI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 