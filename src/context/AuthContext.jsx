import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crm-token'));
  const [isLoading, setIsLoading] = useState(true);

  // Restore session if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (error) {
          console.error('Session restore failed:', error);
          setToken(null);
          localStorage.removeItem('crm-token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      // Assuming backend returns { token, user }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('crm-token', data.token);
      toast.success('Successfully logged in!');
      return data;
    } catch (error) {
      const errRes = error.response?.data;
      const msg = errRes?.errors?.[0]?.message || errRes?.message || 'Login failed';
      toast.error(msg);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await authService.register(name, email, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('crm-token', data.token);
      toast.success('Account created successfully!');
      return data;
    } catch (error) {
      const errRes = error.response?.data;
      const msg = errRes?.errors?.[0]?.message || errRes?.message || 'Registration failed';
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
