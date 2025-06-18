import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState(defaultMode); // 'login' or 'signup'
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
    } else {
      result = await register({
        email: data.email,
        username: data.username,
        password: data.password
      });
    }

    if (result.success) {
      handleClose();
    }
  };

  if (!isOpen) return null;

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
              <span className="loading-spinner">⟳</span>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

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