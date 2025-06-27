import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import AuthModal from './AuthModal';
import ProfileModal from './ProfileModal';
import SettingsModal from './SettingsModal';

function Navbar({ sidebarCollapsed, onToggleSidebar, onNewChat }) {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setShowUserMenu(false);
  };

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
    setShowUserMenu(false);
  };

  // Determine logo classes based on sidebar state and current page
  const getLogoClasses = () => {
    if (!isAuthenticated || location.pathname !== '/') return 'navbar-logo';
    return `navbar-logo ${sidebarCollapsed ? 'sidebar-collapsed' : 'with-sidebar'}`;
  };

  return (
    <>
      {/* Sidebar Controls - Fixed at top-left corner - Only show on home page */}
      {isAuthenticated && location.pathname === '/' && (
        <div className="sidebar-controls-fixed">
          <button 
            className="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            title={sidebarCollapsed ? 'Show chat history' : 'Hide chat history'}
          >
            <span className="toggle-icon">
              {sidebarCollapsed ? '☰' : '✕'}
            </span>
          </button>
          
          {sidebarCollapsed && (
            <button 
              className="new-chat-btn-nav"
              onClick={onNewChat}
              title="Start new chat"
            >
              <span className="chat-icon">＋</span>
            </button>
          )}
        </div>
      )}

      <nav className="navbar">
        <div className={getLogoClasses()}>
          <Link to="/">
            <span className="logo-text">
              TravelingCooker<span className="ai-part">AI</span>
            </span>
          </Link>
        </div>
        
        <div className="navbar-center">
          <ul className="navbar-links">
            <li className={isActive('/')}>
              <Link to="/">{t('nav.home')}</Link>
            </li>
            <li className={isActive('/plans')}>
              <Link to="/plans">{t('nav.plans')}</Link>
            </li>
            <li className={isActive('/about')}>
              <Link to="/about">{t('nav.about')}</Link>
            </li>
            <li className={isActive('/contact')}>
              <Link to="/contact">{t('nav.contact')}</Link>
            </li>
          </ul>
        </div>
        
        <div className={`navbar-auth ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-icon">👤</span>
                <span className="username">{user?.username}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-email">{user?.email}</p>
                  </div>
                  <hr />
                  <button className="dropdown-item" onClick={handleSettingsClick}>
                    <span>⚙️</span> {t('nav.settings')}
                  </button>
                  <button className="dropdown-item" onClick={handleProfileClick}>
                    <span>👤</span> {t('nav.profile')}
                  </button>
                  <hr />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <span>🚪</span> {t('nav.signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="login-btn"
                onClick={() => handleAuthClick('login')}
              >
                {t('nav.signIn')}
              </button>
              <button 
                className="signup-btn"
                onClick={() => handleAuthClick('signup')}
              >
                {t('nav.signUp')}
              </button>
            </div>
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />

      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      <SettingsModal 
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
}

export default Navbar; 