// api/api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
      url: `${API_URL}${endpoint}`,
      data: options.method === 'POST' || options.method === 'PUT' ? data : null,
      headers,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.response?.data?.error || error.message);
    throw error.response?.data?.error || 'API request failed';
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

export const updateProfile = async (phone, data) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };
  const response = await axios.put(`${API_URL}/users/profile/${phone}`, data, { headers, withCredentials: true });
  return response.data;
};

export const changePassword = (phone, body) =>
  apiClient(`/users/profile/${phone}/change-password`, body, { method: 'PUT' });

export default apiClient;