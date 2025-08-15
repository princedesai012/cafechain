import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Login user
  login: async (phone, password) => {
    const response = await api.post('/users/login', { phone, password });
    return response.data;
  },

  // Request email OTP
  requestEmailOTP: async (email, phone) => {
    const response = await api.post('/email-otp/request-email-otp', { email, phone });
    return response.data;
  },

  // Verify email OTP
  verifyEmailOTP: async (email, otp, phone) => {
    const response = await api.post('/email-otp/verify-email-otp', { email, otp, phone });
    return response.data;
  },

  // Resend email OTP
  resendEmailOTP: async (email, phone) => {
    const response = await api.post('/email-otp/resend-email-otp', { email, phone });
    return response.data;
  },

  // Get user profile
  getProfile: async (phone) => {
    const response = await api.get(`/users/profile/${phone}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (phone, profileData) => {
    const response = await api.put(`/users/profile/${phone}`, profileData);
    return response.data;
  },

  // Logout (clear token)
  logout: () => {
    localStorage.removeItem('token');
    return api.post('/users/logout');
  },
};

// User API calls
export const userAPI = {
  // Get visit history
  getVisitHistory: async (phone) => {
    const response = await api.get(`/users/history/${phone}`);
    return response.data;
  },

  // Get reward history
  getRewardHistory: async (phone) => {
    const response = await api.get(`/users/rewards/${phone}`);
    return response.data;
  },

  // Get referral chain
  getReferralChain: async (phone) => {
    const response = await api.get(`/users/referral-chain/${phone}`);
    return response.data;
  },

  // Add favorite cafe
  addFavoriteCafe: async (phone, cafeId) => {
    const response = await api.post(`/users/favorites/${phone}`, { cafeId });
    return response.data;
  },

  // Get favorite cafes
  getFavoriteCafes: async (phone) => {
    const response = await api.get(`/users/favorites/${phone}`);
    return response.data;
  },
};

export default api;
