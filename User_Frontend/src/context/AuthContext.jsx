import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, verifyEmailOtp, logoutUser, getProfile } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const token = localStorage.getItem('authToken');
    const userPhone = localStorage.getItem('userPhone');
    
    if (token && userPhone) {
      setIsAuthenticated(true);
      loadUserProfile(userPhone);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async (phone) => {
    try {
      const userData = await getProfile(phone);
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // Clear invalid session
      localStorage.removeItem('authToken');
      localStorage.removeItem('userPhone');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password) => {
    try {
      const response = await loginUser(phone, password);
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        if (response.user?.phone) localStorage.setItem('userPhone', response.user.phone);
        setIsAuthenticated(true);
        setUser(response.user);
        // Ensure profile is synced/validated after login
        try {
          await loadUserProfile(response.user?.phone || phone);
        } catch {}
        return { success: true };
      }
      return { success: false, error: 'Login failed: no token received' };
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      return { success: false, error: err || 'Login failed' };
    }
  };

  const register = async (data) => {
    try {
      const response = await registerUser(data);
      if (response && response.requiresEmailVerification) {
        return { success: true, requiresEmailVerification: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err) {
      return { success: false, error: err || 'Registration failed' };
    }
  };

  const verifyEmail = async (data) => {
    try {
      const response = await verifyEmailOtp(data);
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        if (response.user?.phone) localStorage.setItem('userPhone', response.user.phone);
        setIsAuthenticated(true);
        setUser(response.user);
        try {
          await loadUserProfile(response.user?.phone || data?.phone);
        } catch {}
        return { success: true };
      }
      return { success: false, error: 'Email verification failed: no token received' };
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      return { success: false, error: err || 'Email verification failed' };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {}
    localStorage.removeItem('authToken');
    localStorage.removeItem('userPhone');
    setIsAuthenticated(false);
    setUser(null);
    return { success: true };
  };

  const updateUserData = (newUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...newUserData }));
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    verifyEmail,
    logout,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
