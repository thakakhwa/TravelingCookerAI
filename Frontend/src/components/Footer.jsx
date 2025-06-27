import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3 className="footer-logo">
            TravelingCooker<span className="ai-text">AI</span>
          </h3>
        </div>
        
        <div className="footer-links">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 TravelingCookerAI. {t('footer.allRightsReserved')}</p>
      </div>
    </footer>
  );
};

export default Footer; 