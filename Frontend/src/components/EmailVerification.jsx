import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './EmailVerification.css';

const EmailVerification = ({ email, onSuccess, onCancel }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const { verifyEmail, resendVerificationCode, loading, error, clearError } = useAuth();
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle input change
  const handleInputChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6 && /^\d$/.test(char)) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      
      // Focus last filled input or next empty
      const lastFilledIndex = Math.min(index + pastedCode.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    } else if (/^\d$/.test(value) || value === '') {
      // Handle single digit
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    
    clearError();
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle verification
  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      return;
    }

    const result = await verifyEmail(email, verificationCode);
    if (result.success) {
      onSuccess(result.message);
    }
  };

  // Handle resend
  const handleResend = async () => {
    setIsResending(true);
    setResendMessage('');
    
    const result = await resendVerificationCode(email);
    if (result.success) {
      setResendMessage('Verification code sent successfully!');
      setTimeLeft(900); // Reset timer
      setCode(['', '', '', '', '', '']); // Clear current code
      inputRefs.current[0]?.focus(); // Focus first input
    } else {
      setResendMessage(result.error || 'Failed to resend code');
    }
    
    setIsResending(false);
    
    // Clear message after 5 seconds
    setTimeout(() => setResendMessage(''), 5000);
  };

  // Auto-submit when code is complete
  useEffect(() => {
    const verificationCode = code.join('');
    if (verificationCode.length === 6) {
      handleVerify();
    }
  }, [code]);

  return (
    <div className="email-verification-overlay">
      <div className="email-verification-modal">
        <div className="verification-header">
          <div className="verification-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1.95c-5.52 0-10 4.48-10 10s4.48 10 10 10h5v-2h-5c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57v-1.43c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.53 3.5-3.5v-1.43c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
            </svg>
          </div>
          <h2>Verify Your Email</h2>
          <p>We've sent a 6-digit verification code to</p>
          <span className="email-display">{email}</span>
        </div>

        <div className="verification-content">
          <div className="code-input-container">
            <label>Enter verification code</label>
            <div className="code-inputs">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`code-input ${error ? 'error' : ''}`}
                  maxLength={6} // Allow paste
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {error}
            </div>
          )}

          {resendMessage && (
            <div className={`info-message ${resendMessage.includes('success') ? 'success' : 'error'}`}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {resendMessage}
            </div>
          )}

          <div className="verification-timer">
            {timeLeft > 0 ? (
              <span>Code expires in {formatTime(timeLeft)}</span>
            ) : (
              <span className="expired">Code has expired</span>
            )}
          </div>

          <div className="verification-actions">
            <button
              onClick={handleResend}
              disabled={isResending || timeLeft > 840} // Allow resend after 1 minute
              className="resend-button"
            >
              {isResending ? (
                <>
                  <span className="loading-spinner">⟳</span>
                  Sending...
                </>
              ) : (
                'Resend Code'
              )}
            </button>

            <button
              onClick={onCancel}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>

          <div className="verification-info">
            <p>
              <strong>Didn't receive the email?</strong> Check your spam folder or try resending the code.
              Make sure the email address is correct.
            </p>
          </div>
        </div>

        {loading && (
          <div className="verification-loading">
            <div className="loading-spinner">⟳</div>
            <span>Verifying code...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification; 