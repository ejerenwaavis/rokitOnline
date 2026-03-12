import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('rokit_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (!data?.token) throw new Error('Invalid response from server');
      localStorage.setItem('rokit_token', data.token);
      localStorage.setItem('rokit_user', JSON.stringify(data));
      setUser(data);
      return { success: true, data };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password, phone });
      localStorage.setItem('rokit_token', data.token);
      localStorage.setItem('rokit_user', JSON.stringify(data));
      setUser(data);
      return { success: true, data };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('rokit_token');
    localStorage.removeItem('rokit_user');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
