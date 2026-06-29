import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore session state on load
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setAdminUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Session restoration failed:', err);
        // Clean up corrupt items
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Log in administrative credentials
   */
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, admin } = response.data;

      localStorage.setItem('adminToken', receivedToken);
      localStorage.setItem('adminUser', JSON.stringify(admin));

      setToken(receivedToken);
      setAdminUser(admin);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message };
    }
  };

  /**
   * Register a new admin account
   */
  const register = async (username, email, password, registrationCode) => {
    try {
      const response = await api.post('/auth/register', { 
        username, 
        email, 
        password, 
        registrationCode 
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, message };
    }
  };

  /**
   * Clear session token and profile state
   */
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    adminUser,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook to consume Auth state
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed within an AuthProvider.');
  }
  return context;
};
