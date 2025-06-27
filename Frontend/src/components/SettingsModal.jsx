import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { t } = useTranslation();

  // Close modal
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={handleClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <button className="settings-modal-close" onClick={handleClose}>
          ✕
        </button>
        
        <div className="settings-modal-header">
          <h2>{t('settings.title')}</h2>
          <p>{t('settings.subtitle')}</p>
        </div>

        <div className="settings-content">
          {/* Theme Settings Section */}
          <div className="settings-section">
            <h3>{t('settings.appearance')}</h3>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.theme')}</span>
                <span className="setting-description">
                  {t('settings.themeDesc')}
                </span>
              </div>
              <div className="theme-toggle-container">
                <span className="theme-label">🌙</span>
                <button
                  className={`theme-toggle ${isDark ? 'dark' : 'light'}`}
                  onClick={toggleTheme}
                  aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
                >
                  <div className="toggle-slider"></div>
                </button>
                <span className="theme-label">☀️</span>
              </div>
            </div>
          </div>

          {/* Language Settings Section */}
          <div className="settings-section">
            <h3>{t('settings.languageAndRegion')}</h3>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.language')}</span>
                <span className="setting-description">
                  {t('settings.languageDesc')}
                </span>
              </div>
              <LanguageSelector />
            </div>
          </div>

          {/* Future settings sections can be added here */}
          <div className="settings-section">
            <h3>{t('settings.preferences')}</h3>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.notifications')}</span>
                <span className="setting-description">
                  {t('settings.notificationsDesc')}
                </span>
              </div>
              <div className="setting-placeholder">
                <span className="coming-soon">{t('settings.comingSoon')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 