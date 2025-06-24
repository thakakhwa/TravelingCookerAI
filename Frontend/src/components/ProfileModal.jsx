import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import './ProfileModal.css';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, deleteAccount } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const {
    register: registerDelete,
    handleSubmit: handleDeleteSubmit,
    formState: { errors: deleteErrors },
    reset: resetDelete
  } = useForm();

  const newPassword = watch('newPassword');

  // Close modal and reset form
  const handleClose = () => {
    reset();
    resetDelete();
    setSuccess('');
    setError('');
    setIsChangingPassword(false);
    setIsDeleting(false);
    onClose();
  };

  // Handle password change
  const onSubmit = async (data) => {
    try {
      setError('');
      setSuccess('');
      
      const response = await fetch('http://localhost:3001/api/user/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('travelcooker_token')}`
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        })
      });

      if (response.ok) {
        setSuccess('Password changed successfully!');
        reset();
        setIsChangingPassword(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to change password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle account deletion
  const onDeleteSubmit = async (data) => {
    try {
      setError('');
      setSuccess('');
      
      const result = await deleteAccount(data.password);
      
      if (result.success) {
        setSuccess('Account deleted successfully. You will be logged out.');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={handleClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <button className="profile-modal-close" onClick={handleClose}>
          ✕
        </button>
        
        <div className="profile-modal-header">
          <h2>Profile Settings</h2>
          <p>Manage your account information</p>
        </div>

        <div className="profile-content">
          {/* User Information */}
          <div className="profile-section">
            <h3>Account Information</h3>
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Username</span>
                <span className="info-value">{user?.username}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Member Since</span>
                <span className="info-value">{formatJoinDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="profile-section">
            <div className="section-header">
              <h3>Security</h3>
              {!isChangingPassword && (
                <button 
                  className="change-password-btn"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword && (
              <form className="password-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    {...register('currentPassword', {
                      required: 'Current password is required'
                    })}
                    className={errors.currentPassword ? 'error' : ''}
                    placeholder="Enter current password"
                  />
                  {errors.currentPassword && (
                    <span className="error-message">{errors.currentPassword.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    {...register('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className={errors.newPassword ? 'error' : ''}
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                    <span className="error-message">{errors.newPassword.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...register('confirmPassword', {
                      required: 'Please confirm your new password',
                      validate: value => value === newPassword || 'Passwords do not match'
                    })}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword.message}</span>
                  )}
                </div>

                {/* Success/Error Messages */}
                {success && <div className="success-message">{success}</div>}
                {error && <div className="error-message-box">{error}</div>}

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setIsChangingPassword(false);
                      reset();
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Account Management - Delete Account */}
          <div className="profile-section danger-zone">
            <div className="section-header">
              <h3>Account Management</h3>
              {!isDeleting && (
                <button 
                  className="delete-account-btn"
                  onClick={() => setIsDeleting(true)}
                >
                  Delete Account
                </button>
              )}
            </div>

            {isDeleting && (
              <div className="delete-form-container">
                <div className="delete-warning">
                  <h4>⚠️ Permanently Delete Account</h4>
                  <p>
                    This action cannot be undone. This will permanently delete your account,
                    all your travel plans, chat history, and remove all associated data.
                  </p>
                </div>
                
                <form className="delete-form" onSubmit={handleDeleteSubmit(onDeleteSubmit)}>
                  <div className="form-group">
                    <label htmlFor="deletePassword">Confirm Password</label>
                    <input
                      type="password"
                      id="deletePassword"
                      {...registerDelete('password', {
                        required: 'Password is required to delete account'
                      })}
                      className={deleteErrors.password ? 'error' : ''}
                      placeholder="Enter your password to confirm"
                    />
                    {deleteErrors.password && (
                      <span className="error-message">{deleteErrors.password.message}</span>
                    )}
                  </div>

                  {/* Success/Error Messages */}
                  {success && <div className="success-message">{success}</div>}
                  {error && <div className="error-message-box">{error}</div>}

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => {
                        setIsDeleting(false);
                        resetDelete();
                        setError('');
                        setSuccess('');
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="delete-confirm-btn">
                      Yes, Delete My Account
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal; 