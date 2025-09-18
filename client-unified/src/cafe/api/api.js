import axios from 'axios';
import toast from 'react-hot-toast';

// Create an Axios instance with default settings
const apiClient = axios.create({
  baseURL: '/api/cafe-owner', // All requests will be prefixed with this
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cafe_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

// --- API Service Functions ---

// Analytics
export const getDashboardAnalytics = () => apiClient.get('/analytics/summary');
export const getLoyaltyMetrics = () => apiClient.get('/analytics/loyalty');
export const getActivityLog = (timeFilter) => {
  return apiClient.get('/activity-log', { params: { filter: timeFilter } });
};

export const getActiveEvents = async () => {
  try {
    // IMPORTANT: Use the full URL to your backend server
    const response = await axios.get('http://localhost:5000/api/events/active');
    return response.data; // Axios wraps the JSON response in a 'data' object
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch events.';
    toast.error(errorMessage);
    throw error;
  }
};

// Redemption
export const initiateRedemption = (customerPhone, pointsToRedeem) => {
  return apiClient.post('/redemption/initiate', { customerPhone, pointsToRedeem });
};

export const verifyRedemption = (otp, customerEmail) => {
  return apiClient.post('/redemption/verify', { otp, customerEmail });
};

export default apiClient;