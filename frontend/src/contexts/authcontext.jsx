import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/AuthService';

const AuthContext = createContext();

// Custom hook to use auth context
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

  // Initial auth check on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const { user } = await authService.getCurrentUser();
          setUser(user);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const { user } = await authService.login(email, password);
      setUser(user);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

  // Registration handler
  const register = async (email, password) => {
    try {
      const { user } = await authService.register(email, password);
      setUser(user);
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message };
    }
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
