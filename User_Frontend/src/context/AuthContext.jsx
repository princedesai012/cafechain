import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, verifyEmailOtp } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // You could add a call to a backend endpoint here to verify the token
          // For now, we'll just assume a token means the user is authenticated
          setIsAuthenticated(true);
          // In a real app, you would fetch user data here
        }
      } catch (err) {
        console.error('Failed to check auth status:', err);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (phone, password) => {
    try {
      const response = await loginUser(phone, password);
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
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

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
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