import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // Not logged in or expired token
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return data.user;
    } catch (error) {
      toast.error(error.message || 'Login failed.');
      throw error;
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      setUser(data.user);
      toast.success(`Account registered successfully as ${data.user.role.toUpperCase()}!`);
      return data.user;
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
      throw error;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Continue even if server logout endpoint has network issue
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully.');
    }
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/auth/profile', profileData);
      setUser(data.user);
      toast.success('Profile updated successfully!');
      return data.user;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
