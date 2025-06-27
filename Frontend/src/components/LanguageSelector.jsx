import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, getLanguages, getCurrentLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = getLanguages();
  const selectedLanguage = getCurrentLanguage();

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <button
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('settings.languageDesc')}
      >
        <span className="language-name">{selectedLanguage.nativeName}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${language.code === currentLanguage ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <div className="language-info">
                <span className="language-native">{language.nativeName}</span>
                <span className="language-english">{language.name}</span>
              </div>
              {language.code === currentLanguage && (
                <span className="check-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 