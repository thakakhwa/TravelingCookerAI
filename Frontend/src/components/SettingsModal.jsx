import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme, toggleTheme, isDark } = useTheme();

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
          <h2>Settings</h2>
          <p>Customize your experience</p>
        </div>

        <div className="settings-content">
          {/* Theme Settings Section */}
          <div className="settings-section">
            <h3>Appearance</h3>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Theme</span>
                <span className="setting-description">
                  Choose between light and dark theme
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

          {/* Future settings sections can be added here */}
          <div className="settings-section">
            <h3>Preferences</h3>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Notifications</span>
                <span className="setting-description">
                  Manage your notification preferences
                </span>
              </div>
              <div className="setting-placeholder">
                <span className="coming-soon">Coming Soon</span>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Language & Region</h3>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Language</span>
                <span className="setting-description">
                  Choose your preferred language
                </span>
              </div>
              <div className="setting-placeholder">
                <span className="coming-soon">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 