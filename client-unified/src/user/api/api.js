// api/api.js
import axios from 'axios';

// ✅ CRITICAL: Change this line to the full Render URL
const API_URL = 'https://cafechain.onrender.com/api';

const apiClient = async (endpoint, data = {}, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await axios({
      method: options.method || 'GET',
      // ✅ CRITICAL: Change this line to use the API_URL variable
      url: `${API_URL}${endpoint}`,
      data: options.method === 'POST' || options.method === 'PUT' ? data : null,
      headers,
      // withCredentials: true,
    });
    return response.data;
  }catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'API request failed';
    console.error(`API Error on ${endpoint}:`, errorMessage);
    throw errorMessage;
  }
};

// Auth
export const loginUser = (phone, password) => apiClient('/users/login', { phone, password }, { method: 'POST' });
export const registerUser = (data) => apiClient('/users/register', data, { method: 'POST' });
export const requestEmailOtp = (data) => apiClient('/email-otp/request-email-otp', data, { method: 'POST' });
export const verifyEmailOtp = (data) => apiClient('/email-otp/verify-email-otp', data, { method: 'POST' });
export const resendEmailOtp = (data) => apiClient('/email-otp/resend-email-otp', data, { method: 'POST' });
export const logoutUser = () => apiClient('/users/logout', {}, { method: 'POST' });

// Profile
export const getProfile = (phone) => apiClient(`/users/profile/${phone}`, {}, { method: 'GET' });

export const getLeaderboard = () => apiClient('/users/leaderboard', {}, { method: 'GET' });
export const getRewardsHistory = (phone) => apiClient(`/users/rewards/${phone}`, {}, { method: 'GET' }); // NEW FUNCTION


export const updateProfile = (phone, data) => 
  apiClient(`/users/profile/${phone}`, data, { method: 'PUT' });

// Cafes
export const getCafes = () => apiClient('/cafes', {}, { method: 'GET' });
export const getCafeById = (id) => apiClient(`/cafes/${id}`, {}, { method: 'GET' });

// Get cafes available for claiming rewards
export const getRewardCafes = () =>
  apiClient("/rewards/cafes", {}, { method: "GET", withCredentials: true });

// Submit a reward claim
export const claimReward = (formData) =>
  apiClient("/rewards/claim", formData, {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
});

export const getActiveEvents = async () => {
  try {
    // This is already correct
    const response = await fetch('https://cafechain.onrender.com/api/events/active');
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch active events:', error);
    throw error;
  }
};

// cafepoints
export const getUserCafePoints = (phone) =>
  apiClient(`/users/cafe-points/${phone}`, {}, { method: "GET" });

// Invoices
export const getInvoiceHistory = () =>
  apiClient("/rewards/invoice-history", {}, { method: "GET", withCredentials: true });

// Send OTP for forgot password
export const sendForgotPasswordOTP = (mobile) =>
  apiClient("/forgot-password/send-otp", { mobile }, { method: "POST" });

export const changePassword = (phone, body) =>
  apiClient(`/users/profile/${phone}/change-password`, body, { method: 'PUT' });

export default apiClient;