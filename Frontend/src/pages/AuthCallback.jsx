import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      const error = urlParams.get('error');

      if (location.pathname.includes('/auth/error') || error) {
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        setTimeout(() => {
          navigate('/');
        }, 3000);
        return;
      }

      if (token) {
        try {
          // Store token and get user info
          localStorage.setItem('travelcooker_token', token);
          
          // Set axios headers
          const axios = (await import('axios')).default;
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user info
          const response = await axios.get('http://localhost:3001/api/auth/me');
          
          // Update auth context (simulating the setToken and setUser functions)
          setStatus('success');
          setMessage(`Welcome ${response.data.user.username}! You're now signed in.`);
          
          // Redirect to home after success
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } catch (error) {
          console.error('Error handling OAuth callback:', error);
          setStatus('error');
          setMessage('Failed to complete authentication. Please try again.');
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } else {
        setStatus('error');
        setMessage('No authentication token received.');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="auth-callback">
      <div className="callback-container">
        {status === 'processing' && (
          <div className="callback-processing">
            <div className="spinner-large">⟳</div>
            <h2>Completing your sign-in...</h2>
            <p>Please wait while we finalize your authentication.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="callback-success">
            <div className="success-icon-large">🎉</div>
            <h2>Welcome to TravelCooker!</h2>
            <p>{message}</p>
            <div className="redirect-info">
              <div className="spinner-small">⟳</div>
              <span>Redirecting you to the app...</span>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="callback-error">
            <div className="error-icon-large">❌</div>
            <h2>Authentication Failed</h2>
            <p>{message}</p>
            <div className="redirect-info">
              <div className="spinner-small">⟳</div>
              <span>Redirecting you back...</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .auth-callback {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }

        .callback-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 60px 40px;
          text-align: center;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .spinner-large {
          font-size: 48px;
          animation: spin 1s linear infinite;
          margin-bottom: 24px;
          color: #667eea;
        }

        .spinner-small {
          font-size: 16px;
          animation: spin 1s linear infinite;
          color: #6b7280;
        }

        .success-icon-large, .error-icon-large {
          font-size: 64px;
          margin-bottom: 24px;
          animation: bounceIn 0.6s ease-out;
        }

        .callback-container h2 {
          color: #1f2937;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .callback-container p {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .redirect-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 640px) {
          .callback-container {
            padding: 40px 24px;
            border-radius: 20px;
          }
          
          .callback-container h2 {
            font-size: 24px;
          }
          
          .spinner-large {
            font-size: 40px;
          }
          
          .success-icon-large, .error-icon-large {
            font-size: 56px;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback; 