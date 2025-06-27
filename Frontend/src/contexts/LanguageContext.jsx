import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    setIsRTL(rtlLanguages.includes(currentLanguage));
    
    // Keep document direction as LTR always to maintain layout
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = currentLanguage;
    
    // Add language class to body for CSS styling
    document.body.classList.remove('lang-en', 'lang-ar');
    document.body.classList.add(`lang-${currentLanguage}`);
    
    // Add RTL class for text direction only, not layout
    if (rtlLanguages.includes(currentLanguage)) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [currentLanguage]);

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setCurrentLanguage(langCode);
  };

  const getLanguages = () => [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English'
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية'
    }
  ];

  const getCurrentLanguage = () => {
    return getLanguages().find(lang => lang.code === currentLanguage) || getLanguages()[0];
  };

  const value = {
    currentLanguage,
    isRTL,
    changeLanguage,
    getLanguages,
    getCurrentLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 