import React, { createContext, useContext, useState, useEffect } from 'react';
import { userData } from '../assets/data';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user data (simulating login)
  useEffect(() => {
    // Simulate API call to get user data
    // TODO: Replace with actual API call when backend is ready
    // Example: const userData = await api.getUserProfile();
    
    setTimeout(() => {
      setUser(userData);
      setLoading(false);
    }, 1000);
  }, []);

  // Login function (now using mobile number)
  const login = async (mobile, password) => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await api.login(mobile, password);
      // const userData = response.data.user;
      
      // For now, simulate successful login with mobile numbers
      const validUsers = [
        { mobile: '9876543210', password: 'password', userData: userData },
        { mobile: '1234567890', password: '123456', userData: {...userData, name: 'Test User', mobile: '1234567890'} }
      ];
      
      const user = validUsers.find(u => u.mobile === mobile && u.password === password);
      if (user) {
        setUser(user.userData);
        return { success: true };
      } else {
        throw new Error('Invalid mobile number or password');
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (signupData) => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await api.signup(signupData);
      // const userData = response.data.user;
      
      // For now, simulate successful signup
      // Check if mobile number already exists (mock check)
      if (signupData.mobile === '9876543210') {
        throw new Error('Mobile number already registered');
      }
      
      // Create new user data
      const newUserData = {
        id: Date.now(), // Mock ID
        name: signupData.name,
        mobile: signupData.mobile,
        email: `user${signupData.mobile}@cafechain.com`, // Generate email
        points: signupData.referralBonus || 0, // Start with referral bonus if any
        tier: 'Bronze',
        visits: 0,
        referralCode: signupData.referralCode || null,
        joinDate: new Date().toISOString()
      };
      
      // Don't auto-login after signup, just return success
      return { success: true, user: newUserData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // TODO: Replace with actual API call
      // await api.logout();
      
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.updateProfile(profileData);
      // const updatedUser = response.data.user;
      
      // For now, simulate profile update
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update user points
  const updatePoints = (newPoints) => {
    setUser(prev => ({ ...prev, points: newPoints }));
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    updatePoints,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 