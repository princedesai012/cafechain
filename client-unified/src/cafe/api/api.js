import axios from 'axios';
import toast from 'react-hot-toast';

// Create an Axios instance with default settings
const apiClient = axios.create({
  // ✅ CRITICAL: Change this baseURL to the full Render URL 'https://cafechain.onrender.com/api/cafe-owner', 
  baseURL: "https://api.cafechain.in/api/cafe-owner",
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
    // This is already correct
    const response = await axios.get('https://api.cafechain.in/api/events/active');
    return response.data; // Axios wraps the JSON response in a 'data' object
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch events.';
    toast.error(errorMessage);
    throw error;
  }
};

export const getCafeProfile = () => apiClient.get('/profile');
export const updateCafeProfile = (profileData) => apiClient.put('/profile', profileData);
export const addCafeImage = (imageData) => apiClient.post('/images/add', { image: imageData });
export const deleteCafeImage = (public_id) => apiClient.post('/images/delete', { public_id });

// Redemption
export const initiateRedemption = (customerPhone, pointsToRedeem) => {
  return apiClient.post('/redemption/initiate', { customerPhone, pointsToRedeem });
};

export const verifyRedemption = (otp, customerEmail) => {
  return apiClient.post('/redemption/verify', { otp, customerEmail });
};

// ✅ CRITICAL: Change this line to the full Render URL
export const getAllCafes = () => axios.get('https://api.cafechain.in/api/cafes');

export default apiClient;