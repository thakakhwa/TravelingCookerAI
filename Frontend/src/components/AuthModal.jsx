import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import EmailVerification from './EmailVerification';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState(defaultMode); // 'login' or 'signup'
  const [showVerification, setShowVerification] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login, register, error, loading, clearError } = useAuth();

  // Update mode when defaultMode prop changes
  React.useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
    }
  }, [defaultMode, isOpen]);
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const password = watch('password');

  // Close modal and reset form
  const handleClose = () => {
    reset();
    clearError();
    setMode(defaultMode); // Reset to default mode when closing
    setShowVerification(false);
    setPendingVerificationEmail('');
    setSuccessMessage('');
    onClose();
  };

  // Switch between login and signup
  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    reset();
    clearError();
  };

  // Handle form submission
  const onSubmit = async (data) => {
    let result;
    
    if (mode === 'login') {
      result = await login({
        email: data.email,
        password: data.password
      });
      
      if (result.success) {
        handleClose();
      } else if (result.requiresVerification) {
        setPendingVerificationEmail(result.email || data.email);
        setShowVerification(true);
      }
    } else {
      result = await register({
        email: data.email,
        username: data.username,
        password: data.password
      });
      
      if (result.success) {
        if (result.requiresVerification) {
          setPendingVerificationEmail(data.email);
          setShowVerification(true);
        } else {
          handleClose();
        }
      }
    }
  };

  // Handle successful verification
  const handleVerificationSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  // Handle verification cancel
  const handleVerificationCancel = () => {
    setShowVerification(false);
    setPendingVerificationEmail('');
  };

  // Handle OAuth login
  const handleOAuthLogin = (provider) => {
    const API_BASE_URL = 'http://localhost:3001/api';
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  if (!isOpen) return null;

  // Show verification modal if needed
  if (showVerification) {
    return (
      <EmailVerification
        email={pendingVerificationEmail}
        onSuccess={handleVerificationSuccess}
        onCancel={handleVerificationCancel}
      />
    );
  }

  // Show success message
  if (successMessage) {
    return (
      <div className="auth-modal-overlay">
        <div className="auth-modal success-modal">
          <div className="success-content">
            <div className="success-icon">🎉</div>
            <h2>Welcome to TravelCooker!</h2>
            <p>{successMessage}</p>
            <div className="success-loading">
              <div className="loading-spinner"></div>
              <span>Redirecting...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={handleClose}>
          ✕
        </button>
        
        <div className="auth-modal-header">
          <h2>{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
          <p>
            {mode === 'login' 
              ? 'Sign in to access your travel history' 
              : 'Join TravelCooker to save your trips'
            }
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              {...registerField('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          {/* Username Field (Signup only) */}
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                {...registerField('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  },
                  maxLength: {
                    value: 30,
                    message: 'Username must be less than 30 characters'
                  }
                })}
                className={errors.username ? 'error' : ''}
                placeholder="Choose a username"
              />
              {errors.username && <span className="error-message">{errors.username.message}</span>}
            </div>
          )}

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...registerField('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          {/* Confirm Password Field (Signup only) */}
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                {...registerField('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* OAuth Buttons - Temporarily disabled until OAuth credentials are configured */}
        {false && (
          <>
            {/* OAuth Divider */}
            <div className="oauth-divider">
              <span>or continue with</span>
            </div>

            {/* OAuth Buttons */}
            <div className="oauth-buttons">
              <button 
                type="button" 
                className="oauth-btn google-btn"
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
              >
                <svg className="oauth-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              
              <button 
                type="button" 
                className="oauth-btn microsoft-btn"
                onClick={() => handleOAuthLogin('microsoft')}
                disabled={loading}
              >
                <svg className="oauth-icon" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M1 1h10v10H1z"/>
                  <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                  <path fill="#7fba00" d="M1 13h10v10H1z"/>
                  <path fill="#ffb900" d="M13 13h10v10H13z"/>
                </svg>
                Microsoft
              </button>
            </div>
          </>
        )}

        {/* Switch Mode */}
        <div className="auth-switch">
          <p>
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button type="button" onClick={switchMode} className="switch-mode-btn">
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 