// api/api.js
// This file centralizes all backend API calls
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Handles network requests, including error checking and token handling.
 * @param {string} endpoint The API endpoint, e.g., '/users/login'
 * @param {object} options Axios options
 * @returns The response data
 */
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

export const loginUser = async (phone, password) => {
  return apiClient('/users/login', { phone, password }, { method: 'POST' });
};

export const registerUser = async (data) => {
  return apiClient('/users/register', data, { method: 'POST' });
};

export const requestEmailOtp = async (data) => {
  return apiClient('/email-otp/request-email-otp', data, { method: 'POST' });
};

export const verifyEmailOtp = async (data) => {
  return apiClient('/email-otp/verify-email-otp', data, { method: 'POST' });
};

export const resendEmailOtp = async (data) => {
  return apiClient('/email-otp/resend-email-otp', data, { method: 'POST' });
};

// Profile APIs
export const getProfile = async (phone) => {
  return apiClient(`/users/profile/${phone}`, {}, { method: 'GET' });
};

export const updateProfile = async (phone, formData) => {
  // Use raw axios for multipart
  const token = localStorage.getItem('authToken');
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'multipart/form-data',
  };
  const response = await axios.put(`${API_URL}/users/profile/${phone}`, formData, { headers, withCredentials: true });
  return response.data;
};

export const changePassword = async (phone, body) => {
  return apiClient(`/users/profile/${phone}/change-password`, body, { method: 'PUT' });
};

export const logoutUser = async () => {
  return apiClient('/users/logout', {}, { method: 'POST' });
};

// You can export the apiClient directly if you want to make other calls
export default apiClient;