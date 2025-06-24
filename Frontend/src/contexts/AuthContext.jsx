import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configure axios defaults
const API_BASE_URL = 'http://localhost:3001/api';
axios.defaults.baseURL = API_BASE_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const getToken = () => localStorage.getItem('travelcooker_token');
  
  // Set token in localStorage and axios headers
  const setToken = (token) => {
    if (token) {
      localStorage.setItem('travelcooker_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('travelcooker_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getToken();
        if (token) {
          // Set token in axios headers
          setToken(token);
          
          // Verify token and get user info
          const response = await axios.get('/auth/me');
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        // Invalid token, remove it
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/auth/register', userData);
      const { user: newUser, requiresVerification } = response.data;
      
      // Don't set token or user if verification is required
      if (requiresVerification) {
        return { 
          success: true, 
          user: newUser, 
          requiresVerification: true,
          message: response.data.message
        };
      }
      
      // Legacy support for immediate login (if verification is disabled)
      const { token } = response.data;
      setToken(token);
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/auth/login', credentials);
      const { user: loggedInUser, token } = response.data;
      
      setToken(token);
      setUser(loggedInUser);
      
      return { success: true, user: loggedInUser };
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.error || 'Login failed';
      
      setError(errorMessage);
      
      // Check if verification is required
      if (errorData?.requiresVerification) {
        return { 
          success: false, 
          error: errorMessage,
          requiresVerification: true,
          email: errorData.email
        };
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, code) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/auth/verify-email', { email, code });
      const { user: verifiedUser, token, message } = response.data;
      
      setToken(token);
      setUser(verifiedUser);
      
      return { success: true, user: verifiedUser, message };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      setError(null);
      
      const response = await axios.post('/auth/resend-verification', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to resend code';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if user is logged in
      if (user) {
        await axios.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      setError(null);
    }
  };

  const clearError = () => setError(null);

  const deleteAccount = async (password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.delete('/user/account', {
        data: { password }
      });
      
      // After successful deletion, log out the user
      setToken(null);
      setUser(null);
      setError(null);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete account';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    verifyEmail,
    resendVerificationCode,
    deleteAccount,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 