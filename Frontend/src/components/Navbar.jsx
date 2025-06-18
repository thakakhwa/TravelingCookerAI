import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

function Navbar() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
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
  
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <span className="logo-text">TravelingCooker</span>
            <span className="ai-badge">AI</span>
          </Link>
        </div>
        
        <ul className="navbar-links">
          <li className={isActive('/')}>
            <Link to="/">Home</Link>
          </li>
          <li className={isActive('/about')}>
            <Link to="/about">About Our AI</Link>
          </li>
          <li className={isActive('/contact')}>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        
        <div className="navbar-auth">
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
                    <p className="user-since">Member since {new Date(user?.createdAt).getFullYear()}</p>
                  </div>
                  <hr />
                  <button className="dropdown-item">
                    <span>📝</span> My Chat History
                  </button>
                  <button className="dropdown-item">
                    <span>⚙️</span> Settings
                  </button>
                  <hr />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <span>🚪</span> Sign Out
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
                Sign In
              </button>
              <button 
                className="signup-btn"
                onClick={() => handleAuthClick('signup')}
              >
                Sign Up
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
    </>
  );
}

export default Navbar; 