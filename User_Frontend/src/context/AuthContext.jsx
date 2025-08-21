import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, verifyEmailOtp, logoutUser, getProfile } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always start unauthenticated to force login each time app runs
    localStorage.removeItem('authToken');
    localStorage.removeItem('userPhone');
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  }, []);

  const login = async (phone, password) => {
    try {
      const response = await loginUser(phone, password);
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        if (response.user?.phone) localStorage.setItem('userPhone', response.user.phone);
        setIsAuthenticated(true);
        setUser(response.user); // Assuming the response includes user data
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
        setUser(response.user); // Assuming the response includes user data
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

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    verifyEmail,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};