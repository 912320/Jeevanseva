import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem('token');
    return (saved && saved !== 'undefined' && saved !== 'null') ? saved : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token && token !== 'undefined' && token !== 'null') {
        try {
          const res = await authService.getMe();
          const userData = res?.data?.user || res?.data || res?.user;
          setUser(userData);
        } catch (error) {
          console.error('Error loading current user:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } else {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const receivedToken = res?.data?.token || res?.token;
    const receivedUser = res?.data?.user || res?.user;

    if (receivedToken) {
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('token', receivedToken);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    const receivedToken = res?.data?.token || res?.token;
    const receivedUser = res?.data?.user || res?.user;

    if (receivedToken) {
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('token', receivedToken);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateUser = (data) => {
    setUser((prev) => (prev ? { ...prev, ...data } : data));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
